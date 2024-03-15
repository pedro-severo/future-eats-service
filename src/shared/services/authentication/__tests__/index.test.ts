import { AuthenticatorManager } from '..';
import { generateId } from '../../uuid';

describe('AuthenticatorManager class test', () => {
    let authenticatorManager: AuthenticatorManager;
    const id = generateId();
    beforeEach(() => {
        authenticatorManager = new AuthenticatorManager();
    });
    it('should generate a token', () => {
        const token = authenticatorManager.generateToken({ id });
        expect(typeof token).toBe('string');
        expect(id).not.toBe(token);
    });
    it('should generate a token and get data from this token', () => {
        const token = authenticatorManager.generateToken({ id });
        const data = authenticatorManager.getTokenData(token);
        expect(id).toBe(data?.id);
    });
    it('', () => {
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
