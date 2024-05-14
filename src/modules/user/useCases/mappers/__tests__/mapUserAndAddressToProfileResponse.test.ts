import { User } from '../../../entities/User';
import { UserAddress } from '../../../entities/UserAddress';
import { GetProfileResponse } from '../../interfaces/GetProfileResponse';
import { mapUserAndAddressToProfileResponse } from '../mapUserAndAddressToProfileResponse';

const user = new User('id', 'Name', 'email', 'password', true, 'cpf');
const address = new UserAddress(
    'addressId',
    'BH',
    'ap 1502',
    'MG',
    '479',
    'centro',
    'Guajajaras'
);

const expectedResponse: GetProfileResponse = {
    id: 'id',
    name: 'Name',
    email: 'email',
    cpf: 'cpf',
    hasAddress: true,
    address: 'Guajajaras, 479, ap 1502, centro, BH, MG',
};

describe('mapUserAndAddressToProfileResponse', () => {
    it('should call mapUserAndAddressToProfileResponse correctly', () => {
        const response = mapUserAndAddressToProfileResponse(user, address);
        expect(response).toEqual(expectedResponse);
    });
    it('should call mapUserAndAddressToProfileResponse correctly with address as undefined', () => {
        const response = mapUserAndAddressToProfileResponse(user, undefined);
        expect(response).toEqual({ ...expectedResponse, address: null });
    });
});
