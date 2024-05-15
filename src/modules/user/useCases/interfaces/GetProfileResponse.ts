export interface GetProfileResponse {
    id: string;
    name: string;
    email: string;
    cpf: string;
    hasAddress: boolean;
    address: string | null;
}
