import { Schema, model, Document } from 'mongoose';

export interface IInquiry extends Document {
  name: string;
  email: string;
  phone: string;
  car_name: string;
  car_id?: string;
  message: string;
  status: 'new' | 'contacted' | 'closed';
  created_at: Date;
  updated_at: Date;
}

const inquirySchema = new Schema<IInquiry>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      lowercase: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email address'],
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
    },
    car_name: {
      type: String,
      required: [true, 'Car name is required'],
      trim: true,
    },
    car_id: {
      type: String,
      default: null,
    },
    message: {
      type: String,
      required: [true, 'Message is required'],
      minlength: [10, 'Message must be at least 10 characters long'],
    },
    status: {
      type: String,
      enum: {
        values: ['new', 'contacted', 'closed'],
        message: 'Status must be new, contacted, or closed',
      },
      default: 'new',
    },
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
  }
);

// Create index for email and car_id for faster queries
inquirySchema.index({ email: 1 });
inquirySchema.index({ car_id: 1 });
inquirySchema.index({ status: 1 });

export const Inquiry = model<IInquiry>('Inquiry', inquirySchema);
