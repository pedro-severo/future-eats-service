import { UserRepository } from '../repository/UserRepository';

export class GetProfileUseCase {
    constructor(private userRepository: UserRepository) {}
    async execute(input: any): Promise<any> {
        console.log('🚀 ~ GetProfileUseCase ~ execute ~ input:', input);
        // const user = await this.userRepository.getUser(input.userId);
        return {};
    }
}
