import Joi from 'joi';

export const createPetSchema = Joi.object({
  name: Joi.string().trim().min(1).required().messages({
    'string.empty': 'Name is required',
    'any.required': 'Name is required'
  }),
  species: Joi.string().valid('dog', 'cat', 'bird', 'rabbit', 'other').lowercase().required().messages({
    'any.only': 'Species must be one of: dog, cat, bird, rabbit, other',
    'any.required': 'Species is required'
  }),
  breed: Joi.string().trim().min(1).required().messages({
    'string.empty': 'Breed is required',
    'any.required': 'Breed is required'
  }),
  age: Joi.number().integer().min(0).required().messages({
    'number.base': 'Age must be a number',
    'number.integer': 'Age must be an integer',
    'number.min': 'Age must be a non-negative integer',
    'any.required': 'Age is required'
  }),
  gender: Joi.string().valid('male', 'female', 'unknown').lowercase().optional(),
  description: Joi.string().trim().optional().allow(''),
  photo: Joi.string().uri().optional().allow(''),
  status: Joi.string().valid('available', 'pending', 'adopted').lowercase().optional()
});

export const updatePetSchema = Joi.object({
  name: Joi.string().trim().min(1).optional(),
  species: Joi.string().valid('dog', 'cat', 'bird', 'rabbit', 'other').lowercase().optional(),
  breed: Joi.string().trim().min(1).optional(),
  age: Joi.number().integer().min(0).optional(),
  gender: Joi.string().valid('male', 'female', 'unknown').lowercase().optional(),
  description: Joi.string().trim().optional().allow(''),
  photo: Joi.string().uri().optional().allow(''),
  status: Joi.string().valid('available', 'pending', 'adopted').lowercase().optional()
}).min(1).messages({
  'object.min': 'At least one field must be provided for update'
});

export const getPetsQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).optional(),
  limit: Joi.number().integer().min(1).max(100).optional(),
  species: Joi.string().valid('dog', 'cat', 'bird', 'rabbit', 'other').lowercase().optional(),
  breed: Joi.string().trim().optional(),
  age: Joi.number().integer().min(0).optional(),
  search: Joi.string().trim().optional()
});

