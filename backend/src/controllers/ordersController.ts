import { Response } from 'express';
import { Order } from '../models/Order.js';
import { AuthRequest } from '../middleware/auth.js';
import { AppError } from '../middleware/error.js';

export const ordersController = {
  // Get all orders (Admin)
  getAllOrders: async (req: AuthRequest, res: Response) => {
    try {
      const { status, skip = '0', limit = '20' } = req.query;
      const skipNum = parseInt(skip as string, 10);
      const limitNum = parseInt(limit as string, 10);

      let query: any = {};

      if (status) {
        query.status = status;
      }

      const orders = await Order.find(query)
        .skip(skipNum)
        .limit(limitNum)
        .sort({ created_at: -1 })
        .populate('car_id', 'name price');

      const total = await Order.countDocuments(query);

      res.status(200).json({
        success: true,
        data: orders,
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
        message: 'Failed to fetch orders',
      });
    }
  },

  // Get single order by ID
  getOrderById: async (req: AuthRequest, res: Response) => {
    try {
      const { id } = req.params;
      const order = await Order.findById(id).populate('car_id', 'name price mileage year');

      if (!order) {
        throw new AppError('Order not found', 404);
      }

      res.status(200).json({
        success: true,
        data: order,
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
          message: 'Failed to fetch order',
        });
      }
    }
  },

  // Create new order
  createOrder: async (req: AuthRequest, res: Response) => {
    try {
      const orderData = req.body;

      const order = new Order(orderData);
      await order.save();

      res.status(201).json({
        success: true,
        message: 'Order created successfully',
        data: order,
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
          message: 'Failed to create order',
        });
      }
    }
  },

  // Update order status (Admin only)
  updateOrderStatus: async (req: AuthRequest, res: Response) => {
    try {
      const { id } = req.params;
      const { status, notes } = req.body;

      const updateData: any = { status };
      if (notes) updateData.notes = notes;

      const order = await Order.findByIdAndUpdate(
        id,
        { $set: updateData },
        { new: true, runValidators: true }
      ).populate('car_id', 'name price');

      if (!order) {
        throw new AppError('Order not found', 404);
      }

      res.status(200).json({
        success: true,
        message: 'Order updated successfully',
        data: order,
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
          message: 'Failed to update order',
        });
      }
    }
  },

  // Delete order (Admin only)
  deleteOrder: async (req: AuthRequest, res: Response) => {
    try {
      const { id } = req.params;

      const order = await Order.findByIdAndDelete(id);

      if (!order) {
        throw new AppError('Order not found', 404);
      }

      res.status(200).json({
        success: true,
        message: 'Order deleted successfully',
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
          message: 'Failed to delete order',
        });
      }
    }
  },

  // Get order statistics (Admin only)
  getOrderStats: async (req: AuthRequest, res: Response) => {
    try {
      const total = await Order.countDocuments();
      const pending = await Order.countDocuments({ status: 'pending' });
      const approved = await Order.countDocuments({ status: 'approved' });
      const rejected = await Order.countDocuments({ status: 'rejected' });
      const completed = await Order.countDocuments({ status: 'completed' });

      const totalRevenue = await Order.aggregate([
        { $match: { status: 'completed' } },
        { $group: { _id: null, total: { $sum: '$total_amount' } } },
      ]);

      res.status(200).json({
        success: true,
        data: {
          total,
          pending,
          approved,
          rejected,
          completed,
          totalRevenue: totalRevenue[0]?.total || 0,
        },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to fetch order statistics',
      });
    }
  },
};
