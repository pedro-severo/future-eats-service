import { gql } from 'apollo-server-express';
import { server } from './mocks/mockServer';

describe('Integration tests', () => {
    // TODO: Clean code everybody on project, not just here
    // TODO: See how to up mock database before run this file
    // TODO: Finish integration tests
    beforeAll(() => {
        it('signup successfully', async () => {
            const result = await server.executeOperation({
                query: gql`
                    mutation {
                        signup(
                            input: {
                                email: "severo.Snape@rupeal.com"
                                password: "123456"
                                cpf: "12043891600"
                                name: "Severo Snape"
                            }
                        ) {
                            data {
                                token
                                user {
                                    password
                                    name
                                    id
                                    hasAddress
                                    email
                                    cpf
                                }
                            }
                        }
                    }
                `,
            });
            expect(typeof result?.data?.login?.data?.token).toBe('string');
            expect(typeof result?.data?.login?.data?.user.password).toBe(
                'string'
            );
            expect(typeof result?.data?.login?.data?.user.id).toBe('string');
            expect(typeof result?.data?.login?.data?.user.hasAddress).toBe(
                'boolean'
            );
            expect(typeof result?.data?.login?.data?.user.cpf).toBe('string');
            expect(result?.data?.login?.data?.user.name).toBe('Severo Snape');
            expect(result?.data?.login?.data?.user.email).toBe(
                'severo.snape@rupeal.com'
            );
        });
    });
    describe('login mutation', () => {
        it('should login successfully', async () => {
            const result = await server.executeOperation({
                query: gql`
                    mutation {
                        login(
                            input: {
                                email: "severo.snape@rupeal.com"
                                password: "123456"
                            }
                        ) {
                            data {
                                token
                                user {
                                    password
                                    name
                                    id
                                    hasAddress
                                    email
                                    cpf
                                }
                            }
                        }
                    }
                `,
            });
            expect(typeof result?.data?.login?.data?.token).toBe('string');
            expect(typeof result?.data?.login?.data?.user.password).toBe(
                'string'
            );
            expect(typeof result?.data?.login?.data?.user.name).toBe('string');
            expect(typeof result?.data?.login?.data?.user.id).toBe('string');
            expect(typeof result?.data?.login?.data?.user.hasAddress).toBe(
                'boolean'
            );
            expect(typeof result?.data?.login?.data?.user.cpf).toBe('string');
            expect(result?.data?.login?.data?.user.email).toBe(
                'severo.snape@rupeal.com'
            );
        });
    });
    describe('signup mutation', () => {});
});
