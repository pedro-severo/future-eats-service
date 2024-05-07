import { sign, verify } from 'jsonwebtoken';
import { authenticationData } from './interfaces';

export class AuthenticatorManager {
    public generateToken = (payload: authenticationData): string => {
        try {
            return (
                'Bearer ' +
                sign(payload, process.env.JWT_KEY || 'key', {
                    expiresIn: '60d',
                })
            );
        } catch (err) {
            throw new Error(err.message);
        }
    };

    public getTokenData = (token: string): authenticationData | null => {
        try {
            const tokenData = verify(
                this.removeBearer(token),
                process.env.JWT_KEY || 'key'
            ) as authenticationData;
            return {
                id: tokenData.id,
                role: tokenData.role,
            };
        } catch (err) {
            throw new Error(err.message);
        }
    };

    private removeBearer = (token: string): string => {
        if (token.startsWith('Bearer ')) {
            return token.slice(7);
        } else {
            return token;
        }
    };
}
