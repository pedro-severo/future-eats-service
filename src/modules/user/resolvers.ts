import Container from 'typedi';
import { LoginInput } from './controllers/inputs/LoginInput';
import { SignupInput } from './controllers/inputs/SignupInput';
import { LoginController } from './controllers/LoginController';
import { SignupController } from './controllers/SignupController';
import { RegisterAddressInput } from './controllers/inputs/RegisterAddressInput';
import { RegisterAddressController } from './controllers/RegisterAddressController';
import { LoginUseCase } from './useCases/LoginUseCase';
import { SignupUseCase } from './useCases/SignupUseCase';
import { RegisterAddressUseCase } from './useCases/RegisterAddressUseCase';
import { IServerContext } from '../../shared/server';

export const resolvers = {
    Mutation: {
        login: async (
            _parent: any,
            args: { input: LoginInput },
            context: IServerContext
        ) => {
            const loginController = new LoginController(
                new LoginUseCase(Container.get(context.userDatabaseContext))
            );
            const { email, password } = JSON.parse(JSON.stringify(args)).input;
            return loginController.login({ email, password });
        },
        signup: async (
            _parent: any,
            args: { input: SignupInput },
            context: IServerContext
        ) => {
            const signupController = new SignupController(
                new SignupUseCase(Container.get(context.userDatabaseContext))
            );
            const { name, cpf, email, password } = JSON.parse(
                JSON.stringify(args)
            ).input;
            return signupController.signup({ name, cpf, email, password });
        },
        registerAddress: async (
            _parent: any,
            args: { input: RegisterAddressInput },
            context: IServerContext
        ) => {
            const { token } = context.auth;
            const registerAddressController = new RegisterAddressController(
                new RegisterAddressUseCase(
                    Container.get(context.userDatabaseContext)
                )
            );
            const req = JSON.parse(JSON.stringify(args)).input;
            return registerAddressController.registerAddress(req, token);
        },
    },
};
