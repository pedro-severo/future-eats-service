import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { IsCPF } from 'class-validator-cpf';

export class SignupInput {
    @IsString()
    @IsNotEmpty()
    name!: string;

    @IsString()
    @IsEmail()
    @IsNotEmpty()
    email!: string;

    @IsCPF({ message: 'Failed to check cpf value' })
    cpf!: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(6, {
        message: 'Password is too short',
    })
    password!: string;
}
