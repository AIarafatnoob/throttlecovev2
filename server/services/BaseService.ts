import { Database } from '../database.js';
import { logger } from '../utils/logger.js';
import { v4 as uuidv4 } from 'uuid';

// Base service class with common functionality
export abstract class BaseService {
  protected db: Database;

  constructor(db: Database) {
    this.db = db;
  }

  // Transaction wrapper
  protected async withTransaction<T>(
    callback: (tx: Database) => Promise<T>
  ): Promise<T> {
    return await this.db.transaction(async (tx) => {
      try {
        return await callback(tx);
      } catch (error) {
        logger.error('Transaction failed:', error);
        throw error;
      }
    });
  }

  // Error handling wrapper
  protected async handleErrors<T>(
    operation: string,
    callback: () => Promise<T>
  ): Promise<T> {
    try {
      return await callback();
    } catch (error) {
      logger.error(`${operation} failed:`, error);
      throw error;
    }
  }

  // Generate unique ID
  protected generateId(): string {
    return uuidv4();
  }

  // Pagination helper
  protected calculatePagination(page: number = 1, limit: number = 10) {
    const offset = (page - 1) * limit;
    return { offset, limit: Math.min(limit, 100) }; // Max 100 items per page
  }

  // Validate ownership
  protected async validateOwnership(
    resourceUserId: number,
    requestUserId: number,
    resourceType: string
  ): Promise<void> {
    if (resourceUserId !== requestUserId) {
      logger.warn('Ownership validation failed', {
        resourceType,
        resourceUserId,
        requestUserId,
      });
      throw new Error(`Access denied: You don't own this ${resourceType}`);
    }
  }

  // Format response with metadata
  protected formatResponse<T>(
    data: T,
    pagination?: { page: number; limit: number; total: number }
  ) {
    const response: any = {
      data,
      timestamp: new Date().toISOString(),
    };

    if (pagination) {
      response.pagination = {
        ...pagination,
        totalPages: Math.ceil(pagination.total / pagination.limit),
      };
    }

    return response;
  }
}