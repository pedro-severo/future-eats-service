import 'reflect-metadata';
import '../../../shared/dependencies/index';
import { merge } from 'lodash';
import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { loadFilesSync } from '@graphql-tools/load-files';
import cors from 'cors';
import { resolvers } from '../resolvers';
import { UserDatabaseTestToken } from '../../../shared/dependencies/index';

const app = express();

app.use(
    cors({
        allowedHeaders: ['Content-Type'],
    })
);

const typesArray = loadFilesSync('./src/**/*.gql');

export const contextProps = { userDatabaseContext: UserDatabaseTestToken };

export const server = new ApolloServer({
    typeDefs: typesArray,
    resolvers: merge(resolvers),
    context: contextProps,
});
