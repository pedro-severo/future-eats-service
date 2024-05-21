import { plainToClass } from 'class-transformer';
import { GetProfileUseCase } from '../useCases/GetProfileUseCase';
import { GetProfileInput } from './inputs/GetProfileInput';
import { validate, ValidationError } from 'class-validator';
import { Output } from './outputs';
import { StatusCodes } from 'http-status-codes';
import { GetProfileResponse } from '../useCases/interfaces/GetProfileResponse';

export class GetProfileController {
    constructor(private useCase: GetProfileUseCase) {}
    async getProfile(
        input: GetProfileInput,
        token: string
    ): Promise<Output<GetProfileResponse>> {
        try {
            const inputToValidate = plainToClass(GetProfileInput, input);
            const errors: ValidationError[] = await validate(inputToValidate);
            if (errors.length) {
                throw new Error('Failed to validate input.', { cause: errors });
            }
            const response = await this.useCase.execute(input, token);
            return {
                status: StatusCodes.ACCEPTED,
                data: response,
            };
        } catch (err) {
            console.log('🚀 ~ GetProfileController:', err.message);
            throw new Error(err.message, { cause: err.cause });
        }
    }
}
