import { ValidationError } from 'class-validator';
import { DatabaseTestContext } from '../../../../shared/database/context';
import { AuthenticatorManager } from '../../../../shared/services/authentication';
import { UserRepository } from '../../repository/UserRepository';
import { GetAddressUseCase } from '../../useCases/GetAddressUseCase';
import { GetAddressController } from '../GetAddressController';
import { GetAddressInput } from '../inputs/GetAddressInput';
import { API_ERROR_MESSAGES } from '../../apiErrorMessages';
import { StatusCodes } from 'http-status-codes';

const mockPlainToClass = jest
    .fn()
    .mockImplementation((input: GetAddressInput) => input);

jest.mock('class-transformer', () => {
    return {
        plainToClass: (GetProfileInput: any, input: GetAddressInput) =>
            mockPlainToClass(input),
    };
});

const mockValidate = jest.fn().mockImplementation((input: GetAddressInput) => {
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

describe('GetAddressController', () => {
    let controller: GetAddressController;
    let useCase: GetAddressUseCase;
    let repository: UserRepository;
    let database: DatabaseTestContext;
    beforeEach(() => {
        database = new DatabaseTestContext();
        repository = new UserRepository(database);
        useCase = new GetAddressUseCase(repository, new AuthenticatorManager());
        controller = new GetAddressController(useCase);
    });
    it('should run controller method correctly', async () => {
        const input: GetAddressInput = {
            userId: 'userId',
        };
        jest.spyOn(useCase, 'execute').mockImplementation(
            (input: GetAddressInput, token: string) => mockExecute(input, token)
        );
        const output = await controller.getAddress(input, '');
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
    it('should throw error by invalid userId in input', async () => {
        const input = {
            userId: 2,
        };
        try {
            await controller.getAddress(
                input as unknown as GetAddressInput,
                ''
            );
        } catch (e) {
            expect(e.message).toBe(
                API_ERROR_MESSAGES.GET_ADDRESS_GENERIC_MESSAGE
            );
        }
    });
    it('should throw error by invalid address id input', async () => {
        const input = {
            userId: 'dasdasd',
            addressId: 23,
        };
        try {
            await controller.getAddress(
                input as unknown as GetAddressInput,
                ''
            );
        } catch (e) {
            expect(e.message).toBe(
                API_ERROR_MESSAGES.GET_ADDRESS_GENERIC_MESSAGE
            );
        }
    });
});
