import { Service } from 'typedi';
import { UserAddress } from '../entities/UserAddress';
import { RegisterAddressResponse } from './interfaces/RegisterAddressResponse';
import { mapUserAddressEntityToResponse } from '../repository/mappers/mapUserAddressEntityToResponse';
import { UserRepository } from '../repository/UserRepository';

@Service()
export class RegisterAddressUseCase {
    constructor(private userRepository: UserRepository) {}

    async execute(
        address: UserAddress,
        userId: string
    ): Promise<RegisterAddressResponse> {
        const userExist = await this.userRepository.checkUserExistence(userId);
        if (!userExist) {
            throw new Error('Failed to register address.');
        }
        await this.userRepository.registerAddress(address, userId);
        await this.userRepository.updateUserAddressFlag(userId, {
            hasAddress: true,
        });
        return mapUserAddressEntityToResponse(address);
    }
}
