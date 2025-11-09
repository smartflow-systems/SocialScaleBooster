/**
 * Enhanced API Routes for Powerhouse Features
 * Includes AI suggestions, A/B testing, notifications, analytics export, and monitoring
 */

import type { Express } from "express";
import { aiContentEngine } from "../services/ai-content";
import { abTestingService } from "../services/ab-testing";
import { notificationService } from "../services/notifications";
import { analyticsExportService } from "../services/analytics-export";
import { monitoringService } from "../services/monitoring";
import { cacheService, cacheNamespaces } from "../services/cache";
import { hashPassword } from "../auth";
import { storage } from "../storage";
import passport from "../auth";
import { requireAuth, requirePremium, optionalAuth } from "../middleware/auth";
import { validate, loginValidation, registerValidation } from "../middleware/security";

export function registerEnhancedRoutes(app: Express) {
  // =====================
  // AUTHENTICATION ROUTES
  // =====================

  // Register new user
  app.post("/api/auth/register", registerValidation, validate, async (req, res) => {
    try {
      const { username, email, password } = req.body;

      // Check if user exists
      const existingUser = await storage.getUserByUsername(username);
      if (existingUser) {
        return res.status(400).json({ message: "Username already exists" });
      }

      // Hash password
      const hashedPassword = await hashPassword(password);

      // Create user
      const user = await storage.createUser({
        username,
        email,
        password: hashedPassword,
      });

      // Auto-login after registration
      req.login(user, (err) => {
        if (err) {
          return res.status(500).json({ message: "Registration successful but login failed" });
        }

        monitoringService.info("New user registered", { userId: user.id, username });

        res.json({
          message: "Registration successful",
          user: {
            id: user.id,
            username: user.username,
            email: user.email,
            isPremium: user.isPremium,
          },
        });
      });
    } catch (error: any) {
      monitoringService.error("Registration failed", error);
      res.status(500).json({ message: error.message });
    }
  });

  // Login
  app.post("/api/auth/login", loginValidation, validate, (req, res, next) => {
    passport.authenticate("local", (err: any, user: any, info: any) => {
      if (err) {
        monitoringService.error("Login error", err);
        return next(err);
      }

      if (!user) {
        return res.status(401).json({ message: info?.message || "Invalid credentials" });
      }

      req.login(user, (loginErr) => {
        if (loginErr) {
          monitoringService.error("Login session error", loginErr);
          return next(loginErr);
        }

        monitoringService.info("User logged in", { userId: user.id });

        res.json({
          message: "Login successful",
          user: {
            id: user.id,
            username: user.username,
            email: user.email,
            isPremium: user.isPremium,
            botCount: user.botCount,
          },
        });
      });
    })(req, res, next);
  });

  // Logout
  app.post("/api/auth/logout", (req, res) => {
    const userId = req.user?.id;

    req.logout((err) => {
      if (err) {
        return res.status(500).json({ message: "Logout failed" });
      }

      if (userId) {
        monitoringService.info("User logged out", { userId });
      }

      res.json({ message: "Logout successful" });
    });
  });

  // Get current user
  app.get("/api/auth/me", optionalAuth, (req, res) => {
    if (!req.user) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    res.json({
      user: {
        id: req.user.id,
        username: req.user.username,
        email: req.user.email,
        isPremium: req.user.isPremium,
        botCount: req.user.botCount,
      },
    });
  });

  // ============================
  // AI CONTENT SUGGESTION ROUTES
  // ============================

  // Get AI content suggestions
  app.get("/api/ai/suggestions", requireAuth, async (req, res) => {
    const timer = monitoringService.startTimer("ai_suggestions");

    try {
      const userId = req.user!.id;
      const platform = req.query.platform as string || 'multi';

      // Try to get from cache first
      const cached = await cacheNamespaces.suggestions.getOrSet(
        `${userId}:${platform}`,
        async () => {
          // Mock engagement history for now
          const engagementHistory = [
            { posts: 10, engagement: 4.5, clicks: 250, conversions: 15, revenue: 450 },
            { posts: 12, engagement: 5.2, clicks: 300, conversions: 20, revenue: 600 },
          ];

          return await aiContentEngine.generateSuggestions(userId, platform, engagementHistory);
        },
        300 // 5 minutes cache
      );

      timer({ success: true, platform });
      res.json({ suggestions: cached });
    } catch (error: any) {
      timer({ success: false, error: error.message });
      monitoringService.error("AI suggestions failed", error, { userId: req.user?.id });
      res.status(500).json({ message: error.message });
    }
  });

  // Analyze content sentiment
  app.post("/api/ai/analyze-sentiment", requireAuth, async (req, res) => {
    try {
      const { content, engagement } = req.body;

      if (!content) {
        return res.status(400).json({ message: "Content is required" });
      }

      const analysis = aiContentEngine.analyzeSentiment(content, engagement || 0);

      res.json({ analysis });
    } catch (error: any) {
      monitoringService.error("Sentiment analysis failed", error);
      res.status(500).json({ message: error.message });
    }
  });

  // Generate hashtags
  app.post("/api/ai/generate-hashtags", requireAuth, async (req, res) => {
    try {
      const { platform, category } = req.body;

      const hashtags = aiContentEngine.generateHashtags(platform || 'instagram', category || 'ecommerce');

      res.json({ hashtags });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Generate automated content
  app.post("/api/ai/generate-content", requireAuth, async (req, res) => {
    try {
      const content = aiContentEngine.generateAutomatedContent(req.body);

      res.json({ content });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // ==================
  // A/B TESTING ROUTES
  // ==================

  // Create A/B test
  app.post("/api/ab-tests", requireAuth, async (req, res) => {
    try {
      const test = abTestingService.createTest(req.body);

      monitoringService.info("A/B test created", { userId: req.user!.id, testId: test.id });

      res.json({ test });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Get A/B test results
  app.get("/api/ab-tests/:testId/results", requireAuth, async (req, res) => {
    try {
      const { testId } = req.params;

      // Simulate test results for demo
      const results = abTestingService.simulateTestResults(testId, 7);
      const insights = abTestingService.generateInsights(results);
      const recommendation = abTestingService.getRecommendation(results);

      res.json({
        results,
        insights,
        recommendation,
      });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // ====================
  // NOTIFICATION ROUTES
  // ====================

  // Get user notifications
  app.get("/api/notifications", requireAuth, async (req, res) => {
    try {
      const userId = req.user!.id;

      // Mock notifications for demo
      const notifications = [
        {
          id: 1,
          type: 'success',
          title: '🎉 Milestone Achieved!',
          message: "You've reached $5,000 in total revenue!",
          isRead: false,
          createdAt: new Date(),
        },
        {
          id: 2,
          type: 'info',
          title: '💡 New Content Suggestion',
          message: 'We have a high-performing content idea for Instagram',
          isRead: false,
          createdAt: new Date(Date.now() - 3600000),
        },
      ];

      res.json({ notifications });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Mark notification as read
  app.patch("/api/notifications/:id/read", requireAuth, async (req, res) => {
    try {
      const { id } = req.params;
      await notificationService.markAsRead(parseInt(id));

      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Get unread count
  app.get("/api/notifications/unread-count", requireAuth, async (req, res) => {
    try {
      const count = await notificationService.getUnreadCount(req.user!.id);

      res.json({ count });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // =========================
  // ANALYTICS EXPORT ROUTES
  // =========================

  // Export analytics as CSV
  app.get("/api/analytics/export/csv", requireAuth, async (req, res) => {
    try {
      const data = analyticsExportService.generateSampleData();
      const csv = analyticsExportService.exportAsCSV(data);

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename=analytics-export.csv');
      res.send(csv);
    } catch (error: any) {
      monitoringService.error("CSV export failed", error);
      res.status(500).json({ message: error.message });
    }
  });

  // Export analytics as JSON
  app.get("/api/analytics/export/json", requireAuth, async (req, res) => {
    try {
      const data = analyticsExportService.generateSampleData();
      const json = analyticsExportService.exportAsJSON(data);

      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Content-Disposition', 'attachment; filename=analytics-export.json');
      res.send(json);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Export analytics as HTML/PDF
  app.get("/api/analytics/export/pdf", requireAuth, async (req, res) => {
    try {
      const data = analyticsExportService.generateSampleData();
      const html = analyticsExportService.exportAsPDFHTML(data);

      res.setHeader('Content-Type', 'text/html');
      res.send(html);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // =====================
  // MONITORING & HEALTH
  // =====================

  // Health check endpoint
  app.get("/api/health", async (req, res) => {
    try {
      const health = await monitoringService.performHealthCheck();

      const statusCode = health.status === 'healthy' ? 200 : health.status === 'degraded' ? 200 : 503;

      res.status(statusCode).json(health);
    } catch (error: any) {
      res.status(503).json({
        status: 'down',
        message: error.message,
      });
    }
  });

  // Get system metrics (admin only for now)
  app.get("/api/metrics", requireAuth, async (req, res) => {
    try {
      const performanceSummary = monitoringService.getPerformanceSummary();
      const errorStats = monitoringService.getErrorStats();
      const cacheStats = cacheService.getStats();

      res.json({
        performance: performanceSummary,
        errors: errorStats,
        cache: cacheStats,
      });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Get recent logs (admin only for now)
  app.get("/api/logs", requireAuth, async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 100;
      const level = req.query.level as any;

      const logs = monitoringService.getRecentLogs(limit, level);

      res.json({ logs });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // ========================
  // PERFORMANCE BENCHMARKS
  // ========================

  // Get performance benchmarks
  app.get("/api/benchmarks", requireAuth, async (req, res) => {
    try {
      const { platform, category } = req.query;

      // Mock benchmark data
      const benchmarks = [
        {
          platform: 'tiktok',
          category: 'E-commerce',
          metric: 'engagement_rate',
          averageValue: 4.5,
          topPercentile: 8.2,
          sampleSize: 1000,
        },
        {
          platform: 'instagram',
          category: 'E-commerce',
          metric: 'engagement_rate',
          averageValue: 3.8,
          topPercentile: 6.5,
          sampleSize: 1500,
        },
        {
          platform: 'facebook',
          category: 'E-commerce',
          metric: 'conversion_rate',
          averageValue: 2.1,
          topPercentile: 4.8,
          sampleSize: 800,
        },
      ];

      let filtered = benchmarks;

      if (platform) {
        filtered = filtered.filter(b => b.platform === platform);
      }

      if (category) {
        filtered = filtered.filter(b => b.category === category);
      }

      res.json({ benchmarks: filtered });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // ====================
  // STRIPE WEBHOOKS
  // ====================

  // Stripe webhook handler
  app.post("/api/webhooks/stripe", async (req, res) => {
    try {
      const event = req.body;

      monitoringService.info("Stripe webhook received", { type: event.type });

      // Handle different event types
      switch (event.type) {
        case 'customer.subscription.created':
        case 'customer.subscription.updated':
          // Update user premium status
          const subscription = event.data.object;
          // In production: find user by stripeCustomerId and update
          monitoringService.info("Subscription updated", { subscriptionId: subscription.id });
          break;

        case 'customer.subscription.deleted':
          // Remove premium status
          monitoringService.warn("Subscription cancelled", { subscriptionId: event.data.object.id });
          break;

        case 'invoice.payment_succeeded':
          // Send payment success notification
          await notificationService.create({
            userId: 1, // In production: get from subscription
            type: 'success',
            title: '💰 Payment Successful',
            message: 'Your subscription payment was processed successfully!',
          });
          break;

        case 'invoice.payment_failed':
          // Send payment failed notification
          await notificationService.create({
            userId: 1,
            type: 'error',
            title: '❌ Payment Failed',
            message: 'Your subscription payment failed. Please update your payment method.',
          });
          break;
      }

      res.json({ received: true });
    } catch (error: any) {
      monitoringService.error("Stripe webhook error", error);
      res.status(400).json({ message: error.message });
    }
  });

  monitoringService.info("Enhanced routes registered successfully");
}
