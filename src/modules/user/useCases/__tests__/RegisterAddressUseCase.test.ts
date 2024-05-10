import { RegisterAddressUseCase } from '../RegisterAddressUseCase';
import { RegisterAddressResponse } from '../interfaces/RegisterAddressResponse';

const userId = "userId"

const input = {
    id: 'addressId',
    city: 'Lisbon',
    complement: '1D',
    state: 'MG',
    streetNumber: '123',
    streetName: 'Guajajaras',
    zone: 'Barreiro',
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

const mockRegisterAddress = jest.fn()

const mockUpdateUserAddressFlag = jest.fn()

const mockHandleMainAddressId = jest.fn()

describe('RegisterAddressUseCase test', () => {
    let registerAddressUseCase: RegisterAddressUseCase;
    beforeEach(() => {
        // @ts-expect-error dependency injection
        registerAddressUseCase = new RegisterAddressUseCase({
            checkUserExistence: (id: string) => mockCheckUserExistence(id),
            registerAddress: (address, userId) => mockRegisterAddress(address, userId),
            updateUserAddressFlag: (userId) => mockUpdateUserAddressFlag(userId, { hasAddress: true }),
            // handleMainAddressId: (input, userId: string) => mockHandleMainAddressId(input.id, userId)
        });
    });
    it('should run execute method correctly', async () => {
        const response = await registerAddressUseCase.execute(
            // @ts-expect-error class issue
            input,
            userId
        );
        expect(mockCheckUserExistence).toHaveBeenCalledWith(userId);
        expect(mockRegisterAddress).toHaveBeenCalledWith(input, userId);
        expect(mockUpdateUserAddressFlag).toHaveBeenCalledWith(userId, { hasAddress: true });
        expect(mockHandleMainAddressId).toHaveBeenCalledWith(userId, input.id)
        expect(response).toEqual(expectedResponse);
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
