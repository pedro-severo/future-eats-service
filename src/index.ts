import 'reflect-metadata';
import './shared/dependencies/index';
import { merge } from 'lodash';
import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { resolvers as userResolvers } from './modules/user/resolvers';
import { loadFilesSync } from '@graphql-tools/load-files';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { IServerContext, getServerContext } from './shared/server';
import { logger } from './logger';

const { ruruHTML } = require('ruru/server');

const app = express();

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100,
    message: 'Too many requests from this IP, please try again later',
});

app.use(limiter);

// TODO: study helmet: https://helmetjs.github.io/
//       it is blocking http://localhost:3003 to open api on browser
app.use(helmet());

const typesArray = loadFilesSync('./src/**/*.gql');

async function startApolloServer() {
    const server = new ApolloServer({
        typeDefs: typesArray,
        resolvers: merge(userResolvers),
        context: ({ req }): IServerContext => getServerContext(req),
    });

    await server.start();

    app.use(
        '/graphql',
        cors<cors.CorsRequest>({
            origin: [
                'http://localhost:3000',
                'http://localhost:3003',
                'https://studio.apollographql.com',
            ],
        }),
        express.json()
    );

    server.applyMiddleware({ app });

    app.get('/', (_req: any, res: any) => {
        res.type('html');
        res.end(ruruHTML({ endpoint: '/graphql' }));
    });

    const PORT = process.env.PORT || 3003;
    app.listen(PORT, () => {
        logger.info(
            `Server is running on http://localhost:${PORT}${server.graphqlPath}`
        );
    });
}

startApolloServer().catch((err) => {
    logger.error('Error starting Apollo Server:', err);
});
