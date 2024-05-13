import { UserAddress } from '../entities/UserAddress';
import { UserRepository } from '../repository/UserRepository';

export class GetProfileUseCase {
    constructor(private userRepository: UserRepository) {}
    async execute(input: any): Promise<any> {
        let address: UserAddress
        const user = await this.userRepository.getUser(input.userId);
        if (user?.getUser().hasAddress) {
            address = await this.userRepository.getAddress(input.userId, user.getUser().addressId)
        }
        return user;
    }
}
