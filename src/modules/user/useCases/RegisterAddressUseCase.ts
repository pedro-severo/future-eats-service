import Container, { Service } from 'typedi';
import { UserDatabase } from '../database/UserDatabase';
import { UserAddress } from '../entities/UserAddress';
import { RegisterAddressResponse } from './interfaces/RegisterAddressResponse';
import { mapUserAddressEntityToResponse } from '../database/mappers/mapUserAddressEntityToResponse';

@Service()
export class RegisterAddressUseCase {
    userDatabase: UserDatabase;

    constructor() {
        this.userDatabase = Container.get(UserDatabase);
    }

    async execute(
        address: UserAddress,
        userId: string
    ): Promise<RegisterAddressResponse> {
        try {
            const userExist =
                await this.userDatabase.checkUserExistence(userId);
            if (!userExist) {
                throw new Error('Failed to register address.');
            }
            await this.userDatabase.registerAddress(address, userId);
            await this.userDatabase.updateUserAddressFlag(userId, {
                hasAddress: true,
            });
            return mapUserAddressEntityToResponse(address);
        } catch (err) {
            throw new Error(err.message);
        }
    }
}
