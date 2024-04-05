import { UserAddress } from '../../../entities/UserAddress';
import { mapUserAddressEntityToResponse } from '../mapUserAddressEntityToResponse';

const mockInput = new UserAddress(
    'userId',
    'Gothan',
    'Wayne Enterprises',
    'NY',
    '212',
    'Center',
    'Alfred'
);

describe('mapUserEntityToResponse test file', () => {
    it('should test correctly behavior of mapper', () => {
        const { id, city, complement, state, streetName, streetNumber, zone } =
            mockInput.getUserAddress();
        const result = mapUserAddressEntityToResponse(mockInput);
        expect(result.city).toBe(city);
        expect(result.complement).toBe(complement);
        expect(result.id).toBe(id);
        expect(result.state).toBe(state);
        expect(result.zone).toBe(zone);
        expect(result.streetName).toBe(streetName);
        expect(result.streetNumber).toBe(streetNumber);
    });
});
