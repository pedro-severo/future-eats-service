import { plainToClass } from 'class-transformer';
import { AuthenticateUseCase } from '../useCases/AuthenticateUseCase';
import { AuthenticateResponse } from '../useCases/interfaces/AuthenticateResponse';
import { AuthenticateInput } from './inputs/AuthenticateInput';
import { Output } from './outputs';
import { ValidationError, validate } from 'class-validator';
import { logger } from '../../../logger';
import { API_ERROR_MESSAGES } from '../apiErrorMessages';
import { StatusCodes } from 'http-status-codes';

export class AuthenticateController {
    constructor(private useCase: AuthenticateUseCase) {}

    async authenticate(
        input: AuthenticateInput
    ): Promise<Output<AuthenticateResponse>> {
        try {
            const inputToValidate = plainToClass(AuthenticateInput, input);
            const errors: ValidationError[] = await validate(inputToValidate);
            if (errors.length) {
                logger.error(errors);
                throw new Error(
                    API_ERROR_MESSAGES.AUTHENTICATION_ERROR_MESSAGE
                );
            }
            const response = await this.useCase.execute(input);
            logger.info('🚀 ~ AuthenticateController ~ response:', response);
            logger.info('Authentication success!');
            return {
                status: StatusCodes.ACCEPTED,
                data: response,
            };
        } catch (e) {
            logger.info('🚀 ~ AuthenticateController ~ e:', e);
            throw new Error(e.message);
        }
    }
}
