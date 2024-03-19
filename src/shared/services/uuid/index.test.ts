import { generateId } from '.';

describe('generateId test', () => {
    it('ensure uuid utilization by generateId function', () => {
        const result = generateId();
        expect(typeof result).toBe('string');
    });
});
