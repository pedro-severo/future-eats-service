import { UserResponse } from './UserResponse';

export interface SignupResponse {
    user: UserResponse;
    token: string;
}
