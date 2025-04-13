import { pgTable, text, serial, integer, date, boolean, timestamp, uniqueIndex } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  fullName: text("full_name").notNull(),
  email: text("email").notNull().unique(),
  avatarUrl: text("avatar_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Motorcycles table
export const motorcycles = pgTable("motorcycles", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  name: text("name").notNull(),
  make: text("make").notNull(),
  model: text("model").notNull(),
  year: integer("year").notNull(),
  engineSize: text("engine_size").notNull(),
  mileage: integer("mileage").notNull().default(0),
  imageUrl: text("image_url"),
  status: text("status").notNull().default("active"),
  tags: text("tags").array().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  lastRide: timestamp("last_ride"),
});

// Maintenance records table
export const maintenanceRecords = pgTable("maintenance_records", {
  id: serial("id").primaryKey(),
  motorcycleId: integer("motorcycle_id").notNull().references(() => motorcycles.id),
  serviceType: text("service_type").notNull(),
  description: text("description"),
  date: date("date").notNull(),
  mileage: integer("mileage").notNull(),
  cost: integer("cost"),
  completed: boolean("completed").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Maintenance schedules table
export const maintenanceSchedules = pgTable("maintenance_schedules", {
  id: serial("id").primaryKey(),
  motorcycleId: integer("motorcycle_id").notNull().references(() => motorcycles.id),
  serviceType: text("service_type").notNull(),
  description: text("description"),
  intervalMiles: integer("interval_miles"),
  intervalMonths: integer("interval_months"),
  lastServiceDate: date("last_service_date"),
  lastServiceMileage: integer("last_service_mileage"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Rides table
export const rides = pgTable("rides", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  title: text("title").notNull(),
  description: text("description"),
  date: date("date").notNull(),
  location: text("location").notNull(),
  distance: integer("distance"),
  imageUrl: text("image_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Rider relationships table
export const riderRelationships = pgTable("rider_relationships", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  friendId: integer("friend_id").notNull().references(() => users.id),
  status: text("status").notNull().default("pending"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({ id: true, createdAt: true });
export const insertMotorcycleSchema = createInsertSchema(motorcycles).omit({ id: true, createdAt: true });
export const insertMaintenanceRecordSchema = createInsertSchema(maintenanceRecords).omit({ id: true, createdAt: true });
export const insertMaintenanceScheduleSchema = createInsertSchema(maintenanceSchedules).omit({ id: true, createdAt: true });
export const insertRideSchema = createInsertSchema(rides).omit({ id: true, createdAt: true });
export const insertRiderRelationshipSchema = createInsertSchema(riderRelationships).omit({ id: true, createdAt: true });

// Type definitions
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Motorcycle = typeof motorcycles.$inferSelect;
export type InsertMotorcycle = z.infer<typeof insertMotorcycleSchema>;

export type MaintenanceRecord = typeof maintenanceRecords.$inferSelect;
export type InsertMaintenanceRecord = z.infer<typeof insertMaintenanceRecordSchema>;

export type MaintenanceSchedule = typeof maintenanceSchedules.$inferSelect;
export type InsertMaintenanceSchedule = z.infer<typeof insertMaintenanceScheduleSchema>;

export type Ride = typeof rides.$inferSelect;
export type InsertRide = z.infer<typeof insertRideSchema>;

export type RiderRelationship = typeof riderRelationships.$inferSelect;
export type InsertRiderRelationship = z.infer<typeof insertRiderRelationshipSchema>;
