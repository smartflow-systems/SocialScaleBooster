import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { db } from '../db';
import { organizations, users, invitations } from '@shared/schema-multitenant';
import { eq, and } from 'drizzle-orm';
import { createStripeCustomer } from '../stripe';
import { PLANS } from '@shared/schema-multitenant';

const router = express.Router();

// Sign up new organization
const signUpSchema = z.object({
  organizationName: z.string().min(1).max(100),
  organizationSlug: z.string().regex(/^[a-z0-9-]+$/).min(3).max(50),
  firstName: z.string().min(1).max(50),
  lastName: z.string().min(1).max(50),
  email: z.string().email(),
  password: z.string().min(8),
});

router.post('/signup', async (req, res) => {
  try {
    const { organizationName, organizationSlug, firstName, lastName, email, password } = 
      signUpSchema.parse(req.body);

    // Check if slug is available
    const existingOrg = await db
      .select()
      .from(organizations)
      .where(eq(organizations.slug, organizationSlug))
      .limit(1);

    if (existingOrg.length > 0) {
      return res.status(400).json({ error: 'Organization name already taken' });
    }

    // Check if email is already used
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (existingUser.length > 0) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create organization
    const [organization] = await db
      .insert(organizations)
      .values({
        name: organizationName,
        slug: organizationSlug,
        plan: 'trial',
        planLimits: PLANS.trial.limits,
        currentUsage: {
          socialAccounts: 0,
          postsThisMonth: 0,
          users: 1,
          aiGenerationsThisMonth: 0,
        },
        status: 'active',
      })
      .returning();

    // Create owner user
    const [user] = await db
      .insert(users)
      .values({
        organizationId: organization.id,
        username: email.split('@')[0], // Use email prefix as username
        password: hashedPassword,
        email,
        firstName,
        lastName,
        role: 'owner',
        isActive: true,
      })
      .returning();

    // Create Stripe customer
    await createStripeCustomer(organization.id, email, organizationName);

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, organizationId: organization.id },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
      organization: {
        id: organization.id,
        name: organization.name,
        slug: organization.slug,
        plan: organization.plan,
      },
    });
  } catch (error: any) {
    console.error('Signup error:', error);
    
    if (error.code === '23505') { // Unique violation
      if (error.constraint?.includes('slug')) {
        return res.status(400).json({ error: 'Organization name already taken' });
      }
      if (error.constraint?.includes('email')) {
        return res.status(400).json({ error: 'Email already registered' });
      }
    }
    
    res.status(500).json({ error: 'Registration failed' });
  }
});

// Check slug availability
router.get('/check-slug/:slug', async (req, res) => {
  try {
    const slug = req.params.slug.toLowerCase();
    
    // Validate slug format
    if (!/^[a-z0-9-]+$/.test(slug) || slug.length < 3 || slug.length > 50) {
      return res.json({ available: false, reason: 'Invalid format' });
    }

    // Reserved slugs
    const reserved = ['www', 'app', 'api', 'admin', 'support', 'help', 'docs', 'blog'];
    if (reserved.includes(slug)) {
      return res.json({ available: false, reason: 'Reserved name' });
    }

    const existing = await db
      .select()
      .from(organizations)
      .where(eq(organizations.slug, slug))
      .limit(1);

    res.json({ available: existing.length === 0 });
  } catch (error) {
    console.error('Check slug error:', error);
    res.status(500).json({ error: 'Failed to check availability' });
  }
});

// Accept invitation
const acceptInviteSchema = z.object({
  token: z.string(),
  firstName: z.string().min(1).max(50),
  lastName: z.string().min(1).max(50),
  password: z.string().min(8),
});

router.post('/accept-invite', async (req, res) => {
  try {
    const { token, firstName, lastName, password } = acceptInviteSchema.parse(req.body);

    // Find invitation
    const [invitation] = await db
      .select({
        invitation: invitations,
        organization: organizations,
      })
      .from(invitations)
      .leftJoin(organizations, eq(invitations.organizationId, organizations.id))
      .where(and(
        eq(invitations.token, token),
        eq(invitations.status, 'pending')
      ));

    if (!invitation) {
      return res.status(400).json({ error: 'Invalid or expired invitation' });
    }

    if (new Date() > invitation.invitation.expiresAt) {
      return res.status(400).json({ error: 'Invitation has expired' });
    }

    // Check if email is already registered
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, invitation.invitation.email))
      .limit(1);

    if (existingUser.length > 0) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const [user] = await db
      .insert(users)
      .values({
        organizationId: invitation.invitation.organizationId,
        username: invitation.invitation.email.split('@')[0],
        password: hashedPassword,
        email: invitation.invitation.email,
        firstName,
        lastName,
        role: invitation.invitation.role,
        isActive: true,
      })
      .returning();

    // Mark invitation as accepted
    await db
      .update(invitations)
      .set({ status: 'accepted' })
      .where(eq(invitations.id, invitation.invitation.id));

    // Update organization user count
    await db
      .update(organizations)
      .set({
        currentUsage: {
          ...invitation.organization!.currentUsage,
          users: (invitation.organization!.currentUsage.users || 0) + 1,
        },
        updatedAt: new Date(),
      })
      .where(eq(organizations.id, invitation.invitation.organizationId));

    // Generate JWT token
    const authToken = jwt.sign(
      { userId: user.id, organizationId: user.organizationId },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      token: authToken,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
      organization: invitation.organization,
    });
  } catch (error) {
    console.error('Accept invitation error:', error);
    res.status(500).json({ error: 'Failed to accept invitation' });
  }
});

// Get invitation details (without accepting)
router.get('/invite/:token', async (req, res) => {
  try {
    const { token } = req.params;

    const [invitation] = await db
      .select({
        invitation: invitations,
        organization: organizations,
        invitedBy: users,
      })
      .from(invitations)
      .leftJoin(organizations, eq(invitations.organizationId, organizations.id))
      .leftJoin(users, eq(invitations.invitedBy, users.id))
      .where(and(
        eq(invitations.token, token),
        eq(invitations.status, 'pending')
      ));

    if (!invitation) {
      return res.status(404).json({ error: 'Invitation not found' });
    }

    if (new Date() > invitation.invitation.expiresAt) {
      return res.status(400).json({ error: 'Invitation has expired' });
    }

    res.json({
      email: invitation.invitation.email,
      role: invitation.invitation.role,
      organization: {
        name: invitation.organization?.name,
        slug: invitation.organization?.slug,
      },
      invitedBy: {
        firstName: invitation.invitedBy?.firstName,
        lastName: invitation.invitedBy?.lastName,
        email: invitation.invitedBy?.email,
      },
    });
  } catch (error) {
    console.error('Get invitation error:', error);
    res.status(500).json({ error: 'Failed to get invitation details' });
  }
});

export { router as onboardingRoutes };