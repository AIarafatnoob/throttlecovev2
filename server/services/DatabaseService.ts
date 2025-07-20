import { eq, and, desc } from 'drizzle-orm';
import { BaseService } from './BaseService.js';
import { Database } from '../database.js';
import { IStorage } from '../storage.js';
import {
  users, User, InsertUser,
  motorcycles, Motorcycle, InsertMotorcycle,
  maintenanceRecords, MaintenanceRecord, InsertMaintenanceRecord,
  maintenanceSchedules, MaintenanceSchedule, InsertMaintenanceSchedule,
  rides, Ride, InsertRide,
  documents, Document, InsertDocument,
  riderRelationships, RiderRelationship, InsertRiderRelationship
} from '@shared/schema';

export class DatabaseService extends BaseService implements IStorage {
  constructor(db: Database) {
    super(db);
  }

  // ============================================================================
  // USER OPERATIONS
  // ============================================================================

  async getUser(id: number): Promise<User | undefined> {
    return this.handleErrors('getUser', async () => {
      const [user] = await this.db.select().from(users).where(eq(users.id, id));
      return user;
    });
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return this.handleErrors('getUserByUsername', async () => {
      const [user] = await this.db.select().from(users).where(eq(users.username, username));
      return user;
    });
  }

  async createUser(user: InsertUser): Promise<User> {
    return this.handleErrors('createUser', async () => {
      const [newUser] = await this.db.insert(users).values(user).returning();
      return newUser;
    });
  }

  // ============================================================================
  // MOTORCYCLE OPERATIONS
  // ============================================================================

  async getMotorcycle(id: number): Promise<Motorcycle | undefined> {
    return this.handleErrors('getMotorcycle', async () => {
      const [motorcycle] = await this.db.select().from(motorcycles).where(eq(motorcycles.id, id));
      return motorcycle;
    });
  }

  async getMotorcyclesByUserId(userId: number): Promise<Motorcycle[]> {
    return this.handleErrors('getMotorcyclesByUserId', async () => {
      return await this.db.select().from(motorcycles)
        .where(eq(motorcycles.userId, userId))
        .orderBy(desc(motorcycles.createdAt));
    });
  }

  async createMotorcycle(motorcycle: InsertMotorcycle): Promise<Motorcycle> {
    return this.handleErrors('createMotorcycle', async () => {
      const [newMotorcycle] = await this.db.insert(motorcycles).values(motorcycle).returning();
      return newMotorcycle;
    });
  }

  async updateMotorcycle(id: number, motorcycle: Partial<Motorcycle>): Promise<Motorcycle | undefined> {
    return this.handleErrors('updateMotorcycle', async () => {
      const [updated] = await this.db.update(motorcycles)
        .set({ ...motorcycle, updatedAt: new Date() })
        .where(eq(motorcycles.id, id))
        .returning();
      return updated;
    });
  }

  async deleteMotorcycle(id: number): Promise<boolean> {
    return this.handleErrors('deleteMotorcycle', async () => {
      const result = await this.db.delete(motorcycles).where(eq(motorcycles.id, id));
      return result.length > 0;
    });
  }

  // ============================================================================
  // MAINTENANCE RECORD OPERATIONS
  // ============================================================================

  async getMaintenanceRecord(id: number): Promise<MaintenanceRecord | undefined> {
    return this.handleErrors('getMaintenanceRecord', async () => {
      const [record] = await this.db.select().from(maintenanceRecords).where(eq(maintenanceRecords.id, id));
      return record;
    });
  }

  async getMaintenanceRecordsByMotorcycleId(motorcycleId: number): Promise<MaintenanceRecord[]> {
    return this.handleErrors('getMaintenanceRecordsByMotorcycleId', async () => {
      return await this.db.select().from(maintenanceRecords)
        .where(eq(maintenanceRecords.motorcycleId, motorcycleId))
        .orderBy(desc(maintenanceRecords.serviceDate));
    });
  }

  async createMaintenanceRecord(record: InsertMaintenanceRecord): Promise<MaintenanceRecord> {
    return this.handleErrors('createMaintenanceRecord', async () => {
      const [newRecord] = await this.db.insert(maintenanceRecords).values(record).returning();
      return newRecord;
    });
  }

  async updateMaintenanceRecord(id: number, record: Partial<MaintenanceRecord>): Promise<MaintenanceRecord | undefined> {
    return this.handleErrors('updateMaintenanceRecord', async () => {
      const [updated] = await this.db.update(maintenanceRecords)
        .set({ ...record, updatedAt: new Date() })
        .where(eq(maintenanceRecords.id, id))
        .returning();
      return updated;
    });
  }

  async deleteMaintenanceRecord(id: number): Promise<boolean> {
    return this.handleErrors('deleteMaintenanceRecord', async () => {
      const result = await this.db.delete(maintenanceRecords).where(eq(maintenanceRecords.id, id));
      return result.length > 0;
    });
  }

  // ============================================================================
  // MAINTENANCE SCHEDULE OPERATIONS
  // ============================================================================

  async getMaintenanceSchedule(id: number): Promise<MaintenanceSchedule | undefined> {
    return this.handleErrors('getMaintenanceSchedule', async () => {
      const [schedule] = await this.db.select().from(maintenanceSchedules).where(eq(maintenanceSchedules.id, id));
      return schedule;
    });
  }

  async getMaintenanceSchedulesByMotorcycleId(motorcycleId: number): Promise<MaintenanceSchedule[]> {
    return this.handleErrors('getMaintenanceSchedulesByMotorcycleId', async () => {
      return await this.db.select().from(maintenanceSchedules)
        .where(eq(maintenanceSchedules.motorcycleId, motorcycleId))
        .orderBy(desc(maintenanceSchedules.createdAt));
    });
  }

