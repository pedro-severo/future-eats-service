import { Service } from 'typedi';
import { Database } from '../../../shared/database';

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
}
