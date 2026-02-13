import { Router } from 'express';
import { authController } from '../controllers/authController.js';
import { authenticateToken } from '../middleware/auth.js';
import { validateLogin, validateRegister, handleValidationErrors } from '../middleware/validation.js';

const router = Router();

// Public routes
router.post(
  '/register',
  validateRegister,
  handleValidationErrors,
  authController.register
);

router.post(
  '/login',
  validateLogin,
  handleValidationErrors,
  authController.login
);

// Protected routes
router.get(
  '/me',
  authenticateToken,
  authController.getCurrentUser
);

router.post(
  '/logout',
  authenticateToken,
  authController.logout
);

export default router;
