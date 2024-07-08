import { UserType } from '../../entities/User';
import { UserResponse } from '../interfaces/UserResponse';

export const mapUserEntityToResponse = (user: UserType): UserResponse => {
    const { name, email, cpf, hasAddress, id, role } = user;
    return {
        name,
        email,
        cpf,
        hasAddress,
        id,
        role,
    };
};
