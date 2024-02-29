import Container, { Service } from "typedi";
import { UserDatabase } from "../database/UserDatabase";
import { User } from "../entities/User";
import { UserResponse } from "../database/interfaces/UserResponse";

@Service()
export class SignupUseCase {
    userDatabase: UserDatabase

    constructor () {
        this.userDatabase = Container.get(UserDatabase)
    }

    async execute(user: User): Promise<UserResponse> {
        try {
            const { email } = user.getUser()
            const doesUserExist = await this.userDatabase.checkUserExistenceByEmail(email)
            if (doesUserExist) throw new Error("This email is already registered.")
            const createdUser = await this.userDatabase.insert(user)
            const userResponse = { 
                email: createdUser.email, 
                name: createdUser.name
            }
            return userResponse
        } catch (err) {
            throw new Error(err)
        }
    }
}