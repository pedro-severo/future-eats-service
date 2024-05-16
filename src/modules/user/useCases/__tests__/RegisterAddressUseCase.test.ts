import { USER_ROLES } from '../../../../shared/services/authentication/interfaces';
import { RegisterAddressUseCase } from '../RegisterAddressUseCase';
import { USER_ERROR_MESSAGES } from '../constants/errorMessages';
import { RegisterAddressResponse } from '../interfaces/RegisterAddressResponse';

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

const expectedResponse: RegisterAddressResponse = {
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

describe('RegisterAddressUseCase test', () => {
    let registerAddressUseCase: RegisterAddressUseCase;
    beforeEach(() => {
        // @ts-expect-error dependency injection
        registerAddressUseCase = new RegisterAddressUseCase(
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
                USER_ERROR_MESSAGES.AUTHORIZATION_CHECKING_ERROR
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
            expect(e.message).toBe(USER_ERROR_MESSAGES.UNAUTHORIZED_ERROR);
        }
    });

    it('should throw error by userId not found', async () => {
        try {
            // @ts-expect-error expect a class, I'm injecting a object with the same props
            await registerAddressUseCase.execute(input, 'invalidId');
        } catch (e) {
            expect(e.message).toBe('Failed to register address');
        }
    });
});
