export interface AuthenticationData {
    id: string;
    role: string;
}

export enum USER_ROLES {
    USER = 'USER',
    RESTAURANT_OWNER = 'RESTAURANT_OWNER',
}
