import { gql } from 'apollo-server-express';
import { server } from './mocks/mockServer';
import * as firebaseTesting from '@firebase/testing';

const projectId = 'future-eats-service';

describe('Integration tests', () => {
    // TODO: Finish tests
    // TODO: See how to up mock database before run this file
    // TODO: Clean code everybody on project, not just here
    // TODO: Finish integration tests
    beforeAll(async () => {
        const result = await server.executeOperation({
            query: gql`
                mutation {
                    signup(
                        input: {
                            email: "severo.snape@rupeal.com"
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
        console.log('🚀 ~ beforeAll ~ result:', result);
        expect(typeof result?.data?.signup?.data?.token).toBe('string');
        expect(typeof result?.data?.signup?.data?.user.password).toBe('string');
        expect(typeof result?.data?.signup?.data?.user.id).toBe('string');
        expect(typeof result?.data?.signup?.data?.user.hasAddress).toBe(
            'boolean'
        );
        expect(typeof result?.data?.signup?.data?.user.cpf).toBe('string');
        expect(result?.data?.signup?.data?.user.name).toBe('Severo Snape');
        expect(result?.data?.signup?.data?.user.email).toBe(
            'severo.snape@rupeal.com'
        );
    });
    afterAll(async () => {
        await firebaseTesting.clearFirestoreData({ projectId });
        await Promise.all(firebaseTesting.apps().map((app) => app.delete()));
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
