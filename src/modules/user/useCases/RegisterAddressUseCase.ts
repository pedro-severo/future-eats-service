import { Service } from 'typedi';
import { UserAddress } from '../entities/UserAddress';
import { RegisterAddressResponse } from './interfaces/RegisterAddressResponse';
import { mapUserAddressEntityToResponse } from './mappers/mapUserAddressEntityToResponse';
import { UserRepository } from '../repository/UserRepository';
import { USER_ERROR_MESSAGES } from './constants/errorMessages';
import { AuthenticatorManager } from '../../../shared/services/authentication';

@Service()
export class RegisterAddressUseCase {
    authenticator: AuthenticatorManager;

    constructor(private userRepository: UserRepository) {
        this.authenticator = new AuthenticatorManager();
    }

    async execute(
        address: UserAddress,
        userId: string,
        token: string
    ): Promise<RegisterAddressResponse> {
        const a = this.authenticator.getTokenData(token);
        // TODO: Study how to manage roles on authorization accesses
        console.log('🚀 ~ RegisterAddressUseCase ~ a:', a);
        const userExist = await this.userRepository.checkUserExistence(userId);
        if (!userExist) {
            throw new Error(USER_ERROR_MESSAGES.FAILED_TO_REGISTER_ADDRESS);
        }
        await this.userRepository.registerAddress(address, userId);
        await this.userRepository.updateUserAddressFlag(userId, {
            hasAddress: true,
        });
        return mapUserAddressEntityToResponse(address);
    }
}
