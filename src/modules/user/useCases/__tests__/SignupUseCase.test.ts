import { API_ERROR_MESSAGES } from '../../apiErrorMessages';
import { SignupUseCase } from '../SignupUseCase';
import { SignupResponse } from '../interfaces/SignupResponse';

const mockErrorLog = jest.fn();

jest.mock('../../../../logger', () => ({
    logger: {
        info: jest.fn(),
        // @ts-expect-error test file
        error: (e) => mockErrorLog(e),
    },
}));

const input = {
    name: 'Test User',
    email: 'test@example.com',
    id: '123456789',
    password: 'hashedPassword',
    hasAddress: false,
    cpf: '12345678901',
    role: 'USER',
    getUser: () => {
        return {
            name: 'Test User',
            email: 'test@example.com',
            id: '123456789',
            password: 'hashedPassword',
            hasAddress: false,
            cpf: '12345678901',
        };
    },
};

const expectedResponse: SignupResponse = {
    user: {
        name: 'Test User',
        email: 'test@example.com',
        id: '123456789',
        hasAddress: false,
        cpf: '12345678901',
    },
    token: 'mockedToken',
};

const mockCheckExistenceByEmail = jest
    .fn()
    .mockImplementation(async (email: string): Promise<boolean> => {
        return email !== input.getUser().email;
    });

const mockGenerateToken = jest.fn().mockReturnValue(expectedResponse.token);
const mockRemoveBearer = jest.fn().mockImplementation((token) => token);
jest.mock('../../../../shared/services/authentication', () => {
    return {
        AuthenticatorManager: jest.fn().mockImplementation(() => ({
            generateToken: mockGenerateToken,
            removeBearer: mockRemoveBearer,
        })),
    };
});

describe('SignupUseCase test', () => {
    let signupUseCase: SignupUseCase;
    beforeEach(() => {
        // @ts-expect-error dependency injection
        signupUseCase = new SignupUseCase({
            checkUserExistenceByEmail: (email: string) =>
                mockCheckExistenceByEmail(email),
            createUser: jest.fn(),
        });
    });
    it('should run execute method correctly', async () => {
        // @ts-expect-error expect a class, It's injecting an object with the same props
        const response = await signupUseCase.execute(input);
        expect(mockCheckExistenceByEmail).toHaveBeenCalledWith(input.email);
        expect(response).toEqual(expectedResponse);
    });
    it('should throw error by email already existed on database', async () => {
        try {
            await signupUseCase.execute({
                ...input,
                // @ts-expect-error expect a class, It's injecting an object with the same props
                getUser: () => {
                    return {
                        name: 'Test User',
                        email: 'invalidEmails',
                        id: '123456789',
                        password: 'hashedPassword',
                        hasAddress: false,
                        cpf: '12345678901',
                        role: 'USER',
                    };
                },
            });
        } catch (e) {
            expect(mockErrorLog).toHaveBeenCalledWith(
                API_ERROR_MESSAGES.EMAIL_ALREADY_REGISTERED
            );
            expect(e.message).toBe(API_ERROR_MESSAGES.EMAIL_ALREADY_REGISTERED);
        }
    });
    it('should throw a generic error in execute', async () => {
        // @ts-expect-error dependency injection
        signupUseCase = new SignupUseCase({
            checkUserExistenceByEmail: (email: string) =>
                mockCheckExistenceByEmail(email),
            createUser: jest.fn().mockRejectedValue('Foo'),
        });
        try {
            // @ts-expect-error expect a class, It's injecting an object with the same prop
            await signupUseCase.execute(input);
        } catch (e) {
            expect(e.message).toBe(
                API_ERROR_MESSAGES.SIGNUP_GENERIC_ERROR_MESSAGE
            );
        }
    });
});
