import { Token } from 'typedi';
import { UserRepository } from '../../../modules/user/repository/UserRepository';

export interface IDatabaseContext {
    userDatabaseContext?: Token<UserRepository>;
}
