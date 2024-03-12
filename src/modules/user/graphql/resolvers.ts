import { loginHandler } from '../controller/loginHandler';

type LoginInput = {
    email: string;
    password: string;
};

export const resolvers = {
    Mutation: {
        login: async (_parent: any, args: { input: LoginInput }) => {
            const { email, password } = JSON.parse(JSON.stringify(args)).input;
            return loginHandler({ email, password });
        },
    },
};
