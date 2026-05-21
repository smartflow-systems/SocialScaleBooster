import { Express } from 'express';
import bcrypt from 'bcryptjs';
import { storage } from '../storage';
import { generateToken } from '../middleware/auth';
import { z } from 'zod';

const registerSchema = z.object({
  username: z.string().min(3).max(50),
  email: z.string().email(),
  password: z.string().min(8),
});

// Accept email OR username for login
const loginSchema = z.object({
  email: z.string().email().optional(),
  username: z.string().optional(),
  password: z.string(),
}).refine((d) => d.email || d.username, {
  message: 'Provide email or username to log in',
});

export function registerAuthRoutes(app: Express) {
  /**
   * Register new user
   */
  app.post('/api/auth/register', async (req, res) => {
    try {
      const { username, email, password } = registerSchema.parse(req.body);

      // Check if user already exists
      const existingUser = await storage.getUserByEmail(email);
      if (existingUser) {
        return res.status(400).json({ message: 'User already exists with this email' });
      }

      // Hash password
      const passwordHash = await bcrypt.hash(password, 10);

      // Create user
      const user = await storage.createUser({
        username,
        email,
        password: passwordHash,
        isPremium: false,
        botCount: 0,
      });

      // Generate token
      const token = generateToken({
        userId: user.id,
        username: user.username,
        email: user.email || "",
        isPremium: user.isPremium ?? false,
        isAdmin: user.isAdmin ?? false,
      });

      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        token,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          isPremium: user.isPremium,
          isAdmin: user.isAdmin,
          botCount: user.botCount,
          onboardingComplete: (user as any).onboardingComplete ?? false,
          businessName: (user as any).businessName ?? null,
          niche: (user as any).niche ?? null,
        },
      });
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Validation error', errors: error.issues });
      }
      res.status(500).json({ message: error.message });
    }
  });

  /**
   * Login user — accepts email or username
   */
  app.post('/api/auth/login', async (req, res) => {
    try {
      const parsed = loginSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ message: 'Validation error', errors: parsed.error.issues });
      }
      const { email, username, password } = parsed.data;

      // Look up by email first, then username
      let user = email ? await storage.getUserByEmail(email) : undefined;
      if (!user && username) {
        user = await storage.getUserByUsername(username);
      }

      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      // Verify password
      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      // Generate token
      const token = generateToken({
        userId: user.id,
        username: user.username,
        email: user.email || "",
        isPremium: user.isPremium ?? false,
        isAdmin: user.isAdmin ?? false,
      });

      res.json({
        success: true,
        message: 'Login successful',
        token,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          isPremium: user.isPremium,
          isAdmin: user.isAdmin,
          botCount: user.botCount,
          onboardingComplete: (user as any).onboardingComplete ?? false,
          businessName: (user as any).businessName ?? null,
          niche: (user as any).niche ?? null,
        },
      });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  /**
   * Get current user info (stub — full impl via middleware)
   */
  app.get('/api/auth/me', async (req, res) => {
    try {
      const authHeader = req.headers['authorization'];
      if (!authHeader) {
        return res.status(401).json({ message: 'Not authenticated' });
      }
      res.json({
        message: 'Authentication endpoint - implement with middleware',
      });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  /**
   * Logout (client-side token removal)
   */
  app.post('/api/auth/logout', (req, res) => {
    res.json({ success: true, message: 'Logout successful' });
  });
}
