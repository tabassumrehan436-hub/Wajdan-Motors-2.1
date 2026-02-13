# API Testing Guide

This guide provides detailed instructions for testing all API endpoints. You can use Postman, Insomnia, or cURL.

## Quick Start

1. Start the backend server:
   ```bash
   npm run dev
   ```

2. Seed the database with sample data:
   ```bash
   npm run seed
   ```

3. Base URL: `http://localhost:5000/api`

## Test Accounts

After seeding the database, use these credentials:

### Admin Account
- **Email:** admin@wajdanmotors.com
- **Password:** Admin@123456

### Regular User Account
- **Email:** user@example.com
- **Password:** User@123456

---

## Authentication Endpoints

### 1. Register New User

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "newuser@example.com",
    "password": "Password123",
    "full_name": "New User",
    "phone_number": "+923001234567"
  }'
```

**Expected Response (201):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "60d5ec49c1234567890abcde",
      "email": "newuser@example.com",
      "full_name": "New User",
      "role": "user"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### 2. Login

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@wajdanmotors.com",
    "password": "Admin@123456"
  }'
```

**Expected Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "60d5ec49c1234567890abcde",
      "email": "admin@wajdanmotors.com",
      "full_name": "Admin User",
      "role": "admin",
      "avatar_url": null,
      "phone_number": "+923001234567"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### 3. Get Current User

```bash
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### 4. Logout

```bash
curl -X POST http://localhost:5000/api/auth/logout \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## Cars Endpoints

### 1. Get All Cars

**Without filters:**
```bash
curl -X GET "http://localhost:5000/api/cars"
```

**With filters:**
```bash
curl -X GET "http://localhost:5000/api/cars?status=available&search=Honda&skip=0&limit=10"
```

**Expected Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "60d5ec49c1234567890abcde",
      "name": "Honda Civic 2022",
      "car_name": "Honda Civic",
      "make": "Honda",
      "body_type": "Sedan",
      "year": 2022,
      "price": 3500000,
      "mileage": 25000,
      "image": "https://example.com/image.jpg",
      "status": "available",
      "transmission": "Automatic",
      "fuel_type": "Petrol",
      "color": "Silver",
      "seating": 5,
      "features": ["Air Conditioning", "Power Steering"],
      "created_at": "2024-01-15T10:30:00.000Z"
    }
  ],
  "pagination": {
    "total": 25,
    "skip": 0,
    "limit": 10,
    "pages": 3
  }
}
```

### 2. Get Car by ID

```bash
curl -X GET "http://localhost:5000/api/cars/60d5ec49c1234567890abcde"
```

### 3. Create Car (Admin Only)

```bash
curl -X POST http://localhost:5000/api/cars \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "BMW 3 Series",
    "car_name": "BMW 3 Series",
    "make": "BMW",
    "body_type": "Sedan",
    "year": 2023,
    "price": 8500000,
    "mileage": 5000,
    "image": "https://example.com/bmw.jpg",
    "transmission": "Automatic",
    "fuel_type": "Petrol",
    "color": "Blue",
    "seating": 5,
    "features": ["Sunroof", "Leather Seats", "Navigation System"],
    "status": "available"
  }'
```

### 4. Update Car (Admin Only)

```bash
curl -X PUT "http://localhost:5000/api/cars/60d5ec49c1234567890abcde" \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "price": 3400000,
    "status": "sold",
    "mileage": 28000
  }'
```

### 5. Delete Car (Admin Only)

```bash
curl -X DELETE "http://localhost:5000/api/cars/60d5ec49c1234567890abcde" \
  -H "Authorization: Bearer ADMIN_TOKEN"
```

### 6. Get Car Statistics

```bash
curl -X GET "http://localhost:5000/api/cars/stats"
```

**Expected Response (200):**
```json
{
  "success": true,
  "data": {
    "total": 20,
    "available": 15,
    "sold": 5,
    "avgPrice": 3750000
  }
}
```

---

## Inquiries Endpoints

### 1. Create Inquiry (Public)

```bash
curl -X POST http://localhost:5000/api/inquiries \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Ali Ahmed",
    "email": "ali@example.com",
    "phone": "+923009876543",
    "car_name": "Honda Civic 2022",
    "car_id": "60d5ec49c1234567890abcde",
    "message": "I am very interested in purchasing this car. Can you provide more information about the condition and history?"
  }'
```

**Expected Response (201):**
```json
{
  "success": true,
  "message": "Inquiry created successfully",
  "data": {
    "_id": "60d5ec49c1234567890abcdx",
    "name": "Ali Ahmed",
    "email": "ali@example.com",
    "phone": "+923009876543",
    "car_name": "Honda Civic 2022",
    "car_id": "60d5ec49c1234567890abcde",
    "message": "I am very interested in purchasing this car...",
    "status": "new",
    "created_at": "2024-01-15T10:35:00.000Z"
  }
}
```

### 2. Get All Inquiries (Admin Only)

```bash
curl -X GET "http://localhost:5000/api/inquiries?status=new&skip=0&limit=20" \
  -H "Authorization: Bearer ADMIN_TOKEN"
```

### 3. Get Single Inquiry (Admin Only)

```bash
curl -X GET "http://localhost:5000/api/inquiries/60d5ec49c1234567890abcdx" \
  -H "Authorization: Bearer ADMIN_TOKEN"
