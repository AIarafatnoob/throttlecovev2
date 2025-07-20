import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from '../shared/schema.js';
import { config } from './config.js';
import { logger } from './utils/logger.js';

// Create the database connection
const sql = postgres(config.DATABASE_URL, { 
  ssl: config.NODE_ENV === 'production' ? 'require' : 'prefer',
  max: 10,
  idle_timeout: 20,
  connect_timeout: 60,
});
export const db = drizzle(sql, { schema });

// Health check function
export async function checkDatabaseHealth(): Promise<boolean> {
  try {
    await sql`SELECT 1`;
    logger.info('Database health check passed');
    return true;
  } catch (error) {
    logger.error('Database health check failed:', error);
    return false;
  }
}

// Connection pool stats (for monitoring)
export function getDatabaseStats() {
  return {
    connectionString: config.DATABASE_URL.replace(/:[^:@]*@/, ':***@'), // Hide password
    ssl: config.NODE_ENV === 'production',
    schema: Object.keys(schema).length,
  };
}

// Database initialization
export async function initializeDatabase() {
  try {
    logger.info('Initializing database connection...');
    
    // Test the connection
    const isHealthy = await checkDatabaseHealth();
    if (!isHealthy) {
      throw new Error('Database connection failed');
    }
    
    logger.info('Database initialized successfully');
    return db;
  } catch (error) {
    logger.error('Failed to initialize database:', error);
    throw error;
  }
}

export type Database = typeof db;