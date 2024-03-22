// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { Database } from '../../../../shared/database';
import { UserRepository } from '../UserRepository';

jest.mock('../../../../shared/database');

const user = {
    name: 'Test User',
    email: 'test@example.com',
    id: '123456789',
    password: 'hashedPassword',
    hasAddress: false,
    cpf: '12345678901',
};

describe('UserRepository test', () => {
    let userRepository: UserRepository;
    const mockInsert = jest.fn();
    beforeEach(() => {
        userRepository = new UserRepository();
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
        jest.spyOn(Database.prototype, 'getDataByField').mockImplementation(
            () => {
                return user;
            }
        );
        jest.spyOn(Database.prototype, 'insert').mockImplementation((user) => {
            mockInsert(user);
        });
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
    it('should call getUserByEmail correctly', async () => {
        const userResponse = await userRepository.getUserByEmail(user.email);
        expect(userResponse).toEqual(user);
    });
    it('should call createUser correctly', async () => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-expect-error
        await userRepository.createUser(user);
        expect(mockInsert).toHaveBeenCalled();
        expect(mockInsert).toHaveBeenCalledWith(user);
    });
});
