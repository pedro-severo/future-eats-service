import { UserDatabaseToken } from '../../../shared/dependencies';
import { GetProfileController } from '../controllers/GetProfileController';
import { RegisterAddressController } from '../controllers/RegisterAddressController';
import { resolvers } from '../resolvers';
import { GetProfileUseCase } from '../useCases/GetProfileUseCase';
import { RegisterAddressUseCase } from '../useCases/RegisterAddressUseCase';

const expectedResponse = { status: 'success' };

// TODO: Create one mock to each controller method and
// create test cases on controller success to see if the respective methods is been called just once

// TODO: Test usecases calling

// TODO: Test fail cases, if it is possible

const mockControllerMethod = jest.fn().mockResolvedValue(expectedResponse);

const mockGetProfileMethod = jest.fn().mockResolvedValue(expectedResponse);

jest.mock('typedi', () => ({
    __esModule: true,
    Service: jest.fn(() => (target: any) => target),
    Token: jest.fn((name) => ({ name })),
    default: {
        get: jest.fn(() => 'foo'), // Mocking the Container.get method
        set: jest.fn(() => ({})), // Mocking the Container.set method
    },
}));

jest.mock('../controllers/LoginController', () => {
    return {
        LoginController: jest.fn(() => ({
            login: mockControllerMethod,
        })),
    };
});

jest.mock('../controllers/SignupController', () => {
    return {
        SignupController: jest.fn(() => ({
            signup: mockControllerMethod,
        })),
    };
});

jest.mock('../controllers/RegisterAddressController', () => {
    return {
        RegisterAddressController: jest.fn(() => ({
            registerAddress: mockControllerMethod,
        })),
    };
});

jest.mock('../useCases/RegisterAddressUseCase');

jest.mock('../controllers/GetProfileController', () => {
    return {
        GetProfileController: jest.fn(() => ({
            getProfile: mockGetProfileMethod,
        })),
    };
});

jest.mock('../useCases/GetProfileUseCase');

jest.mock('../repository/UserRepository', () => {
    return {
        UserRepository: jest.fn(() => ({
            constructor: jest.fn(),
        })),
    };
});

describe('Mutation Resolvers', () => {
    describe('login', () => {
        it('should call loginController with the correct arguments', async () => {
            const args = {
                input: {
                    email: 'test@example.com',
                    password: 'password123',
                },
            };
            const result = await resolvers.Mutation.login(null, args, {
                userDatabaseContext: UserDatabaseToken,
            });
            expect(mockControllerMethod).toHaveBeenCalledWith({
                email: 'test@example.com',
                password: 'password123',
            });
            expect(result).toEqual(expectedResponse);
        });
    });
    describe('signup', () => {
        it('should call signupHandler with the correct arguments', async () => {
            const args = {
                input: {
                    email: 'test@example.com',
                    password: 'password123',
                    name: 'name123',
                    cpf: 'cpf123',
                },
            };
            const result = await resolvers.Mutation.signup(null, args, {
                userDatabaseContext: UserDatabaseToken,
            });
            expect(mockControllerMethod).toHaveBeenCalledWith({
                email: 'test@example.com',
                password: 'password123',
                name: 'name123',
                cpf: 'cpf123',
            });
            expect(result).toEqual(expectedResponse);
        });
    });
    describe('registerAddress', () => {
        it('should call registerAddress with the correct arguments', async () => {
            const args = {
                input: {
                    userId: 'userId',
                    city: 'Lisbon',
                    complement: '1D',
                    state: 'MG',
                    streetNumber: '123',
                    streetName: 'Guajajaras',
                    zone: 'Barreiro',
                },
            };
            const result = await resolvers.Mutation.registerAddress(
                null,
                args,
                {
                    userDatabaseContext: UserDatabaseToken,
                }
            );
            expect(RegisterAddressController).toHaveBeenCalledTimes(1);
            expect(RegisterAddressUseCase).toHaveBeenCalled();
            expect(RegisterAddressUseCase).toHaveBeenCalledWith('foo');
            expect(mockControllerMethod).toHaveBeenCalledWith({
                userId: 'userId',
                city: 'Lisbon',
                complement: '1D',
                state: 'MG',
                streetNumber: '123',
                streetName: 'Guajajaras',
                zone: 'Barreiro',
            });
            expect(result).toEqual(expectedResponse);
        });
    });
    describe('getProfile', () => {
        it('should call getProfile with the correct arguments', async () => {
            const args = {
                input: {
                    userId: 'userId',
                },
            };
            const result = await resolvers.Query.getProfile(null, args, {
                userDatabaseContext: UserDatabaseToken,
            });
            expect(GetProfileController).toHaveBeenCalledTimes(1);
            expect(GetProfileUseCase).toHaveBeenCalledTimes(1);
            expect(GetProfileUseCase).toHaveBeenCalledWith('foo');
            expect(mockGetProfileMethod).toHaveBeenCalledTimes(1);
            expect(mockGetProfileMethod).toHaveBeenCalledWith(args.input);
            expect(result).toEqual(expectedResponse);
        });
    });
});
