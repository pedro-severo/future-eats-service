import { plainToClass } from 'class-transformer';
import { AddressResponse } from '../useCases/interfaces/AddressResponse';
import { RegisterAddressInput } from './inputs/RegisterAddressInput';
import { Output } from './outputs';
import { validate, ValidationError } from 'class-validator';
import { UserAddress } from '../entities/UserAddress';
import { StatusCodes } from 'http-status-codes';
import { Service } from 'typedi';
import { RegisterAddressUseCase } from '../useCases/RegisterAddressUseCase';
import { generateId } from '../../../shared/services/uuid';
import xss from 'xss';
import { API_ERROR_MESSAGES } from '../apiErrorMessages';
import { logger } from '../../../logger';

@Service()
export class RegisterAddressController {
    constructor(private useCase: RegisterAddressUseCase) {}

    async registerAddress(
        req: RegisterAddressInput,
        token: string
    ): Promise<Output<AddressResponse>> {
        try {
            const inputToValidate = plainToClass(RegisterAddressInput, req);
            const errors: ValidationError[] = await validate(inputToValidate);
            if (errors.length) {
                logger.error(errors);
                throw new Error(
                    API_ERROR_MESSAGES.REGISTER_ADDRESS_GENERIC_ERROR_MESSAGE
                );
            }
            const id = generateId();
            const userAddress = new UserAddress(
                id,
                xss(req.city),
                xss(req.state),
                xss(req.streetNumber),
                xss(req.zone),
                xss(req.streetName),
                req.complement
            );
            const response = await this.useCase.execute(
                userAddress,
                req.userId,
                token
            );
            logger.info('Address registration success!');
            return {
                status: StatusCodes.CREATED,
                data: response,
            };
        } catch (err) {
            throw new Error(err.message);
        }
    }
}