```

### 4. Update Inquiry Status (Admin Only)

```bash
curl -X PUT "http://localhost:5000/api/inquiries/60d5ec49c1234567890abcdx" \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "contacted"
  }'
```

**Status values:** `new` | `contacted` | `closed`

### 5. Delete Inquiry (Admin Only)

```bash
curl -X DELETE "http://localhost:5000/api/inquiries/60d5ec49c1234567890abcdx" \
  -H "Authorization: Bearer ADMIN_TOKEN"
```

### 6. Get Inquiry Statistics (Admin Only)

```bash
curl -X GET "http://localhost:5000/api/inquiries/stats" \
  -H "Authorization: Bearer ADMIN_TOKEN"
```

**Expected Response (200):**
```json
{
  "success": true,
  "data": {
    "total": 45,
    "new": 12,
    "contacted": 28,
    "closed": 5
  }
}
```

---

## Orders Endpoints

### 1. Create Order

```bash
curl -X POST http://localhost:5000/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "customer_name": "Muhammad Hassan",
    "customer_email": "hassan@example.com",
    "customer_phone": "+923001234567",
    "car_id": "60d5ec49c1234567890abcde",
    "car_name": "Honda Civic 2022",
    "total_amount": 3500000
  }'
```

### 2. Get All Orders (Admin Only)

```bash
curl -X GET "http://localhost:5000/api/orders?status=pending&skip=0&limit=20" \
  -H "Authorization: Bearer ADMIN_TOKEN"
```

### 3. Get Single Order

```bash
curl -X GET "http://localhost:5000/api/orders/60d5ec49c1234567890abcdy" \
  -H "Authorization: Bearer ADMIN_TOKEN"
```

### 4. Update Order Status (Admin Only)

```bash
curl -X PUT "http://localhost:5000/api/orders/60d5ec49c1234567890abcdy" \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "approved",
    "notes": "Customer approved for financing. Payment due in 7 days."
  }'
```

**Status values:** `pending` | `approved` | `rejected` | `completed`

### 5. Delete Order (Admin Only)

```bash
curl -X DELETE "http://localhost:5000/api/orders/60d5ec49c1234567890abcdy" \
  -H "Authorization: Bearer ADMIN_TOKEN"
```

### 6. Get Order Statistics (Admin Only)

```bash
curl -X GET "http://localhost:5000/api/orders/stats" \
  -H "Authorization: Bearer ADMIN_TOKEN"
```

**Expected Response (200):**
```json
{
  "success": true,
  "data": {
    "total": 30,
    "pending": 5,
    "approved": 15,
    "rejected": 3,
    "completed": 7,
    "totalRevenue": 105000000
  }
}
```

---

## Error Responses

### Validation Error (400)
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "email",
      "message": "Invalid email format"
    },
    {
      "field": "password",
      "message": "Password must be at least 6 characters"
    }
  ]
}
```

### Unauthorized (401)
```json
{
  "success": false,
  "message": "Invalid or expired token"
}
```

### Forbidden (403)
```json
{
  "success": false,
  "message": "Admin access required"
}
```

### Not Found (404)
```json
{
  "success": false,
  "message": "Car not found"
}
```

### Server Error (500)
```json
{
  "success": false,
  "message": "Internal server error"
}
```

---

## Postman Collection

If you prefer to use Postman:

1. Create a new collection called "Wajdan Motors API"
2. Set the base URL: `http://localhost:5000/api`
3. Create a variable for `token` (set after login)
4. Add requests for each endpoint above

**In Postman:**
- Use `{{token}}` in Authorization header after login response
- Set `Content-Type: application/json` for POST/PUT requests
- Use Query params tab for pagination and filters

---

## Common Testing Scenarios

### Scenario 1: New User Registration & Login
1. Register a new user
2. Copy the token from registration response
3. Test getting current user with that token
4. Login with credentials (should return new token)

### Scenario 2: Admin Car Management
1. Login as admin
2. Create a new car
3. Get the car by ID to verify
4. Update the car price
5. Get car statistics
6. Delete the car

### Scenario 3: Customer Inquiry & Order Flow
1. Create an inquiry (public)
2. As admin, get all inquiries
3. Update inquiry status to "contacted"
4. Create an order
5. As admin, update order status to "approved"
6. Get order statistics

### Scenario 4: Search & Pagination
1. Get all cars with pagination: `?skip=0&limit=5`
2. Search for specific car: `?search=Honda`
3. Filter by status: `?status=available`
4. Combine filters: `?status=available&search=Honda&skip=10&limit=15`

---

## Troubleshooting

### Issue: "Cannot find module"
**Solution:** Make sure all dependencies are installed:
```bash
npm install
```

### Issue: "MongoDB connection failed"
**Solution:** Ensure MongoDB is running:
```bash
# On Windows
mongod

# On Mac
brew services start mongodb-community
```

### Issue: "Invalid token"
**Solution:** Make sure you're using the token from the login/register response

### Issue: CORS errors
**Solution:** Make sure `FRONTEND_URL` in `.env` matches your frontend URL

---

## Tips

1. **Always copy the token** from login/register response for authenticated requests
2. **Check the status codes** to understand response types
3. **Validate IDs** before making requests (MongoDB IDs are 24 hex characters)
4. **Use pagination** for large datasets
5. **Test error scenarios** like invalid inputs or missing fields

---

Happy Testing! 🚀
