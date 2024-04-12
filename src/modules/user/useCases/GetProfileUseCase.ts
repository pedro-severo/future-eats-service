import { GetProfileInput } from '../controllers/inputs/GetProfileInput';
import { UserRepository } from '../repository/UserRepository';

export class GetProfileUseCase {
    constructor(private userRepository: UserRepository) {}
    async execute(input: GetProfileInput) {
        await this.userRepository.getUser(input.userId);
        return {};
    }
}
