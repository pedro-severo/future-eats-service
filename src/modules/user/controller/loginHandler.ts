import { plainToClass } from 'class-transformer';
import { LoginInput } from './inputs/LoginInput';
import { ValidationError, validate } from 'class-validator';
import { StatusCodes } from 'http-status-codes';
import Container from 'typedi';
import { LoginUseCase } from '../useCases/LoginUseCase';
import { LoginOutput } from './outputs';

// TODO: Reface error handling with all endpoint.
export const loginHandler = async (req: LoginInput): Promise<LoginOutput> => {
    try {
        const inputToValidate = plainToClass(LoginInput, req);
        const errors: ValidationError[] = await validate(inputToValidate);
        if (errors.length) {
            throw new Error('Error validating input.');
        }
        const useCase = Container.get(LoginUseCase);
        const response = await useCase.execute(req);
        return {
            status: StatusCodes.OK,
            data: response,
        };
    } catch (err) {
        throw new Error(err);
    }
};
