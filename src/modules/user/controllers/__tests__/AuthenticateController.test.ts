import { StatusCodes } from 'http-status-codes';
import { DatabaseTestContext } from '../../../../shared/database/context';
import { AuthenticatorManager } from '../../../../shared/services/authentication';
import { API_ERROR_MESSAGES } from '../../apiErrorMessages';
import { UserRepository } from '../../repository/UserRepository';
import { AuthenticateUseCase } from '../../useCases/AuthenticateUseCase';
import { AuthenticateController } from '../AuthenticateController';
import { AuthenticateInput } from '../inputs/AuthenticateInput';

const mockPlainToClass = jest
    .fn()
    .mockImplementation((input: AuthenticateInput) => input);

jest.mock('class-transformer', () => {
    return {
        plainToClass: (AuthenticateInput: any, input: AuthenticateInput) =>
            mockPlainToClass(input),
    };
});

const mockExecute = jest.fn().mockResolvedValueOnce({});

const errors = [{ property: 'token', value: undefined }];
const mockValidate = jest
    .fn()
    .mockImplementation((input: AuthenticateInput) => {
        if (typeof input.token !== 'string') return errors;
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

const mockLogError = jest.fn();

const mockLogInfo = jest.fn();

jest.mock('../../../../logger', () => {
    return {
        logger: {
            error: () => mockLogError(),
            info: () => mockLogInfo(),
        },
    };
});
describe('AuthenticateController', () => {
    let controller: AuthenticateController;
    let useCase: AuthenticateUseCase;
    let repository: UserRepository;
    let database: DatabaseTestContext;
    beforeEach(() => {
        database = new DatabaseTestContext();
        repository = new UserRepository(database);
        useCase = new AuthenticateUseCase(
            repository,
            new AuthenticatorManager()
        );
        controller = new AuthenticateController(useCase);
        jest.clearAllMocks();
    });
    it('should run controller method correctly', async () => {
        const input: AuthenticateInput = {
            token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1MGE2YjIxLWM3NjktNDdhZC1iMzdlLWRmZTc0ZWIxOWZmOCIsInJvbGUiOiJVU0VSIiwiaWF0IjoxNzE5NTk1Njg2LCJleHAiOjE3MjQ3Nzk2ODZ9.Q_9hDRBc8R3yzs7eOSRjJqmqgCP20lz89cwIcV8qzMA',
        };
        jest.spyOn(useCase, 'execute').mockImplementation(
            (input: AuthenticateInput) => mockExecute(input)
        );
        const output = await controller.authenticate(input);
        expect(mockPlainToClass).toHaveBeenCalled();
        expect(mockPlainToClass).toHaveBeenCalledWith(input);
        expect(mockValidate).toHaveBeenCalled();
        expect(mockValidate).toHaveBeenCalledWith(input);
        expect(mockExecute).toHaveBeenCalled();
        expect(mockExecute).toHaveBeenCalledWith(input);
        expect(output).toEqual({
            status: StatusCodes.ACCEPTED,
            data: {},
        });
    });
    it('should throw authentication error message from api error messages and log an error', async () => {
        const input = {};
        try {
            await controller.authenticate(
                input as unknown as AuthenticateInput
            );
        } catch (e) {
            expect(mockLogError).toHaveBeenCalled();
            expect(e.message).toBe(
                API_ERROR_MESSAGES.AUTHENTICATION_ERROR_MESSAGE
            );
        }
    });
    it('should throw authentication error message from api error messages and log an error', async () => {
        const input = {
            token: 2,
        };
        try {
            await controller.authenticate(
                input as unknown as AuthenticateInput
            );
        } catch (e) {
            expect(mockLogError).toHaveBeenCalled();
            expect(e.message).toBe(
                API_ERROR_MESSAGES.AUTHENTICATION_ERROR_MESSAGE
            );
        }
    });
});
