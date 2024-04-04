import { gql } from 'apollo-server-express';
import { server } from '../mocks/mockServer';
import * as firebaseTesting from '@firebase/testing';
import { StatusCodes } from 'http-status-codes';
import { USER_ERROR_MESSAGES } from '../useCases/constants/errorMessages';

const projectId = 'future-eats-service';

describe('Integration tests', () => {
    let userId: string;
    let signupResult: any;
    // TODO: Clean code everybody on project, not just here
    // TODO: Finish integration tests
    beforeAll(async () => {
        const result = await server.executeOperation({
            query: signupQuery,
        });
        signupResult = result;
        userId = result?.data?.signup?.data?.user.id;
    });
    afterAll(async () => {
        await firebaseTesting.clearFirestoreData({ projectId });
        await Promise.all(firebaseTesting.apps().map((app) => app.delete()));
    });
    describe('login mutation', () => {
        it('should login successfully', async () => {
            const result = await server.executeOperation({
                query: loginQuery,
            });
            expect(typeof result?.data?.login?.data?.token).toBe('string');
            expect(typeof result?.data?.login?.data?.user.password).toBe(
                'string'
            );
            expect(result?.data?.login?.data?.user.id).toBe(userId);
            expect(result?.data?.login?.data?.user.name).toBe('Severo Snape');
            expect(result?.data?.login?.data?.user.hasAddress).toBe(false);
            expect(result?.data?.login?.data?.user.cpf).toBe('12043891600');
            expect(result?.data?.login?.data?.user.email).toBe(
                'severo.snape@rupeal.com'
            );
            expect(result?.data?.login?.status).toBe(StatusCodes.OK);
        });
        it('should fail by user not found', async () => {
            const result = await server.executeOperation({
                query: wrongEmailLoginQuery,
            });
            // @ts-expect-error possible undefined
            expect(result?.errors[0].message).toBe(
                USER_ERROR_MESSAGES.NOT_FOUND
            );
        });
        it('should fail by incorrect password', async () => {
            const result = await server.executeOperation({
                query: wrongPasswordLoginQuery,
            });
            // @ts-expect-error possible undefined
            expect(result?.errors[0].message).toBe(
                USER_ERROR_MESSAGES.INCORRECT_PASSWORD
            );
        });
    });
    describe('signup mutation', () => {
        it('should signup successfully', () => {
            // signup mutation is running on beforeAll callback
            expect(typeof signupResult?.data?.signup?.data?.token).toBe(
                'string'
            );
            expect(typeof signupResult?.data?.signup?.data?.user.password).toBe(
                'string'
            );
            expect(typeof signupResult?.data?.signup?.data?.user.id).toBe(
                'string'
            );
            expect(signupResult?.data?.signup?.data?.user.hasAddress).toBe(
                false
            );
            expect(signupResult?.data?.signup?.data?.user.cpf).toBe(
                '12043891600'
            );
            expect(signupResult?.data?.signup?.data?.user.name).toBe(
                'Severo Snape'
            );
            expect(signupResult?.data?.signup?.data?.user.email).toBe(
                'severo.snape@rupeal.com'
            );
            expect(signupResult?.data?.signup?.status).toBe(StatusCodes.OK);
        });
        it('should fail by email already registered', async () => {
            const result = await server.executeOperation({
                query: signupQuery,
            });
            // @ts-expect-error possible undefined
            expect(result?.errors[0].message).toBe(
                USER_ERROR_MESSAGES.EMAIL_ALREADY_REGISTERED
            );
        });
    });
    describe('registerAddress mutation', () => {});
});

const signupQuery = gql`
    mutation {
        signup(
            input: {
                email: "severo.snape@rupeal.com"
                password: "123456"
                cpf: "12043891600"
                name: "Severo Snape"
            }
        ) {
            status
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
`;

const loginQuery = gql`
    mutation {
        login(input: { email: "severo.snape@rupeal.com", password: "123456" }) {
            status
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
`;

const wrongPasswordLoginQuery = gql`
    mutation {
        login(
            input: { email: "severo.snape@rupeal.com", password: "1234567" }
        ) {
            status
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
`;

const wrongEmailLoginQuery = gql`
    mutation {
        login(input: { email: "harry.potter@rupeal.com", password: "123456" }) {
            status
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
`;
