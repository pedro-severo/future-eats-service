import Container, { Service } from 'typedi';
import { UserDatabase } from '../database/UserDatabase';
import { User } from '../entities/User';
import { SignupResponse } from './interfaces/SignupResponse';
import { AuthenticatorManager } from '../../../shared/services/authentication';

@Service()
export class SignupUseCase {
    userDatabase: UserDatabase;
    authenticator: AuthenticatorManager;

    constructor() {
        this.userDatabase = Container.get(UserDatabase);
        this.authenticator = new AuthenticatorManager();
    }

    async execute(user: User): Promise<SignupResponse> {
        try {
            const { email, name, id } = user.getUser();
            const doesUserExist =
                await this.userDatabase.checkUserExistenceByEmail(email);
            if (doesUserExist)
                throw new Error('This email is already registered.');
            await this.userDatabase.createUser(user);
            const token = this.authenticator.generateToken({ id });
            return { user: { email, name, id }, token };
        } catch (err) {
            throw new Error(err);
        }
    }
}
