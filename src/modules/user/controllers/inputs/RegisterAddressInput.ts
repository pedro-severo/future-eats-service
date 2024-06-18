import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class RegisterAddressInput {
    @IsString()
    @IsNotEmpty()
    userId!: string;

    @IsString()
    @IsNotEmpty()
    city!: string;

    @IsString()
    @IsOptional()
    complement?: string;

    @IsString()
    @IsNotEmpty()
    state!: string;

    @IsString()
    @IsNotEmpty()
    streetName!: string;

    @IsString()
    @IsNotEmpty()
    streetNumber!: string;

    @IsString()
    @IsNotEmpty()
    zone!: string;
}
