import jwt from 'jsonwebtoken';
import Constants from '../config/constants.js';

export function generateToken(payload, expiresIn = '7d') {
    return jwt.sign(payload, Constants.JWT_SECRET, { expiresIn });
}
