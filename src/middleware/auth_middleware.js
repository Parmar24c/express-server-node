import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import Constants from '../config/constants.js';

export function verifyToken(req, res, next) {
  const authHeader = req.headers['authorization'];

  const token = authHeader && authHeader.split(' ')[1]; // Format: Bearer <token>
  if (!token) {
    return res.unauthorized('Access denied. No token provided.');
  }

  try {
    const decoded = jwt.verify(token, Constants.JWT_SECRET);
    req.user = decoded; // Save user info (like userId) to request
    if (req.params.id && !mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.sendData(false, 'Invalid ID.');
    }
    next();
  } catch (err) {
    return res.unauthorized('Invalid or expired token.', err);
  }
}
