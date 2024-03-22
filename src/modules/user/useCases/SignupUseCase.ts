import { Service } from 'typedi';
import { UserRepository } from '../repository/UserRepository';
import { User } from '../entities/User';
import { SignupResponse } from './interfaces/SignupResponse';
import { AuthenticatorManager } from '../../../shared/services/authentication';

@Service()
export class SignupUseCase {
    authenticator: AuthenticatorManager;

    constructor(private userDatabase: UserRepository) {
        this.authenticator = new AuthenticatorManager();
    }

    async execute(newUser: User): Promise<SignupResponse> {
        try {
            const user = newUser.getUser();
            await this.checkUserExistence(user.email);
            await this.userDatabase.createUser(newUser);
            const token = this.authenticator.generateToken({ id: user.id });
            // TODO: call mapFunction here... see registerAddress endpoint
            return { user, token };
        } catch (err) {
            throw new Error(err.message);
        }
    }

    private checkUserExistence = async (email: string): Promise<void> => {
        try {
            const doesUserExist =
                await this.userDatabase.checkUserExistenceByEmail(email);
            if (doesUserExist)
                throw new Error('This email is already registered.');
        } catch (e) {
            throw new Error(e.message);
        }
    };
}
