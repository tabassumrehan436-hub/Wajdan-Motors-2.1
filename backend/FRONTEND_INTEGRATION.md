# Frontend-Backend Integration Guide

This guide explains how to connect your React frontend with the Wajdan Motors backend API.

## Overview

The backend API is available at `http://localhost:5000/api` during development.

## Setting Up Frontend API Client

### 1. Create API Service

Create `src/services/api.ts`:

```typescript
import axios, { AxiosInstance, AxiosError } from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('adminToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle errors
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('adminToken');
      window.location.href = '/admin/login';
    }
    return Promise.reject(error);
  }
);

export default apiClient;
```

### 2. Update .env

Add to your `src/.env`:

```
VITE_API_URL=http://localhost:5000/api
```

### 3. Update Auth Context

Update `src/contexts/AdminAuthContext.tsx`:

```typescript
import apiClient from '../services/api';

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  // ... existing code ...

  const adminLogin = useCallback(
    async (email: string, password: string) => {
      setError(null);
      setLoading(true);
      try {
        const response = await apiClient.post('/auth/login', { email, password });
        
        if (response.data.success) {
          const { user, token } = response.data.data;
          localStorage.setItem('adminToken', token);
          setAdminUser(user);
          setLoading(false);
          return { success: true };
        }
        throw new Error(response.data.message);
      } catch (err: any) {
        const errorMsg = err.response?.data?.message || err.message || 'Login failed';
        setError(errorMsg);
        setLoading(false);
        return { success: false, error: errorMsg };
      }
    },
    []
  );

  const adminLogout = useCallback(async () => {
    try {
      await apiClient.post('/auth/logout');
      localStorage.removeItem('adminToken');
      setAdminUser(null);
    } catch (err) {
      console.error('Logout error:', err);
    }
  }, []);

  // ... rest of the code ...
}
```

## API Integration Examples

### Authentication

#### Login
```typescript
import apiClient from '../services/api';

const response = await apiClient.post('/auth/login', {
  email: 'admin@wajdanmotors.com',
  password: 'password',
});

const { user, token } = response.data.data;
localStorage.setItem('adminToken', token);
```

#### Register
```typescript
const response = await apiClient.post('/auth/register', {
  email: 'user@example.com',
  password: 'password',
  full_name: 'User Name',
  phone_number: '+92300123456',
});
```

#### Get Current User
```typescript
const response = await apiClient.get('/auth/me');
const user = response.data.data;
```

### Cars Management

#### Get All Cars
```typescript
// Simple
const response = await apiClient.get('/cars');

// With pagination and filters
const response = await apiClient.get('/cars', {
  params: {
    status: 'available',
    search: 'Honda',
    skip: 0,
    limit: 20,
  },
});

const { data, pagination } = response.data;
```

#### Get Single Car
```typescript
const response = await apiClient.get(`/cars/${carId}`);
const car = response.data.data;
```

#### Create Car (Admin)
```typescript
const response = await apiClient.post('/cars', {
  name: 'Honda Civic',
  car_name: 'Honda Civic',
  make: 'Honda',
  body_type: 'Sedan',
  year: 2022,
  price: 3500000,
  mileage: 25000,
  image: 'https://example.com/image.jpg',
  transmission: 'Automatic',
  fuel_type: 'Petrol',
  color: 'Silver',
  status: 'available',
});

const newCar = response.data.data;
```

#### Update Car (Admin)
```typescript
const response = await apiClient.put(`/cars/${carId}`, {
  price: 3400000,
  status: 'sold',
});

const updatedCar = response.data.data;
```

#### Delete Car (Admin)
```typescript
await apiClient.delete(`/cars/${carId}`);
```

#### Get Car Stats
```typescript
const response = await apiClient.get('/cars/stats');
const { total, available, sold, avgPrice } = response.data.data;
```

### Inquiries Management

#### Create Inquiry (Public)
```typescript
const response = await apiClient.post('/inquiries', {
  name: 'Ahmed Ali',
  email: 'ahmed@example.com',
  phone: '+92300123456',
  car_name: 'Honda Civic',
  car_id: 'carId',
  message: 'I am interested in this car...',
});

const inquiry = response.data.data;
```

#### Get All Inquiries (Admin)
```typescript
const response = await apiClient.get('/inquiries', {
  params: {
    status: 'new',
    skip: 0,
    limit: 20,
  },
});

const { data, pagination } = response.data;
```

#### Update Inquiry Status (Admin)
```typescript
const response = await apiClient.put(`/inquiries/${inquiryId}`, {
  status: 'contacted',
});

const updatedInquiry = response.data.data;
```

#### Delete Inquiry (Admin)
```typescript
await apiClient.delete(`/inquiries/${inquiryId}`);
```

#### Get Inquiry Stats (Admin)
```typescript
const response = await apiClient.get('/inquiries/stats');
const { total, new: newCount, contacted, closed } = response.data.data;
```

### Orders Management

#### Create Order
```typescript
const response = await apiClient.post('/orders', {
  customer_name: 'Muhammad Hassan',
  customer_email: 'hassan@example.com',
  customer_phone: '+92300123456',
  car_id: 'carId',
  car_name: 'Honda Civic',
  total_amount: 3500000,
});

const order = response.data.data;
```

#### Get All Orders (Admin)
```typescript
const response = await apiClient.get('/orders', {
  params: {
    status: 'pending',
    skip: 0,
    limit: 20,
  },
});

const { data, pagination } = response.data;
```

