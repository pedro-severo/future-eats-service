import { HashManager } from '..';

describe('HashManager Service test', () => {
    let hashManager: HashManager;
    beforeEach(() => {
        hashManager = new HashManager();
    });
    it('should call hash', () => {
        const plainText = 'plainText';
        const result = hashManager.hash(plainText);
        expect(plainText).not.toBe(result);
    });
    it('should call compare with same parameters', () => {
        const parameter1 = 'bla';
        const parameter2 = hashManager.hash(parameter1);
        const result = hashManager.compare(parameter1, parameter2);
        expect(result).toBe(true);
    });
    it('should call compare with different parameters', () => {
        const parameter1 = 'bla';
        const parameter2 = 'ble';
        const result = hashManager.compare(parameter1, parameter2);
        expect(result).toBe(false);
    });
});
