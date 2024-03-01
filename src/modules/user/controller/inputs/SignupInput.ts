import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class SignupInput {
    @IsString()
    @IsNotEmpty()
    name!: string;

    @IsString()
    @IsEmail()
    @IsNotEmpty()
    email!: string;

    // TODO: Create custom cpf validation
    @IsString()
    @IsNotEmpty()
    cpf!: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(6, {
        message: 'Password is too short',
    })
    password!: string;
}
