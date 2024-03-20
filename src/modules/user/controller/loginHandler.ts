import { plainToClass } from 'class-transformer';
import { LoginInput } from './inputs/LoginInput';
import { ValidationError, validate } from 'class-validator';
import { StatusCodes } from 'http-status-codes';
import { LoginUseCase } from '../useCases/LoginUseCase';
import { LoginOutput } from './outputs';
import { Service } from 'typedi';

// TODO: Refa error handling for all endpoints.
@Service()
export class LoginHandler {
    constructor(private useCase: LoginUseCase) {}

    async login(req: LoginInput): Promise<LoginOutput> {
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
