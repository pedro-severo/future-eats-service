import Container, { Token } from 'typedi';
import { LoginUseCase } from '../../modules/user/useCases/LoginUseCase';
import { SignupUseCase } from '../../modules/user/useCases/SignupUseCase';
import { UserRepository } from '../../modules/user/repository/UserRepository';
import { RegisterAddressUseCase } from '../../modules/user/useCases/RegisterAddressUseCase';

export const LoginUseCaseToken = new Token<LoginUseCase>('LOGIN_USE_CASE');
export const SignupUseCaseToken = new Token<SignupUseCase>('SIGNUP_USE_CASE');
export const RegisterAddressUseCaseToken = new Token<RegisterAddressUseCase>(
    'REGISTER_ADDRESS_USE_CASE'
);

Container.set([
    {
        id: LoginUseCaseToken,
        value: new LoginUseCase(Container.get(UserRepository)),
    },
    {
        id: SignupUseCaseToken,
        value: new SignupUseCase(Container.get(UserRepository)),
    },
    {
        id: RegisterAddressUseCaseToken,
        value: new RegisterAddressUseCase(Container.get(UserRepository)),
    },
]);
