import express from 'express';
import { z } from 'zod';
import { generatePost, generateCaption, generateHashtags } from '../services/openai';
import { 
  checkAIUsageLimit, 
  recordAIGeneration, 
  getUsageStats,
  validateGenerationRequest 
} from '../services/ai-usage';
import { authenticateMultiTenant, requireActiveOrganization } from '../middleware/multitenant-auth';
import type { MultiTenantAuthRequest } from '../middleware/multitenant-auth';

const router = express.Router();

// Validation schemas
const generatePostSchema = z.object({
  topic: z.string().min(1).max(500),
  platform: z.enum(['instagram', 'facebook', 'twitter', 'linkedin', 'tiktok']),
  tone: z.enum(['professional', 'friendly', 'playful', 'luxury']),
  industry: z.string().optional(),
  targetAudience: z.string().optional(),
});

const generateCaptionSchema = z.object({
  description: z.string().min(1).max(1000),
  platform: z.enum(['instagram', 'facebook', 'twitter', 'linkedin', 'tiktok']),
  tone: z.enum(['professional', 'friendly', 'playful', 'luxury']).optional(),
  maxLength: z.number().min(1).max(5000).optional(),
});

const generateHashtagsSchema = z.object({
  topic: z.string().min(1).max(500),
  count: z.number().min(1).max(30),
  platform: z.enum(['instagram', 'facebook', 'twitter', 'linkedin', 'tiktok']).optional(),
  industry: z.string().optional(),
});

// Middleware to check AI usage limits
const checkUsageLimit = async (req: MultiTenantAuthRequest, res: express.Response, next: express.NextFunction) => {
  try {
    if (!req.user?.organizationId) {
      return res.status(401).json({ error: 'Organization not found' });
    }

    const usageCheck = await checkAIUsageLimit(req.user.organizationId);
    
    if (!usageCheck.canGenerate) {
      return res.status(429).json({
        error: 'AI Generation Limit Reached',
        message: usageCheck.message,
        usage: usageCheck.usage,
        upgradeUrl: '/billing'
      });
    }

    req.usageCheck = usageCheck;
    next();
  } catch (error) {
    console.error('Usage limit check error:', error);
    res.status(500).json({ error: 'Failed to check usage limits' });
  }
};

// POST /api/ai/generate-post
router.post('/generate-post', authenticateMultiTenant, requireActiveOrganization, checkUsageLimit, async (req: MultiTenantAuthRequest, res) => {
  try {
    const validatedData = generatePostSchema.parse(req.body);
    const { isValid, errors } = validateGenerationRequest('post', validatedData);
    
    if (!isValid) {
      return res.status(400).json({ error: 'Validation failed', details: errors });
    }

    // Generate the post using OpenAI
    const result = await generatePost(validatedData);

    // Record the generation
    await recordAIGeneration({
      organizationId: req.user!.organizationId!,
      userId: req.user!.id.toString(),
      type: 'post',
      prompt: `Topic: ${validatedData.topic}, Platform: ${validatedData.platform}, Tone: ${validatedData.tone}`,
      response: result.content,
      tokensUsed: result.tokensUsed,
      model: result.model,
      platform: validatedData.platform,
      metadata: {
        tone: validatedData.tone,
        topic: validatedData.topic,
      }
    });

    // Get updated usage stats
    const usage = await getUsageStats(req.user!.organizationId!);

    res.json({
      content: result.content,
      tokensUsed: result.tokensUsed,
      model: result.model,
      usage: {
        used: usage.used,
        limit: usage.limit,
        remaining: usage.remaining
      }
    });
  } catch (error) {
    console.error('Generate post error:', error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid input', details: error.issues });
    }
    res.status(500).json({ error: 'Failed to generate post' });
  }
});

// POST /api/ai/generate-caption
router.post('/generate-caption', authenticateMultiTenant, requireActiveOrganization, checkUsageLimit, async (req: MultiTenantAuthRequest, res) => {
  try {
    const validatedData = generateCaptionSchema.parse(req.body);
    const { isValid, errors } = validateGenerationRequest('caption', validatedData);
    
    if (!isValid) {
      return res.status(400).json({ error: 'Validation failed', details: errors });
    }

    // Generate the caption using OpenAI
    const result = await generateCaption(validatedData);

    // Record the generation
    await recordAIGeneration({
      organizationId: req.user!.organizationId!,
      userId: req.user!.id.toString(),
      type: 'caption',
      prompt: `Description: ${validatedData.description}, Platform: ${validatedData.platform}`,
      response: result.content,
      tokensUsed: result.tokensUsed,
      model: result.model,
      platform: validatedData.platform,
      metadata: {
        tone: validatedData.tone,
      }
    });

    // Get updated usage stats
    const usage = await getUsageStats(req.user!.organizationId!);

    res.json({
      content: result.content,
      tokensUsed: result.tokensUsed,
      model: result.model,
      usage: {
        used: usage.used,
        limit: usage.limit,
        remaining: usage.remaining
      }
    });
  } catch (error) {
    console.error('Generate caption error:', error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid input', details: error.issues });
    }
    res.status(500).json({ error: 'Failed to generate caption' });
  }
});

// POST /api/ai/generate-hashtags
router.post('/generate-hashtags', authenticateMultiTenant, requireActiveOrganization, checkUsageLimit, async (req: MultiTenantAuthRequest, res) => {
  try {
    const validatedData = generateHashtagsSchema.parse(req.body);
    const { isValid, errors } = validateGenerationRequest('hashtags', validatedData);
    
    if (!isValid) {
      return res.status(400).json({ error: 'Validation failed', details: errors });
    }

    // Generate hashtags using OpenAI
    const result = await generateHashtags(validatedData);

    // Record the generation
    await recordAIGeneration({
      organizationId: req.user!.organizationId!,
      userId: req.user!.id.toString(),
      type: 'hashtags',
      prompt: `Topic: ${validatedData.topic}, Count: ${validatedData.count}`,
      response: result.content,
      tokensUsed: result.tokensUsed,
      model: result.model,
      platform: validatedData.platform,
      metadata: {
        topic: validatedData.topic,
        count: validatedData.count,
      }
    });

    // Get updated usage stats
    const usage = await getUsageStats(req.user!.organizationId!);

    res.json({
      content: result.content,
      tokensUsed: result.tokensUsed,
      model: result.model,
      usage: {
        used: usage.used,
        limit: usage.limit,
        remaining: usage.remaining
      }
    });
  } catch (error) {
    console.error('Generate hashtags error:', error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid input', details: error.issues });
    }
    res.status(500).json({ error: 'Failed to generate hashtags' });
  }
});

// GET /api/ai/usage
router.get('/usage', authenticateMultiTenant, requireActiveOrganization, async (req: MultiTenantAuthRequest, res) => {
  try {
    if (!req.user?.organizationId) {
      return res.status(401).json({ error: 'Organization not found' });
    }

    const usage = await getUsageStats(req.user.organizationId);

    res.json({
      usage: {
        used: usage.used,
        limit: usage.limit,
        remaining: usage.remaining,
        resetDate: usage.resetDate,
        isOverLimit: usage.isOverLimit
      },
      generationsByType: usage.generationsByType,
      recentGenerations: usage.recentGenerations.slice(-10) // Last 10 generations
    });
  } catch (error) {
    console.error('Get usage error:', error);
    res.status(500).json({ error: 'Failed to get usage statistics' });
  }
});

// GET /api/ai/health
router.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    openaiConfigured: !!process.env.OPENAI_API_KEY,
    timestamp: new Date().toISOString()
  });
});

export default router;