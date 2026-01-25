import { users, bots, botTemplates, analytics, clients, type User, type InsertUser, type Bot, type InsertBot, type BotTemplate, type InsertBotTemplate, type Analytics, type InsertAnalytics, type Client, type InsertClient } from "@shared/schema";
import { eq, sql } from "drizzle-orm";
import { db } from "./db";
import { eq, sql, and } from "drizzle-orm";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserPremiumStatus(id: number, isPremium: boolean): Promise<User>;
  updateUserStripeInfo(id: number, stripeCustomerId: string, stripeSubscriptionId: string): Promise<User>;
  incrementUserBotCount(id: number): Promise<User>;
  decrementUserBotCount(id: number): Promise<User>;

  // Client methods
  getClientsByUserId(userId: number): Promise<Client[]>;
  getClient(id: number): Promise<Client | undefined>;
  createClient(client: InsertClient): Promise<Client>;
  updateClient(id: number, updates: Partial<Client>): Promise<Client>;
  deleteClient(id: number): Promise<void>;
  getClientStats(clientId: number): Promise<{ botCount: number; totalRevenue: number }>;
  getClientRevenue(clientId: number): Promise<{ totalRevenue: number; botCount: number }>;

  // Bot methods
  getBotsByUserId(userId: number): Promise<Bot[]>;
  getBotsByClientId(clientId: number): Promise<Bot[]>;
  getBot(id: number): Promise<Bot | undefined>;
  createBot(bot: InsertBot): Promise<Bot>;
  updateBot(id: number, updates: Partial<Bot>): Promise<Bot>;
  updateBotStatus(id: number, status: string): Promise<Bot>;
  deleteBot(id: number): Promise<void>;

  // Bot Template methods
  getAllBotTemplates(): Promise<BotTemplate[]>;
  getBotTemplatesByCategory(category: string): Promise<BotTemplate[]>;
  getBotTemplate(id: number): Promise<BotTemplate | undefined>;
  createBotTemplate(template: InsertBotTemplate): Promise<BotTemplate>;

  // Analytics methods
  getAnalyticsByUserId(userId: number): Promise<Analytics[]>;
  getAnalyticsByBotId(botId: number): Promise<Analytics[]>;
  createAnalytics(analytics: InsertAnalytics): Promise<Analytics>;
  getRevenueMetrics(userId: number): Promise<{ totalRevenue: number; monthlyGrowth: number }>;
  getEngagementMetrics(userId: number): Promise<{ avgEngagement: number; totalPosts: number }>;
}

export class DatabaseStorage implements IStorage {
  private db: any;

  constructor() {
    // Dynamically import db to avoid loading it when using MemStorage
    const { db } = require("./db");
    this.db = db;
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await this.db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await this.db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await this.db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await this.db.insert(users).values(insertUser).returning();
    return user;
  }

  async updateUserPremiumStatus(id: number, isPremium: boolean): Promise<User> {
    const [user] = await this.db
      .update(users)
      .set({ isPremium })
      .where(eq(users.id, id))
      .returning();
    return user;
  }

  async updateUserStripeInfo(id: number, stripeCustomerId: string, stripeSubscriptionId: string): Promise<User> {
    const [user] = await this.db
      .update(users)
      .set({ stripeCustomerId, stripeSubscriptionId })
      .where(eq(users.id, id))
      .returning();
    return user;
  }

  async incrementUserBotCount(id: number): Promise<User> {
    const [user] = await this.db
      .update(users)
      .set({ botCount: sql`${users.botCount} + 1` })
      .where(eq(users.id, id))
      .returning();
    return user;
  }

  async decrementUserBotCount(id: number): Promise<User> {
    const [user] = await this.db
      .update(users)
      .set({ botCount: sql`${users.botCount} - 1` })
      .where(eq(users.id, id))
      .returning();
    return user;
  }

  // Client methods
  async getClientsByUserId(userId: number): Promise<Client[]> {
    return await this.db.select().from(clients).where(eq(clients.userId, userId));
  }

