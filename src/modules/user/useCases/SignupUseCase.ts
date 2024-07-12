import { Service } from 'typedi';
import { UserRepository } from '../repository/UserRepository';
import { User } from '../entities/User';
import { SignupResponse } from './interfaces/SignupResponse';
import { AuthenticatorManager } from '../../../shared/services/authentication';
import { USER_ROLES } from '../../../shared/services/authentication/interfaces';
import { API_ERROR_MESSAGES } from '../apiErrorMessages';
import { logger } from '../../../logger';
import { mapUserEntityToResponse } from './mappers/mapUserEntityToResponse';

@Service()
export class SignupUseCase {
    authenticator: AuthenticatorManager;

    constructor(private userRepository: UserRepository) {
        this.authenticator = new AuthenticatorManager();
    }

    async execute(newUser: User): Promise<SignupResponse> {
        try {
            logger.info('Executing signup...');
            const user = newUser.getUser();
            await this.checkUserExistence(user.email);
            await this.userRepository.createUser(newUser);
            const token = this.authenticator.generateToken({
                id: user.id,
                role: user.role || USER_ROLES.USER,
            });
            return {
                user: mapUserEntityToResponse(user),
                token: this.authenticator.removeBearer(token),
            };
        } catch (e) {
            logger.error(e.message);
            if (Object.values(API_ERROR_MESSAGES).includes(e.message))
                throw new Error(e.message);
            throw new Error(API_ERROR_MESSAGES.SIGNUP_GENERIC_ERROR_MESSAGE);
        }
    }

    checkUserExistence = async (email: string): Promise<void> => {
        const doesUserExist =
            await this.userRepository.checkUserExistenceByEmail(email);
        if (doesUserExist)
            throw new Error(API_ERROR_MESSAGES.EMAIL_ALREADY_REGISTERED);
    };
}
