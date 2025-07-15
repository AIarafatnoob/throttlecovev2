# ThrottleCove Development Guide

## Overview

ThrottleCove is a modern vehicle management web application designed to be a comprehensive digital garage and motorcycle community platform. The application follows a full-stack architecture with a React frontend and Express backend, utilizing PostgreSQL for data persistence.

## Recent Changes

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