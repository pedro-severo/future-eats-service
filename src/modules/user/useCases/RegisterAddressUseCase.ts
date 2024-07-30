import { Service } from 'typedi';
import { UserAddress } from '../entities/UserAddress';
import { AddressResponse } from './interfaces/AddressResponse';
import { mapUserAddressEntityToResponse } from './mappers/mapUserAddressEntityToResponse';
import { UserRepository } from '../repository/UserRepository';
import { USER_ERROR_MESSAGES } from './constants/errorMessages';
import { AuthenticatorManager } from '../../../shared/services/authentication';
import { USER_ROLES } from '../../../shared/services/authentication/interfaces';
import { API_ERROR_MESSAGES } from '../apiErrorMessages';
import { logger } from '../../../logger';

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
    ): Promise<AddressResponse> {
        try {
            logger.info('Registering address...');
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
            return mapUserAddressEntityToResponse(address.getUserAddress());
        } catch (e) {
            logger.error(e);
            if (Object.values(API_ERROR_MESSAGES).includes(e.message))
                throw new Error(e.message);
            throw new Error(
                API_ERROR_MESSAGES.REGISTER_ADDRESS_GENERIC_ERROR_MESSAGE
            );
        }
    }

    private async checkUserExistence(userId: string) {
        const userExist = await this.userRepository.checkUserExistence(userId);
        if (!userExist) {
            logger.error(USER_ERROR_MESSAGES.NOT_FOUND);
            throw new Error(
                API_ERROR_MESSAGES.REGISTER_ADDRESS_GENERIC_ERROR_MESSAGE
            );
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
