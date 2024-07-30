import { USER_ROLES } from '../../../../shared/services/authentication/interfaces';
import { API_ERROR_MESSAGES } from '../../apiErrorMessages';
import { UserAddress, UserAddressType } from '../../entities/UserAddress';
import { GetAddressUseCase } from '../GetAddressUseCase';
import { USER_ERROR_MESSAGES } from '../constants/errorMessages';
import { mapUserAddressEntityToResponse } from '../mappers/mapUserAddressEntityToResponse';

jest.mock('../../../../shared/services/authentication');
jest.mock('../mappers/mapUserAddressEntityToResponse');

const addressId = 'addressId';
const token = 'token';
const userId = 'userId';
const userNotFoundId = 'userNotFoundId';
const userNotAuthorized = 'userNotAuthorized';
const userWithoutMainAddressId = 'userWithoutMainAddressId';
const addressNotFoundId = 'addressNotFoundId';

const userWithoutAddress = {
    name: 'Test User',
    email: 'test@example.com',
    id: userWithoutMainAddressId,
    hasAddress: true,
    cpf: '12345678901',
    getUser: () => ({ ...userType, mainAddressId: undefined }),
};

const userType = {
    name: 'Test User',
    email: 'test@example.com',
    id: '123456789',
    mainAddressId: addressId,
    hasAddress: true,
    cpf: '12345678901',
};

const user = {
    name: 'Test User',
    email: 'test@example.com',
    id: userId,
    mainAddressId: addressId,
    hasAddress: true,
    cpf: '12345678901',
    getUser: () => userType,
};

const address: UserAddressType = {
    id: addressId,
    city: 'BH',
    complement: 'Complement',
    state: 'State',
    streetName: 'StreetName',
    streetNumber: 'streetNumber',
    zone: 'zone',
};

const addressEntity = new UserAddress(
    address.id,
    address.city,
    address.state,
    address.streetNumber,
    address.zone,
    address.streetName,
    address.complement
);

const mockRepository = {
    checkUserExistence: jest.fn().mockImplementation((userId) => {
        if (userId === userNotFoundId) return false;
        return true;
    }),
    getAddress: jest.fn().mockImplementation((userId, addressId) => {
        if (addressId === addressNotFoundId) return undefined;
        return addressEntity;
    }),
    getUser: jest.fn().mockImplementation((userId) => {
        if (userId === userWithoutMainAddressId) return userWithoutAddress;
        return user;
    }),
};

const mockErrorLog = jest.fn();
const mockInfoLog = jest.fn();

jest.mock('../../../../logger', () => ({
    logger: {
        info: () => mockInfoLog(),
        // @ts-expect-error test file
        error: (e) => mockErrorLog(e),
    },
}));

// AuthenticatorManager class method
const mockCheckToken = jest
    .fn()
    .mockImplementation((token: string, idToCheck: string) => {
        if (token === 'invalidToken') throw new Error('foo');
        if (idToCheck === userNotAuthorized) return false;
        return true;
    });

