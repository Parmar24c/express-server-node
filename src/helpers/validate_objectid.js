import mongoose from 'mongoose';

export const validateId = (objectId) => {
  return mongoose.Types.ObjectId.isValid(objectId);
};
export const joiValidateObjectId = (value, helpers) => {
  if (!mongoose.Types.ObjectId.isValid(value)) {
    return helpers.message('Invalid Id');
  }
  return value;
};