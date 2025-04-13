import { 
  users, User, InsertUser,
  motorcycles, Motorcycle, InsertMotorcycle,
  maintenanceRecords, MaintenanceRecord, InsertMaintenanceRecord,
  maintenanceSchedules, MaintenanceSchedule, InsertMaintenanceSchedule,
  rides, Ride, InsertRide,
  riderRelationships, RiderRelationship, InsertRiderRelationship
} from "@shared/schema";

// Interface for storage operations
export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Motorcycle operations
  getMotorcycle(id: number): Promise<Motorcycle | undefined>;
  getMotorcyclesByUserId(userId: number): Promise<Motorcycle[]>;
  createMotorcycle(motorcycle: InsertMotorcycle): Promise<Motorcycle>;
  updateMotorcycle(id: number, motorcycle: Partial<Motorcycle>): Promise<Motorcycle | undefined>;
  deleteMotorcycle(id: number): Promise<boolean>;
  
  // Maintenance record operations
  getMaintenanceRecord(id: number): Promise<MaintenanceRecord | undefined>;
  getMaintenanceRecordsByMotorcycleId(motorcycleId: number): Promise<MaintenanceRecord[]>;
  createMaintenanceRecord(record: InsertMaintenanceRecord): Promise<MaintenanceRecord>;
  updateMaintenanceRecord(id: number, record: Partial<MaintenanceRecord>): Promise<MaintenanceRecord | undefined>;
  deleteMaintenanceRecord(id: number): Promise<boolean>;
  
  // Maintenance schedule operations
  getMaintenanceSchedule(id: number): Promise<MaintenanceSchedule | undefined>;
  getMaintenanceSchedulesByMotorcycleId(motorcycleId: number): Promise<MaintenanceSchedule[]>;
  createMaintenanceSchedule(schedule: InsertMaintenanceSchedule): Promise<MaintenanceSchedule>;
  updateMaintenanceSchedule(id: number, schedule: Partial<MaintenanceSchedule>): Promise<MaintenanceSchedule | undefined>;
  deleteMaintenanceSchedule(id: number): Promise<boolean>;
  
  // Ride operations
  getRide(id: number): Promise<Ride | undefined>;
  getRidesByUserId(userId: number): Promise<Ride[]>;
  createRide(ride: InsertRide): Promise<Ride>;
  updateRide(id: number, ride: Partial<Ride>): Promise<Ride | undefined>;
  deleteRide(id: number): Promise<boolean>;
  
  // Rider relationship operations
  getRiderRelationship(id: number): Promise<RiderRelationship | undefined>;
  getRiderRelationshipsByUserId(userId: number): Promise<RiderRelationship[]>;
  createRiderRelationship(relationship: InsertRiderRelationship): Promise<RiderRelationship>;
  updateRiderRelationship(id: number, relationship: Partial<RiderRelationship>): Promise<RiderRelationship | undefined>;
  deleteRiderRelationship(id: number): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private motorcycles: Map<number, Motorcycle>;
  private maintenanceRecords: Map<number, MaintenanceRecord>;
  private maintenanceSchedules: Map<number, MaintenanceSchedule>;
  private rides: Map<number, Ride>;
  private riderRelationships: Map<number, RiderRelationship>;
  
  private currentUserId: number = 1;
  private currentMotorcycleId: number = 1;
  private currentMaintenanceRecordId: number = 1;
  private currentMaintenanceScheduleId: number = 1;
  private currentRideId: number = 1;
  private currentRiderRelationshipId: number = 1;
  
  constructor() {
    this.users = new Map();
    this.motorcycles = new Map();
    this.maintenanceRecords = new Map();
    this.maintenanceSchedules = new Map();
    this.rides = new Map();
    this.riderRelationships = new Map();
    
    // Add demo user
    this.createUser({
      username: "demo",
      password: "password",
      fullName: "Demo User",
      email: "demo@throttlecove.com",
      avatarUrl: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=200&h=200&q=80"
    });
  }
  
  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }
  
  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username
    );
  }
  
  async createUser(user: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const newUser: User = { ...user, id, createdAt: new Date() };
    this.users.set(id, newUser);
    return newUser;
  }
  
  // Motorcycle operations
  async getMotorcycle(id: number): Promise<Motorcycle | undefined> {
    return this.motorcycles.get(id);
  }
  
  async getMotorcyclesByUserId(userId: number): Promise<Motorcycle[]> {
    return Array.from(this.motorcycles.values()).filter(
      (motorcycle) => motorcycle.userId === userId
    );
  }
  
  async createMotorcycle(motorcycle: InsertMotorcycle): Promise<Motorcycle> {
    const id = this.currentMotorcycleId++;
    const newMotorcycle: Motorcycle = { ...motorcycle, id, createdAt: new Date() };
    this.motorcycles.set(id, newMotorcycle);
    return newMotorcycle;
  }
  
  async updateMotorcycle(id: number, motorcycle: Partial<Motorcycle>): Promise<Motorcycle | undefined> {
    const existingMotorcycle = this.motorcycles.get(id);
    if (!existingMotorcycle) return undefined;
    
    const updatedMotorcycle = { ...existingMotorcycle, ...motorcycle };
    this.motorcycles.set(id, updatedMotorcycle);
    return updatedMotorcycle;
  }
  
  async deleteMotorcycle(id: number): Promise<boolean> {
    return this.motorcycles.delete(id);
  }
  
  // Maintenance record operations
  async getMaintenanceRecord(id: number): Promise<MaintenanceRecord | undefined> {
    return this.maintenanceRecords.get(id);
  }
  
  async getMaintenanceRecordsByMotorcycleId(motorcycleId: number): Promise<MaintenanceRecord[]> {
    return Array.from(this.maintenanceRecords.values()).filter(
      (record) => record.motorcycleId === motorcycleId
    );
  }
  
  async createMaintenanceRecord(record: InsertMaintenanceRecord): Promise<MaintenanceRecord> {
    const id = this.currentMaintenanceRecordId++;
    const newRecord: MaintenanceRecord = { ...record, id, createdAt: new Date() };
    this.maintenanceRecords.set(id, newRecord);
    return newRecord;
  }
  
  async updateMaintenanceRecord(id: number, record: Partial<MaintenanceRecord>): Promise<MaintenanceRecord | undefined> {
    const existingRecord = this.maintenanceRecords.get(id);
    if (!existingRecord) return undefined;
    
    const updatedRecord = { ...existingRecord, ...record };
    this.maintenanceRecords.set(id, updatedRecord);
    return updatedRecord;
  }
  
  async deleteMaintenanceRecord(id: number): Promise<boolean> {
    return this.maintenanceRecords.delete(id);
  }
  
  // Maintenance schedule operations
  async getMaintenanceSchedule(id: number): Promise<MaintenanceSchedule | undefined> {
    return this.maintenanceSchedules.get(id);
  }
  
  async getMaintenanceSchedulesByMotorcycleId(motorcycleId: number): Promise<MaintenanceSchedule[]> {
    return Array.from(this.maintenanceSchedules.values()).filter(
      (schedule) => schedule.motorcycleId === motorcycleId
    );
  }
  
  async createMaintenanceSchedule(schedule: InsertMaintenanceSchedule): Promise<MaintenanceSchedule> {
    const id = this.currentMaintenanceScheduleId++;
    const newSchedule: MaintenanceSchedule = { ...schedule, id, createdAt: new Date() };
    this.maintenanceSchedules.set(id, newSchedule);
    return newSchedule;
  }
  
  async updateMaintenanceSchedule(id: number, schedule: Partial<MaintenanceSchedule>): Promise<MaintenanceSchedule | undefined> {
    const existingSchedule = this.maintenanceSchedules.get(id);
    if (!existingSchedule) return undefined;
    
    const updatedSchedule = { ...existingSchedule, ...schedule };
    this.maintenanceSchedules.set(id, updatedSchedule);
    return updatedSchedule;
  }
  
  async deleteMaintenanceSchedule(id: number): Promise<boolean> {
    return this.maintenanceSchedules.delete(id);
  }
  
  // Ride operations
  async getRide(id: number): Promise<Ride | undefined> {
    return this.rides.get(id);
  }
  
  async getRidesByUserId(userId: number): Promise<Ride[]> {
    return Array.from(this.rides.values()).filter(
      (ride) => ride.userId === userId
    );
  }
  
  async createRide(ride: InsertRide): Promise<Ride> {
    const id = this.currentRideId++;
    const newRide: Ride = { ...ride, id, createdAt: new Date() };
    this.rides.set(id, newRide);
    return newRide;
  }
  
  async updateRide(id: number, ride: Partial<Ride>): Promise<Ride | undefined> {
    const existingRide = this.rides.get(id);
    if (!existingRide) return undefined;
    
    const updatedRide = { ...existingRide, ...ride };
    this.rides.set(id, updatedRide);
    return updatedRide;
  }
  
  async deleteRide(id: number): Promise<boolean> {
    return this.rides.delete(id);
  }
  
  // Rider relationship operations
  async getRiderRelationship(id: number): Promise<RiderRelationship | undefined> {
    return this.riderRelationships.get(id);
  }
  
  async getRiderRelationshipsByUserId(userId: number): Promise<RiderRelationship[]> {
    return Array.from(this.riderRelationships.values()).filter(
      (relationship) => relationship.userId === userId || relationship.friendId === userId
    );
  }
  
  async createRiderRelationship(relationship: InsertRiderRelationship): Promise<RiderRelationship> {
    const id = this.currentRiderRelationshipId++;
    const newRelationship: RiderRelationship = { ...relationship, id, createdAt: new Date() };
    this.riderRelationships.set(id, newRelationship);
    return newRelationship;
  }
  
  async updateRiderRelationship(id: number, relationship: Partial<RiderRelationship>): Promise<RiderRelationship | undefined> {
    const existingRelationship = this.riderRelationships.get(id);
    if (!existingRelationship) return undefined;
    
    const updatedRelationship = { ...existingRelationship, ...relationship };
    this.riderRelationships.set(id, updatedRelationship);
    return updatedRelationship;
  }
  
  async deleteRiderRelationship(id: number): Promise<boolean> {
    return this.riderRelationships.delete(id);
  }
}

export const storage = new MemStorage();
