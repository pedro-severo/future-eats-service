import { logger } from '../../../logger';
import { AuthenticatorManager } from '../../../shared/services/authentication';
import { USER_ROLES } from '../../../shared/services/authentication/interfaces';
import { API_ERROR_MESSAGES } from '../apiErrorMessages';
import { UpdateAddressInput } from '../controllers/inputs/UpdateAddressInput';
import { UserRepository } from '../repository/UserRepository';
import { USER_ERROR_MESSAGES } from './constants/errorMessages';
import { AddressResponse } from './interfaces/AddressResponse';

export class UpdateAddressUseCase {
    constructor(
        private userRepository: UserRepository,
        private authenticator: AuthenticatorManager
    ) {}
    async execute(
        input: UpdateAddressInput,
        token: string
    ): Promise<AddressResponse> {
        try {
            logger.info('Updating address...');
            if (!this.hasAuthorization(token, input.userId))
                throw new Error(USER_ERROR_MESSAGES.UNAUTHORIZED_ERROR);
            const userFound = await this.userRepository.checkUserExistence(
                input.userId
            );
            if (!userFound) throw new Error(USER_ERROR_MESSAGES.NOT_FOUND);
            const address = await this.handleUpdateAddress(input);
            return address;
        } catch (e) {
            logger.error(e.message);
            if (e.message === USER_ERROR_MESSAGES.NOT_FOUND)
                throw new Error(API_ERROR_MESSAGES.USER_NOT_FOUND);
            throw new Error(API_ERROR_MESSAGES.UPDATE_ADDRESS_GENERIC_ERROR);
        }
    }

    private async handleUpdateAddress(
        input: UpdateAddressInput
    ): Promise<AddressResponse> {
        const address = await this.userRepository.updateAddress(
            input.userId,
            input.addressId
        );
        if (!address) {
            throw new Error(USER_ERROR_MESSAGES.ADDRESS_NOT_FOUND);
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