  async getClient(id: number): Promise<Client | undefined> {
    const [client] = await this.db.select().from(clients).where(eq(clients.id, id));
    return await db.select().from(clients).where(eq(clients.userId, userId));
  }

  async getClient(id: number): Promise<Client | undefined> {
    const [client] = await db.select().from(clients).where(eq(clients.id, id));
    return client || undefined;
  }

  async createClient(insertClient: InsertClient): Promise<Client> {
    const [client] = await this.db.insert(clients).values(insertClient).returning();
    const [client] = await db.insert(clients).values(insertClient).returning();
    return client;
  }

  async updateClient(id: number, updates: Partial<Client>): Promise<Client> {
    const [client] = await this.db
    const [client] = await db
      .update(clients)
      .set(updates)
      .where(eq(clients.id, id))
      .returning();
    return client;
  }

  async deleteClient(id: number): Promise<void> {
    await this.db.delete(clients).where(eq(clients.id, id));
  }

  async getClientStats(clientId: number): Promise<{ botCount: number; totalRevenue: number }> {
    const clientBots = await this.getBotsByClientId(clientId);
    const botCount = clientBots.length;

    // Calculate total revenue from all bots for this client
    let totalRevenue = 0;
    for (const bot of clientBots) {
      const botAnalytics = await this.getAnalyticsByBotId(bot.id);
      totalRevenue += botAnalytics.reduce((sum, a) => sum + parseFloat(a.revenue || "0"), 0);
    }

    return { botCount, totalRevenue };
    await db.delete(bots).where(eq(bots.clientId, id));
    await db.delete(clients).where(eq(clients.id, id));
  }

  async getClientRevenue(clientId: number): Promise<{ totalRevenue: number; botCount: number }> {
    const clientBots = await db.select().from(bots).where(eq(bots.clientId, clientId));
    const botIds = clientBots.map(b => b.id);
    
    let totalRevenue = 0;
    for (const botId of botIds) {
      const botAnalytics = await db.select().from(analytics).where(eq(analytics.botId, botId));
      totalRevenue += botAnalytics.reduce((sum, a) => sum + parseFloat(a.revenue || "0"), 0);
    }
    
    return { totalRevenue, botCount: clientBots.length };
  }

  // Bot methods
  async getBotsByClientId(clientId: number): Promise<Bot[]> {
    return await this.db.select().from(bots).where(eq(bots.clientId, clientId));
  }
  async getBotsByUserId(userId: number): Promise<Bot[]> {
    return await this.db.select().from(bots).where(eq(bots.userId, userId));
  }

  async getBotsByClientId(clientId: number): Promise<Bot[]> {
    return await db.select().from(bots).where(eq(bots.clientId, clientId));
  }

  async getBot(id: number): Promise<Bot | undefined> {
    const [bot] = await this.db.select().from(bots).where(eq(bots.id, id));
    return bot || undefined;
  }

  async createBot(insertBot: InsertBot): Promise<Bot> {
    const [bot] = await this.db.insert(bots).values(insertBot).returning();
    return bot;
  }

  async updateBot(id: number, updates: Partial<Bot>): Promise<Bot> {
    const [bot] = await this.db
      .update(bots)
      .set(updates)
      .where(eq(bots.id, id))
      .returning();
    return bot;
  }

  async updateBotStatus(id: number, status: string): Promise<Bot> {
    const [bot] = await this.db.update(bots).set({ status }).where(eq(bots.id, id)).returning();
    return bot;
  }

  async deleteBot(id: number): Promise<void> {
    await this.db.delete(bots).where(eq(bots.id, id));
  }

  // Bot Template methods
  async getAllBotTemplates(): Promise<BotTemplate[]> {
    return await this.db.select().from(botTemplates);
  }

  async getBotTemplatesByCategory(category: string): Promise<BotTemplate[]> {
    return await this.db.select().from(botTemplates).where(eq(botTemplates.category, category));
  }

