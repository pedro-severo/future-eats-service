import { Service } from 'typedi';
import { UserAddress } from '../entities/UserAddress';
import { RegisterAddressResponse } from './interfaces/RegisterAddressResponse';
import { mapUserAddressEntityToResponse } from './mappers/mapUserAddressEntityToResponse';
import { UserRepository } from '../repository/UserRepository';
import { USER_ERROR_MESSAGES } from './constants/errorMessages';
import { AuthenticatorManager } from '../../../shared/services/authentication';
import { USER_ROLES } from '../../../shared/services/authentication/interfaces';

@Service()
export class RegisterAddressUseCase {
    constructor(
        private userRepository: UserRepository,
        private authenticator: AuthenticatorManager
    ) {}

    async execute(
        address: UserAddress,
        userId: string,
        token: string
    ): Promise<RegisterAddressResponse> {
        if (!this.hasAuthorization(token, userId))
            throw new Error(USER_ERROR_MESSAGES.UNAUTHORIZED_ERROR);
        await this.checkUserExistence(userId);
        await this.userRepository.registerAddress(address, userId);
        await this.userRepository.updateUserAddressFlag(userId, {
            hasAddress: true,
        });
        const { id } = address.getUserAddress();
        // TODO: define and implement RN to handle with addressId updating (userRepository.setMainAddressId calling)
        await this.userRepository.setMainAddressId(userId, id);
        return mapUserAddressEntityToResponse(address);
    }

    private async checkUserExistence(userId: string) {
        const userExist = await this.userRepository.checkUserExistence(userId);
        if (!userExist) {
            throw new Error(USER_ERROR_MESSAGES.FAILED_TO_REGISTER_ADDRESS);
        }
    }

    private hasAuthorization(token: string, idToCheck: string): boolean {
        try {
            return this.authenticator.checkToken(
                token,
                idToCheck,
                USER_ROLES.USER
            );
        } catch (e) {
            throw new Error(USER_ERROR_MESSAGES.AUTHORIZATION_CHECKING_ERROR);
        }
    }
}
