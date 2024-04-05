import { User } from '../../entities/User';
import { UserResponse } from '../interfaces/UserResponse';

export const mapUserEntityToResponse = (user: User): UserResponse => {
    const { name, email, cpf, hasAddress, password, id } = user.getUser();
    return {
        name,
        email,
        cpf,
        hasAddress,
        password,
        id,
    };
};
