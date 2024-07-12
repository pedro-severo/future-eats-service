import { AuthenticateUseCase } from './../AuthenticateUseCase';
import { AuthenticatorManager } from '../../../../shared/services/authentication';
import { UserRepository } from '../../repository/UserRepository';
import { API_ERROR_MESSAGES } from '../../apiErrorMessages';
import { USER_ERROR_MESSAGES } from '../constants/errorMessages';
import { User } from '../../entities/User';
import { USER_ROLES } from '../../../../shared/services/authentication/interfaces';

const userId = 'userId';

const mockErrorLog = jest.fn();
const mockInfoLog = jest.fn();

jest.mock('../../../../logger', () => ({
    logger: {
        // @ts-expect-error test file
        info: (e) => mockInfoLog(e),
        // @ts-expect-error test file
        error: (e) => mockErrorLog(e),
    },
}));

const mockUser = new User(
    userId,
    'name',
    'email',
    'password',
    false,
    'cpf',
    USER_ROLES.USER
);

const mockGetUser = jest.fn().mockImplementation((id) => {
    if (id === userId) return mockUser;
    return undefined;
});

const mockRepository = {
    getUser: mockGetUser,
};

const mockGetTokenData = jest.fn().mockImplementation((token) => {
    if (token === 'validToken') {
        return {
            id: userId,
            role: 'role',
        };
    }
    if (token === 'incorrectData') {
        return {
            id: '',
            user: '',
        };
    }
    if (token === 'invalidToken') {
        return undefined;
    }
});

const mockAuthenticatorManager = {
    getTokenData: mockGetTokenData,
};

describe('AuthenticateUseCase test', () => {
    let useCase: AuthenticateUseCase;
    beforeEach(() => {
        useCase = new AuthenticateUseCase(
            mockRepository as unknown as UserRepository,
            mockAuthenticatorManager as unknown as AuthenticatorManager
        );
    });
    afterEach(() => {
        jest.clearAllMocks();
    });
    it('should execute use case correctly', async () => {
        const response = await useCase.execute({
            token: 'validToken',
        });
        expect(mockInfoLog).toHaveBeenCalled();
        expect(mockGetTokenData).toHaveBeenCalledWith('validToken');
        expect(mockGetUser).toHaveBeenCalledWith(userId);
        expect(response.user.id).toBe(userId);
    });
    it('should throw error by invalid token', async () => {
        try {
            await useCase.execute({
                token: 'invalidToken',
            });
        } catch (e) {
            expect(e.message).toBe(
                API_ERROR_MESSAGES.AUTHENTICATION_ERROR_MESSAGE
            );
            expect(mockErrorLog).toHaveBeenCalledWith(
                USER_ERROR_MESSAGES.NOT_FOUND
            );
        }
    });
    it('should throw error by incorrect data from token', async () => {
        try {
            await useCase.execute({
                token: 'incorrectData',
            });
        } catch (e) {
            expect(e.message).toBe(
                API_ERROR_MESSAGES.AUTHENTICATION_ERROR_MESSAGE
            );
            expect(mockErrorLog).toHaveBeenCalledWith(
                USER_ERROR_MESSAGES.NOT_FOUND
            );
        }
    });
});
