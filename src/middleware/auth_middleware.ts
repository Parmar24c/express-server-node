import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import { Request, Response, NextFunction } from 'express';
import Constants from '../config/constants.js';

// Extend Express Request type for TypeScript
interface AuthenticatedRequest extends Request {
    user?: any; // adjust 'any' to your JWT payload type if needed
}

export function verifyToken(req: AuthenticatedRequest, res: Response, next: NextFunction): any {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer <token>

    if (!token) {
        return res.unauthorized('Access denied. No token provided.');
    }

    try {
        const decoded = jwt.verify(token, Constants.JWT_SECRET);
        req.user = decoded;

        // Optional: Validate req.params.id if present
        if (req.params.id && !mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.sendData(false, 'Invalid ID.');
        }

        next();
    } catch (err) {
        return res.unauthorized('Invalid or expired token.');
    }
}