  async createMaintenanceSchedule(schedule: InsertMaintenanceSchedule): Promise<MaintenanceSchedule> {
    return this.handleErrors('createMaintenanceSchedule', async () => {
      const [newSchedule] = await this.db.insert(maintenanceSchedules).values(schedule).returning();
      return newSchedule;
    });
  }

  async updateMaintenanceSchedule(id: number, schedule: Partial<MaintenanceSchedule>): Promise<MaintenanceSchedule | undefined> {
    return this.handleErrors('updateMaintenanceSchedule', async () => {
      const [updated] = await this.db.update(maintenanceSchedules)
        .set({ ...schedule, updatedAt: new Date() })
        .where(eq(maintenanceSchedules.id, id))
        .returning();
      return updated;
    });
  }

  async deleteMaintenanceSchedule(id: number): Promise<boolean> {
    return this.handleErrors('deleteMaintenanceSchedule', async () => {
      const result = await this.db.delete(maintenanceSchedules).where(eq(maintenanceSchedules.id, id));
      return result.length > 0;
    });
  }

  // ============================================================================
  // RIDE OPERATIONS
  // ============================================================================

  async getRide(id: number): Promise<Ride | undefined> {
    return this.handleErrors('getRide', async () => {
      const [ride] = await this.db.select().from(rides).where(eq(rides.id, id));
      return ride;
    });
  }

  async getRidesByUserId(userId: number): Promise<Ride[]> {
    return this.handleErrors('getRidesByUserId', async () => {
      return await this.db.select().from(rides)
        .where(eq(rides.userId, userId))
        .orderBy(desc(rides.startTime));
    });
  }

  async createRide(ride: InsertRide): Promise<Ride> {
    return this.handleErrors('createRide', async () => {
      const [newRide] = await this.db.insert(rides).values(ride).returning();
      return newRide;
    });
  }

  async updateRide(id: number, ride: Partial<Ride>): Promise<Ride | undefined> {
    return this.handleErrors('updateRide', async () => {
      const [updated] = await this.db.update(rides)
        .set({ ...ride, updatedAt: new Date() })
        .where(eq(rides.id, id))
        .returning();
      return updated;
    });
  }

  async deleteRide(id: number): Promise<boolean> {
    return this.handleErrors('deleteRide', async () => {
      const result = await this.db.delete(rides).where(eq(rides.id, id));
      return result.length > 0;
    });
  }

  // ============================================================================
  // DOCUMENT OPERATIONS
  // ============================================================================

  async getDocument(id: number): Promise<Document | undefined> {
    return this.handleErrors('getDocument', async () => {
      const [document] = await this.db.select().from(documents).where(eq(documents.id, id));
      return document;
    });
  }

  async getDocumentsByMotorcycleId(motorcycleId: number): Promise<Document[]> {
    return this.handleErrors('getDocumentsByMotorcycleId', async () => {
      return await this.db.select().from(documents)
        .where(eq(documents.motorcycleId, motorcycleId))
        .orderBy(desc(documents.createdAt));
    });
  }

  async createDocument(document: InsertDocument): Promise<Document> {
    return this.handleErrors('createDocument', async () => {
      const [newDocument] = await this.db.insert(documents).values(document).returning();
      return newDocument;
    });
  }

  async updateDocument(id: number, document: Partial<Document>): Promise<Document | undefined> {
    return this.handleErrors('updateDocument', async () => {
      const [updated] = await this.db.update(documents)
        .set({ ...document, updatedAt: new Date() })
        .where(eq(documents.id, id))
        .returning();
      return updated;
    });
  }

  async deleteDocument(id: number): Promise<boolean> {
    return this.handleErrors('deleteDocument', async () => {
      const result = await this.db.delete(documents).where(eq(documents.id, id));
      return result.length > 0;
    });
  }

  // ============================================================================
  // RIDER RELATIONSHIP OPERATIONS
  // ============================================================================

  async getRiderRelationship(id: number): Promise<RiderRelationship | undefined> {
    return this.handleErrors('getRiderRelationship', async () => {
      const [relationship] = await this.db.select().from(riderRelationships).where(eq(riderRelationships.id, id));
      return relationship;
    });
  }

  async getRiderRelationshipsByUserId(userId: number): Promise<RiderRelationship[]> {
    return this.handleErrors('getRiderRelationshipsByUserId', async () => {
      return await this.db.select().from(riderRelationships)
        .where(eq(riderRelationships.followerId, userId))
        .orderBy(desc(riderRelationships.createdAt));
    });
  }

  async createRiderRelationship(relationship: InsertRiderRelationship): Promise<RiderRelationship> {
    return this.handleErrors('createRiderRelationship', async () => {
      const [newRelationship] = await this.db.insert(riderRelationships).values(relationship).returning();
      return newRelationship;
    });
  }

  async updateRiderRelationship(id: number, relationship: Partial<RiderRelationship>): Promise<RiderRelationship | undefined> {
    return this.handleErrors('updateRiderRelationship', async () => {
      const [updated] = await this.db.update(riderRelationships)
        .set(relationship)
        .where(eq(riderRelationships.id, id))
        .returning();
      return updated;
    });
  }

  async deleteRiderRelationship(id: number): Promise<boolean> {
    return this.handleErrors('deleteRiderRelationship', async () => {
      const result = await this.db.delete(riderRelationships).where(eq(riderRelationships.id, id));
      return result.length > 0;
    });
  }
}