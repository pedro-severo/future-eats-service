import { Service } from 'typedi';
import { Database } from '../../../shared/database';
import { User } from '../entities/User';
import { UserResponse } from './interfaces/UserResponse';
import { mapUserDTOToUserResponse } from './mappers/mapUserDTOToUserResponse';

const usersCollectionName = 'users';

@Service()
export class UserDatabase extends Database {
    constructor() {
        super();
    }

    protected getCollectionName(): string {
        return usersCollectionName;
    }

    async checkUserExistenceByEmail(email: string): Promise<boolean> {
        const doesUserExist = await this.checkDataExistence('email', email);
        return doesUserExist;
    }

    async getUserByEmail(email: string): Promise<UserResponse> {
        const userDTO = await this.getDataByField('email', email);
        return mapUserDTOToUserResponse(userDTO);
    }

    async createUser(user: User): Promise<UserResponse> {
        const userDTO = await this.insert(user);
        return mapUserDTOToUserResponse(userDTO);
    }
}
