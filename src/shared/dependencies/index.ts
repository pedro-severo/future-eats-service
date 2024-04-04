import Container, { Token } from 'typedi';
import { UserRepository } from '../../modules/user/repository/UserRepository';
import { DatabaseContext, DatabaseTestContext } from '../database/context';

export const UserDatabaseToken = new Token<UserRepository>('USER_DATABASE');
export const UserDatabaseTestToken = new Token<UserRepository>(
    'USER_DATABASE_TEST'
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
]);
