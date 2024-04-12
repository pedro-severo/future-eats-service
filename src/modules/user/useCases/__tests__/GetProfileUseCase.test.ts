import { GetProfileUseCase } from '../GetProfileUseCase';

const mockRepository = {
    getUser: jest.fn(),
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
