import {
    IsBoolean,
    IsEmail,
    IsNotEmpty,
    IsString,
    MinLength,
} from 'class-validator';

export type UserType = {
    id: string;
    name: string;
    email: string;
    password: string;
    hasAddress: boolean;
    cpf: string;
    mainAddressId?: string;
};

export class User {
    @IsString()
    @IsNotEmpty()
    private id: string;

    @IsString()
    @IsNotEmpty()
    private name: string;

    @IsString()
    @IsEmail()
    @IsNotEmpty()
    private email: string;

    @IsString()
    @IsNotEmpty()
    private cpf: string;

    @IsBoolean()
    @IsNotEmpty()
    private hasAddress: boolean;

    @IsString()
    @IsNotEmpty()
    @MinLength(6)
    private password: string;

    @IsString()
    @IsNotEmpty()
    private mainAddressId?: string;

    constructor(
        id: string,
        name: string,
        email: string,
        password: string,
        hasAddress: boolean,
        cpf: string,
        mainAddressId?: string
    ) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.password = password;
        this.cpf = cpf;
        this.hasAddress = hasAddress;
        this.mainAddressId = mainAddressId;
    }

    public getUser(): {
        id: string;
        name: string;
        email: string;
        password: string;
        hasAddress: boolean;
        cpf: string;
        mainAddressId?: string;
    } {
        const { id, name, email, password, cpf, hasAddress, mainAddressId } =
            this;
        return {
            id,
            name,
            email,
            password,
            cpf,
            hasAddress,
            mainAddressId,
        };
    }
}