  async getBotTemplate(id: number): Promise<BotTemplate | undefined> {
    const [template] = await this.db.select().from(botTemplates).where(eq(botTemplates.id, id));
    return template || undefined;
  }

  async createBotTemplate(insertTemplate: InsertBotTemplate): Promise<BotTemplate> {
    const [template] = await this.db.insert(botTemplates).values(insertTemplate).returning();
    return template;
  }

  // Analytics methods
  async getAnalyticsByUserId(userId: number): Promise<Analytics[]> {
    return await this.db.select().from(analytics).where(eq(analytics.userId, userId));
  }

  async getAnalyticsByBotId(botId: number): Promise<Analytics[]> {
    return await this.db.select().from(analytics).where(eq(analytics.botId, botId));
  }

  async createAnalytics(insertAnalytics: InsertAnalytics): Promise<Analytics> {
    const [analytic] = await this.db.insert(analytics).values(insertAnalytics).returning();
    return analytic;
  }

  async getRevenueMetrics(userId: number): Promise<{ totalRevenue: number; monthlyGrowth: number }> {
    const result = await this.db
      .select({
        totalRevenue: sql<number>`COALESCE(SUM(${analytics.revenue}), 0)`,
        monthlyGrowth: sql<number>`25.5`
      })
      .from(analytics)
      .where(eq(analytics.userId, userId));

    return result[0] || { totalRevenue: 0, monthlyGrowth: 0 };
  }

  async getEngagementMetrics(userId: number): Promise<{ avgEngagement: number; totalPosts: number }> {
    const result = await this.db
      .select({
        avgEngagement: sql<number>`COALESCE(AVG(${analytics.engagement}), 0)`,
        totalPosts: sql<number>`COALESCE(SUM(${analytics.posts}), 0)`
      })
      .from(analytics)
      .where(eq(analytics.userId, userId));

    return result[0] || { avgEngagement: 0, totalPosts: 0 };
  }
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private clients: Map<number, Client>;
  private bots: Map<number, Bot>;
  private botTemplates: Map<number, BotTemplate>;
  private analytics: Map<number, Analytics>;
  private currentUserId: number;
  private currentClientId: number;
  private currentBotId: number;
  private currentTemplateId: number;
  private currentAnalyticsId: number;

  constructor() {
    this.users = new Map();
    this.clients = new Map();
    this.bots = new Map();
    this.botTemplates = new Map();
    this.analytics = new Map();
    this.currentUserId = 1;
    this.currentClientId = 1;
    this.currentBotId = 1;
    this.currentTemplateId = 1;
    this.currentAnalyticsId = 1;

    // Initialize with sample data
    this.initializeSampleTemplates();
    this.initializeSampleUser();
  }

