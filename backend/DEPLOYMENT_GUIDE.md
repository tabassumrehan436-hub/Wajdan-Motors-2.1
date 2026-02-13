# 🚀 Deployment Guide

Complete guide for deploying Wajdan Motors backend to production.

---

## 📋 Pre-Deployment Checklist

Before deploying, ensure:

- [ ] All tests passing
- [ ] No console errors
- [ ] .env configured for production
- [ ] MongoDB Atlas set up
- [ ] Domain acquired
- [ ] SSL certificate ready
- [ ] Backup strategy defined
- [ ] Monitoring configured

---

## 🌐 Hosting Options

### Option 1: Heroku (Easiest)

**Pros:**
- Very easy deployment
- Automatic SSL
- Built-in monitoring
- Free tier available

**Cons:**
- Can be pricey
- Limited resources on free tier

**Steps:**

1. **Install Heroku CLI**
   ```bash
   # Windows
   choco install heroku-cli
   
   # Mac
   brew tap heroku/brew && brew install heroku
   
   # Linux
   curl https://cli-assets.heroku.com/install-ubuntu.sh | sh
   ```

2. **Login to Heroku**
   ```bash
   heroku login
   ```

3. **Create Heroku app**
   ```bash
   heroku create wajdan-motors-api
   ```

4. **Add MongoDB**
   ```bash
   heroku addons:create mongolab:sandbox
   ```

5. **Configure environment variables**
   ```bash
   heroku config:set NODE_ENV=production
   heroku config:set JWT_SECRET=your_strong_secret_here
   heroku config:set FRONTEND_URL=https://your-frontend-domain.com
   ```

6. **Deploy**
   ```bash
   git push heroku main
   ```

7. **Verify**
   ```bash
   heroku logs --tail
   heroku open
   ```

---

### Option 2: AWS (Most Flexible)

#### Using Elastic Beanstalk

**Pros:**
- Highly scalable
- Many customization options
- Good for high traffic

**Cons:**
- More complex setup
- More expensive

**Steps:**

1. **Install AWS CLI**
   ```bash
   # Download from aws.amazon.com/cli
   # Or: pip install awscli
   ```

2. **Configure AWS credentials**
   ```bash
   aws configure
   ```

3. **Install EB CLI**
   ```bash
   pip install awsebcli
   ```

4. **Initialize Elastic Beanstalk**
   ```bash
   eb init
   # Select Node.js as platform
   # Select region (e.g., us-east-1)
   ```

5. **Create environment**
   ```bash
   eb create wajdan-motors-prod
   ```

6. **Set environment variables**
   ```bash
   eb setenv NODE_ENV=production
   eb setenv JWT_SECRET=your_strong_secret_here
   eb setenv MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/db
   eb setenv FRONTEND_URL=https://your-frontend-domain.com
   ```

7. **Deploy**
   ```bash
   eb deploy
   ```

8. **Monitor**
   ```bash
   eb health
   ```

---

### Option 3: DigitalOcean (Great Balance)

**Pros:**
- Good price/performance
- Easy to use
- Great documentation

**Cons:**
- More setup than Heroku
- Manual scaling

**Steps:**

1. **Create DigitalOcean account**
   - Go to digitalocean.com
   - Create account

2. **Create App Platform app**
   - Dashboard → Apps → Create App
   - Connect GitHub repo
   - Select "backend" as source directory
   - Select Node.js as build command

3. **Add MongoDB**
   - Create MongoDB cluster on MongoDB Atlas
   - Copy connection string

4. **Set environment variables**
   - In DigitalOcean console:
   ```
   NODE_ENV=production
   PORT=8080
   MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/db
   JWT_SECRET=your_strong_secret
   FRONTEND_URL=https://yourdomain.com
   ```

5. **Deploy**
   - Push to GitHub
   - DigitalOcean automatically deploys

---

### Option 4: Railway (Modern & Simple)

**Pros:**
- Very modern and easy
- Great developer experience
- Good pricing

**Cons:**
- Newer platform
- Smaller community

**Steps:**

1. **Go to railway.app**
2. **Click "Start a New Project"**
3. **Deploy from GitHub**
4. **Select backend repository**
5. **Add MongoDB**
   - Add Database → MongoDB
