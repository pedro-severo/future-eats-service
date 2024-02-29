import 'reflect-metadata';
import express from "express"
import { AddressInfo } from "net"

export const app = express()

app.use(express.json())

if (process.env.NODE_ENV !== 'test') {
    const server = app.listen(process.env.PORT || 3003, () => {
        if (server) {
            const address = server.address() as AddressInfo;
            console.log(`Server is running in http://localhost:${address.port}`);
        } else {
            console.error(`Failure upon starting server.`);
        }
    })
}