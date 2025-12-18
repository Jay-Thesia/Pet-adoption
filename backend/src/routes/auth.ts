import express from 'express';
import * as authController from '../controllers/authController';
import { protect } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { registerSchema, loginSchema } from '../validations/authValidation';

const router = express.Router();

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', validate(registerSchema), authController.register);

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', validate(loginSchema), authController.login);

// @route   GET /api/auth/me
// @desc    Get current user
// @access  Private
router.get('/me', protect, authController.getMe);

export default router;

