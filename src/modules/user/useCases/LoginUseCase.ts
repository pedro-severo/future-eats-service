import { Service } from 'typedi';
import { HashManager } from '../../../shared/services/hash';
import { AuthenticatorManager } from '../../../shared/services/authentication';
import { LoginResponse } from './interfaces/LoginResponse';
import { mapUserEntityToResponse } from './mappers/mapUserEntityToResponse';
import { UserResponse } from './interfaces/UserResponse';
import { UserRepository } from '../repository/UserRepository';
import { USER_ERROR_MESSAGES } from './constants/errorMessages';
import { USER_ROLES } from '../../../shared/services/authentication/interfaces';
import { API_ERROR_MESSAGES } from '../apiErrorMessages';
import { logger } from '../../../logger';

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
            logger.info('Executing login...');
            const user = await this.getUserByEmail(email);
            await this.checkPassword(user, password);
            const token = this.authenticator.generateToken({
                id: user.id,
                role: USER_ROLES.USER,
            });
            return this.formatUseCaseResponse(user, token);
        } catch (e) {
            logger.error(e);
            if (Object.values(API_ERROR_MESSAGES).includes(e.message))
                throw new Error(e.message);
            throw new Error(API_ERROR_MESSAGES.LOGIN_GENERIC_ERROR_MESSAGE);
        }
    }

    getUserByEmail = async (email: string): Promise<UserResponse> => {
        const user = await this.userRepository.getUserByEmail(email);
        if (!user) {
            logger.error(USER_ERROR_MESSAGES.NOT_FOUND);
            throw new Error(API_ERROR_MESSAGES.EMAIL_NOT_REGISTERED);
        }
        return mapUserEntityToResponse(user);
    };

    checkPassword = async (
        user: UserResponse,
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
