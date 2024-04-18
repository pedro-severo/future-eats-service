import { Service } from 'typedi';
import { HashManager } from '../../../shared/services/hash';
import { AuthenticatorManager } from '../../../shared/services/authentication';
import { LoginInput } from '../controllers/inputs/LoginInput';
import { LoginResponse } from './interfaces/LoginResponse';
import { mapUserEntityToResponse } from './mappers/mapUserEntityToResponse';
import { UserResponse } from './interfaces/UserResponse';
import { UserRepository } from '../repository/UserRepository';
import { USER_ERROR_MESSAGES } from './constants/errorMessages';
import { USER_ROLES } from '../../../shared/services/authentication/interfaces';

@Service()
export class LoginUseCase {
    hashManager: HashManager;
    authenticator: AuthenticatorManager;

    constructor(private userRepository: UserRepository) {
        this.hashManager = new HashManager();
        this.authenticator = new AuthenticatorManager();
    }

    async execute(input: LoginInput): Promise<LoginResponse> {
        const { email, password } = input;
        const user = await this.getUserByEmail(email);
        await this.checkPassword(user, password);
        const token = this.authenticator.generateToken({
            id: user.id,
            role: USER_ROLES.RESTAURANT_OWNER,
        });
        return this.formatUseCaseResponse(user, token);
    }

    private getUserByEmail = async (email: string): Promise<UserResponse> => {
        const user = await this.userRepository.getUserByEmail(email);
        if (!user) throw new Error(USER_ERROR_MESSAGES.NOT_FOUND);
        return mapUserEntityToResponse(user);
    };

    private checkPassword = async (
        user: UserResponse,
        passwordToCheck: string
    ): Promise<void> => {
        const isPasswordCorrect =
            user.password &&
            (await this.hashManager.compare(passwordToCheck, user.password));
        if (!isPasswordCorrect)
            throw new Error(USER_ERROR_MESSAGES.INCORRECT_PASSWORD);
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
