import mongoose from 'mongoose';
import Joi from 'joi';

/**
 * Check if the provided string is a valid MongoDB ObjectId
 */
export const validateId = (objectId: string): boolean => {
    return mongoose.Types.ObjectId.isValid(objectId);
};

/**
 * Joi custom validator for MongoDB ObjectId fields
 */
export const joiValidateObjectId = (value: string, helpers: Joi.CustomHelpers): any => {
    if (!mongoose.Types.ObjectId.isValid(value)) {
        return helpers.message({ custom: 'Invalid Id' });
    }
    return value;
};
