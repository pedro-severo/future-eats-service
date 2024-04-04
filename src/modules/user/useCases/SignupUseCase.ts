import { Service } from 'typedi';
import { UserRepository } from '../repository/UserRepository';
import { User } from '../entities/User';
import { SignupResponse } from './interfaces/SignupResponse';
import { AuthenticatorManager } from '../../../shared/services/authentication';
import { USER_ERROR_MESSAGES } from './constants/errorMessages';

@Service()
export class SignupUseCase {
    authenticator: AuthenticatorManager;

    constructor(private userRepository: UserRepository) {
        this.authenticator = new AuthenticatorManager();
    }

    async execute(newUser: User): Promise<SignupResponse> {
        const user = newUser.getUser();
        await this.checkUserExistence(user.email);
        await this.userRepository.createUser(newUser);
        const token = this.authenticator.generateToken({ id: user.id });
        return { user, token };
    }

    private checkUserExistence = async (email: string): Promise<void> => {
        const doesUserExist =
            await this.userRepository.checkUserExistenceByEmail(email);
        if (doesUserExist)
            throw new Error(USER_ERROR_MESSAGES.EMAIL_ALREADY_REGISTERED);
    };
}
