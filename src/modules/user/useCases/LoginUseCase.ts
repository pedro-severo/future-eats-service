import { Service } from 'typedi';
import { HashManager } from '../../../shared/services/hash';
import { AuthenticatorManager } from '../../../shared/services/authentication';
import { LoginInput } from '../controllers/inputs/LoginInput';
import { LoginResponse } from './interfaces/LoginResponse';
import { mapUserEntityToResponse } from '../repository/mappers/mapUserEntityToResponse';
import { UserResponse } from './interfaces/UserResponse';
import { UserRepository } from '../repository/UserRepository';

@Service()
export class LoginUseCase {
    hashManager: HashManager;
    authenticator: AuthenticatorManager;

    constructor(private userRepository: UserRepository) {
        this.hashManager = new HashManager();
        this.authenticator = new AuthenticatorManager();
    }

    async execute(input: LoginInput): Promise<LoginResponse> {
        try {
            const { email, password } = input;
            const user = await this.getUserByEmail(email);
            await this.checkPassword(user, password);
            const token = this.authenticator.generateToken({ id: user.id });
            return this.formatUseCaseResponse(user, token);
        } catch (err) {
            throw new Error(err.message);
        }
    }

    private getUserByEmail = async (email: string): Promise<UserResponse> => {
        try {
            const user = await this.userRepository.getUserByEmail(email);
            if (!user) throw new Error('User not found.');
            return mapUserEntityToResponse(user);
        } catch (e) {
            throw new Error(e.message);
        }
    };

    private checkPassword = async (
        user: UserResponse,
        passwordToCheck: string
    ): Promise<void> => {
        try {
            const isPasswordCorrect =
                user.password &&
                (await this.hashManager.compare(
                    passwordToCheck,
                    user.password
                ));
            if (!isPasswordCorrect) throw new Error('Incorrect password.');
        } catch (e) {
            throw new Error(e.message);
        }
    };

    private formatUseCaseResponse = (
        user: UserResponse,
        token: string
    ): LoginResponse => {
        return {
            user,
            token: token as string,
        };
    };
}
