import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { User } from '../models/User.js';
import { Car } from '../models/Car.js';
import { Inquiry } from '../models/Inquiry.js';
import { Order } from '../models/Order.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../../.env') });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/wajdan-motors';

const seedDatabase = async (): Promise<void> => {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('✓ Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Car.deleteMany({});
    await Inquiry.deleteMany({});
    await Order.deleteMany({});
    console.log('✓ Cleared existing data');

    // Create admin user
    const adminUser = new User({
      email: 'admin@wajdanmotors.com',
      password: 'Admin@123456',
      full_name: 'Admin User',
      phone_number: '+923001234567',
      role: 'admin',
      is_active: true,
    });
    await adminUser.save();
    console.log('✓ Created admin user (email: admin@wajdanmotors.com)');

    // Create regular user
    const regularUser = new User({
      email: 'user@example.com',
      password: 'User@123456',
      full_name: 'Regular User',
      phone_number: '+923009876543',
      role: 'user',
      is_active: true,
    });
    await regularUser.save();
    console.log('✓ Created regular user');

    // Create sample cars
    const cars = await Car.insertMany([
      {
        name: 'Honda Civic 2022',
        car_name: 'Honda Civic',
        make: 'Honda',
        body_type: 'Sedan',
        year: 2022,
        price: 3500000,
        mileage: 25000,
        image: 'https://via.placeholder.com/400x300?text=Honda+Civic',
        status: 'available',
        transmission: 'Automatic',
        fuel_type: 'Petrol',
        color: 'Silver',
        seating: 5,
        features: ['Air Conditioning', 'Power Steering', 'Bluetooth'],
      },
      {
        name: 'Toyota Fortuner 2021',
        car_name: 'Toyota Fortuner',
        make: 'Toyota',
        body_type: 'SUV',
        year: 2021,
        price: 5800000,
        mileage: 35000,
        image: 'https://via.placeholder.com/400x300?text=Toyota+Fortuner',
        status: 'available',
        transmission: 'Automatic',
        fuel_type: 'Diesel',
        color: 'Black',
        seating: 7,
        features: ['4WD', 'Air Conditioning', 'Power Steering'],
      },
      {
        name: 'Haval H6 2023',
        car_name: 'Haval H6',
        make: 'Haval',
        body_type: 'Compact SUV',
        year: 2023,
        price: 4200000,
        mileage: 12000,
        image: 'https://via.placeholder.com/400x300?text=Haval+H6',
        status: 'available',
        transmission: 'Automatic',
        fuel_type: 'Petrol',
        color: 'White',
        seating: 5,
        features: ['Turbo', 'Air Conditioning', 'Power Windows'],
      },
      {
        name: 'Suzuki Swift 2020',
        car_name: 'Suzuki Swift',
        make: 'Suzuki',
        body_type: 'Hatchback',
        year: 2020,
        price: 2200000,
        mileage: 45000,
        image: 'https://via.placeholder.com/400x300?text=Suzuki+Swift',
        status: 'sold',
        transmission: 'Manual',
        fuel_type: 'Petrol',
        color: 'Red',
        seating: 5,
        features: ['Air Conditioning', 'Power Steering'],
      },
    ]);
    console.log(`✓ Created ${cars.length} sample cars`);

    // Create sample inquiries
    const inquiries = await Inquiry.insertMany([
      {
        name: 'Ahmed Khan',
        email: 'ahmed@example.com',
        phone: '+923001234567',
        car_name: 'Honda Civic 2022',
        car_id: cars[0]._id.toString(),
        message: 'I am interested in this car. Can you provide more details about the condition and warranty?',
        status: 'new',
      },
      {
        name: 'Fatima Ali',
        email: 'fatima@example.com',
        phone: '+923008765432',
        car_name: 'Toyota Fortuner 2021',
        car_id: cars[1]._id.toString(),
        message: 'Is this car available? What is the lowest price you can offer?',
        status: 'contacted',
      },
    ]);
    console.log(`✓ Created ${inquiries.length} sample inquiries`);

    // Create sample orders
    const orders = await Order.insertMany([
      {
        customer_name: 'Muhammad Hassan',
        customer_email: 'hassan@example.com',
        customer_phone: '+923001111111',
        car_id: cars[0]._id,
        car_name: 'Honda Civic 2022',
        total_amount: 3500000,
        status: 'pending',
        notes: 'Waiting for customer approval',
      },
      {
        customer_name: 'Zainab Malik',
        customer_email: 'zainab@example.com',
        customer_phone: '+923002222222',
        car_id: cars[1]._id,
        car_name: 'Toyota Fortuner 2021',
        total_amount: 5800000,
        status: 'approved',
        notes: 'Customer approved, processing payment',
      },
    ]);
    console.log(`✓ Created ${orders.length} sample orders`);

    console.log(`
╔════════════════════════════════════════════════════════╗
║         Database Seed Completed Successfully!          ║
║                                                        ║
║  Admin Account:                                        ║
║  - Email: admin@wajdanmotors.com                      ║
║  - Password: Admin@123456                             ║
║                                                        ║
║  Regular User Account:                                 ║
║  - Email: user@example.com                            ║
║  - Password: User@123456                              ║
║                                                        ║
║  Sample Data Created:                                 ║
║  - Cars: ${cars.length}                                          ║
║  - Inquiries: ${inquiries.length}                                      ║
║  - Orders: ${orders.length}                                       ║
║                                                        ║
╚════════════════════════════════════════════════════════╝
    `);

    await mongoose.disconnect();
    console.log('✓ Disconnected from MongoDB');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
