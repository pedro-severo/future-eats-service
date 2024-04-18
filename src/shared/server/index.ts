import { Token } from 'typedi';
import { UserRepository } from '../../modules/user/repository/UserRepository';
import { UserDatabaseToken } from '../dependencies';

// @ts-expect-error apollo-server callback
export const getServerContext = (req): IServerContext => {
    const token = req?.headers?.authorization || '';
    return { auth: { token }, userDatabaseContext: UserDatabaseToken };
};

export interface IServerContext {
    userDatabaseContext: Token<UserRepository>;
    auth: {
        token: string;
    };
}
