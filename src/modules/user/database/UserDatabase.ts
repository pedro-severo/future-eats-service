import { Service } from "typedi";
import { UserResponse } from './interfaces/UserResponse';
import { Database } from "../../../shared/database";

const usersCollectionName = 'users'

@Service()
export class UserDatabase extends Database {
    constructor() {
        super()
    }

    protected getCollectionName(): string {
        return usersCollectionName;
    }

    async checkUserExistenceByEmail(email: string): Promise<boolean> {
        const snapshot = await this.db.where('email', '==', email).get()
        return !snapshot.empty
    }    
}