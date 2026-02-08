import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { db } from '../db';
import { users, organizations } from '@shared/schema-multitenant';
import { eq, and } from 'drizzle-orm';

export interface TenantContext {
  userId: number;
  organizationId: string;
  userRole: string;
  organization: {
    id: string;
    name: string;
    plan: string;
    planLimits: any;
    currentUsage: any;
    status: string;
  };
}

declare global {
  namespace Express {
    interface Request {
      tenant?: TenantContext;
    }
  }
}

export async function tenantMiddleware(req: Request, res: Response, next: NextFunction) {
  try {
    const token = extractToken(req);
    if (!token) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    const userId = decoded.userId;

    // Get user with organization
    const [user] = await db
      .select({
        user: users,
        organization: organizations,
      })
      .from(users)
      .leftJoin(organizations, eq(users.organizationId, organizations.id))
      .where(and(
        eq(users.id, userId),
        eq(users.isActive, true)
      ));

    if (!user || !user.organization) {
      return res.status(401).json({ error: 'Invalid user or organization' });
    }

    // Check if organization is active
    if (user.organization.status === 'suspended') {
      return res.status(403).json({ 
        error: 'Account suspended',
        reason: 'subscription_issue'
      });
    }

    // Set tenant context
    req.tenant = {
      userId: user.user.id,
      organizationId: user.user.organizationId,
      userRole: user.user.role,
      organization: {
        id: user.organization.id,
        name: user.organization.name,
        plan: user.organization.plan,
        planLimits: user.organization.planLimits,
        currentUsage: user.organization.currentUsage,
        status: user.organization.status,
      }
    };

    next();
  } catch (error) {
    console.error('Tenant middleware error:', error);
    return res.status(401).json({ error: 'Invalid authentication' });
  }
}

function extractToken(req: Request): string | null {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }

  // Also check cookies for web clients
  if (req.cookies && req.cookies.auth_token) {
    return req.cookies.auth_token;
  }

  return null;
}

// Role-based access control
export function requireRole(allowedRoles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.tenant) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    if (!allowedRoles.includes(req.tenant.userRole)) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }

    next();
  };
}

// Usage limit enforcement middleware
export function enforceUsageLimit(limitType: 'socialAccounts' | 'postsPerMonth' | 'users') {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.tenant) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const { planLimits, currentUsage } = req.tenant.organization;
    const limit = planLimits[limitType];
    const current = currentUsage[limitType] || 0;

    // -1 means unlimited
    if (limit !== -1 && current >= limit) {
      return res.status(403).json({
        error: 'Usage limit exceeded',
        limitType,
        current,
        limit,
        plan: req.tenant.organization.plan
      });
    }

    next();
  };
}

// Helper to build tenant-scoped queries
export function withTenant(organizationId: string) {
  return {
    // Helper functions for common queries
    users: () => eq(users.organizationId, organizationId),
    // Add more table helpers as needed
  };
}

// Subdomain-based tenant resolution (optional)
export async function subdomainTenantMiddleware(req: Request, res: Response, next: NextFunction) {
  const host = req.get('host');
  if (!host) {
    return next();
  }

  const subdomain = host.split('.')[0];
  
  // Skip if no subdomain or it's the main domain
  if (!subdomain || subdomain === 'app' || subdomain === 'www') {
    return next();
  }

  try {
    // Look up organization by slug
    const [org] = await db
      .select()
      .from(organizations)
      .where(eq(organizations.slug, subdomain));

    if (org) {
      // Store organization info for later use
      req.subdomainOrganization = org;
    }
  } catch (error) {
    console.error('Subdomain lookup error:', error);
  }

  next();
}