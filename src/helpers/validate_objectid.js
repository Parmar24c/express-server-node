import mongoose from 'mongoose';

export const validateId = (objectId) => {
  return mongoose.Types.ObjectId.isValid(objectId);
};
