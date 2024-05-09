import Container from 'typedi';
import { LoginInput } from './controllers/inputs/LoginInput';
import { SignupInput } from './controllers/inputs/SignupInput';
import { LoginController } from './controllers/LoginController';
import { SignupController } from './controllers/SignupController';
import { RegisterAddressInput } from './controllers/inputs/RegisterAddressInput';
import { RegisterAddressController } from './controllers/RegisterAddressController';
import { LoginUseCase } from './useCases/LoginUseCase';
import { SignupUseCase } from './useCases/SignupUseCase';
import { IDatabaseContext } from '../../shared/database/interfaces';
import { RegisterAddressUseCase } from './useCases/RegisterAddressUseCase';
import { GetProfileInput } from './controllers/inputs/GetProfileInput';
import { GetProfileController } from './controllers/GetProfileController';
import { GetProfileUseCase } from './useCases/GetProfileUseCase';

export const resolvers = {
    Mutation: {
        login: async (
            _parent: any,
            args: { input: LoginInput },
            context: IDatabaseContext
        ) => {
            const loginController = new LoginController(
                // @ts-expect-error impossible undefined
                new LoginUseCase(Container.get(context.userDatabaseContext))
            );
            const { email, password } = JSON.parse(JSON.stringify(args)).input;
            return loginController.login({ email, password });
        },
        signup: async (
            _parent: any,
            args: { input: SignupInput },
            context: IDatabaseContext
        ) => {
            const signupController = new SignupController(
                // @ts-expect-error impossible undefined
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
            context: IDatabaseContext
        ) => {
            const registerAddressController = new RegisterAddressController(
                new RegisterAddressUseCase(
                    // @ts-expect-error impossible undefined
                    Container.get(context.userDatabaseContext)
                )
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
        }
    },
    Query: {
        getProfile: async (
            _parent: any,
            args: { input: GetProfileInput },
            context: IDatabaseContext
        ) => {
            const controller = new GetProfileController(
                new GetProfileUseCase(
                    // @ts-expect-error impossible undefined
                    Container.get(context.userDatabaseContext)
                )
            );
            const { userId } = JSON.parse(JSON.stringify(args)).input;
            return controller.getProfile({ userId });
        },
    }
};
