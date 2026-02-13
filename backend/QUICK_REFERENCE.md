# 🚀 Quick Reference Guide

Fast lookup guide for the Wajdan Motors Backend API.

## 🗂️ Folder Structure

```
backend/
├── src/
│   ├── config/           # Configuration (database, env)
│   ├── controllers/       # Business logic
│   ├── middleware/        # Auth, validation, error handling
│   ├── models/           # Database schemas
│   ├── routes/           # API endpoints
│   ├── scripts/          # Database seeding
│   └── utils/            # Helper functions
├── .env                  # Configuration (local, not committed)
├── .env.example          # Template (committed)
├── package.json          # Dependencies & scripts
├── tsconfig.json         # TypeScript config
└── dist/                 # Compiled JavaScript (after build)
```

## ⚡ npm Scripts

```bash
npm run dev      # Start development server with hot reload
npm run build    # Compile TypeScript to JavaScript
npm run start    # Run production build
npm run seed     # Populate database with sample data
npm run lint     # Check code quality
npm run format   # Auto-fix code formatting
```

## 🔗 API Base URLs

| Environment | URL |
|-------------|-----|
| Development | `http://localhost:5000` |
| Production | `https://your-domain.com` |

## 🔑 Authentication

### Login & Get Token

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@wajdanmotors.com",
    "password": "admin123"
  }'
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "user_id",
    "email": "admin@wajdanmotors.com",
    "role": "admin"
  }
}
```

### Use Token in Requests

```bash
curl -X GET http://localhost:5000/api/cars \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## 🚗 Cars Endpoints

### Get All Cars (Public)
```bash
curl "http://localhost:5000/api/cars?page=1&limit=10&search=sedan"
```

### Get Car by ID
```bash
curl http://localhost:5000/api/cars/CAR_ID
```

### Create Car (Admin Only)
```bash
curl -X POST http://localhost:5000/api/cars \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "make": "Toyota",
    "model": "Camry",
    "year": 2023,
    "price": 35000,
    "mileage": 5000,
    "transmission": "automatic",
    "fuel_type": "petrol",
    "color": "white",
    "seating": 5,
    "status": "available"
  }'
```

### Update Car (Admin Only)
```bash
curl -X PUT http://localhost:5000/api/cars/CAR_ID \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{ "price": 33000 }'
```

### Delete Car (Admin Only)
```bash
curl -X DELETE http://localhost:5000/api/cars/CAR_ID \
  -H "Authorization: Bearer TOKEN"
```

### Get Car Statistics (Admin)
```bash
curl http://localhost:5000/api/cars/stats \
  -H "Authorization: Bearer TOKEN"
```

## 🔍 Inquiries Endpoints

### Get All Inquiries (Admin Only)
```bash
curl "http://localhost:5000/api/inquiries?page=1&limit=10" \
  -H "Authorization: Bearer TOKEN"
```

### Get Inquiry by ID (Admin)
```bash
curl http://localhost:5000/api/inquiries/INQUIRY_ID \
  -H "Authorization: Bearer TOKEN"
```

### Create Inquiry (Public)
```bash
curl -X POST http://localhost:5000/api/inquiries \
  -H "Content-Type: application/json" \
  -d '{
    "customer_name": "Ahmed",
    "email": "ahmed@example.com",
    "phone": "+966501234567",
    "car_name": "Toyota Camry",
    "message": "Interested in this car"
  }'
```

### Update Inquiry Status (Admin)
```bash
curl -X PUT http://localhost:5000/api/inquiries/INQUIRY_ID \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{ "status": "contacted" }'
```

### Delete Inquiry (Admin)
```bash
curl -X DELETE http://localhost:5000/api/inquiries/INQUIRY_ID \
  -H "Authorization: Bearer TOKEN"
```

## 📦 Orders Endpoints

### Get All Orders (Admin)
```bash
curl "http://localhost:5000/api/orders?page=1&limit=10" \
  -H "Authorization: Bearer TOKEN"
```

### Get Order by ID
```bash
curl http://localhost:5000/api/orders/ORDER_ID \
  -H "Authorization: Bearer TOKEN"
```

