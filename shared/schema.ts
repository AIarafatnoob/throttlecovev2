import { pgTable, text, serial, integer, date, boolean, timestamp, uniqueIndex, varchar, decimal, point, jsonb, inet, uuid, index } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table - required for Replit Auth
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table - required for Replit Auth
export const users = pgTable("users", {
  id: varchar("id").primaryKey().notNull(),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});



// Enhanced motorcycles table
export const motorcycles = pgTable("motorcycles", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  name: varchar("name", { length: 255 }).notNull(),
  make: varchar("make", { length: 100 }).notNull(),
  model: varchar("model", { length: 100 }).notNull(),
  year: integer("year"),
  vin: varchar("vin", { length: 17 }).unique(),
  engineSize: integer("engine_size"), // CC
  engineType: varchar("engine_type", { length: 50 }),
  color: varchar("color", { length: 50 }),
  mileage: integer("mileage").default(0),
  purchaseDate: date("purchase_date"),
  purchasePrice: decimal("purchase_price", { precision: 10, scale: 2 }),
  currentValue: decimal("current_value", { precision: 10, scale: 2 }),
  insuranceProvider: varchar("insurance_provider", { length: 255 }),
  insurancePolicy: varchar("insurance_policy", { length: 100 }),
  registrationNumber: varchar("registration_number", { length: 50 }),
  licensePlate: varchar("license_plate", { length: 20 }),
  status: varchar("status", { length: 20 }).default("active"), // active, sold, stolen, totaled
  photos: text("photos").array(), // Array of photo URLs
  documents: jsonb("documents"), // Document metadata
  customFields: jsonb("custom_fields"), // User-defined fields
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => ({
  userIdIdx: index("idx_motorcycles_user_id").on(table.userId),
  vinIdx: index("idx_motorcycles_vin").on(table.vin),
  searchIdx: index("idx_motorcycles_search").on(table.name, table.make, table.model),
}));

