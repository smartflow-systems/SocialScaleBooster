// Updated routes.ts with multi-tenant support
import express from 'express';
import rateLimit from 'express-rate-limit';
import { tenantMiddleware, requireRole, enforceUsageLimit } from './middleware/tenant';
import { onboardingRoutes } from './routes/onboarding';
import { billingRoutes } from './routes/billing';
import { webhookRoutes } from './routes/webhooks';
import { db } from './db';
import { 
  users, 
  organizations, 
  socialAccounts, 
  bots, 
  clients, 
  posts, 
  invitations 
} from '@shared/schema-multitenant';
import { eq, and, desc, count } from 'drizzle-orm';
import { incrementUsage, checkUsageLimit } from './stripe';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import crypto from 'crypto';

const router = express.Router();

// Rate limiting for authenticated/protected routes
const protectedRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});

// Public routes (no authentication)
router.use('/onboarding', onboardingRoutes);
router.use('/webhooks', webhookRoutes);

// Apply rate limiting to subsequent (typically authenticated) routes
router.use(protectedRateLimiter);

// Login (updated for multi-tenant)
const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

router.post('/auth/login', async (req, res) => {
  try {
    const { email, password } = loginSchema.parse(req.body);

    const [user] = await db
      .select({
        user: users,
        organization: organizations,
      })
      .from(users)
      .leftJoin(organizations, eq(users.organizationId, organizations.id))
      .where(and(
        eq(users.email, email),
        eq(users.isActive, true)
      ));

    if (!user || !user.organization) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const validPassword = await bcrypt.compare(password, user.user.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check if organization is active
    if (user.organization.status === 'suspended') {
      return res.status(403).json({ 
        error: 'Account suspended',
        reason: 'subscription_issue'
      });
    }

    // Update last login
    await db
      .update(users)
      .set({ lastLoginAt: new Date() })
      .where(eq(users.id, user.user.id));

    // Generate token
    const token = jwt.sign(
      { userId: user.user.id, organizationId: user.user.organizationId },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: {
        id: user.user.id,
        email: user.user.email,
        firstName: user.user.firstName,
        lastName: user.user.lastName,
        role: user.user.role,
      },
      organization: {
        id: user.organization.id,
        name: user.organization.name,
        slug: user.organization.slug,
        plan: user.organization.plan,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Protected routes (require authentication)
router.use(tenantMiddleware);

// Billing routes
router.use('/billing', billingRoutes);

// Dashboard - organization overview
router.get('/dashboard', async (req, res) => {
  try {
    const { organizationId } = req.tenant!;

    // Get counts for dashboard
    const [stats] = await db
      .select({
        socialAccountsCount: count(socialAccounts.id),
        botsCount: count(bots.id),
        clientsCount: count(clients.id),
      })
      .from(organizations)
      .leftJoin(socialAccounts, eq(socialAccounts.organizationId, organizations.id))
      .leftJoin(bots, eq(bots.organizationId, organizations.id))
      .leftJoin(clients, eq(clients.organizationId, organizations.id))
      .where(eq(organizations.id, organizationId));

    // Get recent posts
    const recentPosts = await db
      .select({
        id: posts.id,
        content: posts.content,
        platform: posts.platform,
        status: posts.status,
        scheduledFor: posts.scheduledFor,
        publishedAt: posts.publishedAt,
        createdAt: posts.createdAt,
      })
      .from(posts)
      .where(eq(posts.organizationId, organizationId))
      .orderBy(desc(posts.createdAt))
      .limit(10);

    res.json({
      stats,
      recentPosts,
      organization: req.tenant!.organization,
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({ error: 'Failed to load dashboard' });
  }
});

// Social Accounts (with usage limits)
router.get('/social-accounts', async (req, res) => {
  try {
    const { organizationId } = req.tenant!;

    const accounts = await db
      .select()
      .from(socialAccounts)
      .where(eq(socialAccounts.organizationId, organizationId))
      .orderBy(desc(socialAccounts.createdAt));

    res.json(accounts);
  } catch (error) {
    console.error('Get social accounts error:', error);
    res.status(500).json({ error: 'Failed to get social accounts' });
  }
});

router.post('/social-accounts', enforceUsageLimit('socialAccounts'), async (req, res) => {
  try {
    const { organizationId, userId } = req.tenant!;

    // Create account logic here (same as before but with organizationId)
    const accountData = {
      ...req.body,
      organizationId,
      userId,
    };

    const [account] = await db
      .insert(socialAccounts)
      .values(accountData)
      .returning();

    // Increment usage
    await incrementUsage(organizationId, 'socialAccounts');

    res.json(account);
  } catch (error) {
    console.error('Create social account error:', error);
    res.status(500).json({ error: 'Failed to create social account' });
  }
});

// Posts (with usage tracking)
router.post('/posts', enforceUsageLimit('postsPerMonth'), async (req, res) => {
  try {
    const { organizationId, userId } = req.tenant!;

    const postData = {
      ...req.body,
      organizationId,
      userId,
    };

    const [post] = await db
      .insert(posts)
      .values(postData)
      .returning();

    // Increment usage
    await incrementUsage(organizationId, 'postsPerMonth');

    res.json(post);
  } catch (error) {
    console.error('Create post error:', error);
    res.status(500).json({ error: 'Failed to create post' });
  }
});

// Team Management
router.get('/team', requireRole(['owner', 'admin']), async (req, res) => {
  try {
    const { organizationId } = req.tenant!;

    const teamMembers = await db
      .select({
        id: users.id,
        email: users.email,
        firstName: users.firstName,
        lastName: users.lastName,
        role: users.role,
        isActive: users.isActive,
        lastLoginAt: users.lastLoginAt,
        createdAt: users.createdAt,
      })
      .from(users)
      .where(eq(users.organizationId, organizationId))
      .orderBy(desc(users.createdAt));

    // Get pending invitations
    const pendingInvites = await db
      .select()
      .from(invitations)
      .where(and(
        eq(invitations.organizationId, organizationId),
        eq(invitations.status, 'pending')
      ));

    res.json({
      members: teamMembers,
      invitations: pendingInvites,
    });
  } catch (error) {
    console.error('Get team error:', error);
    res.status(500).json({ error: 'Failed to get team' });
  }
});

// Invite team member
const inviteSchema = z.object({
  email: z.string().email(),
  role: z.enum(['admin', 'member']),
});

router.post('/team/invite', 
  requireRole(['owner', 'admin']), 
  enforceUsageLimit('users'),
  async (req, res) => {
  try {
    const { organizationId, userId } = req.tenant!;
    const { email, role } = inviteSchema.parse(req.body);

    // Check if user already exists
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (existingUser.length > 0) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Check for existing invitation
    const existingInvite = await db
      .select()
      .from(invitations)
      .where(and(
        eq(invitations.organizationId, organizationId),
        eq(invitations.email, email),
        eq(invitations.status, 'pending')
      ))
      .limit(1);

    if (existingInvite.length > 0) {
      return res.status(400).json({ error: 'Invitation already sent' });
    }

    // Create invitation
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    const [invitation] = await db
      .insert(invitations)
      .values({
        organizationId,
        email,
        role,
        token,
        invitedBy: userId,
        expiresAt,
      })
      .returning();

    // TODO: Send invitation email
    // await sendInvitationEmail(email, invitation.token, req.tenant!.organization.name);

    res.json({ 
      success: true, 
      invitation,
      inviteUrl: `${process.env.APP_URL}/invite/${token}`
    });
  } catch (error) {
    console.error('Invite user error:', error);
    res.status(500).json({ error: 'Failed to send invitation' });
  }
});

export { router as multiTenantRoutes };