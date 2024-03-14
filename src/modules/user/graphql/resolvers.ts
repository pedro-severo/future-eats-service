import { LoginInput } from '../controller/inputs/LoginInput';
import { SignupInput } from '../controller/inputs/SignupInput';
import { loginHandler } from '../controller/loginHandler';
import { signupHandler } from '../controller/signupHandler';

export const resolvers = {
    Mutation: {
        login: async (_parent: any, args: { input: LoginInput }) => {
            const { email, password } = JSON.parse(JSON.stringify(args)).input;
            return loginHandler({ email, password });
        },
        signup: async (_parent: any, args: { input: SignupInput }) => {
            const { name, cpf, email, password } = JSON.parse(
                JSON.stringify(args)
            ).input;
            return signupHandler({ name, cpf, email, password });
        },
    },
};
