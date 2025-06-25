import jwt from 'jsonwebtoken';
import apiResponse from '../helpers/api_response.js';
import mongoose from 'mongoose';

const JWT_SECRET = process.env.JWT_SECRET || 'secretkey';

export function verifyToken(req, res, next) {
  const authHeader = req.headers['authorization'];

  const token = authHeader && authHeader.split(' ')[1]; // Format: Bearer <token>
  if (!token) {
    return res.status(401).json(apiResponse(false, 'Access denied. No token provided.'));
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // Save user info (like userId) to request
    if (req.params.id && !mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.json(apiResponse(false, 'Invalid ID.'));
    }
    next();
  } catch (err) {
    return res.status(403).json(apiResponse(false, 'Invalid or expired token.', null, { error: err.message }));
  }
}
