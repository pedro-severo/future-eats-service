import { IsNotEmpty, IsString } from 'class-validator';

export class GetAddressInput {
    @IsString()
    @IsNotEmpty()
    userId!: string;
}
