import { Service } from 'typedi';
import { Database } from '../../../shared/database';
import { User } from '../entities/User';
import { USER_COLLECTIONS } from './interfaces';
import { UserAddress } from '../entities/UserAddress';

@Service()
export class UserDatabase extends Database {
    constructor() {
        super();
    }

    protected getCollectionName(): USER_COLLECTIONS {
        return USER_COLLECTIONS.USER;
    }

    async checkUserExistenceByEmail(email: string): Promise<boolean> {
        return await this.checkDataExistenceByField('email', email);
    }

    async checkUserExistence(id: string): Promise<boolean> {
        return await this.checkDataExistence(id);
    }

    async getUserByEmail(email: string): Promise<User> {
        const { id, name, password, hasAddress, cpf } =
            await this.getDataByField('email', email);
        return new User(id, name, email, password, hasAddress, cpf);
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
}
