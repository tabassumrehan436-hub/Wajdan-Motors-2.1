# 🐛 Debug Guide

Comprehensive troubleshooting guide for the Wajdan Motors backend.

## 🔍 Diagnosis Steps

Before debugging, run these checks:

### 1. Check Node.js & npm
```bash
node --version      # Should be v16 or higher
npm --version       # Should be v8 or higher
```

### 2. Check MongoDB Connection
```bash
# For local MongoDB:
mongo              # or: mongosh
# Should connect without errors

# For MongoDB Atlas:
# Verify connection string in .env
# Test connection by running: npm run seed
```

### 3. Check Environment Variables
```bash
# Verify .env file exists in backend/ folder
cat .env

# Should have:
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://...
JWT_SECRET=your_secret
```

### 4. Check Dependencies
```bash
# Verify node_modules exists
ls node_modules

# If missing or broken, reinstall:
rm -rf node_modules package-lock.json
npm install
```

---

## ❌ Common Issues & Solutions

### Issue 1: "Cannot find module" errors

**Symptoms:**
```
Error: Cannot find module 'express'
Error: Cannot find module 'mongoose'
```

**Causes:**
- Dependencies not installed
- node_modules corrupted

**Solutions:**
```bash
# Option 1: Clean install
rm -rf node_modules package-lock.json
npm install

# Option 2: Install specific package
npm install express mongoose

# Option 3: Update all packages
npm update
```

---

### Issue 2: PORT already in use

**Symptoms:**
```
Error: listen EADDRINUSE: address already in use :::5000
```

**Causes:**
- Another process using port 5000
- Previous server didn't shut down cleanly

**Solutions:**
```bash
# Find what's using port 5000:
# Windows PowerShell:
Get-Process -Id (Get-NetTCPConnection -LocalPort 5000).OwningProcess

# Linux/Mac:
lsof -i :5000

# Kill the process (replace PID):
kill -9 PID

# Or use different port:
PORT=3001 npm run dev
```

---

### Issue 3: MongoDB Connection Failed

**Symptoms:**
```
Error: connect ECONNREFUSED 127.0.0.1:27017
Error: reason: connect ECONNREFUSED
MongooseError: Cannot connect to MongoDB
```

**Causes:**
- MongoDB not running
- Wrong connection string
- MongoDB server not accessible

**Solutions:**

**For Local MongoDB:**
```bash
# Check if MongoDB is running:
# Windows: mongod should be running
# Check Services: Search for "MongoDB" in Services app

# Start MongoDB:
# Windows: net start MongoDB
# Mac: brew services start mongodb-community
# Linux: sudo systemctl start mongod

# Check connection:
mongo  # or mongosh
```

**For MongoDB Atlas:**
```bash
# Verify connection string in .env:
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database-name

# Common issues:
# 1. Wrong username/password
# 2. Network access not allowed
#    - Go to MongoDB Atlas -> Network Access
#    - Add your current IP (or 0.0.0.0/0 for anywhere)
# 3. User not in correct database
#    - User should be in "admin" database
```

---

### Issue 4: JWT_SECRET not defined

**Symptoms:**
```
Error: JWT_SECRET is required
TypeError: Cannot read property 'sign' of undefined
```

**Causes:**
- JWT_SECRET not set in .env
- .env file not loaded

**Solutions:**
```bash
# Check .env file
cat .env

# Should contain:
JWT_SECRET=your_secret_key_here

# If missing, add it:
echo "JWT_SECRET=your_secret" >> .env

# Restart server after changes:
npm run dev
```

---

### Issue 5: TypeScript compilation errors

**Symptoms:**
```
error TS2307: Cannot find module
error TS2322: Type 'string' is not assignable to type
```

**Causes:**
- Missing type definitions
- Type mismatches
- TypeScript version issues

**Solutions:**
```bash
# Check TypeScript compilation:
npx tsc --noEmit

# Fix issues in console output
# Common fixes:
npm install --save-dev @types/node
npm install --save-dev @types/express

# Rebuild:
npm run build
```

---

### Issue 6: CORS errors in frontend

**Symptoms:**
```
Access to XMLHttpRequest at 'http://localhost:5000/api/cars'
from origin 'http://localhost:3000' has been blocked by CORS policy
```

**Causes:**
- CORS not configured
- Wrong frontend URL in .env

**Solutions:**
```bash
# Verify CORS in .env:
FRONTEND_URL=http://localhost:3000

# Re-start server:
npm run dev

# If error persists, check src/server.ts:
# Should have: cors({ origin: process.env.FRONTEND_URL })
```

---

### Issue 7: Database seeding fails

**Symptoms:**
```
npm run seed
Error: Connection refused
Error: Duplicate key error
```

**Causes:**
- MongoDB not running
- Collections not empty (duplicate keys)
- Seed script error

**Solutions:**
```bash
# Verify MongoDB is running
# Option 1: Clear database and reseed
mongo
> use wajdan-motors
> db.dropDatabase()
> exit()

npm run seed

# Option 2: Run seed without clearing
npm run seed

# Option 3: Check seed script
cat src/scripts/seed.ts
```

