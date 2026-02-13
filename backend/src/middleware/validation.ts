import { body, param, query, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

// Middleware to handle validation errors
export const handleValidationErrors = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map((err) => ({
        field: err.type === 'field' ? err.path : 'general',
        message: err.msg,
      })),
    });
    return;
  }
  next();
};

// Auth Validators
export const validateLogin = [
  body('email', 'Email is required and must be valid').isEmail().normalizeEmail(),
  body('password', 'Password is required and must be at least 6 characters').isLength({ min: 6 }),
];

export const validateRegister = [
  body('email', 'Email is required and must be valid').isEmail().normalizeEmail(),
  body('password', 'Password is required and must be at least 6 characters').isLength({ min: 6 }),
  body('full_name', 'Full name is required').trim().isLength({ min: 2 }),
  body('phone_number').optional().isMobilePhone('any'),
];

// Car Validators
export const validateCreateCar = [
  body('name', 'Name is required').trim().notEmpty(),
  body('car_name', 'Car name is required').trim().notEmpty(),
  body('make', 'Make is required').trim().notEmpty(),
  body('body_type', 'Body type is required').trim().notEmpty(),
  body('year', 'Year must be a valid number between 1990 and current year')
    .isInt({ min: 1990, max: new Date().getFullYear() }),
  body('price', 'Price must be a positive number').isFloat({ min: 0 }),
  body('mileage', 'Mileage must be a non-negative number').isFloat({ min: 0 }),
  body('image', 'Image URL is required').trim().notEmpty(),
  body('status', 'Status must be either available or sold')
    .optional()
    .isIn(['available', 'sold']),
  body('transmission')
    .optional()
    .isIn(['Manual', 'Automatic', 'CVT']),
  body('fuel_type')
    .optional()
    .isIn(['Petrol', 'Diesel', 'Hybrid', 'Electric']),
  body('seating')
    .optional()
    .isInt({ min: 1, max: 10 }),
];

export const validateUpdateCar = [
  param('id', 'Valid car ID is required').isMongoId(),
  body('name').optional().trim().notEmpty(),
  body('car_name').optional().trim().notEmpty(),
  body('year')
    .optional()
    .isInt({ min: 1990, max: new Date().getFullYear() }),
  body('price').optional().isFloat({ min: 0 }),
  body('mileage').optional().isFloat({ min: 0 }),
  body('status')
    .optional()
    .isIn(['available', 'sold']),
  body('transmission')
    .optional()
    .isIn(['Manual', 'Automatic', 'CVT']),
  body('fuel_type')
    .optional()
    .isIn(['Petrol', 'Diesel', 'Hybrid', 'Electric']),
];

// Inquiry Validators
export const validateCreateInquiry = [
  body('name', 'Name is required').trim().isLength({ min: 2 }),
  body('email', 'Email is required and must be valid').isEmail().normalizeEmail(),
  body('phone', 'Phone number is required').trim().notEmpty(),
  body('car_name', 'Car name is required').trim().notEmpty(),
  body('message', 'Message is required and must be at least 10 characters')
    .trim()
    .isLength({ min: 10 }),
];

export const validateUpdateInquiry = [
  param('id', 'Valid inquiry ID is required').isMongoId(),
  body('status', 'Status must be new, contacted, or closed')
    .optional()
    .isIn(['new', 'contacted', 'closed']),
];

// Order Validators
export const validateCreateOrder = [
  body('customer_name', 'Customer name is required').trim().isLength({ min: 2 }),
  body('customer_email', 'Email is required and must be valid').isEmail().normalizeEmail(),
  body('car_id', 'Valid car ID is required').isMongoId(),
  body('car_name', 'Car name is required').trim().notEmpty(),
  body('total_amount', 'Total amount must be a positive number').isFloat({ min: 0 }),
];

export const validateUpdateOrder = [
  param('id', 'Valid order ID is required').isMongoId(),
  body('status', 'Status must be pending, approved, rejected, or completed')
    .optional()
    .isIn(['pending', 'approved', 'rejected', 'completed']),
];

// Generic ID validation
export const validateMongoId = [
  param('id', 'Valid ID is required').isMongoId(),
];
