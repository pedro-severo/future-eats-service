import { GetProfileUseCase } from '../GetProfileUseCase';

// const expectedResponse: GetProfileResponse = {
//     user: {
//         name: 'Test User',
//         email: 'test@example.com',
//         id: '123456789',
//         hasAddress: false,
//         cpf: '12345678901',
//         address: "Rua dos Guajajaras..."
//     }
// };

const addressId = "addressId"

const mockRepository = {
    getUser: jest.fn().mockImplementation((userId) => {
        if (userId === 'userNotFoundId') throw new Error('foo');
        return {
            name: 'Test User',
            email: 'test@example.com',
            id: '123456789',
            mainAddressId: addressId,
            hasAddress: true,
            cpf: '12345678901',
            address: 'Rua dos Guajajaras...',
        };
    }),
    getAddress: jest.fn().mockImplementation((userId, addressId) => {
        return {
            id: addressId,
            city: "BH",
            complement: "Complement",
            state: "State",
            streetName: "StreetName",
            streetNumber: "streetNumber",
            zone: "zone"
        }
    })
};

describe('GetProfileUseCase suit test', () => {
    let useCase: GetProfileUseCase;
    beforeEach(() => {
        // @ts-expect-error dependency injection
        useCase = new GetProfileUseCase(mockRepository);
    });
    it('should execute use case correctly', async () => {
        const input = {
            userId: '123',
        };
        await useCase.execute(input);
        expect(mockRepository.getUser).toHaveBeenCalledWith(input.userId);
        expect(mockRepository.getAddress).toHaveBeenCalledWith(input.userId, addressId)
    });
});
