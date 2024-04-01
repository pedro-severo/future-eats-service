import 'reflect-metadata';
import '../../../../shared/dependencies/index';
import { merge } from 'lodash';
import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { loadFilesSync } from '@graphql-tools/load-files';
import cors from 'cors';
import { resolvers } from '../../resolvers';
import { UserRepositoryTestToken } from '../../../../shared/dependencies';

const app = express();

app.use(
    cors({
        allowedHeaders: ['Content-Type'],
    })
);

const typesArray = loadFilesSync('./src/**/*.gql');

export const server = new ApolloServer({
    typeDefs: typesArray,
    resolvers: merge(resolvers),
    context: { databaseContext: UserRepositoryTestToken },
});