describe('GetAddressUseCase test', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    it('should execute use case correctly', async () => {
        // @ts-expect-error dependency injection
        const useCase = new GetAddressUseCase(mockRepository, {
            checkToken: (
                token: string,
                idToCheck: string,
                roleToCheck: string
            ) => mockCheckToken(token, idToCheck, roleToCheck),
        });
        const input = {
            userId,
            addressId,
        };
        await useCase.execute(input, token);
        expect(mockInfoLog).toHaveBeenCalled();
        expect(mockCheckToken).toHaveBeenCalledWith(
            token,
            input.userId,
            USER_ROLES.USER
        );
        expect(mockRepository.checkUserExistence).toHaveBeenCalledWith(
            input.userId
        );
        expect(mockRepository.getAddress).toHaveBeenCalledWith(
            input.userId,
            input.addressId
        );
        expect(mapUserAddressEntityToResponse).toHaveBeenCalledWith(address);
    });
    it('should execute use case correctly without address id be sending on input', async () => {
        // @ts-expect-error dependency injection
        const useCase = new GetAddressUseCase(mockRepository, {
            checkToken: (
                token: string,
                idToCheck: string,
                roleToCheck: string
            ) => mockCheckToken(token, idToCheck, roleToCheck),
        });
        const input = {
            userId,
        };
        await useCase.execute(input, token);
        expect(mockRepository.getUser).toHaveBeenCalledWith(input.userId);
        expect(mockRepository.getAddress).toHaveBeenCalledWith(
            input.userId,
            addressId
        );
        expect(mapUserAddressEntityToResponse).toHaveBeenCalledWith(address);
    });
    it('should throw error by invalid token authentication', async () => {
        // @ts-expect-error dependency injection
        const useCase = new GetAddressUseCase(mockRepository, {
            checkToken: (
                token: string,
                idToCheck: string,
                roleToCheck: string
            ) => mockCheckToken(token, idToCheck, roleToCheck),
        });
        const input = {
            userId,
        };
        try {
            await useCase.execute(input, 'invalidToken');
        } catch (e) {
            expect(mockErrorLog).toHaveBeenCalledWith(
                USER_ERROR_MESSAGES.AUTHORIZATION_CHECKING_ERROR
            );
            expect(e.message).toBe(
                API_ERROR_MESSAGES.GET_ADDRESS_GENERIC_MESSAGE
            );
        }
    });
    it('should throw error by not authorized user', async () => {
        // @ts-expect-error dependency injection
        const useCase = new GetAddressUseCase(mockRepository, {
            checkToken: (
                token: string,
                idToCheck: string,
                roleToCheck: string
            ) => mockCheckToken(token, idToCheck, roleToCheck),
        });
        const input = {
            userId: userNotAuthorized,
        };
        try {
            await useCase.execute(input, token);
        } catch (e) {
            expect(mockErrorLog).toHaveBeenCalledWith(
                USER_ERROR_MESSAGES.UNAUTHORIZED_ERROR
            );
            expect(e.message).toBe(
                API_ERROR_MESSAGES.GET_ADDRESS_GENERIC_MESSAGE
            );
        }
    });
    it('should throw error by user not found', async () => {
        // @ts-expect-error dependency injection
        const useCase = new GetAddressUseCase(mockRepository, {
            checkToken: (
                token: string,
                idToCheck: string,
                roleToCheck: string
            ) => mockCheckToken(token, idToCheck, roleToCheck),
        });
        const input = {
            userId: userNotFoundId,
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
    it('should throw error by address not found', async () => {
        // @ts-expect-error dependency injection
        const useCase = new GetAddressUseCase(mockRepository, {
            checkToken: (
                token: string,
                idToCheck: string,
                roleToCheck: string
            ) => mockCheckToken(token, idToCheck, roleToCheck),
        });
        const input = {
            userId,
            addressId: addressNotFoundId,
        };
        try {
            await useCase.execute(input, token);
        } catch (e) {
            expect(mockErrorLog).toHaveBeenCalledWith(
                USER_ERROR_MESSAGES.USER_WITHOUT_ADDRESS
            );
            expect(e.message).toBe(API_ERROR_MESSAGES.USER_WITHOUT_ADDRESS);
        }
    });
    it('should throw error by user without address id', async () => {
        // @ts-expect-error dependency injection
        const useCase = new GetAddressUseCase(mockRepository, {
            checkToken: (
                token: string,
                idToCheck: string,
                roleToCheck: string
            ) => mockCheckToken(token, idToCheck, roleToCheck),
        });
        const input = {
            userId: userWithoutMainAddressId,
        };
        try {
            await useCase.execute(input, token);
        } catch (e) {
            expect(mockErrorLog).toHaveBeenCalledWith(
                USER_ERROR_MESSAGES.USER_WITHOUT_ADDRESS
            );
            expect(e.message).toBe(API_ERROR_MESSAGES.USER_WITHOUT_ADDRESS);
        }
    });
});
