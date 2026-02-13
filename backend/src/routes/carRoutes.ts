import { Router } from 'express';
import { carsController } from '../controllers/carsController.js';
import { authenticateToken, requireAdmin, optionalAuth } from '../middleware/auth.js';
import {
  validateCreateCar,
  validateUpdateCar,
  validateMongoId,
  handleValidationErrors,
} from '../middleware/validation.js';

const router = Router();

// Public routes
router.get('/', optionalAuth, carsController.getAllCars);
router.get('/stats', carsController.getCarStats);
router.get('/:id', validateMongoId, handleValidationErrors, carsController.getCarById);

// Admin routes
router.post(
  '/',
  authenticateToken,
  requireAdmin,
  validateCreateCar,
  handleValidationErrors,
  carsController.createCar
);

router.put(
  '/:id',
  authenticateToken,
  requireAdmin,
  validateUpdateCar,
  handleValidationErrors,
  carsController.updateCar
);

router.delete(
  '/:id',
  authenticateToken,
  requireAdmin,
  validateMongoId,
  handleValidationErrors,
  carsController.deleteCar
);

export default router;
