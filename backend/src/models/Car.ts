import { Schema, model, Document } from 'mongoose';

export interface ICar extends Document {
  name: string;
  car_name: string;
  make: string;
  body_type: string;
  year: number;
  price: number;
  mileage: number;
  image: string;
  images?: string[];
  status: 'available' | 'sold';
  engine?: string;
  transmission?: string;
  fuel_type?: string;
  color?: string;
  description?: string;
  seating?: number;
  features?: string[];
  created_at: Date;
  updated_at: Date;
}

const carSchema = new Schema<ICar>(
  {
    name: {
      type: String,
      required: [true, 'Car name is required'],
      trim: true,
    },
    car_name: {
      type: String,
      required: [true, 'Car name is required'],
      trim: true,
    },
    make: {
      type: String,
      required: [true, 'Make is required'],
      trim: true,
    },
    body_type: {
      type: String,
      required: [true, 'Body type is required'],
      trim: true,
    },
    year: {
      type: Number,
      required: [true, 'Year is required'],
      min: 1990,
      max: new Date().getFullYear(),
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: 0,
    },
    mileage: {
      type: Number,
      required: [true, 'Mileage is required'],
      min: 0,
    },
    image: {
      type: String,
      required: [true, 'Image is required'],
    },
    images: {
      type: [String],
      default: [],
    },
    status: {
      type: String,
      enum: {
        values: ['available', 'sold'],
        message: 'Status must be either available or sold',
      },
      default: 'available',
    },
    engine: {
      type: String,
      default: null,
    },
    transmission: {
      type: String,
      enum: {
        values: ['Manual', 'Automatic', 'CVT'],
        message: 'Transmission must be Manual, Automatic, or CVT',
      },
      default: null,
    },
    fuel_type: {
      type: String,
      enum: {
        values: ['Petrol', 'Diesel', 'Hybrid', 'Electric'],
        message: 'Fuel type must be Petrol, Diesel, Hybrid, or Electric',
      },
      default: null,
    },
    color: {
      type: String,
      default: null,
    },
    description: {
      type: String,
      default: null,
    },
    seating: {
      type: Number,
      min: 1,
      max: 10,
      default: null,
    },
    features: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
  }
);

// Create text index for search functionality
carSchema.index({ name: 'text', car_name: 'text', make: 'text', description: 'text' });

export const Car = model<ICar>('Car', carSchema);
