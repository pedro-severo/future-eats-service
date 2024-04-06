import { IsNotEmpty, IsString } from 'class-validator';

export class GetProfileInput {
    @IsString()
    @IsNotEmpty()
    userId!: string;
}
