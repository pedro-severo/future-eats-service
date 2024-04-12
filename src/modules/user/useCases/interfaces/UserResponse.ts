import { UserAddress } from '../../entities/UserAddress';

export interface UserResponse {
    id: string;
    name: string;
    email: string;
    cpf: string;
    hasAddress: boolean;
    password: string;
    address?: UserAddress;
}
