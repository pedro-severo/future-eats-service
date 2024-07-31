import { logger } from '../../../logger';
import { AuthenticatorManager } from '../../../shared/services/authentication';
import { USER_ROLES } from '../../../shared/services/authentication/interfaces';
import { API_ERROR_MESSAGES } from '../apiErrorMessages';
import { GetAddressInput } from '../controllers/inputs/GetAddressInput';
import { User } from '../entities/User';
import { UserAddressType } from '../entities/UserAddress';
import { UserRepository } from '../repository/UserRepository';
import { USER_ERROR_MESSAGES } from './constants/errorMessages';
import { AddressResponse } from './interfaces/AddressResponse';
import { mapUserAddressEntityToResponse } from './mappers/mapUserAddressEntityToResponse';

export class GetAddressUseCase {
    constructor(
        private userRepository: UserRepository,
        private authenticator: AuthenticatorManager
    ) {}

    async execute(
        input: GetAddressInput,
        token: string
    ): Promise<AddressResponse> {
        try {
            logger.info('Getting address...');
            if (!this.hasAuthorization(token, input.userId))
                throw new Error(USER_ERROR_MESSAGES.UNAUTHORIZED_ERROR);
            const userFound = await this.userRepository.checkUserExistence(
                input.userId
            );
            if (!userFound) throw new Error(USER_ERROR_MESSAGES.NOT_FOUND);
            const address = await this.handleGetAddress(
                input.userId,
                input.addressId
            );
            return address;
        } catch (e) {
            logger.error(e.message);
            if (e.message === USER_ERROR_MESSAGES.NOT_FOUND)
                throw new Error(API_ERROR_MESSAGES.USER_NOT_FOUND);
            if (e.message === USER_ERROR_MESSAGES.USER_WITHOUT_ADDRESS)
                throw new Error(API_ERROR_MESSAGES.USER_WITHOUT_ADDRESS);
            throw new Error(API_ERROR_MESSAGES.GET_ADDRESS_GENERIC_MESSAGE);
        }
    }

    private async handleGetAddress(
        userId: string,
        addressId?: string
    ): Promise<AddressResponse> {
        if (addressId) {
            const address = await this.getAddress(userId, addressId);
            return mapUserAddressEntityToResponse(address);
        }
        const user = await this.userRepository.getUser(userId);
        const { mainAddressId } = (user as User).getUser();
        if (!mainAddressId)
            throw new Error(USER_ERROR_MESSAGES.USER_WITHOUT_ADDRESS);
        const address = await this.getAddress(userId, mainAddressId);
        return mapUserAddressEntityToResponse(address);
    }

    private async getAddress(
        userId: string,
        addressId: string
    ): Promise<UserAddressType> {
        const address = await this.userRepository.getAddress(userId, addressId);
        if (!address) {
            throw new Error(USER_ERROR_MESSAGES.USER_WITHOUT_ADDRESS);
        }
        return address.getUserAddress();
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
