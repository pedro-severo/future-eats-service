import { StatusCodes } from 'http-status-codes';
import { DatabaseTestContext } from '../../../../shared/database/context';
import { AuthenticatorManager } from '../../../../shared/services/authentication';
import { UserRepository } from '../../repository/UserRepository';
import { UpdateAddressUseCase } from '../../useCases/UpdateAddressUseCase';
import { UpdateAddressController } from '../UpdateAddressController';
import { UpdateAddressInput } from '../inputs/UpdateAddressInput';
import { ValidationError } from 'class-validator';
import { API_ERROR_MESSAGES } from '../../apiErrorMessages';

const mockPlainToClass = jest
    .fn()
    .mockImplementation((input: UpdateAddressInput) => input);

jest.mock('class-transformer', () => {
    return {
        plainToClass: (UpdateAddressInput: any, input: UpdateAddressInput) =>
            mockPlainToClass(input),
    };
});

const mockValidate = jest
    .fn()
    .mockImplementation((input: UpdateAddressInput) => {
        const errors: ValidationError[] = [
            { property: 'userId', value: input.userId },
        ];
        if (typeof input.userId !== 'string') return errors;
        if (typeof input.addressId !== 'string') return errors;
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

describe('UpdateAddressController suit test', () => {
    let controller: UpdateAddressController;
    let useCase: UpdateAddressUseCase;
    let repositoryMock: UserRepository;
    let databaseMock: DatabaseTestContext;
    beforeEach(() => {
        databaseMock = new DatabaseTestContext();
        repositoryMock = new UserRepository(databaseMock);
        useCase = new UpdateAddressUseCase(
            repositoryMock,
            new AuthenticatorManager()
        );
        controller = new UpdateAddressController(useCase);
        jest.clearAllMocks();
    });
    it('should run controller execution correctly', async () => {
        const input: UpdateAddressInput = {
            userId: 'userId',
            addressId: 'addressId',
            city: 'city',
        };
        jest.spyOn(useCase, 'execute').mockImplementation(
            (input: UpdateAddressInput, token: string) =>
                mockExecute(input, token)
        );
        const result = await controller.updateAddress(input, '');
        expect(mockPlainToClass).toHaveBeenCalled();
        expect(mockPlainToClass).toHaveBeenCalledWith(input);
        expect(mockValidate).toHaveBeenCalled();
        expect(mockValidate).toHaveBeenCalledWith(input);
        expect(mockExecute).toHaveBeenCalled();
        expect(mockExecute).toHaveBeenCalledWith(input, '');
        expect(mockLogInfo).toHaveBeenCalledTimes(2);
        expect(result).toEqual({
            status: StatusCodes.OK,
            data: {},
        });
    });
    it('should throw error by undefined userId prop', async () => {
        const input = {
            addressId: 'addressId',
        };
        try {
            await controller.updateAddress(
                input as unknown as UpdateAddressInput,
                ''
            );
            expect(mockLogError).toHaveBeenCalled();
        } catch (e) {
            expect(e.message).toBe(
                API_ERROR_MESSAGES.UPDATE_ADDRESS_GENERIC_ERROR
            );
        }
    });
    it('should throw error by undefined addressId prop', async () => {
        const input = {
            userId: 'addressId',
        };
        try {
            await controller.updateAddress(
                input as unknown as UpdateAddressInput,
                ''
            );
            expect(mockLogError).toHaveBeenCalled();
        } catch (e) {
            expect(e.message).toBe(
                API_ERROR_MESSAGES.UPDATE_ADDRESS_GENERIC_ERROR
            );
        }
    });
});
