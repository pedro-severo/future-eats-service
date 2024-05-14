import { GetProfileInput } from '../controllers/inputs/GetProfileInput';
import { UserRepository } from '../repository/UserRepository';
import { USER_ERROR_MESSAGES } from './constants/errorMessages';
import { GetProfileResponse } from './interfaces/GetProfileResponse';
import { mapUserAndAddressToProfileResponse } from './mappers/mapUserAndAddressToProfileResponse';

export class GetProfileUseCase {
    constructor(private userRepository: UserRepository) {}
    async execute(input: GetProfileInput): Promise<GetProfileResponse> {
        const user = await this.userRepository.getUser(input.userId);
        if (!user) throw new Error(USER_ERROR_MESSAGES.NOT_FOUND);
        const { hasAddress, mainAddressId } = user.getUser();
        const address =
            hasAddress && mainAddressId ?
                await this.userRepository.getAddress(
                    input.userId,
                    mainAddressId
                )
            :   undefined;
        return mapUserAndAddressToProfileResponse(user, address || undefined);
    }
}
