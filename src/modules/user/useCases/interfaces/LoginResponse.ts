import { UserResponse } from './UserResponse';

export interface LoginResponse {
    user: UserResponse;
    token: string;
}
