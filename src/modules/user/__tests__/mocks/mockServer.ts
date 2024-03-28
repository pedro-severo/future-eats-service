import 'reflect-metadata';
import '../../../../shared/dependencies/index';
import { merge } from 'lodash';
import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { loadFilesSync } from '@graphql-tools/load-files';
import cors from 'cors';
import { resolvers } from '../../resolvers';
import { UserRepositoryTestToken } from '../../../../shared/dependencies';

const { ruruHTML } = require('ruru/server');

const app = express();

app.use(
    cors({
        allowedHeaders: ['Content-Type'],
    })
);

const typesArray = loadFilesSync('./src/**/*.gql');

export async function startApolloTestServer() {
    const server = new ApolloServer({
        typeDefs: typesArray,
        resolvers: merge(resolvers),
        context: { databaseContext: UserRepositoryTestToken },
    });

    await server.start();

    server.applyMiddleware({ app });

    app.get('/', (_req: any, res: any) => {
        res.type('html');
        res.end(ruruHTML({ endpoint: '/graphql' }));
    });

    const PORT = process.env.PORT || 3004;
    app.listen(PORT, () => {
        console.log(
            `Server is running on http://localhost:${PORT}${server.graphqlPath}`
        );
    });
}

startApolloTestServer().catch((err) => {
    console.error('Error starting Apollo Server:', err);
});
