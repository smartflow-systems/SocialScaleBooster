import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const DEVELOPMENT_JWT_SECRET = 'sfs-dev-secret-change-in-production';
const configuredJwtSecret = process.env.SFS_JWT_SECRET || process.env.JWT_SECRET;

if (
  process.env.NODE_ENV === 'production' &&
  (!configuredJwtSecret ||
    configuredJwtSecret === DEVELOPMENT_JWT_SECRET ||
    configuredJwtSecret.length < 32)
) {
  throw new Error('SFS_JWT_SECRET must be a unique secret of at least 32 characters in production');
}

const JWT_SECRET = configuredJwtSecret || DEVELOPMENT_JWT_SECRET;

export interface AuthRequest extends Request {
  userId?: number;
  tokenExpiresAt?: number;
}

export interface JWTPayload {
  userId: number;
  username: string;
  email: string;
  isPremium: boolean;
  isAdmin: boolean;
  iat?: number;
  exp?: number;
}

/**
 * Middleware to authenticate JWT tokens
 * Adds user info to request object if valid
 */
export function authenticateToken(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    res.status(401).json({ message: 'Authentication token required' });
    return;
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET) as JWTPayload;
    req.userId = payload.userId;
    req.tokenExpiresAt = payload.exp ? payload.exp * 1000 : undefined;
    (req as any).user = {
      id: payload.userId,
      username: payload.username,
      email: payload.email,
      isPremium: payload.isPremium,
      isAdmin: payload.isAdmin ?? false,
    };
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid or expired token' });
  }
}

/**
 * Optional auth middleware - adds user if token exists but doesn't require it
 */
export function optionalAuth(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token) {
    try {
      const payload = jwt.verify(token, JWT_SECRET) as JWTPayload;
      req.userId = payload.userId;
      req.tokenExpiresAt = payload.exp ? payload.exp * 1000 : undefined;
      (req as any).user = {
        id: payload.userId,
        username: payload.username,
        email: payload.email,
        isPremium: payload.isPremium,
        isAdmin: payload.isAdmin ?? false,
      };
    } catch (error) {
      // Invalid token but continue anyway
    }
  }

  next();
}

/**
 * Generate JWT token for user
 */
export function generateToken(payload: JWTPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

/**
 * Refresh token with extended expiration
 */
export function refreshToken(token: string): string | null {
  try {
    const payload = jwt.verify(token, JWT_SECRET) as JWTPayload;
    return generateToken(payload);
  } catch (error) {
    return null;
  }
}
