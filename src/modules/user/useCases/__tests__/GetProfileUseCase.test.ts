import { GetProfileUseCase } from '../GetProfileUseCase';

// const expectedResponse: GetProfileResponse = {
//     user: {
//         name: 'Test User',
//         email: 'test@example.com',
//         id: '123456789',
//         password: 'hashedPassword',
//         hasAddress: false,
//         cpf: '12345678901',
//         address: "Rua dos Guajajaras..."
//     }
// };

const mockRepository = {
    getUser: jest.fn().mockImplementation((input) => {
        if (input.userId === 'userNotFoundId') throw new Error('foo');
        return {
            name: 'Test User',
            email: 'test@example.com',
            id: '123456789',
            password: 'hashedPassword',
            hasAddress: false,
            cpf: '12345678901',
            address: 'Rua dos Guajajaras...',
        };
    }),
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
    });
});
