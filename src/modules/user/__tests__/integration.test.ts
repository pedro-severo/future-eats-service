import { gql } from 'apollo-server-express';
import { server } from '../mocks/mockServer';
import * as firebaseTesting from '@firebase/testing';
import { StatusCodes } from 'http-status-codes';
import { USER_ERROR_MESSAGES } from '../useCases/constants/errorMessages';

const projectId = 'future-eats-service';

const signupInput = {
    email: 'severo.snape@rupeal.com',
    password: '123456',
    cpf: '12043891600',
    name: 'Severo Snape',
};

const loginInput = {
    email: signupInput.email,
    password: signupInput.password,
};

const registerAddressInput = {
    city: 'Lisbon',
    complement: '1D',
    state: 'MG',
    streetNumber: '123',
    streetName: 'Guajajaras',
    zone: 'Barreiro',
};

describe('Integration tests', () => {
    let userId: string;
    let signupResult: any;
    beforeAll(async () => {
        const result = await server.executeOperation({
            query: signupQuery,
            variables: signupInput,
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
                variables: loginInput,
            });
            expect(typeof result?.data?.login?.data?.token).toBe('string');
            expect(typeof result?.data?.login?.data?.user.password).toBe(
                'string'
            );
            expect(result?.data?.login?.data?.user.id).toBe(userId);
            expect(result?.data?.login?.data?.user.name).toBe(signupInput.name);
            expect(result?.data?.login?.data?.user.hasAddress).toBe(false);
            expect(result?.data?.login?.data?.user.cpf).toBe(signupInput.cpf);
            expect(result?.data?.login?.data?.user.email).toBe(
                signupInput.email
            );
            expect(result?.data?.login?.status).toBe(StatusCodes.OK);
        });
        it('should fail by user not found', async () => {
            const result = await server.executeOperation({
                query: loginQuery,
                variables: {
                    email: 'harry.potter@rupeal.com',
                    password: signupInput.password,
                },
            });
            // @ts-expect-error possible undefined
            expect(result?.errors[0].message).toBe(
                USER_ERROR_MESSAGES.NOT_FOUND
            );
        });
        it('should fail by incorrect password', async () => {
            const result = await server.executeOperation({
                query: loginQuery,
                variables: {
                    email: signupInput.email,
                    password: 'wrongPassword',
                },
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
                signupInput.cpf
            );
            expect(signupResult?.data?.signup?.data?.user.name).toBe(
                signupInput.name
            );
            expect(signupResult?.data?.signup?.data?.user.email).toBe(
                signupInput.email
            );
            expect(signupResult?.data?.signup?.status).toBe(
                StatusCodes.CREATED
            );
        });
        it('should fail by email already registered', async () => {
            const result = await server.executeOperation({
                query: signupQuery,
                variables: signupInput,
            });
            // @ts-expect-error possible undefined
            expect(result?.errors[0].message).toBe(
                USER_ERROR_MESSAGES.EMAIL_ALREADY_REGISTERED
            );
        });
    });
    describe('registerAddress mutation', () => {
        it('should register address correctly', async () => {
            const result = await server.executeOperation({
                query: registerAddressQuery,
                variables: { ...registerAddressInput, userId },
            });
            await server.executeOperation({
                query: loginQuery,
                variables: loginInput,
            });
            // TODO: call getUser endppoint (when it is done) to see if hasAddress prop was changed to true
            expect(result?.data?.registerAddress?.status).toBe(
                StatusCodes.CREATED
            );
            expect(typeof result?.data?.registerAddress?.data.id).toBe(
                'string'
            );
            expect(result?.data?.registerAddress?.data.city).toBe(
                registerAddressInput.city
            );
            expect(result?.data?.registerAddress?.data.complement).toBe(
                registerAddressInput.complement
            );
            expect(result?.data?.registerAddress?.data.state).toBe(
                registerAddressInput.state
            );
            expect(result?.data?.registerAddress?.data.streetNumber).toBe(
                registerAddressInput.streetNumber
            );
            expect(result?.data?.registerAddress?.data.streetName).toBe(
                registerAddressInput.streetName
            );
            expect(result?.data?.registerAddress?.data.zone).toBe(
                registerAddressInput.zone
            );
        });
        it('should fail by inexistent user id', async () => {
            const result = await server.executeOperation({
                query: registerAddressQuery,
                variables: { ...registerAddressInput, userId: 'wrongId' },
            });
            // @ts-expect-error possible undefined
            expect(result?.errors[0].message).toBe(
                USER_ERROR_MESSAGES.FAILED_TO_REGISTER_ADDRESS
            );
        });
    });
    describe('getProfile query', () => {
        beforeEach(async () => {
            await server.executeOperation({
                query: registerAddressQuery,
                variables: { ...registerAddressInput, userId },
            });
        });
        it('should get profile correctly', async () => {
            const result = await server.executeOperation({
                query: getProfileQuery,
                variables: { userId },
            });
            expect(result?.data?.getProfile?.status).toBe(StatusCodes.ACCEPTED);
            expect(result?.data?.getProfile?.data?.id).toBe(userId);
            expect(result?.data?.getProfile?.data?.name).toBe(signupInput.name);
            expect(result?.data?.getProfile?.data?.email).toBe(
                signupInput.email
            );
            expect(result?.data?.getProfile?.data?.cpf).toBe(signupInput.cpf);
            // TODO: Check address correctly
            expect(result?.data?.getProfile?.data?.address).toBeTruthy();
        });
        // TODO: Create tests to fail scenarios
    });
});

const getProfileQuery = gql`
    query getProfile($userId: String!) {
        getProfile(input: { userId: $userId }) {
            status
            data {
                id
                name
                email
                cpf
                hasAddress
                address
            }
        }
    }
`;

const signupQuery = gql`
    mutation signup(
        $email: String!
        $password: String!
        $cpf: String!
        $name: String!
    ) {
        signup(
            input: {
                email: $email
                password: $password
                cpf: $cpf
                name: $name
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
    mutation login($email: String!, $password: String!) {
        login(input: { email: $email, password: $password }) {
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

const registerAddressQuery = gql`
    mutation registerAddress(
        $userId: String!
        $city: String!
        $complement: String!
        $state: String!
        $streetName: String!
        $streetNumber: String!
        $zone: String!
    ) {
        registerAddress(
            input: {
                userId: $userId
                city: $city
                complement: $complement
                state: $state
                streetName: $streetName
                streetNumber: $streetNumber
                zone: $zone
            }
        ) {
            status
            data {
                city
                complement
                state
                streetNumber
                zone
                streetName
                id
            }
        }
    }
`;
