import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../../.env') });

export const config = {
  // Server
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '5000', 10),
  baseUrl: process.env.BASE_URL || 'http://localhost:5000',

  // Database
  mongodbUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/wajdan-motors',

  // JWT
  jwtSecret: process.env.JWT_SECRET || 'your_super_secret_jwt_key_change_this_in_production',
  jwtExpire: process.env.JWT_EXPIRE || '7d',

  // CORS
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',

  // Validation
  bcryptRounds: parseInt(process.env.BCRYPT_ROUNDS || '10', 10),

  // Logging
  logLevel: process.env.LOG_LEVEL || 'debug',

  // Features
  isProduction: process.env.NODE_ENV === 'production',
  isDevelopment: process.env.NODE_ENV === 'development',
};

// Validate required environment variables
const requiredEnvVars = ['JWT_SECRET'];
const missingEnvVars = requiredEnvVars.filter((envVar) => !process.env[envVar]);

if (missingEnvVars.length > 0 && config.isProduction) {
  throw new Error(`Missing required environment variables: ${missingEnvVars.join(', ')}`);
}

export default config;
