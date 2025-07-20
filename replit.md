# ThrottleCove Development Guide

## Overview

ThrottleCove is a modern vehicle management web application designed to be a comprehensive digital garage and motorcycle community platform. The application follows a full-stack architecture with a React frontend and Express backend, utilizing PostgreSQL for data persistence.

## Recent Changes

### Backend Database Migration Completed (July 2025)
- Successfully migrated from in-memory storage to PostgreSQL database
- Created comprehensive DatabaseService.ts implementing all CRUD operations for 7 core tables
- Fixed SSL connection issues and established stable database connectivity
- All API endpoints now persist data to PostgreSQL instead of temporary memory
- Implemented transaction support, error handling, and validation in database layer
- Created migration scripts for smooth transition from development to production
- Database health checks and connection monitoring now operational
- Core tables operational: users, motorcycles, maintenance_records, maintenance_schedules, rides, documents, rider_relationships

### Complete Project Documentation Creation (July 2025)
- Created comprehensive 350+ line project documentation (`COMPLETE_PROJECT_DOCUMENTATION.md`)
- Documented entire technology stack with 20+ core dependencies and their specific versions
- Detailed complete database schema covering all 15+ tables with relationships and indexing
- Provided step-by-step setup, development, and deployment instructions for multiple platforms
- Documented 25+ API endpoints with request/response specifications
- Created frontend component library documentation with 50+ reusable components
- Outlined 5-phase future development roadmap with advanced features
- Included security implementation guide covering authentication, API protection, and data security
- Provided comprehensive troubleshooting guide for common development and production issues
- Created performance optimization and scalability planning documentation
- Documented monitoring, maintenance, and deployment strategies for production environments

### Scalable Backend Architecture Analysis (July 2025)
- Completed comprehensive codebase analysis covering all 15+ database tables and current architecture
- Created detailed scalable backend architecture documentation (`SCALABLE_BACKEND_ARCHITECTURE.md`)
- Recommended microservices architecture with 7 core services for optimal scaling
- Designed database optimization strategy with indexing, partitioning, and read replicas
- Planned Redis caching layer for sessions, rate limiting, and real-time data
- Outlined WebSocket scaling strategy using Redis Pub/Sub for real-time features
- Documented security hardening with JWT, rate limiting, and row-level security
- Created Kubernetes deployment strategy with auto-scaling configuration
- Designed monitoring stack with Prometheus, Grafana, and custom metrics
- Provided 12-week implementation roadmap with three distinct phases
- Estimated infrastructure costs and team requirements for scaling to 10,000+ users

### Squad Page Implementation (July 2025)
- Built comprehensive Squad page with cycling group features
- Added 5 new database tables: event_rsvps, group_posts, group_messages, ride_stats, user_profiles
- Implemented 6-tab interface: Feed, Events, Riders, Stats, Routes, Chat
- Created group ride planning with RSVP functionality and meeting point details
- Built real-time communication system with group chat and emergency alerts
- Added location sharing and safety features including crash detection
- Implemented ride stats and leaderboards with monthly/weekly tracking
- Created event scheduling with pace, terrain, and distance filtering
- Built personalization features with rider profiles and riding styles
- Optimized for minimum user input with intuitive UI and quick actions
- Added route sharing capabilities with GPX file support (UI ready)
- Integrated social features with posts, photos, tips, and polls

### Community Page Replacement (July 2025)
- Deleted Community page completely
- Created blank "Squad" page as replacement
- Updated routing in App.tsx to point /community route to new Squad page
- Updated navigation button text from "Community" to "Squad"
- Removed Community.tsx file from codebase

### Production Deployment Fixes (July 2025)
- Fixed Vite development server running in production causing deployment failures
- Implemented proper environment detection to serve static files in production mode
- Created fallback mechanism when static build files are not available
- Updated server configuration to handle both development and production modes correctly
- Resolved issue where application was loading React development files in production
- Added proper error handling and logging for production static file serving

### Dynamic Button Colors & SNS-Inspired Profile Layout (July 2025)
- Implemented dynamic color system for floating buttons (black over content, red over footer)
- Redesigned profile card with SNS-inspired layout featuring centered profile picture
- Added automatic scroll detection for button color changes
- Enhanced user hierarchy display with prominent name, rank badge, and stats grid
- Improved visual feedback with smooth color transitions and better contrast

