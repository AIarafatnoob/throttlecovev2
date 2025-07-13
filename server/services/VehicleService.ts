import { eq, and, desc, sql } from 'drizzle-orm';
import { BaseService } from './BaseService.js';
import { motorcycles } from '../../shared/schema.js';
import type { Motorcycle, InsertMotorcycle } from '../../shared/schema.js';
import { logger } from '../utils/logger.js';

export class VehicleService extends BaseService {
  // Get all motorcycles for a user
  async getUserMotorcycles(
    userId: number,
    page: number = 1,
    limit: number = 10
  ): Promise<{ motorcycles: Motorcycle[]; total: number }> {
    return this.handleErrors('Get user motorcycles', async () => {
      const { offset, limit: actualLimit } = this.calculatePagination(page, limit);

      // Get motorcycles with pagination
      const userMotorcycles = await this.db
        .select()
        .from(motorcycles)
        .where(eq(motorcycles.userId, userId))
        .orderBy(desc(motorcycles.createdAt))
        .limit(actualLimit)
        .offset(offset);

      // Get total count
      const totalResult = await this.db
        .select({ count: sql<number>`count(*)` })
        .from(motorcycles)
        .where(eq(motorcycles.userId, userId));

      const total = totalResult[0]?.count || 0;

      return {
        motorcycles: userMotorcycles,
        total,
      };
    });
  }

  // Get motorcycle by ID
  async getMotorcycleById(motorcycleId: number, userId: number): Promise<Motorcycle> {
    return this.handleErrors('Get motorcycle by ID', async () => {
      const motorcycle = await this.db
        .select()
        .from(motorcycles)
        .where(
          and(
            eq(motorcycles.id, motorcycleId),
            eq(motorcycles.userId, userId)
          )
        )
        .limit(1);

      if (!motorcycle.length) {
        throw new Error('Motorcycle not found or access denied');
      }

      return motorcycle[0];
    });
  }

  // Create a new motorcycle
  async createMotorcycle(userId: number, motorcycleData: InsertMotorcycle): Promise<Motorcycle> {
    return this.handleErrors('Create motorcycle', async () => {
      // Check user's motorcycle limit (max 10 for basic users)
      const existingCount = await this.getUserMotorcycleCount(userId);
      if (existingCount >= 10) {
        throw new Error('Maximum motorcycle limit reached (10 motorcycles)');
      }

      // Validate VIN uniqueness if provided
      if (motorcycleData.vin) {
        const existingVin = await this.db
          .select()
          .from(motorcycles)
          .where(eq(motorcycles.vin, motorcycleData.vin))
          .limit(1);

        if (existingVin.length > 0) {
          throw new Error('VIN already exists in the system');
        }
      }

      // Create motorcycle
      const newMotorcycle = await this.db
        .insert(motorcycles)
        .values({
          ...motorcycleData,
          userId,
        })
        .returning();

      if (!newMotorcycle.length) {
        throw new Error('Failed to create motorcycle');
      }

      logger.info('Motorcycle created', {
        userId,
        motorcycleId: newMotorcycle[0].id,
        make: motorcycleData.make,
        model: motorcycleData.model,
      });

      return newMotorcycle[0];
    });
  }

  // Update motorcycle
  async updateMotorcycle(
    motorcycleId: number,
    userId: number,
    updateData: Partial<InsertMotorcycle>
  ): Promise<Motorcycle> {
    return this.handleErrors('Update motorcycle', async () => {
      // Verify ownership
      await this.getMotorcycleById(motorcycleId, userId);

      // Validate VIN uniqueness if being updated
      if (updateData.vin) {
        const existingVin = await this.db
          .select()
          .from(motorcycles)
          .where(
            and(
              eq(motorcycles.vin, updateData.vin),
              // Exclude current motorcycle
              sql`${motorcycles.id} != ${motorcycleId}`
            )
          )
          .limit(1);

        if (existingVin.length > 0) {
          throw new Error('VIN already exists in the system');
        }
      }

      // Update motorcycle
      const updatedMotorcycle = await this.db
        .update(motorcycles)
        .set({
          ...updateData,
          updatedAt: new Date(),
        })
        .where(
          and(
            eq(motorcycles.id, motorcycleId),
            eq(motorcycles.userId, userId)
          )
        )
        .returning();

      if (!updatedMotorcycle.length) {
        throw new Error('Failed to update motorcycle');
      }

      logger.info('Motorcycle updated', {
        userId,
        motorcycleId,
        updatedFields: Object.keys(updateData),
      });

      return updatedMotorcycle[0];
    });
  }

  // Delete motorcycle
  async deleteMotorcycle(motorcycleId: number, userId: number): Promise<void> {
    return this.handleErrors('Delete motorcycle', async () => {
      await this.withTransaction(async (tx) => {
        // Verify ownership first
        const motorcycle = await tx
          .select()
          .from(motorcycles)
          .where(
            and(
              eq(motorcycles.id, motorcycleId),
              eq(motorcycles.userId, userId)
            )
          )
          .limit(1);

        if (!motorcycle.length) {
          throw new Error('Motorcycle not found or access denied');
        }

        // Delete motorcycle (cascading will handle related records)
        await tx
          .delete(motorcycles)
          .where(eq(motorcycles.id, motorcycleId));

        logger.info('Motorcycle deleted', {
          userId,
          motorcycleId,
          make: motorcycle[0].make,
          model: motorcycle[0].model,
        });
      });
    });
  }

