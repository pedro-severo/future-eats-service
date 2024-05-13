import { Service } from 'typedi';
import { Database } from '../../../shared/database';
import { DatabaseContext } from '../../../shared/database/context';
import { User } from '../entities/User';
import { USER_COLLECTIONS } from './interfaces';
import { UserAddress } from '../entities/UserAddress';

@Service()
export class UserRepository extends Database {
    constructor(databaseContext: DatabaseContext) {
        super(databaseContext.getContext());
    }

    // istanbul ignore next
    protected getCollectionName(): USER_COLLECTIONS {
        // istanbul ignore next
        return USER_COLLECTIONS.USERS;
    }

    async checkUserExistenceByEmail(email: string): Promise<boolean> {
        return await this.checkDataExistenceByField('email', email);
    }

    async checkUserExistence(id: string): Promise<boolean> {
        return await this.checkDataExistence(id);
    }

    async getUserByEmail(email: string): Promise<User | void> {
        const user = await this.getDataByField('email', email);
        if (user) {
            const { id, name, email, password, hasAddress, cpf } = user;
            return new User(id, name, email, password, hasAddress, cpf);
        }
    }

    async createUser(user: User): Promise<void> {
        return await this.insert(user);
    }

    async registerAddress(
        userAddress: UserAddress,
        userId: string
    ): Promise<void> {
        return await this.insertSubCollectionItem(
            USER_COLLECTIONS.USER_ADDRESS,
            userId,
            userAddress
        );
    }

    async updateUserAddressFlag(
        userId: string,
        flag: { hasAddress: boolean }
    ): Promise<void> {
        const { hasAddress } = flag;
        return await this.update(userId, { hasAddress });
    }

    async setMainAddressId(userId: string, addressId: string): Promise<void> {
        return await this.update(userId, { mainAddressId: addressId });
    }
}
