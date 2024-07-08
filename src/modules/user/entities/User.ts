import {
    IsBoolean,
    IsEmail,
    IsNotEmpty,
    IsString,
    MinLength,
} from 'class-validator';
import { USER_ROLES } from '../../../shared/services/authentication/interfaces';

export type UserType = {
    id: string;
    name: string;
    email: string;
    password: string;
    hasAddress: boolean;
    cpf: string;
    role?: USER_ROLES;
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
    private role?: USER_ROLES;

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

    public getUser(): UserType {
        const {
            id,
            name,
            email,
            password,
            cpf,
            hasAddress,
            mainAddressId,
            role,
        } = this;
        return {
            id,
            name,
            email,
            password,
            cpf,
            hasAddress,
            mainAddressId,
            role,
        };
    }

    public setRole(role: USER_ROLES): void {
        this.role = role;
    }
}
