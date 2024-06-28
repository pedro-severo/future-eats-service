import { AuthenticatorManager } from '../../../shared/services/authentication';
import { USER_ROLES } from '../../../shared/services/authentication/interfaces';
import { AuthenticateInput } from '../controllers/inputs/AuthenticateInput';
import { UserRepository } from '../repository/UserRepository';
import { AuthenticateResponse } from './interfaces/AuthenticateResponse';

export class AuthenticateUseCase {
    constructor(
        private userRepository: UserRepository,
        private authenticator: AuthenticatorManager
    ) {}

    execute(input: AuthenticateInput): AuthenticateResponse {
        console.log('🚀 ~ AuthenticateUseCase ~ execute ~ input:', input);
        return {
            isAuthenticated: true,
            role: USER_ROLES.USER,
        };
    }
}
