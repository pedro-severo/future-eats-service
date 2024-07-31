import { RegisterAddressUseCase } from './../../useCases/RegisterAddressUseCase';
import { StatusCodes } from 'http-status-codes';
import { AddressResponse } from '../../useCases/interfaces/AddressResponse';
import { RegisterAddressInput } from '../inputs/RegisterAddressInput';
import { RegisterAddressController } from '../RegisterAddressController';
import { UserRepository } from '../../repository/UserRepository';
import { Output } from '../outputs';
import { DatabaseTestContext } from '../../../../shared/database/context';
import { AuthenticatorManager } from '../../../../shared/services/authentication';
import { API_ERROR_MESSAGES } from '../../apiErrorMessages';

jest.mock('../../useCases/RegisterAddressUseCase');
jest.mock('../../../../shared/database');

const input: RegisterAddressInput = {
    userId: 'userId',
    city: 'Lisbon',
    complement: '1D',
    state: 'MG',
    streetNumber: '123',
    streetName: 'Guajajaras',
    zone: 'Barreiro',
};

const expectedResponse: Output<AddressResponse> = {
    status: StatusCodes.CREATED,
    data: {
        id: 'id',
        city: 'Lisbon',
        complement: '1D',
        state: 'MG',
        streetNumber: '123',
        streetName: 'Guajajaras',
        zone: 'Barreiro',
    },
};

describe('RegisterAddressController test', () => {
    let registerAddressController: RegisterAddressController;
    let registerAddressUseCase: RegisterAddressUseCase;
    let repositoryMock: UserRepository;
    let databaseMock: DatabaseTestContext;
    beforeEach(() => {
        databaseMock = new DatabaseTestContext();
        repositoryMock = new UserRepository(databaseMock);
        registerAddressUseCase = new RegisterAddressUseCase(
            repositoryMock,
            new AuthenticatorManager()
        );
        registerAddressController = new RegisterAddressController(
            registerAddressUseCase
        );
    });
    it('should return a successful response', async () => {
        jest.spyOn(registerAddressUseCase, 'execute').mockResolvedValueOnce(
            expectedResponse.data
        );
        const result = await registerAddressController.registerAddress(
            input,
            ''
        );
        expect(result).toEqual(expectedResponse);
    });
    it('should validate input and throw error by missing email property', async () => {
        const invalidInput = {
            city: 'Lisbon',
            complement: '1D',
            state: 'MG',
            streetNumber: '123',
            streetName: 'Guajajaras',
            zone: 'Barreiro',
        };
        try {
            await registerAddressController.registerAddress(
                invalidInput as unknown as RegisterAddressInput,
                ''
            );
        } catch (error) {
            expect(error.message).toBe(
                API_ERROR_MESSAGES.REGISTER_ADDRESS_GENERIC_ERROR_MESSAGE
            );
        }
    });
    it('should validate input and throw error by invalid values on props', async () => {
        const invalidInput = {
            userId: 2,
            city: 2,
            complement: 2,
            state: 2,
            streetNumber: 2,
            streetName: 2,
            zone: 2,
        };
        try {
            await registerAddressController.registerAddress(
                invalidInput as unknown as RegisterAddressInput,
                ''
            );
        } catch (error) {
            expect(error.message).toBe(
                API_ERROR_MESSAGES.REGISTER_ADDRESS_GENERIC_ERROR_MESSAGE
            );
        }
    });
});
