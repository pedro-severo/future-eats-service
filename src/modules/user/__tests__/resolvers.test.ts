import { UserDatabaseToken } from '../../../shared/dependencies';
import { GetProfileController } from '../controllers/GetProfileController';
import { RegisterAddressController } from '../controllers/RegisterAddressController';
import { resolvers } from '../resolvers';
import { GetProfileUseCase } from '../useCases/GetProfileUseCase';
import { LoginUseCase } from '../useCases/LoginUseCase';
import { RegisterAddressUseCase } from '../useCases/RegisterAddressUseCase';
import { SignupUseCase } from '../useCases/SignupUseCase';

const expectedResponse = { status: 'success' };

const mockLoginControllerMethod = jest.fn().mockResolvedValue(expectedResponse);

const mockSignupControllerMethod = jest
    .fn()
    .mockResolvedValue(expectedResponse);

const mockRegisterAddressControllerMethod = jest
    .fn()
    .mockResolvedValue(expectedResponse);

const mockGetProfileMethod = jest.fn().mockResolvedValue(expectedResponse);

jest.mock('typedi', () => ({
    __esModule: true,
    Service: jest.fn(() => (target: any) => target),
    Token: jest.fn((name) => ({ name })),
    default: {
        get: jest.fn(() => 'serviceInjection'), // Mocking the Container.get method
        set: jest.fn(() => ({})), // Mocking the Container.set method
    },
}));

jest.mock('../controllers/LoginController', () => {
    return {
        LoginController: jest.fn(() => ({
            login: mockLoginControllerMethod,
        })),
    };
});

jest.mock('../controllers/SignupController', () => {
    return {
        SignupController: jest.fn(() => ({
            signup: mockSignupControllerMethod,
        })),
    };
});

jest.mock('../controllers/RegisterAddressController', () => {
    return {
        RegisterAddressController: jest.fn(() => ({
            registerAddress: mockRegisterAddressControllerMethod,
        })),
    };
});

jest.mock('../controllers/GetProfileController', () => {
    return {
        GetProfileController: jest.fn(() => ({
            getProfile: mockGetProfileMethod,
        })),
    };
});

jest.mock('../repository/UserRepository', () => {
    return {
        UserRepository: jest.fn(() => ({
            constructor: jest.fn(),
        })),
    };
});

jest.mock('../useCases/LoginUseCase');
jest.mock('../useCases/SignupUseCase');
jest.mock('../useCases/RegisterAddressUseCase');
jest.mock('../useCases/GetProfileUseCase');

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
                auth: {
                    token: '',
                },
                userDatabaseContext: UserDatabaseToken,
            });
            expect(mockLoginControllerMethod).toHaveBeenCalledWith({
                email: 'test@example.com',
                password: 'password123',
            });
            expect(LoginUseCase).toHaveBeenCalled();
            expect(LoginUseCase).toHaveBeenCalledWith('serviceInjection');
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
                auth: {
                    token: '',
                },
                userDatabaseContext: UserDatabaseToken,
            });
            expect(mockSignupControllerMethod).toHaveBeenCalledWith({
                email: 'test@example.com',
                password: 'password123',
                name: 'name123',
                cpf: 'cpf123',
            });
            expect(SignupUseCase).toHaveBeenCalled();
            expect(SignupUseCase).toHaveBeenCalledWith('serviceInjection');
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
                    auth: {
                        token: '',
                    },
                    userDatabaseContext: UserDatabaseToken,
                }
            );
            expect(RegisterAddressController).toHaveBeenCalledTimes(1);
            expect(RegisterAddressUseCase).toHaveBeenCalled();
            expect(RegisterAddressUseCase).toHaveBeenCalledWith(
                'serviceInjection',
                'serviceInjection'
            );
            expect(mockRegisterAddressControllerMethod).toHaveBeenCalledWith(
                {
                    userId: 'userId',
                    city: 'Lisbon',
                    complement: '1D',
                    state: 'MG',
                    streetNumber: '123',
                    streetName: 'Guajajaras',
                    zone: 'Barreiro',
                },
                ''
            );
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
                auth: {
                    token: '',
                },
                userDatabaseContext: UserDatabaseToken,
            });
            expect(GetProfileController).toHaveBeenCalledTimes(1);
            expect(GetProfileUseCase).toHaveBeenCalledTimes(1);
            expect(GetProfileUseCase).toHaveBeenCalledWith(
                'serviceInjection',
                'serviceInjection'
            );
            expect(mockGetProfileMethod).toHaveBeenCalledTimes(1);
            expect(mockGetProfileMethod).toHaveBeenCalledWith(args.input, '');
            expect(result).toEqual(expectedResponse);
        });
    });
});
