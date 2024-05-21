import { UserType } from '../../entities/User';
import { UserAddress } from '../../entities/UserAddress';
import { GetProfileResponse } from '../interfaces/GetProfileResponse';

export const mapUserAndAddressToProfileResponse = (
    user: UserType,
    userAddress?: UserAddress
): GetProfileResponse => {
    const { name, id, email, cpf, hasAddress } = user;
    const { city, complement, state, streetNumber, streetName, zone } =
        userAddress?.getUserAddress() || {};
    return {
        id,
        name,
        email,
        cpf,
        hasAddress,
        address:
            hasAddress && userAddress ?
                [streetName, streetNumber, complement, zone, city, state].join(
                    ', '
                )
            :   null,
    };
};
