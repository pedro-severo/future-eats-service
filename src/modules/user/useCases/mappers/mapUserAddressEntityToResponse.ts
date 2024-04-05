import { UserAddress } from '../../entities/UserAddress';
import { RegisterAddressResponse } from '../interfaces/RegisterAddressResponse';

export const mapUserAddressEntityToResponse = (
    userAddress: UserAddress
): RegisterAddressResponse => {
    const { city, complement, id, state, streetName, streetNumber, zone } =
        userAddress.getUserAddress();
    return {
        city,
        complement,
        id,
        state,
        streetName,
        streetNumber,
        zone,
    };
};
