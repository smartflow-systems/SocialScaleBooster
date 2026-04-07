import { db } from '../db';
import { aiGenerations, organizations } from '@shared/schema-multitenant';
import { eq, and, gte, sql } from 'drizzle-orm';
import type { AiGeneration, InsertAiGeneration } from '@shared/schema-multitenant';

export interface UsageStats {
  used: number;
  limit: number;
  remaining: number;
  resetDate: Date;
  isOverLimit: boolean;
}

export interface UsageCheckResult {
  canGenerate: boolean;
  usage: UsageStats;
  message?: string;
}

/**
 * Check if an organization can perform AI generation
 * @param organizationId - The organization ID
 * @returns Promise<UsageCheckResult>
 */
export async function checkAIUsageLimit(organizationId: string): Promise<UsageCheckResult> {
  try {
    // Get organization and its current usage
    const org = await db
      .select()
      .from(organizations)
      .where(eq(organizations.id, organizationId))
      .limit(1);

    if (!org[0]) {
      throw new Error('Organization not found');
    }

    const organization = org[0];
    const currentUsage = organization.currentUsage;
    const planLimits = organization.planLimits;
    
    // Calculate current month start
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    
    // Get actual usage from database for current month
    const actualUsage = await db
      .select()
      .from(aiGenerations)
      .where(
        and(
          eq(aiGenerations.organizationId, organizationId),
          gte(aiGenerations.createdAt, monthStart)
        )
      );

    const actualUsageCount = actualUsage.length;
    const limit = planLimits.aiGenerationsPerMonth;
    const remaining = Math.max(0, limit - actualUsageCount);
    
    // Calculate next reset date (first day of next month)
    const resetDate = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    
    const usageStats: UsageStats = {
      used: actualUsageCount,
      limit,
      remaining,
      resetDate,
      isOverLimit: actualUsageCount >= limit
    };

    const canGenerate = actualUsageCount < limit;

    return {
      canGenerate,
      usage: usageStats,
      message: canGenerate 
        ? undefined 
        : `AI generation limit reached. You've used ${actualUsageCount}/${limit} generations this month. Upgrade your plan for more generations.`
    };
  } catch (error) {
    console.error('Error checking AI usage limit:', error);
    throw new Error('Failed to check usage limits');
  }
}

/**
 * Record an AI generation and update usage
 * @param data - AI generation data
 * @returns Promise<AiGeneration>
 */
export async function recordAIGeneration(data: InsertAiGeneration): Promise<AiGeneration> {
  try {
    // Insert the generation record
    const result = await db
      .insert(aiGenerations)
      .values(data)
      .returning();

    const generation = result[0];
    if (!generation) {
      throw new Error('Failed to record AI generation');
    }

    // Update organization usage counter
    await updateOrganizationUsage(data.organizationId);

    return generation;
  } catch (error) {
    console.error('Error recording AI generation:', error);
    throw new Error('Failed to record AI generation');
  }
}

/**
 * Update organization's current usage count
 * @param organizationId - The organization ID
 */
async function updateOrganizationUsage(organizationId: string): Promise<void> {
  try {
    // Get current month usage
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    
    const monthlyUsage = await db
      .select()
      .from(aiGenerations)
      .where(
        and(
          eq(aiGenerations.organizationId, organizationId),
          gte(aiGenerations.createdAt, monthStart)
        )
      );

    const count = monthlyUsage.length;

    // Update organization usage
    await db
      .update(organizations)
      .set({
        currentUsage: sql`jsonb_set(current_usage, '{aiGenerationsThisMonth}', '${count}'::jsonb)`,
        updatedAt: new Date()
      })
      .where(eq(organizations.id, organizationId));
  } catch (error) {
    console.error('Error updating organization usage:', error);
    throw new Error('Failed to update usage counter');
  }
}

/**
 * Get detailed usage statistics for an organization
 * @param organizationId - The organization ID
 * @returns Promise<UsageStats & { recentGenerations: AiGeneration[] }>
 */
export async function getUsageStats(organizationId: string): Promise<UsageStats & { 
  recentGenerations: AiGeneration[];
  generationsByType: Record<string, number>;
}> {
  try {
    const usageCheck = await checkAIUsageLimit(organizationId);
    
    // Get current month usage
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    
    const recentGenerations = await db
      .select()
      .from(aiGenerations)
      .where(
        and(
          eq(aiGenerations.organizationId, organizationId),
          gte(aiGenerations.createdAt, monthStart)
        )
      )
      .orderBy(aiGenerations.createdAt);

    // Group by type
    const generationsByType = recentGenerations.reduce((acc, gen) => {
      acc[gen.type] = (acc[gen.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      ...usageCheck.usage,
      recentGenerations,
      generationsByType
    };
  } catch (error) {
    console.error('Error getting usage stats:', error);
    throw new Error('Failed to get usage statistics');
  }
}

/**
 * Reset monthly usage for all organizations (to be called on the 1st of each month)
 * This is typically called by a cron job
 */
export async function resetMonthlyUsage(): Promise<void> {
  try {
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    
    // Reset all organizations' monthly usage
    await db
      .update(organizations)
      .set({
        currentUsage: sql`jsonb_set(current_usage, '{aiGenerationsThisMonth}', '0'::jsonb)`,
        usageResetDate: monthStart,
        updatedAt: now
      });

    console.log('Monthly AI usage reset completed for all organizations');
  } catch (error) {
    console.error('Error resetting monthly usage:', error);
    throw new Error('Failed to reset monthly usage');
  }
}

/**
 * Validate AI generation request parameters
 * @param type - Type of generation (post, caption, hashtags)
 * @param data - Generation parameters
 * @returns boolean
 */
export function validateGenerationRequest(
  type: string, 
  data: any
): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!['post', 'caption', 'hashtags'].includes(type)) {
    errors.push('Invalid generation type. Must be: post, caption, or hashtags');
  }

  switch (type) {
    case 'post':
      if (!data.topic) errors.push('Topic is required for post generation');
      if (!data.platform) errors.push('Platform is required for post generation');
      if (!data.tone) errors.push('Tone is required for post generation');
      break;
    
    case 'caption':
      if (!data.description) errors.push('Description is required for caption generation');
      if (!data.platform) errors.push('Platform is required for caption generation');
      break;
    
    case 'hashtags':
      if (!data.topic) errors.push('Topic is required for hashtag generation');
      if (!data.count || data.count < 1 || data.count > 30) {
        errors.push('Count must be between 1 and 30 for hashtag generation');
      }
      break;
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}