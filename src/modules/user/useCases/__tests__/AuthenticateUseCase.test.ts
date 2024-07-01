import { AuthenticateUseCase } from './../AuthenticateUseCase';
import { AuthenticatorManager } from '../../../../shared/services/authentication';
import { UserRepository } from '../../repository/UserRepository';
import { API_ERROR_MESSAGES } from '../../apiErrorMessages';
import { USER_ERROR_MESSAGES } from '../constants/errorMessages';

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

const mockCheckUserExistence = jest.fn().mockImplementation((id) => {
    if (id === userId) return true;
    return false;
});

const mockRepository = {
    checkUserExistence: mockCheckUserExistence,
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
        expect(mockCheckUserExistence).toHaveBeenCalledWith(userId);
        expect(response.isAuthenticated).toBe(true);
        expect(response.role).toBe('role');
        expect(response.id).toBe(userId);
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
                API_ERROR_MESSAGES.AUTHENTICATION_ERROR_MESSAGE
            );
        }
    });
});
