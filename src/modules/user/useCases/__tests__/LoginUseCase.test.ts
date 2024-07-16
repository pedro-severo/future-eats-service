import { LoginUseCase } from '../../useCases/LoginUseCase';
import { LoginResponse } from '../../useCases/interfaces/LoginResponse';
import { LoginInput } from '../../controllers/inputs/LoginInput';
import { API_ERROR_MESSAGES } from '../../apiErrorMessages';
import { User } from '../../entities/User';
import { mapUserEntityToResponse } from '../mappers/mapUserEntityToResponse';

const mockUser = new User(
    'id',
    'USer Namer',
    'test@example.com',
    'password123',
    false,
    'cpf'
);

const mockErrorLog = jest.fn();

jest.mock('../../../../logger', () => ({
    logger: {
        info: jest.fn(),
        // @ts-expect-error test file
        error: (e) => mockErrorLog(e),
    },
}));

jest.mock('../mappers/mapUserEntityToResponse', () => ({
    mapUserEntityToResponse: jest.fn().mockImplementation((user) => {
        if (user.id === 'invalidId') {
            return {};
        }
        return mockUser.getUser();
    }),
}));

const input: LoginInput = {
    email: 'test@example.com',
    password: 'password123',
};

const expectedResponse: LoginResponse = {
    user: mapUserEntityToResponse(mockUser.getUser()),
    token: 'mockedToken',
};

const mockGetUserByEmail = jest
    .fn()
    .mockImplementation(async (email: string): Promise<User | undefined> => {
        if (email === 'invalidUser@email.com') {
            throw new Error('Foo');
        } else if (email === 'test@example.com') {
            return mockUser;
        } else {
            return undefined;
        }
    });

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
const mockRemoveBearer = jest.fn().mockImplementation((token) => token);
jest.mock('../../../../shared/services/authentication', () => {
    return {
        AuthenticatorManager: jest.fn().mockImplementation(() => ({
            generateToken: mockGenerateToken,
            removeBearer: mockRemoveBearer,
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
            mockUser.getUser().password
        );
        expect(response).toEqual(expectedResponse);
    });
    it('should throw error by incorrect password', async () => {
        try {
            await loginUseCase.execute(input.email, 'invalidPassword');
        } catch (e) {
            expect(e.message).toBe(API_ERROR_MESSAGES.INCORRECT_PASSWORD);
        }
    });
    it('should throw error by user not found', async () => {
        try {
            await loginUseCase.execute('invalidEmail', input.password);
        } catch (e) {
            expect(e.message).toBe(API_ERROR_MESSAGES.EMAIL_NOT_REGISTERED);
        }
    });
    it('should throw generic error of execute method', async () => {
        try {
            await loginUseCase.execute('invalidUser@email.com', input.password);
        } catch (e) {
            expect(e.message).toBe(
                API_ERROR_MESSAGES.LOGIN_GENERIC_ERROR_MESSAGE
            );
        }
    });
});
