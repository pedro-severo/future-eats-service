import { Service } from 'typedi';
import { HashManager } from '../../../shared/services/hash';
import { AuthenticatorManager } from '../../../shared/services/authentication';
import { LoginResponse } from './interfaces/LoginResponse';
import { mapUserEntityToResponse } from './mappers/mapUserEntityToResponse';
import { UserRepository } from '../repository/UserRepository';
import { USER_ERROR_MESSAGES } from './constants/errorMessages';
import { USER_ROLES } from '../../../shared/services/authentication/interfaces';
import { API_ERROR_MESSAGES } from '../apiErrorMessages';
import { logger } from '../../../logger';
import { UserType } from '../entities/User';

@Service()
export class LoginUseCase {
    hashManager: HashManager;
    authenticator: AuthenticatorManager;

    constructor(private userRepository: UserRepository) {
        this.hashManager = new HashManager();
        this.authenticator = new AuthenticatorManager();
    }

    async execute(email: string, password: string): Promise<LoginResponse> {
        try {
            // TODO: Create a pattern to these messages,
            //       should print email and other inputs in other endpoints
            logger.info('Executing login...');
            const user = await this.getUserByEmail(email);
            await this.checkPassword(user, password);
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

            if (Object.values(API_ERROR_MESSAGES).includes(e.message)) {
                throw new Error(e.message);
            }
            throw new Error(API_ERROR_MESSAGES.LOGIN_GENERIC_ERROR_MESSAGE);
        }
    }

    getUserByEmail = async (email: string): Promise<UserType> => {
        const user = await this.userRepository.getUserByEmail(email);
        if (!user) {
            logger.error(USER_ERROR_MESSAGES.NOT_FOUND);
            throw new Error(API_ERROR_MESSAGES.EMAIL_NOT_REGISTERED);
        }
        return user.getUser();
    };

    checkPassword = async (
        user: UserType,
        passwordToCheck: string
    ): Promise<void> => {
        const isPasswordCorrect =
            user.password &&
            (await this.hashManager.compare(passwordToCheck, user.password));
        if (!isPasswordCorrect) {
            logger.error(USER_ERROR_MESSAGES.INCORRECT_PASSWORD);
            throw new Error(API_ERROR_MESSAGES.INCORRECT_PASSWORD);
        }
    };
}
