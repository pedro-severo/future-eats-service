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

    async checkUserExistenceById(id: string): Promise<boolean> {
        // TODO: implement
        return false
    }  

    async checkUserExistenceByEmail(email: string): Promise<boolean> {
        // TODO: implement
        return false
    }    
}