import { ValidationError } from 'class-validator';
import { DatabaseTestContext } from '../../../../shared/database/context';
import { UserRepository } from '../../repository/UserRepository';
import { GetProfileUseCase } from '../../useCases/GetProfileUseCase';
import { GetProfileController } from '../GetProfileController';
import { GetProfileInput } from '../inputs/GetProfileInput';
import { StatusCodes } from 'http-status-codes';
import { AuthenticatorManager } from '../../../../shared/services/authentication';
import { API_ERROR_MESSAGES } from '../../apiErrorMessages';

const mockPlainToClass = jest
    .fn()
    .mockImplementation((input: GetProfileInput) => input);

jest.mock('class-transformer', () => {
    return {
        plainToClass: (GetProfileInput: any, input: GetProfileInput) =>
            mockPlainToClass(input),
    };
});

const mockValidate = jest.fn().mockImplementation((input: GetProfileInput) => {
    const errors: ValidationError[] = [
        { property: 'userId', value: input.userId },
    ];
    if (typeof input.userId !== 'string') return errors;
    return [];
});

jest.mock('class-validator', () => {
    return {
        validate: (input: any) => mockValidate(input),
        IsString: jest.fn(),
        IsBoolean: jest.fn(),
        IsEmail: jest.fn(),
        IsNotEmpty: jest.fn(),
        MinLength: jest.fn(),
        IsOptional: jest.fn(),
    };
});

const mockExecute = jest.fn().mockResolvedValueOnce({});

describe('GetProfileController', () => {
    let controller: GetProfileController;
    let useCase: GetProfileUseCase;
    let repository: UserRepository;
    let database: DatabaseTestContext;
    beforeEach(() => {
        database = new DatabaseTestContext();
        repository = new UserRepository(database);
        useCase = new GetProfileUseCase(repository, new AuthenticatorManager());
        controller = new GetProfileController(useCase);
    });
    it('should run getProfileController correctly', async () => {
        const input: GetProfileInput = {
            userId: 'userId',
        };
        jest.spyOn(useCase, 'execute').mockImplementation(
            (input: GetProfileInput, token: string) => mockExecute(input, token)
        );
        const output = await controller.getProfile(input, '');
        expect(mockPlainToClass).toHaveBeenCalled();
        expect(mockPlainToClass).toHaveBeenCalledWith(input);
        expect(mockValidate).toHaveBeenCalled();
        expect(mockValidate).toHaveBeenCalledWith(input);
        expect(mockExecute).toHaveBeenCalled();
        expect(mockExecute).toHaveBeenCalledWith(input, '');
        expect(output).toEqual({
            status: StatusCodes.ACCEPTED,
            data: {},
        });
    });
    it('should throw error by invalid userId prop type', async () => {
        const input = {
            userId: 1234,
        };
        try {
            await controller.getProfile(
                input as unknown as GetProfileInput,
                ''
            );
        } catch (e) {
            expect(e.message).toBe(
                API_ERROR_MESSAGES.GET_PROFILE_GENERIC_MESSAGE
            );
        }
    });
    it('should throw error by undefined userId prop type', async () => {
        const input = {};
        try {
            await controller.getProfile(
                input as unknown as GetProfileInput,
                ''
            );
        } catch (e) {
            expect(mockPlainToClass).toHaveBeenCalled();
            expect(mockPlainToClass).toHaveBeenCalledWith(input);
            expect(mockValidate).toHaveBeenCalled();
            expect(mockValidate).toHaveBeenCalledWith(input);
            expect(e.message).toBe(
                API_ERROR_MESSAGES.GET_PROFILE_GENERIC_MESSAGE
            );
        }
    });
});
