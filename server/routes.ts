import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import session from "express-session";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import MemoryStore from "memorystore";
import { z } from "zod";

import {
  insertUserSchema,
  insertMotorcycleSchema,
  insertMaintenanceRecordSchema,
  insertMaintenanceScheduleSchema,
  insertRideSchema,
  insertRiderRelationshipSchema
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Session setup
  const MemoryStoreSession = MemoryStore(session);
  
  app.use(session({
    secret: process.env.SESSION_SECRET || "throttlecove-secret",
    resave: false,
    saveUninitialized: false,
    store: new MemoryStoreSession({
      checkPeriod: 86400000 // prune expired entries every 24h
    }),
    cookie: {
      maxAge: 7 * 24 * 60 * 60 * 1000, // 1 week
      secure: process.env.NODE_ENV === "production"
    }
  }));
  
  // Passport configuration
  app.use(passport.initialize());
  app.use(passport.session());
  
  passport.use(new LocalStrategy(async (username, password, done) => {
    try {
      const user = await storage.getUserByUsername(username);
      
      if (!user) {
        return done(null, false, { message: "Invalid username or password" });
      }
      
      if (user.password !== password) { // In a real app, use bcrypt to compare passwords
        return done(null, false, { message: "Invalid username or password" });
      }
      
      return done(null, user);
    } catch (error) {
      return done(error);
    }
  }));
  
  passport.serializeUser((user: any, done) => {
    done(null, user.id);
  });
  
  passport.deserializeUser(async (id: number, done) => {
    try {
      const user = await storage.getUser(id);
      done(null, user);
    } catch (error) {
      done(error);
    }
  });
  
  // Auth middleware
  const isAuthenticated = (req: Request, res: Response, next: any) => {
    if (req.isAuthenticated()) {
      return next();
    }
    
    // Dev mode bypass - simulate authenticated user "Arafat"
    if (process.env.NODE_ENV === "development") {
      req.user = {
        id: 1,
        username: "arafat_dev",
        fullName: "Arafat",
        email: "arafat@throttlecove.dev",
        avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
        createdAt: new Date(),
        password: "dev"
      };
      return next();
    }
    
    res.status(401).json({ message: "Unauthorized" });
  };
  
  // Auth routes
  app.post("/api/auth/login", passport.authenticate("local"), (req, res) => {
    res.json(req.user);
  });
  
  app.post("/api/auth/register", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      
      // Check if username already exists
      const existingUser = await storage.getUserByUsername(userData.username);
      if (existingUser) {
        return res.status(400).json({ message: "Username already exists" });
      }
      
      const user = await storage.createUser(userData);
      req.login(user, (err) => {
        if (err) {
          return res.status(500).json({ message: "Login failed after registration" });
        }
        return res.status(201).json(user);
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Registration failed" });
    }
  });
  
  app.post("/api/auth/logout", (req, res) => {
    req.logout((err) => {
      if (err) {
        return res.status(500).json({ message: "Logout failed" });
      }
      res.json({ message: "Logged out successfully" });
    });
  });
  
  app.get("/api/auth/session", (req, res) => {
    if (req.isAuthenticated()) {
      return res.json(req.user);
    }
    
    // Dev mode bypass - return mock user "Arafat"
    if (process.env.NODE_ENV === "development") {
      const arafatUser = {
        id: 1,
        username: "arafat_dev",
        fullName: "Arafat",
        email: "arafat@throttlecove.dev",
        avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
        createdAt: new Date()
      };
      return res.json(arafatUser);
    }
    
    res.status(401).json({ message: "Not authenticated" });
  });
  
  // User routes
  app.get("/api/users/me", isAuthenticated, (req, res) => {
    res.json(req.user);
  });
  
  // Motorcycle routes
  app.get("/api/motorcycles", isAuthenticated, async (req, res) => {
    const userId = (req.user as any).id;
    const motorcycles = await storage.getMotorcyclesByUserId(userId);
    res.json(motorcycles);
  });
  
  app.post("/api/motorcycles", isAuthenticated, async (req, res) => {
    try {
      const userId = (req.user as any).id;
      const motorcycleData = insertMotorcycleSchema.parse({
        ...req.body,
        userId
      });
      
      const motorcycle = await storage.createMotorcycle(motorcycleData);
      res.status(201).json(motorcycle);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create motorcycle" });
    }
  });
  
  app.get("/api/motorcycles/:id", isAuthenticated, async (req, res) => {
    const userId = (req.user as any).id;
    const motorcycleId = parseInt(req.params.id);
    
    const motorcycle = await storage.getMotorcycle(motorcycleId);
    
    if (!motorcycle) {
      return res.status(404).json({ message: "Motorcycle not found" });
    }
    
    if (motorcycle.userId !== userId) {
      return res.status(403).json({ message: "Forbidden" });
    }
    
    res.json(motorcycle);
  });
  
  app.put("/api/motorcycles/:id", isAuthenticated, async (req, res) => {
    try {
      const userId = (req.user as any).id;
      const motorcycleId = parseInt(req.params.id);
      
      const motorcycle = await storage.getMotorcycle(motorcycleId);
      
      if (!motorcycle) {
        return res.status(404).json({ message: "Motorcycle not found" });
      }
      
      if (motorcycle.userId !== userId) {
        return res.status(403).json({ message: "Forbidden" });
      }
      
      const updatedMotorcycle = await storage.updateMotorcycle(motorcycleId, req.body);
      res.json(updatedMotorcycle);
    } catch (error) {
      res.status(500).json({ message: "Failed to update motorcycle" });
    }
  });
  
  app.delete("/api/motorcycles/:id", isAuthenticated, async (req, res) => {
    try {
      const userId = (req.user as any).id;
      const motorcycleId = parseInt(req.params.id);
      
      const motorcycle = await storage.getMotorcycle(motorcycleId);
      
      if (!motorcycle) {
        return res.status(404).json({ message: "Motorcycle not found" });
      }
      
      if (motorcycle.userId !== userId) {
        return res.status(403).json({ message: "Forbidden" });
      }
      
      await storage.deleteMotorcycle(motorcycleId);
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete motorcycle" });
    }
  });
  
  // Maintenance record routes
  app.get("/api/motorcycles/:motorcycleId/maintenance", isAuthenticated, async (req, res) => {
    try {
      const userId = (req.user as any).id;
      const motorcycleId = parseInt(req.params.motorcycleId);
      
      const motorcycle = await storage.getMotorcycle(motorcycleId);
      
      if (!motorcycle) {
        return res.status(404).json({ message: "Motorcycle not found" });
      }
      
      if (motorcycle.userId !== userId) {
        return res.status(403).json({ message: "Forbidden" });
      }
      
      const maintenanceRecords = await storage.getMaintenanceRecordsByMotorcycleId(motorcycleId);
      res.json(maintenanceRecords);
    } catch (error) {
      res.status(500).json({ message: "Failed to get maintenance records" });
    }
  });
  
  app.post("/api/motorcycles/:motorcycleId/maintenance", isAuthenticated, async (req, res) => {
    try {
      const userId = (req.user as any).id;
      const motorcycleId = parseInt(req.params.motorcycleId);
      
      const motorcycle = await storage.getMotorcycle(motorcycleId);
      
      if (!motorcycle) {
        return res.status(404).json({ message: "Motorcycle not found" });
      }
      
      if (motorcycle.userId !== userId) {
        return res.status(403).json({ message: "Forbidden" });
      }
      
      const maintenanceData = insertMaintenanceRecordSchema.parse({
        ...req.body,
        motorcycleId
      });
      
      const maintenanceRecord = await storage.createMaintenanceRecord(maintenanceData);
      res.status(201).json(maintenanceRecord);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create maintenance record" });
    }
  });
  
  app.put("/api/maintenance/:id", isAuthenticated, async (req, res) => {
    try {
      const userId = (req.user as any).id;
      const maintenanceId = parseInt(req.params.id);
      
      const maintenance = await storage.getMaintenanceRecord(maintenanceId);
      
      if (!maintenance) {
        return res.status(404).json({ message: "Maintenance record not found" });
      }
      
      const motorcycle = await storage.getMotorcycle(maintenance.motorcycleId);
      
      if (motorcycle?.userId !== userId) {
        return res.status(403).json({ message: "Forbidden" });
      }
      
      const updatedMaintenance = await storage.updateMaintenanceRecord(maintenanceId, req.body);
      res.json(updatedMaintenance);
    } catch (error) {
      res.status(500).json({ message: "Failed to update maintenance record" });
    }
  });
  
  // Maintenance schedule routes
  app.get("/api/motorcycles/:motorcycleId/schedule", isAuthenticated, async (req, res) => {
    try {
      const userId = (req.user as any).id;
      const motorcycleId = parseInt(req.params.motorcycleId);
      
      const motorcycle = await storage.getMotorcycle(motorcycleId);
      
      if (!motorcycle) {
        return res.status(404).json({ message: "Motorcycle not found" });
      }
      
      if (motorcycle.userId !== userId) {
        return res.status(403).json({ message: "Forbidden" });
      }
      
      const schedules = await storage.getMaintenanceSchedulesByMotorcycleId(motorcycleId);
      res.json(schedules);
    } catch (error) {
      res.status(500).json({ message: "Failed to get maintenance schedules" });
    }
  });
  
  app.post("/api/motorcycles/:motorcycleId/schedule", isAuthenticated, async (req, res) => {
    try {
      const userId = (req.user as any).id;
      const motorcycleId = parseInt(req.params.motorcycleId);
      
      const motorcycle = await storage.getMotorcycle(motorcycleId);
      
      if (!motorcycle) {
        return res.status(404).json({ message: "Motorcycle not found" });
      }
      
      if (motorcycle.userId !== userId) {
        return res.status(403).json({ message: "Forbidden" });
      }
      
      const scheduleData = insertMaintenanceScheduleSchema.parse({
        ...req.body,
        motorcycleId
      });
      
      const schedule = await storage.createMaintenanceSchedule(scheduleData);
      res.status(201).json(schedule);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create maintenance schedule" });
    }
  });
  
  // Ride routes
  app.get("/api/rides", isAuthenticated, async (req, res) => {
    const userId = (req.user as any).id;
    const rides = await storage.getRidesByUserId(userId);
    res.json(rides);
  });
  
  app.post("/api/rides", isAuthenticated, async (req, res) => {
    try {
      const userId = (req.user as any).id;
      const rideData = insertRideSchema.parse({
        ...req.body,
        userId
      });
      
      const ride = await storage.createRide(rideData);
      res.status(201).json(ride);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create ride" });
    }
  });
  
  // Friends routes
  app.get("/api/friends", isAuthenticated, async (req, res) => {
    const userId = (req.user as any).id;
    const relationships = await storage.getRiderRelationshipsByUserId(userId);
    
    // Get all friend IDs
    const friendIds = relationships
      .filter(rel => rel.status === "accepted")
      .map(rel => rel.userId === userId ? rel.friendId : rel.userId);
    
    // Get friend profiles
    const friendPromises = friendIds.map(id => storage.getUser(id));
    const friends = await Promise.all(friendPromises);
    
    // Filter out undefined values and remove password field
    const friendsFiltered = friends
      .filter(Boolean)
      .map(friend => {
        const { password, ...userData } = friend!;
        return userData;
      });
    
    res.json(friendsFiltered);
  });
  
  app.post("/api/friends/request", isAuthenticated, async (req, res) => {
    try {
      const userId = (req.user as any).id;
      const { friendId } = req.body;
      
      if (userId === friendId) {
        return res.status(400).json({ message: "Cannot add yourself as a friend" });
      }
      
      const friend = await storage.getUser(friendId);
      if (!friend) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const relationshipData = insertRiderRelationshipSchema.parse({
        userId,
        friendId,
        status: "pending"
      });
      
      const relationship = await storage.createRiderRelationship(relationshipData);
      res.status(201).json(relationship);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create friend request" });
    }
  });
  
  app.put("/api/friends/request/:id", isAuthenticated, async (req, res) => {
    try {
      const userId = (req.user as any).id;
      const relationshipId = parseInt(req.params.id);
      const { status } = req.body;
      
      const relationship = await storage.getRiderRelationship(relationshipId);
      
      if (!relationship) {
        return res.status(404).json({ message: "Relationship not found" });
      }
      
      if (relationship.friendId !== userId) {
        return res.status(403).json({ message: "Forbidden" });
      }
      
      const updatedRelationship = await storage.updateRiderRelationship(relationshipId, { status });
      res.json(updatedRelationship);
    } catch (error) {
      res.status(500).json({ message: "Failed to update friend request" });
    }
  });
  
  const httpServer = createServer(app);
  
  return httpServer;
}
