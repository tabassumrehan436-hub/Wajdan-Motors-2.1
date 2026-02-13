import { Response } from 'express';
import { Car } from '../models/Car.js';
import { AuthRequest } from '../middleware/auth.js';
import { AppError } from '../middleware/error.js';

export const carsController = {
  // Get all cars
  getAllCars: async (req: AuthRequest, res: Response) => {
    try {
      const { status, search, skip = '0', limit = '20' } = req.query;
      const skipNum = parseInt(skip as string, 10);
      const limitNum = parseInt(limit as string, 10);

      let query: any = {};

      if (status) {
        query.status = status;
      }

      if (search) {
        query.$text = { $search: search as string };
      }

      const cars = await Car.find(query)
        .skip(skipNum)
        .limit(limitNum)
        .sort({ created_at: -1 });

      const total = await Car.countDocuments(query);

      res.status(200).json({
        success: true,
        data: cars,
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
        message: 'Failed to fetch cars',
      });
    }
  },

  // Get single car
  getCarById: async (req: AuthRequest, res: Response) => {
    try {
      const { id } = req.params;
      const car = await Car.findById(id);

      if (!car) {
        throw new AppError('Car not found', 404);
      }

      res.status(200).json({
        success: true,
        data: car,
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
          message: 'Failed to fetch car',
        });
      }
    }
  },

  // Create car (Admin only)
  createCar: async (req: AuthRequest, res: Response) => {
    try {
      const carData = req.body;

      const car = new Car(carData);
      await car.save();

      res.status(201).json({
        success: true,
        message: 'Car created successfully',
        data: car,
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
          message: 'Failed to create car',
        });
      }
    }
  },

  // Update car (Admin only)
  updateCar: async (req: AuthRequest, res: Response) => {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const car = await Car.findByIdAndUpdate(
        id,
        { $set: updateData },
        { new: true, runValidators: true }
      );

      if (!car) {
        throw new AppError('Car not found', 404);
      }

      res.status(200).json({
        success: true,
        message: 'Car updated successfully',
        data: car,
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
          message: 'Failed to update car',
        });
      }
    }
  },

  // Delete car (Admin only)
  deleteCar: async (req: AuthRequest, res: Response) => {
    try {
      const { id } = req.params;

      const car = await Car.findByIdAndDelete(id);

      if (!car) {
        throw new AppError('Car not found', 404);
      }

      res.status(200).json({
        success: true,
        message: 'Car deleted successfully',
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
          message: 'Failed to delete car',
        });
      }
    }
  },

  // Get car statistics
  getCarStats: async (req: AuthRequest, res: Response) => {
    try {
      const total = await Car.countDocuments();
      const available = await Car.countDocuments({ status: 'available' });
      const sold = await Car.countDocuments({ status: 'sold' });

      const avgPrice = await Car.aggregate([
        { $group: { _id: null, avgPrice: { $avg: '$price' } } },
      ]);

      res.status(200).json({
        success: true,
        data: {
          total,
          available,
          sold,
          avgPrice: avgPrice[0]?.avgPrice || 0,
        },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to fetch car statistics',
      });
    }
  },
};
