import Container, { Service } from 'typedi';
import { UserDatabase } from '../database/UserDatabase';
import { User } from '../entities/User';
import { SignupResponse } from './interfaces/SignupResponse';

@Service()
export class SignupUseCase {
    userDatabase: UserDatabase;

    constructor() {
        this.userDatabase = Container.get(UserDatabase);
    }

    async execute(user: User): Promise<SignupResponse> {
        try {
            const { email: emailInput } = user.getUser();
            const doesUserExist =
                await this.userDatabase.checkUserExistenceByEmail(emailInput);
            if (doesUserExist)
                throw new Error('This email is already registered.');
            const { email, name } = await this.userDatabase.createUser(user);
            return { email, name };
        } catch (err) {
            throw new Error(err);
        }
    }
}
