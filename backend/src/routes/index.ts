import { Router } from 'express';
import authRoutes from './authRoutes.js';
import carRoutes from './carRoutes.js';
import inquiryRoutes from './inquiryRoutes.js';
import orderRoutes from './orderRoutes.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/cars', carRoutes);
router.use('/inquiries', inquiryRoutes);
router.use('/orders', orderRoutes);

// Health check endpoint
router.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
  });
});

export default router;
