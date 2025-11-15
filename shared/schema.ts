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

export const bots = pgTable("bots", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  name: text("name").notNull(),
  description: text("description"),
  platform: text("platform").notNull(), // 'tiktok', 'instagram', 'facebook', 'twitter', 'youtube'
  status: text("status").default("active"), // 'active', 'paused', 'stopped'
  config: jsonb("config"), // Bot configuration settings
  metrics: jsonb("metrics"), // Performance metrics
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
export type InsertBot = z.infer<typeof insertBotSchema>;
export type Bot = typeof bots.$inferSelect;
export type InsertBotTemplate = z.infer<typeof insertBotTemplateSchema>;
export type BotTemplate = typeof botTemplates.$inferSelect;
export type InsertAnalytics = z.infer<typeof insertAnalyticsSchema>;
export type Analytics = typeof analytics.$inferSelect;

// A/B Testing Tables
export const abTests = pgTable("ab_tests", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  botId: integer("bot_id").references(() => bots.id),
  name: text("name").notNull(),
  description: text("description"),
  status: text("status").default("active"), // 'active', 'paused', 'completed'
  variantA: jsonb("variant_a").notNull(), // Content/config for variant A
  variantB: jsonb("variant_b").notNull(), // Content/config for variant B
  results: jsonb("results"), // Test results and metrics
  winner: text("winner"), // 'A', 'B', or null
  startDate: timestamp("start_date").defaultNow(),
  endDate: timestamp("end_date"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Notifications Table
export const notifications = pgTable("notifications", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  type: text("type").notNull(), // 'info', 'success', 'warning', 'error', 'milestone'
  title: text("title").notNull(),
  message: text("message").notNull(),
  isRead: boolean("is_read").default(false),
  data: jsonb("data"), // Additional context data
  createdAt: timestamp("created_at").defaultNow(),
});

// Content Suggestions Table (AI-powered)
export const contentSuggestions = pgTable("content_suggestions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  botId: integer("bot_id").references(() => bots.id),
  platform: text("platform").notNull(),
  suggestedContent: text("suggested_content").notNull(),
  reasoning: text("reasoning"), // Why this content was suggested
  estimatedEngagement: decimal("estimated_engagement", { precision: 5, scale: 2 }),
  tags: jsonb("tags"), // Content tags/categories
  status: text("status").default("pending"), // 'pending', 'accepted', 'rejected', 'posted'
  createdAt: timestamp("created_at").defaultNow(),
});

// Community Posts Table
export const communityPosts = pgTable("community_posts", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  title: text("title").notNull(),
  content: text("content").notNull(),
  category: text("category").notNull(), // 'strategy', 'success-story', 'question', 'template'
  upvotes: integer("upvotes").default(0),
  views: integer("views").default(0),
  isVerified: boolean("is_verified").default(false), // Verified success stories
  tags: jsonb("tags"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Community Comments
export const communityComments = pgTable("community_comments", {
  id: serial("id").primaryKey(),
  postId: integer("post_id").notNull().references(() => communityPosts.id),
  userId: integer("user_id").notNull().references(() => users.id),
  content: text("content").notNull(),
  upvotes: integer("upvotes").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

// Leaderboard/User Stats
export const userStats = pgTable("user_stats", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  totalRevenue: decimal("total_revenue", { precision: 10, scale: 2 }).default("0"),
  totalEngagement: integer("total_engagement").default(0),
  totalPosts: integer("total_posts").default(0),
  rank: integer("rank"),
  achievements: jsonb("achievements"), // Array of achievement objects
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Scheduled Posts
export const scheduledPosts = pgTable("scheduled_posts", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  botId: integer("bot_id").notNull().references(() => bots.id),
  content: text("content").notNull(),
  platform: text("platform").notNull(),
  scheduledFor: timestamp("scheduled_for").notNull(),
  timezone: text("timezone").default("UTC"),
  status: text("status").default("pending"), // 'pending', 'posted', 'failed', 'cancelled'
  result: jsonb("result"), // Post result data
  createdAt: timestamp("created_at").defaultNow(),
});

// Brand Kits
export const brandKits = pgTable("brand_kits", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  name: text("name").notNull(),
  primaryColor: text("primary_color"),
  secondaryColor: text("secondary_color"),
  accentColor: text("accent_color"),
  logo: text("logo_url"),
  fonts: jsonb("fonts"), // Font configurations
  templates: jsonb("templates"), // Custom templates
  guidelines: text("guidelines"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Webhook Configurations
export const webhooks = pgTable("webhooks", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  url: text("url").notNull(),
  events: jsonb("events").notNull(), // Array of event types to listen for
  secret: text("secret"),
  isActive: boolean("is_active").default(true),
  lastTriggered: timestamp("last_triggered"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Performance Benchmarks
export const performanceBenchmarks = pgTable("performance_benchmarks", {
  id: serial("id").primaryKey(),
  platform: text("platform").notNull(),
  category: text("category").notNull(), // e.g., 'E-commerce', 'Beauty'
  metric: text("metric").notNull(), // e.g., 'engagement_rate', 'conversion_rate'
  averageValue: decimal("average_value", { precision: 10, scale: 2 }).notNull(),
  topPercentile: decimal("top_percentile", { precision: 10, scale: 2 }),
  sampleSize: integer("sample_size"),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Create insert schemas
export const insertAbTestSchema = createInsertSchema(abTests).omit({
  id: true,
  createdAt: true,
});

export const insertNotificationSchema = createInsertSchema(notifications).omit({
  id: true,
  createdAt: true,
});

export const insertContentSuggestionSchema = createInsertSchema(contentSuggestions).omit({
  id: true,
  createdAt: true,
});

export const insertCommunityPostSchema = createInsertSchema(communityPosts).omit({
  id: true,
  createdAt: true,
});

export const insertCommunityCommentSchema = createInsertSchema(communityComments).omit({
  id: true,
  createdAt: true,
});

export const insertUserStatsSchema = createInsertSchema(userStats).omit({
  id: true,
  updatedAt: true,
});

export const insertScheduledPostSchema = createInsertSchema(scheduledPosts).omit({
  id: true,
  createdAt: true,
});

export const insertBrandKitSchema = createInsertSchema(brandKits).omit({
  id: true,
  createdAt: true,
});

export const insertWebhookSchema = createInsertSchema(webhooks).omit({
  id: true,
  createdAt: true,
});

export const insertPerformanceBenchmarkSchema = createInsertSchema(performanceBenchmarks).omit({
  id: true,
  updatedAt: true,
});

// Export types
export type AbTest = typeof abTests.$inferSelect;
export type InsertAbTest = z.infer<typeof insertAbTestSchema>;
export type Notification = typeof notifications.$inferSelect;
export type InsertNotification = z.infer<typeof insertNotificationSchema>;
export type ContentSuggestion = typeof contentSuggestions.$inferSelect;
export type InsertContentSuggestion = z.infer<typeof insertContentSuggestionSchema>;
export type CommunityPost = typeof communityPosts.$inferSelect;
export type InsertCommunityPost = z.infer<typeof insertCommunityPostSchema>;
export type CommunityComment = typeof communityComments.$inferSelect;
export type InsertCommunityComment = z.infer<typeof insertCommunityCommentSchema>;
export type UserStats = typeof userStats.$inferSelect;
export type InsertUserStats = z.infer<typeof insertUserStatsSchema>;
export type ScheduledPost = typeof scheduledPosts.$inferSelect;
export type InsertScheduledPost = z.infer<typeof insertScheduledPostSchema>;
export type BrandKit = typeof brandKits.$inferSelect;
export type InsertBrandKit = z.infer<typeof insertBrandKitSchema>;
export type Webhook = typeof webhooks.$inferSelect;
export type InsertWebhook = z.infer<typeof insertWebhookSchema>;
export type PerformanceBenchmark = typeof performanceBenchmarks.$inferSelect;
export type InsertPerformanceBenchmark = z.infer<typeof insertPerformanceBenchmarkSchema>;

// Team Members Table
export const teamMembers = pgTable("team_members", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id), // Team owner
  memberId: integer("member_id").notNull().references(() => users.id), // Team member
  name: text("name").notNull(),
  email: text("email").notNull(),
  role: text("role").notNull(), // 'owner', 'admin', 'manager', 'creator', 'viewer'
  permissions: jsonb("permissions").notNull(), // Array of permissions
  joinedAt: timestamp("joined_at").defaultNow(),
});

// Content Approvals Table
export const contentApprovals = pgTable("content_approvals", {
  id: serial("id").primaryKey(),
  contentId: text("content_id").notNull(),
  contentType: text("content_type").notNull(), // 'post', 'scheduled_post', 'suggestion'
  submittedBy: integer("submitted_by").notNull().references(() => users.id),
  reviewedBy: integer("reviewed_by").references(() => users.id),
  status: text("status").default("pending"), // 'pending', 'approved', 'rejected', 'needs_changes'
  comments: text("comments"),
  submittedAt: timestamp("submitted_at").defaultNow(),
  reviewedAt: timestamp("reviewed_at"),
});

// Competitors Table
export const competitors = pgTable("competitors", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  name: text("name").notNull(),
  platform: text("platform").notNull(),
  handle: text("handle").notNull(),
  profileUrl: text("profile_url"),
  followers: integer("followers").default(0),
  engagementRate: decimal("engagement_rate", { precision: 5, scale: 2 }),
  metrics: jsonb("metrics"), // Various metrics data
  addedAt: timestamp("added_at").defaultNow(),
  lastScrapedAt: timestamp("last_scraped_at"),
});

// Influencers Table
export const influencers = pgTable("influencers", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  name: text("name").notNull(),
  platform: text("platform").notNull(),
  handle: text("handle").notNull(),
  followers: integer("followers").default(0),
  engagementRate: decimal("engagement_rate", { precision: 5, scale: 2 }),
  niche: text("niche"),
  email: text("email"),
  contactStatus: text("contact_status").default("not_contacted"), // 'not_contacted', 'contacted', 'interested', 'declined', 'partnered'
  lastContactedAt: timestamp("last_contacted_at"),
  metrics: jsonb("metrics"),
  addedAt: timestamp("added_at").defaultNow(),
});

// Outreach Campaigns Table
export const outreachCampaigns = pgTable("outreach_campaigns", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  name: text("name").notNull(),
  description: text("description"),
  targetNiche: text("target_niche"),
  messageTemplate: text("message_template").notNull(),
  status: text("status").default("active"), // 'active', 'paused', 'completed'
  sentCount: integer("sent_count").default(0),
  responseCount: integer("response_count").default(0),
  partnerCount: integer("partner_count").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

// Trends Table
export const trends = pgTable("trends", {
  id: serial("id").primaryKey(),
  trendId: text("trend_id").notNull().unique(),
  title: text("title").notNull(),
  type: text("type").notNull(), // 'hashtag', 'sound', 'challenge', 'topic', 'meme'
  platform: text("platform").notNull(),
  volume: integer("volume").default(0),
  growth: integer("growth").default(0), // Growth percentage
  estimatedPeak: timestamp("estimated_peak"),
  relevanceScore: integer("relevance_score").default(0),
  metadata: jsonb("metadata"), // Additional trend data
  detectedAt: timestamp("detected_at").defaultNow(),
});

// Trend Alerts Table
export const trendAlerts = pgTable("trend_alerts", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  keywords: jsonb("keywords").notNull(), // Array of keywords to monitor
  platforms: jsonb("platforms").notNull(), // Array of platforms
  minimumGrowth: integer("minimum_growth").default(100),
  frequency: text("frequency").default("daily"), // 'realtime', 'hourly', 'daily'
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// Products Table (E-commerce)
export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  externalId: text("external_id"), // Shopify/WooCommerce product ID
  name: text("name").notNull(),
  description: text("description"),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  inventory: integer("inventory").default(0),
  platform: text("platform"), // 'shopify', 'woocommerce'
  imageUrl: text("image_url"),
  category: text("category"),
  tags: jsonb("tags"),
  isActive: boolean("is_active").default(true),
  syncedAt: timestamp("synced_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Cart Abandonments Table
export const cartAbandonments = pgTable("cart_abandonments", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  customerEmail: text("customer_email").notNull(),
  customerName: text("customer_name"),
  cartValue: decimal("cart_value", { precision: 10, scale: 2 }).notNull(),
  products: jsonb("products").notNull(), // Array of products in cart
  platform: text("platform").notNull(),
  recoveryStatus: text("recovery_status").default("pending"), // 'pending', 'messaged', 'recovered', 'lost'
  abandonedAt: timestamp("abandoned_at").defaultNow(),
  messagesSent: integer("messages_sent").default(0),
  lastMessageAt: timestamp("last_message_at"),
});

// Engagement Pods Table
export const engagementPods = pgTable("engagement_pods", {
  id: serial("id").primaryKey(),
  ownerId: integer("owner_id").notNull().references(() => users.id),
  name: text("name").notNull(),
  description: text("description"),
  platform: text("platform").notNull(),
  memberCount: integer("member_count").default(1),
  dailyLimit: integer("daily_limit").default(50), // Max engagements per day per member
  rules: jsonb("rules"), // Pod rules and requirements
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// Engagement Pod Members Table
export const engagementPodMembers = pgTable("engagement_pod_members", {
  id: serial("id").primaryKey(),
  podId: integer("pod_id").notNull().references(() => engagementPods.id),
  userId: integer("user_id").notNull().references(() => users.id),
  handle: text("handle").notNull(),
  status: text("status").default("active"), // 'active', 'inactive', 'removed'
  totalEngagements: integer("total_engagements").default(0),
  lastEngagementAt: timestamp("last_engagement_at"),
  joinedAt: timestamp("joined_at").defaultNow(),
});

// Content Ideas Table
export const contentIdeas = pgTable("content_ideas", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  title: text("title").notNull(),
  description: text("description").notNull(),
  type: text("type").notNull(), // 'video', 'post', 'story', 'reel'
  platform: text("platform").notNull(),
  estimatedViralScore: integer("estimated_viral_score").default(0),
  category: text("category"),
  status: text("status").default("idea"), // 'idea', 'in_progress', 'created', 'posted'
  metadata: jsonb("metadata"), // Additional data like hashtags, music suggestions, etc.
  createdAt: timestamp("created_at").defaultNow(),
});

// Create insert schemas for new tables
export const insertTeamMemberSchema = createInsertSchema(teamMembers).omit({
  id: true,
  joinedAt: true,
});

export const insertContentApprovalSchema = createInsertSchema(contentApprovals).omit({
  id: true,
  submittedAt: true,
});

export const insertCompetitorSchema = createInsertSchema(competitors).omit({
  id: true,
  addedAt: true,
});

export const insertInfluencerSchema = createInsertSchema(influencers).omit({
  id: true,
  addedAt: true,
});

export const insertOutreachCampaignSchema = createInsertSchema(outreachCampaigns).omit({
  id: true,
  createdAt: true,
});

export const insertTrendSchema = createInsertSchema(trends).omit({
  id: true,
  detectedAt: true,
});

export const insertTrendAlertSchema = createInsertSchema(trendAlerts).omit({
  id: true,
  createdAt: true,
});

export const insertProductSchema = createInsertSchema(products).omit({
  id: true,
  createdAt: true,
});

export const insertCartAbandonmentSchema = createInsertSchema(cartAbandonments).omit({
  id: true,
  abandonedAt: true,
});

export const insertEngagementPodSchema = createInsertSchema(engagementPods).omit({
  id: true,
  createdAt: true,
});

export const insertEngagementPodMemberSchema = createInsertSchema(engagementPodMembers).omit({
  id: true,
  joinedAt: true,
});

export const insertContentIdeaSchema = createInsertSchema(contentIdeas).omit({
  id: true,
  createdAt: true,
});

// Export types for new tables
export type TeamMember = typeof teamMembers.$inferSelect;
export type InsertTeamMember = z.infer<typeof insertTeamMemberSchema>;
export type ContentApproval = typeof contentApprovals.$inferSelect;
export type InsertContentApproval = z.infer<typeof insertContentApprovalSchema>;
export type Competitor = typeof competitors.$inferSelect;
export type InsertCompetitor = z.infer<typeof insertCompetitorSchema>;
export type Influencer = typeof influencers.$inferSelect;
export type InsertInfluencer = z.infer<typeof insertInfluencerSchema>;
export type OutreachCampaign = typeof outreachCampaigns.$inferSelect;
export type InsertOutreachCampaign = z.infer<typeof insertOutreachCampaignSchema>;
export type Trend = typeof trends.$inferSelect;
export type InsertTrend = z.infer<typeof insertTrendSchema>;
export type TrendAlert = typeof trendAlerts.$inferSelect;
export type InsertTrendAlert = z.infer<typeof insertTrendAlertSchema>;
export type Product = typeof products.$inferSelect;
export type InsertProduct = z.infer<typeof insertProductSchema>;
export type CartAbandonment = typeof cartAbandonments.$inferSelect;
export type InsertCartAbandonment = z.infer<typeof insertCartAbandonmentSchema>;
export type EngagementPod = typeof engagementPods.$inferSelect;
export type InsertEngagementPod = z.infer<typeof insertEngagementPodSchema>;
export type EngagementPodMember = typeof engagementPodMembers.$inferSelect;
export type InsertEngagementPodMember = z.infer<typeof insertEngagementPodMemberSchema>;
export type ContentIdea = typeof contentIdeas.$inferSelect;
export type InsertContentIdea = z.infer<typeof insertContentIdeaSchema>;
