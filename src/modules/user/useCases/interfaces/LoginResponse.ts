import { UserResponse } from '../../database/interfaces/UserResponse';

export interface LoginResponse {
    user: UserResponse;
    token: string;
}
