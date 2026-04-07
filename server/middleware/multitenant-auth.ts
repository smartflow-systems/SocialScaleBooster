import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { db } from '../db';
import { users, organizations } from '@shared/schema-multitenant';
import { eq } from 'drizzle-orm';

const JWT_SECRET = process.env.JWT_SECRET || 'sfs-dev-secret-change-in-production';

export interface MultiTenantAuthRequest extends Request {
  user?: {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
    organizationId: string;
  };
  organization?: {
    id: string;
    name: string;
    slug: string;
    plan: string;
    planLimits: any;
    currentUsage: any;
  };
  usageCheck?: any;
}

export interface MultiTenantJWTPayload {
  userId: number;
  organizationId: string;
  iat?: number;
  exp?: number;
}

/**
 * Multi-tenant authentication middleware
 * Validates JWT and loads user + organization data
 */
export function authenticateMultiTenant(
  req: MultiTenantAuthRequest,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ 
      error: 'Authentication token required',
      code: 'AUTH_TOKEN_MISSING' 
    });
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET) as MultiTenantJWTPayload;
    
    // Load user and organization data
    loadUserAndOrganization(payload.userId, payload.organizationId)
      .then((result) => {
        if (!result) {
          return res.status(401).json({ 
            error: 'User or organization not found',
            code: 'USER_NOT_FOUND' 
          });
        }

        req.user = result.user;
        req.organization = result.organization;
        next();
      })
      .catch((error) => {
        console.error('Error loading user data:', error);
        return res.status(500).json({ 
          error: 'Authentication failed',
          code: 'AUTH_LOAD_ERROR' 
        });
      });
  } catch (error) {
    console.error('JWT verification error:', error);
    return res.status(403).json({ 
      error: 'Invalid or expired token',
      code: 'INVALID_TOKEN' 
    });
  }
}

/**
 * Load user and organization data from database
 */
async function loadUserAndOrganization(userId: number, organizationId: string) {
  try {
    // Load user
    const userResult = await db
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (!userResult[0]) {
      return null;
    }

    const user = userResult[0];

    // Verify user belongs to the organization
    if (user.organizationId !== organizationId) {
      console.error(`User ${userId} does not belong to organization ${organizationId}`);
      return null;
    }

    // Load organization
    const orgResult = await db
      .select()
      .from(organizations)
      .where(eq(organizations.id, organizationId))
      .limit(1);

    if (!orgResult[0]) {
      return null;
    }

    const organization = orgResult[0];

    return {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        organizationId: user.organizationId
      },
      organization: {
        id: organization.id,
        name: organization.name,
        slug: organization.slug,
        plan: organization.plan,
        planLimits: organization.planLimits,
        currentUsage: organization.currentUsage
      }
    };
  } catch (error) {
    console.error('Database error loading user/org:', error);
    throw error;
  }
}

/**
 * Middleware to check if user has required role
 */
export function requireRole(roles: string | string[]) {
  return (req: MultiTenantAuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ 
        error: 'Authentication required',
        code: 'AUTH_REQUIRED' 
      });
    }

    const allowedRoles = Array.isArray(roles) ? roles : [roles];
    
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ 
        error: 'Insufficient permissions',
        code: 'INSUFFICIENT_PERMISSIONS',
        required: allowedRoles,
        current: req.user.role
      });
    }

    next();
  };
}

/**
 * Middleware to check if organization is active
 */
export function requireActiveOrganization(
  req: MultiTenantAuthRequest,
  res: Response,
  next: NextFunction
) {
  if (!req.organization) {
    return res.status(401).json({ 
      error: 'Organization not found',
      code: 'ORG_NOT_FOUND' 
    });
  }

  if (req.organization.plan === 'cancelled' || req.organization.plan === 'suspended') {
    return res.status(403).json({ 
      error: 'Organization account is not active',
      code: 'ORG_INACTIVE',
      status: req.organization.plan,
      upgradeUrl: '/billing'
    });
  }

  next();
}

/**
 * Generate multi-tenant JWT token
 */
export function generateMultiTenantToken(userId: number, organizationId: string): string {
  return jwt.sign(
    { userId, organizationId },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

/**
 * Verify multi-tenant JWT token
 */
export function verifyMultiTenantToken(token: string): MultiTenantJWTPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as MultiTenantJWTPayload;
  } catch (error) {
    return null;
  }
}