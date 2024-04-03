import { SignupUseCase } from './../../useCases/SignupUseCase';
import { SignupController } from '../SignupController';
import { Output } from '../outputs';
import { StatusCodes } from 'http-status-codes';
import { SignupInput } from '../inputs/SignupInput';
import { UserRepository } from '../../repository/UserRepository';
import { SignupResponse } from '../../useCases/interfaces/SignupResponse';
import { DatabaseTestContext } from '../../../../shared/database/context';

jest.mock('../../useCases/SignupUseCase');
jest.mock('../../../../shared/database');

const input: SignupInput = {
    email: 'test@example.com',
    password: 'password123',
    cpf: '12043891600',
    name: 'Name',
};

const expectedResponse: Output<SignupResponse> = {
    status: StatusCodes.OK,
    data: {
        user: {
            name: 'Test User',
            email: 'test@example.com',
            id: '123456789',
            password: 'hashedPassword',
            hasAddress: false,
            cpf: '12345678901',
        },
        token: 'mockedToken',
    },
};

describe('SignupController test', () => {
    let signupController: SignupController;
    let signupUseCaseMock: SignupUseCase;
    let repositoryMock: UserRepository;
    let databaseMock: DatabaseTestContext;
    beforeEach(() => {
        databaseMock = new DatabaseTestContext();
        repositoryMock = new UserRepository(databaseMock);
        signupUseCaseMock = new SignupUseCase(repositoryMock);
        signupController = new SignupController(signupUseCaseMock);
    });
    it('should return a successful response', async () => {
        jest.spyOn(signupUseCaseMock, 'execute').mockResolvedValueOnce(
            expectedResponse.data
        );
        const result = await signupController.signup(input);
        expect(result).toEqual(expectedResponse);
    });
    it('should validate input and throw error by missing email property', async () => {
        const invalidInput = {
            password: 'password123',
        };
        try {
            await signupController.signup(
                invalidInput as unknown as SignupInput
            );
        } catch (error) {
            expect(error.message).toBe('Failed to validate input.');
        }
    });
    it('should validate input and throw error by invalid values on props', async () => {
        const invalidInput = {
            cpf: 'invalidCpf',
            name: 0,
            password: 'short',
            email: 'invalidEmail',
        };
        try {
            await signupController.signup(
                invalidInput as unknown as SignupInput
            );
        } catch (error) {
            expect(error.message).toBe('Failed to validate input.');
            expect(error.cause[0].value).toBe(invalidInput.name);
            expect(error.cause[1].value).toBe(invalidInput.email);
            expect(error.cause[2].value).toBe(invalidInput.cpf);
            expect(error.cause[3].value).toBe(invalidInput.password);
        }
    });
});
