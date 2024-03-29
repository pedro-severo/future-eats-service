import { plainToClass } from 'class-transformer';
import { LoginInput } from './inputs/LoginInput';
import { ValidationError, validate } from 'class-validator';
import { StatusCodes } from 'http-status-codes';
import { LoginUseCase } from '../useCases/LoginUseCase';
import { Output } from './outputs';
import { Service } from 'typedi';
import { LoginResponse } from '../useCases/interfaces/LoginResponse';

// TODO: Refac error handling for all endpoints.
@Service()
export class LoginController {
    constructor(private useCase: LoginUseCase) {}

    async login(req: LoginInput): Promise<Output<LoginResponse>> {
        try {
            const inputToValidate = plainToClass(LoginInput, req);
            const errors: ValidationError[] = await validate(inputToValidate);
            if (errors.length) {
                throw new Error('Failed to validate input.', { cause: errors });
            }
            const response = await this.useCase.execute(req);
            return {
                status: StatusCodes.OK,
                data: response,
            };
        } catch (err) {
            throw new Error(err.message, { cause: err.cause });
        }
    }
}
