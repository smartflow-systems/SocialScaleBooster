import Stripe from 'stripe';
import { db } from './db';
import { organizations, subscriptions, users } from '@shared/schema-multitenant';
import { eq, and } from 'drizzle-orm';
import { PLANS } from '@shared/schema-multitenant';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is required');
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-11-20.acacia',
});

// Create Stripe customer for organization
export async function createStripeCustomer(organizationId: string, email: string, name: string) {
  const customer = await stripe.customers.create({
    email,
    name,
    metadata: {
      organizationId,
    },
  });

  // Update organization with Stripe customer ID
  await db
    .update(organizations)
    .set({ 
      stripeCustomerId: customer.id,
      updatedAt: new Date()
    })
    .where(eq(organizations.id, organizationId));

  return customer;
}

// Create subscription
export async function createSubscription(organizationId: string, priceId: string) {
  const [organization] = await db
    .select()
    .from(organizations)
    .where(eq(organizations.id, organizationId));

  if (!organization) {
    throw new Error('Organization not found');
  }

  if (!organization.stripeCustomerId) {
    throw new Error('Organization has no Stripe customer ID');
  }

  const subscription = await stripe.subscriptions.create({
    customer: organization.stripeCustomerId,
    items: [{ price: priceId }],
    metadata: {
      organizationId,
    },
    trial_period_days: 14, // 14-day trial
  });

  // Store subscription in database
  await db.insert(subscriptions).values({
    organizationId,
    stripeSubscriptionId: subscription.id,
    plan: getPlanFromPriceId(priceId),
    status: subscription.status,
    currentPeriodStart: new Date(subscription.current_period_start * 1000),
    currentPeriodEnd: new Date(subscription.current_period_end * 1000),
    trialStart: subscription.trial_start ? new Date(subscription.trial_start * 1000) : null,
    trialEnd: subscription.trial_end ? new Date(subscription.trial_end * 1000) : null,
  });

  return subscription;
}

// Handle Stripe webhooks
export async function handleStripeWebhook(event: Stripe.Event) {
  console.log(`🪝 Stripe webhook: ${event.type}`);

  switch (event.type) {
    case 'customer.subscription.created':
      await handleSubscriptionCreated(event.data.object as Stripe.Subscription);
      break;
    
    case 'customer.subscription.updated':
      await handleSubscriptionUpdated(event.data.object as Stripe.Subscription);
      break;
    
    case 'customer.subscription.deleted':
      await handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
      break;
    
    case 'invoice.payment_succeeded':
      await handlePaymentSucceeded(event.data.object as Stripe.Invoice);
      break;
    
    case 'invoice.payment_failed':
      await handlePaymentFailed(event.data.object as Stripe.Invoice);
      break;
    
    default:
      console.log(`Unhandled event type: ${event.type}`);
  }
}

async function handleSubscriptionCreated(subscription: Stripe.Subscription) {
  const organizationId = subscription.metadata.organizationId;
  if (!organizationId) return;

  const planType = getPlanFromPriceId(subscription.items.data[0].price.id);
  const plan = PLANS[planType];

  // Update organization plan and limits
  await db
    .update(organizations)
    .set({
      plan: planType,
      planLimits: plan.limits,
      status: 'active',
      updatedAt: new Date()
    })
    .where(eq(organizations.id, organizationId));

  // Create or update subscription record
  await db.insert(subscriptions).values({
    organizationId,
    stripeSubscriptionId: subscription.id,
    plan: planType,
    status: subscription.status,
    currentPeriodStart: new Date(subscription.current_period_start * 1000),
    currentPeriodEnd: new Date(subscription.current_period_end * 1000),
    trialStart: subscription.trial_start ? new Date(subscription.trial_start * 1000) : null,
    trialEnd: subscription.trial_end ? new Date(subscription.trial_end * 1000) : null,
  }).onConflictDoUpdate({
    target: subscriptions.stripeSubscriptionId,
    set: {
      status: subscription.status,
      currentPeriodStart: new Date(subscription.current_period_start * 1000),
      currentPeriodEnd: new Date(subscription.current_period_end * 1000),
      updatedAt: new Date()
    }
  });
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  const organizationId = subscription.metadata.organizationId;
  if (!organizationId) return;

  const planType = getPlanFromPriceId(subscription.items.data[0].price.id);
  const plan = PLANS[planType];

  // Update organization
  await db
    .update(organizations)
    .set({
      plan: planType,
      planLimits: plan.limits,
      status: subscription.status === 'active' ? 'active' : 'suspended',
      updatedAt: new Date()
    })
    .where(eq(organizations.id, organizationId));

  // Update subscription
  await db
    .update(subscriptions)
    .set({
      plan: planType,
      status: subscription.status,
      currentPeriodStart: new Date(subscription.current_period_start * 1000),
      currentPeriodEnd: new Date(subscription.current_period_end * 1000),
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
      updatedAt: new Date()
    })
    .where(eq(subscriptions.stripeSubscriptionId, subscription.id));
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  const organizationId = subscription.metadata.organizationId;
  if (!organizationId) return;

  // Downgrade to trial
  await db
    .update(organizations)
    .set({
      plan: 'trial',
      planLimits: PLANS.trial.limits,
      status: 'suspended',
      updatedAt: new Date()
    })
    .where(eq(organizations.id, organizationId));

  // Update subscription status
  await db
    .update(subscriptions)
    .set({
      status: 'canceled',
      updatedAt: new Date()
    })
    .where(eq(subscriptions.stripeSubscriptionId, subscription.id));
}

