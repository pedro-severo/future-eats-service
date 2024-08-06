import { AuthenticatorManager } from '../../../shared/services/authentication';
import { UserRepository } from '../repository/UserRepository';

export class UpdateAddressUseCase {
    constructor(
        private userRepository: UserRepository,
        private authenticator: AuthenticatorManager
    ) {}
    execute() {}
}
