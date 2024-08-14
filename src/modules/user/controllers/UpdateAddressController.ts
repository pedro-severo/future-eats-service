import { Service } from 'typedi';
import { UpdateAddressUseCase } from '../useCases/UpdateAddressUseCase';
import { UpdateAddressInput } from './inputs/UpdateAddressInput';
import { logger } from '../../../logger';
import { plainToClass } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';
import { API_ERROR_MESSAGES } from '../apiErrorMessages';
import { Output } from './outputs';
import { AddressResponse } from '../useCases/interfaces/AddressResponse';
import { StatusCodes } from 'http-status-codes';

@Service()
export class UpdateAddressController {
    constructor(private useCase: UpdateAddressUseCase) {}
    async updateAddress(
        input: UpdateAddressInput,
        token: string
    ): Promise<Output<AddressResponse>> {
        try {
            logger.info('Updating address...');
            const inputToValidate = plainToClass(UpdateAddressInput, input);
            const errors: ValidationError[] = await validate(inputToValidate);
            // TODO: validate if there is at least one optional prop on input. If no, throw error
            if (errors.length) {
                logger.error(errors);
                throw new Error(
                    API_ERROR_MESSAGES.UPDATE_ADDRESS_GENERIC_ERROR
                );
            }
            const result = await this.useCase.execute(input, token);
            logger.info('Address updated with success!');
            return {
                status: StatusCodes.OK,
                data: result,
            };
        } catch (e) {
            throw new Error(e.message);
        }
    }
}
