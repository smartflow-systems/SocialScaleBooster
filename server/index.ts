import express, { type Request, Response, NextFunction } from "express";
import session from "express-session";
import cookieParser from "cookie-parser";
import { registerRoutes } from "./routes";
import { registerEnhancedRoutes } from "./routes/enhanced-routes";
import { setupVite, serveStatic, log } from "./vite";
import passport from "./auth";
import { helmetConfig, corsConfig, sanitizeInput } from "./middleware/security";
import { monitoringService } from "./services/monitoring";

const app = express();

// Security middleware
app.use(helmetConfig);
app.use(corsConfig);

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Input sanitization
app.use(sanitizeInput);

// Session configuration
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'smartflow-ai-secret-change-in-production',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    },
  })
);

// Passport authentication
app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  // Register all routes
  const server = await registerRoutes(app);
  registerEnhancedRoutes(app);

  // Global error handler
  app.use((err: any, req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    // Log error to monitoring service
    monitoringService.error(
      `${req.method} ${req.path} - ${message}`,
      err,
      {
        method: req.method,
        path: req.path,
        body: req.body,
        query: req.query,
      },
      req.user?.id
    );

    res.status(status).json({ message });
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // ALWAYS serve the app on the port specified in the environment variable PORT
  // Other ports are firewalled. Default to 5000 if not specified.
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = parseInt(process.env.PORT || '5000', 10);
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true,
  }, () => {
    log(`serving on port ${port}`);
    monitoringService.info('🚀 SmartFlow AI Powerhouse Server Started', {
      port,
      environment: process.env.NODE_ENV || 'development',
      features: [
        'Authentication with Passport.js',
        'AI Content Suggestions',
        'A/B Testing',
        'Real-time Notifications',
        'Analytics Export (CSV/JSON/PDF)',
        'Performance Monitoring',
        'In-Memory Caching',
        'Sentiment Analysis',
        'Security Hardening',
      ],
    });
  });
})();