6. **Configure environment**
   - Auto-detect from .env
   - Set production values
7. **Deploy**
   - Automatic on push

---

## 🗄️ MongoDB Atlas Setup

1. **Create Account**
   - Go to mongodb.com/cloud/atlas
   - Sign up

2. **Create Cluster**
   - New Project → Create Project
   - Build Database → Create Cluster
   - Select free tier if starting
   - Choose region closest to your users

3. **Create Database User**
   - Security → Database Access → Add New DB User
   - Create user with strong password
   - Copy connection string

4. **Configure Network Access**
   - Security → Network Access → Add IP Address
   - Add current IP
   - Or allow from anywhere (0.0.0.0/0)

5. **Get Connection String**
   - Clusters → Connect
   - Copy "Connect your application" string
   - Format: `mongodb+srv://username:password@cluster.mongodb.net/database`

6. **Use in .env**
   ```bash
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/wajdan-motors
   ```

---

## 🔐 Production Environment Configuration

### Environment Variables (Checklist)

```bash
# Server
NODE_ENV=production          # Must be 'production'
PORT=8080                    # Or your app's port

# Database
MONGODB_URI=mongodb+srv://...  # Full connection string

# Authentication
JWT_SECRET=your_very_strong_random_secret_here  # Change this!

# Frontend
FRONTEND_URL=https://yourdomain.com  # Your React app URL

# Optional
ADMIN_EMAIL=admin@yourdomain.com
LOG_LEVEL=info
```

### Security Checklist

- [ ] JWT_SECRET is strong (32+ random characters)
- [ ] JWT_SECRET is different from development
- [ ] MONGODB_URI is production connection string
- [ ] FRONTEND_URL is your production domain
- [ ] NODE_ENV is set to 'production'
- [ ] CORS origins updated to production domain
- [ ] SSL/HTTPS enabled
- [ ] No console logging in production
- [ ] Error details not exposed to client
- [ ] Rate limiting enabled
- [ ] Input validation enabled

---

## 🐳 Docker Deployment

Deploy using Docker for consistency.

### Create Dockerfile

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

RUN npm run build

EXPOSE 5000

CMD ["npm", "start"]
```

### Create .dockerignore

```
node_modules
npm-debug.log
.env
.git
.gitignore
README.md
dist
```

### Build and Run

```bash
# Build image
docker build -t wajdan-motors-api:1.0 .

# Run container
docker run -p 5000:5000 \
  -e MONGODB_URI=mongodb+srv://... \
  -e JWT_SECRET=your_secret \
  -e NODE_ENV=production \
  wajdan-motors-api:1.0

# Push to Docker Hub
docker login
docker tag wajdan-motors-api:1.0 yourusername/wajdan-motors-api:1.0
docker push yourusername/wajdan-motors-api:1.0
```

---

## 📊 Performance Optimization

### 1. Enable Compression

Already configured in `src/server.ts`:
```typescript
app.use(compression());
```

### 2. Enable Caching

```typescript
// Add to src/server.ts
app.use((req, res, next) => {
  res.set('Cache-Control', 'public, max-age=300');
  next();
});
```

### 3. Database Indexing

Already configured in models:
- Email field indexed for fast lookups
- Car status indexed for filtering
- MongoDB full-text search enabled

### 4. Pagination

Already implemented:
- Default: 10 items per page
- Maximum: 50 items per page

---

## 📞 Monitoring & Logging

### New Relic (Recommended)

```bash
# Install
npm install newrelic

# Create newrelic.js
```

Add to top of `src/server.ts`:
```typescript
require('newrelic');
```

### PM2 Process Manager

Perfect for managing Node.js in production:

```bash
# Install globally
npm install -g pm2

# Start app
pm2 start dist/index.js --name "wajdan-api"

# Monitor
pm2 monit

# Setup auto-restart
pm2 startup
pm2 save
```

### Sentry Error Tracking

```bash
npm install @sentry/node
```

Add to `src/server.ts`:
```typescript
import * as Sentry from "@sentry/node";

