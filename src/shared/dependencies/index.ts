import Container, { Token } from 'typedi';
import { LoginUseCase } from '../../modules/user/useCases/LoginUseCase';
import { SignupUseCase } from '../../modules/user/useCases/SignupUseCase';
import { UserDatabase } from '../../modules/user/database/UserDatabase';

export const LoginUseCaseToken = new Token<LoginUseCase>('LOGIN_USE_CASE');
export const SignupUseCaseToken = new Token<SignupUseCase>('SIGNUP_USE_CASE');

Container.set([
    {
        id: LoginUseCaseToken,
        value: new LoginUseCase(Container.get(UserDatabase)),
    },
    {
        id: SignupUseCaseToken,
        value: new SignupUseCase(Container.get(UserDatabase)),
    },
]);
