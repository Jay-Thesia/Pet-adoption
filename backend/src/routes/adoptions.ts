import express from 'express';
import * as adoptionController from '../controllers/adoptionController';
import { protect, authorize } from '../middleware/auth';
import { validate, validateQuery } from '../middleware/validate';
import {
  createAdoptionSchema,
  approveRejectSchema,
  getAdoptionsQuerySchema
} from '../validations/adoptionValidation';

const router = express.Router();

// @route   POST /api/adoptions
// @desc    Apply to adopt a pet
// @access  Private/User
router.post(
  '/',
  protect,
  validate(createAdoptionSchema),
  adoptionController.createAdoption
);

// @route   GET /api/adoptions/my-applications
// @desc    Get current user's adoption applications
// @access  Private/User
router.get(
  '/my-applications',
  protect,
  adoptionController.getUserApplications
);

// @route   GET /api/adoptions
// @desc    Get all adoption applications (Admin only)
// @access  Private/Admin
router.get(
  '/',
  protect,
  authorize('admin'),
  validateQuery(getAdoptionsQuerySchema),
  adoptionController.getAllAdoptions
);

// @route   PUT /api/adoptions/:id/approve
// @desc    Approve an adoption application
// @access  Private/Admin
router.put(
  '/:id/approve',
  protect,
  authorize('admin'),
  validate(approveRejectSchema),
  adoptionController.approveAdoption
);

// @route   PUT /api/adoptions/:id/reject
// @desc    Reject an adoption application
// @access  Private/Admin
router.put(
  '/:id/reject',
  protect,
  authorize('admin'),
  validate(approveRejectSchema),
  adoptionController.rejectAdoption
);

export default router;

