import { AuthenticatorManager } from '../../../shared/services/authentication';
import { GetAddressInput } from '../controllers/inputs/GetAddressInput';
import { UserRepository } from '../repository/UserRepository';

export class GetAddressUseCase {
    constructor(
        private userRepository: UserRepository,
        private authenticator: AuthenticatorManager
    ) {}
    async execute(input: GetAddressInput, token: string): Promise<any> {
        console.log('🚀 ~ GetAddressUseCase ~ execute ~ token:', token);
        console.log('🚀 ~ GetAddressUseCase ~ execute ~ input:', input);
    }
}
