import 'reflect-metadata';
import './shared/dependencies/index';
import { merge } from 'lodash';
import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { resolvers as userResolvers } from './modules/user/resolvers';
import { loadFilesSync } from '@graphql-tools/load-files';
// import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { IServerContext, getServerContext } from './shared/server';

const { ruruHTML } = require('ruru/server');

const app = express();

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100,
    message: 'Too many requests from this IP, please try again later',
});

app.use(limiter);


// TODO: Fix cors bug when uncomment these lines
// app.use(
//     cors({
//         allowedHeaders: ['Content-Type'],
//     })
// );

// TODO: study helmet: https://helmetjs.github.io/
app.use(helmet());

const typesArray = loadFilesSync('./src/**/*.gql');

async function startApolloServer() {
    const server = new ApolloServer({
        typeDefs: typesArray,
        resolvers: merge(userResolvers),
        context: ({ req }): IServerContext => getServerContext(req),
    });

    await server.start();

    server.applyMiddleware({ app });

    app.get('/', (_req: any, res: any) => {
        res.type('html');
        res.end(ruruHTML({ endpoint: '/graphql' }));
    });

    const PORT = process.env.PORT || 3003;
    app.listen(PORT, () => {
        console.log(
            `Server is running on http://localhost:${PORT}${server.graphqlPath}`
        );
    });
}

startApolloServer().catch((err) => {
    console.error('Error starting Apollo Server:', err);
});
