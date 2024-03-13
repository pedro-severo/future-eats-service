import { StatusCodes } from 'http-status-codes';
import { plainToClass } from 'class-transformer';
import { ValidationError, validate } from 'class-validator';
import { SignupInput } from './inputs/SignupInput';
import { generateId } from '../../../shared/services/uuid';
import { HashManager } from '../../../shared/services/hash';
import { User } from '../entities/User';
import Container from 'typedi';
import { SignupUseCase } from '../useCases/SignupUseCase';
import { SignupOutput } from './outputs';

export const signupHandler = async (
    req: SignupInput
): Promise<SignupOutput> => {
    try {
        const inputToValidate = plainToClass(SignupInput, req);
        const errors: ValidationError[] = await validate(inputToValidate);
        if (errors.length) {
            throw new Error('Error validating input.');
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
        const useCase = Container.get(SignupUseCase);
        const response = await useCase.execute(user);
        return {
            status: StatusCodes.OK,
            data: response,
        };
    } catch (err) {
        throw new Error(err);
    }
};
