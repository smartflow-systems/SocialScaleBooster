import { WebSocketServer, WebSocket } from 'ws';
import { Server as HTTPServer } from 'http';
import { IncomingMessage } from 'http';
import { URL } from 'url';
import jwt from 'jsonwebtoken';
import { storage } from './storage';

const JWT_SECRET = process.env.SFS_JWT_SECRET || 'sfs-dev-secret-change-in-production';

interface JWTPayload {
  userId: number;
  username: string;
  email: string;
}

interface AnalyticsData {
  totalRevenue: string;
  monthlyGrowth: number;
  roi: number;
  engagementRate: number;
  activeUsers: number;
  recentActivity: Array<{
    id: string;
    type: 'bot_created' | 'revenue_generated' | 'engagement_spike' | 'conversion';
    message: string;
    timestamp: number;
    value?: number;
  }>;
}

let _analyticsWSInstance: AnalyticsWebSocketServer | null = null;

export function getAnalyticsWS(): AnalyticsWebSocketServer | null {
  return _analyticsWSInstance;
}

export function setAnalyticsWS(instance: AnalyticsWebSocketServer): void {
  _analyticsWSInstance = instance;
}

function parseUserIdFromRequest(req: IncomingMessage): number | null {
  try {
    const rawUrl = req.url ?? '';
    const parsed = new URL(rawUrl, 'http://localhost');
    const token = parsed.searchParams.get('token');
    if (!token) return null;
    const payload = jwt.verify(token, JWT_SECRET) as JWTPayload;
    return payload.userId ?? null;
  } catch {
    return null;
  }
}

export class AnalyticsWebSocketServer {
  private wss: WebSocketServer;
  private clients: Set<WebSocket> = new Set();
  private userClients: Map<number, Set<WebSocket>> = new Map();
  private analyticsInterval: NodeJS.Timeout | null = null;
  private activityInterval: NodeJS.Timeout | null = null;

  constructor(server: HTTPServer) {
    this.wss = new WebSocketServer({ server, path: '/ws/analytics' });
    
    this.wss.on('connection', (ws: WebSocket, req: IncomingMessage) => {
      console.log('Analytics WebSocket client connected');
      this.clients.add(ws);

      const userId = parseUserIdFromRequest(req);
      if (userId !== null) {
        if (!this.userClients.has(userId)) {
          this.userClients.set(userId, new Set());
        }
        this.userClients.get(userId)!.add(ws);
      }
      
      this.sendInitialData(ws);
      
      ws.on('close', () => {
        console.log('Analytics WebSocket client disconnected');
        this.clients.delete(ws);
        if (userId !== null) {
          const sockets = this.userClients.get(userId);
          if (sockets) {
            sockets.delete(ws);
            if (sockets.size === 0) this.userClients.delete(userId);
          }
        }
      });
      
      ws.on('error', (error) => {
        console.error('WebSocket error:', error);
        this.clients.delete(ws);
        if (userId !== null) {
          const sockets = this.userClients.get(userId);
          if (sockets) {
            sockets.delete(ws);
            if (sockets.size === 0) this.userClients.delete(userId);
          }
        }
      });
    });

    this.startRealTimeUpdates();
  }

  private async sendInitialData(ws: WebSocket) {
    try {
      const analyticsData = await this.generateAnalyticsData();
      ws.send(JSON.stringify({
        type: 'initial_data',
        data: analyticsData
      }));
    } catch (error) {
      console.error('Error sending initial data:', error);
    }
  }

  private startRealTimeUpdates() {
    this.analyticsInterval = setInterval(async () => {
      const analyticsData = await this.generateAnalyticsData();
      this.broadcast({
        type: 'metrics_update',
        data: analyticsData
      });
    }, 5000);

    this.activityInterval = setInterval(() => {
      const activity = this.generateRecentActivity();
      this.broadcast({
        type: 'activity_update',
        data: activity
      });
    }, 3000);
  }

  private async generateAnalyticsData(): Promise<AnalyticsData> {
    const baseRevenue = 4550.50;
    const revenueVariation = (Math.random() - 0.5) * 100;
    const currentRevenue = Math.max(0, baseRevenue + revenueVariation);

    const baseROI = 340;
    const roiVariation = (Math.random() - 0.5) * 20;
    const currentROI = Math.max(0, baseROI + roiVariation);

    const baseEngagement = 8.5;
    const engagementVariation = (Math.random() - 0.5) * 2;
    const currentEngagement = Math.max(0, baseEngagement + engagementVariation);

    return {
      totalRevenue: currentRevenue.toFixed(2),
      monthlyGrowth: 25.5 + (Math.random() - 0.5) * 5,
      roi: Math.round(currentROI),
      engagementRate: Number(currentEngagement.toFixed(1)),
      activeUsers: Math.floor(Math.random() * 50) + 180,
      recentActivity: this.generateRecentActivity()
    };
  }

  private generateRecentActivity() {
    const activities = [
      { type: 'bot_created', message: 'New TikTok bot created', value: null },
      { type: 'revenue_generated', message: 'Sale generated', value: Math.floor(Math.random() * 200) + 50 },
      { type: 'engagement_spike', message: 'Engagement spike detected', value: Math.floor(Math.random() * 500) + 100 },
      { type: 'conversion', message: 'High conversion detected', value: Math.floor(Math.random() * 10) + 5 },
      { type: 'bot_created', message: 'Instagram bot activated', value: null },
      { type: 'revenue_generated', message: 'Product sold via bot', value: Math.floor(Math.random() * 300) + 75 }
    ];

    const numActivities = Math.floor(Math.random() * 3) + 1;
    const selectedActivities = [];
    
    for (let i = 0; i < numActivities; i++) {
      const activity = activities[Math.floor(Math.random() * activities.length)];
      selectedActivities.push({
        id: Math.random().toString(36).substr(2, 9),
        type: activity.type as 'bot_created' | 'revenue_generated' | 'engagement_spike' | 'conversion',
        message: activity.message,
        timestamp: Date.now(),
        value: activity.value || undefined
      });
    }

    return selectedActivities;
  }

  private broadcast(message: any) {
    const data = JSON.stringify(message);
    this.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(data);
      }
    });
  }

  private sendToUser(userId: number, message: any) {
    const sockets = this.userClients.get(userId);
    if (!sockets || sockets.size === 0) return;
    const data = JSON.stringify(message);
    sockets.forEach(ws => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(data);
      }
    });
  }

  public broadcastPostPublished(post: { id: number; platform: string; content: string; userId: number }) {
    this.sendToUser(post.userId, {
      type: 'post_published',
      data: {
        id: post.id,
        platform: post.platform,
        content: post.content,
        userId: post.userId,
        publishedAt: Date.now(),
      }
    });
  }

  public broadcastPostFailed(post: { id: number; platform: string; content: string; userId: number }) {
    this.sendToUser(post.userId, {
      type: 'post_failed',
      data: {
        id: post.id,
        platform: post.platform,
        content: post.content,
        userId: post.userId,
        failedAt: Date.now(),
      }
    });
  }

  public close() {
    if (this.analyticsInterval) {
      clearInterval(this.analyticsInterval);
      this.analyticsInterval = null;
    }
    if (this.activityInterval) {
      clearInterval(this.activityInterval);
      this.activityInterval = null;
    }
    this.wss.close();
  }
}
