import { RequestHandler } from 'express';
import { StatusCodes } from 'http-status-codes';
import { plainToClass } from 'class-transformer';
import { ValidationError, validate } from 'class-validator';
import { SignupInput } from './inputs/SignupInput';
import { generateId } from '../../../shared/services/uuid';
import { HashManager } from '../../../shared/services/hash';
import { User } from '../entities/User';
import Container from 'typedi';
import { SignupUseCase } from '../useCases/SignupUseCase';

export const signupHandler: RequestHandler = async (req, res) => {
    try {
        const { name, email, cpf, password } = req.body;
        const inputToValidate = plainToClass(SignupInput, req.body);
        const errors: ValidationError[] = await validate(inputToValidate);
        if (errors.length) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                message: 'Error validating input',
                errors,
            });
        }
        const id = generateId();
        const encryptedPassword = new HashManager().hash(password);
        const newUser = new User(
            id,
            name,
            email,
            encryptedPassword,
            false,
            cpf
        );
        const useCase = Container.get(SignupUseCase);
        const response = await useCase.execute(newUser);
        return res.status(StatusCodes.CREATED).json(response);
    } catch (err) {
        if (err.message === 'Error: This email is already registered.') {
            return res
                .status(StatusCodes.BAD_REQUEST)
                .json({ message: err.message });
        }
        res.status(500).json({ message: 'Internal Server Error' });
    }
};