async function handlePaymentSucceeded(invoice: Stripe.Invoice) {
  // Reset monthly usage counters on successful payment
  const subscriptionId = invoice.subscription as string;
  if (!subscriptionId) return;

  const [subscription] = await db
    .select()
    .from(subscriptions)
    .where(eq(subscriptions.stripeSubscriptionId, subscriptionId));

  if (!subscription) return;

  // Reset monthly usage
  await db
    .update(organizations)
    .set({
      currentUsage: {
        socialAccounts: 0, // Don't reset social accounts count
        postsThisMonth: 0, // Reset posts counter
        users: 0, // Don't reset users count
        aiGenerationsThisMonth: 0 // Reset AI generations counter
      },
      usageResetDate: new Date(),
      status: 'active',
      updatedAt: new Date()
    })
    .where(eq(organizations.id, subscription.organizationId));
}

async function handlePaymentFailed(invoice: Stripe.Invoice) {
  const subscriptionId = invoice.subscription as string;
  if (!subscriptionId) return;

  const [subscription] = await db
    .select()
    .from(subscriptions)
    .where(eq(subscriptions.stripeSubscriptionId, subscriptionId));

  if (!subscription) return;

  // Suspend organization after payment failure
  await db
    .update(organizations)
    .set({
      status: 'suspended',
      updatedAt: new Date()
    })
    .where(eq(organizations.id, subscription.organizationId));
}

function getPlanFromPriceId(priceId: string): keyof typeof PLANS {
  // You'll need to map your actual Stripe price IDs here
  const priceMap: Record<string, keyof typeof PLANS> = {
    'price_starter_gbp_monthly': 'starter',
    'price_pro_gbp_monthly': 'pro',
  };
  
  return priceMap[priceId] || 'trial';
}

// Usage enforcement
export async function checkUsageLimit(
  organizationId: string, 
  limitType: 'socialAccounts' | 'postsPerMonth' | 'users' | 'aiGenerationsPerMonth'
): Promise<{ allowed: boolean; current: number; limit: number }> {
  const [org] = await db
    .select()
    .from(organizations)
    .where(eq(organizations.id, organizationId));

  if (!org) {
    throw new Error('Organization not found');
  }

  // Map limit types to current usage keys
  const usageKey = limitType === 'postsPerMonth' ? 'postsThisMonth' : 
                   limitType === 'aiGenerationsPerMonth' ? 'aiGenerationsThisMonth' : 
                   limitType;
  
  const current = org.currentUsage[usageKey as keyof typeof org.currentUsage] || 0;
  const limit = org.planLimits[limitType] || 0;
  
  // -1 means unlimited
  const allowed = limit === -1 || current < limit;
  
  return { allowed, current, limit };
}

export async function incrementUsage(
  organizationId: string,
  limitType: 'socialAccounts' | 'postsPerMonth' | 'users' | 'aiGenerationsPerMonth',
  increment: number = 1
) {
  const [org] = await db
    .select()
    .from(organizations)
    .where(eq(organizations.id, organizationId));

  if (!org) {
    throw new Error('Organization not found');
  }

  // Map limit types to current usage keys
  const usageKey = limitType === 'postsPerMonth' ? 'postsThisMonth' : 
                   limitType === 'aiGenerationsPerMonth' ? 'aiGenerationsThisMonth' : 
                   limitType;
  
  const newUsage = {
    ...org.currentUsage,
    [usageKey]: (org.currentUsage[usageKey as keyof typeof org.currentUsage] || 0) + increment
  };

  await db
    .update(organizations)
    .set({
      currentUsage: newUsage,
      updatedAt: new Date()
    })
    .where(eq(organizations.id, organizationId));
}