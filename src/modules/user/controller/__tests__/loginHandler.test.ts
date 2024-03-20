import { LoginHandler } from './../loginHandler';
import { LoginInput } from '../inputs/LoginInput';
import { LoginUseCase } from '../../useCases/LoginUseCase';
import { LoginOutput } from '../outputs';
import { StatusCodes } from 'http-status-codes';

jest.mock('../../useCases/LoginUseCase');

const input: LoginInput = {
    email: 'test@example.com',
    password: 'password123',
};

const expectedResponse: LoginOutput = {
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

describe('loginHandler test', () => {
    let loginHandler: LoginHandler;
    let loginUseCaseMock: LoginUseCase;
    beforeEach(() => {
        loginUseCaseMock = new LoginUseCase();
        loginHandler = new LoginHandler(loginUseCaseMock);
    });
    it('should return a successful response', async () => {
        jest.spyOn(loginUseCaseMock, 'execute').mockResolvedValueOnce(
            expectedResponse.data
        );
        const result = await loginHandler.login(input);
        expect(result).toEqual(expectedResponse);
    });
    it('should validate input and throw error by missing email property', async () => {
        const invalidInput = {
            password: 'password123',
        };
        try {
            await loginHandler.login(invalidInput as unknown as LoginInput);
        } catch (error) {
            expect(error.message).toBe('Failed to validate input.');
        }
    });
    it('should validate input and throw error by invalid values on props', async () => {
        const invalidInput = {
            password: 'short',
            email: 'invalid',
        };
        try {
            await loginHandler.login(invalidInput as unknown as LoginInput);
        } catch (error) {
            expect(error.message).toBe('Failed to validate input.');
            expect(error.cause[0].value).toBe(invalidInput.email);
            expect(error.cause[1].value).toBe(invalidInput.password);
        }
    });
});
