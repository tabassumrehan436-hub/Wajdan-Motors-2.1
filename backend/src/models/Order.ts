import { Schema, model, Document, Types } from 'mongoose';

export interface IOrder extends Document {
  customer_name: string;
  customer_email: string;
  customer_phone?: string;
  car_id: Types.ObjectId | string;
  car_name: string;
  total_amount: number;
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  notes?: string;
  created_at: Date;
  updated_at: Date;
}

const orderSchema = new Schema<IOrder>(
  {
    customer_name: {
      type: String,
      required: [true, 'Customer name is required'],
      trim: true,
    },
    customer_email: {
      type: String,
      required: [true, 'Customer email is required'],
      lowercase: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email address'],
    },
    customer_phone: {
      type: String,
      default: null,
    },
    car_id: {
      type: Schema.Types.ObjectId,
      required: [true, 'Car ID is required'],
      ref: 'Car',
    },
    car_name: {
      type: String,
      required: [true, 'Car name is required'],
      trim: true,
    },
    total_amount: {
      type: Number,
      required: [true, 'Total amount is required'],
      min: 0,
    },
    status: {
      type: String,
      enum: {
        values: ['pending', 'approved', 'rejected', 'completed'],
        message: 'Status must be pending, approved, rejected, or completed',
      },
      default: 'pending',
    },
    notes: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
  }
);

// Create indexes for faster queries
orderSchema.index({ customer_email: 1 });
orderSchema.index({ car_id: 1 });
orderSchema.index({ status: 1 });
orderSchema.index({ created_at: -1 });

export const Order = model<IOrder>('Order', orderSchema);
