import { UserResponse } from '../../database/interfaces/UserResponse';
export interface SignupResponse {
    user: UserResponse;
    token: string;
}
