import { plainToClass } from 'class-transformer';
import { GetAddressUseCase } from '../useCases/GetAddressUseCase';
import { GetAddressInput } from './inputs/GetAddressInput';
import { Output } from './outputs';
import { StatusCodes } from 'http-status-codes';
import { validate, ValidationError } from 'class-validator';
import { logger } from '../../../logger';
import { API_ERROR_MESSAGES } from '../apiErrorMessages';
import { AddressResponse } from '../useCases/interfaces/AddressResponse';

export class GetAddressController {
    constructor(private useCase: GetAddressUseCase) {}

    async getAddress(
        input: GetAddressInput,
        token: string
    ): Promise<Output<AddressResponse>> {
        try {
            logger.info('Getting address...');
            const inputToValidate = plainToClass(GetAddressInput, input);
            const errors: ValidationError[] = await validate(inputToValidate);
            if (errors.length) {
                logger.error(errors);
                throw new Error(API_ERROR_MESSAGES.GET_ADDRESS_GENERIC_MESSAGE);
            }
            const response = await this.useCase.execute(input, token);
            logger.info('Got address with success!');
            return {
                status: StatusCodes.ACCEPTED,
                data: response,
            };
        } catch (err) {
            throw new Error(err.message);
        }
    }
}
