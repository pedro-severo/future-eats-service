import { plainToClass } from 'class-transformer';
import { RegisterAddressResponse } from '../useCases/interfaces/RegisterAddressResponse';
import { RegisterAddressInput } from './inputs/RegisterAddressInput';
import { Output } from './outputs';
import { validate, ValidationError } from 'class-validator';
import { UserAddress } from '../entities/UserAddress';
import { StatusCodes } from 'http-status-codes';
import { Service } from 'typedi';
import { RegisterAddressUseCase } from '../useCases/RegisterAddressUseCase';
import { generateId } from '../../../shared/services/uuid';

@Service()
export class RegisterAddressController {
    constructor(private useCase: RegisterAddressUseCase) {}

    async registerAddress(
        req: RegisterAddressInput
    ): Promise<Output<RegisterAddressResponse>> {
        try {
            const inputToValidate = plainToClass(RegisterAddressInput, req);
            const errors: ValidationError[] = await validate(inputToValidate);
            if (errors.length) {
                throw new Error('Failed to validate input.', { cause: errors });
            }
            const id = generateId();
            const userAddress = new UserAddress(
                id,
                req.city,
                req.complement,
                req.state,
                req.streetNumber,
                req.zone,
                req.streetName
            );
            const response = await this.useCase.execute(
                userAddress,
                req.userId
            );
            return {
                status: StatusCodes.CREATED,
                data: response,
            };
        } catch (err) {
            throw new Error(err.message, { cause: err.cause });
        }
    }
}
