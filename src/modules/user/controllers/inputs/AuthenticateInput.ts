import { IsNotEmpty, IsString } from 'class-validator';

export class AuthenticateInput {
    @IsString()
    @IsNotEmpty()
    token!: string;
}
