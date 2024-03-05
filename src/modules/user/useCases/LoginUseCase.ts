import Container, { Service } from 'typedi';
import { UserDatabase } from '../database/UserDatabase';
import { HashManager } from '../../../shared/services/hash';
import { AuthenticatorManager } from '../../../shared/services/authentication';
import { LoginInput } from '../controller/inputs/LoginInput';
import { LoginResponse } from './interfaces/LoginResponse';

@Service()
export class LoginUseCase {
    userDatabase: UserDatabase;
    hashManager: HashManager;
    authenticator: AuthenticatorManager;

    constructor() {
        this.userDatabase = Container.get(UserDatabase);
        this.hashManager = new HashManager();
        this.authenticator = new AuthenticatorManager();
    }

    // TODO: isolate some stuff in methods
    async execute(input: LoginInput): Promise<LoginResponse> {
        try {
            const { email, password } = input;
            const user = await this.userDatabase.getUserByEmail(email);
            if (!user) throw new Error('User not found.');
            const isPasswordCorrect =
                user.password &&
                (await this.hashManager.compare(password, user.password));
            if (!isPasswordCorrect) throw new Error('Incorrect password.');
            const token =
                user.id && this.authenticator.generateToken({ id: user.id });
            return {
                user: {
                    name: user.name,
                    email: user.email,
                    id: user.id,
                },
                token: token as string,
            };
        } catch (err) {
            throw new Error(err);
        }
    }
}
