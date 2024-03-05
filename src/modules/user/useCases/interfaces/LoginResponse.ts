export interface LoginResponse {
    user: {
        name: string;
        email: string;
        id: string;
    };
    token: string;
}
