import { Service } from 'typedi';
import { Database } from '../../../shared/database';
import { User } from '../entities/User';
import { UserResponse } from './interfaces/UserResponse';
import { mapUserEntityToResponse } from './mappers/mapUserEntityToResponse';

const usersCollectionName = 'users';

@Service()
export class UserRepository extends Database {
    constructor() {
        super();
    }

    // istanbul ignore next
    protected getCollectionName(): string {
        // istanbul ignore next
        return usersCollectionName;
    }

    async checkUserExistenceByEmail(email: string): Promise<boolean> {
        const doesUserExist = await this.checkDataExistence('email', email);
        return doesUserExist;
    }

    async getUserByEmail(email: string): Promise<UserResponse> {
        const { id, name, password, hasAddress, cpf } =
            await this.getDataByField('email', email);
        const user = new User(id, name, email, password, hasAddress, cpf);
        return mapUserEntityToResponse(user);
    }

    async createUser(user: User): Promise<void> {
        await this.insert(user);
    }
}
