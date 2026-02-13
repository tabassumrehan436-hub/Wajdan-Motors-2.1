import { Response } from 'express';
import { Inquiry } from '../models/Inquiry.js';
import { AuthRequest } from '../middleware/auth.js';
import { AppError } from '../middleware/error.js';

export const inquiriesController = {
  // Get all inquiries (Admin only)
  getAllInquiries: async (req: AuthRequest, res: Response) => {
    try {
      const { status, skip = '0', limit = '20' } = req.query;
      const skipNum = parseInt(skip as string, 10);
      const limitNum = parseInt(limit as string, 10);

      let query: any = {};

      if (status) {
        query.status = status;
      }

      const inquiries = await Inquiry.find(query)
        .skip(skipNum)
        .limit(limitNum)
        .sort({ created_at: -1 });

      const total = await Inquiry.countDocuments(query);

      res.status(200).json({
        success: true,
        data: inquiries,
        pagination: {
          total,
          skip: skipNum,
          limit: limitNum,
          pages: Math.ceil(total / limitNum),
        },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to fetch inquiries',
      });
    }
  },

  // Get single inquiry by ID
  getInquiryById: async (req: AuthRequest, res: Response) => {
    try {
      const { id } = req.params;
      const inquiry = await Inquiry.findById(id);

      if (!inquiry) {
        throw new AppError('Inquiry not found', 404);
      }

      res.status(200).json({
        success: true,
        data: inquiry,
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
          message: 'Failed to fetch inquiry',
        });
      }
    }
  },

  // Create new inquiry (Public)
  createInquiry: async (req: AuthRequest, res: Response) => {
    try {
      const inquiryData = req.body;

      const inquiry = new Inquiry(inquiryData);
      await inquiry.save();

      res.status(201).json({
        success: true,
        message: 'Inquiry created successfully',
        data: inquiry,
      });
    } catch (error: any) {
      if (error.name === 'ValidationError') {
        res.status(400).json({
          success: false,
          message: 'Validation error',
          errors: Object.values(error.errors).map((err: any) => err.message),
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Failed to create inquiry',
        });
      }
    }
  },

  // Update inquiry status (Admin only)
  updateInquiryStatus: async (req: AuthRequest, res: Response) => {
    try {
      const { id } = req.params;
      const { status } = req.body;

      const inquiry = await Inquiry.findByIdAndUpdate(
        id,
        { status },
        { new: true, runValidators: true }
      );

      if (!inquiry) {
        throw new AppError('Inquiry not found', 404);
      }

      res.status(200).json({
        success: true,
        message: 'Inquiry updated successfully',
        data: inquiry,
      });
    } catch (error: any) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({
          success: false,
          message: error.message,
        });
      } else if (error.name === 'ValidationError') {
        res.status(400).json({
          success: false,
          message: 'Validation error',
          errors: Object.values(error.errors).map((err: any) => err.message),
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Failed to update inquiry',
        });
      }
    }
  },

  // Delete inquiry (Admin only)
  deleteInquiry: async (req: AuthRequest, res: Response) => {
    try {
      const { id } = req.params;

      const inquiry = await Inquiry.findByIdAndDelete(id);

      if (!inquiry) {
        throw new AppError('Inquiry not found', 404);
      }

      res.status(200).json({
        success: true,
        message: 'Inquiry deleted successfully',
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
          message: 'Failed to delete inquiry',
        });
      }
    }
  },

  // Get inquiry statistics (Admin only)
  getInquiryStats: async (req: AuthRequest, res: Response) => {
    try {
      const total = await Inquiry.countDocuments();
      const newInquiries = await Inquiry.countDocuments({ status: 'new' });
      const contacted = await Inquiry.countDocuments({ status: 'contacted' });
      const closed = await Inquiry.countDocuments({ status: 'closed' });

      res.status(200).json({
        success: true,
        data: {
          total,
          new: newInquiries,
          contacted,
          closed,
        },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to fetch inquiry statistics',
      });
    }
  },
};
