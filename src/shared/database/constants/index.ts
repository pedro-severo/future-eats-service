import { UserDatabaseToken } from '../../dependencies';
import { IDatabaseContext } from '../interfaces';

export const contextProps: IDatabaseContext = {
    userDatabaseContext: UserDatabaseToken,
};
