import { SignupUseCase } from '../SignupUseCase';
import { SignupResponse } from '../interfaces/SignupResponse';

const input = {
    name: 'Test User',
    email: 'test@example.com',
    id: '123456789',
    password: 'hashedPassword',
    hasAddress: false,
    cpf: '12345678901',
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
        password: 'hashedPassword',
        hasAddress: false,
        cpf: '12345678901',
    },
    token: 'mockedToken',
};

const mockCheckExistenceByEmail = jest
    .fn()
    .mockImplementation(async (email: string): Promise<boolean> => {
        return email !== input.email;
    });

const mockGenerateToken = jest.fn().mockReturnValue(expectedResponse.token);

jest.mock('../../../../shared/services/authentication', () => {
    return {
        AuthenticatorManager: jest.fn().mockImplementation(() => ({
            generateToken: mockGenerateToken,
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
        // @ts-expect-error expect a class, I'm injecting a object with the same props
        const response = await signupUseCase.execute(input);
        expect(mockCheckExistenceByEmail).toHaveBeenCalledWith(input.email);
        expect(response).toEqual(expectedResponse);
    });
    it('should throw error by email already existed on database', async () => {
        try {
            // @ts-expect-error expect a class, I'm injecting a object with the same props
            await signupUseCase.execute({
                ...input,
                getUser: () => {
                    return {
                        name: 'Test User',
                        email: 'invalidEmails',
                        id: '123456789',
                        password: 'hashedPassword',
                        hasAddress: false,
                        cpf: '12345678901',
                    };
                },
            });
        } catch (e) {
            expect(e.message).toBe('This email is already registered');
        }
    });
});
