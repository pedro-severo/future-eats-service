import { Service } from 'typedi';
import { UpdateAddressUseCase } from '../useCases/UpdateAddressUseCase';
import { UpdateAddressInput } from './inputs/UpdateAddressInput';

@Service()
export class UpdateAddressController {
    constructor(private useCase: UpdateAddressUseCase) {}
    async updateAddress(input: UpdateAddressInput, token: string) {
        console.log(
            '🚀 ~ UpdateAddressController ~ updateAddress ~ token:',
            token
        );
        console.log(
            '🚀 ~ UpdateAddressController ~ updateAddress ~ input:',
            input
        );
    }
}
