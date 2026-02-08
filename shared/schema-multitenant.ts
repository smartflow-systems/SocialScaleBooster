import { pgTable, text, serial, integer, boolean, timestamp, decimal, jsonb, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// NEW: Organizations (tenants) - top level
export const organizations = pgTable("organizations", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(), // for subdomains: acme.socialscale.com
  plan: text("plan").notNull().default("trial"), // trial, starter, pro
  planLimits: jsonb("plan_limits").$type<{
    socialAccounts: number;
    postsPerMonth: number;
    users: number;
  }>().notNull().default({
    socialAccounts: 1,
    postsPerMonth: 10,
    users: 1
  }),
  currentUsage: jsonb("current_usage").$type<{
    socialAccounts: number;
    postsThisMonth: number;
    users: number;
  }>().notNull().default({
    socialAccounts: 0,
    postsThisMonth: 0,
    users: 0
  }),
  usageResetDate: timestamp("usage_reset_date").defaultNow(), // Monthly reset
  stripeCustomerId: text("stripe_customer_id"),
  status: text("status").notNull().default("active"), // active, suspended, cancelled
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// NEW: Subscriptions (at organization level)
export const subscriptions = pgTable("subscriptions", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  organizationId: text("organization_id").notNull().references(() => organizations.id, { onDelete: "cascade" }),
  stripeSubscriptionId: text("stripe_subscription_id").unique(),
  plan: text("plan").notNull(), // starter-29, pro-99
  status: text("status").notNull(), // active, canceled, past_due, trialing
  currentPeriodStart: timestamp("current_period_start"),
  currentPeriodEnd: timestamp("current_period_end"),
  cancelAtPeriodEnd: boolean("cancel_at_period_end").default(false),
  trialStart: timestamp("trial_start"),
  trialEnd: timestamp("trial_end"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// MODIFIED: Users now belong to organizations
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  organizationId: text("organization_id").notNull().references(() => organizations.id, { onDelete: "cascade" }),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  firstName: text("first_name"),
  lastName: text("last_name"),
  role: text("role").notNull().default("member"), // owner, admin, member
  isActive: boolean("is_active").default(true),
  lastLoginAt: timestamp("last_login_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// MODIFIED: Add organizationId to all tenant-specific data
export const clients = pgTable("clients", {
  id: serial("id").primaryKey(),
  organizationId: text("organization_id").notNull().references(() => organizations.id, { onDelete: "cascade" }),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  businessName: text("business_name").notNull(),
  contactEmail: text("contact_email"),
  contactPhone: text("contact_phone"),
  email: text("email"),
  phone: text("phone"),
  industry: text("industry"),
  monthlyFee: decimal("monthly_fee", { precision: 10, scale: 2 }).notNull(),
  status: text("status").default("active"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const socialAccounts = pgTable("social_accounts", {
  id: serial("id").primaryKey(),
  organizationId: text("organization_id").notNull().references(() => organizations.id, { onDelete: "cascade" }),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  platform: text("platform").notNull(),
  accountName: text("account_name").notNull(),
  accountHandle: text("account_handle"),
  encryptedCredentials: text("encrypted_credentials").notNull(),
  credentialType: text("credential_type").default("api_key"),
  status: text("status").default("active"),
  lastVerified: timestamp("last_verified"),
  lastError: text("last_error"),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const bots = pgTable("bots", {
  id: serial("id").primaryKey(),
  organizationId: text("organization_id").notNull().references(() => organizations.id, { onDelete: "cascade" }),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  clientId: integer("client_id").references(() => clients.id, { onDelete: "set null" }),
  socialAccountId: integer("social_account_id").references(() => socialAccounts.id, { onDelete: "set null" }),
  name: text("name").notNull(),
  description: text("description"),
  platform: text("platform").notNull(),
  status: text("status").default("active"),
  config: jsonb("config"),
  metrics: jsonb("metrics"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Bot templates remain global (no organizationId)
export const botTemplates = pgTable("bot_templates", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  category: text("category").notNull(),
  platform: text("platform").notNull(),
  isPremium: boolean("is_premium").default(false),
  price: decimal("price", { precision: 10, scale: 2 }),
  rating: decimal("rating", { precision: 3, scale: 2 }).default("0"),
  reviewCount: integer("review_count").default(0),
  config: jsonb("config"),
  imageUrl: text("image_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const analytics = pgTable("analytics", {
  id: serial("id").primaryKey(),
  organizationId: text("organization_id").notNull().references(() => organizations.id, { onDelete: "cascade" }),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  botId: integer("bot_id").references(() => bots.id, { onDelete: "set null" }),
  date: timestamp("date").defaultNow(),
  revenue: decimal("revenue", { precision: 10, scale: 2 }).default("0"),
  engagement: decimal("engagement", { precision: 5, scale: 2 }).default("0"),
  posts: integer("posts").default(0),
  clicks: integer("clicks").default(0),
  conversions: integer("conversions").default(0),
});

// NEW: Posts tracking for usage limits
export const posts = pgTable("posts", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  organizationId: text("organization_id").notNull().references(() => organizations.id, { onDelete: "cascade" }),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  botId: integer("bot_id").references(() => bots.id, { onDelete: "set null" }),
  socialAccountId: integer("social_account_id").notNull().references(() => socialAccounts.id, { onDelete: "cascade" }),
  platform: text("platform").notNull(),
  content: text("content").notNull(),
  status: text("status").notNull().default("draft"), // draft, scheduled, published, failed
  scheduledFor: timestamp("scheduled_for"),
  publishedAt: timestamp("published_at"),
  externalPostId: text("external_post_id"), // Platform's post ID
  metrics: jsonb("metrics").$type<{
    likes?: number;
    shares?: number;
    comments?: number;
    reach?: number;
  }>(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// NEW: Invitations for team management
export const invitations = pgTable("invitations", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  organizationId: text("organization_id").notNull().references(() => organizations.id, { onDelete: "cascade" }),
  email: text("email").notNull(),
  role: text("role").notNull().default("member"),
  token: text("token").notNull().unique(),
  invitedBy: integer("invited_by").notNull().references(() => users.id),
  status: text("status").notNull().default("pending"), // pending, accepted, expired
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Insert schemas
export const insertOrganizationSchema = createInsertSchema(organizations).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertSubscriptionSchema = createInsertSchema(subscriptions).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertClientSchema = createInsertSchema(clients).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertSocialAccountSchema = createInsertSchema(socialAccounts).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertBotSchema = createInsertSchema(bots).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertPostSchema = createInsertSchema(posts).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertInvitationSchema = createInsertSchema(invitations).omit({
  id: true,
  createdAt: true,
});

// Types
export type Organization = typeof organizations.$inferSelect;
export type InsertOrganization = z.infer<typeof insertOrganizationSchema>;

export type Subscription = typeof subscriptions.$inferSelect;
export type InsertSubscription = z.infer<typeof insertSubscriptionSchema>;

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Client = typeof clients.$inferSelect;
export type InsertClient = z.infer<typeof insertClientSchema>;

export type SocialAccount = typeof socialAccounts.$inferSelect;
export type InsertSocialAccount = z.infer<typeof insertSocialAccountSchema>;

export type Bot = typeof bots.$inferSelect;
export type InsertBot = z.infer<typeof insertBotSchema>;

export type Post = typeof posts.$inferSelect;
export type InsertPost = z.infer<typeof insertPostSchema>;

export type Invitation = typeof invitations.$inferSelect;
export type InsertInvitation = z.infer<typeof insertInvitationSchema>;

// Plan definitions
export const PLANS = {
  trial: {
    name: "Trial",
    price: 0,
    currency: "GBP",
    interval: "month",
    limits: {
      socialAccounts: 1,
      postsPerMonth: 10,
      users: 1
    }
  },
  starter: {
    name: "Starter",
    price: 29,
    currency: "GBP", 
    interval: "month",
    stripePriceId: "price_starter_gbp_monthly", // You'll get this from Stripe
    limits: {
      socialAccounts: 3,
      postsPerMonth: 100,
      users: 1
    }
  },
  pro: {
    name: "Pro",
    price: 99,
    currency: "GBP",
    interval: "month", 
    stripePriceId: "price_pro_gbp_monthly", // You'll get this from Stripe
    limits: {
      socialAccounts: 10,
      postsPerMonth: -1, // unlimited
      users: 5
    }
  }
} as const;

export type PlanType = keyof typeof PLANS;