import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import { AddressInfo } from 'net';
import { signupHandler } from './modules/user/controller/signupHandler';
import { loginHandler } from './modules/user/controller/loginHandler';

export const app = express();

app.use(express.json());
app.use(cors());

app.post('/user/signup', signupHandler);
app.post('/user/login', loginHandler);

if (process.env.NODE_ENV !== 'test') {
    const server = app.listen(process.env.PORT || 3003, () => {
        if (server) {
            const address = server.address() as AddressInfo;
            console.log(
                `Server is running in http://localhost:${address.port}`
            );
        } else {
            console.error(`Failure upon starting server.`);
        }
    });
}
