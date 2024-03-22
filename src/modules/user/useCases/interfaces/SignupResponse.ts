import { UserResponse } from '../../repository/interfaces/UserResponse';
export interface SignupResponse {
    user: UserResponse;
    token: string;
}