// Enhanced maintenance records table
export const maintenanceRecords = pgTable("maintenance_records", {
  id: serial("id").primaryKey(),
  motorcycleId: integer("motorcycle_id").notNull().references(() => motorcycles.id, { onDelete: "cascade" }),
  serviceType: varchar("service_type", { length: 100 }).notNull(),
  description: text("description"),
  mileageAtService: integer("mileage_at_service"),
  serviceDate: date("service_date").notNull(),
  cost: decimal("cost", { precision: 10, scale: 2 }),
  serviceProvider: varchar("service_provider", { length: 255 }),
  partsUsed: jsonb("parts_used"), // Array of parts with details
  laborHours: decimal("labor_hours", { precision: 4, scale: 2 }),
  nextServiceDue: integer("next_service_due"), // Mileage
  nextServiceDate: date("next_service_date"),
  receiptUrl: text("receipt_url"),
  notes: text("notes"),
  warrantyPeriod: integer("warranty_period"), // Days
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => ({
  motorcycleIdIdx: index("idx_maintenance_records_motorcycle_id").on(table.motorcycleId),
  serviceDateIdx: index("idx_maintenance_records_service_date").on(table.serviceDate),
}));

// Enhanced maintenance schedules table
export const maintenanceSchedules = pgTable("maintenance_schedules", {
  id: serial("id").primaryKey(),
  motorcycleId: integer("motorcycle_id").notNull().references(() => motorcycles.id, { onDelete: "cascade" }),
  serviceType: varchar("service_type", { length: 100 }).notNull(),
  intervalType: varchar("interval_type", { length: 20 }).notNull(), // mileage, time, both
  mileageInterval: integer("mileage_interval"),
  timeInterval: integer("time_interval"), // Days
  description: text("description"),
  costEstimate: decimal("cost_estimate", { precision: 10, scale: 2 }),
  isCritical: boolean("is_critical").default(false),
  reminderSettings: jsonb("reminder_settings"), // Notification preferences
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => ({
  motorcycleIdIdx: index("idx_maintenance_schedules_motorcycle_id").on(table.motorcycleId),
}));

// Enhanced rides table with GPS tracking
export const rides = pgTable("rides", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  motorcycleId: integer("motorcycle_id").references(() => motorcycles.id, { onDelete: "set null" }),
  title: varchar("title", { length: 255 }),
  description: text("description"),
  startLocation: point("start_location"),
  endLocation: point("end_location"),
  routeData: jsonb("route_data"), // GPS coordinates, waypoints
  distance: decimal("distance", { precision: 8, scale: 2 }), // Kilometers
  duration: integer("duration"), // Minutes
  startTime: timestamp("start_time"),
  endTime: timestamp("end_time"),
  maxSpeed: decimal("max_speed", { precision: 5, scale: 2 }),
  avgSpeed: decimal("avg_speed", { precision: 5, scale: 2 }),
  fuelConsumed: decimal("fuel_consumed", { precision: 5, scale: 2 }),
  cost: decimal("cost", { precision: 8, scale: 2 }),
  photos: text("photos").array(),
  isPublic: boolean("is_public").default(false),
  tags: text("tags").array(),
  weatherData: jsonb("weather_data"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => ({
  userIdIdx: index("idx_rides_user_id").on(table.userId),
  startTimeIdx: index("idx_rides_start_time").on(table.startTime),
}));

// Documents table for vehicle paperwork
export const documents = pgTable("documents", {
  id: serial("id").primaryKey(),
  motorcycleId: integer("motorcycle_id").notNull().references(() => motorcycles.id, { onDelete: "cascade" }),
  documentType: varchar("document_type", { length: 50 }).notNull(), // registration, insurance, service, etc.
  title: varchar("title", { length: 255 }).notNull(),
  fileUrl: text("file_url").notNull(),
  fileSize: integer("file_size"),
  mimeType: varchar("mime_type", { length: 100 }),
  issueDate: date("issue_date"),
  expiryDate: date("expiry_date"),
  issuingAuthority: varchar("issuing_authority", { length: 255 }),
  documentNumber: varchar("document_number", { length: 100 }),
  status: varchar("status", { length: 20 }).default("valid"), // valid, expired, expiring
  reminderDays: integer("reminder_days").default(30),
  extractedData: jsonb("extracted_data"), // OCR results
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => ({
  motorcycleIdIdx: index("idx_documents_motorcycle_id").on(table.motorcycleId),
  expiryDateIdx: index("idx_documents_expiry_date").on(table.expiryDate),
}));

// Enhanced rider relationships (social features)
export const riderRelationships = pgTable("rider_relationships", {
  id: serial("id").primaryKey(),
  followerId: varchar("follower_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  followingId: varchar("following_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  status: varchar("status", { length: 20 }).default("pending"), // pending, accepted, blocked
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => ({
  followerIdx: index("idx_relationships_follower").on(table.followerId),
  followingIdx: index("idx_relationships_following").on(table.followingId),
  uniqueRelationship: index("idx_relationships_unique").on(table.followerId, table.followingId),
}));

// Groups and communities
export const groups = pgTable("groups", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  creatorId: varchar("creator_id").references(() => users.id, { onDelete: "set null" }),
  type: varchar("type", { length: 20 }).default("public"), // public, private, invite_only
  location: point("location"),
  locationName: varchar("location_name", { length: 255 }),
  memberCount: integer("member_count").default(0),
  avatarUrl: text("avatar_url"),
  coverUrl: text("cover_url"),
  rules: text("rules"),
  tags: text("tags").array(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => ({
  searchIdx: index("idx_groups_search").on(table.name, table.description),
}));

// Group membership
export const groupMembers = pgTable("group_members", {
  id: serial("id").primaryKey(),
  groupId: integer("group_id").notNull().references(() => groups.id, { onDelete: "cascade" }),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  role: varchar("role", { length: 20 }).default("member"), // admin, moderator, member
  joinedAt: timestamp("joined_at").defaultNow().notNull(),
}, (table) => ({
  groupUserIdx: index("idx_group_members_group_user").on(table.groupId, table.userId),
}));

// Events and group rides
export const events = pgTable("events", {
  id: serial("id").primaryKey(),
  groupId: integer("group_id").references(() => groups.id, { onDelete: "cascade" }),
  creatorId: varchar("creator_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  eventType: varchar("event_type", { length: 20 }).default("ride"), // ride, meetup, service, social
  startTime: timestamp("start_time").notNull(),
  endTime: timestamp("end_time"),
  location: point("location"),
  locationName: varchar("location_name", { length: 255 }),
  maxParticipants: integer("max_participants"),
  currentParticipants: integer("current_participants").default(0),
  difficultyLevel: varchar("difficulty_level", { length: 20 }), // beginner, intermediate, advanced
  routeData: jsonb("route_data"),
  estimatedDistance: decimal("estimated_distance", { precision: 8, scale: 2 }),
  cost: decimal("cost", { precision: 8, scale: 2 }),
  requirements: text("requirements"),
  status: varchar("status", { length: 20 }).default("active"), // active, cancelled, completed
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => ({
  startTimeIdx: index("idx_events_start_time").on(table.startTime),
}));

// Notifications system
export const notifications = pgTable("notifications", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  type: varchar("type", { length: 50 }).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  message: text("message"),
  data: jsonb("data"), // Additional context data
  read: boolean("read").default(false),
  actionUrl: text("action_url"),
  expiresAt: timestamp("expires_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => ({
  userReadIdx: index("idx_notifications_user_read").on(table.userId, table.read),
}));

// API keys for integrations
export const apiKeys = pgTable("api_keys", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  name: varchar("name", { length: 255 }).notNull(),
  keyHash: varchar("key_hash", { length: 255 }).notNull().unique(),
  permissions: text("permissions").array(), // Array of allowed operations
  rateLimit: integer("rate_limit").default(1000), // Requests per hour
  lastUsed: timestamp("last_used"),
  expiresAt: timestamp("expires_at"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({ id: true, createdAt: true, updatedAt: true });
export const insertMotorcycleSchema = createInsertSchema(motorcycles).omit({ id: true, createdAt: true, updatedAt: true });
export const insertMaintenanceRecordSchema = createInsertSchema(maintenanceRecords).omit({ id: true, createdAt: true, updatedAt: true });
export const insertMaintenanceScheduleSchema = createInsertSchema(maintenanceSchedules).omit({ id: true, createdAt: true, updatedAt: true });
export const insertRideSchema = createInsertSchema(rides).omit({ id: true, createdAt: true, updatedAt: true });
export const insertDocumentSchema = createInsertSchema(documents).omit({ id: true, createdAt: true, updatedAt: true });
export const insertRiderRelationshipSchema = createInsertSchema(riderRelationships).omit({ id: true, createdAt: true });
export const insertGroupSchema = createInsertSchema(groups).omit({ id: true, createdAt: true, updatedAt: true });
export const insertGroupMemberSchema = createInsertSchema(groupMembers).omit({ id: true, joinedAt: true });
export const insertEventSchema = createInsertSchema(events).omit({ id: true, createdAt: true, updatedAt: true });
export const insertNotificationSchema = createInsertSchema(notifications).omit({ id: true, createdAt: true });
export const insertApiKeySchema = createInsertSchema(apiKeys).omit({ id: true, createdAt: true });

// Authentication schemas
export const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

export const registerSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters").max(50),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  fullName: z.string().min(1, "Full name is required").max(255),
});

// Type definitions
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type UpsertUser = typeof users.$inferInsert;

export type Motorcycle = typeof motorcycles.$inferSelect;
export type InsertMotorcycle = z.infer<typeof insertMotorcycleSchema>;

export type MaintenanceRecord = typeof maintenanceRecords.$inferSelect;
export type InsertMaintenanceRecord = z.infer<typeof insertMaintenanceRecordSchema>;

export type MaintenanceSchedule = typeof maintenanceSchedules.$inferSelect;
export type InsertMaintenanceSchedule = z.infer<typeof insertMaintenanceScheduleSchema>;

export type Ride = typeof rides.$inferSelect;
export type InsertRide = z.infer<typeof insertRideSchema>;

export type Document = typeof documents.$inferSelect;
export type InsertDocument = z.infer<typeof insertDocumentSchema>;

export type RiderRelationship = typeof riderRelationships.$inferSelect;
export type InsertRiderRelationship = z.infer<typeof insertRiderRelationshipSchema>;

export type Group = typeof groups.$inferSelect;
export type InsertGroup = z.infer<typeof insertGroupSchema>;

export type GroupMember = typeof groupMembers.$inferSelect;
export type InsertGroupMember = z.infer<typeof insertGroupMemberSchema>;

export type Event = typeof events.$inferSelect;
export type InsertEvent = z.infer<typeof insertEventSchema>;

export type Notification = typeof notifications.$inferSelect;
export type InsertNotification = z.infer<typeof insertNotificationSchema>;

export type ApiKey = typeof apiKeys.$inferSelect;
export type InsertApiKey = z.infer<typeof insertApiKeySchema>;

// Auth types
export type LoginData = z.infer<typeof loginSchema>;
export type RegisterData = z.infer<typeof registerSchema>;
