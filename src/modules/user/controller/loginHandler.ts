import { plainToClass } from 'class-transformer';
import { LoginInput } from './inputs/LoginInput';
import { ValidationError, validate } from 'class-validator';
import { StatusCodes } from 'http-status-codes';
import Container from 'typedi';
import { LoginUseCase } from '../useCases/LoginUseCase';
import { Output } from './outputs';
import { LoginResponse } from '../useCases/interfaces/LoginResponse';

// TODO: Refa error handling for all endpoints.
export const loginHandler = async (
    req: LoginInput
): Promise<Output<LoginResponse>> => {
    try {
        const inputToValidate = plainToClass(LoginInput, req);
        const errors: ValidationError[] = await validate(inputToValidate);
        if (errors.length) {
            throw new Error('Failed to validate input.');
        }
        const useCase = Container.get(LoginUseCase);
        const response = await useCase.execute(req);
        return {
            status: StatusCodes.ACCEPTED,
            data: response,
        };
    } catch (err) {
        throw new Error(err.message);
    }
};
