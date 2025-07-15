# ThrottleCove Complete Project Documentation

## Table of Contents
1. [Project Overview](#project-overview)
2. [System Architecture](#system-architecture)
3. [Technology Stack](#technology-stack)
4. [Environment Setup](#environment-setup)
5. [Database Schema](#database-schema)
6. [Backend Implementation](#backend-implementation)
7. [Frontend Implementation](#frontend-implementation)
8. [Authentication System](#authentication-system)
9. [API Documentation](#api-documentation)
10. [Security Implementation](#security-implementation)
11. [File Structure](#file-structure)
12. [Configuration Files](#configuration-files)
13. [Deployment Guide](#deployment-guide)
14. [Testing & Development](#testing--development)
15. [Troubleshooting](#troubleshooting)

---

## 1. Project Overview

ThrottleCove is a comprehensive digital platform for motorcycle enthusiasts that provides an advanced garage management and community engagement experience. The platform features:

- **Digital Garage Management**: Store and manage multiple motorcycles per user
- **Maintenance Tracking**: Record service history and schedule maintenance
- **Ride Management**: Track rides and connect with other riders
- **Community Features**: User profiles, rankings, and social interactions
- **Document Management**: Store vehicle paperwork and documentation
- **Metric System**: All measurements in kilometers for international use

### Core Features
- User authentication and authorization
- Vehicle information management (make, model, year, mileage in km)
- Maintenance records and scheduling
- Photo upload capabilities
- User ranking system based on kilometers ridden
- Responsive design for mobile, tablet, and desktop

---

## 2. System Architecture

### Architecture Pattern
- **Frontend**: Single Page Application (SPA) using React
- **Backend**: Express.js REST API server
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Session-based with Passport.js
- **Storage**: In-memory fallback for development, PostgreSQL for production

### Data Flow
```
Client (React) → API (Express) → Storage Layer → Database (PostgreSQL)
     ↓              ↓               ↓              ↓
  UI State     Business Logic   Data Access    Persistence
```

### Security Layers
1. **Transport Security**: HTTPS/TLS encryption
2. **Application Security**: Helmet.js security headers
3. **Authentication**: bcrypt password hashing, session management
4. **Rate Limiting**: API endpoint protection
5. **Input Validation**: Zod schema validation
6. **CORS**: Cross-origin request protection

---

## 3. Technology Stack

### Frontend Technologies
- **React 18**: Modern UI library with hooks
- **TypeScript**: Type-safe JavaScript
- **Vite**: Fast build tool and dev server
- **Tailwind CSS**: Utility-first CSS framework
- **shadcn/ui**: Component library based on Radix UI
- **TanStack Query**: Server state management
- **Wouter**: Lightweight routing
- **Framer Motion**: Animation library
- **React Hook Form**: Form management
- **Zod**: Schema validation

### Backend Technologies
- **Node.js**: Runtime environment
- **Express.js**: Web application framework
- **TypeScript**: Type-safe server code
- **Passport.js**: Authentication middleware
- **bcryptjs**: Password hashing
- **Express Session**: Session management
- **Helmet.js**: Security headers
- **Express Rate Limit**: API protection
- **Winston**: Logging framework
- **Joi/Zod**: Input validation

### Database & ORM
- **PostgreSQL**: Primary database
- **Drizzle ORM**: Type-safe database operations
- **Drizzle Kit**: Schema management and migrations
- **Neon**: Serverless PostgreSQL hosting

### Development Tools
- **ESLint**: Code linting
- **Prettier**: Code formatting
- **PostCSS**: CSS processing
- **tsx**: TypeScript execution

---

## 4. Environment Setup

### Prerequisites
- Node.js 18+ installed
- PostgreSQL database (local or hosted)
- Git for version control

### Initial Setup Steps

1. **Create Project Directory**
```bash
mkdir throttlecove
cd throttlecove
```

2. **Initialize Package.json**
```json
{
  "name": "throttlecove",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "tsx watch server/index.ts",
    "build": "vite build",
    "start": "node dist/index.js",
    "db:push": "drizzle-kit push",
    "db:studio": "drizzle-kit studio"
  }
}
```

3. **Install Dependencies**
```bash
# Core dependencies
npm install express react react-dom typescript

# Backend dependencies
npm install @types/express @types/node @types/bcryptjs @types/passport @types/passport-local
npm install bcryptjs passport passport-local express-session express-rate-limit helmet
npm install drizzle-orm @neondatabase/serverless postgres winston joi

# Frontend dependencies
npm install @tanstack/react-query wouter framer-motion react-hook-form @hookform/resolvers
npm install @radix-ui/react-* tailwindcss @tailwindcss/typography lucide-react

# Development dependencies
npm install -D vite @vitejs/plugin-react tsx drizzle-kit eslint prettier
npm install -D @types/express-session memorystore
```

4. **Environment Variables**
Create `.env` file:
```env
DATABASE_URL=postgresql://username:password@host:port/database
SESSION_SECRET=your-super-secret-session-key
JWT_SECRET=your-jwt-secret-key
JWT_REFRESH_SECRET=your-jwt-refresh-secret
NODE_ENV=development
PORT=3000
```

---

## 5. Database Schema

### Core Tables Structure

#### Users Table
```typescript
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: varchar("username", { length: 50 }).notNull().unique(),
  passwordHash: varchar("password_hash", { length: 255 }).notNull(),
  fullName: varchar("full_name", { length: 100 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  avatarUrl: varchar("avatar_url", { length: 500 }),
  bio: text("bio"),
  location: varchar("location", { length: 100 }),
  totalKilometers: integer("total_kilometers").default(0),
  rank: integer("rank").default(1),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});
```

#### Motorcycles Table
```typescript
export const motorcycles = pgTable("motorcycles", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id, { onDelete: "cascade" }),
  make: varchar("make", { length: 50 }).notNull(),
  model: varchar("model", { length: 100 }).notNull(),
  year: integer("year").notNull(),
  color: varchar("color", { length: 30 }),
  engineSize: varchar("engine_size", { length: 20 }),
  currentKilometers: integer("current_kilometers").default(0),
  vin: varchar("vin", { length: 17 }),
  licensePlate: varchar("license_plate", { length: 20 }),
  insuranceProvider: varchar("insurance_provider", { length: 100 }),
  insurancePolicyNumber: varchar("insurance_policy_number", { length: 50 }),
  status: varchar("status", { length: 20 }).default("active"),
  notes: text("notes"),
  imageUrl: varchar("image_url", { length: 500 }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});
```

#### Maintenance Records Table
```typescript
export const maintenanceRecords = pgTable("maintenance_records", {
  id: serial("id").primaryKey(),
  motorcycleId: integer("motorcycle_id").references(() => motorcycles.id, { onDelete: "cascade" }),
  serviceType: varchar("service_type", { length: 100 }).notNull(),
  description: text("description"),
  cost: decimal("cost", { precision: 10, scale: 2 }),
  serviceDate: date("service_date").notNull(),
  kilometers: integer("kilometers"),
  serviceProvider: varchar("service_provider", { length: 100 }),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});
```

#### Maintenance Schedules Table
```typescript
export const maintenanceSchedules = pgTable("maintenance_schedules", {
  id: serial("id").primaryKey(),
  motorcycleId: integer("motorcycle_id").references(() => motorcycles.id, { onDelete: "cascade" }),
  taskName: varchar("task_name", { length: 100 }).notNull(),
  description: text("description"),
  intervalKilometers: integer("interval_kilometers"),
  intervalDays: integer("interval_days"),
  lastCompletedKilometers: integer("last_completed_kilometers").default(0),
  lastCompletedDate: date("last_completed_date"),
  isActive: boolean("is_active").default(true),
  priority: varchar("priority", { length: 20 }).default("medium"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});
```

#### Rides Table
```typescript
export const rides = pgTable("rides", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id, { onDelete: "cascade" }),
  title: varchar("title", { length: 200 }).notNull(),
  description: text("description"),
  startLocation: varchar("start_location", { length: 200 }),
  endLocation: varchar("end_location", { length: 200 }),
  distanceKilometers: decimal("distance_kilometers", { precision: 8, scale: 2 }),
  duration: integer("duration"), // minutes
  rideDate: date("ride_date").notNull(),
  difficulty: varchar("difficulty", { length: 20 }),
  isPublic: boolean("is_public").default(true),
  maxParticipants: integer("max_participants"),
  currentParticipants: integer("current_participants").default(1),
  status: varchar("status", { length: 20 }).default("planned"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});
```

### Relationships
- Users → Motorcycles (One-to-Many)
- Motorcycles → Maintenance Records (One-to-Many)
- Motorcycles → Maintenance Schedules (One-to-Many)
- Users → Rides (One-to-Many)
- Users → Rider Relationships (Many-to-Many)

---

## 6. Backend Implementation

### Server Configuration (`server/config.ts`)
```typescript
import { z } from 'zod';

const configSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().default(3000),
  DATABASE_URL: z.string().min(1),
  SESSION_SECRET: z.string().min(32),
  JWT_SECRET: z.string().min(32),
  JWT_REFRESH_SECRET: z.string().min(32),
});

function validateConfig() {
  try {
    return configSchema.parse(process.env);
  } catch (error) {
    console.error('❌ Invalid configuration:', error);
    process.exit(1);
  }
}

export const config = validateConfig();
```

### Database Connection (`server/database.ts`)
```typescript
import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import * as schema from '../shared/schema.js';
import { config } from './config.js';

const sql = neon(config.DATABASE_URL);
export const db = drizzle(sql, { schema });

export async function checkDatabaseHealth(): Promise<boolean> {
  try {
    await sql`SELECT 1`;
    return true;
  } catch (error) {
    console.error('Database health check failed:', error);
    return false;
  }
}
```

### Main Server (`server/index.ts`)
```typescript
import express from 'express';
import cors from 'cors';
import { config } from './config.js';
import { securityHeaders, corsOptions } from './middleware/security.js';
import { registerRoutes } from './routes.js';
import { setupVite, serveStatic } from './vite.js';

const app = express();

// Security middleware
app.use(securityHeaders);
app.use(cors(corsOptions));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Setup routes
const server = await registerRoutes(app);

// Setup Vite in development or serve static files in production
if (config.NODE_ENV === 'development') {
  await setupVite(app, server);
} else {
  serveStatic(app);
}

const PORT = config.PORT;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on http://0.0.0.0:${PORT}`);
});
```

### Authentication Service (`server/services/AuthService.ts`)
```typescript
import bcrypt from 'bcryptjs';
import { BaseService } from './BaseService.js';
import { users, type User, type InsertUser } from '../../shared/schema.js';
import { eq } from 'drizzle-orm';

export class AuthService extends BaseService {
  async register(userData: RegisterData): Promise<{ user: Omit<User, 'passwordHash'> }> {
    return this.handleErrors('User registration', async () => {
      const existingUser = await this.db
        .select()
        .from(users)
        .where(eq(users.username, userData.username))
        .limit(1);

      if (existingUser.length > 0) {
        throw new Error('Username already exists');
      }

      const passwordHash = await bcrypt.hash(userData.password, 12);
      
      const [newUser] = await this.db
        .insert(users)
        .values({
          ...userData,
          passwordHash,
        })
        .returning();

      const { passwordHash: _, ...userWithoutPassword } = newUser;
      return { user: userWithoutPassword };
    });
  }

  async login(credentials: LoginData): Promise<{ user: Omit<User, 'passwordHash'> }> {
    return this.handleErrors('User login', async () => {
      const [user] = await this.db
        .select()
        .from(users)
        .where(eq(users.username, credentials.username))
        .limit(1);

      if (!user) {
        throw new Error('Invalid credentials');
      }

      const isValidPassword = await bcrypt.compare(credentials.password, user.passwordHash);
      if (!isValidPassword) {
        throw new Error('Invalid credentials');
      }

      const { passwordHash: _, ...userWithoutPassword } = user;
      return { user: userWithoutPassword };
    });
  }
}
```

---

## 7. Frontend Implementation

### Main App Component (`client/src/App.tsx`)
```typescript
import { BrowserRouter as Router, Route, Switch } from 'wouter';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/hooks/useAuth';

// Pages
import Home from '@/pages/Home';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import Garage from '@/pages/Garage';
import Maintenance from '@/pages/Maintenance';
import Community from '@/pages/Community';
import Shop from '@/pages/Shop';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <div className="min-h-screen bg-background">
            <Switch>
              <Route path="/" component={Home} />
              <Route path="/login" component={Login} />
              <Route path="/register" component={Register} />
              <Route path="/garage" component={Garage} />
              <Route path="/maintenance" component={Maintenance} />
              <Route path="/community" component={Community} />
              <Route path="/shop" component={Shop} />
              <Route component={NotFound} />
            </Switch>
          </div>
          <Toaster />
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
```

### Authentication Hook (`client/src/hooks/useAuth.ts`)
```typescript
import { createContext, useContext, useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

interface User {
  id: number;
  username: string;
  fullName: string;
  email: string;
  avatarUrl?: string;
}

interface AuthContextType {
  user: User | null;
  login: (credentials: LoginData) => Promise<void>;
  logout: () => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const queryClient = useQueryClient();

  // Check current session
  const { data: sessionData, isLoading } = useQuery({
    queryKey: ['/api/auth/session'],
    retry: false,
  });

  useEffect(() => {
    if (sessionData) {
      setUser(sessionData);
    }
  }, [sessionData]);

  const loginMutation = useMutation({
    mutationFn: async (credentials: LoginData) => {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });
      
      if (!response.ok) {
        throw new Error('Login failed');
      }
      
      return response.json();
    },
    onSuccess: (data) => {
      setUser(data.user);
      queryClient.invalidateQueries();
    },
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      await fetch('/api/auth/logout', { method: 'POST' });
    },
    onSuccess: () => {
      setUser(null);
      queryClient.clear();
    },
  });

  return (
    <AuthContext.Provider
      value={{
        user,
        login: loginMutation.mutateAsync,
        logout: logoutMutation.mutateAsync,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
```

### Garage Page (`client/src/pages/Garage.tsx`)
```typescript
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useAuth } from '@/hooks/useAuth';
import { MotorcycleForm } from '@/components/forms/MotorcycleForm';

export default function Garage() {
  const { user } = useAuth();
  const [selectedMotorcycle, setSelectedMotorcycle] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data: motorcycles, isLoading } = useQuery({
    queryKey: ['/api/motorcycles'],
    enabled: !!user,
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await fetch(`/api/motorcycles/${id}`, { method: 'DELETE' });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/motorcycles'] });
    },
  });

  if (isLoading) {
    return <div>Loading motorcycles...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">My Garage</h1>
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Motorcycle
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Motorcycle</DialogTitle>
            </DialogHeader>
            <MotorcycleForm
              onSuccess={() => setIsFormOpen(false)}
              motorcycle={selectedMotorcycle}
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {motorcycles?.map((motorcycle) => (
          <Card key={motorcycle.id} className="relative">
            <CardHeader>
              <CardTitle className="flex justify-between items-start">
                <span>{motorcycle.year} {motorcycle.make} {motorcycle.model}</span>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedMotorcycle(motorcycle);
                      setIsFormOpen(true);
                    }}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => deleteMutation.mutate(motorcycle.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {motorcycle.imageUrl && (
                <img
                  src={motorcycle.imageUrl}
                  alt={`${motorcycle.make} ${motorcycle.model}`}
                  className="w-full h-48 object-cover rounded-md mb-4"
                />
              )}
              <div className="space-y-2 text-sm">
                <p><strong>Color:</strong> {motorcycle.color}</p>
                <p><strong>Engine:</strong> {motorcycle.engineSize}</p>
                <p><strong>Kilometers:</strong> {motorcycle.currentKilometers?.toLocaleString()} km</p>
                <p><strong>Status:</strong> {motorcycle.status}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
```

---

## 8. Authentication System

### Session Configuration
```typescript
// server/routes.ts
app.use(session({
  secret: config.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: new MemoryStoreSession({
    checkPeriod: 86400000 // 24 hours
  }),
  cookie: {
    maxAge: 7 * 24 * 60 * 60 * 1000, // 1 week
    secure: config.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'lax'
  }
}));
```

### Passport Strategy
```typescript
passport.use(new LocalStrategy(async (username, password, done) => {
  try {
    const user = await storage.getUserByUsername(username);
    
    if (!user) {
      return done(null, false, { message: "Invalid credentials" });
    }
    
    const isValidPassword = await bcrypt.compare(password, user.passwordHash);
    if (!isValidPassword) {
      return done(null, false, { message: "Invalid credentials" });
    }
    
    return done(null, user);
  } catch (error) {
    return done(error);
  }
}));
```

### Authentication Middleware
```typescript
const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ error: "Authentication required" });
};
```

---

## 9. API Documentation

### Authentication Endpoints

#### POST /api/auth/register
Register a new user account.

**Request Body:**
```json
{
  "username": "string",
  "password": "string",
  "fullName": "string",
  "email": "string"
}
```

**Response (201):**
```json
{
  "user": {
    "id": 1,
    "username": "newuser",
    "fullName": "New User",
    "email": "user@example.com",
    "avatarUrl": null
  }
}
```

#### POST /api/auth/login
Authenticate user and create session.

**Request Body:**
```json
{
  "username": "string",
  "password": "string"
}
```

**Response (200):**
```json
{
  "user": {
    "id": 1,
    "username": "demo",
    "fullName": "Demo User",
    "email": "demo@throttlecove.com"
  }
}
```

#### POST /api/auth/logout
End user session.

**Response (200):**
```json
{
  "message": "Logged out successfully"
}
```

#### GET /api/auth/session
Get current user session information.

**Response (200):**
```json
{
  "id": 1,
  "username": "demo",
  "fullName": "Demo User",
  "email": "demo@throttlecove.com"
}
```

### Motorcycle Endpoints

#### GET /api/motorcycles
Get all motorcycles for authenticated user.

**Response (200):**
```json
[
  {
    "id": 1,
    "userId": 1,
    "make": "Honda",
    "model": "CBR600RR",
    "year": 2022,
    "color": "Red",
    "engineSize": "600cc",
    "currentKilometers": 5000,
    "status": "active",
    "createdAt": "2025-01-15T10:00:00Z"
  }
]
```

#### POST /api/motorcycles
Create a new motorcycle entry.

**Request Body:**
```json
{
  "make": "string",
  "model": "string",
  "year": "number",
  "color": "string",
  "engineSize": "string",
  "currentKilometers": "number",
  "vin": "string",
  "licensePlate": "string"
}
```

#### GET /api/motorcycles/:id
Get specific motorcycle by ID.

#### PUT /api/motorcycles/:id
Update motorcycle information.

#### DELETE /api/motorcycles/:id
Remove motorcycle from garage.

### Maintenance Endpoints

#### GET /api/motorcycles/:id/maintenance
Get maintenance records for specific motorcycle.

#### POST /api/motorcycles/:id/maintenance
Create new maintenance record.

**Request Body:**
```json
{
  "serviceType": "Oil Change",
  "description": "Regular oil and filter change",
  "cost": "75.00",
  "serviceDate": "2025-01-15",
  "kilometers": 5000,
  "serviceProvider": "Local Shop"
}
```

### Ride Endpoints

#### GET /api/rides
Get all rides for authenticated user.

#### POST /api/rides
Create new ride entry.

**Request Body:**
```json
{
  "title": "Mountain Road Adventure",
  "description": "Scenic ride through mountain passes",
  "startLocation": "City Center",
  "endLocation": "Mountain Peak",
  "distanceKilometers": "120.5",
  "rideDate": "2025-01-20",
  "difficulty": "intermediate"
}
```

---

## 10. Security Implementation

### Password Security
```typescript
// Hash passwords with bcrypt (salt rounds: 10-12)
const passwordHash = await bcrypt.hash(password, 12);

// Verify passwords
const isValid = await bcrypt.compare(password, storedHash);
```

### Rate Limiting
```typescript
export const apiRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP',
  standardHeaders: true,
  legacyHeaders: false,
});

export const authRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 login attempts per windowMs
  skipSuccessfulRequests: true,
});
```

### Input Validation
```typescript
// Use Zod schemas for validation
const motorcycleSchema = z.object({
  make: z.string().min(1).max(50),
  model: z.string().min(1).max(100),
  year: z.number().int().min(1900).max(new Date().getFullYear() + 1),
  currentKilometers: z.number().int().min(0).optional(),
});

// Validate in route handlers
app.post('/api/motorcycles', async (req, res) => {
  try {
    const validatedData = motorcycleSchema.parse(req.body);
    // Process validated data...
  } catch (error) {
    return res.status(400).json({ error: 'Invalid input data' });
  }
});
```

### Security Headers
```typescript
app.use(helmet({
  contentSecurityPolicy: config.NODE_ENV === 'production' ? {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https:"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "https:"],
    },
  } : false,
  hsts: config.NODE_ENV === 'production',
}));
```

---

## 11. File Structure

```
throttlecove/
├── client/                          # Frontend application
│   ├── src/
│   │   ├── components/              # Reusable UI components
│   │   │   ├── ui/                  # Base UI components (shadcn)
│   │   │   │   ├── button.tsx
│   │   │   │   ├── card.tsx
│   │   │   │   ├── dialog.tsx
│   │   │   │   ├── form.tsx
│   │   │   │   ├── input.tsx
│   │   │   │   └── ...
│   │   │   ├── forms/               # Form components
│   │   │   │   ├── MotorcycleForm.tsx
│   │   │   │   ├── MaintenanceForm.tsx
│   │   │   │   └── RideForm.tsx
│   │   │   └── layout/              # Layout components
│   │   │       ├── Header.tsx
│   │   │       ├── Navigation.tsx
│   │   │       └── Footer.tsx
│   │   ├── pages/                   # Page components
│   │   │   ├── Home.tsx
│   │   │   ├── Login.tsx
│   │   │   ├── Register.tsx
│   │   │   ├── Garage.tsx
│   │   │   ├── Maintenance.tsx
│   │   │   ├── Community.tsx
│   │   │   └── Shop.tsx
│   │   ├── hooks/                   # Custom React hooks
│   │   │   ├── useAuth.ts
│   │   │   ├── useMotorcycles.ts
│   │   │   └── useMaintenance.ts
│   │   ├── lib/                     # Utility libraries
│   │   │   ├── utils.ts
│   │   │   ├── queryClient.ts
│   │   │   └── constants.ts
│   │   ├── assets/                  # Static assets
│   │   │   ├── images/
│   │   │   ├── icons/
│   │   │   └── logos/
│   │   ├── App.tsx                  # Main app component
│   │   ├── main.tsx                 # App entry point
│   │   └── index.css                # Global styles
│   └── index.html                   # HTML template
├── server/                          # Backend application
│   ├── middleware/                  # Express middleware
│   │   ├── security.ts              # Security headers, rate limiting
│   │   ├── auth.ts                  # Authentication middleware
│   │   └── validation.ts            # Input validation
│   ├── services/                    # Business logic services
│   │   ├── AuthService.ts           # Authentication service
│   │   ├── VehicleService.ts        # Vehicle management service
│   │   ├── MaintenanceService.ts    # Maintenance service
│   │   └── BaseService.ts           # Base service class
│   ├── utils/                       # Server utilities
│   │   ├── logger.ts                # Winston logging setup
│   │   ├── validation.ts            # Zod validation schemas
│   │   └── crypto.ts                # Cryptographic utilities
│   ├── config.ts                    # Environment configuration
│   ├── database.ts                  # Database connection
│   ├── storage.ts                   # Storage interface & implementation
│   ├── routes.ts                    # API route definitions
│   ├── index.ts                     # Server entry point
│   └── vite.ts                      # Vite development integration
├── shared/                          # Shared code between client/server
│   └── schema.ts                    # Database schema & types
├── .env                             # Environment variables
├── .gitignore                       # Git ignore rules
├── drizzle.config.ts                # Drizzle ORM configuration
├── package.json                     # Project dependencies
├── tsconfig.json                    # TypeScript configuration
├── tailwind.config.ts               # Tailwind CSS configuration
├── vite.config.ts                   # Vite build configuration
├── postcss.config.js                # PostCSS configuration
└── README.md                        # Project documentation
```

---

## 12. Configuration Files

### Vite Configuration (`vite.config.ts`)
```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './client/src'),
      '@assets': path.resolve(__dirname, './attached_assets'),
    },
  },
  server: {
    host: '0.0.0.0',
    port: 5173,
  },
  build: {
    outDir: 'dist/public',
    sourcemap: true,
  },
});
```

### Tailwind Configuration (`tailwind.config.ts`)
```typescript
import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: [
    './client/**/*.{ts,tsx}',
    './client/src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};

export default config;
```

### TypeScript Configuration (`tsconfig.json`)
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./client/src/*"],
      "@assets/*": ["./attached_assets/*"]
    }
  },
  "include": [
    "client/src",
    "server",
    "shared",
    "*.ts",
    "*.tsx"
  ],
  "exclude": ["node_modules", "dist"]
}
```

### Drizzle Configuration (`drizzle.config.ts`)
```typescript
import type { Config } from 'drizzle-kit';

export default {
  schema: './shared/schema.ts',
  out: './drizzle',
  driver: 'pg',
  dbCredentials: {
    connectionString: process.env.DATABASE_URL!,
  },
  verbose: true,
  strict: true,
} satisfies Config;
```

---

## 13. Deployment Guide

### Production Environment Setup

1. **Database Setup**
   - Create PostgreSQL database (Neon, Supabase, or self-hosted)
   - Run migrations: `npm run db:push`
   - Set up database indexes for performance

2. **Environment Variables**
```env
NODE_ENV=production
DATABASE_URL=postgresql://user:password@host:port/database
SESSION_SECRET=production-session-secret-minimum-32-characters
JWT_SECRET=production-jwt-secret-minimum-32-characters
JWT_REFRESH_SECRET=production-refresh-secret-minimum-32-characters
PORT=3000
```

3. **Build Process**
```bash
# Install dependencies
npm ci --only=production

# Build frontend
npm run build

# Start production server
npm start
```

4. **Docker Deployment** (Optional)
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

5. **Reverse Proxy Setup** (Nginx)
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### Platform-Specific Deployment

#### Replit Deployment
1. Set environment variables in Replit Secrets
2. Configure `.replit` file:
```toml
run = "npm run dev"
entrypoint = "server/index.ts"

[nix]
channel = "stable-22_11"

[deployment]
run = ["sh", "-c", "npm run build && npm start"]
```

#### Vercel Deployment
1. Configure `vercel.json`:
```json
{
  "version": 2,
  "builds": [
    {
      "src": "server/index.ts",
      "use": "@vercel/node"
    },
    {
      "src": "client/**/*",
      "use": "@vercel/static"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/server/index.ts"
    },
    {
      "src": "/(.*)",
      "dest": "/client/$1"
    }
  ]
}
```

#### Railway Deployment
1. Connect GitHub repository
2. Set environment variables
3. Configure build command: `npm run build`
4. Configure start command: `npm start`

---

## 14. Testing & Development

### Development Workflow

1. **Start Development Server**
```bash
npm run dev
```

2. **Database Development**
```bash
# Push schema changes
npm run db:push

# Open database studio
npm run db:studio
```

3. **Code Quality**
```bash
# Run linting
npm run lint

# Format code
npm run format

# Type checking
npm run type-check
```

### Testing Strategy

#### Unit Testing Setup
```bash
npm install -D vitest @testing-library/react @testing-library/jest-dom
```

#### Test Configuration (`vitest.config.ts`)
```typescript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./test/setup.ts'],
  },
});
```

#### Sample Component Test
```typescript
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Button } from '@/components/ui/button';

describe('Button Component', () => {
  it('renders correctly', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button')).toHaveTextContent('Click me');
  });
});
```

#### API Testing
```typescript
import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import { app } from '../server/index';

describe('Authentication API', () => {
  it('should register a new user', async () => {
    const response = await request(app)
      .post('/api/auth/register')
      .send({
        username: 'testuser',
        password: 'password123',
        fullName: 'Test User',
        email: 'test@example.com'
      });

    expect(response.status).toBe(201);
    expect(response.body.user).toHaveProperty('id');
  });
});
```

### Performance Monitoring

#### Frontend Performance
- Use React DevTools Profiler
- Monitor bundle size with `npm run build -- --analyze`
- Implement lazy loading for routes
- Optimize images and assets

#### Backend Performance
- Monitor API response times
- Use database query analysis
- Implement caching strategies
- Monitor memory usage

---

## 15. Troubleshooting

### Common Issues and Solutions

#### Database Connection Issues
**Problem**: "Connection failed" or timeout errors

**Solutions**:
1. Verify DATABASE_URL format: `postgresql://user:password@host:port/database`
2. Check network connectivity to database
3. Verify SSL settings for cloud databases
4. Use connection pooling for production

#### Authentication Problems
**Problem**: Login fails or sessions not persisting

**Solutions**:
1. Check SESSION_SECRET is set and consistent
2. Verify cookie settings (secure flag in production)
3. Clear browser cookies and session storage
4. Check bcrypt hash comparison

#### Build Errors
**Problem**: TypeScript or build failures

**Solutions**:
1. Clear node_modules and reinstall: `rm -rf node_modules && npm install`
2. Check TypeScript configuration paths
3. Verify all dependencies are compatible
4. Update outdated packages

#### Performance Issues
**Problem**: Slow page loads or API responses

**Solutions**:
1. Implement database indexes on frequently queried columns
2. Add API response caching
3. Optimize bundle size with code splitting
4. Use CDN for static assets

#### CORS Errors
**Problem**: Frontend can't connect to backend

**Solutions**:
1. Configure CORS middleware properly
2. Set correct origin URLs
3. Check for trailing slashes in URLs
4. Verify request headers and methods

### Development Tips

1. **Hot Reload Issues**: Restart dev server if changes don't reflect
2. **Database Schema Changes**: Always run `npm run db:push` after schema updates
3. **Environment Variables**: Restart server after changing .env file
4. **TypeScript Errors**: Check import paths and type definitions
5. **UI Components**: Use Storybook for component development

### Debugging Tools

1. **Backend Debugging**:
   - Use Winston logger for structured logging
   - Enable Express request logging
   - Use debugger or console.log strategically

2. **Frontend Debugging**:
   - React Developer Tools
   - Browser Network tab for API calls
   - TanStack Query DevTools

3. **Database Debugging**:
   - Drizzle Studio for database inspection
   - PostgreSQL logs for query analysis
   - Enable query logging in development

---

## Conclusion

This documentation provides a comprehensive guide to recreate the ThrottleCove motorcycle enthusiast platform. The application follows modern web development best practices with a focus on:

- **Security**: Proper authentication, input validation, and secure headers
- **Performance**: Optimized queries, caching, and code splitting
- **Maintainability**: Clean architecture, TypeScript, and modular code
- **User Experience**: Responsive design, intuitive UI, and metric system
- **Scalability**: Microservices-ready architecture with proper separation of concerns

Follow this documentation step-by-step to build a production-ready motorcycle management platform that serves the global riding community with all measurements in kilometers.

For support or questions about implementation, refer to the individual component documentation and API specifications provided in each section.