# Troubleshooting Guide

## Common Issues & Solutions

### Installation & Setup

#### Issue: `npm install` fails
**Symptoms:** Error messages about missing packages or network

**Solutions:**
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and lock file
rm -rf node_modules package-lock.json

# Reinstall
npm install
```

#### Issue: Node version incompatible
**Symptoms:** 
```
error engines: unsupported or invalid engine
```

**Solution:** Update Node.js to v16 or higher
```bash
# Check version
node --version

# Update via nvm
nvm install 18
nvm use 18
```

#### Issue: Module not found
**Symptoms:**
```
Cannot find module 'express'
```

**Solution:**
```bash
# Reinstall dependencies
npm install

# Or install specific package
npm install express
```

---

### MongoDB Connection

#### Issue: MongoDB connection refused
**Symptoms:**
```
MongooseError: Cannot connect to mongodb://localhost:27017
```

**Solutions:**

**For Local MongoDB:**
```bash
# Windows (PowerShell)
mongod

# Mac (Homebrew)
brew services start mongodb-community

# Linux (systemd)
sudo systemctl start mongod

# Check if running
mongo --version
```

**For MongoDB Atlas:**
1. Update `.env`:
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/wajdan-motors
   ```
2. Allow your IP in MongoDB Atlas security settings
3. Use the correct credentials

#### Issue: MONGODB_URI not set
**Symptoms:**
```
Error: Missing required environment variables: MONGODB_URI
```

**Solution:** Create `.env` file in backend folder:
```bash
cp .env.example .env
```

Then edit `.env` with correct MongoDB URI.

#### Issue: Connection timeout
**Symptoms:**
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```

**Solution:**
```bash
# Make sure MongoDB is running
mongod

# Check MongoDB is listening
netstat -an | grep 27017  # or
ss -an | grep 27017

# Try Atlas instead
# Update .env to use MongoDB Atlas URI
```

---

### Server Issues

#### Issue: Port already in use
**Symptoms:**
```
Error: listen EADDRINUSE :::5000
Port 5000 is already in use
```

**Solutions:**
```bash
# Option 1: Change port in .env
PORT=5001

# Option 2: Kill process using port
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:5000 | xargs kill -9
```

#### Issue: Server won't start
**Symptoms:**
```
npm run dev
> tsx watch src/server.ts
[error] 123 | console.log(`Server listening...
```

**Solutions:**
```bash
# Clear build files
rm -rf dist

# Rebuild TypeScript
npm run build

# Check for TypeScript errors
npx tsc --noEmit

# Check for runtime errors by running with more verbose output
NODE_DEBUG=* npm run dev 2>&1 | head -50
```

#### Issue: Hot reload not working
**Symptoms:** Changes don't reload automatically

**Solution:**
```bash
# Kill any running processes
killall node

# Clear tsx cache
rm -rf .tsx-cache

# Restart
npm run dev
```

---

### API Issues

#### Issue: CORS Error
**Symptoms:**
```
Access to XMLHttpRequest blocked by CORS policy
```

**Solutions:**
1. Check backend `.env` has correct FRONTEND_URL:
   ```env
   FRONTEND_URL=http://localhost:5173
   ```

2. Restart backend:
   ```bash
   npm run dev
   ```

3. Clear browser cache and reload

4. Check frontend is calling correct API URL:
   ```typescript
   const API_URL = 'http://localhost:5000/api';
   ```

#### Issue: 401 Unauthorized
**Symptoms:**
```json
{ "success": false, "message": "Invalid or expired token" }
```

**Solutions:**
1. Login again to get new token
2. Verify token is included in Authorization header:
   ```bash
   Authorization: Bearer YOUR_TOKEN_HERE
   ```
3. Check JWT_SECRET in backend `.env` hasn't changed
4. Verify token format (should be JWT)

#### Issue: 403 Forbidden
**Symptoms:**
```json
{ "success": false, "message": "Admin access required" }
```

**Solutions:**
1. Use admin account to login
2. Admin credentials after seeding:
   - Email: `admin@wajdanmotors.com`
   - Password: `Admin@123456`
3. If changed, reseed database:
   ```bash
   npm run seed
   ```

#### Issue: 404 Not Found
**Symptoms:**
```json
{ "success": false, "message": "Route not found" }
```

**Solutions:**
1. Check endpoint path is correct
2. Verify base URL: `http://localhost:5000/api`
3. Match case-sensitive routes:
   - `/cars` (correct)
   - `/Cars` (wrong)

#### Issue: Validation errors
**Symptoms:**
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [...]
}
```

**Solutions:**
1. Check request body has all required fields
2. Verify field types and format
3. See `API_TESTING.md` for valid request formats
4. Example for creating car:
   ```json
   {
     "name": "Honda Civic",
     "car_name": "Honda Civic",
     "make": "Honda",
     "year": 2022,
     "price": 3500000,
     "mileage": 25000,
     "image": "https://example.com/image.jpg"
   }
   ```

---

### Database Issues

#### Issue: Database empty after restart
**Symptoms:** All data disappeared

**Solution:** The database persists unless you clear it. If MongoDB isn't running:
```bash
mongod  # Start MongoDB
npm run seed  # Reseed if needed
```

#### Issue: Seed script fails
**Symptoms:**
```
Error seeding database: MongooseError: Cannot connect
```

**Solutions:**
```bash
# Make sure MongoDB is running
mongod