Sentry.init({ 
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV
});
```

---

## 🔄 CI/CD Pipeline

### GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v2
    
    - name: Use Node.js
      uses: actions/setup-node@v2
      with:
        node-version: '18'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Run tests
      run: npm test
    
    - name: Build
      run: npm run build
    
    - name: Deploy to Heroku
      uses: akhileshns/heroku-deploy@v3.12.12
      with:
        heroku_api_key: ${{ secrets.HEROKU_API_KEY }}
        heroku_app_name: "wajdan-motors-api"
        heroku_email: ${{ secrets.HEROKU_EMAIL }}
```

---

## 🔍 Post-Deployment Testing

```bash
# Test API endpoints
curl https://your-domain.com/api/health

# Test authentication
curl -X POST https://your-domain.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@wajdanmotors.com","password":"admin123"}'

# Test public endpoints
curl https://your-domain.com/api/cars

# Test protected endpoints
curl https://your-domain.com/api/cars/stats \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## 🆘 Troubleshooting Deployment

### Port Issues
```bash
# If port 5000 not available:
PORT=3000 npm start
```

### Memory Issues
```bash
# Increase Node memory:
NODE_OPTIONS=--max-old-space-size=4096 npm start
```

### Database Connection
```bash
# Verify MongoDB Atlas:
# 1. Check connection string
# 2. Verify IP in Network Access
# 3. Verify username/password
# 4. Test locally first
```

### Heroku Specific
```bash
# View logs
heroku logs --tail

# Restart app
heroku restart

# Clear build cache
heroku builds:cache:purge

# View config
heroku config
```

### AWS Elastic Beanstalk
```bash
# View logs
eb logs

# SSH into instance
eb ssh

# View environment variables
eb printenv

# Restart app
eb restart
```

---

## 📈 Scaling Strategies

### Horizontal Scaling (Multiple Instances)

Most platforms handle automatically:
- Heroku: Upgrade dyno type or add more dynos
- AWS EB: Configure auto-scaling rules
- DigitalOcean: Upgrade instance size
- Railway: Scale up containers

### Vertical Scaling (Bigger Instance)

If single instance needs more resources:
- Increase RAM
- Increase CPU cores
- Increase storage

### Database Scaling

- MongoDB Atlas: Upgrade cluster tier
- Enable compression
- Optimize queries/indexes
- Archive old data

---

## 💰 Cost Estimates

| Platform | Price | Best For |
|----------|-------|----------|
| Heroku | $7-50+/month | Quick start |
| AWS EB | $10-100+/month | Enterprise |
| DigitalOcean | $5-30+/month | Balanced |
| Railway | $5-50+/month | Modern apps |

*Prices vary based on resources and traffic*

---

## ✅ Deployment Checklist

- [ ] Code pushed to GitHub
- [ ] All tests passing
- [ ] .env configured for production
- [ ] MongoDB Atlas set up
- [ ] SSL certificate configured
- [ ] Domain pointing to server
- [ ] Environment variables set
- [ ] CORS configured for production domain
- [ ] Rate limiting enabled
- [ ] Error logging configured
- [ ] Monitoring set up
- [ ] Backups configured
- [ ] Load testing completed
- [ ] Performance optimized
- [ ] Security audit passed
- [ ] Documentation updated
- [ ] Team notified
- [ ] Rollback plan ready

---

## 🚀 Deployment Step-by-Step

### General Process

1. **Prepare**
   ```bash
   npm run build
   npm test
   ```

2. **Configure**
   - Set production environment variables
   - Update database connection
   - Update CORS origins

3. **Deploy**
   - Push to your chosen platform
   - Monitor for errors
   - Verify endpoints work

4. **Monitor**
   - Check logs
   - Monitor performance
   - Track errors

5. **Maintain**
   - Regular backups
   - Security updates
   - Performance monitoring

---

## 📞 Getting Help

- **Heroku**: heroku.com/docs
- **AWS**: docs.aws.amazon.com
- **DigitalOcean**: docs.digitalocean.com
- **Railway**: docs.railway.app
- **MongoDB Atlas**: docs.atlas.mongodb.com

---

**Status**: ✅ Ready for Production
**Last Updated**: Deployment Guide Complete
