// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { Database } from '..';

const mockInitializeApp = jest.fn();
const mockCert = jest.fn();

jest.mock('firebase-admin/app', () => ({
    initializeApp: () => mockInitializeApp(),
    cert: () => mockCert(),
}));

jest.mock('firebase-admin/firestore', () => ({
    getFirestore: jest.fn(() => ({
        collection: jest.fn(() => ({
            doc: jest.fn(() => ({
                set: jest.fn(),
                get: jest.fn(() => ({
                    exists: true,
                    data: jest.fn(),
                })),
                update: jest.fn(),
                collection: jest.fn(() => ({
                    doc: jest.fn(() => ({
                        set: jest.fn(),
                    })),
                })),
            })),
            where: jest.fn(() => ({
                get: jest.fn(() => ({
                    empty: false,
                    forEach: jest.fn((callback) => {
                        callback({
                            data: jest.fn(() => ({ id: '123', name: 'Test' })),
                        });
                    }),
                })),
            })),
        })),
    })),
}));

class DummyService extends Database {
    protected getCollectionName(): string {
        return 'users';
    }
}

const user = {
    name: 'Test User',
    email: 'test@example.com',
    id: '123456789',
    password: 'hashedPassword',
    hasAddress: false,
    cpf: '12345678901',
};

describe('Database', () => {
    let database: Database;

    beforeAll(() => {
        database = new DummyService();
    });
    it('should initialize Firebase app and Firestore', () => {
        expect(database.db).toBeDefined();
        expect(mockInitializeApp).toHaveBeenCalled();
        expect(mockCert).toHaveBeenCalled();
    });
    it('should call insert method', async () => {
        await database.insert(user);
        expect(database.db.doc).toHaveBeenCalled();
        expect(database.db.doc).toHaveBeenCalledWith(user.id);
    });
    it('should call checkDataExistence method', async () => {
        await database.checkDataExistence(user.id);
        expect(database.db.doc).toHaveBeenCalled();
        expect(database.db.doc).toHaveBeenCalledWith(user.id);
    });
    it('should call getDataByField method', async () => {
        const response = await database.getDataByField('email', user.email);
        expect(database.db.where).toHaveBeenCalled();
        expect(database.db.where).toHaveBeenCalledWith(
            'email',
            '==',
            user.email
        );
        expect(response).toEqual({ id: '123', name: 'Test' });
    });
    it('should call update method', async () => {
        await database.update(user.id, user);
        expect(database.db.doc).toHaveBeenCalled();
        expect(database.db.doc).toHaveBeenCalledWith(user.id);
    });
    it('should call insertSubCollectionItem method', async () => {
        await database.insertSubCollectionItem('subCollection', user.id, user);
        expect(database.db.doc).toHaveBeenCalled();
        expect(database.db.doc).toHaveBeenCalledWith(user.id);
    });
    it('should call checkDataExistenceByField method', async () => {
        await database.checkDataExistenceByField('email', user.email);
        expect(database.db.where).toHaveBeenCalled();
        expect(database.db.where).toHaveBeenCalledWith(
            'email',
            '==',
            user.email
        );
    });
    it('should call getData method', async () => {
        await database.getData(user.id);
        expect(database.db.doc).toHaveBeenCalled();
        expect(database.db.doc).toHaveBeenCalledWith(user.id);
    });
});
