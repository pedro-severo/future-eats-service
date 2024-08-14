import { AuthenticatorManager } from '../../../../shared/services/authentication';
import { USER_ROLES } from '../../../../shared/services/authentication/interfaces';
import { API_ERROR_MESSAGES } from '../../apiErrorMessages';
import { UserAddressType } from '../../entities/UserAddress';
import { UserRepository } from '../../repository/UserRepository';
import { UpdateAddressUseCase } from '../UpdateAddressUseCase';
import { USER_ERROR_MESSAGES } from '../constants/errorMessages';

const addressId = 'addressId';
const addressNotFoundId = 'addressNotFoundId';
const token = 'token';
const invalidToken = 'invalidToken';
const unauthorizedToken = 'unauthorizedToken';
const userId = 'userId';
const userNotFoundId = 'userNotFoundId';

const address: UserAddressType = {
    id: addressId,
    city: 'BH',
    complement: 'Complement',
    state: 'State',
    streetName: 'StreetName',
    streetNumber: 'streetNumber',
    zone: 'zone',
};

const mockCheckToken = jest.fn().mockImplementation((token: string) => {
    if (token === invalidToken) throw new Error('foo');
    if (token === unauthorizedToken) return false;
    return true;
});

const mockErrorLog = jest.fn();
const mockInfoLog = jest.fn();

jest.mock('../../../../logger', () => ({
    logger: {
        info: () => mockInfoLog(),
        // @ts-expect-error test file
        error: (e) => mockErrorLog(e),
    },
}));

const mockUpdateAddress = jest
    .fn()
    .mockImplementation((userId: string, addressId: string) => {
        if (addressId === addressNotFoundId) return undefined;
        return address;
    });

const mockRepository = {
    checkUserExistence: jest.fn().mockImplementation((userId) => {
        if (userId === userNotFoundId) return false;
        return true;
    }),
    updateAddress: (userId: string, addressId: string) =>
        mockUpdateAddress(userId, addressId),
};

const mockAuthenticatorManager = {
    checkToken: (token: string, idToCheck: string, role: string) =>
        mockCheckToken(token, idToCheck, role),
};

describe('UpdateAddressUseCase test suite', () => {
    let useCase: UpdateAddressUseCase;
    beforeEach(() => {
        useCase = new UpdateAddressUseCase(
            mockRepository as unknown as UserRepository,
            mockAuthenticatorManager as unknown as AuthenticatorManager
        );
        jest.clearAllMocks();
    });
    it('should execute useCase correctly', async () => {
        const input = {
            userId,
            addressId,
            city: 'city',
        };
        await useCase.execute(input, token);
        expect(mockInfoLog).toHaveBeenCalled();
        expect(mockCheckToken).toHaveBeenCalledWith(
            token,
            input.userId,
            USER_ROLES.USER
        );
        expect(mockUpdateAddress).toHaveBeenCalled();
        // TODO: Implement updateAddress on UserRepository to keep working here
    });
    it('should throw error by unauthorized token', async () => {
        const input = {
            userId,
            addressId,
            city: 'city',
        };
        try {
            await useCase.execute(input, unauthorizedToken);
        } catch (e) {
            expect(mockErrorLog).toHaveBeenCalledWith(
                USER_ERROR_MESSAGES.UNAUTHORIZED_ERROR
            );
            expect(e.message).toBe(
                API_ERROR_MESSAGES.UPDATE_ADDRESS_GENERIC_ERROR
            );
        }
    });
    it('should throw an error by user not found', async () => {
        const input = {
            userId: userNotFoundId,
            addressId,
            city: 'city',
        };
        try {
            await useCase.execute(input, token);
        } catch (e) {
            expect(mockErrorLog).toHaveBeenCalledWith(
                USER_ERROR_MESSAGES.NOT_FOUND
            );
            expect(e.message).toBe(API_ERROR_MESSAGES.USER_NOT_FOUND);
        }
    });
    it('should throw an error by address not found', async () => {
        const input = {
            userId,
            addressId: addressNotFoundId,
            city: 'city',
        };
        try {
            await useCase.execute(input, token);
        } catch (e) {
            expect(mockErrorLog).toHaveBeenCalledWith(
                USER_ERROR_MESSAGES.ADDRESS_NOT_FOUND
            );
            expect(e.message).toBe(
                API_ERROR_MESSAGES.UPDATE_ADDRESS_GENERIC_ERROR
            );
        }
    });
});
