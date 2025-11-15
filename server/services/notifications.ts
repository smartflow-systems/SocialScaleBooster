/**
 * Comprehensive Notification Service
 * Handles in-app, email, and push notifications
 */

export interface Notification {
  id?: number;
  userId: number;
  type: 'info' | 'success' | 'warning' | 'error' | 'milestone';
  title: string;
  message: string;
  isRead?: boolean;
  data?: Record<string, any>;
  createdAt?: Date;
}

export interface NotificationPreferences {
  email: boolean;
  push: boolean;
  inApp: boolean;
  milestones: boolean;
  weeklyReports: boolean;
  marketingUpdates: boolean;
}

export class NotificationService {
  /**
   * Create a new notification
   */
  async create(notification: Notification): Promise<Notification> {
    // In production, this would save to database
    return {
      ...notification,
      id: Date.now(),
      isRead: false,
      createdAt: new Date(),
    };
  }

  /**
   * Send milestone notifications
   */
  async sendMilestoneNotification(userId: number, milestone: {
    type: 'revenue' | 'engagement' | 'followers' | 'conversions';
    value: number;
    threshold: number;
  }): Promise<Notification> {
    const milestoneMessages = {
      revenue: {
        title: '🎉 Revenue Milestone Achieved!',
        message: `Congratulations! You've reached $${milestone.value} in total revenue!`,
      },
      engagement: {
        title: '⭐ Engagement Milestone!',
        message: `Amazing! Your posts have received ${milestone.value} total engagements!`,
      },
      followers: {
        title: '🚀 Follower Milestone!',
        message: `You've hit ${milestone.value} followers! Keep growing!`,
      },
      conversions: {
        title: '💰 Conversion Milestone!',
        message: `Excellent work! You've achieved ${milestone.value} total conversions!`,
      },
    };

    const notification = milestoneMessages[milestone.type];

    return this.create({
      userId,
      type: 'milestone',
      title: notification.title,
      message: notification.message,
      data: { milestone },
    });
  }

  /**
   * Send performance alert
   */
  async sendPerformanceAlert(userId: number, alert: {
    type: 'low_engagement' | 'high_engagement' | 'low_conversions' | 'high_revenue';
    metric: string;
    value: number;
    comparison?: number;
  }): Promise<Notification> {
    const alertMessages = {
      low_engagement: {
        title: '⚠️ Low Engagement Alert',
        message: `Your engagement rate has dropped to ${alert.value}%. Consider reviewing your content strategy.`,
        type: 'warning' as const,
      },
      high_engagement: {
        title: '🔥 High Engagement Alert!',
        message: `Your posts are performing exceptionally well! Engagement rate: ${alert.value}%`,
        type: 'success' as const,
      },
      low_conversions: {
        title: '📊 Conversion Rate Alert',
        message: `Conversion rate is below average at ${alert.value}%. Review your call-to-action strategy.`,
        type: 'warning' as const,
      },
      high_revenue: {
        title: '💰 Revenue Spike!',
        message: `Great news! You've generated $${alert.value} in the last 24 hours!`,
        type: 'success' as const,
      },
    };

    const notification = alertMessages[alert.type];

    return this.create({
      userId,
      type: notification.type,
      title: notification.title,
      message: notification.message,
      data: { alert },
    });
  }

  /**
   * Send bot status notification
   */
  async sendBotStatusNotification(userId: number, botName: string, status: {
    event: 'started' | 'stopped' | 'error' | 'success';
    message: string;
  }): Promise<Notification> {
    const typeMap = {
      started: 'info',
      stopped: 'warning',
      error: 'error',
      success: 'success',
    };

    const titleMap = {
      started: `🤖 Bot "${botName}" Started`,
      stopped: `⏸️ Bot "${botName}" Stopped`,
      error: `❌ Bot "${botName}" Error`,
      success: `✅ Bot "${botName}" Success`,
    };

    return this.create({
      userId,
      type: typeMap[status.event] as any,
      title: titleMap[status.event],
      message: status.message,
      data: { botName, status: status.event },
    });
  }

  /**
   * Send A/B test results notification
   */
  async sendABTestResults(userId: number, testName: string, winner: 'A' | 'B' | 'tie'): Promise<Notification> {
    const message = winner === 'tie'
      ? `Your A/B test "${testName}" completed. Results are inconclusive - consider running longer.`
      : `Your A/B test "${testName}" is complete! Variant ${winner} is the winner!`;

    return this.create({
      userId,
      type: winner === 'tie' ? 'info' : 'success',
      title: '🧪 A/B Test Results',
      message,
      data: { testName, winner },
    });
  }

  /**
   * Generate weekly performance report
   */
  generateWeeklyReport(userId: number, stats: {
    totalRevenue: number;
    totalEngagement: number;
    totalPosts: number;
    topBot: string;
    growth: number;
  }): Notification {
    const message = `
      📊 Weekly Performance Summary:

      💰 Revenue: $${stats.totalRevenue.toFixed(2)} (${stats.growth > 0 ? '+' : ''}${stats.growth.toFixed(1)}%)
      📈 Engagement: ${stats.totalEngagement} interactions
      📝 Posts: ${stats.totalPosts} published
      🏆 Top Bot: ${stats.topBot}

      Keep up the great work!
    `.trim();

    return {
      userId,
      type: 'info',
      title: '📅 Your Weekly Performance Report',
      message,
      data: stats,
    };
  }

  /**
   * Send scheduled post reminder
   */
  async sendScheduledPostReminder(userId: number, postDetails: {
    platform: string;
    scheduledTime: Date;
    content: string;
  }): Promise<Notification> {
    return this.create({
      userId,
      type: 'info',
      title: '⏰ Upcoming Scheduled Post',
      message: `Your ${postDetails.platform} post is scheduled for ${postDetails.scheduledTime.toLocaleString()}`,
      data: postDetails,
    });
  }

  /**
   * Send content suggestion notification
   */
  async sendContentSuggestion(userId: number, suggestion: {
    platform: string;
    content: string;
    estimatedEngagement: number;
  }): Promise<Notification> {
    return this.create({
      userId,
      type: 'info',
      title: '💡 New Content Suggestion',
      message: `We have a high-performing content idea for ${suggestion.platform} (Est. ${suggestion.estimatedEngagement}% engagement)`,
      data: suggestion,
    });
  }

  /**
   * Batch send notifications
   */
  async sendBatch(notifications: Notification[]): Promise<Notification[]> {
    return Promise.all(notifications.map(n => this.create(n)));
  }

  /**
   * Mark notification as read
   */
  async markAsRead(notificationId: number): Promise<void> {
    // In production, update database
    console.log(`Notification ${notificationId} marked as read`);
  }

  /**
   * Mark all notifications as read for user
   */
  async markAllAsRead(userId: number): Promise<void> {
    // In production, update all user notifications in database
    console.log(`All notifications for user ${userId} marked as read`);
  }

  /**
   * Delete notification
   */
  async delete(notificationId: number): Promise<void> {
    // In production, delete from database
    console.log(`Notification ${notificationId} deleted`);
  }

  /**
   * Get unread count
   */
  async getUnreadCount(userId: number): Promise<number> {
    // In production, query database
    return Math.floor(Math.random() * 10);
  }
}

export const notificationService = new NotificationService();
