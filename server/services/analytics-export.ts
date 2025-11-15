/**
 * Analytics Export Service
 * Export analytics data in multiple formats (CSV, JSON, PDF-ready)
 */

export interface ExportData {
  period: { start: Date; end: Date };
  metrics: {
    totalRevenue: number;
    totalEngagement: number;
    totalPosts: number;
    totalConversions: number;
    roi: number;
    platforms: Record<string, any>;
  };
  daily: Array<{
    date: string;
    revenue: number;
    engagement: number;
    posts: number;
    conversions: number;
  }>;
  bots: Array<{
    name: string;
    platform: string;
    performance: any;
  }>;
}

export class AnalyticsExportService {
  /**
   * Export analytics data as CSV
   */
  exportAsCSV(data: ExportData): string {
    let csv = 'Analytics Export Report\n\n';

    // Summary section
    csv += 'SUMMARY METRICS\n';
    csv += 'Metric,Value\n';
    csv += `Total Revenue,$${data.metrics.totalRevenue.toFixed(2)}\n`;
    csv += `Total Engagement,${data.metrics.totalEngagement}\n`;
    csv += `Total Posts,${data.metrics.totalPosts}\n`;
    csv += `Total Conversions,${data.metrics.totalConversions}\n`;
    csv += `ROI,${data.metrics.roi}%\n\n`;

    // Daily data section
    csv += 'DAILY PERFORMANCE\n';
    csv += 'Date,Revenue,Engagement,Posts,Conversions\n';
    data.daily.forEach(day => {
      csv += `${day.date},$${day.revenue.toFixed(2)},${day.engagement},${day.posts},${day.conversions}\n`;
    });
    csv += '\n';

    // Bot performance section
    csv += 'BOT PERFORMANCE\n';
    csv += 'Bot Name,Platform,Posts,Engagement,Revenue\n';
    data.bots.forEach(bot => {
      csv += `${bot.name},${bot.platform},${bot.performance.posts || 0},${
        bot.performance.engagement || 0
      },$${(bot.performance.revenue || 0).toFixed(2)}\n`;
    });

    return csv;
  }

  /**
   * Export analytics data as JSON
   */
  exportAsJSON(data: ExportData): string {
    return JSON.stringify(
      {
        exportDate: new Date().toISOString(),
        period: {
          start: data.period.start.toISOString(),
          end: data.period.end.toISOString(),
        },
        summary: data.metrics,
        dailyData: data.daily,
        botPerformance: data.bots,
      },
      null,
      2
    );
  }

  /**
   * Generate PDF-ready HTML report
   */
  exportAsPDFHTML(data: ExportData): string {
    return `
<!DOCTYPE html>
<html>
<head>
  <title>SmartFlow AI - Analytics Report</title>
  <style>
    body {
      font-family: 'Arial', sans-serif;
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
      color: #333;
    }
    .header {
      text-align: center;
      border-bottom: 3px solid #FFD700;
      padding-bottom: 20px;
      margin-bottom: 30px;
    }
    .header h1 {
      color: #3E2723;
      margin: 0;
    }
    .period {
      color: #666;
      font-size: 14px;
    }
    .metrics-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 20px;
      margin-bottom: 30px;
    }
    .metric-card {
      background: #f5f5f5;
      padding: 20px;
      border-radius: 8px;
      border-left: 4px solid #FFD700;
    }
    .metric-label {
      font-size: 12px;
      color: #666;
      text-transform: uppercase;
      margin-bottom: 5px;
    }
    .metric-value {
      font-size: 28px;
      font-weight: bold;
      color: #3E2723;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 30px;
    }
    th {
      background: #3E2723;
      color: white;
      padding: 12px;
      text-align: left;
    }
    td {
      padding: 10px;
      border-bottom: 1px solid #ddd;
    }
    tr:hover {
      background: #f9f9f9;
    }
    .section-title {
      color: #3E2723;
      border-bottom: 2px solid #FFD700;
      padding-bottom: 10px;
      margin-top: 30px;
      margin-bottom: 20px;
    }
    .footer {
      text-align: center;
      margin-top: 50px;
      padding-top: 20px;
      border-top: 1px solid #ddd;
      color: #999;
      font-size: 12px;
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>📊 SmartFlow AI Analytics Report</h1>
    <p class="period">
      ${data.period.start.toLocaleDateString()} - ${data.period.end.toLocaleDateString()}
    </p>
  </div>

  <div class="metrics-grid">
    <div class="metric-card">
      <div class="metric-label">Total Revenue</div>
      <div class="metric-value">$${data.metrics.totalRevenue.toFixed(2)}</div>
    </div>
    <div class="metric-card">
      <div class="metric-label">Total Engagement</div>
      <div class="metric-value">${data.metrics.totalEngagement.toLocaleString()}</div>
    </div>
    <div class="metric-card">
      <div class="metric-label">Total Posts</div>
      <div class="metric-value">${data.metrics.totalPosts}</div>
    </div>
    <div class="metric-card">
      <div class="metric-label">ROI</div>
      <div class="metric-value">${data.metrics.roi}%</div>
    </div>
  </div>

  <h2 class="section-title">Daily Performance</h2>
  <table>
    <thead>
      <tr>
        <th>Date</th>
        <th>Revenue</th>
        <th>Engagement</th>
        <th>Posts</th>
        <th>Conversions</th>
      </tr>
    </thead>
    <tbody>
      ${data.daily
        .map(
          day => `
        <tr>
          <td>${day.date}</td>
          <td>$${day.revenue.toFixed(2)}</td>
          <td>${day.engagement}</td>
          <td>${day.posts}</td>
          <td>${day.conversions}</td>
        </tr>
      `
        )
        .join('')}
    </tbody>
  </table>

  <h2 class="section-title">Bot Performance</h2>
  <table>
    <thead>
      <tr>
        <th>Bot Name</th>
        <th>Platform</th>
        <th>Posts</th>
        <th>Engagement</th>
        <th>Revenue</th>
      </tr>
    </thead>
    <tbody>
      ${data.bots
        .map(
          bot => `
        <tr>
          <td>${bot.name}</td>
          <td>${bot.platform}</td>
          <td>${bot.performance.posts || 0}</td>
          <td>${bot.performance.engagement || 0}</td>
          <td>$${(bot.performance.revenue || 0).toFixed(2)}</td>
        </tr>
      `
        )
        .join('')}
    </tbody>
  </table>

  <div class="footer">
    <p>Generated by SmartFlow AI on ${new Date().toLocaleString()}</p>
    <p>© ${new Date().getFullYear()} SmartFlow AI. All rights reserved.</p>
  </div>
</body>
</html>
    `.trim();
  }

