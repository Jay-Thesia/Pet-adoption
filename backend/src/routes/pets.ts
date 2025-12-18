import express from 'express';
import * as petController from '../controllers/petController';
import { protect, authorize, optionalAuth } from '../middleware/auth';
import { validate, validateQuery } from '../middleware/validate';
import {
  createPetSchema,
  updatePetSchema,
  getPetsQuerySchema
} from '../validations/petValidation';

const router = express.Router();

router.get(
  '/',
  optionalAuth,
  validateQuery(getPetsQuerySchema),
  petController.getAllPets
);

router.get('/:id', petController.getPetById);

router.post(
  '/',
  protect,
  authorize('admin'),
  validate(createPetSchema),
  petController.createPet
);

router.put(
  '/:id',
  protect,
  authorize('admin'),
  validate(updatePetSchema),
  petController.updatePet
);

router.delete(
  '/:id',
  protect,
  authorize('admin'),
  petController.deletePet
);

export default router;

