import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';
import { logger } from './logger.js';

// Validation middleware factory
export function validateBody(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        logger.warn('Validation error:', {
          path: req.path,
          method: req.method,
          errors: error.errors,
          body: req.body,
        });

        return res.status(400).json({
          error: 'Validation failed',
          message: 'Invalid request data',
          details: error.errors.map(err => ({
            field: err.path.join('.'),
            message: err.message,
            code: err.code,
          })),
        });
      }

      logger.error('Unexpected validation error:', error);
      return res.status(500).json({
        error: 'Internal server error',
        message: 'Validation processing failed',
      });
    }
  };
}

// Query parameter validation
export function validateQuery(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      req.query = schema.parse(req.query);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          error: 'Invalid query parameters',
          details: error.errors,
        });
      }

      return res.status(500).json({
        error: 'Query validation failed',
      });
    }
  };
}

// Path parameter validation
export function validateParams(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      req.params = schema.parse(req.params);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          error: 'Invalid path parameters',
          details: error.errors,
        });
      }

      return res.status(500).json({
        error: 'Parameter validation failed',
      });
    }
  };
}

// Sanitization utilities
export function sanitizeString(str: string): string {
  return str
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .substring(0, 1000); // Limit length
}

export function sanitizeNumber(num: any): number | null {
  const parsed = parseInt(num, 10);
  return isNaN(parsed) ? null : parsed;
}

// File validation
export function validateFileUpload(allowedTypes: string[], maxSize: number) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.file && !req.files) {
      return next();
    }

    const files = req.files ? (Array.isArray(req.files) ? req.files : [req.file]) : [req.file];

    for (const file of files) {
      if (!file) continue;

      // Check file type
      if (!allowedTypes.includes(file.mimetype)) {
        return res.status(400).json({
          error: 'Invalid file type',
          message: `Allowed types: ${allowedTypes.join(', ')}`,
          received: file.mimetype,
        });
      }

      // Check file size
      if (file.size > maxSize) {
        return res.status(400).json({
          error: 'File too large',
          message: `Maximum size: ${maxSize / 1024 / 1024}MB`,
          received: `${Math.round(file.size / 1024 / 1024)}MB`,
        });
      }
    }

    next();
  };
}