---

### Issue 8: .env file not being read

**Symptoms:**
```
Error: Cannot read property 'MONGODB_URI' of undefined
process.env.PORT is undefined
```

**Causes:**
- .env file in wrong location
- .env file not created
- dotenv not configured

**Solutions:**
```bash
# Verify .env location (should be in backend/ folder):
ls -la .env

# If not there, create it:
cp .env.example .env

# Edit with your values:
nano .env  # or use your editor

# Verify path in src/config/index.ts:
# Should be: path.join(__dirname, '../../.env')

# Restart server:
npm run dev
```

---

### Issue 9: Authentication token expired

**Symptoms:**
```
Error: Unauthorized
Error: Token expired
```

**Causes:**
- JWT token too old
- JWT_SECRET changed
- Token not included in request

**Solutions:**
```bash
# Get new token:
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@wajdanmotors.com","password":"admin123"}'

# Use new token in header:
curl http://localhost:5000/api/cars \
  -H "Authorization: Bearer NEW_TOKEN"
```

---

### Issue 10: "Admin only" endpoints returning 403

**Symptoms:**
```
Error: Forbidden - Admin access required
```

**Causes:**
- User doesn't have admin role
- Token not included
- Wrong token

**Solutions:**
```bash
# Login with admin account:
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@wajdanmotors.com",
    "password": "admin123"
  }'

# Use admin token:
curl http://localhost:5000/api/cars \
  -H "Authorization: Bearer ADMIN_TOKEN"
```

---

### Issue 11: Validation errors on requests

**Symptoms:**
```
Error: Validation failed
Invalid email format
Missing required fields
```

**Causes:**
- Missing required fields
- Invalid data format
- Wrong data type

**Solutions:**

**For Car Creation:**
```bash
# Required fields:
make, model, year, price, mileage, 
transmission, fuel_type, color, seating, status

# Example:
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

**For Inquiry Creation:**
```bash
# Required fields:
customer_name, email, phone, car_name, message

# Example:
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

---

### Issue 12: TypeScript types not importing

**Symptoms:**
```
Error: Cannot find name 'AuthRequest'
Error: Cannot find name 'Car'
```

**Causes:**
- Type definitions not exported
- Import path wrong

**Solutions:**
```bash
# Check type exports in models:
cat src/models/User.ts
# Should have: export interface UserDocument extends Document { ... }

# Use correct import:
import { UserDocument } from '../models/User.js'
```

---

## 🔧 Advanced Debugging

### Enable Debug Logs

```bash
# Set debug environment:
DEBUG=* npm run dev

# See all middleware, routes, etc.
```

### Check File Permissions

```bash
# Verify .env readable:
ls -la .env

# Make readable:
chmod 644 .env
```

### Verify TypeScript Compilation

```bash
# Compile and check for errors:
npx tsc --noEmit

# See all issues:
npx tsc --noEmit --pretty
```

### Test Individual Routes

```bash
# Health check (no auth needed):
curl http://localhost:5000/api/health

# Get all cars (public):
curl http://localhost:5000/api/cars

# With admin token:
curl http://localhost:5000/api/cars/stats \
  -H "Authorization: Bearer ADMIN_TOKEN"
```

---

## 📋 Debugging Checklist

- [ ] Node.js version correct (v16+)
- [ ] npm dependencies installed
- [ ] MongoDB running/accessible
- [ ] .env file exists with all variables
- [ ] PORT not in use
- [ ] JWT_SECRET set
- [ ] FRONTEND_URL correct
- [ ] MONGODB_URI correct
- [ ] No TypeScript errors
- [ ] Database connection working
- [ ] Seed script successful
- [ ] Server starts without errors
- [ ] Can call public endpoints
- [ ] Can login and get token
- [ ] Can call protected endpoints with token

---

## 🆘 Still Having Issues?

1. **Check Error Messages**
   - Read full error in console
   - Search error message in `TROUBLESHOOTING.md`

2. **Review Logs**
   - Check server console output
   - Look for stack traces

3. **Verify Configuration**
   - Check .env with `cat .env`
   - Ensure all required variables set

4. **Test Each Component**
   - Test MongoDB connection
   - Test JWT generation
   - Test individual endpoints

5. **Review Documentation**
   - `README.md` - Full documentation
   - `QUICKSTART.md` - Setup walkthrough
   - `API_TESTING.md` - Endpoint examples

6. **Clean Start**
   ```bash
   # If nothing works, try clean install:
   rm -rf node_modules package-lock.json
   npm install
   npm run seed
   npm run dev
   ```

---

## 💡 Pro Tips

- Always check console output first
- Verify .env before debugging
- Use `curl` to test APIs directly
- Check MongoDB data with MongoDB Compass GUI
- Use VS Code debugger for step-by-step debugging
- Keep logs for troubleshooting later

---

**Last Updated**: Verification Complete ✅
**Status**: Ready to debug 🔍