# Try manual database reset and seed
npm run seed

# If still fails, delete database and recreate
# Using MongoDB CLI
mongo
use wajdan-motors
db.dropDatabase()
exit

# Then seed
npm run seed
```

#### Issue: Duplicate key error
**Symptoms:**
```
E11000 duplicate key error
```

**Solution:** Clear database and reseed:
```bash
# In MongoDB CLI
mongo
use wajdan-motors
db.dropDatabase()
exit

# Reseed
npm run seed
```

---

### Code Issues

#### Issue: TypeScript compilation errors
**Symptoms:**
```
error TS2307: Cannot find module
```

**Solutions:**
```bash
# Check TypeScript is installed
npm install typescript --save-dev

# Check tsconfig.json
cat tsconfig.json

# Compile to check errors
npx tsc --noEmit

# Build
npm run build
```

#### Issue: ESLint errors
**Symptoms:**
```
✗ ESLint found problems
```

**Solutions:**
```bash
# Install ESLint
npm install eslint --save-dev

# Fix issues automatically
npm run format

# Check errors
npm run lint
```

#### Issue: Module resolution issues
**Symptoms:**
```
ModuleNotFoundError: No module named 'X'
```

**Solution:**
```bash
# Check import paths are correct (use relative paths)
import { authController } from '../controllers/authController.js'  // ✓
import { authController } from './controllers/authController.js'   // ✗

# Check file extension matches ES modules
// src/routes/index.ts
import authRoutes from './authRoutes.js'  // ✓ .js extension

# Install missing package
npm install package-name
```

---

### Environment Issues

#### Issue: Environment variables not loaded
**Symptoms:**
```
process.env.JWT_SECRET is undefined
```

**Solutions:**
1. Create `.env` file in backend root:
   ```bash
   cp .env.example .env
   ```

2. Verify .env location:
   ```
   backend/
   ├── .env           ← Should be here
   ├── src/
   ├── package.json
   ```

3. Restart server after changing .env:
   ```bash
   npm run dev
   ```

4. Check .env has key=value format:
   ```env
   JWT_SECRET=your_secret_key  # ✓
   JWT_SECRET = your_secret_key  # ✗ spaces around =
   ```

#### Issue: Secret key changed
**Symptoms:**
```
All tokens suddenly invalid
```

**Solution:**
1. Don't change JWT_SECRET unless necessary
2. If changed, all users must login again
3. In development, you can reseed:
   ```bash
   npm run seed
   ```

---

### Deployment Issues

#### Issue: Heroku deployment fails
**Symptoms:**
```
error node_modules/express: not found
```

**Solutions:**
```bash
# Make sure package.json is in root
# Make sure Procfile exists:
echo "web: npm start" > Procfile

