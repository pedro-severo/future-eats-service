import { resolvers } from '../resolvers';

const expectedResponse = { status: 'success' };

const mockControllerMethod = jest.fn().mockResolvedValue(expectedResponse);

jest.mock('typedi', () => ({
    __esModule: true,
    Service: jest.fn(() => (target: any) => target),
    Token: jest.fn((name) => ({ name })),
    default: {
        get: jest.fn(() => ({})), // Mocking the Container.get method
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

describe('Mutation Resolvers', () => {
    describe('login', () => {
        it('should call loginController with the correct arguments', async () => {
            const args = {
                input: {
                    email: 'test@example.com',
                    password: 'password123',
                },
            };
            const result = await resolvers.Mutation.login(null, args);
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
            const result = await resolvers.Mutation.signup(null, args);
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
            const result = await resolvers.Mutation.registerAddress(null, args);
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
});
