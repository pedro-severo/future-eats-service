import Container, { Service } from 'typedi';
import { UserAddress } from '../entities/UserAddress';
import { RegisterAddressResponse } from './interfaces/RegisterAddressResponse';
import { UserRepository } from '../repository/UserRepository';
import { mapUserAddressEntityToResponse } from '../repository/mappers/mapUserAddressEntityToResponse';

@Service()
export class RegisterAddressUseCase {
    userRepository: UserRepository;

    constructor() {
        this.userRepository = Container.get(UserRepository);
    }

    async execute(
        address: UserAddress,
        userId: string
    ): Promise<RegisterAddressResponse> {
        try {
            const userExist =
                await this.userRepository.checkUserExistence(userId);
            if (!userExist) {
                throw new Error('Failed to register address.');
            }
            await this.userRepository.registerAddress(address, userId);
            await this.userRepository.updateUserAddressFlag(userId, {
                hasAddress: true,
            });
            return mapUserAddressEntityToResponse(address);
        } catch (err) {
            throw new Error(err.message);
        }
    }
}
