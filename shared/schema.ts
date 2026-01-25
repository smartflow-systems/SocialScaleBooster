import { pgTable, text, serial, integer, boolean, timestamp, decimal, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email"),
  isPremium: boolean("is_premium").default(false),
  stripeCustomerId: text("stripe_customer_id"),
  stripeSubscriptionId: text("stripe_subscription_id"),
  botCount: integer("bot_count").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

export const clients = pgTable("clients", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
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
});

export const bots = pgTable("bots", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  clientId: integer("client_id").references(() => clients.id), // Link bot to a client
  name: text("name").notNull(),
  description: text("description"),
  platform: text("platform").notNull(),
  status: text("status").default("active"),
  config: jsonb("config"),
  metrics: jsonb("metrics"),
  createdAt: timestamp("created_at").defaultNow(),
});

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
  config: jsonb("config"), // Template configuration
  imageUrl: text("image_url"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const analytics = pgTable("analytics", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  botId: integer("bot_id").references(() => bots.id),
  date: timestamp("date").defaultNow(),
  revenue: decimal("revenue", { precision: 10, scale: 2 }).default("0"),
  engagement: decimal("engagement", { precision: 5, scale: 2 }).default("0"),
  posts: integer("posts").default(0),
  clicks: integer("clicks").default(0),
  conversions: integer("conversions").default(0),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertClientSchema = createInsertSchema(clients).omit({
  id: true,
  createdAt: true,
});

export const insertBotSchema = createInsertSchema(bots).omit({
  id: true,
  createdAt: true,
});

export const insertBotTemplateSchema = createInsertSchema(botTemplates).omit({
  id: true,
  createdAt: true,
});

export const insertAnalyticsSchema = createInsertSchema(analytics).omit({
  id: true,
  date: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertClient = z.infer<typeof insertClientSchema>;
export type Client = typeof clients.$inferSelect;
export type InsertBot = z.infer<typeof insertBotSchema>;
export type Bot = typeof bots.$inferSelect;
export type InsertBotTemplate = z.infer<typeof insertBotTemplateSchema>;
export type BotTemplate = typeof botTemplates.$inferSelect;
export type InsertAnalytics = z.infer<typeof insertAnalyticsSchema>;
export type Analytics = typeof analytics.$inferSelect;
