import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateAddressInput {
    @IsString()
    @IsNotEmpty()
    userId!: string;

    @IsString()
    @IsNotEmpty()
    addressId!: string;

    @IsString()
    @IsOptional()
    city?: string;

    @IsString()
    @IsOptional()
    complement?: string;

    @IsString()
    @IsOptional()
    state?: string;

    @IsString()
    @IsOptional()
    streetName?: string;

    @IsString()
    @IsOptional()
    streetNumber?: string;

    @IsString()
    @IsOptional()
    zone?: string;
}
