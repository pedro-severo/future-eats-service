import { LoginUseCase } from '../../useCases/LoginUseCase';
import { LoginResponse } from '../../useCases/interfaces/LoginResponse';
import { LoginInput } from '../../controllers/inputs/LoginInput';
import { UserResponse } from '../interfaces/UserResponse';

jest.mock('../mappers/mapUserEntityToResponse', () => ({
    mapUserEntityToResponse: jest.fn().mockResolvedValue({
        name: 'Test User',
        email: 'test@example.com',
        id: '123456789',
        password: 'hashedPassword',
        hasAddress: false,
        cpf: '12345678901',
    }),
}));

const input: LoginInput = {
    email: 'test@example.com',
    password: 'password123',
};

const expectedResponse: LoginResponse = {
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

const mockGetUserByEmail = jest
    .fn()
    .mockImplementation(
        async (email: string): Promise<UserResponse | undefined> => {
            if (email === 'test@example.com') {
                return {
                    name: 'Test User',
                    email: 'test@example.com',
                    id: '123456789',
                    password: 'hashedPassword',
                    hasAddress: false,
                    cpf: '12345678901',
                };
            } else {
                return undefined;
            }
        }
    );

const mockCompare = jest.fn().mockImplementation(
    async (
        passwordToCheck: string,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        _hashedPassword: string
    ): Promise<boolean> => {
        return passwordToCheck === input.password;
    }
);

jest.mock('../../../../shared/services/hash', () => {
    return {
        HashManager: jest.fn().mockImplementation(() => ({
            compare: mockCompare,
        })),
    };
});

const mockGenerateToken = jest.fn().mockReturnValue(expectedResponse.token);

jest.mock('../../../../shared/services/authentication', () => {
    return {
        AuthenticatorManager: jest.fn().mockImplementation(() => ({
            generateToken: mockGenerateToken,
        })),
    };
});

describe('LoginUseCase test', () => {
    let loginUseCase: LoginUseCase;
    beforeEach(() => {
        // @ts-expect-error dependency injection
        loginUseCase = new LoginUseCase({
            getUserByEmail: (email: string) => mockGetUserByEmail(email),
        });
    });
    it('should run execute method correctly', async () => {
        const response = await loginUseCase.execute(
            input.email,
            input.password
        );
        expect(mockGetUserByEmail).toHaveBeenCalledWith(input.email);
        expect(mockCompare).toHaveBeenCalledWith(
            input.password,
            expectedResponse.user.password
        );
        expect(response).toEqual(expectedResponse);
    });
    it('should throw error by incorrect password', async () => {
        try {
            await loginUseCase.execute(input.email, 'invalidPassword');
        } catch (e) {
            expect(e.message).toBe('Incorrect password');
        }
    });
    it('should throw error by incorrect email', async () => {
        try {
            await loginUseCase.execute('invalidEmail', input.password);
        } catch (e) {
            expect(e.message).toBe('User not found');
        }
    });
});
