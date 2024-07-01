import { AuthenticatorManager } from '../../../shared/services/authentication';
import { AuthenticateInput } from '../controllers/inputs/AuthenticateInput';
import { UserRepository } from '../repository/UserRepository';
import { AuthenticateResponse } from './interfaces/AuthenticateResponse';
import { logger } from '../../../logger';
import { USER_ERROR_MESSAGES } from './constants/errorMessages';
import { API_ERROR_MESSAGES } from '../apiErrorMessages';

export class AuthenticateUseCase {
    constructor(
        private userRepository: UserRepository,
        private authenticator: AuthenticatorManager
    ) {}

    async execute(input: AuthenticateInput): Promise<AuthenticateResponse> {
        try {
            logger.info('Authenticating token...');
            const user = this.authenticator.getTokenData(input.token);
            if (!user) throw new Error(USER_ERROR_MESSAGES.NOT_FOUND);
            const isAuthenticated =
                await this.userRepository.checkUserExistence(user.id);
            // istanbul ignore else
            if (!isAuthenticated)
                throw new Error(
                    API_ERROR_MESSAGES.AUTHENTICATION_ERROR_MESSAGE
                );
            return {
                isAuthenticated,
                role: user.role,
                id: user.id,
            };
        } catch (e) {
            logger.error(e.message);
            throw new Error(API_ERROR_MESSAGES.AUTHENTICATION_ERROR_MESSAGE);
        }
    }
}
