import { eq, and } from 'drizzle-orm';
import { Request } from 'express';
import { BaseService } from './BaseService.js';
import { users } from '../../shared/schema.js';
import type { LoginData, RegisterData, User } from '../../shared/schema.js';
import {
  hashPassword,
  verifyPassword,
  generateTokens,
  checkAccountLock,
  handleFailedLogin,
  handleSuccessfulLogin,
  logout,
  TokenPair,
} from '../utils/auth.js';
import { logger, securityLogger } from '../utils/logger.js';

export class AuthService extends BaseService {
  // Register a new user
  async register(userData: RegisterData): Promise<{ user: Omit<User, 'passwordHash'>; tokens: TokenPair }> {
    return this.handleErrors('User registration', async () => {
      // Check if user already exists
      const existingUser = await this.db
        .select()
        .from(users)
        .where(
          and(
            eq(users.username, userData.username),
            eq(users.email, userData.email)
          )
        )
        .limit(1);

      if (existingUser.length > 0) {
        if (existingUser[0].username === userData.username) {
          throw new Error('Username already exists');
        }
        if (existingUser[0].email === userData.email) {
          throw new Error('Email already exists');
        }
      }

      // Hash password
      const passwordHash = await hashPassword(userData.password);

      // Create user
      const newUser = await this.db
        .insert(users)
        .values({
          username: userData.username,
          email: userData.email,
          passwordHash,
          fullName: userData.fullName,
          emailVerified: false,
          role: 'user',
        })
        .returning();

      if (!newUser.length) {
        throw new Error('Failed to create user');
      }

      const user = newUser[0];

      securityLogger.info('User registered', {
        userId: user.id,
        username: user.username,
        email: user.email,
      });

      // Generate tokens (we'll need to pass a mock request for this)
      const mockReq = { ip: '127.0.0.1', get: () => 'Registration' } as Request;
      const tokens = await generateTokens(user, mockReq);

      // Remove password hash from response
      const { passwordHash: _, ...userWithoutPassword } = user;

      return {
        user: userWithoutPassword,
        tokens,
      };
    });
  }

  // Login user
  async login(loginData: LoginData, req: Request): Promise<{ user: Omit<User, 'passwordHash'>; tokens: TokenPair }> {
    return this.handleErrors('User login', async () => {
      // Find user by username or email
      const user = await this.db
        .select()
        .from(users)
        .where(eq(users.username, loginData.username))
        .limit(1);

      if (!user.length) {
        // Check by email as well
        const userByEmail = await this.db
          .select()
          .from(users)
          .where(eq(users.email, loginData.username))
          .limit(1);

        if (!userByEmail.length) {
          securityLogger.warn('Login attempt with invalid username/email', {
            username: loginData.username,
            ip: req.ip,
            userAgent: req.get('User-Agent'),
          });
          throw new Error('Invalid credentials');
        }

        return this.authenticateUser(userByEmail[0], loginData.password, req);
      }

      return this.authenticateUser(user[0], loginData.password, req);
    });
  }

  // Authenticate user with password
  private async authenticateUser(
    user: User,
    password: string,
    req: Request
  ): Promise<{ user: Omit<User, 'passwordHash'>; tokens: TokenPair }> {
    // Check if account is locked
    const isLocked = await checkAccountLock(user.id);
    if (isLocked) {
      securityLogger.warn('Login attempt on locked account', {
        userId: user.id,
        username: user.username,
        ip: req.ip,
      });
      throw new Error('Account is temporarily locked due to too many failed login attempts');
    }

    // Verify password
    const isValidPassword = await verifyPassword(password, user.passwordHash);

    if (!isValidPassword) {
      await handleFailedLogin(user.id);
      
      securityLogger.warn('Failed login attempt', {
        userId: user.id,
        username: user.username,
        ip: req.ip,
        userAgent: req.get('User-Agent'),
      });

      throw new Error('Invalid credentials');
    }

    // Successful login
    await handleSuccessfulLogin(user.id);

    securityLogger.info('Successful login', {
      userId: user.id,
      username: user.username,
      ip: req.ip,
      userAgent: req.get('User-Agent'),
    });

    // Generate tokens
    const tokens = await generateTokens(user, req);

    // Remove password hash from response
    const { passwordHash: _, ...userWithoutPassword } = user;

    return {
      user: userWithoutPassword,
      tokens,
    };
  }

  // Logout user
  async logout(sessionId: string): Promise<void> {
    return this.handleErrors('User logout', async () => {
      await logout(sessionId);
      
      logger.info('User logged out', { sessionId });
    });
  }

  // Get user by ID
  async getUserById(userId: number): Promise<Omit<User, 'passwordHash'> | null> {
    return this.handleErrors('Get user by ID', async () => {
      const user = await this.db
        .select()
        .from(users)
        .where(eq(users.id, userId))
        .limit(1);

      if (!user.length) {
        return null;
      }

      // Remove password hash from response
      const { passwordHash: _, ...userWithoutPassword } = user[0];
      return userWithoutPassword;
    });
  }

  // Update user profile
  async updateProfile(
    userId: number,
    updateData: Partial<Pick<User, 'fullName' | 'email' | 'phone' | 'avatarUrl'>>
  ): Promise<Omit<User, 'passwordHash'>> {
    return this.handleErrors('Update user profile', async () => {
      // If email is being updated, check if it's already taken
      if (updateData.email) {
        const existingUser = await this.db
          .select()
          .from(users)
          .where(
            and(
              eq(users.email, updateData.email),
              // Make sure it's not the same user
              eq(users.id, userId)
            )
          )
          .limit(1);

        if (existingUser.length > 0 && existingUser[0].id !== userId) {
          throw new Error('Email already exists');
        }
      }

      const updatedUser = await this.db
        .update(users)
        .set({
          ...updateData,
          updatedAt: new Date(),
        })
        .where(eq(users.id, userId))
        .returning();

      if (!updatedUser.length) {
        throw new Error('User not found');
      }

      logger.info('User profile updated', {
        userId,
        updatedFields: Object.keys(updateData),
      });

      // Remove password hash from response
      const { passwordHash: _, ...userWithoutPassword } = updatedUser[0];
      return userWithoutPassword;
    });
  }

  // Change password
  async changePassword(
    userId: number,
    currentPassword: string,
    newPassword: string
  ): Promise<void> {
    return this.handleErrors('Change password', async () => {
      // Get current user
      const user = await this.db
        .select()
        .from(users)
        .where(eq(users.id, userId))
        .limit(1);

      if (!user.length) {
        throw new Error('User not found');
      }

      // Verify current password
      const isValidPassword = await verifyPassword(currentPassword, user[0].passwordHash);
      if (!isValidPassword) {
        securityLogger.warn('Invalid current password in change password attempt', {
          userId,
          username: user[0].username,
        });
        throw new Error('Current password is incorrect');
      }

      // Hash new password
      const passwordHash = await hashPassword(newPassword);

      // Update password
      await this.db
        .update(users)
        .set({
          passwordHash,
          updatedAt: new Date(),
        })
        .where(eq(users.id, userId));

      securityLogger.info('Password changed', {
        userId,
        username: user[0].username,
      });
    });
  }

  // Delete user account
  async deleteAccount(userId: number): Promise<void> {
    return this.handleErrors('Delete user account', async () => {
      await this.withTransaction(async (tx) => {
        // Delete user (cascading will handle related records)
        const result = await tx
          .delete(users)
          .where(eq(users.id, userId));

        securityLogger.info('User account deleted', { userId });
      });
    });
  }
}