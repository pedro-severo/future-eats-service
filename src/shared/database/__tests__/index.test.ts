// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { Database } from '..';

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

const mockCollection = {
    collection: jest.fn().mockReturnThis(),
    doc: jest.fn(() => {
        return {
            set: jest.fn(),
            get: jest.fn(),
            update: jest.fn(),
            collection: jest.fn(() => {
                return {
                    doc: jest.fn(() => ({ set: jest.fn(), get: jest.fn() })),
                };
            }),
        };
    }),
    get: jest.fn().mockResolvedValue({}),
    where: jest.fn(() => {
        return {
            get: jest.fn(() => [
                { data: jest.fn(() => ({ id: '123', name: 'Test' })) },
            ]),
        };
    }),
};

const mockFirestore = {
    collection: jest.fn(() => mockCollection),
};

const mockContext = {
    getContext: jest.fn().mockReturnValue(mockFirestore),
};
class DummyService extends Database {
    constructor() {
        super(mockContext.getContext());
    }
    protected getCollectionName(): string {
        return 'users';
    }
}

const user = {
    name: 'Test User',
    email: 'test@example.com',
    id: '123456789',
    password: 'hashedPassword',
    mainAddressId: 'addressId',
    hasAddress: false,
    cpf: '12345678901',
    bla: undefined,
};

describe('Database', () => {
    let database: Database;

    beforeAll(() => {
        database = new DummyService(mockContext);
    });
    it('should initialize Firebase app and Firestore', () => {
        expect(database.db).toBeDefined();
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
    it('should call getSubCollectionData', async () => {
        await database.getSubCollectionData(
            'subCollection',
            user.id,
            user.mainAddressId
        );
        expect(database.db.doc).toHaveBeenCalled();
        expect(database.db.doc).toHaveBeenCalledWith(user.id);
    });
});
