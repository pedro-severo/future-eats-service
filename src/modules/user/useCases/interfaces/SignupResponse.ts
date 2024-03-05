export interface SignupResponse {
    user: {
        name: string;
        email: string;
        id: string;
    };
    token: string;
}