  private initializeSampleTemplates() {
    const templates: BotTemplate[] = [
      {
        id: this.currentTemplateId++,
        name: "TikTok Product Booster Pro",
        description: "Advanced viral video creator with AI-powered trend analysis and auto-posting for maximum e-commerce conversions",
        category: "E-commerce",
        platform: "tiktok",
        isPremium: true,
        price: "29.00",
        rating: "4.9",
        reviewCount: 127,
        config: { autoPosting: true, trendAnalysis: true, viralOptimization: true, ecommerceTracking: true },
        imageUrl: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200",
        createdAt: new Date(),
      },
      {
        id: this.currentTemplateId++,
        name: "Instagram Story Scheduler",
        description: "Automated daily story posts with product highlights and swipe-up links for sales conversion",
        category: "E-commerce",
        platform: "instagram",
        isPremium: false,
        price: "0.00",
        rating: "4.6",
        reviewCount: 89,
        config: { storyScheduling: true, productHighlights: true, swipeUpLinks: true },
        imageUrl: "https://images.unsplash.com/photo-1468495244123-6c6c332eeece?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200",
        createdAt: new Date(),
      },
      {
        id: this.currentTemplateId++,
        name: "Beauty Brand Amplifier",
        description: "Multi-platform posting with influencer-style content and auto-engagement for beauty products",
        category: "Beauty",
        platform: "multi",
        isPremium: true,
        price: "39.00",
        rating: "4.8",
        reviewCount: 203,
        config: { multiPlatform: true, influencerStyle: true, autoEngagement: true, beautyFocused: true },
        imageUrl: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200",
        createdAt: new Date(),
      },
      {
        id: this.currentTemplateId++,
        name: "Fashion Trend Hunter",
        description: "AI-driven fashion content creator that spots trends and creates viral fashion posts automatically",
        category: "Fashion",
        platform: "instagram",
        isPremium: true,
        price: "35.00",
        rating: "4.7",
        reviewCount: 156,
        config: { trendHunting: true, fashionAI: true, outfitGeneration: true, seasonalContent: true },
        imageUrl: "https://images.unsplash.com/photo-1445205170230-053b83016050?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200",
        createdAt: new Date(),
      },
      {
        id: this.currentTemplateId++,
        name: "Tech Product Showcase",
        description: "Showcase tech products with detailed specs, demos, and customer testimonials across platforms",
        category: "Technology",
        platform: "multi",
        isPremium: true,
        price: "45.00",
        rating: "4.9",
        reviewCount: 234,
        config: { techFocused: true, productDemos: true, testimonials: true, specsHighlight: true },
        imageUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200",
        createdAt: new Date(),
      },
      {
        id: this.currentTemplateId++,
        name: "E-commerce Flash Sales",
        description: "Create urgency with flash sale announcements, countdown timers, and limited-time offers",
        category: "E-commerce",
        platform: "multi",
        isPremium: false,
        price: "0.00",
        rating: "4.5",
        reviewCount: 98,
        config: { flashSales: true, countdownTimers: true, urgencyMarketing: true, multiPlatform: true },
        imageUrl: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200",
        createdAt: new Date(),
      }
    ];

    templates.forEach(template => {
      this.botTemplates.set(template.id, template);
    });
  }

  private initializeSampleUser() {
    // Create a mock user for development
    const mockUser: User = {
      id: 1,
      username: "demo_user",
      password: "password",
      email: "demo@smartflowai.com",
      isPremium: false,
      botCount: 0,
      stripeCustomerId: null,
      stripeSubscriptionId: null,
      createdAt: new Date()
    };
    this.users.set(1, mockUser);
    
    // Add some sample analytics data
    const sampleAnalytics = [
      {
        id: this.currentAnalyticsId++,
        userId: 1,
        botId: null,
        date: new Date(),
        revenue: "2450.00",
        engagement: "4.7",
        posts: 48,
        clicks: 1240,
        conversions: 67
      },
      {
        id: this.currentAnalyticsId++,
        userId: 1,
        botId: null,
        date: new Date(Date.now() - 24 * 60 * 60 * 1000), // Yesterday
        revenue: "2100.00",
        engagement: "4.2",
        posts: 42,
        clicks: 1150,
        conversions: 58
      }
    ];
    
    sampleAnalytics.forEach(analytics => {
      this.analytics.set(analytics.id, analytics);
    });
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { 
      ...insertUser, 
      id, 
      email: insertUser.email || null,
      isPremium: false,
      botCount: 0,
      stripeCustomerId: null,
      stripeSubscriptionId: null,
      createdAt: new Date()
    };
    this.users.set(id, user);
    return user;
  }

