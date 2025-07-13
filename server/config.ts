import { z } from 'zod';

// Environment configuration schema
const configSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().transform(Number).default('5000'),
  
  // Database
  DATABASE_URL: z.string().default(process.env.DATABASE_URL || 'postgresql://user:password@localhost:5432/db'),
  
  // JWT Secrets
  JWT_SECRET: z.string().min(32),
  JWT_REFRESH_SECRET: z.string().min(32),
  JWT_EXPIRES_IN: z.string().default('15m'),
  JWT_REFRESH_EXPIRES_IN: z.string().default('7d'),
  
  // Session
  SESSION_SECRET: z.string().min(32),
  
  // Redis (optional for development)
  REDIS_URL: z.string().optional(),
  
  // File Storage
  AWS_REGION: z.string().optional(),
  AWS_ACCESS_KEY_ID: z.string().optional(),
  AWS_SECRET_ACCESS_KEY: z.string().optional(),
  S3_BUCKET: z.string().optional(),
  
  // Email (optional)
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.string().transform(Number).optional(),
  SMTP_USER: z.string().optional(),
  SMTP_PASS: z.string().optional(),
  
  // Rate Limiting
  RATE_LIMIT_WINDOW_MS: z.string().transform(Number).default('900000'), // 15 minutes
  RATE_LIMIT_MAX_REQUESTS: z.string().transform(Number).default('100'),
  
  // Security
  BCRYPT_ROUNDS: z.string().transform(Number).default('12'),
  MAX_LOGIN_ATTEMPTS: z.string().transform(Number).default('5'),
  ACCOUNT_LOCK_TIME: z.string().transform(Number).default('1800000'), // 30 minutes
});

function validateConfig() {
  try {
    return configSchema.parse(process.env);
  } catch (error) {
    console.error('Invalid environment configuration:', error);
    process.exit(1);
  }
}

export const config = validateConfig();

// Database configuration
export const dbConfig = {
  connectionString: config.DATABASE_URL,
  ssl: config.NODE_ENV === 'production',
};

// JWT configuration
export const jwtConfig = {
  secret: config.JWT_SECRET,
  refreshSecret: config.JWT_REFRESH_SECRET,
  expiresIn: config.JWT_EXPIRES_IN,
  refreshExpiresIn: config.JWT_REFRESH_EXPIRES_IN,
};

// Rate limiting configuration
export const rateLimitConfig = {
  windowMs: config.RATE_LIMIT_WINDOW_MS,
  max: config.RATE_LIMIT_MAX_REQUESTS,
  message: {
    error: 'Too many requests',
    message: 'Rate limit exceeded. Please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
};

// Security configuration
export const securityConfig = {
  bcryptRounds: config.BCRYPT_ROUNDS,
  maxLoginAttempts: config.MAX_LOGIN_ATTEMPTS,
  accountLockTime: config.ACCOUNT_LOCK_TIME,
};