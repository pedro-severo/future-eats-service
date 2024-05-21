import { AuthenticatorManager } from '..';
import { generateId } from '../../uuid';
import { USER_ROLES } from '../interfaces';

const mockedToken =
    'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjllZmFhM2VmLTY4MTItNDlmNi05ZWJmLTZhYTA5NWIxNDg1NSIsInJvbGUiOiJVU0VSIiwiaWF0IjoxNzE1ODg2ODY1LCJleHAiOjE3MjEwNzA4NjV9.hU650R-NwfHQw9sGwy5euOKd1MGjjV4DFZnaLpGX13c';
const mockedId = '9efaa3ef-6812-49f6-9ebf-6aa095b14855';

describe('AuthenticatorManager class test', () => {
    let authenticatorManager: AuthenticatorManager;
    const id = generateId();
    beforeEach(() => {
        authenticatorManager = new AuthenticatorManager();
    });
    it('should generate a token', () => {
        const token = authenticatorManager.generateToken({
            id,
            role: USER_ROLES.USER,
        });
        expect(typeof token).toBe('string');
        expect(id).not.toBe(token);
    });
    it('should generate a token and get data from this token', () => {
        const token = authenticatorManager.generateToken({
            id,
            role: USER_ROLES.USER,
        });
        const data = authenticatorManager.getTokenData(token);
        expect(id).toBe(data?.id);
        expect(data?.role).toBe(USER_ROLES.USER);
    });
    it('should check token with correspondence between parameters (true case)', () => {
        const hasAuthentication = authenticatorManager.checkToken(
            mockedToken,
            mockedId,
            USER_ROLES.USER
        );
        expect(hasAuthentication).toBe(true);
    });
    it('should check token without correspondence between ids (false case)', () => {
        const hasAuthentication = authenticatorManager.checkToken(
            mockedToken,
            'invalidId',
            USER_ROLES.USER
        );
        expect(hasAuthentication).toBe(false);
    });
    it('should check token without correspondence between roles (false case)', () => {
        const hasAuthentication = authenticatorManager.checkToken(
            mockedToken,
            mockedId,
            USER_ROLES.RESTAURANT_OWNER
        );
        expect(hasAuthentication).toBe(false);
    });
    it('should check token without correspondence between roles and ids (false case)', () => {
        const hasAuthentication = authenticatorManager.checkToken(
            mockedToken,
            'invalidId',
            USER_ROLES.RESTAURANT_OWNER
        );
        expect(hasAuthentication).toBe(false);
    });
    it('should fail the checking by invalid token (false case)', () => {
        try {
            authenticatorManager.checkToken(
                'invalidToken',
                mockedId,
                USER_ROLES.USER
            );
        } catch (e) {
            expect(typeof e.message).toBe('string');
        }
    });
    it('should reproduce a getTokenData error by undefined input', () => {
        try {
            const invalidInput = undefined;
            authenticatorManager.getTokenData(
                invalidInput as unknown as string
            );
        } catch (e) {
            expect(typeof e.message).toBe('string');
        }
    });
});
