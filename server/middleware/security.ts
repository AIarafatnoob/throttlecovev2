import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import slowDown from 'express-slow-down';
import { Request, Response, NextFunction } from 'express';
import { rateLimitConfig, config } from '../config.js';
import { logger, securityLogger } from '../utils/logger.js';

// Security headers middleware
export const securityHeaders = helmet({
  contentSecurityPolicy: false, // Disable CSP for development to allow Vite HMR
  hsts: config.NODE_ENV === 'production' ? {
    maxAge: 31536000, // 1 year
    includeSubDomains: true,
    preload: true,
  } : false,
  crossOriginEmbedderPolicy: false,
  crossOriginResourcePolicy: { policy: "cross-origin" },
});

// Rate limiting for API endpoints
export const apiRateLimit = rateLimit({
  windowMs: rateLimitConfig.windowMs,
  max: rateLimitConfig.max,
  message: rateLimitConfig.message,
  standardHeaders: rateLimitConfig.standardHeaders,
  legacyHeaders: rateLimitConfig.legacyHeaders,
  handler: (req: Request, res: Response) => {
    securityLogger.warn('Rate limit exceeded', {
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      path: req.path,
      method: req.method,
    });

    res.status(429).json(rateLimitConfig.message);
  },
});

// Strict rate limiting for authentication endpoints
export const authRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts per window
  skipSuccessfulRequests: true,
  message: {
    error: 'Too many authentication attempts',
    message: 'Please try again later',
  },
  handler: (req: Request, res: Response) => {
    securityLogger.warn('Auth rate limit exceeded', {
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      path: req.path,
    });

    res.status(429).json({
      error: 'Too many authentication attempts',
      message: 'Please try again later',
    });
  },
});

// Progressive delay for repeated requests
export const speedLimiter = slowDown({
  windowMs: 15 * 60 * 1000, // 15 minutes
  delayAfter: 5, // Allow 5 requests per window without delay
  delayMs: () => 500, // Add 500ms delay per request after delayAfter
  maxDelayMs: 20000, // Maximum delay of 20 seconds
  validate: { delayMs: false }, // Disable the warning
});

// Request size limiting
export const requestSizeLimit = (maxSize: number) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const contentLength = parseInt(req.get('Content-Length') || '0', 10);
    
    if (contentLength > maxSize) {
      securityLogger.warn('Request size limit exceeded', {
        ip: req.ip,
        contentLength,
        maxSize,
        path: req.path,
      });

      return res.status(413).json({
        error: 'Payload too large',
        message: `Maximum request size: ${maxSize / 1024 / 1024}MB`,
      });
    }

    next();
  };
};

// IP whitelist/blacklist middleware
export const ipFilter = (whitelist?: string[], blacklist?: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const clientIp = req.ip;

    // Check blacklist first
    if (blacklist && blacklist.includes(clientIp)) {
      securityLogger.warn('Blocked IP attempt', {
        ip: clientIp,
        path: req.path,
        userAgent: req.get('User-Agent'),
      });

      return res.status(403).json({
        error: 'Access denied',
        message: 'Your IP address is blocked',
      });
    }

    // Check whitelist if provided
    if (whitelist && whitelist.length > 0 && !whitelist.includes(clientIp)) {
      securityLogger.warn('Non-whitelisted IP attempt', {
        ip: clientIp,
        path: req.path,
      });

      return res.status(403).json({
        error: 'Access denied',
        message: 'Your IP address is not whitelisted',
      });
    }

    next();
  };
};

// Security event logging middleware
export const securityEventLogger = (req: Request, res: Response, next: NextFunction) => {
  // Log security-sensitive endpoints
  const securityEndpoints = ['/auth/', '/admin/', '/api/users/'];
  const isSecurityEndpoint = securityEndpoints.some(endpoint => 
    req.path.startsWith(endpoint)
  );

  if (isSecurityEndpoint) {
    securityLogger.info('Security endpoint accessed', {
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      path: req.path,
      method: req.method,
      timestamp: new Date().toISOString(),
    });
  }

  next();
};

// CORS configuration for production
export const corsOptions = {
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    // In development, allow all origins
    if (config.NODE_ENV === 'development') {
      return callback(null, true);
    }

    // In production, check against allowed origins
    const allowedOrigins = [
      'https://throttlecove.com',
      'https://www.throttlecove.com',
      'https://app.throttlecove.com',
    ];

    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      securityLogger.warn('CORS violation', { origin, ip: 'unknown' });
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
};

// Request timeout middleware
export const requestTimeout = (timeout: number = 30000) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const timer = setTimeout(() => {
      if (!res.headersSent) {
        logger.warn('Request timeout', {
          path: req.path,
          method: req.method,
          ip: req.ip,
          timeout,
        });

        res.status(408).json({
          error: 'Request timeout',
          message: 'Request took too long to process',
        });
      }
    }, timeout);

    res.on('finish', () => {
      clearTimeout(timer);
    });

    next();
  };
};