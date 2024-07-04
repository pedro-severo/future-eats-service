export interface UserResponse {
    id: string;
    name: string;
    email: string;
    cpf: string;
    hasAddress: boolean;
    // TODO: remove password props of response
    password: string;
    // TODO: add the role prop
}
