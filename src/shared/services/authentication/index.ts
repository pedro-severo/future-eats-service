import { sign, verify } from 'jsonwebtoken';
import { authenticationData } from './interfaces';
import { Service } from 'typedi';

@Service()
export class AuthenticatorManager {
    public generateToken = (payload: authenticationData): string => {
        return (
            'Bearer ' +
            sign(payload, process.env.JWT_KEY || 'key', {
                expiresIn: '60d',
            })
        );
    };

    public getTokenData = (token: string): authenticationData | null => {
        const tokenData = verify(
            this.removeBearer(token),
            process.env.JWT_KEY || 'key'
        ) as authenticationData;
        return {
            id: tokenData.id,
            role: tokenData.role,
        };
    };

    public checkToken = (
        token: string,
        idToCheck: string,
        roleToCheck: string
    ): boolean => {
        const { id, role } = this.getTokenData(token) || {};
        return id === idToCheck && role === roleToCheck;
    };

    private removeBearer = (token: string): string => {
        if (token.startsWith('Bearer ')) {
            return token.slice(7);
        } else {
            return token;
        }
    };
}
