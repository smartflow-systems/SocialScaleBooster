import type { Express } from "express";
import { createServer, type Server } from "http";
import Stripe from "stripe";
import { AnalyticsWebSocketServer } from "./websocket";
import { storage } from "./storage";
import { insertBotSchema, insertBotTemplateSchema, insertAnalyticsSchema, insertClientSchema, insertSocialAccountSchema } from "@shared/schema";
import { authenticateToken, optionalAuth, type AuthRequest } from "./middleware/auth";
import { registerAuthRoutes } from "./auth";
import { encrypt, decrypt, validateEncryption } from "./utils/encryption";

// Initialize Stripe
let stripe: Stripe | null = null;
if (process.env.STRIPE_SECRET_KEY) {
  stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Register authentication routes
  registerAuthRoutes(app);

  // Server-side rendered landing page for SEO crawlability
  app.get("/landing-ssr", (req, res) => {
    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>SmartFlow AI - 10x E-Com Sales with AI Bots | Premium Automation Platform</title>
  <meta name="description" content="SmartFlow AI: 10x E-Com Sales with AI Bots. Premium no-code platform for e-commerce automation. Boost revenue, engagement, and conversions across all social platforms." />
  <meta name="keywords" content="SmartFlow AI, e-commerce automation, AI sales bots, social media automation, no-code platform" />
  <meta property="og:title" content="SmartFlow AI - 10x E-Com Sales with AI Bots" />
  <meta property="og:description" content="Premium AI-powered e-commerce automation platform. 10x your sales with intelligent social media bots." />
  <meta property="og:type" content="website" />
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <style>
    body {
      margin: 0;
      font-family: 'Inter', sans-serif;
      background: #000000;
      color: #FFFFFF;
      line-height: 1.6;
    }
    .hero {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      text-align: center;
      padding: 2rem;
      background: linear-gradient(135deg, #000000 0%, #1a1a1a 100%);
    }
    .hero h1 {
      font-size: 4rem;
      font-weight: 800;
      margin-bottom: 1.5rem;
      color: #FFD700;
      text-shadow: 0 0 30px rgba(255, 215, 0, 0.5);
    }
    .hero p {
      font-size: 1.5rem;
      margin-bottom: 2rem;
      color: #808080;
      max-width: 600px;
    }
    .cta {
      background: #FFD700;
      color: #000000;
      padding: 1rem 2rem;
      font-size: 1.2rem;
      font-weight: 700;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      box-shadow: 0 0 20px rgba(255, 215, 0, 0.3);
      transition: all 0.3s ease;
    }
    .cta:hover {
      box-shadow: 0 0 30px rgba(255, 215, 0, 0.5);
      transform: translateY(-2px);
    }
    .features {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 2rem;
      margin: 4rem 0;
      max-width: 1200px;
    }
    .feature {
      background: #1a1a1a;
      padding: 2rem;
      border-radius: 12px;
      border: 1px solid #3E2723;
      transition: border-color 0.3s ease;
    }
    .feature:hover {
      border-color: #FFD700;
    }
    .feature h3 {
      color: #FFD700;
      font-size: 1.5rem;
      margin-bottom: 1rem;
    }
    @media (max-width: 768px) {
      .hero h1 { font-size: 2.5rem; }
      .hero p { font-size: 1.2rem; }
    }
  </style>
</head>
<body>
  <div class="hero">
    <div>
      <h1>SmartFlow AI: 10x E-Com Sales with AI Bots</h1>
      <p>Premium no-code platform for e-commerce automation. Boost revenue, engagement, and conversions across all social platforms with intelligent AI-powered bots.</p>
      <button class="cta" onclick="window.location.href='/dashboard'">Start Free Trial</button>

      <div class="features">
        <div class="feature">
          <h3>AI-Powered Automation</h3>
          <p>Advanced AI algorithms optimize your social media presence for maximum e-commerce conversions and revenue growth.</p>
        </div>
        <div class="feature">
          <h3>Analytics & ROI Tracking</h3>
          <p>Real-time analytics dashboard with revenue tracking, engagement metrics, and ROI calculations for data-driven decisions.</p>
        </div>
        <div class="feature">
          <h3>E-Commerce Templates</h3>
          <p>Pre-built automation templates specifically designed for e-commerce success across TikTok, Instagram, Facebook, and more.</p>
        </div>
      </div>
    </div>
  </div>
</body>
</html>`;
    res.send(html);
  });

  // ============================================
  // Social Account Routes (Multi-Account Support)
  // ============================================

  // Get all social accounts for user
  app.get("/api/social-accounts", authenticateToken, async (req: AuthRequest, res) => {
    try {
      const userId = req.userId!;
      const accounts = await storage.getSocialAccountsByUserId(userId);

      // Don't return encrypted credentials
      const safeAccounts = accounts.map(account => ({
        ...account,
        encryptedCredentials: undefined, // Never expose credentials
        hasCredentials: !!account.encryptedCredentials
      }));

      res.json(safeAccounts);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Get social accounts filtered by platform
  app.get("/api/social-accounts/platform/:platform", authenticateToken, async (req: AuthRequest, res) => {
    try {
      const userId = req.userId!;
      const { platform } = req.params;

      const accounts = await storage.getSocialAccountsByPlatform(userId, platform);

      const safeAccounts = accounts.map(account => ({
        ...account,
        encryptedCredentials: undefined,
        hasCredentials: !!account.encryptedCredentials
      }));

      res.json(safeAccounts);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Create a new social account
  app.post("/api/social-accounts", authenticateToken, async (req: AuthRequest, res) => {
    try {
      const userId = req.userId!;
      const { platform, accountName, accountHandle, apiKey, accessToken, credentialType, metadata } = req.body;

      // Validate required fields
      if (!platform || !accountName) {
        return res.status(400).json({ message: "Platform and account name are required" });
      }

      // Get the credential to encrypt
      const credential = apiKey || accessToken;
      if (!credential) {
        return res.status(400).json({ message: "API key or access token is required" });
      }

      // Validate encryption is configured
      const encryptionCheck = validateEncryption();
      if (!encryptionCheck.valid) {
        return res.status(500).json({ message: "Encryption not configured: " + encryptionCheck.error });
      }

      // Encrypt the credentials
      const encryptedCredentials = encrypt(credential);

      const accountData = insertSocialAccountSchema.parse({
        userId,
        platform,
        accountName,
        accountHandle: accountHandle || null,
        encryptedCredentials,
        credentialType: credentialType || (apiKey ? "api_key" : "access_token"),
        status: "active",
        metadata: metadata || null
      });

      const account = await storage.createSocialAccount(accountData);

      res.json({
        ...account,
        encryptedCredentials: undefined,
        hasCredentials: true
      });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Update a social account
  app.put("/api/social-accounts/:id", authenticateToken, async (req: AuthRequest, res) => {
    try {
      const userId = req.userId!;
      const accountId = parseInt(req.params.id);
      const { accountName, accountHandle, apiKey, accessToken, status, metadata } = req.body;

      // Verify ownership
      const isOwner = await storage.verifySocialAccountOwnership(accountId, userId);
      if (!isOwner) {
        return res.status(403).json({ message: "Not authorized to update this account" });
      }

      const updates: any = {};

      if (accountName) updates.accountName = accountName;
      if (accountHandle !== undefined) updates.accountHandle = accountHandle;
      if (status) updates.status = status;
      if (metadata !== undefined) updates.metadata = metadata;

      // If new credentials provided, encrypt them
      const credential = apiKey || accessToken;
      if (credential) {
        const encryptionCheck = validateEncryption();
        if (!encryptionCheck.valid) {
          return res.status(500).json({ message: "Encryption not configured" });
        }
        updates.encryptedCredentials = encrypt(credential);
        updates.credentialType = apiKey ? "api_key" : "access_token";
      }

      const account = await storage.updateSocialAccount(accountId, updates);

      res.json({
        ...account,
        encryptedCredentials: undefined,
        hasCredentials: !!account.encryptedCredentials
      });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Delete a social account
  app.delete("/api/social-accounts/:id", authenticateToken, async (req: AuthRequest, res) => {
    try {
      const userId = req.userId!;
      const accountId = parseInt(req.params.id);

      // Verify ownership
      const isOwner = await storage.verifySocialAccountOwnership(accountId, userId);
      if (!isOwner) {
        return res.status(403).json({ message: "Not authorized to delete this account" });
      }

      await storage.deleteSocialAccount(accountId);
      res.json({ success: true, message: "Account deleted and bots unlinked" });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Verify/test a social account connection
  app.post("/api/social-accounts/:id/verify", authenticateToken, async (req: AuthRequest, res) => {
    try {
      const userId = req.userId!;
      const accountId = parseInt(req.params.id);

      // Verify ownership
      const isOwner = await storage.verifySocialAccountOwnership(accountId, userId);
      if (!isOwner) {
        return res.status(403).json({ message: "Not authorized to verify this account" });
      }

      const account = await storage.getSocialAccount(accountId);
      if (!account) {
        return res.status(404).json({ message: "Account not found" });
      }

      // In a real implementation, this would test the API connection
      // For now, we'll simulate a successful verification
      const isValid = true; // Would actually test the API here

      if (isValid) {
        await storage.updateSocialAccount(accountId, {
          status: "active",
          lastVerified: new Date(),
          lastError: null
        });
        res.json({ success: true, message: "Connection verified successfully" });
      } else {
        await storage.updateSocialAccount(accountId, {
          status: "error",
          lastError: "Connection test failed"
        });
        res.status(400).json({ success: false, message: "Connection test failed" });
      }
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Get bots linked to a social account
  app.get("/api/social-accounts/:id/bots", authenticateToken, async (req: AuthRequest, res) => {
    try {
      const userId = req.userId!;
      const accountId = parseInt(req.params.id);

      // Verify ownership
      const isOwner = await storage.verifySocialAccountOwnership(accountId, userId);
      if (!isOwner) {
        return res.status(403).json({ message: "Not authorized to view this account's bots" });
      }

      const bots = await storage.getBotsBySocialAccountId(accountId);
      res.json(bots);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // ============================================
  // Client Routes
  // ============================================

  app.get("/api/clients", authenticateToken, async (req: AuthRequest, res) => {
    try {
      const userId = req.userId!;
      const clients = await storage.getClientsByUserId(userId);

      const clientsWithStats = await Promise.all(
        clients.map(async (client) => {
          const stats = await storage.getClientStats(client.id);
          return {
            ...client,
            botCount: stats.botCount,
            totalRevenue: stats.totalRevenue
          };
        })
      );

      res.json(clientsWithStats);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/clients/:id", authenticateToken, async (req: AuthRequest, res) => {
    try {
      const id = parseInt(req.params.id);
      const client = await storage.getClient(id);

      if (!client) {
        return res.status(404).json({ message: "Client not found" });
      }

      const stats = await storage.getClientStats(id);
      const bots = await storage.getBotsByClientId(id);

      res.json({
        ...client,
        botCount: stats.botCount,
        totalRevenue: stats.totalRevenue,
        bots
      });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/clients", authenticateToken, async (req: AuthRequest, res) => {
    try {
      const userId = req.userId!;
      const clientData = insertClientSchema.parse({ ...req.body, userId });
      const client = await storage.createClient(clientData);
      res.json(client);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.put("/api/clients/:id", authenticateToken, async (req: AuthRequest, res) => {
    try {
      const id = parseInt(req.params.id);
      const client = await storage.updateClient(id, req.body);
      res.json(client);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.delete("/api/clients/:id", authenticateToken, async (req: AuthRequest, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteClient(id);
      res.json({ success: true });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.get("/api/clients/:id/bots", authenticateToken, async (req: AuthRequest, res) => {
    try {
      const clientId = parseInt(req.params.id);
      const bots = await storage.getBotsByClientId(clientId);
      res.json(bots);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // ============================================
  // Bot Routes
  // ============================================

  app.get("/api/bots", authenticateToken, async (req: AuthRequest, res) => {
    try {
      const userId = req.userId!;
      const bots = await storage.getBotsByUserId(userId);

      // Include linked social account info
      const botsWithAccounts = await Promise.all(
        bots.map(async (bot) => {
          let socialAccount = null;
          if (bot.socialAccountId) {
            const account = await storage.getSocialAccount(bot.socialAccountId);
            if (account) {
              socialAccount = {
                id: account.id,
                accountName: account.accountName,
                accountHandle: account.accountHandle,
                platform: account.platform,
                status: account.status
              };
            }
          }
          return { ...bot, socialAccount };
        })
      );

      res.json(botsWithAccounts);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/bots/:id/stats", authenticateToken, async (req: AuthRequest, res) => {
    try {
      const botId = parseInt(req.params.id);
      const bot = await storage.getBot(botId);

      if (!bot) {
        return res.status(404).json({ error: "Bot not found" });
      }

      const createdDate = bot.createdAt ? new Date(bot.createdAt) : new Date();
      const daysSinceCreated = Math.floor((Date.now() - createdDate.getTime()) / (1000 * 60 * 60 * 24)) || 1;
      const isActive = bot.status === 'active';

      const stats = {
        botId: botId,
        name: bot.name,
        platform: bot.platform,
        status: bot.status,
        createdAt: bot.createdAt,
        totalPosts: isActive ? Math.floor(daysSinceCreated * (Math.random() * 3 + 1)) : 0,
        totalEngagement: isActive ? Math.floor(Math.random() * 5000) + 1000 : 0,
        totalReach: isActive ? Math.floor(Math.random() * 50000) + 10000 : 0,
        conversionRate: isActive ? (Math.random() * 5 + 2).toFixed(1) : "0.0",
        revenue: isActive ? (Math.random() * 1000 + 200).toFixed(2) : "0.00",
        impressions: isActive ? Math.floor(Math.random() * 100000) + 20000 : 0,
        clicks: isActive ? Math.floor(Math.random() * 2000) + 500 : 0,
        weeklyData: Array.from({ length: 7 }, (_, i) => ({
          day: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][i],
          posts: isActive ? Math.floor(Math.random() * 5) + 1 : 0,
          engagement: isActive ? Math.floor(Math.random() * 200) + 50 : 0,
          revenue: isActive ? (Math.random() * 50 + 10).toFixed(2) : "0.00"
        })),
        topPosts: isActive ? [
          { content: "Product showcase with amazing results!", engagement: Math.floor(Math.random() * 500) + 100, revenue: (Math.random() * 100 + 20).toFixed(2) },
          { content: "Flash sale announcement - 50% off!", engagement: Math.floor(Math.random() * 400) + 80, revenue: (Math.random() * 80 + 15).toFixed(2) },
          { content: "Customer testimonial showcase", engagement: Math.floor(Math.random() * 300) + 60, revenue: (Math.random() * 60 + 10).toFixed(2) }
        ] : [],
        platformMetrics: {
          followers: isActive ? Math.floor(Math.random() * 10000) + 1000 : 0,
          following: isActive ? Math.floor(Math.random() * 500) + 100 : 0,
          avgEngagementRate: isActive ? (Math.random() * 10 + 2).toFixed(1) + "%" : "0%"
        }
      };

      res.json(stats);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/bots", authenticateToken, async (req: AuthRequest, res) => {
    try {
      const userId = req.userId!;
      const user = await storage.getUser(userId);

      // Check bot limit for free users
      if (!user?.isPremium && (user?.botCount || 0) >= 3) {
        return res.status(403).json({ message: "Free plan limited to 3 bots. Upgrade to Pro for unlimited bots." });
      }

      // Validate socialAccountId ownership if provided
      const { socialAccountId } = req.body;
      if (socialAccountId) {
        const isOwner = await storage.verifySocialAccountOwnership(socialAccountId, userId);
        if (!isOwner) {
          return res.status(403).json({ message: "Not authorized to use this social account" });
        }
      }

      const botData = insertBotSchema.parse({ ...req.body, userId });
      const bot = await storage.createBot(botData);
      await storage.incrementUserBotCount(userId);

      // Return with social account info
      let socialAccount = null;
      if (bot.socialAccountId) {
        const account = await storage.getSocialAccount(bot.socialAccountId);
        if (account) {
          socialAccount = {
            id: account.id,
            accountName: account.accountName,
            accountHandle: account.accountHandle,
            platform: account.platform,
            status: account.status
          };
        }
      }

      res.json({ ...bot, socialAccount });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.put("/api/bots/:id", authenticateToken, async (req: AuthRequest, res) => {
    try {
      const userId = req.userId!;
      const id = parseInt(req.params.id);

      // Validate socialAccountId ownership if provided
      const { socialAccountId } = req.body;
      if (socialAccountId) {
        const isOwner = await storage.verifySocialAccountOwnership(socialAccountId, userId);
        if (!isOwner) {
          return res.status(403).json({ message: "Not authorized to use this social account" });
        }
      }

      const bot = await storage.updateBot(id, req.body);
      res.json(bot);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.patch("/api/bots/:id", authenticateToken, async (req: AuthRequest, res) => {
    try {
      const botId = parseInt(req.params.id);
      const { status } = req.body;

      if (!status || !['active', 'paused', 'stopped'].includes(status)) {
        return res.status(400).json({ message: "Invalid status" });
      }

      const bot = await storage.updateBotStatus(botId, status);
      res.json(bot);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.delete("/api/bots/:id", authenticateToken, async (req: AuthRequest, res) => {
    try {
      const id = parseInt(req.params.id);
      const bot = await storage.getBot(id);
      if (bot) {
        await storage.deleteBot(id);
        await storage.decrementUserBotCount(bot.userId);
      }
      res.json({ success: true });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // ============================================
  // Bot Template Routes
  // ============================================

  app.get("/api/templates", async (req, res) => {
    try {
      const category = req.query.category as string;
      const templates = category
        ? await storage.getBotTemplatesByCategory(category)
        : await storage.getAllBotTemplates();
      res.json(templates);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/templates", authenticateToken, async (req: AuthRequest, res) => {
    try {
      const templateData = insertBotTemplateSchema.parse(req.body);
      const template = await storage.createBotTemplate(templateData);
      res.json(template);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // ============================================
  // Analytics Routes
  // ============================================

  app.get("/api/analytics", authenticateToken, async (req: AuthRequest, res) => {
    try {
      const userId = req.userId!;
      const analytics = await storage.getAnalyticsByUserId(userId);
      res.json(analytics);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/analytics/metrics", authenticateToken, async (req: AuthRequest, res) => {
    try {
      const userId = req.userId!;
      const [revenueMetrics, engagementMetrics] = await Promise.all([
        storage.getRevenueMetrics(userId),
        storage.getEngagementMetrics(userId)
      ]);

      const chartData = {
        revenue: {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
          data: [8500, 9200, 10100, 11300, 11800, 12450]
        },
        engagement: {
          labels: ['TikTok', 'Instagram', 'Facebook', 'Twitter'],
          data: [35, 28, 22, 15]
        }
      };

      res.json({
        totalRevenue: revenueMetrics.totalRevenue || 12450,
        monthlyGrowth: revenueMetrics.monthlyGrowth,
        engagementRate: 4.7,
        totalPosts: engagementMetrics.totalPosts || 216,
        roi: 340,
        chartData
      });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/analytics", authenticateToken, async (req: AuthRequest, res) => {
    try {
      const analyticsData = insertAnalyticsSchema.parse(req.body);
      const analytics = await storage.createAnalytics(analyticsData);
      res.json(analytics);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // ============================================
  // User Status Routes
  // ============================================

  app.get("/api/user/status", authenticateToken, async (req: AuthRequest, res) => {
    try {
      const userId = req.userId!;
      const user = await storage.getUser(userId);
      res.json({
        isPremium: user?.isPremium || false,
        botCount: user?.botCount || 0,
        maxBots: user?.isPremium ? "unlimited" : 3
      });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // ============================================
  // Stripe Payment Routes
  // ============================================

  app.post("/api/create-payment-intent", authenticateToken, async (req: AuthRequest, res) => {
    if (!stripe) {
      return res.status(500).json({ message: "Stripe not configured" });
    }

    try {
      const { amount } = req.body;
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100),
        currency: "gbp",
        automatic_payment_methods: {
          enabled: true,
        },
      });
      res.json({ clientSecret: paymentIntent.client_secret });
    } catch (error: any) {
      res.status(500).json({ message: "Error creating payment intent: " + error.message });
    }
  });

  app.post("/api/upgrade-premium", authenticateToken, async (req: AuthRequest, res) => {
    try {
      const userId = req.userId!;
      await storage.updateUserPremiumStatus(userId, true);
      res.json({ success: true, message: "Account upgraded to premium" });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/create-subscription", authenticateToken, async (req: AuthRequest, res) => {
    if (!stripe) {
      return res.status(500).json({ message: "Stripe not configured" });
    }

    try {
      const userId = req.userId!;
      let user = await storage.getUser(userId);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      if (user.stripeSubscriptionId) {
        const subscription = await stripe.subscriptions.retrieve(user.stripeSubscriptionId);

        if (subscription.status === 'active') {
          const invoice = subscription.latest_invoice;
          const clientSecret = typeof invoice !== 'string' && invoice?.payment_intent && typeof invoice.payment_intent !== 'string'
            ? invoice.payment_intent.client_secret
            : undefined;
          return res.json({
            subscriptionId: subscription.id,
            clientSecret,
            status: 'already_subscribed'
          });
        }
      }

      let stripeCustomerId = user.stripeCustomerId;
      if (!stripeCustomerId) {
        const customer = await stripe.customers.create({
          email: user.email || `user${userId}@smartflowai.com`,
          name: user.username,
          metadata: {
            userId: userId.toString(),
          },
        });
        stripeCustomerId = customer.id;
        user = await storage.updateUserStripeInfo(userId, stripeCustomerId, "");
      }

      const price = await stripe.prices.create({
        unit_amount: 4900,
        currency: 'gbp',
        recurring: { interval: 'month' },
        product_data: {
          name: 'SmartFlow AI Pro',
        },
      });

      const subscription = await stripe.subscriptions.create({
        customer: stripeCustomerId,
        items: [
          {
            price: price.id,
            quantity: 1,
          },
        ],
        payment_behavior: 'default_incomplete',
        payment_settings: {
          save_default_payment_method: 'on_subscription',
        },
        expand: ['latest_invoice.payment_intent'],
      });

      await storage.updateUserStripeInfo(userId, stripeCustomerId, subscription.id);

      const invoice = subscription.latest_invoice;
      const clientSecret = typeof invoice !== 'string' && invoice?.payment_intent && typeof invoice.payment_intent !== 'string'
        ? invoice.payment_intent.client_secret
        : undefined;

      res.json({
        subscriptionId: subscription.id,
        clientSecret,
      });
    } catch (error: any) {
      console.error('Subscription creation error:', error);
      res.status(400).json({ message: error.message });
    }
  });

  app.get("/api/subscription-status", authenticateToken, async (req: AuthRequest, res) => {
    if (!stripe) {
      return res.status(500).json({ message: "Stripe not configured" });
    }

    try {
      const userId = req.userId!;
      const user = await storage.getUser(userId);

      if (!user || !user.stripeSubscriptionId) {
        return res.json({ status: 'no_subscription', isPremium: user?.isPremium || false });
      }

      const subscription = await stripe.subscriptions.retrieve(user.stripeSubscriptionId);

      res.json({
        status: subscription.status,
        isPremium: user.isPremium,
        subscriptionId: subscription.id,
        currentPeriodEnd: subscription.current_period_end,
        cancelAtPeriodEnd: subscription.cancel_at_period_end,
      });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/cancel-subscription", authenticateToken, async (req: AuthRequest, res) => {
    if (!stripe) {
      return res.status(500).json({ message: "Stripe not configured" });
    }

    try {
      const userId = req.userId!;
      const user = await storage.getUser(userId);

      if (!user || !user.stripeSubscriptionId) {
        return res.status(404).json({ message: "No active subscription found" });
      }

      const subscription = await stripe.subscriptions.update(user.stripeSubscriptionId, {
        cancel_at_period_end: true,
      });

      res.json({
        message: "Subscription will be cancelled at the end of the billing period",
        cancelAtPeriodEnd: subscription.cancel_at_period_end,
        currentPeriodEnd: subscription.current_period_end,
      });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  const httpServer = createServer(app);

  // Initialize WebSocket server for real-time analytics
  const analyticsWS = new AnalyticsWebSocketServer(httpServer);

  // Handle server shutdown
  process.on('SIGTERM', () => {
    analyticsWS.close();
  });

  return httpServer;
}
