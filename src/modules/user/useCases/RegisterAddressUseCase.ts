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
    authenticator: AuthenticatorManager;

    constructor(private userRepository: UserRepository) {
        this.authenticator = new AuthenticatorManager();
    }

    async execute(
        address: UserAddress,
        userId: string,
        token: string
    ): Promise<RegisterAddressResponse> {
        this.checkAuthorization(token, userId);
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

    private checkAuthorization = (token: string, userId: string): void => {
        const { id, role } = this.authenticator.getTokenData(token) || {};
        if (!id || !role)
            throw new Error(USER_ERROR_MESSAGES.TOKEN_DATA_MISSING);
        if (!(userId === id && role === USER_ROLES.USER))
            throw new Error(USER_ERROR_MESSAGES.AUTHORIZATION_ERROR);
    };
}
