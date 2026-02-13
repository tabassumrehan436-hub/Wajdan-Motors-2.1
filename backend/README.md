# Wajdan Motors Backend API

Complete production-ready backend for the Wajdan Motors application built with Node.js, Express.js, and MongoDB.

## Features

- ✅ **MVC Architecture** - Clean separation of concerns
- ✅ **JWT Authentication** - Secure token-based auth
- ✅ **Role-Based Access Control** - Admin and User roles
- ✅ **MongoDB & Mongoose** - NoSQL database with excellent ORM
- ✅ **RESTful API** - Standard REST API design
- ✅ **Input Validation** - Using express-validator
- ✅ **Error Handling** - Centralized error handling
- ✅ **Security** - Helmet, CORS, bcrypt password hashing
- ✅ **Logging** - Morgan HTTP request logging
- ✅ **Environment Configuration** - Dotenv support
- ✅ **TypeScript** - Fully typed for better development experience

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB + Mongoose
- **Language**: TypeScript
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: bcryptjs
- **Validation**: express-validator
- **Security**: Helmet, CORS
- **Logging**: Morgan
- **Development**: tsx, TypeScript

## Project Structure

```
backend/
├── src/
│   ├── config/
│   │   ├── index.ts           # Configuration management
│   │   └── database.ts        # MongoDB connection
│   ├── controllers/
│   │   ├── authController.ts      # Authentication logic
│   │   ├── carsController.ts      # Cars management
│   │   ├── inquiriesController.ts # Inquiries management
│   │   └── ordersController.ts    # Orders management
│   ├── models/
│   │   ├── User.ts            # User schema & model
│   │   ├── Car.ts             # Car schema & model
│   │   ├── Inquiry.ts         # Inquiry schema & model
│   │   └── Order.ts           # Order schema & model
│   ├── middleware/
│   │   ├── auth.ts            # JWT verification
│   │   ├── error.ts           # Error handling
│   │   └── validation.ts      # Input validation rules
│   ├── routes/
│   │   ├── authRoutes.ts      # Auth endpoints
│   │   ├── carRoutes.ts       # Cars endpoints
│   │   ├── inquiryRoutes.ts   # Inquiries endpoints
│   │   ├── orderRoutes.ts     # Orders endpoints
│   │   └── index.ts           # Route aggregation
│   ├── utils/
│   │   └── helpers.ts         # Utility functions
│   └── server.ts              # Main server file
├── package.json
├── tsconfig.json
├── .env.example
└── .gitignore
```

## Installation & Setup

### 1. Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or Atlas)

### 2. Install Dependencies

```bash
cd backend
npm install
```

### 3. Environment Configuration

Create a `.env` file in the backend folder:

```bash
cp .env.example .env
```

Edit `.env` with your settings:

```env
# Server
NODE_ENV=development
PORT=5000
BASE_URL=http://localhost:5000

# Database - Local MongoDB
MONGODB_URI=mongodb://localhost:27017/wajdan-motors

# OR MongoDB Atlas (replace with your credentials)
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/wajdan-motors

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d

# CORS Configuration
FRONTEND_URL=http://localhost:5173

# Password Hashing
BCRYPT_ROUNDS=10

# Logging
LOG_LEVEL=debug
```

### 4. Start MongoDB

**Local MongoDB:**
```bash
mongod
```

**MongoDB Atlas:** Already configured in connection string

### 5. Run Development Server

```bash
npm run dev
```

Server will start at `http://localhost:5000`

## API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication Endpoints

#### Register
```http
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "full_name": "John Doe",
  "phone_number": "+1234567890"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "60d5ec49c1234567890abcde",
      "email": "user@example.com",
      "full_name": "John Doe",
      "role": "user"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

#### Get Current User
```http
GET /auth/me
Authorization: Bearer <token>
```

#### Logout
```http
POST /auth/logout
Authorization: Bearer <token>
```

### Cars Endpoints

#### Get All Cars
```http
GET /cars?status=available&search=Honda&skip=0&limit=20
```

**Query Parameters:**
- `status` (optional): 'available' or 'sold'
- `search` (optional): Search term
- `skip` (optional): Pagination skip, default 0
- `limit` (optional): Pagination limit, default 20

#### Get Car by ID
```http
GET /cars/:id
```

#### Create Car (Admin Only)
```http
POST /cars
Authorization: Bearer <admin-token>
Content-Type: application/json

{
  "name": "Honda Civic",
  "car_name": "Honda Civic",
  "make": "Honda",
  "body_type": "Sedan",
  "year": 2022,
  "price": 3500000,
  "mileage": 25000,
  "image": "https://example.com/image.jpg",
  "transmission": "Automatic",
  "fuel_type": "Petrol",
  "color": "Silver",
  "status": "available"
}
```

#### Update Car (Admin Only)
```http
PUT /cars/:id
Authorization: Bearer <admin-token>
Content-Type: application/json

{
  "price": 3400000,
  "status": "sold"
}
```

#### Delete Car (Admin Only)
```http
DELETE /cars/:id
Authorization: Bearer <admin-token>
```

#### Get Car Statistics
```http
GET /cars/stats
```

**Response:**
```json
{
  "success": true,
  "data": {
    "total": 25,
    "available": 18,
    "sold": 7,
    "avgPrice": 3250000
  }
}
```

### Inquiries Endpoints

#### Create Inquiry (Public)
```http
POST /inquiries
Content-Type: application/json

