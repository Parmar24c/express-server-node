import jwt, { SignOptions } from 'jsonwebtoken';
import Constants from '../config/constants.js';

interface TokenPayload {
  [key: string]: any;
}

export function generateToken(
  payload: TokenPayload,
  expiresIn: any = '7d'
): string {
  const options: SignOptions = { expiresIn };

  return jwt.sign(payload, Constants.JWT_SECRET, options);
}
