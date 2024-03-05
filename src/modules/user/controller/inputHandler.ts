import { plainToClass } from 'class-transformer';
import { RequestHandler } from 'express';
import { LoginInput } from './inputs/LoginInput';
import { ValidationError, validate } from 'class-validator';
import { StatusCodes } from 'http-status-codes';
import Container from 'typedi';
import { LoginUseCase } from '../useCases/LoginUseCase';

export const inputHandler: RequestHandler = async (req, res) => {
    try {
        const inputToValidate = plainToClass(LoginInput, req.body);
        const errors: ValidationError[] = await validate(inputToValidate);
        if (errors.length) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                message: 'Error validating input',
                errors,
            });
        }
        const useCase = Container.get(LoginUseCase);
        const response = await useCase.execute(req.body);
        return res.status(StatusCodes.OK).json(response);
    } catch (err) {
        if (err.message === 'Error: User not found.') {
            return res
                .status(StatusCodes.NOT_FOUND)
                .json({ message: err.message });
        } else if (err.message === 'Error: Incorrect password.') {
            return res
                .status(StatusCodes.UNAUTHORIZED)
                .json({ message: err.message });
        }
        res.status(500).json({ message: 'Internal Server Error' });
    }
};