#### Update Order Status (Admin)
```typescript
const response = await apiClient.put(`/orders/${orderId}`, {
  status: 'approved',
  notes: 'Customer approved for financing',
});

const updatedOrder = response.data.data;
```

#### Delete Order (Admin)
```typescript
await apiClient.delete(`/orders/${orderId}`);
```

#### Get Order Stats (Admin)
```typescript
const response = await apiClient.get('/orders/stats');
const { total, pending, approved, rejected, completed, totalRevenue } = response.data.data;
```

## Update Existing Hooks

### useBackendCars Hook

Update `src/hooks/useBackendCars.ts` to call backend:

```typescript
import apiClient from '../services/api';

export function useBackendCars(): UseBackendCarsReturn {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCars = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get('/cars');
        setCars(response.data.data);
        setError(null);
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Failed to load cars';
        setError(errorMsg);
      } finally {
        setLoading(false);
      }
    };

    fetchCars();
  }, []);

  const addCar = useCallback(
    async (data: Omit<Car, 'id' | 'created_at' | 'updated_at'>) => {
      try {
        const response = await apiClient.post('/cars', data);
        setCars(prev => [...prev, response.data.data]);
        return { success: true };
      } catch (err: any) {
        return { 
          success: false, 
          error: err.response?.data?.message || 'Failed to add car' 
        };
      }
    },
    []
  );

  const updateCar = useCallback(
    async (id: string | number, data: Partial<Omit<Car, 'id' | 'created_at' | 'updated_at'>>) => {
      try {
        const response = await apiClient.put(`/cars/${id}`, data);
        setCars(prev => prev.map(c => c.id === id ? response.data.data : c));
        return { success: true };
      } catch (err: any) {
        return { 
          success: false, 
          error: err.response?.data?.message || 'Failed to update car' 
        };
      }
    },
    []
  );

  const deleteCar = useCallback(
    async (id: string | number) => {
      try {
        await apiClient.delete(`/cars/${id}`);
        setCars(prev => prev.filter(c => c.id !== id));
        return { success: true };
      } catch (err: any) {
        return { 
          success: false, 
          error: err.response?.data?.message || 'Failed to delete car' 
        };
      }
    },
    []
  );

  return { cars, loading, error, addCar, updateCar, deleteCar };
}
```

### useBackendInquiries Hook

Similar updates for inquiries...

### useBackendOrders Hook

Similar updates for orders...

## Error Handling

Create a custom hook for error handling:

```typescript
// src/hooks/useApiError.ts
import { useCallback } from 'react';
import { useToast } from '@/components/ui/use-toast';

export function useApiError() {
  const { toast } = useToast();

  const handleError = useCallback((error: any) => {
    const message = error.response?.data?.message || error.message || 'An error occurred';
    toast({
      title: 'Error',
      description: message,
      variant: 'destructive',
    });
  }, [toast]);

  return { handleError };
}
```

## CORS Configuration

Make sure your backend `.env` has the correct frontend URL:

```env
FRONTEND_URL=http://localhost:5173
```

## Development vs Production

### Development
```typescript
const API_URL = 'http://localhost:5000/api';
```

### Production
```typescript
const API_URL = 'https://api.wajdanmotors.com/api';
```

Update your `.env` file:

```env
# .env.development
VITE_API_URL=http://localhost:5000/api

# .env.production
VITE_API_URL=https://api.wajdanmotors.com/api
```

## Running Frontend & Backend Together

### Terminal 1: Backend
```bash
cd backend
npm install
npm run dev
```

### Terminal 2: Frontend
```bash
cd Wajdan\ Motors
npm install
npm run dev
```

Both servers will run on:
- Frontend: `http://localhost:5173`
- Backend: `http://localhost:5000`

## Security Notes

1. **Never commit `.env` files** with real credentials
2. **Store tokens safely** in httpOnly cookies for production
3. **Validate input** on both frontend and backend
4. **Use HTTPS** in production
5. **Implement rate limiting** for API endpoints
6. **Use environment-specific** API URLs

## Testing API Integration

Install REST client in VS Code:

1. Install "REST Client" extension
2. Create `requests.http` file:

```http
@baseUrl = http://localhost:5000/api
@token = 

### Login
POST {{baseUrl}}/auth/login
Content-Type: application/json

{
  "email": "admin@wajdanmotors.com",
  "password": "Admin@123456"
}

### Get Cars
GET {{baseUrl}}/cars
Authorization: Bearer {{token}}

### Create Car
POST {{baseUrl}}/cars
Authorization: Bearer {{token}}
Content-Type: application/json

{
  "name": "New Car",
  "car_name": "New Car",
  ...
}
```

3. Click "Send Request" to test

## Troubleshooting

### CORS Error
- Check `FRONTEND_URL` in backend `.env`
- Ensure backend is running
- Clear browser cache

### 401 Unauthorized
- Token expired, login again
- Token not sent in header
- Token malformed

### API URL Not Found
- Check `VITE_API_URL` in frontend `.env`
- Verify backend is running on correct port
- Check API endpoint path

## Next Steps

1. ✅ Install dependencies: `npm install`
2. ✅ Configure `.env` files
3. ✅ Start backend: `npm run dev`
4. ✅ Seed database: `npm run seed`
5. ✅ Update frontend hooks
6. ✅ Test endpoints
7. ✅ Deploy!

---

For more details, see:
- Backend README: `backend/README.md`
- API Testing Guide: `backend/API_TESTING.md`
