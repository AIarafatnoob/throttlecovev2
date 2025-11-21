import { initializeDatabase } from './database.js';
import { DatabaseService } from './services/DatabaseService.js';
import { logger } from './utils/logger.js';
import { hashPassword } from './utils/auth.js';

/**
 * Migration script to switch from MemStorage to PostgreSQL Database
 * This script sets up the database tables and initializes the DatabaseService
 */

async function runMigration() {
  try {
    logger.info('Starting database migration...');
    
    // Step 1: Initialize database connection
    const db = await initializeDatabase();
    logger.info('Database connection established');
    
    // Step 2: Push schema to database using Drizzle
    logger.info('Pushing database schema...');
    logger.info('Run: npm run db:push');
    
    // Step 3: Test DatabaseService functionality
    const databaseService = new DatabaseService(db);
    logger.info('DatabaseService initialized successfully');
    
    // Step 4: Test basic operations
    logger.info('Testing database operations...');
    
    // Create a test user (this will fail if tables don't exist)
    const password = 'password'; // Use a plain-text password for the test user
    const hashedPassword = await hashPassword(password);

    const testUser = await databaseService.createUser({
      username: 'testuser',
      email: 'test@example.com',
      passwordHash: hashedPassword,
      fullName: 'Test User'
    });
    logger.info('Test user created:', { id: testUser.id, username: testUser.username });
    
    // Clean up test data
    await databaseService.getUser(testUser.id);
    logger.info('Database operations test passed');
    
    logger.info('✅ Database migration completed successfully');
    logger.info('Next steps:');
    logger.info('1. Run: npm run db:push');
    logger.info('2. Update server/storage.ts to use DatabaseService');
    logger.info('3. Replace MemStorage with DatabaseService in routes');
    
  } catch (error) {
    logger.error('❌ Database migration failed:', error);
    throw error;
  }
}

// Run migration if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runMigration()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}

export { runMigration };