# ThrottleCove Backend Architecture Specification

## Table of Contents
1. [Overview](#overview)
2. [System Architecture](#system-architecture)
3. [Database Design](#database-design)
4. [API Architecture](#api-architecture)
5. [Authentication & Authorization](#authentication--authorization)
6. [Security Implementation](#security-implementation)
7. [Scalability Strategy](#scalability-strategy)
8. [Data Flow & Business Logic](#data-flow--business-logic)
9. [File Storage & Media Management](#file-storage--media-management)
10. [Monitoring & Logging](#monitoring--logging)
11. [Deployment Architecture](#deployment-architecture)
12. [Performance Optimization](#performance-optimization)

## Overview

ThrottleCove is a comprehensive motorcycle management platform requiring a robust, secure, and scalable backend architecture. The system manages user authentication, vehicle data, maintenance records, community features, and document storage while maintaining high performance and security standards.

### Core Requirements
- Multi-user vehicle management
- Document storage and compliance tracking
- Maintenance scheduling and history
- Community features and social interactions
- Real-time notifications
- File upload and media management
- Analytics and reporting
- Third-party integrations (parts suppliers, service providers)

## System Architecture

### Microservices Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   API Gateway   │    │  Load Balancer  │    │   CDN/Cache     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
    ┌────────────────────────────┴────────────────────────────┐
    │                                                         │
┌───▼────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐
│ Auth   │  │ Vehicle │  │ Maint.  │  │ Social  │  │ File    │
│Service │  │Service  │  │Service  │  │Service  │  │Service  │
└────────┘  └─────────┘  └─────────┘  └─────────┘  └─────────┘
     │           │           │           │           │
     └───────────┼───────────┼───────────┼───────────┘
                 │           │           │
        ┌────────▼───────────▼───────────▼────────┐
        │            Database Cluster             │
        │  ┌─────────┐ ┌─────────┐ ┌─────────┐   │
        │  │Primary  │ │Replica 1│ │Replica 2│   │
        │  │PostgreSQL│ │PostgreSQL│ │PostgreSQL│   │
        │  └─────────┘ └─────────┘ └─────────┘   │
        └──────────────────────────────────────────┘
```

### Service Breakdown

#### 1. Authentication Service
- User registration and login
- Session management
- Password reset and verification
- OAuth integration (Google, Apple, Facebook)
- Multi-factor authentication
- Role-based access control

#### 2. Vehicle Management Service
- Motorcycle CRUD operations
- Vehicle information management
- Ownership verification
- Vehicle history tracking
- Integration with VIN databases

#### 3. Maintenance Service
- Service scheduling and reminders
- Maintenance history tracking
- Service provider recommendations
- Parts tracking and inventory
- Cost analysis and reporting

#### 4. Social/Community Service
- User profiles and relationships
- Group rides and events
- Forums and messaging
- Content moderation
- Notifications system

#### 5. File Management Service
- Document upload and storage
- Image processing and optimization
- File versioning and backup
- Compliance document tracking
- OCR for document parsing

## Database Design

### Primary Database: PostgreSQL

#### Core Tables

```sql
-- Users and Authentication
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255),
    phone VARCHAR(20),
    avatar_url TEXT,
    email_verified BOOLEAN DEFAULT FALSE,
    mfa_enabled BOOLEAN DEFAULT FALSE,
    mfa_secret VARCHAR(32),
    login_attempts INTEGER DEFAULT 0,
    locked_until TIMESTAMP,
    last_login TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User Sessions
CREATE TABLE user_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    session_token VARCHAR(255) UNIQUE NOT NULL,
    refresh_token VARCHAR(255) UNIQUE,
    ip_address INET,
    user_agent TEXT,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Motorcycles
CREATE TABLE motorcycles (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    make VARCHAR(100) NOT NULL,
    model VARCHAR(100) NOT NULL,
    year INTEGER,
    vin VARCHAR(17) UNIQUE,
    engine_size INTEGER, -- CC
    engine_type VARCHAR(50),
    color VARCHAR(50),
    mileage INTEGER DEFAULT 0,
    purchase_date DATE,
    purchase_price DECIMAL(10,2),
    current_value DECIMAL(10,2),
    insurance_provider VARCHAR(255),
    insurance_policy VARCHAR(100),
    registration_number VARCHAR(50),
    license_plate VARCHAR(20),
    status VARCHAR(20) DEFAULT 'active', -- active, sold, stolen, totaled
    photos TEXT[], -- Array of photo URLs
    documents JSONB, -- Document metadata
    custom_fields JSONB, -- User-defined fields
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Maintenance Records
CREATE TABLE maintenance_records (
    id SERIAL PRIMARY KEY,
    motorcycle_id INTEGER REFERENCES motorcycles(id) ON DELETE CASCADE,
    service_type VARCHAR(100) NOT NULL,
    description TEXT,
    mileage_at_service INTEGER,
    service_date DATE NOT NULL,
    cost DECIMAL(10,2),
    service_provider VARCHAR(255),
    parts_used JSONB, -- Array of parts with details
    labor_hours DECIMAL(4,2),
    next_service_due INTEGER, -- Mileage
    next_service_date DATE,
    receipt_url TEXT,
    notes TEXT,
    warranty_period INTEGER, -- Days
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Maintenance Schedules
CREATE TABLE maintenance_schedules (
    id SERIAL PRIMARY KEY,
    motorcycle_id INTEGER REFERENCES motorcycles(id) ON DELETE CASCADE,
    service_type VARCHAR(100) NOT NULL,
    interval_type VARCHAR(20) NOT NULL, -- mileage, time, both
    mileage_interval INTEGER,
    time_interval INTEGER, -- Days
    description TEXT,
    cost_estimate DECIMAL(10,2),
    is_critical BOOLEAN DEFAULT FALSE,
    reminder_settings JSONB, -- Notification preferences
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Rides and Trips
CREATE TABLE rides (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    motorcycle_id INTEGER REFERENCES motorcycles(id) ON DELETE SET NULL,
    title VARCHAR(255),
    description TEXT,
    start_location POINT,
    end_location POINT,
    route_data JSONB, -- GPS coordinates, waypoints
    distance DECIMAL(8,2), -- Kilometers
    duration INTEGER, -- Minutes
    start_time TIMESTAMP,
    end_time TIMESTAMP,
    max_speed DECIMAL(5,2),
    avg_speed DECIMAL(5,2),
    fuel_consumed DECIMAL(5,2),
    cost DECIMAL(8,2),
    photos TEXT[],
    is_public BOOLEAN DEFAULT FALSE,
    tags TEXT[],
    weather_data JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Documents
CREATE TABLE documents (
    id SERIAL PRIMARY KEY,
    motorcycle_id INTEGER REFERENCES motorcycles(id) ON DELETE CASCADE,
    document_type VARCHAR(50) NOT NULL, -- registration, insurance, service, etc.
    title VARCHAR(255) NOT NULL,
    file_url TEXT NOT NULL,
    file_size INTEGER,
    mime_type VARCHAR(100),
    issue_date DATE,
    expiry_date DATE,
    issuing_authority VARCHAR(255),
    document_number VARCHAR(100),
    status VARCHAR(20) DEFAULT 'valid', -- valid, expired, expiring
    reminder_days INTEGER DEFAULT 30,
    extracted_data JSONB, -- OCR results
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User Relationships
CREATE TABLE user_relationships (
    id SERIAL PRIMARY KEY,
    follower_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    following_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    status VARCHAR(20) DEFAULT 'pending', -- pending, accepted, blocked
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(follower_id, following_id)
);

-- Groups and Communities
CREATE TABLE groups (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    creator_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    type VARCHAR(20) DEFAULT 'public', -- public, private, invite_only
    location POINT,
    location_name VARCHAR(255),
    member_count INTEGER DEFAULT 0,
    avatar_url TEXT,
    cover_url TEXT,
    rules TEXT,
    tags TEXT[],
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE group_members (
    id SERIAL PRIMARY KEY,
    group_id INTEGER REFERENCES groups(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    role VARCHAR(20) DEFAULT 'member', -- admin, moderator, member
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(group_id, user_id)
);

-- Events and Rides
CREATE TABLE events (
    id SERIAL PRIMARY KEY,
    group_id INTEGER REFERENCES groups(id) ON DELETE CASCADE,
    creator_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    event_type VARCHAR(20) DEFAULT 'ride', -- ride, meetup, service, social
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP,
    location POINT,
    location_name VARCHAR(255),
    max_participants INTEGER,
    current_participants INTEGER DEFAULT 0,
    difficulty_level VARCHAR(20), -- beginner, intermediate, advanced
    route_data JSONB,
    estimated_distance DECIMAL(8,2),
    cost DECIMAL(8,2),
    requirements TEXT,
    status VARCHAR(20) DEFAULT 'active', -- active, cancelled, completed
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Notifications
CREATE TABLE notifications (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT,
    data JSONB, -- Additional context data
    read BOOLEAN DEFAULT FALSE,
    action_url TEXT,
    expires_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- API Keys and Integrations
CREATE TABLE api_keys (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    key_hash VARCHAR(255) UNIQUE NOT NULL,
    permissions TEXT[], -- Array of allowed operations
    rate_limit INTEGER DEFAULT 1000, -- Requests per hour
    last_used TIMESTAMP,
    expires_at TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Database Indexes

```sql
-- Performance indexes
CREATE INDEX idx_motorcycles_user_id ON motorcycles(user_id);
CREATE INDEX idx_maintenance_records_motorcycle_id ON maintenance_records(motorcycle_id);
CREATE INDEX idx_maintenance_records_service_date ON maintenance_records(service_date);
CREATE INDEX idx_rides_user_id ON rides(user_id);
CREATE INDEX idx_rides_start_time ON rides(start_time);
CREATE INDEX idx_documents_motorcycle_id ON documents(motorcycle_id);
CREATE INDEX idx_documents_expiry_date ON documents(expiry_date);
CREATE INDEX idx_notifications_user_id_read ON notifications(user_id, read);
CREATE INDEX idx_user_sessions_session_token ON user_sessions(session_token);
CREATE INDEX idx_user_sessions_expires_at ON user_sessions(expires_at);

-- Geospatial indexes
CREATE INDEX idx_rides_start_location ON rides USING GIST(start_location);
CREATE INDEX idx_events_location ON events USING GIST(location);
CREATE INDEX idx_groups_location ON groups USING GIST(location);

-- Full-text search indexes
CREATE INDEX idx_motorcycles_search ON motorcycles USING GIN(to_tsvector('english', name || ' ' || make || ' ' || model));
CREATE INDEX idx_groups_search ON groups USING GIN(to_tsvector('english', name || ' ' || description));
```

### Caching Strategy

#### Redis Clusters
```
Primary Cache Cluster:
- Session storage
- Rate limiting
- Real-time data (notifications, chat)
- Temporary file uploads

Secondary Cache Cluster:
- Query result caching
- Computed aggregations
- Static content caching
```

## API Architecture

### RESTful API Design

#### Base URL Structure
```
https://api.throttlecove.com/v1/
```

#### Authentication Endpoints
```
POST   /auth/register
POST   /auth/login
POST   /auth/logout
POST   /auth/refresh
POST   /auth/forgot-password
POST   /auth/reset-password
GET    /auth/session
POST   /auth/verify-email
POST   /auth/enable-mfa
POST   /auth/verify-mfa
```

#### User Management
```
GET    /users/profile
PUT    /users/profile
DELETE /users/account
GET    /users/{id}
GET    /users/search
POST   /users/follow
DELETE /users/follow/{id}
GET    /users/followers
GET    /users/following
```

#### Vehicle Management
```
GET    /motorcycles
POST   /motorcycles
GET    /motorcycles/{id}
PUT    /motorcycles/{id}
DELETE /motorcycles/{id}
POST   /motorcycles/{id}/photos
DELETE /motorcycles/{id}/photos/{photoId}
GET    /motorcycles/{id}/value-estimate
GET    /motorcycles/search
```

#### Maintenance Management
```
GET    /motorcycles/{id}/maintenance
POST   /motorcycles/{id}/maintenance
GET    /motorcycles/{id}/maintenance/{recordId}
PUT    /motorcycles/{id}/maintenance/{recordId}
DELETE /motorcycles/{id}/maintenance/{recordId}
GET    /motorcycles/{id}/maintenance/schedule
POST   /motorcycles/{id}/maintenance/schedule
PUT    /motorcycles/{id}/maintenance/schedule/{scheduleId}
DELETE /motorcycles/{id}/maintenance/schedule/{scheduleId}
GET    /motorcycles/{id}/maintenance/due
```

#### Document Management
```
GET    /motorcycles/{id}/documents
POST   /motorcycles/{id}/documents
GET    /motorcycles/{id}/documents/{docId}
PUT    /motorcycles/{id}/documents/{docId}
DELETE /motorcycles/{id}/documents/{docId}
GET    /motorcycles/{id}/documents/expiring
POST   /motorcycles/{id}/documents/{docId}/renew
```

#### Social Features
```
GET    /groups
POST   /groups
GET    /groups/{id}
PUT    /groups/{id}
DELETE /groups/{id}
POST   /groups/{id}/join
DELETE /groups/{id}/leave
GET    /groups/{id}/members
GET    /groups/{id}/events
POST   /groups/{id}/events

GET    /events
GET    /events/{id}
POST   /events/{id}/join
DELETE /events/{id}/leave
GET    /events/nearby
```

#### Ride Tracking
```
GET    /rides
POST   /rides
GET    /rides/{id}
PUT    /rides/{id}
DELETE /rides/{id}
POST   /rides/{id}/start
POST   /rides/{id}/end
GET    /rides/statistics
```

### API Security

#### Rate Limiting
```typescript
// Rate limiting by endpoint type
const rateLimits = {
  auth: '5 requests per minute',
  read: '1000 requests per hour',
  write: '100 requests per hour',
  upload: '10 requests per hour',
  api_key: '10000 requests per hour'
};
```

#### Request Validation
```typescript
// Input validation middleware
const validateRequest = (schema: JSONSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const validation = validate(req.body, schema);
    if (!validation.valid) {
      return res.status(400).json({
        error: 'Validation failed',
        details: validation.errors
      });
    }
    next();
  };
};
```

## Authentication & Authorization

### JWT Implementation

```typescript
interface JWTPayload {
  userId: number;
  username: string;
  role: string;
  permissions: string[];
  sessionId: string;
  iat: number;
  exp: number;
}

// Token generation
const generateTokens = (user: User): TokenPair => {
  const payload: JWTPayload = {
    userId: user.id,
    username: user.username,
    role: user.role,
    permissions: getUserPermissions(user.role),
    sessionId: generateSessionId(),
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + (15 * 60) // 15 minutes
  };

  const accessToken = jwt.sign(payload, process.env.JWT_SECRET!);
  const refreshToken = jwt.sign(
    { sessionId: payload.sessionId },
    process.env.JWT_REFRESH_SECRET!,
    { expiresIn: '7d' }
  );

  return { accessToken, refreshToken };
};
```

### Role-Based Access Control

```typescript
enum Role {
  USER = 'user',
  MODERATOR = 'moderator',
  ADMIN = 'admin',
  SUPER_ADMIN = 'super_admin'
}

enum Permission {
  READ_OWN_DATA = 'read:own',
  WRITE_OWN_DATA = 'write:own',
  READ_PUBLIC_DATA = 'read:public',
  MODERATE_CONTENT = 'moderate:content',
  ADMIN_USERS = 'admin:users',
  ADMIN_SYSTEM = 'admin:system'
}

const rolePermissions = {
  [Role.USER]: [
    Permission.READ_OWN_DATA,
    Permission.WRITE_OWN_DATA,
    Permission.READ_PUBLIC_DATA
  ],
  [Role.MODERATOR]: [
    ...rolePermissions[Role.USER],
    Permission.MODERATE_CONTENT
  ],
  [Role.ADMIN]: [
    ...rolePermissions[Role.MODERATOR],
    Permission.ADMIN_USERS
  ],
  [Role.SUPER_ADMIN]: [
    ...rolePermissions[Role.ADMIN],
    Permission.ADMIN_SYSTEM
  ]
};
```

## Security Implementation

### Security Headers
```typescript
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https:"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "https://api.throttlecove.com"],
      fontSrc: ["'self'", "https:"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"]
    }
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  }
}));
```

### Input Sanitization
```typescript
import DOMPurify from 'isomorphic-dompurify';
import validator from 'validator';

const sanitizeInput = (input: string, type: 'html' | 'text' = 'text'): string => {
  if (type === 'html') {
    return DOMPurify.sanitize(input, {
      ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'br'],
      ALLOWED_ATTR: ['href']
    });
  }
  return validator.escape(input);
};
```

### SQL Injection Prevention
```typescript
// Using parameterized queries with Drizzle ORM
const getUserMotorcycles = async (userId: number) => {
  return await db
    .select()
    .from(motorcycles)
    .where(eq(motorcycles.userId, userId));
};

// Raw query protection (when needed)
const executeRawQuery = async (query: string, params: any[]) => {
  // Validate query structure
  if (query.toLowerCase().includes('drop') || 
      query.toLowerCase().includes('delete') ||
      query.toLowerCase().includes('truncate')) {
    throw new Error('Destructive operations not allowed');
  }
  
  return await db.execute(sql.raw(query, ...params));
};
```

### File Upload Security
```typescript
const uploadConfig = {
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
    files: 5
  },
  fileFilter: (req: Request, file: Express.Multer.File, cb: Function) => {
    const allowedTypes = [
      'image/jpeg',
      'image/png',
      'image/webp',
      'application/pdf'
    ];
    
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type'), false);
    }
  }
};

// Virus scanning
const scanFile = async (filePath: string): Promise<boolean> => {
  // Integrate with ClamAV or similar
  return await virusScanner.scan(filePath);
};
```

## Scalability Strategy

### Horizontal Scaling

#### Load Balancing
```nginx
upstream api_servers {
    least_conn;
    server api1.throttlecove.com:3000 weight=3;
    server api2.throttlecove.com:3000 weight=3;
    server api3.throttlecove.com:3000 weight=2;
    server api4.throttlecove.com:3000 weight=2 backup;
}

server {
    listen 443 ssl http2;
    server_name api.throttlecove.com;
    
    location / {
        proxy_pass http://api_servers;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

#### Auto-scaling Configuration
```yaml
# Kubernetes HPA
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: throttlecove-api
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: throttlecove-api
  minReplicas: 3
  maxReplicas: 50
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
  - type: Resource
    resource:
      name: memory
      target:
        type: Utilization
        averageUtilization: 80
```

### Database Scaling

#### Read Replicas
```typescript
// Database connection pool
const dbConfig = {
  primary: {
    host: process.env.DB_PRIMARY_HOST,
    port: 5432,
    database: 'throttlecove',
    pool: { min: 5, max: 20 }
  },
  replicas: [
    {
      host: process.env.DB_REPLICA1_HOST,
      port: 5432,
      database: 'throttlecove',
      pool: { min: 2, max: 10 }
    },
    {
      host: process.env.DB_REPLICA2_HOST,
      port: 5432,
      database: 'throttlecove',
      pool: { min: 2, max: 10 }
    }
  ]
};

// Query routing
const executeQuery = async (query: SQLQuery, readOnly: boolean = false) => {
  const connection = readOnly ? getReadReplica() : getPrimaryConnection();
  return await connection.execute(query);
};
```

#### Connection Pooling
```typescript
import { Pool } from 'pg';

const createConnectionPool = (config: DatabaseConfig) => {
  return new Pool({
    ...config,
    max: 20, // Maximum connections
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
    application_name: 'throttlecove-api'
  });
};
```

### Caching Strategy

#### Multi-layer Caching
```typescript
class CacheManager {
  private l1Cache: NodeCache; // In-memory
  private l2Cache: Redis; // Redis
  private l3Cache: CloudFront; // CDN

  async get(key: string): Promise<any> {
    // L1: Memory cache
    let value = this.l1Cache.get(key);
    if (value) return value;

    // L2: Redis cache
    value = await this.l2Cache.get(key);
    if (value) {
      this.l1Cache.set(key, value, 300); // 5 min TTL
      return JSON.parse(value);
    }

    // L3: Database + cache result
    value = await this.fetchFromDatabase(key);
    if (value) {
      this.l1Cache.set(key, value, 300);
      this.l2Cache.setex(key, 3600, JSON.stringify(value)); // 1 hour TTL
    }

    return value;
  }

  async invalidate(pattern: string): Promise<void> {
    this.l1Cache.flushAll();
    const keys = await this.l2Cache.keys(pattern);
    if (keys.length > 0) {
      await this.l2Cache.del(...keys);
    }
  }
}
```

## Data Flow & Business Logic

### Service Layer Architecture

```typescript
// Base service class
abstract class BaseService {
  protected db: Database;
  protected cache: CacheManager;
  protected eventBus: EventBus;

  constructor(db: Database, cache: CacheManager, eventBus: EventBus) {
    this.db = db;
    this.cache = cache;
    this.eventBus = eventBus;
  }

  protected async withTransaction<T>(
    callback: (tx: Transaction) => Promise<T>
  ): Promise<T> {
    return await this.db.transaction(callback);
  }

  protected emitEvent(event: string, data: any): void {
    this.eventBus.emit(event, data);
  }
}

// Vehicle service implementation
class VehicleService extends BaseService {
  async createMotorcycle(userId: number, data: CreateMotorcycleData): Promise<Motorcycle> {
    return await this.withTransaction(async (tx) => {
      // Validate user ownership limits
      const existingCount = await this.getUserMotorcycleCount(userId, tx);
      if (existingCount >= 10) {
        throw new Error('Maximum motorcycle limit reached');
      }

      // Create motorcycle
      const motorcycle = await tx
        .insert(motorcycles)
        .values({ ...data, userId })
        .returning();

      // Create default maintenance schedule
      await this.createDefaultMaintenanceSchedule(motorcycle.id, tx);

      // Emit event for analytics
      this.emitEvent('motorcycle.created', {
        userId,
        motorcycleId: motorcycle.id,
        make: data.make,
        model: data.model
      });

      // Invalidate user's motorcycle cache
      await this.cache.invalidate(`motorcycles:user:${userId}`);

      return motorcycle;
    });
  }

  async updateMotorcycle(id: number, userId: number, data: UpdateMotorcycleData): Promise<Motorcycle> {
    return await this.withTransaction(async (tx) => {
      // Verify ownership
      const existing = await this.getMotorcycleById(id, userId, tx);
      if (!existing) {
        throw new Error('Motorcycle not found or access denied');
      }

      // Update motorcycle
      const updated = await tx
        .update(motorcycles)
        .set({ ...data, updatedAt: new Date() })
        .where(and(eq(motorcycles.id, id), eq(motorcycles.userId, userId)))
        .returning();

      // Emit update event
      this.emitEvent('motorcycle.updated', {
        userId,
        motorcycleId: id,
        changes: data
      });

      // Invalidate caches
      await this.cache.invalidate(`motorcycle:${id}`);
      await this.cache.invalidate(`motorcycles:user:${userId}`);

      return updated;
    });
  }
}
```

### Event-Driven Architecture

```typescript
interface DomainEvent {
  id: string;
  type: string;
  aggregateId: string;
  payload: any;
  timestamp: Date;
  version: number;
}

class EventBus {
  private handlers: Map<string, Array<(event: DomainEvent) => void>> = new Map();

  subscribe(eventType: string, handler: (event: DomainEvent) => void): void {
    if (!this.handlers.has(eventType)) {
      this.handlers.set(eventType, []);
    }
    this.handlers.get(eventType)!.push(handler);
  }

  emit(eventType: string, payload: any): void {
    const event: DomainEvent = {
      id: generateUUID(),
      type: eventType,
      aggregateId: payload.id || payload.userId,
      payload,
      timestamp: new Date(),
      version: 1
    };

    const handlers = this.handlers.get(eventType) || [];
    handlers.forEach(handler => {
      try {
        handler(event);
      } catch (error) {
        console.error(`Error handling event ${eventType}:`, error);
      }
    });

    // Store event for replay/audit
    this.storeEvent(event);
  }

  private async storeEvent(event: DomainEvent): Promise<void> {
    await this.db.insert(events).values(event);
  }
}

// Event handlers
eventBus.subscribe('motorcycle.created', async (event) => {
  // Send welcome email
  await emailService.sendWelcomeEmail(event.payload.userId);
  
  // Update user statistics
  await analyticsService.incrementUserMetric(event.payload.userId, 'motorcycles_added');
  
  // Create default documents
  await documentService.createDefaultDocuments(event.payload.motorcycleId);
});

eventBus.subscribe('maintenance.due', async (event) => {
  // Send maintenance reminder
  await notificationService.sendMaintenanceReminder(event.payload);
  
  // Update maintenance statistics
  await analyticsService.recordMaintenanceEvent(event.payload);
});
```

## File Storage & Media Management

### Cloud Storage Strategy

```typescript
interface StorageProvider {
  upload(file: Buffer, key: string, metadata: FileMetadata): Promise<string>;
  download(key: string): Promise<Buffer>;
  delete(key: string): Promise<void>;
  generateSignedUrl(key: string, expiresIn: number): Promise<string>;
}

class S3StorageProvider implements StorageProvider {
  private s3: AWS.S3;
  private bucket: string;

  constructor() {
    this.s3 = new AWS.S3({
      region: process.env.AWS_REGION,
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    });
    this.bucket = process.env.S3_BUCKET!;
  }

  async upload(file: Buffer, key: string, metadata: FileMetadata): Promise<string> {
    const result = await this.s3.upload({
      Bucket: this.bucket,
      Key: key,
      Body: file,
      ContentType: metadata.mimeType,
      Metadata: {
        originalName: metadata.originalName,
        uploadedBy: metadata.userId.toString(),
        uploadedAt: new Date().toISOString()
      },
      ServerSideEncryption: 'AES256'
    }).promise();

    return result.Location;
  }

  async generateSignedUrl(key: string, expiresIn: number = 3600): Promise<string> {
    return this.s3.getSignedUrl('getObject', {
      Bucket: this.bucket,
      Key: key,
      Expires: expiresIn
    });
  }
}

// Image processing pipeline
class ImageProcessor {
  async processImage(buffer: Buffer, options: ImageProcessingOptions): Promise<ProcessedImage[]> {
    const variants: ProcessedImage[] = [];

    // Original
    variants.push({
      size: 'original',
      buffer: buffer,
      width: options.originalWidth,
      height: options.originalHeight
    });

    // Thumbnail
    variants.push({
      size: 'thumbnail',
      buffer: await sharp(buffer)
        .resize(150, 150, { fit: 'cover' })
        .jpeg({ quality: 80 })
        .toBuffer(),
      width: 150,
      height: 150
    });

    // Medium
    variants.push({
      size: 'medium',
      buffer: await sharp(buffer)
        .resize(800, 600, { fit: 'inside', withoutEnlargement: true })
        .jpeg({ quality: 85 })
        .toBuffer(),
      width: 800,
      height: 600
    });

    // Large
    variants.push({
      size: 'large',
      buffer: await sharp(buffer)
        .resize(1200, 900, { fit: 'inside', withoutEnlargement: true })
        .jpeg({ quality: 90 })
        .toBuffer(),
      width: 1200,
      height: 900
    });

    return variants;
  }
}
```

### Document Processing

```typescript
class DocumentProcessor {
  private ocrService: OCRService;
  private virusScanner: VirusScanner;

  async processDocument(file: Express.Multer.File, motorcycleId: number): Promise<Document> {
    // Virus scan
    const isSafe = await this.virusScanner.scan(file.buffer);
    if (!isSafe) {
      throw new Error('File failed security scan');
    }

    // Extract text if PDF or image
    let extractedText = '';
    if (this.isImageOrPDF(file.mimetype)) {
      extractedText = await this.ocrService.extractText(file.buffer);
    }

    // Parse document metadata
    const metadata = await this.parseDocumentMetadata(extractedText, file.originalname);

    // Upload to storage
    const fileKey = `documents/${motorcycleId}/${generateUUID()}.${this.getFileExtension(file.originalname)}`;
    const fileUrl = await this.storageProvider.upload(file.buffer, fileKey, {
      mimeType: file.mimetype,
      originalName: file.originalname,
      motorcycleId
    });

    // Save to database
    const document = await this.db.insert(documents).values({
      motorcycleId,
      documentType: metadata.type,
      title: metadata.title || file.originalname,
      fileUrl,
      fileSize: file.size,
      mimeType: file.mimetype,
      issueDate: metadata.issueDate,
      expiryDate: metadata.expiryDate,
      documentNumber: metadata.documentNumber,
      extractedData: { text: extractedText, metadata }
    }).returning();

    // Schedule expiry reminder
    if (metadata.expiryDate) {
      await this.scheduleExpiryReminder(document.id, metadata.expiryDate);
    }

    return document;
  }

  private async parseDocumentMetadata(text: string, filename: string): Promise<DocumentMetadata> {
    // Use AI/ML to extract structured data from OCR text
    const patterns = {
      registration: /registration|license|plate/i,
      insurance: /insurance|policy/i,
      service: /service|maintenance|repair/i,
      
      // Date patterns
      expiryDate: /(?:expir|valid until|due)[:\s]*(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})/i,
      issueDate: /(?:issue|date)[:\s]*(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})/i,
      
      // Number patterns
      policyNumber: /(?:policy|ref|number)[:\s]*([A-Z0-9\-]+)/i,
      licenseNumber: /(?:license|plate)[:\s]*([A-Z0-9\-]+)/i
    };

    const metadata: DocumentMetadata = {
      type: this.detectDocumentType(text, filename),
      title: filename,
      issueDate: this.extractDate(text, patterns.issueDate),
      expiryDate: this.extractDate(text, patterns.expiryDate),
      documentNumber: this.extractPattern(text, patterns.policyNumber) || 
                     this.extractPattern(text, patterns.licenseNumber)
    };

    return metadata;
  }
}
```

## Monitoring & Logging

### Application Monitoring

```typescript
// Metrics collection
class MetricsCollector {
  private prometheus: PrometheusRegistry;
  private httpRequestDuration: Histogram;
  private httpRequestTotal: Counter;
  private activeConnections: Gauge;
  private errorRate: Counter;

  constructor() {
    this.prometheus = new PrometheusRegistry();
    
    this.httpRequestDuration = new Histogram({
      name: 'http_request_duration_seconds',
      help: 'Duration of HTTP requests in seconds',
      labelNames: ['method', 'route', 'status_code'],
      buckets: [0.1, 0.5, 1, 2, 5, 10]
    });

    this.httpRequestTotal = new Counter({
      name: 'http_requests_total',
      help: 'Total number of HTTP requests',
      labelNames: ['method', 'route', 'status_code']
    });

    this.activeConnections = new Gauge({
      name: 'active_connections',
      help: 'Number of active connections'
    });

    this.errorRate = new Counter({
      name: 'errors_total',
      help: 'Total number of errors',
      labelNames: ['type', 'service']
    });

    this.prometheus.registerMetric(this.httpRequestDuration);
    this.prometheus.registerMetric(this.httpRequestTotal);
    this.prometheus.registerMetric(this.activeConnections);
    this.prometheus.registerMetric(this.errorRate);
  }

  recordHttpRequest(method: string, route: string, statusCode: number, duration: number): void {
    this.httpRequestDuration.observe({ method, route, status_code: statusCode.toString() }, duration);
    this.httpRequestTotal.inc({ method, route, status_code: statusCode.toString() });
  }

  recordError(type: string, service: string): void {
    this.errorRate.inc({ type, service });
  }
}

// Middleware for request tracking
const metricsMiddleware = (metrics: MetricsCollector) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const startTime = Date.now();
    
    res.on('finish', () => {
      const duration = (Date.now() - startTime) / 1000;
      metrics.recordHttpRequest(
        req.method,
        req.route?.path || req.path,
        res.statusCode,
        duration
      );
    });

    next();
  };
};
```

### Structured Logging

```typescript
import winston from 'winston';

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: {
    service: 'throttlecove-api',
    version: process.env.APP_VERSION
  },
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
    })
  ]
});

// Request logging middleware
const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  const requestId = generateUUID();
  req.requestId = requestId;

  logger.info('Request started', {
    requestId,
    method: req.method,
    url: req.url,
    userAgent: req.get('User-Agent'),
    ip: req.ip,
    userId: req.user?.id
  });

  const originalJson = res.json;
  res.json = function(body) {
    logger.info('Request completed', {
      requestId,
      statusCode: res.statusCode,
      responseTime: Date.now() - req.startTime
    });
    return originalJson.call(this, body);
  };

  next();
};
```

### Health Checks

```typescript
interface HealthCheck {
  name: string;
  check(): Promise<HealthStatus>;
}

interface HealthStatus {
  status: 'healthy' | 'unhealthy' | 'degraded';
  message?: string;
  details?: any;
}

class DatabaseHealthCheck implements HealthCheck {
  name = 'database';

  async check(): Promise<HealthStatus> {
    try {
      await this.db.raw('SELECT 1');
      return { status: 'healthy' };
    } catch (error) {
      return {
        status: 'unhealthy',
        message: 'Database connection failed',
        details: error.message
      };
    }
  }
}

class RedisHealthCheck implements HealthCheck {
  name = 'redis';

  async check(): Promise<HealthStatus> {
    try {
      await this.redis.ping();
      return { status: 'healthy' };
    } catch (error) {
      return {
        status: 'unhealthy',
        message: 'Redis connection failed',
        details: error.message
      };
    }
  }
}

class HealthService {
  private checks: HealthCheck[] = [];

  addCheck(check: HealthCheck): void {
    this.checks.push(check);
  }

  async runHealthChecks(): Promise<{ status: string; checks: Record<string, HealthStatus> }> {
    const results: Record<string, HealthStatus> = {};
    let overallStatus = 'healthy';

    for (const check of this.checks) {
      try {
        results[check.name] = await check.check();
        if (results[check.name].status === 'unhealthy') {
          overallStatus = 'unhealthy';
        } else if (results[check.name].status === 'degraded' && overallStatus === 'healthy') {
          overallStatus = 'degraded';
        }
      } catch (error) {
        results[check.name] = {
          status: 'unhealthy',
          message: 'Health check failed',
          details: error.message
        };
        overallStatus = 'unhealthy';
      }
    }

    return { status: overallStatus, checks: results };
  }
}

// Health check endpoint
app.get('/health', async (req, res) => {
  const health = await healthService.runHealthChecks();
  const statusCode = health.status === 'healthy' ? 200 : 
                    health.status === 'degraded' ? 200 : 503;
  res.status(statusCode).json(health);
});
```

## Deployment Architecture

### Container Strategy

```dockerfile
# Production Dockerfile
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

FROM node:18-alpine AS runtime

RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY --chown=nextjs:nodejs . .

USER nextjs

EXPOSE 3000

ENV NODE_ENV=production
ENV PORT=3000

CMD ["npm", "start"]
```

### Kubernetes Deployment

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: throttlecove-api
  labels:
    app: throttlecove-api
spec:
  replicas: 3
  selector:
    matchLabels:
      app: throttlecove-api
  template:
    metadata:
      labels:
        app: throttlecove-api
    spec:
      containers:
      - name: api
        image: throttlecove/api:latest
        ports:
        - containerPort: 3000
        env:
        - name: NODE_ENV
          value: "production"
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: db-secret
              key: url
        - name: REDIS_URL
          valueFrom:
            secretKeyRef:
              name: redis-secret
              key: url
        - name: JWT_SECRET
          valueFrom:
            secretKeyRef:
              name: jwt-secret
              key: secret
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"
            cpu: "500m"
        livenessProbe:
          httpGet:
            path: /health
            port: 3000
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /health
            port: 3000
          initialDelaySeconds: 5
          periodSeconds: 5
      imagePullSecrets:
      - name: registry-secret
```

### CI/CD Pipeline

```yaml
# GitHub Actions workflow
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    - uses: actions/setup-node@v3
      with:
        node-version: 18
        cache: 'npm'
    - run: npm ci
    - run: npm run test
    - run: npm run lint
    - run: npm run type-check

  security:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    - name: Run security audit
      run: npm audit --audit-level high
    - name: Run SAST scan
      uses: github/super-linter@v4
      env:
        DEFAULT_BRANCH: main
        GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}

  build:
    needs: [test, security]
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    - name: Build Docker image
      run: |
        docker build -t throttlecove/api:${{ github.sha }} .
        docker tag throttlecove/api:${{ github.sha }} throttlecove/api:latest
    - name: Push to registry
      run: |
        echo ${{ secrets.DOCKER_PASSWORD }} | docker login -u ${{ secrets.DOCKER_USERNAME }} --password-stdin
        docker push throttlecove/api:${{ github.sha }}
        docker push throttlecove/api:latest

  deploy:
    needs: build
    runs-on: ubuntu-latest
    steps:
    - name: Deploy to Kubernetes
      run: |
        kubectl set image deployment/throttlecove-api api=throttlecove/api:${{ github.sha }}
        kubectl rollout status deployment/throttlecove-api
```

## Performance Optimization

### Database Optimization

```sql
-- Query optimization examples

-- Efficient user motorcycle lookup with pagination
CREATE INDEX idx_motorcycles_user_created ON motorcycles(user_id, created_at DESC);

-- Maintenance due query optimization
CREATE INDEX idx_maintenance_due ON maintenance_schedules(
  motorcycle_id, 
  (CASE WHEN interval_type = 'mileage' THEN mileage_interval ELSE NULL END),
  (CASE WHEN interval_type = 'time' THEN time_interval ELSE NULL END)
);

-- Geospatial queries for nearby events
CREATE INDEX idx_events_location_time ON events USING GIST(location, daterange(start_time, end_time));

-- Full-text search optimization
CREATE INDEX idx_motorcycles_fts ON motorcycles USING GIN(
  to_tsvector('english', 
    coalesce(name, '') || ' ' || 
    coalesce(make, '') || ' ' || 
    coalesce(model, '')
  )
);
```

### Connection Pooling

```typescript
class DatabasePool {
  private pools: Map<string, pg.Pool> = new Map();

  getPool(type: 'primary' | 'replica' = 'primary'): pg.Pool {
    if (!this.pools.has(type)) {
      const config = type === 'primary' ? primaryConfig : replicaConfig;
      this.pools.set(type, new pg.Pool({
        ...config,
        max: 20,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 2000,
        statement_timeout: 30000,
        query_timeout: 30000
      }));
    }
    return this.pools.get(type)!;
  }

  async query(text: string, params?: any[], readOnly: boolean = false): Promise<any> {
    const pool = this.getPool(readOnly ? 'replica' : 'primary');
    const client = await pool.connect();
    
    try {
      const start = Date.now();
      const result = await client.query(text, params);
      const duration = Date.now() - start;
      
      // Log slow queries
      if (duration > 1000) {
        logger.warn('Slow query detected', {
          query: text,
          duration,
          params: params?.length
        });
      }
      
      return result;
    } finally {
      client.release();
    }
  }
}
```

### Background Jobs

```typescript
import Bull from 'bull';

// Job queue setup
const jobQueue = new Bull('background jobs', {
  redis: {
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT!),
    password: process.env.REDIS_PASSWORD
  },
  defaultJobOptions: {
    removeOnComplete: 100,
    removeOnFail: 50,
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 2000
    }
  }
});

// Job processors
jobQueue.process('send-email', 5, async (job) => {
  const { to, subject, template, data } = job.data;
  await emailService.send(to, subject, template, data);
});

jobQueue.process('process-image', 2, async (job) => {
  const { imageUrl, motorcycleId } = job.data;
  await imageProcessor.processAndStore(imageUrl, motorcycleId);
});

jobQueue.process('maintenance-reminder', 1, async (job) => {
  const { userId, motorcycleId, maintenanceType } = job.data;
  await notificationService.sendMaintenanceReminder(userId, motorcycleId, maintenanceType);
});

// Cron jobs
jobQueue.add('daily-maintenance-check', {}, {
  repeat: { cron: '0 9 * * *' } // 9 AM daily
});

jobQueue.add('weekly-analytics', {}, {
  repeat: { cron: '0 0 * * 0' } // Sunday midnight
});
```

This comprehensive backend architecture provides a solid foundation for ThrottleCove's growth, ensuring security, scalability, and maintainability while supporting all the platform's features and future expansion.