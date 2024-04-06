import { plainToClass } from 'class-transformer';
import { GetProfileUseCase } from '../useCases/GetProfileUseCase';
import { GetProfileInput } from './inputs/GetProfileInput';

export class GetProfileController {
    constructor(private useCase: GetProfileUseCase) {}
    getProfile(input: GetProfileInput) {
        const inputToValidate = plainToClass(GetProfileInput, input);
        console.log(
            '🚀 ~ GetProfileController ~ getProfile ~ inputToValidate:',
            inputToValidate
        );
    }
}
