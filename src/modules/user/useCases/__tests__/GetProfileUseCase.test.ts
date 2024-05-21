import { USER_ROLES } from '../../../../shared/services/authentication/interfaces';
import { GetProfileUseCase } from '../GetProfileUseCase';
import { USER_ERROR_MESSAGES } from '../constants/errorMessages';
import { mapUserAndAddressToProfileResponse } from '../mappers/mapUserAndAddressToProfileResponse';

jest.mock('../mappers/mapUserAndAddressToProfileResponse');
jest.mock('../../../../shared/services/authentication');

const addressId = 'addressId';
const token = 'token';

const mockCheckToken = jest
    .fn()
    .mockImplementation((token: string, idToCheck: string) => {
        if (token === 'invalidToken') throw new Error('foo');
        if (idToCheck === 'incorrectId') return false;
        return true;
    });

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
    id: '123456789',
    mainAddressId: addressId,
    hasAddress: true,
    cpf: '12345678901',
    getUser: () => userType,
};

const userWithoutAddressId = {
    name: 'Test User',
    email: 'test@example.com',
    id: '123456789',
    hasAddress: true,
    cpf: '12345678901',
    getUser: () => ({ ...userType, mainAddressId: undefined }),
};

const address = {
    id: addressId,
    city: 'BH',
    complement: 'Complement',
    state: 'State',
    streetName: 'StreetName',
    streetNumber: 'streetNumber',
    zone: 'zone',
};

const mockRepository = {
    getUser: jest.fn().mockImplementation((userId) => {
        if (userId === 'userNotFoundId') return undefined;
        if (userId === 'userWithoutMainAddressId') return userWithoutAddressId;
        return user;
    }),
    getAddress: jest.fn().mockImplementation(() => {
        return address;
    }),
};

describe('GetProfileUseCase suit test', () => {
    it('should execute use case correctly', async () => {
        // @ts-expect-error dependency injection
        const useCase = new GetProfileUseCase(mockRepository, {
            checkToken: (
                token: string,
                idToCheck: string,
                roleToCheck: string
            ) => mockCheckToken(token, idToCheck, roleToCheck),
        });
        const input = {
            userId: '123',
        };
        await useCase.execute(input, token);
        expect(mockCheckToken).toHaveBeenCalledWith(
            token,
            input.userId,
            USER_ROLES.USER
        );
        expect(mockRepository.getUser).toHaveBeenCalledWith(input.userId);
        expect(mockRepository.getAddress).toHaveBeenCalledWith(
            input.userId,
            addressId
        );
        expect(mapUserAndAddressToProfileResponse).toHaveBeenCalledWith(
            userType,
            address
        );
    });
    it('should execute with not found user id', async () => {
        // @ts-expect-error dependency injection
        const useCase = new GetProfileUseCase(mockRepository, {
            checkToken: (
                token: string,
                idToCheck: string,
                roleToCheck: string
            ) => mockCheckToken(token, idToCheck, roleToCheck),
        });
        const input = {
            userId: 'userNotFoundId',
        };
        try {
            await useCase.execute(input, token);
            expect(mockRepository.getUser).toHaveBeenCalledWith(input.userId);
            expect(mockRepository.getAddress).not.toHaveBeenCalled();
            expect(
                mapUserAndAddressToProfileResponse
            ).not.toHaveBeenCalledWith();
        } catch (e) {
            expect(e.message).toBe(USER_ERROR_MESSAGES.NOT_FOUND);
        }
    });
    it('should throw error by invalid token authentication', async () => {
        // @ts-expect-error dependency injection
        const useCase = new GetProfileUseCase(mockRepository, {
            checkToken: (
                token: string,
                idToCheck: string,
                roleToCheck: string
            ) => mockCheckToken(token, idToCheck, roleToCheck),
        });
        const input = {
            userId: '123',
        };
        try {
            await useCase.execute(input, 'invalidToken');
        } catch (e) {
            expect(e.message).toBe(
                USER_ERROR_MESSAGES.AUTHORIZATION_CHECKING_ERROR
            );
        }
    });
    it('should throw error by not authorized', async () => {
        // @ts-expect-error dependency injection
        const useCase = new GetProfileUseCase(mockRepository, {
            checkToken: (
                token: string,
                idToCheck: string,
                roleToCheck: string
            ) => mockCheckToken(token, idToCheck, roleToCheck),
        });
        const input = {
            userId: 'incorrectId',
        };
        try {
            await useCase.execute(input, token);
        } catch (e) {
            expect(e.message).toBe(USER_ERROR_MESSAGES.UNAUTHORIZED_ERROR);
        }
    });
    it('should execute correctly but with user without mainAddressId', async () => {
        // @ts-expect-error dependency injection
        const newUseCase = new GetProfileUseCase(mockRepository, {
            checkToken: (
                token: string,
                idToCheck: string,
                roleToCheck: string
            ) => mockCheckToken(token, idToCheck, roleToCheck),
        });
        const input = {
            userId: 'userWithoutMainAddressId',
        };
        await newUseCase.execute(input, token);
        expect(mockRepository.getUser).toHaveBeenCalledWith(input.userId);
        expect(mapUserAndAddressToProfileResponse).toHaveBeenCalledWith(
            { ...userType, mainAddressId: undefined },
            undefined
        );
    });
    it('should execute use case correctly', async () => {
        // @ts-expect-error dependency injection
        const useCase = new GetProfileUseCase(mockRepository, {
            checkToken: (
                token: string,
                idToCheck: string,
                roleToCheck: string
            ) => mockCheckToken(token, idToCheck, roleToCheck),
        });
        const input = {
            userId: '123',
        };
        await useCase.execute(input, token);
        expect(mockCheckToken).toHaveBeenCalledWith(
            token,
            input.userId,
            USER_ROLES.USER
        );
        expect(mockRepository.getUser).toHaveBeenCalledWith(input.userId);
        expect(mockRepository.getAddress).toHaveBeenCalledWith(
            input.userId,
            addressId
        );
        expect(mapUserAndAddressToProfileResponse).toHaveBeenCalledWith(
            userType,
            address
        );
    });
});
