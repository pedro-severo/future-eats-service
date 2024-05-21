import { AuthenticatorManager } from '../../../shared/services/authentication';
import { USER_ROLES } from '../../../shared/services/authentication/interfaces';
import { GetProfileInput } from '../controllers/inputs/GetProfileInput';
import { UserType } from '../entities/User';
import { UserRepository } from '../repository/UserRepository';
import { USER_ERROR_MESSAGES } from './constants/errorMessages';
import { GetProfileResponse } from './interfaces/GetProfileResponse';
import { mapUserAndAddressToProfileResponse } from './mappers/mapUserAndAddressToProfileResponse';

export class GetProfileUseCase {
    constructor(
        private userRepository: UserRepository,
        private authenticator: AuthenticatorManager
    ) {}

    async execute(
        input: GetProfileInput,
        token: string
    ): Promise<GetProfileResponse> {
        if (!this.hasAuthorization(token, input.userId))
            throw new Error(USER_ERROR_MESSAGES.UNAUTHORIZED_ERROR);
        const user = await this.getUserData(input.userId);
        const address =
            user.hasAddress && user.mainAddressId ?
                await this.userRepository.getAddress(
                    input.userId,
                    user.mainAddressId
                )
            :   undefined;
        return mapUserAndAddressToProfileResponse(user, address || undefined);
    }

    private async getUserData(userId: string): Promise<UserType> {
        const user = await this.userRepository.getUser(userId);
        if (!user) {
            throw new Error(USER_ERROR_MESSAGES.NOT_FOUND);
        }
        return user.getUser();
    }

    private hasAuthorization(token: string, idToCheck: string): boolean {
        try {
            return this.authenticator.checkToken(
                token,
                idToCheck,
                USER_ROLES.USER
            );
        } catch (e) {
            throw new Error(USER_ERROR_MESSAGES.AUTHORIZATION_CHECKING_ERROR);
        }
    }
}
