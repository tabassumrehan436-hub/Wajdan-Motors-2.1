#!/bin/bash
# Backend Verification & Testing Script

echo "📋 Wajdan Motors Backend - Verification Report"
echo "=================================================="
echo ""

# Check Node.js
echo "✓ Checking Node.js version..."
node --version
echo ""

# Check if dependencies are installed
if [ -d "node_modules" ]; then
  echo "✓ Dependencies installed (node_modules found)"
else
  echo "⚠ Dependencies not installed - run: npm install"
fi
echo ""

# Check critical files
echo "✓ Checking critical files..."
files=(
  "src/server.ts"
  "src/config/index.ts"
  "src/config/database.ts"
  "src/controllers/authController.ts"
  "src/controllers/carsController.ts"
  "src/controllers/inquiriesController.ts"
  "src/controllers/ordersController.ts"
  "src/models/User.ts"
  "src/models/Car.ts"
  "src/models/Inquiry.ts"
  "src/models/Order.ts"
  "src/middleware/auth.ts"
  "src/middleware/error.ts"
  "src/middleware/validation.ts"
  "src/routes/index.ts"
  "src/routes/authRoutes.ts"
  "src/routes/carRoutes.ts"
  "src/routes/inquiryRoutes.ts"
  "src/routes/orderRoutes.ts"
  "src/scripts/seed.ts"
  "src/utils/helpers.ts"
  ".env"
  ".env.example"
  "package.json"
  "tsconfig.json"
)

missing=0
for file in "${files[@]}"; do
  if [ -f "$file" ]; then
    echo "  ✓ $file"
  else
    echo "  ✗ MISSING: $file"
    ((missing++))
  fi
done

echo ""
if [ $missing -eq 0 ]; then
  echo "✅ All files present!"
else
  echo "⚠️  $missing files missing"
fi

echo ""
echo "=================================================="
echo "🚀 To start the server:"
echo "   npm install    # If not done yet"
echo "   npm run dev    # Start development server"
echo ""
echo "📊 To seed database with sample data:"
echo "   npm run seed"
echo ""
echo "🧪 To test an endpoint:"
echo "   curl http://localhost:5000/api/cars"
echo ""