### Complete Project Documentation (July 2025)
- Created comprehensive project recreation guide (`COMPLETE_PROJECT_DOCUMENTATION.md`)
- Documented entire system architecture and technology stack
- Provided step-by-step setup and deployment instructions
- Detailed database schema with all table structures and relationships
- Complete backend implementation guide with security features
- Frontend implementation guide with React components and hooks
- Authentication system documentation with session management
- Comprehensive API documentation with examples
- Security implementation guide covering all protection layers
- File structure documentation showing project organization
- Configuration files with complete setup instructions
- Deployment guide for multiple platforms (Replit, Vercel, Railway)
- Testing strategies and development workflow documentation
- Troubleshooting guide with common issues and solutions

### Backend Architecture Documentation (January 2025)
- Created comprehensive backend architecture specification (`BACKEND_ARCHITECTURE.md`)
- Designed microservices architecture for scalability
- Specified security implementations including JWT, RBAC, and input sanitization
- Detailed database schema with proper indexing and relationships
- Planned horizontal scaling with load balancing and auto-scaling
- Documented caching strategy with multi-layer approach
- Specified monitoring, logging, and health check systems
- Created deployment strategy with Kubernetes and CI/CD pipelines

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **Styling**: Tailwind CSS with custom component library based on shadcn/ui
- **State Management**: React hooks with Zustand for auth state
- **Data Fetching**: TanStack Query (React Query) for server state management
- **Routing**: Wouter for lightweight client-side routing
- **Animations**: Framer Motion for smooth UI transitions

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **Session Management**: Express sessions with in-memory store (development)
- **Authentication**: Passport.js with local strategy
- **API Design**: RESTful endpoints under `/api` prefix

### Database Layer
- **ORM**: Drizzle ORM for type-safe database operations
- **Database**: PostgreSQL (configured for Neon serverless)
- **Migrations**: Drizzle Kit for schema management
- **Schema**: Centralized in `shared/schema.ts` for type sharing

## Key Components

### Authentication System
- Session-based authentication using Passport.js
- User registration and login with username/password
- Protected routes with authentication middleware
- Shared auth state between client and server

### Vehicle Management
- Digital garage for storing multiple motorcycles per user
- Vehicle information including make, model, year, mileage
- Photo upload capabilities for vehicle images
- Status tracking and tagging system

### Maintenance Tracking
- Maintenance records with service type, date, cost tracking
- Maintenance scheduling with due date reminders
- Service history per vehicle
- Parts recommendations and marketplace integration

### Community Features
- User profiles with ranking system based on miles ridden
- Ride sharing and group ride organization
- Document storage for vehicle paperwork
- Social features for connecting with other riders

### UI Component System
- Custom component library built on Radix UI primitives
- Consistent design system with theme support
- Responsive design with mobile-first approach
- Accessible components following WAI-ARIA guidelines

## Data Flow

### Client-Server Communication
1. Frontend makes API requests to Express server endpoints
2. Server validates requests and processes business logic
3. Database operations performed through Drizzle ORM
4. Responses sent back as JSON with proper error handling
5. Client updates UI state using React Query cache

### Authentication Flow
1. User submits login credentials to `/api/auth/login`
2. Passport.js validates credentials against database
3. Session created and stored server-side
4. Client receives user data and updates auth state
5. Subsequent requests include session cookie for authentication

### Data Persistence
- All user data stored in PostgreSQL database
- Schema defined with Drizzle ORM for type safety
- Foreign key relationships maintain data integrity
- Migrations handle schema evolution

## External Dependencies

### Core Framework Dependencies
- React ecosystem (React, React DOM, React Hook Form)
- Express.js with middleware (cors, sessions, passport)
- Vite with TypeScript and development plugins

### UI and Styling
- Tailwind CSS for utility-first styling
- Radix UI primitives for accessible components
- Framer Motion for animations
- Lucide React for consistent iconography

### Database and State
- Drizzle ORM with PostgreSQL adapter
- Neon serverless database connection
- TanStack Query for client state management
- Zustand for lightweight state management

### Development Tools
- TypeScript for type safety across the stack
- ESLint and Prettier for code quality
- PostCSS for CSS processing
- Replit-specific development plugins

## Deployment Strategy

### Development Environment
- Vite dev server for hot module replacement
- Express server with middleware mode integration
- In-memory session store for development
- Environment variables for database connection

### Production Build
- Vite builds frontend to `dist/public`
- ESBuild bundles server code to `dist/index.js`
- Static file serving from Express server
- Database migrations applied via Drizzle Kit

### Environment Configuration
- `NODE_ENV` determines development vs production mode
- `DATABASE_URL` for PostgreSQL connection
- `SESSION_SECRET` for session encryption
- Replit-specific environment detection

### Deployment Architecture
- Single server deployment serving both frontend and API
- PostgreSQL database hosted on Neon
- Session storage can be upgraded to Redis for production
- Static assets served directly from Express