import { UserRepository } from '../repository/UserRepository';

export class GetProfileUseCase {
    constructor(private userRepository: UserRepository) {}
}
