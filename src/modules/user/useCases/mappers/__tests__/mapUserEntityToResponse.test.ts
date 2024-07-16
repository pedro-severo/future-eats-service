import { USER_ROLES } from '../../../../../shared/services/authentication/interfaces';
import { User } from '../../../entities/User';
import { mapUserEntityToResponse } from '../mapUserEntityToResponse';

const mockInput = new User(
    'id',
    'name',
    'email',
    'password',
    false,
    'cpf',
    USER_ROLES.USER
).getUser();

describe('mapUserEntityToResponse test file', () => {
    it('should test correctly behavior of mapper', () => {
        const result = mapUserEntityToResponse(mockInput);
        expect(result.cpf).toBe(mockInput.cpf);
        expect(result.name).toBe(mockInput.name);
        expect(result.id).toBe(mockInput.id);
        expect(result.email).toBe(mockInput.email);
        expect(result.role).toBe(mockInput.role);
        expect(result.hasAddress).toBe(mockInput.hasAddress);
    });
});
