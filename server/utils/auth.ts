import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { Request, Response, NextFunction } from 'express';
import { eq, and, lt } from 'drizzle-orm';
import { db } from '../database.js';
import { users, userSessions } from '../../shared/schema.js';
import { jwtConfig, securityConfig } from '../config.js';
import { logger, securityLogger } from './logger.js';
import { v4 as uuidv4 } from 'uuid';

// JWT payload interface
export interface JWTPayload {
  userId: number;
  username: string;
  email: string;
  role: string;
  sessionId: string;
  iat: number;
  exp: number;
}

// Token pair interface
export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

// Enhanced request interface
export interface AuthenticatedRequest extends Request {
  user?: JWTPayload;
  sessionId?: string;
}

// Hash password
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, securityConfig.bcryptRounds);
}

// Verify password
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

// Generate access and refresh tokens
export async function generateTokens(user: any, req: Request): Promise<TokenPair> {
  const sessionId = uuidv4();
  
  // Create JWT payload
  const payload: Omit<JWTPayload, 'iat' | 'exp'> = {
    userId: user.id,
    username: user.username,
    email: user.email,
    role: user.role || 'user',
    sessionId,
  };

  // Generate tokens
  const accessToken = jwt.sign(payload, jwtConfig.secret, {
    expiresIn: jwtConfig.expiresIn,
  });

  const refreshToken = jwt.sign(
    { sessionId, userId: user.id },
    jwtConfig.refreshSecret,
    { expiresIn: jwtConfig.refreshExpiresIn }
  );

  // Store session in database
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7); // 7 days

  try {
    await db.insert(userSessions).values({
      userId: user.id,
      sessionToken: accessToken,
      refreshToken,
      ipAddress: req.ip,
      userAgent: req.get('User-Agent') || '',
      expiresAt,
    });

    securityLogger.info('Session created', {
      userId: user.id,
      username: user.username,
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      sessionId,
    });
  } catch (error) {
    logger.error('Failed to store session:', error);
    throw new Error('Failed to create session');
  }

  return { accessToken, refreshToken };
}

// Verify JWT token
export function verifyToken(token: string): JWTPayload {
  try {
    return jwt.verify(token, jwtConfig.secret) as JWTPayload;
  } catch (error) {
    throw new Error('Invalid token');
  }
}

// Verify refresh token
export function verifyRefreshToken(token: string): { sessionId: string; userId: number } {
  try {
    return jwt.verify(token, jwtConfig.refreshSecret) as { sessionId: string; userId: number };
  } catch (error) {
    throw new Error('Invalid refresh token');
  }
}

// Authentication middleware
export function authenticateToken(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({
      error: 'Access denied',
      message: 'No token provided',
    });
  }

  try {
    const payload = verifyToken(token);
    req.user = payload;
    req.sessionId = payload.sessionId;
    next();
  } catch (error) {
    securityLogger.warn('Invalid token attempt', {
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      token: token.substring(0, 20) + '...',
    });

    return res.status(403).json({
      error: 'Access denied',
      message: 'Invalid or expired token',
    });
  }
}

// Optional authentication middleware (doesn't fail if no token)
export function optionalAuth(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (token) {
    try {
      const payload = verifyToken(token);
      req.user = payload;
      req.sessionId = payload.sessionId;
    } catch (error) {
      // Token is invalid but we don't fail the request
      logger.debug('Invalid token in optional auth:', error);
    }
  }

  next();
}

// Role-based authorization middleware
export function requireRole(roles: string | string[]) {
  const roleArray = Array.isArray(roles) ? roles : [roles];
  
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        error: 'Access denied',
        message: 'Authentication required',
      });
    }

    if (!roleArray.includes(req.user.role)) {
      securityLogger.warn('Unauthorized role access attempt', {
        userId: req.user.userId,
        username: req.user.username,
        userRole: req.user.role,
        requiredRoles: roleArray,
        endpoint: req.path,
        ip: req.ip,
      });

      return res.status(403).json({
        error: 'Access denied',
        message: 'Insufficient permissions',
      });
    }

    next();
  };
}

// Check if user account is locked
export async function checkAccountLock(userId: number): Promise<boolean> {
  const user = await db
    .select()
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);

  if (!user.length) return false;

  const userData = user[0];
  
  // Check if account is locked
  if (userData.lockedUntil && userData.lockedUntil > new Date()) {
    return true;
  }

  // Reset login attempts if lock time has passed
  if (userData.lockedUntil && userData.lockedUntil <= new Date()) {
    await db
      .update(users)
      .set({
        loginAttempts: 0,
        lockedUntil: null,
      })
      .where(eq(users.id, userId));
  }

  return false;
}

// Handle failed login attempt
export async function handleFailedLogin(userId: number): Promise<void> {
  const user = await db
    .select()
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);

  if (!user.length) return;

  const userData = user[0];
  const attempts = (userData.loginAttempts || 0) + 1;

  let updateData: any = { loginAttempts: attempts };

  // Lock account if max attempts reached
  if (attempts >= securityConfig.maxLoginAttempts) {
    updateData.lockedUntil = new Date(Date.now() + securityConfig.accountLockTime);
    
    securityLogger.warn('Account locked due to failed login attempts', {
      userId,
      username: userData.username,
      attempts,
      lockedUntil: updateData.lockedUntil,
    });
  }

  await db
    .update(users)
    .set(updateData)
    .where(eq(users.id, userId));
}

// Handle successful login
export async function handleSuccessfulLogin(userId: number): Promise<void> {
  await db
    .update(users)
    .set({
      loginAttempts: 0,
      lockedUntil: null,
      lastLogin: new Date(),
    })
    .where(eq(users.id, userId));
}

// Logout (invalidate session)
export async function logout(sessionId: string): Promise<void> {
  try {
    await db
      .delete(userSessions)
      .where(eq(userSessions.sessionToken, sessionId));

    securityLogger.info('Session invalidated', { sessionId });
  } catch (error) {
    logger.error('Failed to invalidate session:', error);
  }
}

// Clean up expired sessions
export async function cleanupExpiredSessions(): Promise<void> {
  try {
    const result = await db
      .delete(userSessions)
      .where(lt(userSessions.expiresAt, new Date()));

    logger.info(`Cleaned up expired sessions: ${result.rowCount || 0}`);
  } catch (error) {
    logger.error('Failed to cleanup expired sessions:', error);
  }
}

// Get user sessions
export async function getUserSessions(userId: number) {
  return db
    .select({
      id: userSessions.id,
      ipAddress: userSessions.ipAddress,
      userAgent: userSessions.userAgent,
      createdAt: userSessions.createdAt,
      expiresAt: userSessions.expiresAt,
    })
    .from(userSessions)
    .where(
      and(
        eq(userSessions.userId, userId),
        lt(new Date(), userSessions.expiresAt)
      )
    )
    .orderBy(userSessions.createdAt);
}