import { plainToClass } from 'class-transformer';
import { GetProfileUseCase } from '../useCases/GetProfileUseCase';
import { GetProfileInput } from './inputs/GetProfileInput';
import { validate, ValidationError } from 'class-validator';
import { Output } from './outputs';
import { StatusCodes } from 'http-status-codes';
import { GetProfileResponse } from '../useCases/interfaces/GetProfileResponse';
import { logger } from '../../../logger';
import { API_ERROR_MESSAGES } from '../apiErrorMessages';

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
                logger.error(errors);
                throw new Error(API_ERROR_MESSAGES.GET_PROFILE_GENERIC_MESSAGE);
            }
            const response = await this.useCase.execute(input, token);
            logger.info('Get profile success!');
            return {
                status: StatusCodes.ACCEPTED,
                data: response,
            };
        } catch (err) {
            throw new Error(err.message);
        }
    }
}
