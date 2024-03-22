import { RegisterAddressUseCase } from '../RegisterAddressUseCase';
import { RegisterAddressResponse } from '../interfaces/RegisterAddressResponse';

const input = {
    userId: 'userId',
    city: 'Lisbon',
    complement: '1D',
    state: 'MG',
    streetNumber: '123',
    streetName: 'Guajajaras',
    zone: 'Barreiro',
    getUserAddress: () => {
        return {
            userId: 'userId',
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

jest.mock('../../repository/mappers/mapUserAddressEntityToResponse', () => ({
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
        return id === input.userId;
    });

describe('RegisterAddressUseCase test', () => {
    let registerAddressUseCase: RegisterAddressUseCase;
    beforeEach(() => {
        // @ts-expect-error dependency injection
        registerAddressUseCase = new RegisterAddressUseCase({
            checkUserExistence: (id: string) => mockCheckUserExistence(id),
            registerAddress: jest.fn(),
            updateUserAddressFlag: jest.fn(),
        });
    });
    it('should run execute method correctly', async () => {
        // @ts-expect-error expect a class, I'm injecting a object with the same props
        const response = await registerAddressUseCase.execute(
            input,
            input.userId
        );
        expect(mockCheckUserExistence).toHaveBeenCalledWith(input.userId);
        expect(response).toEqual(expectedResponse);
    });
    it('should throw error by userId not found', async () => {
        try {
            // @ts-expect-error expect a class, I'm injecting a object with the same props
            await registerAddressUseCase.execute(input, 'invalidId');
        } catch (e) {
            expect(e.message).toBe('Failed to register address.');
        }
    });
});
