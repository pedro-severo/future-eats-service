import { Service } from 'typedi';
import { UserAddress } from '../entities/UserAddress';
import { RegisterAddressResponse } from './interfaces/RegisterAddressResponse';
import { mapUserAddressEntityToResponse } from './mappers/mapUserAddressEntityToResponse';
import { UserRepository } from '../repository/UserRepository';
import { USER_ERROR_MESSAGES } from './constants/errorMessages';

// TODO: define and implement RN to handle with addressId updating (userRepository.setMainAddressId calling)

@Service()
export class RegisterAddressUseCase {
    constructor(private userRepository: UserRepository) {}

    async execute(
        address: UserAddress,
        userId: string
    ): Promise<RegisterAddressResponse> {
        const userExist = await this.userRepository.checkUserExistence(userId);
        if (!userExist) {
            throw new Error(USER_ERROR_MESSAGES.FAILED_TO_REGISTER_ADDRESS);
        }
        await this.userRepository.registerAddress(address, userId);
        await this.userRepository.updateUserAddressFlag(userId, {
            hasAddress: true,
        });
        const { id } = address.getUserAddress();
        await this.userRepository.setMainAddressId(userId, id);
        return mapUserAddressEntityToResponse(address);
    }
}
