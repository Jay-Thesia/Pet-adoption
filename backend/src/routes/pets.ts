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

// @route   GET /api/pets
// @desc    Get all pets with search, filter, and pagination
// @access  Public (but checks auth if token provided to show all pets to admins)
router.get(
  '/',
  optionalAuth,
  validateQuery(getPetsQuerySchema),
  petController.getAllPets
);

// @route   GET /api/pets/:id
// @desc    Get single pet by ID
// @access  Public
router.get('/:id', petController.getPetById);

// @route   POST /api/pets
// @desc    Create a new pet
// @access  Private/Admin
router.post(
  '/',
  protect,
  authorize('admin'),
  validate(createPetSchema),
  petController.createPet
);

// @route   PUT /api/pets/:id
// @desc    Update a pet
// @access  Private/Admin
router.put(
  '/:id',
  protect,
  authorize('admin'),
  validate(updatePetSchema),
  petController.updatePet
);

// @route   DELETE /api/pets/:id
// @desc    Delete a pet
// @access  Private/Admin
router.delete(
  '/:id',
  protect,
  authorize('admin'),
  petController.deletePet
);

export default router;

