import { Router } from 'express';
import { ordersController } from '../controllers/ordersController.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';
import {
  validateCreateOrder,
  validateUpdateOrder,
  validateMongoId,
  handleValidationErrors,
} from '../middleware/validation.js';

const router = Router();

// Public routes
router.post(
  '/',
  validateCreateOrder,
  handleValidationErrors,
  ordersController.createOrder
);

// Admin routes
router.get('/', authenticateToken, requireAdmin, ordersController.getAllOrders);

router.get('/stats', authenticateToken, requireAdmin, ordersController.getOrderStats);

router.get(
  '/:id',
  authenticateToken,
  validateMongoId,
  handleValidationErrors,
  ordersController.getOrderById
);

router.put(
  '/:id',
  authenticateToken,
  requireAdmin,
  validateUpdateOrder,
  handleValidationErrors,
  ordersController.updateOrderStatus
);

router.delete(
  '/:id',
  authenticateToken,
  requireAdmin,
  validateMongoId,
  handleValidationErrors,
  ordersController.deleteOrder
);

export default router;
