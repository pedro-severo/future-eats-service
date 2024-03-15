import { loginHandler } from '../../controller/loginHandler';
import { signupHandler } from '../../controller/signupHandler';
import { resolvers } from '../resolvers';

jest.mock('../../controller/loginHandler');
jest.mock('../../controller/signupHandler');

describe('Mutation Resolvers', () => {
    describe('login', () => {
        it('should call loginHandler with the correct arguments', async () => {
            const args = {
                input: {
                    email: 'test@example.com',
                    password: 'password123',
                },
            };
            const expectedResponse = { token: 'some_token' };
            (loginHandler as jest.Mock).mockResolvedValue(expectedResponse);
            const result = await resolvers.Mutation.login(null, args);
            expect(loginHandler).toHaveBeenCalledWith({
                email: 'test@example.com',
                password: 'password123',
            });
            expect(result).toEqual(expectedResponse);
        });
        it('should call signupHandler with the correct arguments', async () => {
            const args = {
                input: {
                    email: 'test@example.com',
                    password: 'password123',
                    name: 'name123',
                    cpf: 'cpf123',
                },
            };
            const expectedResponse = { token: 'some_token' };
            (signupHandler as jest.Mock).mockResolvedValue(expectedResponse);
            const result = await resolvers.Mutation.signup(null, args);
            expect(signupHandler).toHaveBeenCalledWith({
                email: 'test@example.com',
                password: 'password123',
                name: 'name123',
                cpf: 'cpf123',
            });
            expect(result).toEqual(expectedResponse);
        });
    });
});
