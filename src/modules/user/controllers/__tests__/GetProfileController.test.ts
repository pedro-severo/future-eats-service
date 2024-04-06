import { DatabaseTestContext } from '../../../../shared/database/context';
import { UserRepository } from '../../repository/UserRepository';
import { GetProfileUseCase } from '../../useCases/GetProfileUseCase';
import { GetProfileController } from '../GetProfileController';
import { GetProfileInput } from '../inputs/GetProfileInput';

const mockInput: GetProfileInput = {
    userId: 'userId',
};

const mockInputToValidate = {
    userId: 'mockInputToValidate',
};

const mockPlainToClass = jest.fn().mockResolvedValue(mockInputToValidate);

jest.mock('class-transformer', () => {
    return {
        plainToClass: () => mockPlainToClass(GetProfileInput, mockInput),
    };
});

const mockValidate = jest.fn().mockResolvedValue({});

jest.mock('class-validator', () => {
    return {
        validate: () => mockValidate(mockInputToValidate),
    };
});

describe('GetProfileController', () => {
    let controller: GetProfileController;
    let useCase: GetProfileUseCase;
    let repository: UserRepository;
    let database: DatabaseTestContext;
    beforeEach(() => {
        database = new DatabaseTestContext();
        repository = new UserRepository(database);
        useCase = new GetProfileUseCase(repository);
        controller = new GetProfileController(useCase);
    });
    it('should run getProfileController correctly', () => {
        controller.getProfile(mockInput);
        expect(mockPlainToClass).toHaveBeenCalled();
        expect(mockPlainToClass).toHaveBeenCalledWith(
            GetProfileInput,
            mockInput
        );
        expect(mockValidate).toHaveBeenCalled();
        expect(mockValidate).toHaveBeenCalledWith(mockInputToValidate);
    });
});
