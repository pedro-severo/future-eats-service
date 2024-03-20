import { resolvers } from '../resolvers';

const expectedResponse = { status: 'success' };

const mockControllerMethod = jest.fn().mockResolvedValue(expectedResponse);

jest.mock('../useCases/LoginUseCase');
jest.mock('../useCases/SignupUseCase');

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
});
