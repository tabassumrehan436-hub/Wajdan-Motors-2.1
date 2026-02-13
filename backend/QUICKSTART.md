# Quick Start Guide

## 🚀 Get Started in 5 Minutes

### Step 1: Install Dependencies

```bash
cd backend
npm install
```

### Step 2: Configure Environment

Copy the example environment file:
```bash
# .env file is already created with defaults
cat .env
```

Setup MongoDB (choose one):

**Option A: Local MongoDB**
```bash
# Install MongoDB from https://www.mongodb.com/try/download/community
# Then start:
mongod
```

**Option B: MongoDB Atlas (Cloud)**
1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free account
3. Create a cluster
4. Get connection string
5. Update `.env`:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/wajdan-motors
   ```

### Step 3: Start Backend Server

```bash
npm run dev
```

You should see:
```
✓ MongoDB connected: mongodb://localhost:27017/wajdan-motors
✗ Server listening on port 5000
```

### Step 4: Seed Database (Optional)

In a new terminal:
```bash
npm run seed
```

This will create:
- ✅ Admin account: admin@wajdanmotors.com / Admin@123456
- ✅ Regular user: user@example.com / User@123456
- ✅ 4 sample cars
- ✅ 2 sample inquiries
- ✅ 2 sample orders

### Step 5: Test API

```bash
curl -X GET http://localhost:5000/api/cars
```

## 📚 Documentation

| Document | Purpose |
|----------|---------|
| [README.md](./README.md) | Complete backend documentation |
| [API_TESTING.md](./API_TESTING.md) | Detailed API testing guide |
| [FRONTEND_INTEGRATION.md](./FRONTEND_INTEGRATION.md) | How to integrate with frontend |

## 🔐 Default Credentials

After seeding database:

### Admin Account
- **Email:** admin@wajdanmotors.com
- **Password:** Admin@123456
- **Role:** admin

### Regular User
- **Email:** user@example.com
- **Password:** User@123456
- **Role:** user

## 📍 API Endpoints

### Base URL
```
http://localhost:5000/api
```

### Main Endpoints
- **Auth:** `/auth/login`, `/auth/register`, `/auth/me`, `/auth/logout`
- **Cars:** `/cars` (GET, POST, PUT, DELETE)
- **Inquiries:** `/inquiries` (GET, POST, PUT, DELETE)
- **Orders:** `/orders` (GET, POST, PUT, DELETE)
- **Health Check:** `/health`

## 🧪 Quick Test

### 1. Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@wajdanmotors.com",
    "password": "Admin@123456"
  }'
```

Copy the `token` from response.

### 2. Get Cars
```bash
curl -X GET http://localhost:5000/api/cars
```

### 3. Get with Token
```bash
curl -X GET http://localhost:5000/api/cars/stats \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## 📁 Project Structure

```
backend/
├── src/
│   ├── config/          # Configuration & DB connection
│   ├── controllers/     # Business logic
│   ├── models/         # Database schemas
│   ├── middleware/     # Auth, validation, error handling
│   ├── routes/         # API endpoints
│   ├── utils/          # Helper functions
│   └── server.ts       # Main server file
├── package.json        # Dependencies
├── .env               # Environment variables
├── tsconfig.json      # TypeScript config
└── README.md          # Full documentation
```

## 🛠️ Available Scripts

```bash
npm run dev        # Start development server with hot reload
npm run build      # Compile TypeScript to JavaScript
npm start          # Run production build
npm run seed       # Seed database with sample data
npm run lint       # Run ESLint
npm run format     # Format code with Prettier
```

## 🔗 Connect with Frontend

1. Install axios in frontend:
   ```bash
   npm install axios
   ```

2. Create API client in frontend:
   ```typescript
   // src/services/api.ts (see FRONTEND_INTEGRATION.md)
   import axios from 'axios';
   
   export default axios.create({
     baseURL: 'http://localhost:5000/api'
   });
   ```

3. Use in components:
   ```typescript
   import apiClient from '../services/api';
   
   const cars = await apiClient.get('/cars');
   ```

See [FRONTEND_INTEGRATION.md](./FRONTEND_INTEGRATION.md) for complete guide.

## ⚡ Common Issues

### Issue: MongoDB Connection Failed
**Solution:** Make sure MongoDB is running
```bash
mongod  # Local
# OR update MONGODB_URI in .env to use MongoDB Atlas
```

### Issue: Port 5000 Already in Use
**Solution:** Change PORT in `.env`
```env
PORT=5001
```

### Issue: Module Not Found
**Solution:** Install dependencies
```bash
npm install
```

### Issue: CORS Error
**Solution:** Update `.env` with correct frontend URL
```env
FRONTEND_URL=http://localhost:5173
```

## 📦 Technology Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB + Mongoose
- **Language:** TypeScript
- **Authentication:** JWT
- **Security:** bcrypt, Helmet, CORS
- **Validation:** express-validator

## 🚢 Deployment Checklist

Before deploying:

- [ ] Update `.env` with production values
- [ ] Set `NODE_ENV=production`
- [ ] Change `JWT_SECRET` to strong random value
- [ ] Update `FRONTEND_URL` to production URL
- [ ] Use MongoDB Atlas connection string
- [ ] Run `npm run build`
- [ ] Test all endpoints

Popular hosting options:
- **Heroku** (easy, free tier available)
- **Railway**
- **Render**
- **Fly.io**
- **AWS** (EC2, Lambda)
- **Google Cloud**

## 📞 Support

For issues:
1. Check [API_TESTING.md](./API_TESTING.md) for endpoint examples
2. Review error messages in server logs
3. Check browser console for client errors
4. Verify `.env` configuration

## ✅ Next Steps

1. ✅ Install dependencies
2. ✅ Configure `.env`
3. ✅ Start MongoDB
4. ✅ Run `npm run dev`
5. ✅ Seed database: `npm run seed`
6. ✅ Test endpoints
7. ✅ Integrate with frontend
8. ✅ Deploy!

---

**🎉 Backend ready! Start building!**

For complete documentation, see [README.md](./README.md)