# Push again
git push heroku main

# Check logs
heroku logs --tail
```

#### Issue: MongoDB not connecting on deployed server
**Symptoms:**
```
MongooseError: Cannot connect
```

**Solution:**
1. Check MongoDB URI in Heroku config:
   ```bash
   heroku config
   ```

2. Update if missing:
   ```bash
   heroku config:set MONGODB_URI="mongodb+srv://..."
   ```

3. Check IP allowlist in MongoDB Atlas

#### Issue: Env variables not set on server
**Solution:**
```bash
# For Heroku
heroku config:set JWT_SECRET="your_secret"
heroku config:set JWT_EXPIRE="7d"
heroku config:set FRONTEND_URL="https://yoursite.com"

# Verify
heroku config

# Restart
heroku restart
```

---

### Testing Issues

#### Issue: Postman/Insomnia requests fail
**Symptoms:** 404 or connection refused

**Solutions:**
1. Verify backend is running:
   ```bash
   npm run dev
   ```

2. Check base URL: `http://localhost:5000/api`

3. Use correct HTTP method (GET, POST, etc.)

4. Include Authorization header for protected routes:
   ```
   Authorization: Bearer TOKEN_HERE
   ```

5. Set Content-Type for POST/PUT:
   ```
   Content-Type: application/json
   ```

#### Issue: Request body not sent
**Symptoms:**
```
{ "success": false, "message": "Validation failed" }
```

**Solutions:**
- In Postman: Select "Body" → "raw" → "JSON"
- Make sure Content-Type is "application/json"
- Verify all required fields are present

---

### Performance Issues

#### Issue: API responses slow
**Solutions:**
```bash
# Check MongoDB indexes
# They should be created automatically by models

# Check server logs
npm run dev 2>&1 | grep "slow"

# Add pagination to reduce data
/cars?skip=0&limit=20  # ✓ Better
/cars                  # ✗ Load all

# Monitor resources
# Mac/Linux
top

# Windows
tasklist /v
```

#### Issue: High memory usage
**Solutions:**
```bash
# Restart server
npm run dev

# Clear old connections
# In MongoDB Atlas, check active connections

# Limit results with pagination
```

---

### Debug Tips

#### Enable debug logging
```bash
# Detailed logs
DEBUG=* npm run dev

# MongoDB logs
DEBUG=mongoose:* npm run dev

# Express logs
DEBUG=express:* npm run dev
```

#### Check what's running
```bash
# Windows (PowerShell)
Get-Process node
netstat -ano | findstr 5000

# Mac/Linux
ps aux | grep node
lsof -i :5000
```

#### Test endpoints manually
```bash
# Simple GET
curl http://localhost:5000/api/cars

# With headers
curl -H "Authorization: Bearer TOKEN" http://localhost:5000/api/cars/stats

# POST with data
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@wajdanmotors.com","password":"Admin@123456"}'
```

---

## Quick Checklist

When troubleshooting, verify:

- [ ] Node.js version 16+ installed
- [ ] MongoDB running (local or Atlas)
- [ ] `.env` file exists and configured
- [ ] `npm install` completed successfully
- [ ] No port conflicts (5000 free)
- [ ] Backend started with `npm run dev`
- [ ] Frontend CORS URL matches backend config
- [ ] Token included in Protected route requests
- [ ] Request format matches API spec

---

## Getting Help

1. **Check logs:**
   ```bash
   npm run dev 2>&1 | tail -20
   ```

2. **Review documentation:**
   - `README.md` - API reference
   - `API_TESTING.md` - Request examples
   - `FRONTEND_INTEGRATION.md` - Integration help

3. **Test with curl:**
   ```bash
   curl -v http://localhost:5000/api/health
   ```

4. **Check database:**
   ```bash
   # MongoDB CLI
   mongo
   use wajdan-motors
   db.cars.find()
   db.users.find()
   ```

---

**Still stuck?** Check the specific error message in `npm run dev` output - it usually points to the exact issue!
