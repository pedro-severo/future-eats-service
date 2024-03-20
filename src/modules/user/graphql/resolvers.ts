import Container from 'typedi';
import { LoginInput } from '../controller/inputs/LoginInput';
import { SignupInput } from '../controller/inputs/SignupInput';
import { LoginHandler } from '../controller/loginHandler';
import { signupHandler } from '../controller/signupHandler';
import { LoginUseCase } from '../useCases/LoginUseCase';

export const resolvers = {
    Mutation: {
        login: async (_parent: any, args: { input: LoginInput }) => {
            const loginHandler = new LoginHandler(Container.get(LoginUseCase));
            const { email, password } = JSON.parse(JSON.stringify(args)).input;
            return loginHandler.login({ email, password });
        },
        signup: async (_parent: any, args: { input: SignupInput }) => {
            const { name, cpf, email, password } = JSON.parse(
                JSON.stringify(args)
            ).input;
            return signupHandler({ name, cpf, email, password });
        },
    },
};