  // Get motorcycle count for user
  async getUserMotorcycleCount(userId: number): Promise<number> {
    return this.handleErrors('Get user motorcycle count', async () => {
      const result = await this.db
        .select({ count: sql<number>`count(*)` })
        .from(motorcycles)
        .where(eq(motorcycles.userId, userId));

      return result[0]?.count || 0;
    });
  }

  // Update motorcycle mileage
  async updateMileage(motorcycleId: number, userId: number, newMileage: number): Promise<Motorcycle> {
    return this.handleErrors('Update motorcycle mileage', async () => {
      // Validate mileage
      if (newMileage < 0) {
        throw new Error('Mileage cannot be negative');
      }

      // Get current motorcycle to check current mileage
      const currentMotorcycle = await this.getMotorcycleById(motorcycleId, userId);
      
      if (newMileage < (currentMotorcycle.mileage || 0)) {
        logger.warn('Mileage decreased', {
          userId,
          motorcycleId,
          currentMileage: currentMotorcycle.mileage,
          newMileage,
        });
        // Allow but log the decrease
      }

      // Update mileage
      const updatedMotorcycle = await this.db
        .update(motorcycles)
        .set({
          mileage: newMileage,
          updatedAt: new Date(),
        })
        .where(
          and(
            eq(motorcycles.id, motorcycleId),
            eq(motorcycles.userId, userId)
          )
        )
        .returning();

      if (!updatedMotorcycle.length) {
        throw new Error('Failed to update mileage');
      }

      logger.info('Motorcycle mileage updated', {
        userId,
        motorcycleId,
        previousMileage: currentMotorcycle.mileage,
        newMileage,
      });

      return updatedMotorcycle[0];
    });
  }

  // Search motorcycles
  async searchMotorcycles(
    userId: number,
    query: string,
    page: number = 1,
    limit: number = 10
  ): Promise<{ motorcycles: Motorcycle[]; total: number }> {
    return this.handleErrors('Search motorcycles', async () => {
      const { offset, limit: actualLimit } = this.calculatePagination(page, limit);

      // Search in name, make, and model
      const searchResults = await this.db
        .select()
        .from(motorcycles)
        .where(
          and(
            eq(motorcycles.userId, userId),
            sql`(
              ${motorcycles.name} ILIKE ${`%${query}%`} OR
              ${motorcycles.make} ILIKE ${`%${query}%`} OR
              ${motorcycles.model} ILIKE ${`%${query}%`}
            )`
          )
        )
        .orderBy(desc(motorcycles.createdAt))
        .limit(actualLimit)
        .offset(offset);

      // Get total count for search
      const totalResult = await this.db
        .select({ count: sql<number>`count(*)` })
        .from(motorcycles)
        .where(
          and(
            eq(motorcycles.userId, userId),
            sql`(
              ${motorcycles.name} ILIKE ${`%${query}%`} OR
              ${motorcycles.make} ILIKE ${`%${query}%`} OR
              ${motorcycles.model} ILIKE ${`%${query}%`}
            )`
          )
        );

      const total = totalResult[0]?.count || 0;

      return {
        motorcycles: searchResults,
        total,
      };
    });
  }

  // Get motorcycle statistics for user
  async getUserMotorcycleStats(userId: number): Promise<{
    totalMotorcycles: number;
    totalMileage: number;
    averageMileage: number;
    newestMotorcycle?: Motorcycle;
    highestMileage?: Motorcycle;
  }> {
    return this.handleErrors('Get user motorcycle statistics', async () => {
      const userMotorcycles = await this.db
        .select()
        .from(motorcycles)
        .where(eq(motorcycles.userId, userId));

      if (!userMotorcycles.length) {
        return {
          totalMotorcycles: 0,
          totalMileage: 0,
          averageMileage: 0,
        };
      }

      const totalMileage = userMotorcycles.reduce((sum, bike) => sum + (bike.mileage || 0), 0);
      const averageMileage = totalMileage / userMotorcycles.length;

      // Find newest motorcycle
      const newestMotorcycle = userMotorcycles.reduce((newest, current) => 
        current.createdAt > newest.createdAt ? current : newest
      );

      // Find highest mileage motorcycle
      const highestMileage = userMotorcycles.reduce((highest, current) => 
        (current.mileage || 0) > (highest.mileage || 0) ? current : highest
      );

      return {
        totalMotorcycles: userMotorcycles.length,
        totalMileage,
        averageMileage: Math.round(averageMileage),
        newestMotorcycle,
        highestMileage: highestMileage.mileage ? highestMileage : undefined,
      };
    });
  }
}