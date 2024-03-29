import Container from 'typedi';
import { LoginInput } from './controllers/inputs/LoginInput';
import { SignupInput } from './controllers/inputs/SignupInput';
import { LoginController } from './controllers/LoginController';
import { SignupController } from './controllers/SignupController';
import { RegisterAddressUseCaseToken } from '../../shared/dependencies/index';
import { RegisterAddressInput } from './controllers/inputs/RegisterAddressInput';
import { RegisterAddressController } from './controllers/RegisterAddressController';
import { LoginUseCase } from './useCases/LoginUseCase';
import { SignupUseCase } from './useCases/SignupUseCase';

export const resolvers = {
    Mutation: {
        login: async (
            _parent: any,
            args: { input: LoginInput },
            context: any
        ) => {
            const loginController = new LoginController(
                new LoginUseCase(Container.get(context.databaseContext))
            );
            const { email, password } = JSON.parse(JSON.stringify(args)).input;
            return loginController.login({ email, password });
        },
        signup: async (
            _parent: any,
            args: { input: SignupInput },
            context: any
        ) => {
            const signupController = new SignupController(
                new SignupUseCase(Container.get(context.databaseContext))
            );
            const { name, cpf, email, password } = JSON.parse(
                JSON.stringify(args)
            ).input;
            return signupController.signup({ name, cpf, email, password });
        },
        registerAddress: async (
            _parent: any,
            args: { input: RegisterAddressInput }
        ) => {
            const registerAddressController = new RegisterAddressController(
                Container.get(RegisterAddressUseCaseToken)
            );
            const {
                userId,
                city,
                complement,
                state,
                streetName,
                streetNumber,
                zone,
            } = JSON.parse(JSON.stringify(args)).input;
            return registerAddressController.registerAddress({
                userId,
                city,
                complement,
                state,
                streetName,
                streetNumber,
                zone,
            });
        },
    },
};
