import { USER_ROLES } from '../../../../shared/services/authentication/interfaces';

export interface AuthenticateResponse {
    isAuthenticated: boolean;
    role: USER_ROLES;
    id: string;
}
