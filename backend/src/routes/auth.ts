import express from 'express';
import * as authController from '../controllers/authController';
import { protect } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { registerSchema, loginSchema } from '../validations/authValidation';

const router = express.Router();

router.post('/register', validate(registerSchema), authController.register);

router.post('/login', validate(loginSchema), authController.login);

router.get('/me', protect, authController.getMe);

export default router;

