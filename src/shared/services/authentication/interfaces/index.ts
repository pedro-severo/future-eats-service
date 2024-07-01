export interface AuthenticationData {
    id: string;
    role: USER_ROLES;
}

export enum USER_ROLES {
    USER = 'USER',
    RESTAURANT_OWNER = 'RESTAURANT_OWNER',
}