### Create Order
```bash
curl -X POST http://localhost:5000/api/orders \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "car_id": "CAR_ID",
    "customer_name": "Ahmed",
    "email": "ahmed@example.com",
    "phone": "+966501234567"
  }'
```

### Update Order Status (Admin)
```bash
curl -X PUT http://localhost:5000/api/orders/ORDER_ID \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{ "status": "approved" }'
```

### Get Order Statistics (Admin)
```bash
curl http://localhost:5000/api/orders/stats \
  -H "Authorization: Bearer TOKEN"
```

## 👤 Auth Endpoints

### Register
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "newuser@example.com",
    "password": "securePassword123"
  }'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "newuser@example.com",
    "password": "securePassword123"
  }'
```

### Get Current User (Protected)
```bash
curl http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer TOKEN"
```

### Logout (Protected)
```bash
curl -X POST http://localhost:5000/api/auth/logout \
  -H "Authorization: Bearer TOKEN"
```

## 📊 Response Format

### Success Response
```json
{
  "success": true,
  "data": { /* response data */ }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description",
  "data": null
}
```

## 🔐 Access Control

| Endpoint | Public | User | Admin |
|----------|--------|------|-------|
| GET /cars | ✅ | ✅ | ✅ |
| POST /cars | ❌ | ❌ | ✅ |
| PUT /cars/:id | ❌ | ❌ | ✅ |
| DELETE /cars/:id | ❌ | ❌ | ✅ |
| POST /inquiries | ✅ | ✅ | ✅ |
| GET /inquiries | ❌ | ❌ | ✅ |
| POST /orders | ✅ | ✅ | ✅ |
| GET /orders | ❌ | ❌ | ✅ |
| POST /auth/register | ✅ | ✅ | ✅ |
| POST /auth/login | ✅ | ✅ | ✅ |
| GET /auth/me | ❌ | ✅ | ✅ |

## 🗄️ MongoDB Collections

| Collection | Purpose | Sample Doc Count |
|-----------|---------|------------------|
| users | User accounts & auth | 2 (admin + user) |
| cars | Vehicle inventory | 4 sample cars |
| inquiries | Customer inquiries | 2 sample inquiries |
| orders | Car orders/bookings | 2 sample orders |

## 🌍 Environment Variables

```bash
# Server
NODE_ENV=development
PORT=5000

# Database
MONGODB_URI=mongodb://localhost:27017/wajdan-motors

# Auth
JWT_SECRET=your_jwt_secret_key_here

# Frontend
FRONTEND_URL=http://localhost:3000

# Admin Email (for init)
ADMIN_EMAIL=admin@wajdanmotors.com
```

## 🛠️ Common Tasks

### Start Fresh
```bash
npm run seed          # Reset and seed database
npm run dev           # Start server
```

### Check Code Quality
```bash
npm run lint          # Check for issues
npm run format        # Auto-fix formatting
```

### Test an Endpoint
```bash
curl -X GET http://localhost:5000/api/cars
```

### Debug
1. Check `.env` configuration
2. Verify MongoDB is running
3. Check console output for errors
4. Review `TROUBLESHOOTING.md`

## 📱 Common Status Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 500 | Server Error |

## 🔗 Important Links

- **Full API Docs**: See `README.md`
- **Testing Guide**: See `API_TESTING.md`
- **Setup Help**: See `QUICKSTART.md`
- **React Integration**: See `FRONTEND_INTEGRATION.md`
- **Issues**: See `TROUBLESHOOTING.md`

## 📝 Sample Credentials

After running `npm run seed`:

**Admin Account:**
- Email: `admin@wajdanmotors.com`
- Password: `admin123`
- Role: Admin

**Regular User:**
- Email: `user@example.com`
- Password: `user123`
- Role: User

## 🚀 Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Start dev server
npm run dev

# 3. In another terminal, seed database
npm run seed

# 4. Test the API
curl http://localhost:5000/api/cars

# 5. Login to get token
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@wajdanmotors.com","password":"admin123"}'

# 6. Use token for protected endpoints
curl http://localhost:5000/api/cars \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

**Last Updated**: Verification Complete ✅
**Status**: Production Ready 🚀
