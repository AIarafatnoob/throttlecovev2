import type { Express, Request, Response } from "express";
import express from "express";
import { createServer, type Server } from "http";
import { storage } from './storage.js';
import session from "express-session";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import MemoryStore from "memorystore";
import { z } from "zod";
import bcrypt from "bcryptjs";
import multer from "multer";
import path from "path";
import fs from "fs";

import {
  insertUserSchema,
  insertMotorcycleSchema,
  insertMaintenanceRecordSchema,
  insertMaintenanceScheduleSchema,
  insertRideSchema,
  insertRiderRelationshipSchema,
  loginSchema,
  registerSchema
} from "../shared/schema.js";

export async function registerRoutes(app: Express): Promise<Server> {
  // Create uploads directory if it doesn't exist
  const uploadsDir = path.join(process.cwd(), 'uploads');
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  // Multer configuration for file uploads
  const upload = multer({
    storage: multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, uploadsDir);
      },
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
      }
    }),
    limits: {
      fileSize: 5 * 1024 * 1024 // 5MB limit
    },
    fileFilter: (req, file, cb) => {
      if (file.fieldname === 'photo') {
        // Accept images only
        if (!file.mimetype.startsWith('image/')) {
          cb(new Error('Only image files are allowed'));
          return;
        }
      } else if (file.fieldname.startsWith('document_')) {
        // Accept common document formats
        const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
        if (!allowedTypes.includes(file.mimetype)) {
          cb(new Error('Only PDF, JPG, and PNG files are allowed for documents'));
          return;
        }
      }
      cb(null, true);
    }
  });

  // Serve uploaded files statically
  app.use('/uploads', express.static(uploadsDir));

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
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
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
      
      // Compare hashed password
      const isValidPassword = await bcrypt.compare(password, user.passwordHash);
      if (!isValidPassword) {
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
    res.status(401).json({ error: "Authentication required" });
  };

  // ============================================================================
  // AUTHENTICATION ROUTES
  // ============================================================================

  // Register new user
  app.post("/api/auth/register", async (req: Request, res: Response) => {
    try {
      const { username, password, fullName, email } = req.body;

      if (!username || !password || !fullName || !email) {
        return res.status(400).json({ error: "All fields are required" });
      }

      const existingUser = await storage.getUserByUsername(username);
      if (existingUser) {
        return res.status(400).json({ error: "Username already exists" });
      }

      // Hash password
      const passwordHash = await bcrypt.hash(password, 10);

      const user = await storage.createUser({
        username,
        passwordHash,
        fullName,
        email,
      });

      req.login(user, (err) => {
        if (err) {
          return res.status(500).json({ error: "Login failed after registration" });
        }
        res.json({ 
          user: {
            id: user.id,
            username: user.username,
            fullName: user.fullName,
            email: user.email,
            avatarUrl: user.avatarUrl,
          }
        });
      });
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({ error: "Registration failed" });
    }
  });

  // Login user
  app.post("/api/auth/login", (req: Request, res: Response, next: any) => {
    passport.authenticate("local", (err: any, user: any, info: any) => {
      if (err) {
        return next(err);
      }
      if (!user) {
        return res.status(401).json({ error: "Invalid credentials" });
      }
      req.login(user, (err) => {
        if (err) {
          return next(err);
        }
        return res.json({
          user: {
            id: user.id,
            username: user.username,
            fullName: user.fullName,
            email: user.email,
            avatarUrl: user.avatarUrl,
          }
        });
      });
    })(req, res, next);
  });

  // Logout user
  app.post("/api/auth/logout", (req: Request, res: Response) => {
    req.logout((err) => {
      if (err) {
        return res.status(500).json({ error: "Logout failed" });
      }
      res.json({ message: "Logged out successfully" });
    });
  });

  // Get current session/user
  app.get("/api/auth/session", (req: Request, res: Response) => {
    if (req.isAuthenticated()) {
      const user = req.user as any;
      res.json({
        id: user.id,
        username: user.username,
        fullName: user.fullName,
        email: user.email,
        avatarUrl: user.avatarUrl,
      });
    } else {
      res.status(401).json({ error: "Not authenticated" });
    }
  });

  // ============================================================================
  // MOTORCYCLE ROUTES
  // ============================================================================

  // Get all motorcycles for user
  app.get("/api/motorcycles", isAuthenticated, async (req: any, res: Response) => {
    try {
      const motorcycles = await storage.getMotorcyclesByUserId(req.user.id);
      res.json(motorcycles);
    } catch (error) {
      console.error('Get motorcycles error:', error);
      res.status(500).json({ error: "Failed to fetch motorcycles" });
    }
  });

  // Create new motorcycle
  app.post("/api/motorcycles", isAuthenticated, upload.any(), async (req: any, res: Response) => {
    try {
      const files = req.files as Express.Multer.File[];
      
      // Process uploaded photo
      let photoUrl = '';
      const photoFile = files?.find(f => f.fieldname === 'photo');
      if (photoFile) {
        photoUrl = `/uploads/${photoFile.filename}`;
      }
      
      // Process uploaded documents
      const documentFiles = files?.filter(f => f.fieldname.startsWith('document_')) || [];
      
      // Create motorcycle with photo as first item in photos array
      const motorcycleData = {
        ...req.body,
        userId: req.user.id,
        photos: photoUrl ? [photoUrl] : [],
        mileage: req.body.mileage ? parseInt(req.body.mileage) : 0,
        year: req.body.year ? parseInt(req.body.year) : new Date().getFullYear()
      };
      
      const motorcycle = await storage.createMotorcycle(motorcycleData);
      
      // Save documents to documents table if any were uploaded
      if (documentFiles.length > 0) {
        for (const docFile of documentFiles) {
          const documentData = {
            motorcycleId: motorcycle.id,
            documentType: 'general',
            title: docFile.originalname,
            fileUrl: `/uploads/${docFile.filename}`,
            fileSize: docFile.size,
            mimeType: docFile.mimetype
          };
          
          await storage.createDocument(documentData);
        }
      }
      
      res.status(201).json(motorcycle);
    } catch (error) {
      console.error('Create motorcycle error:', error);
      res.status(500).json({ error: "Failed to create motorcycle" });
    }
  });

  // Get motorcycle by ID
  app.get("/api/motorcycles/:id", isAuthenticated, async (req: any, res: Response) => {
    try {
      const motorcycle = await storage.getMotorcycle(parseInt(req.params.id));
      if (!motorcycle || motorcycle.userId !== req.user.id) {
        return res.status(404).json({ error: "Motorcycle not found" });
      }
      res.json(motorcycle);
    } catch (error) {
      console.error('Get motorcycle error:', error);
      res.status(500).json({ error: "Failed to fetch motorcycle" });
    }
  });

  // Update motorcycle
  app.put("/api/motorcycles/:id", isAuthenticated, async (req: any, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const motorcycle = await storage.getMotorcycle(id);
      
      if (!motorcycle || motorcycle.userId !== req.user.id) {
        return res.status(404).json({ error: "Motorcycle not found" });
      }

      const updatedMotorcycle = await storage.updateMotorcycle(id, req.body);
      res.json(updatedMotorcycle);
    } catch (error) {
      console.error('Update motorcycle error:', error);
      res.status(500).json({ error: "Failed to update motorcycle" });
    }
  });

  // Delete motorcycle
  app.delete("/api/motorcycles/:id", isAuthenticated, async (req: any, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const motorcycle = await storage.getMotorcycle(id);
      
      if (!motorcycle || motorcycle.userId !== req.user.id) {
        return res.status(404).json({ error: "Motorcycle not found" });
      }

      await storage.deleteMotorcycle(id);
      res.json({ message: "Motorcycle deleted successfully" });
    } catch (error) {
      console.error('Delete motorcycle error:', error);
      res.status(500).json({ error: "Failed to delete motorcycle" });
    }
  });

  // Get documents for a motorcycle
  app.get("/api/motorcycles/:id/documents", isAuthenticated, async (req: any, res: Response) => {
    try {
      const motorcycleId = parseInt(req.params.id);
      const motorcycle = await storage.getMotorcycle(motorcycleId);
      
      if (!motorcycle || motorcycle.userId !== req.user.id) {
        return res.status(404).json({ error: "Motorcycle not found" });
      }
      
      const documents = await storage.getDocumentsByMotorcycleId(motorcycleId);
      res.json(documents);
    } catch (error) {
      console.error('Get documents error:', error);
      res.status(500).json({ error: "Failed to get documents" });
    }
  });

  // Get all documents for user's vehicles
  app.get("/api/documents", isAuthenticated, async (req: any, res: Response) => {
    try {
      const userMotorcycles = await storage.getMotorcyclesByUserId(req.user.id);
      const allDocuments = [];
      
      for (const motorcycle of userMotorcycles) {
        const documents = await storage.getDocumentsByMotorcycleId(motorcycle.id);
        allDocuments.push(...documents.map(doc => ({ 
          ...doc, 
          motorcycleName: motorcycle.name || `${motorcycle.make} ${motorcycle.model}` 
        })));
      }
      
      res.json(allDocuments);
    } catch (error) {
      console.error('Get all documents error:', error);
      res.status(500).json({ error: "Failed to get documents" });
    }
  });

  // ============================================================================
  // MAINTENANCE ROUTES
  // ============================================================================

  // Get maintenance records for motorcycle
  app.get("/api/motorcycles/:id/maintenance", isAuthenticated, async (req: any, res: Response) => {
    try {
      const motorcycleId = parseInt(req.params.id);
      const motorcycle = await storage.getMotorcycle(motorcycleId);
      
      if (!motorcycle || motorcycle.userId !== req.user.id) {
        return res.status(404).json({ error: "Motorcycle not found" });
      }

      const records = await storage.getMaintenanceRecordsByMotorcycleId(motorcycleId);
      res.json(records);
    } catch (error) {
      console.error('Get maintenance records error:', error);
      res.status(500).json({ error: "Failed to fetch maintenance records" });
    }
  });

  // Create maintenance record
  app.post("/api/motorcycles/:id/maintenance", isAuthenticated, async (req: any, res: Response) => {
    try {
      const motorcycleId = parseInt(req.params.id);
      const motorcycle = await storage.getMotorcycle(motorcycleId);
      
      if (!motorcycle || motorcycle.userId !== req.user.id) {
        return res.status(404).json({ error: "Motorcycle not found" });
      }

      const recordData = { ...req.body, motorcycleId };
      const record = await storage.createMaintenanceRecord(recordData);
      res.status(201).json(record);
    } catch (error) {
      console.error('Create maintenance record error:', error);
      res.status(500).json({ error: "Failed to create maintenance record" });
    }
  });

  // ============================================================================
  // RIDE ROUTES
  // ============================================================================

  // Get rides for user
  app.get("/api/rides", isAuthenticated, async (req: any, res: Response) => {
    try {
      const rides = await storage.getRidesByUserId(req.user.id);
      res.json(rides);
    } catch (error) {
      console.error('Get rides error:', error);
      res.status(500).json({ error: "Failed to fetch rides" });
    }
  });

  // Create new ride
  app.post("/api/rides", isAuthenticated, async (req: any, res: Response) => {
    try {
      const rideData = { ...req.body, userId: req.user.id };
      const ride = await storage.createRide(rideData);
      res.status(201).json(ride);
    } catch (error) {
      console.error('Create ride error:', error);
      res.status(500).json({ error: "Failed to create ride" });
    }
  });

  // ============================================================================
  // HEALTH AND STATUS ROUTES
  // ============================================================================

  // API status endpoint
  app.get("/api/status", (req: Request, res: Response) => {
    res.json({
      status: "operational",
      timestamp: new Date().toISOString(),
      version: "1.0.0",
      services: {
        auth: "operational",
        vehicles: "operational",
        storage: "operational",
      },
    });
  });

  // Create HTTP server
  const httpServer = createServer(app);
  
  console.log('API routes registered successfully');
  return httpServer;
}