  /**
   * Generate sample export data for testing
   */
  generateSampleData(): ExportData {
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const daily = [];
    for (let i = 0; i < 30; i++) {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      daily.push({
        date: date.toISOString().split('T')[0],
        revenue: Math.random() * 500 + 100,
        engagement: Math.floor(Math.random() * 200) + 50,
        posts: Math.floor(Math.random() * 10) + 1,
        conversions: Math.floor(Math.random() * 20) + 5,
      });
    }

    const bots = [
      {
        name: 'TikTok Product Booster',
        platform: 'tiktok',
        performance: {
          posts: 45,
          engagement: 2840,
          revenue: 1250.5,
        },
      },
      {
        name: 'Instagram Flash Sales',
        platform: 'instagram',
        performance: {
          posts: 38,
          engagement: 1920,
          revenue: 980.25,
        },
      },
      {
        name: 'Facebook Community Bot',
        platform: 'facebook',
        performance: {
          posts: 52,
          engagement: 3100,
          revenue: 1450.75,
        },
      },
    ];

    const totalRevenue = daily.reduce((sum, d) => sum + d.revenue, 0);
    const totalEngagement = daily.reduce((sum, d) => sum + d.engagement, 0);
    const totalPosts = daily.reduce((sum, d) => sum + d.posts, 0);
    const totalConversions = daily.reduce((sum, d) => sum + d.conversions, 0);

    return {
      period: {
        start: thirtyDaysAgo,
        end: now,
      },
      metrics: {
        totalRevenue,
        totalEngagement,
        totalPosts,
        totalConversions,
        roi: 340,
        platforms: {
          tiktok: { engagement: 2840, revenue: 1250.5 },
          instagram: { engagement: 1920, revenue: 980.25 },
          facebook: { engagement: 3100, revenue: 1450.75 },
        },
      },
      daily: daily.reverse(),
      bots,
    };
  }

  /**
   * Export with custom date range
   */
  async exportCustomRange(
    userId: number,
    startDate: Date,
    endDate: Date,
    format: 'csv' | 'json' | 'html'
  ): Promise<string> {
    // In production, fetch actual data from database
    const data = this.generateSampleData();
    data.period = { start: startDate, end: endDate };

    switch (format) {
      case 'csv':
        return this.exportAsCSV(data);
      case 'json':
        return this.exportAsJSON(data);
      case 'html':
        return this.exportAsPDFHTML(data);
      default:
        throw new Error('Unsupported format');
    }
  }
}

export const analyticsExportService = new AnalyticsExportService();
