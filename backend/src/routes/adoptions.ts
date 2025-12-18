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

router.post(
  '/',
  protect,
  validate(createAdoptionSchema),
  adoptionController.createAdoption
);

router.get(
  '/my-applications',
  protect,
  adoptionController.getUserApplications
);

router.get(
  '/',
  protect,
  authorize('admin'),
  validateQuery(getAdoptionsQuerySchema),
  adoptionController.getAllAdoptions
);

router.put(
  '/:id/approve',
  protect,
  authorize('admin'),
  validate(approveRejectSchema),
  adoptionController.approveAdoption
);

router.put(
  '/:id/reject',
  protect,
  authorize('admin'),
  validate(approveRejectSchema),
  adoptionController.rejectAdoption
);

export default router;

