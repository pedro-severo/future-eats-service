import { UserResponse } from '../../repository/interfaces/UserResponse';

export interface LoginResponse {
    user: UserResponse;
    token: string;
}
