import { USER_ROLES } from '../../../../shared/services/authentication/interfaces';
import { API_ERROR_MESSAGES } from '../../apiErrorMessages';
import { RegisterAddressUseCase } from '../RegisterAddressUseCase';
import { AddressResponse } from '../interfaces/AddressResponse';

const userId = 'userId';
const token = 'token';

const input = {
    id: 'addressId',
    city: 'Lisbon',
    complement: '1D',
    state: 'MG',
    streetNumber: '123',
    streetName: 'Guajajaras',
    zone: 'Barreiro',
    getUserAddress: () => {
        return {
            id: 'addressId',
            city: 'Lisbon',
            complement: '1D',
            state: 'MG',
            streetNumber: '123',
            streetName: 'Guajajaras',
            zone: 'Barreiro',
        };
    },
};

const expectedResponse: AddressResponse = {
    id: 'userId',
    city: 'Lisbon',
    complement: '1D',
    state: 'MG',
    streetNumber: '123',
    streetName: 'Guajajaras',
    zone: 'Barreiro',
};

jest.mock('../mappers/mapUserAddressEntityToResponse', () => ({
    mapUserAddressEntityToResponse: jest.fn().mockResolvedValue({
        id: 'userId',
        city: 'Lisbon',
        complement: '1D',
        state: 'MG',
        streetNumber: '123',
        streetName: 'Guajajaras',
        zone: 'Barreiro',
    }),
}));

const mockCheckUserExistence = jest
    .fn()
    .mockImplementation(async (id: string): Promise<boolean> => {
        return id === userId;
    });

const mockRegisterAddress = jest.fn();

const mockUpdateUserAddressFlag = jest.fn();

const mockSetMainAddressId = jest.fn();

const mockCheckToken = jest
    .fn()
    .mockImplementation((token: string, idToCheck: string) => {
        if (token === 'invalidToken') throw new Error('foo');
        if (idToCheck === 'incorrectId') return false;
        return true;
    });

const mockErrorLog = jest.fn();

jest.mock('../../../../logger', () => ({
    logger: {
        info: jest.fn(),
        // @ts-expect-error test file
        error: (e) => mockErrorLog(e),
    },
}));

describe('RegisterAddressUseCase test', () => {
    let registerAddressUseCase: RegisterAddressUseCase;
    beforeEach(() => {
        registerAddressUseCase = new RegisterAddressUseCase(
            // @ts-expect-error dependency injection
            {
                checkUserExistence: (id: string) => mockCheckUserExistence(id),
                registerAddress: (address, userId) =>
                    mockRegisterAddress(address, userId),
                updateUserAddressFlag: (userId) =>
                    mockUpdateUserAddressFlag(userId, { hasAddress: true }),
                setMainAddressId: (userId, addressId) =>
                    mockSetMainAddressId(userId, addressId),
            },
            {
                checkToken: (
                    token: string,
                    idToCheck: string,
                    roleToCheck: string
                ) => mockCheckToken(token, idToCheck, roleToCheck),
            }
        );
    });
    it('should run execute method correctly', async () => {
        const response = await registerAddressUseCase.execute(
            // @ts-expect-error class issue
            input,
            userId,
            token
        );
        expect(mockCheckToken).toHaveBeenCalledWith(
            token,
            userId,
            USER_ROLES.USER
        );
        expect(mockCheckUserExistence).toHaveBeenCalledWith(userId);
        expect(mockRegisterAddress).toHaveBeenCalledWith(input, userId);
        expect(mockUpdateUserAddressFlag).toHaveBeenCalledWith(userId, {
            hasAddress: true,
        });
        expect(mockSetMainAddressId).toHaveBeenCalledWith(userId, input.id);
        expect(response).toEqual(expectedResponse);
    });
    it('should throw error by invalid token authentication', async () => {
        try {
            await registerAddressUseCase.execute(
                // @ts-expect-error class issue
                input,
                userId,
                'invalidToken'
            );
        } catch (e) {
            expect(e.message).toBe(
                API_ERROR_MESSAGES.REGISTER_ADDRESS_GENERIC_ERROR_MESSAGE
            );
        }
    });
    it('should throw error by fail on id checking', async () => {
        try {
            await registerAddressUseCase.execute(
                // @ts-expect-error class issue
                input,
                'incorrectId',
                token
            );
        } catch (e) {
            expect(e.message).toBe(
                API_ERROR_MESSAGES.REGISTER_ADDRESS_GENERIC_ERROR_MESSAGE
            );
        }
    });

    it('should throw error by userId not found', async () => {
        try {
            // @ts-expect-error expect a class, I'm injecting a object with the same props
            await registerAddressUseCase.execute(input, 'invalidId');
        } catch (e) {
            expect(e.message).toBe(
                API_ERROR_MESSAGES.REGISTER_ADDRESS_GENERIC_ERROR_MESSAGE
            );
        }
    });
});
