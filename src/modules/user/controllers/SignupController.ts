import { StatusCodes } from 'http-status-codes';
import { plainToClass } from 'class-transformer';
import { ValidationError, validate } from 'class-validator';
import { SignupInput } from './inputs/SignupInput';
import { generateId } from '../../../shared/services/uuid';
import { HashManager } from '../../../shared/services/hash';
import { User } from '../entities/User';
import { SignupUseCase } from '../useCases/SignupUseCase';
import { Output } from './outputs';
import { Service } from 'typedi';
import { SignupResponse } from '../useCases/interfaces/SignupResponse';

// TODO: Refac error handling for all endpoints.
@Service()
export class SignupController {
    constructor(private useCase: SignupUseCase) {}

    async signup(req: SignupInput): Promise<Output<SignupResponse>> {
        try {
            const inputToValidate = plainToClass(SignupInput, req);
            const errors: ValidationError[] = await validate(inputToValidate);
            if (errors.length) {
                throw new Error('Failed to validate input.', { cause: errors });
            }
            const id = generateId();
            const encryptedPassword = new HashManager().hash(req.password);
            const user = new User(
                id,
                req.name,
                req.email,
                encryptedPassword,
                false,
                req.cpf
            );
            const response = await this.useCase.execute(user);
            return {
                status: StatusCodes.CREATED,
                data: response,
            };
        } catch (err) {
            throw new Error(err.message, { cause: err.cause });
        }
    }
}
