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
import xss from 'xss';
import { API_ERROR_MESSAGES } from '../apiErrorMessages';
import { logger } from '../../../logger';

@Service()
export class SignupController {
    constructor(private useCase: SignupUseCase) {}

    async signup(req: SignupInput): Promise<Output<SignupResponse>> {
        try {
            const inputToValidate = plainToClass(SignupInput, req);
            const errors: ValidationError[] = await validate(inputToValidate);
            if (errors.length) {
                logger.error(errors);
                throw new Error(
                    API_ERROR_MESSAGES.SIGNUP_GENERIC_ERROR_MESSAGE
                );
            }
            const id = generateId();
            const encryptedPassword = new HashManager().hash(xss(req.password));
            const user = new User(
                id,
                xss(req.name),
                xss(req.email),
                encryptedPassword,
                false,
                xss(req.cpf)
            );
            const response = await this.useCase.execute(user);
            logger.info('Signup success!');
            return {
                status: StatusCodes.CREATED,
                data: response,
            };
        } catch (err) {
            throw new Error(err.message);
        }
    }
}
