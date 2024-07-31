import { UserAddressType } from '../../entities/UserAddress';
import { AddressResponse } from '../interfaces/AddressResponse';

export const mapUserAddressEntityToResponse = (
    userAddress: UserAddressType
): AddressResponse => {
    const { city, complement, id, state, streetName, streetNumber, zone } =
        userAddress;
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
