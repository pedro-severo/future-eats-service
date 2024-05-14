// TODO: Test endpoint callings on graphql and see if is necessary to return mainAddressId on UserResponse
export interface UserResponse {
    id: string;
    name: string;
    email: string;
    cpf: string;
    hasAddress: boolean;
    password: string;
    mainAddressId?: string;
}
