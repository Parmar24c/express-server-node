import Joi from 'joi';
import { joiValidateObjectId } from '../helpers/validate_objectid.js';

export const addProductValidator = Joi.object({
  name: Joi.string().trim().min(2).max(100).required(),
  description: Joi.string().allow('').max(500),
  price: Joi.number().min(0).required(),
  stock: Joi.number().min(0).default(0),
  category: Joi.string().custom(joiValidateObjectId).required(), // Custom ObjectId validation
  active: Joi.boolean().default(true),
});

export const updateProductValidator = Joi.object({
  name: Joi.string().trim().min(2).max(100),
  description: Joi.string().allow('').max(500),
  price: Joi.number().min(0),
  stock: Joi.number().min(0),
  category: Joi.string().custom(joiValidateObjectId),
  active: Joi.boolean(),
}).min(1); // At least one field must be provided


export const filterProductValidator = Joi.object({
    minPrice: Joi.number().min(0),
    maxPrice: Joi.number().min(0),
    sortByPrice: Joi.string().valid('asc', 'desc'),
    sortByCreatedAt: Joi.string().valid('asc', 'desc'),
    sortByName: Joi.string().valid('asc', 'desc'),
    page: Joi.number().min(1).default(1),
    limit: Joi.number().min(1).max(100).default(10),
    categoryId: Joi.string().custom(joiValidateObjectId),
    search: Joi.string().allow('')
});

