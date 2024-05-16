import Container, { Token } from 'typedi';
import { UserRepository } from '../../modules/user/repository/UserRepository';
import { DatabaseContext, DatabaseTestContext } from '../database/context';
import { AuthenticatorManager } from '../services/authentication';

export const UserDatabaseToken = new Token<UserRepository>('USER_DATABASE');
export const UserDatabaseTestToken = new Token<UserRepository>(
    'USER_DATABASE_TEST'
);
export const AuthenticatorManagerToken = new Token<AuthenticatorManager>(
    'AUTHENTICATOR_MANAGER_TOKEN'
);

Container.set([
    {
        id: UserDatabaseToken,
        value: new UserRepository(Container.get(DatabaseContext)),
    },
    {
        id: UserDatabaseTestToken,
        value: new UserRepository(Container.get(DatabaseTestContext)),
    },
    {
        id: AuthenticatorManagerToken,
        value: Container.get(AuthenticatorManager),
    },
]);
