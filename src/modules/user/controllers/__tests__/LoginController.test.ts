import { Output } from './../outputs/index';
import { LoginController } from '../LoginController';
import { LoginInput } from '../inputs/LoginInput';
import { LoginUseCase } from '../../useCases/LoginUseCase';
import { StatusCodes } from 'http-status-codes';
import { UserRepository } from '../../repository/UserRepository';
import { LoginResponse } from '../../useCases/interfaces/LoginResponse';
import { DatabaseTestContext } from '../../../../shared/database/context';
import { API_ERROR_MESSAGES } from '../../apiErrorMessages';

jest.mock('../../useCases/LoginUseCase');
jest.mock('../../../../shared/database');

const input: LoginInput = {
    email: 'test@example.com',
    password: 'password123',
};

const expectedResponse: Output<LoginResponse> = {
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

describe('LoginController test', () => {
    let loginController: LoginController;
    let loginUseCaseMock: LoginUseCase;
    let repositoryMock: UserRepository;
    let databaseMock: DatabaseTestContext;
    beforeEach(() => {
        databaseMock = new DatabaseTestContext();
        repositoryMock = new UserRepository(databaseMock);
        loginUseCaseMock = new LoginUseCase(repositoryMock);
        loginController = new LoginController(loginUseCaseMock);
    });
    it('should return a successful response', async () => {
        jest.spyOn(loginUseCaseMock, 'execute').mockResolvedValueOnce(
            expectedResponse.data
        );
        const result = await loginController.login(input);
        expect(result).toEqual(expectedResponse);
    });
    it('should validate input and throw error by missing email property', async () => {
        const invalidInput = {
            password: 'password123',
        };
        try {
            await loginController.login(invalidInput as unknown as LoginInput);
        } catch (error) {
            expect(error.message).toBe(
                API_ERROR_MESSAGES.LOGIN_GENERIC_ERROR_MESSAGE
            );
        }
    });
    it('should validate input and throw error by invalid values on props', async () => {
        const invalidInput = {
            password: 'short',
            email: 'invalid',
        };
        try {
            await loginController.login(invalidInput as unknown as LoginInput);
        } catch (error) {
            expect(error.message).toBe(
                API_ERROR_MESSAGES.LOGIN_GENERIC_ERROR_MESSAGE
            );
        }
    });
});
