// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { Database } from '../../../../shared/database';
import { DatabaseTestContext } from '../../../../shared/database/context';
import { UserRepository } from '../UserRepository';
import { USER_COLLECTIONS } from '../interfaces';

jest.mock('../../../../shared/database');

const user = {
    name: 'Test User',
    email: 'test@example.com',
    id: '123456789',
    password: 'hashedPassword',
    hasAddress: false,
    cpf: '12345678901',
    mainAddressId: 'addressId',
};

const userAddress = {
    id: 'addressId',
    city: 'Lisbon',
    complement: '1D',
    state: 'MG',
    streetNumber: '123',
    streetName: 'Guajajaras',
    zone: 'Barreiro',
};

describe('UserRepository test', () => {
    let userRepository: UserRepository;
    const mockInsert = jest.fn();
    const mockUpdate = jest.fn();
    const mockGetSubCollectionData = jest
        .fn()
        .mockImplementation((collection, userId, addressId) => {
            if (userId === user.id && addressId === userAddress.id)
                return userAddress;
        });
    let databaseMock: DatabaseTestContext;
    beforeEach(() => {
        databaseMock = new DatabaseTestContext();
        userRepository = new UserRepository(databaseMock);
        jest.spyOn(Database.prototype, 'checkDataExistence').mockImplementation(
            (field, email: string) => {
                return email == user.email;
            }
        );
        jest.spyOn(Database.prototype, 'checkDataExistence').mockImplementation(
            (field, email: string) => {
                return email == user.email;
            }
        );
        jest.spyOn(
            Database.prototype,
            'checkDataExistenceByField'
        ).mockImplementation((field, email: string) => {
            return email == user.email;
        });
        jest.spyOn(Database.prototype, 'checkDataExistence').mockImplementation(
            (id) => {
                return id == user.id;
            }
        );
        jest.spyOn(Database.prototype, 'getDataByField').mockImplementation(
            (field, email) => {
                if (email === user.email) return user;
            }
        );
        jest.spyOn(Database.prototype, 'getData').mockImplementation((id) => {
            if (id === user.id) return user;
        });
        jest.spyOn(Database.prototype, 'insert').mockImplementation((user) => {
            mockInsert(user);
        });
        jest.spyOn(
            Database.prototype,
            'insertSubCollectionItem'
        ).mockImplementation((collection, userId, userAddress) => {
            mockInsert(USER_COLLECTIONS.USER_ADDRESS, userId, userAddress);
        });
        jest.spyOn(Database.prototype, 'update').mockImplementation(
            (userId, { hasAddress, mainAddressId }) => {
                mockUpdate(userId, { hasAddress, mainAddressId });
            }
        );
        jest.spyOn(
            Database.prototype,
            'getSubCollectionData'
        ).mockImplementation((collection, userId, addressId) =>
            mockGetSubCollectionData(
                USER_COLLECTIONS.USER_ADDRESS,
                userId,
                addressId
            )
        );
    });
    it('should call checkUserExistenceByEmail correctly', async () => {
        const trueResult = await userRepository.checkUserExistenceByEmail(
            user.email
        );
        const falseResult =
            await userRepository.checkUserExistenceByEmail('invalidEmail');
        expect(trueResult).toBe(true);
        expect(falseResult).toBe(false);
    });
    it('should call checkUserExistence correctly', async () => {
        const trueResult = await userRepository.checkUserExistence(user.id);
        const falseResult =
            await userRepository.checkUserExistence('invalidId');
        expect(trueResult).toBe(true);
        expect(falseResult).toBe(false);
    });
    it('should call getUserByEmail correctly', async () => {
        const userResponse = await userRepository.getUserByEmail(user.email);
        expect(userResponse).toEqual(user);
    });
    it('should call getUser correctly', async () => {
        const userResponse = await userRepository.getUser(user.id);
        expect(userResponse).toEqual(user);
    });
    it('should call createUser correctly', async () => {
        await userRepository.createUser(user);
        expect(mockInsert).toHaveBeenCalled();
        expect(mockInsert).toHaveBeenCalledWith(user);
    });
    it('should call registerAddress correctly', async () => {
        await userRepository.registerAddress(userAddress, user.id);
        expect(mockInsert).toHaveBeenCalled();
        expect(mockInsert).toHaveBeenCalledWith(
            USER_COLLECTIONS.USER_ADDRESS,
            user.id,
            userAddress
        );
    });
    it('should call updateUserAddressFlag correctly', async () => {
        await userRepository.updateUserAddressFlag(user.id, {
            hasAddress: true,
        });
        expect(mockUpdate).toHaveBeenCalled();
        expect(mockUpdate).toHaveBeenCalledWith(user.id, { hasAddress: true });
    });
    it('should call setMainAddressId correctly', async () => {
        await userRepository.setMainAddressId(user.id, 'addressId');
        expect(mockUpdate).toHaveBeenCalled();
        expect(mockUpdate).toHaveBeenCalledWith(user.id, {
            mainAddressId: 'addressId',
        });
    });
    it('should call getAddress correctly', async () => {
        const addressResponse = await userRepository.getAddress(
            user.id,
            userAddress.id
        );
        console.log('🚀 ~ it ~ addressResponse:', addressResponse);
        console.log('🚀 ~ it ~ userAddress:', userAddress);
        expect(mockGetSubCollectionData).toHaveBeenCalledWith(
            USER_COLLECTIONS.USER_ADDRESS,
            user.id,
            userAddress.id
        );
        expect(addressResponse).toEqual(userAddress);
    });
});
