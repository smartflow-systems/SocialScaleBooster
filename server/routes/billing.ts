import express from 'express';
import { z } from 'zod';
import { stripe, createStripeCustomer, createSubscription, checkUsageLimit } from '../stripe';
import { tenantMiddleware, requireRole } from '../middleware/tenant';
import { db } from '../db';
import { organizations, subscriptions, users } from '@shared/schema-multitenant';
import { eq, and } from 'drizzle-orm';
import { PLANS } from '@shared/schema-multitenant';

const router = express.Router();

// Get current billing info
router.get('/info', tenantMiddleware, async (req, res) => {
  try {
    const { organizationId } = req.tenant!;

    const [org] = await db
      .select({
        organization: organizations,
        subscription: subscriptions,
      })
      .from(organizations)
      .leftJoin(subscriptions, eq(subscriptions.organizationId, organizations.id))
      .where(eq(organizations.id, organizationId));

    const billingInfo = {
      organization: org.organization,
      subscription: org.subscription,
      plans: PLANS,
      usage: org.organization.currentUsage,
      limits: org.organization.planLimits,
    };

    res.json(billingInfo);
  } catch (error) {
    console.error('Get billing info error:', error);
    res.status(500).json({ error: 'Failed to get billing info' });
  }
});

// Create checkout session for subscription
const createCheckoutSchema = z.object({
  plan: z.enum(['starter', 'pro']),
  successUrl: z.string().url(),
  cancelUrl: z.string().url(),
});

router.post('/checkout', tenantMiddleware, requireRole(['owner', 'admin']), async (req, res) => {
  try {
    const { plan, successUrl, cancelUrl } = createCheckoutSchema.parse(req.body);
    const { organizationId, organization } = req.tenant!;

    // Get or create Stripe customer
    let stripeCustomerId = organization.stripeCustomerId;
    if (!stripeCustomerId) {
      const [owner] = await db
        .select()
        .from(users)
        .where(and(
          eq(users.organizationId, organizationId),
          eq(users.role, 'owner')
        ));

      if (!owner) {
        return res.status(400).json({ error: 'Organization owner not found' });
      }

      const customer = await createStripeCustomer(
        organizationId,
        owner.email,
        organization.name
      );
      stripeCustomerId = customer.id;
    }

    // Create checkout session
    const planConfig = PLANS[plan];
    const session = await stripe.checkout.sessions.create({
      customer: stripeCustomerId,
      payment_method_types: ['card'],
      line_items: [
        {
          price: planConfig.stripePriceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        organizationId,
        plan,
      },
      subscription_data: {
        trial_period_days: 14,
        metadata: {
          organizationId,
        },
      },
    });

    res.json({ url: session.url });
  } catch (error) {
    console.error('Create checkout error:', error);
    res.status(500).json({ error: 'Failed to create checkout session' });
  }
});

// Create customer portal session
router.post('/portal', tenantMiddleware, requireRole(['owner', 'admin']), async (req, res) => {
  try {
    const { organization } = req.tenant!;

    if (!organization.stripeCustomerId) {
      return res.status(400).json({ error: 'No Stripe customer found' });
    }

    const session = await stripe.billingPortal.sessions.create({
      customer: organization.stripeCustomerId,
      return_url: req.body.returnUrl || `${req.protocol}://${req.get('host')}/dashboard`,
    });

    res.json({ url: session.url });
  } catch (error) {
    console.error('Create portal error:', error);
    res.status(500).json({ error: 'Failed to create portal session' });
  }
});

// Get usage stats
router.get('/usage', tenantMiddleware, async (req, res) => {
  try {
    const { organizationId } = req.tenant!;

    const socialAccountsCheck = await checkUsageLimit(organizationId, 'socialAccounts');
    const postsCheck = await checkUsageLimit(organizationId, 'postsPerMonth');
    const usersCheck = await checkUsageLimit(organizationId, 'users');

    res.json({
      socialAccounts: socialAccountsCheck,
      postsPerMonth: postsCheck,
      users: usersCheck,
    });
  } catch (error) {
    console.error('Get usage error:', error);
    res.status(500).json({ error: 'Failed to get usage stats' });
  }
});

// Cancel subscription
router.post('/cancel', tenantMiddleware, requireRole(['owner']), async (req, res) => {
  try {
    const { organizationId } = req.tenant!;

    const [sub] = await db
      .select()
      .from(subscriptions)
      .where(eq(subscriptions.organizationId, organizationId));

    if (!sub || !sub.stripeSubscriptionId) {
      return res.status(404).json({ error: 'No subscription found' });
    }

    // Cancel at period end
    await stripe.subscriptions.update(sub.stripeSubscriptionId, {
      cancel_at_period_end: true,
    });

    res.json({ success: true });
  } catch (error) {
    console.error('Cancel subscription error:', error);
    res.status(500).json({ error: 'Failed to cancel subscription' });
  }
});

export { router as billingRoutes };