  async updateUserPremiumStatus(id: number, isPremium: boolean): Promise<User> {
    const user = this.users.get(id);
    if (!user) throw new Error("User not found");
    const updatedUser = { ...user, isPremium };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async updateUserStripeInfo(id: number, stripeCustomerId: string, stripeSubscriptionId: string): Promise<User> {
    const user = this.users.get(id);
    if (!user) throw new Error("User not found");
    const updatedUser = { ...user, stripeCustomerId, stripeSubscriptionId, isPremium: true };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async incrementUserBotCount(id: number): Promise<User> {
    const user = this.users.get(id);
    if (!user) throw new Error("User not found");
    const updatedUser = { ...user, botCount: (user.botCount || 0) + 1 };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async decrementUserBotCount(id: number): Promise<User> {
    const user = this.users.get(id);
    if (!user) throw new Error("User not found");
    const updatedUser = { ...user, botCount: Math.max(0, (user.botCount || 0) - 1) };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  // Client methods
  async getClientsByUserId(userId: number): Promise<Client[]> {
    return Array.from(this.clients.values()).filter(client => client.userId === userId);
  }

  async getClient(id: number): Promise<Client | undefined> {
    return this.clients.get(id);
  }

  async createClient(insertClient: InsertClient): Promise<Client> {
    const id = this.currentClientId++;
    const client: Client = {
      ...insertClient,
      id,
      contactEmail: insertClient.contactEmail || null,
      contactPhone: insertClient.contactPhone || null,
      status: insertClient.status || "active",
      businessName: insertClient.businessName || null,
      email: insertClient.email || null,
      phone: insertClient.phone || null,
      industry: insertClient.industry || null,
      monthlyFee: insertClient.monthlyFee || "0",
      status: insertClient.status || "active",
      notes: insertClient.notes || null,
      createdAt: new Date()
    };
    this.clients.set(id, client);
    return client;
  }

  async updateClient(id: number, updates: Partial<Client>): Promise<Client> {
    const client = this.clients.get(id);
    if (!client) throw new Error("Client not found");
    const updatedClient = { ...client, ...updates };
    this.clients.set(id, updatedClient);
    return updatedClient;
  }

  async deleteClient(id: number): Promise<void> {
    this.clients.delete(id);
  }

  async getClientStats(clientId: number): Promise<{ botCount: number; totalRevenue: number }> {
    const clientBots = await this.getBotsByClientId(clientId);
    const botCount = clientBots.length;

    let totalRevenue = 0;
    for (const bot of clientBots) {
      const botAnalytics = await this.getAnalyticsByBotId(bot.id);
      totalRevenue += botAnalytics.reduce((sum, a) => sum + parseFloat(a.revenue || "0"), 0);
    }

    return { botCount, totalRevenue };
    const clientBots = Array.from(this.bots.values()).filter(bot => bot.clientId === id);
    clientBots.forEach(bot => this.bots.delete(bot.id));
    this.clients.delete(id);
  }

  async getClientRevenue(clientId: number): Promise<{ totalRevenue: number; botCount: number }> {
    const clientBots = Array.from(this.bots.values()).filter(bot => bot.clientId === clientId);
    let totalRevenue = 0;
    for (const bot of clientBots) {
      const botAnalytics = Array.from(this.analytics.values()).filter(a => a.botId === bot.id);
      totalRevenue += botAnalytics.reduce((sum, a) => sum + parseFloat(a.revenue || "0"), 0);
    }
    return { totalRevenue, botCount: clientBots.length };
  }

  // Bot methods
  async getBotsByClientId(clientId: number): Promise<Bot[]> {
    return Array.from(this.bots.values()).filter(bot => bot.clientId === clientId);
  }
  async getBotsByUserId(userId: number): Promise<Bot[]> {
    return Array.from(this.bots.values()).filter(bot => bot.userId === userId);
  }

  async getBotsByClientId(clientId: number): Promise<Bot[]> {
    return Array.from(this.bots.values()).filter(bot => bot.clientId === clientId);
  }

  async getBot(id: number): Promise<Bot | undefined> {
    return this.bots.get(id);
  }

  async createBot(insertBot: InsertBot): Promise<Bot> {
    const id = this.currentBotId++;
    const bot: Bot = {
      ...insertBot,
      id,
    const bot: Bot = { 
      ...insertBot, 
      id, 
      clientId: insertBot.clientId || null,
      description: insertBot.description || null,
      config: insertBot.config || null,
      status: "active",
      metrics: { posts: 0, engagement: 0, conversions: 0 },
      createdAt: new Date()
    };
    this.bots.set(id, bot);
    return bot;
  }

  async updateBot(id: number, updates: Partial<Bot>): Promise<Bot> {
    const bot = this.bots.get(id);
    if (!bot) throw new Error("Bot not found");
    const updatedBot = { ...bot, ...updates };
    this.bots.set(id, updatedBot);
    return updatedBot;
  }

  async updateBotStatus(id: number, status: string): Promise<Bot> {
    const bot = this.bots.get(id);
    if (!bot) throw new Error("Bot not found");
    const updatedBot = { ...bot, status };
    this.bots.set(id, updatedBot);
    return updatedBot;
  }

  async deleteBot(id: number): Promise<void> {
    this.bots.delete(id);
  }

  // Bot Template methods
  async getAllBotTemplates(): Promise<BotTemplate[]> {
    return Array.from(this.botTemplates.values());
  }

  async getBotTemplatesByCategory(category: string): Promise<BotTemplate[]> {
    return Array.from(this.botTemplates.values()).filter(template => template.category === category);
  }

  async getBotTemplate(id: number): Promise<BotTemplate | undefined> {
    return this.botTemplates.get(id);
  }

  async createBotTemplate(insertTemplate: InsertBotTemplate): Promise<BotTemplate> {
    const id = this.currentTemplateId++;
    const template: BotTemplate = { 
      ...insertTemplate, 
      id, 
      description: insertTemplate.description || null,
      isPremium: insertTemplate.isPremium || false,
      price: insertTemplate.price || null,
      imageUrl: insertTemplate.imageUrl || null,
      config: insertTemplate.config || null,
      rating: "0.0",
      reviewCount: 0,
      createdAt: new Date()
    };
    this.botTemplates.set(id, template);
    return template;
  }

  // Analytics methods
  async getAnalyticsByUserId(userId: number): Promise<Analytics[]> {
    return Array.from(this.analytics.values()).filter(analytics => analytics.userId === userId);
  }

  async getAnalyticsByBotId(botId: number): Promise<Analytics[]> {
    return Array.from(this.analytics.values()).filter(analytics => analytics.botId === botId);
  }

  async createAnalytics(insertAnalytics: InsertAnalytics): Promise<Analytics> {
    const id = this.currentAnalyticsId++;
    const analytics: Analytics = { 
      ...insertAnalytics, 
      id, 
      botId: insertAnalytics.botId || null,
      revenue: insertAnalytics.revenue || "0",
      engagement: insertAnalytics.engagement || "0",
      posts: insertAnalytics.posts || 0,
      clicks: insertAnalytics.clicks || 0,
      conversions: insertAnalytics.conversions || 0,
      date: new Date()
    };
    this.analytics.set(id, analytics);
    return analytics;
  }

  async getRevenueMetrics(userId: number): Promise<{ totalRevenue: number; monthlyGrowth: number }> {
    const userAnalytics = await this.getAnalyticsByUserId(userId);
    const totalRevenue = userAnalytics.reduce((sum, a) => sum + parseFloat(a.revenue || "0"), 0);
    return { totalRevenue, monthlyGrowth: 18 }; // Mock growth percentage
  }

  async getEngagementMetrics(userId: number): Promise<{ avgEngagement: number; totalPosts: number }> {
    const userAnalytics = await this.getAnalyticsByUserId(userId);
    const totalPosts = userAnalytics.reduce((sum, a) => sum + (a.posts || 0), 0);
    const avgEngagement = userAnalytics.length > 0 
      ? userAnalytics.reduce((sum, a) => sum + parseFloat(a.engagement || "0"), 0) / userAnalytics.length
      : 0;
    return { avgEngagement, totalPosts };
  }
}

// Use MemStorage in development when DATABASE_URL is not set
export const storage = process.env.DATABASE_URL ? new DatabaseStorage() : new MemStorage();
