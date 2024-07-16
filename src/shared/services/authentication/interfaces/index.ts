export interface AuthenticationData {
    id: string;
    role: USER_ROLES;
}

// TODO: rename 'USER' to 'COMMON_USER'
export enum USER_ROLES {
    USER = 'USER',
    RESTAURANT_OWNER = 'RESTAURANT_OWNER',
}
