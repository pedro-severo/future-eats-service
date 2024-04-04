import { DatabaseContext } from '../context';

const mockInitializeApp = jest.fn();
const mockCert = jest.fn();
const mockGetDatabase = jest.fn();

jest.mock('firebase-admin/app', () => ({
    initializeApp: () => mockInitializeApp(),
    cert: () => mockCert(),
}));

jest.mock('firebase-admin/firestore', () => ({
    getFirestore: () => mockGetDatabase(),
}));

describe('DatabaseContext test', () => {
    let databaseContext: DatabaseContext;
    beforeAll(() => {
        databaseContext = new DatabaseContext();
    });
    it('should test constructor callings', () => {
        expect(mockInitializeApp).toHaveBeenCalled();
        expect(mockCert).toHaveBeenCalled();
    });
    it('should reproduce getContext method correctly', () => {
        databaseContext.getContext();
        expect(mockGetDatabase).toHaveBeenCalled();
    });
});
