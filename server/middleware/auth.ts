import type { Request, Response, NextFunction } from "express";

// Extend Express Request type to include user
declare global {
  namespace Express {
    interface User {
      id: number;
      username: string;
      email?: string;
      isPremium?: boolean;
      stripeCustomerId?: string;
      stripeSubscriptionId?: string;
      botCount?: number;
    }
  }
}

// Middleware to ensure user is authenticated
export function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (req.isAuthenticated && req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: "Authentication required" });
}

// Middleware to ensure user is premium
export function requirePremium(req: Request, res: Response, next: NextFunction) {
  if (!req.user) {
    return res.status(401).json({ message: "Authentication required" });
  }

  if (req.user.isPremium) {
    return next();
  }

  res.status(403).json({ message: "Premium subscription required" });
}

// Middleware to check if user owns a resource
export function checkResourceOwnership(resourceUserIdField: string = 'userId') {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: "Authentication required" });
    }

    const resourceUserId = (req as any).resource?.[resourceUserIdField];

    if (resourceUserId && resourceUserId !== req.user.id) {
      return res.status(403).json({ message: "Access denied" });
    }

    next();
  };
}

// Optional auth - adds user if authenticated but doesn't require it
export function optionalAuth(req: Request, res: Response, next: NextFunction) {
  // User will be populated if session exists, otherwise continues without user
  next();
}
