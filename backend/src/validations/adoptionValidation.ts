import Joi from 'joi';

export const createAdoptionSchema = Joi.object({
  petId: Joi.string().required().messages({
    'string.empty': 'Pet ID is required',
    'any.required': 'Pet ID is required'
  })
});

export const approveRejectSchema = Joi.object({
  notes: Joi.string().trim().optional().allow('')
});

export const getAdoptionsQuerySchema = Joi.object({
  status: Joi.string().valid('pending', 'approved', 'rejected').optional(),
  page: Joi.number().integer().min(1).optional(),
  limit: Joi.number().integer().min(1).max(100).optional()
});

