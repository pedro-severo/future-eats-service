import { GetProfileUseCase } from '../GetProfileUseCase';
import { USER_ERROR_MESSAGES } from '../constants/errorMessages';
import { mapUserAndAddressToProfileResponse } from '../mappers/mapUserAndAddressToProfileResponse';

jest.mock('../mappers/mapUserAndAddressToProfileResponse');

const addressId = 'addressId';

const user = {
    name: 'Test User',
    email: 'test@example.com',
    id: '123456789',
    mainAddressId: addressId,
    hasAddress: true,
    cpf: '12345678901',
    getUser: () => ({
        name: 'Test User',
        email: 'test@example.com',
        id: '123456789',
        mainAddressId: addressId,
        hasAddress: true,
        cpf: '12345678901',
    }),
};

const userWithoutAddressId = {
    name: 'Test User',
    email: 'test@example.com',
    id: '123456789',
    hasAddress: false,
    cpf: '12345678901',
    getUser: () => ({
        name: 'Test User',
        email: 'test@example.com',
        id: '123456789',
        hasAddress: false,
        cpf: '12345678901',
    }),
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
        const useCase = new GetProfileUseCase(mockRepository);
        const input = {
            userId: '123',
        };
        await useCase.execute(input);
        expect(mockRepository.getUser).toHaveBeenCalledWith(input.userId);
        expect(mockRepository.getAddress).toHaveBeenCalledWith(
            input.userId,
            addressId
        );
        expect(mapUserAndAddressToProfileResponse).toHaveBeenCalledWith(
            user,
            address
        );
    });
    it('should execute with not found user id', async () => {
        // @ts-expect-error dependency injection
        const useCase = new GetProfileUseCase(mockRepository);
        const input = {
            userId: 'userNotFoundId',
        };
        try {
            await useCase.execute(input);
            expect(mockRepository.getUser).toHaveBeenCalledWith(input.userId);
            expect(mockRepository.getAddress).not.toHaveBeenCalled();
            expect(
                mapUserAndAddressToProfileResponse
            ).not.toHaveBeenCalledWith();
        } catch (e) {
            expect(e.message).toBe(USER_ERROR_MESSAGES.NOT_FOUND);
        }
    });
    it('should execute correctly but with user without mainAddressId', async () => {
        // @ts-expect-error dependency injection
        const newUseCase = new GetProfileUseCase(mockRepository);
        const input = {
            userId: 'userWithoutMainAddressId',
        };
        await newUseCase.execute(input);
        expect(mockRepository.getUser).toHaveBeenCalledWith(input.userId);
        expect(mapUserAndAddressToProfileResponse).toHaveBeenCalledWith(
            userWithoutAddressId,
            undefined
        );
    });
});
