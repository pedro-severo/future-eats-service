import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class GetAddressInput {
    @IsString()
    @IsNotEmpty()
    userId!: string;

    @IsOptional()
    @IsString()
    addressId?: string;
}
