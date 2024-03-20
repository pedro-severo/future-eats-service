import { StatusCodes } from 'http-status-codes';
import { LoginResponse } from '../../useCases/interfaces/LoginResponse';
import { SignupResponse } from '../../useCases/interfaces/SignupResponse';

export interface LoginOutput {
    status: StatusCodes;
    data: LoginResponse;
}

export interface SignupOutput {
    status: StatusCodes;
    data: SignupResponse;
}
