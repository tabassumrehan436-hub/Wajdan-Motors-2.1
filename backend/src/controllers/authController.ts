import { Response } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import config from '../config/index.js';
import { AuthRequest } from '../middleware/auth.js';
import { AppError } from '../middleware/error.js';

const generateToken = (userId: string, email: string, role: string): string => {
  return jwt.sign(
    { id: userId, email, role },
    config.jwtSecret,
    { expiresIn: config.jwtExpire }
  );
};

export const authController = {
  // Register new user
  register: async (req: AuthRequest, res: Response) => {
    try {
      const { email, password, full_name, phone_number } = req.body;

      // Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        throw new AppError('User with this email already exists', 400);
      }

      // Create new user
      const user = new User({
        email,
        password,
        full_name,
        phone_number,
        role: 'user',
      });

      await user.save();

      const token = generateToken(user._id.toString(), user.email, user.role);

      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: {
          user: {
            id: user._id,
            email: user.email,
            full_name: user.full_name,
            role: user.role,
          },
          token,
        },
      });
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({
          success: false,
          message: error.message,
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Registration failed',
        });
      }
    }
  },

  // Login user
  login: async (req: AuthRequest, res: Response) => {
    try {
      const { email, password } = req.body;

      // Find user and select password field
      const user = await User.findOne({ email }).select('+password');
      if (!user) {
        throw new AppError('Invalid credentials', 401);
      }

      // Compare password
      const isPasswordValid = await user.comparePassword(password);
      if (!isPasswordValid) {
        throw new AppError('Invalid credentials', 401);
      }

      // Check if user is active
      if (!user.is_active) {
        throw new AppError('User account is disabled', 403);
      }

      const token = generateToken(user._id.toString(), user.email, user.role);

      res.status(200).json({
        success: true,
        message: 'Login successful',
        data: {
          user: {
            id: user._id,
            email: user.email,
            full_name: user.full_name,
            role: user.role,
            avatar_url: user.avatar_url,
            phone_number: user.phone_number,
          },
          token,
        },
      });
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({
          success: false,
          message: error.message,
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Login failed',
        });
      }
    }
  },

  // Get current user
  getCurrentUser: async (req: AuthRequest, res: Response) => {
    try {
      if (!req.user) {
        throw new AppError('User not authenticated', 401);
      }

      const user = await User.findById(req.user.id);
      if (!user) {
        throw new AppError('User not found', 404);
      }

      res.status(200).json({
        success: true,
        data: {
          id: user._id,
          email: user.email,
          full_name: user.full_name,
          role: user.role,
          avatar_url: user.avatar_url,
          phone_number: user.phone_number,
          created_at: user.created_at,
        },
      });
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({
          success: false,
          message: error.message,
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Failed to get user',
        });
      }
    }
  },

  // Logout
  logout: async (req: AuthRequest, res: Response) => {
    try {
      res.status(200).json({
        success: true,
        message: 'Logout successful',
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Logout failed',
      });
    }
  },
};