{
  "name": "Ahmed Ali",
  "email": "ahmed@example.com",
  "phone": "+92300123456",
  "car_name": "Honda Civic",
  "car_id": "60d5ec49c1234567890abcde",
  "message": "I am interested in this car. Can you provide more details?"
}
```

#### Get All Inquiries (Admin Only)
```http
GET /inquiries?status=new&skip=0&limit=20
Authorization: Bearer <admin-token>
```

#### Get Single Inquiry
```http
GET /inquiries/:id
Authorization: Bearer <admin-token>
```

#### Update Inquiry Status (Admin Only)
```http
PUT /inquiries/:id
Authorization: Bearer <admin-token>
Content-Type: application/json

{
  "status": "contacted"
}
```

#### Delete Inquiry (Admin Only)
```http
DELETE /inquiries/:id
Authorization: Bearer <admin-token>
```

#### Get Inquiry Statistics
```http
GET /inquiries/stats
Authorization: Bearer <admin-token>
```

### Orders Endpoints

#### Create Order
```http
POST /orders
Content-Type: application/json

{
  "customer_name": "Ahmed Ali",
  "customer_email": "ahmed@example.com",
  "customer_phone": "+92300123456",
  "car_id": "60d5ec49c1234567890abcde",
  "car_name": "Honda Civic",
  "total_amount": 3500000
}
```

#### Get All Orders (Admin Only)
```http
GET /orders?status=pending&skip=0&limit=20
Authorization: Bearer <admin-token>
```

#### Get Single Order
```http
GET /orders/:id
Authorization: Bearer <admin-token>
```

#### Update Order Status (Admin Only)
```http
PUT /orders/:id
Authorization: Bearer <admin-token>
Content-Type: application/json

{
  "status": "approved",
  "notes": "Customer approved for financing"
}
```

#### Delete Order (Admin Only)
```http
DELETE /orders/:id
Authorization: Bearer <admin-token>
```

#### Get Order Statistics
```http
GET /orders/stats
Authorization: Bearer <admin-token>
```

## Database Models

### User Model
```typescript
{
  email: string (unique)
  password: string (hashed)
  full_name: string
  phone_number?: string
  avatar_url?: string
  role: 'admin' | 'user'
  is_active: boolean
  created_at: Date
  updated_at: Date
}
```

### Car Model
```typescript
{
  name: string
  car_name: string
  make: string
  body_type: string
  year: number
  price: number
  mileage: number
  image: string
  images?: string[]
  status: 'available' | 'sold'
  engine?: string
  transmission?: string
  fuel_type?: string
  color?: string
  description?: string
  seating?: number
  features?: string[]
  created_at: Date
  updated_at: Date
}
```

### Inquiry Model
```typescript
{
  name: string
  email: string
  phone: string
  car_name: string
  car_id?: string
  message: string
  status: 'new' | 'contacted' | 'closed'
  created_at: Date
  updated_at: Date
}
```

### Order Model
```typescript
{
  customer_name: string
  customer_email: string
  customer_phone?: string
  car_id: ObjectId (references Car)
  car_name: string
  total_amount: number
  status: 'pending' | 'approved' | 'rejected' | 'completed'
  notes?: string
  created_at: Date
  updated_at: Date
}
```

## Scripts

```bash
# Development
npm run dev           # Start dev server with hot reload

# Build
npm run build         # Compile TypeScript to JavaScript

# Production
npm start            # Run compiled production build

# Code Quality
npm run lint         # Run ESLint
npm run format       # Format code with Prettier
```

## Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: Bcrypt with configurable salt rounds
- **CORS**: Configured for frontend domain
- **Helmet**: HTTP security headers
- **Input Validation**: Request validation with express-validator
- **Error Handling**: Prevents information leakage in errors
- **Environment Variables**: Sensitive data in .env file
- **MongoDB Injection Protection**: Mongoose ORM prevents injection

## Error Handling

All API responses follow a consistent format:

**Success Response:**
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "Error description",
  "errors": [ ... ]
}
```

## HTTP Status Codes

- `200` - Successful request
- `201` - Resource created
- `400` - Bad request / Validation error
- `401` - Unauthorized (missing/invalid token)
- `403` - Forbidden (insufficient permissions)
- `404` - Resource not found
- `500` - Server error

## Default Admin Account

The system is ready for you to create an admin account via the registration endpoint with a user role, then manually update the role in MongoDB to 'admin'.

**Example Admin User:**
- Email: `admin@wajdanmotors.com`
- Password: Create via registration endpoint
- Role: admin (update in MongoDB)

## MongoDB Setup

### Local MongoDB

1. Install MongoDB Community Edition
2. Start MongoDB service:
   ```bash
   mongod
   ```
3. MongoDB will be available at `mongodb://localhost:27017`

### MongoDB Atlas (Cloud)

1. Create account at https://www.mongodb.com/cloud/atlas
2. Create a cluster
3. Get connection string
4. Update `MONGODB_URI` in `.env`:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/wajdan-motors
   ```

## Deployment

### Prepare for Production

1. Update `.env` with production values
2. Build the project:
   ```bash
   npm run build
   ```
3. Start the server:
   ```bash
   npm start
   ```

### Deploy to Heroku

```bash
# Add Heroku app
heroku create wajdan-motors-api

# Set environment variables
heroku config:set NODE_ENV=production
heroku config:set JWT_SECRET=your_production_secret

# Deploy
git push heroku main
```

### Deploy to Railway

1. Connect GitHub repository
2. Add environment variables in Railway dashboard
3. Deploy - Railway will automatically run `npm start`

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT

## Support

For issues and questions, please contact: support@wajdanmotors.com

---

**Happy Coding!** 🚗
