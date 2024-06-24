import { plainToClass } from 'class-transformer';
import { LoginInput } from './inputs/LoginInput';
import { ValidationError, validate } from 'class-validator';
import { StatusCodes } from 'http-status-codes';
import { LoginUseCase } from '../useCases/LoginUseCase';
import { Output } from './outputs';
import { Service } from 'typedi';
import { LoginResponse } from '../useCases/interfaces/LoginResponse';
import xss from 'xss';
import { API_ERROR_MESSAGES } from '../apiErrorMessages';
import { logger } from '../../../logger';

@Service()
export class LoginController {
    constructor(private useCase: LoginUseCase) {}

    async login(req: LoginInput): Promise<Output<LoginResponse>> {
        try {
            const inputToValidate = plainToClass(LoginInput, req);
            const errors: ValidationError[] = await validate(inputToValidate);
            if (errors.length) {
                logger.error(errors);
                throw new Error(API_ERROR_MESSAGES.LOGIN_GENERIC_ERROR_MESSAGE);
            }
            const response = await this.useCase.execute(
                xss(req.email),
                xss(req.password)
            );
            return {
                status: StatusCodes.OK,
                data: response,
            };
        } catch (err) {
            throw new Error(err.message);
        }
    }
}
