import { Router } from 'express';
import { inquiriesController } from '../controllers/inquiriesController.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';
import {
  validateCreateInquiry,
  validateUpdateInquiry,
  validateMongoId,
  handleValidationErrors,
} from '../middleware/validation.js';

const router = Router();

// Public routes
router.post(
  '/',
  validateCreateInquiry,
  handleValidationErrors,
  inquiriesController.createInquiry
);

// Admin routes
router.get('/', authenticateToken, requireAdmin, inquiriesController.getAllInquiries);

router.get('/stats', authenticateToken, requireAdmin, inquiriesController.getInquiryStats);

router.get(
  '/:id',
  authenticateToken,
  validateMongoId,
  handleValidationErrors,
  inquiriesController.getInquiryById
);

router.put(
  '/:id',
  authenticateToken,
  requireAdmin,
  validateUpdateInquiry,
  handleValidationErrors,
  inquiriesController.updateInquiryStatus
);

router.delete(
  '/:id',
  authenticateToken,
  requireAdmin,
  validateMongoId,
  handleValidationErrors,
  inquiriesController.deleteInquiry
);

export default router;
