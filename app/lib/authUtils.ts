import jwt, { Secret, JwtPayload, SignOptions } from 'jsonwebtoken';
import config from './config';

// Create Token Function
export const createToken = (payload: { userId: string; role: string }): string => {
  const expiresInValue = config.jwt.access_expires_in;

  const options: SignOptions = {
    expiresIn:
      typeof expiresInValue === 'string' || typeof expiresInValue === 'number'
        ? (expiresInValue as SignOptions['expiresIn'])
        : '1d', 
  };

  return jwt.sign(payload, config.jwt.access_secret as Secret, options);
};

//  Verify Token Function
export const verifyToken = (
  token: string
): (JwtPayload & { userId: string; role: string }) | null => {
  try {
    const decoded = jwt.verify(
      token,
      config.jwt.access_secret as Secret
    ) as JwtPayload & { userId: string; role: string };

    return decoded;
  } catch (error) {
    console.error('JWT Verification Error:', error);
    return null;
  }
};
