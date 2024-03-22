import { User } from '../../../entities/User';
import { mapUserEntityToResponse } from '../mapUserEntityToResponse';

const mockInput = new User('id', 'name', 'email', 'password', false, 'cpf');

describe('mapUserEntityToResponse test file', () => {
    it('should test correctly behavior of mapper', () => {
        const { id, name, email, password, hasAddress, cpf } =
            mockInput.getUser();
        const result = mapUserEntityToResponse(mockInput);
        expect(result.cpf).toBe(cpf);
        expect(result.name).toBe(name);
        expect(result.id).toBe(id);
        expect(result.email).toBe(email);
        expect(result.password).toBe(password);
        expect(result.hasAddress).toBe(hasAddress);
    });
});
