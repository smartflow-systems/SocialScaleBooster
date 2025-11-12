/**
 * Comprehensive Error Logging and Monitoring System
 * Tracks errors, performance metrics, and system health
 */

export interface LogEntry {
  timestamp: Date;
  level: 'info' | 'warn' | 'error' | 'critical';
  message: string;
  context?: Record<string, any>;
  userId?: number;
  stackTrace?: string;
}

export interface PerformanceMetric {
  name: string;
  duration: number;
  timestamp: Date;
  metadata?: Record<string, any>;
}

export interface HealthCheck {
  service: string;
  status: 'healthy' | 'degraded' | 'down';
  latency?: number;
  message?: string;
}

export class MonitoringService {
  private logs: LogEntry[] = [];
  private performanceMetrics: PerformanceMetric[] = [];
  private readonly maxLogs = 10000; // Keep last 10k logs in memory
  private readonly maxMetrics = 5000;

  /**
   * Log an info message
   */
  info(message: string, context?: Record<string, any>, userId?: number): void {
    this.log('info', message, context, userId);
  }

  /**
   * Log a warning
   */
  warn(message: string, context?: Record<string, any>, userId?: number): void {
    this.log('warn', message, context, userId);
  }

  /**
   * Log an error
   */
  error(message: string, error?: Error, context?: Record<string, any>, userId?: number): void {
    this.log('error', message, {
      ...context,
      error: error?.message,
      stack: error?.stack,
    }, userId, error?.stack);
  }

  /**
   * Log a critical error
   */
  critical(message: string, error?: Error, context?: Record<string, any>, userId?: number): void {
    this.log('critical', message, {
      ...context,
      error: error?.message,
      stack: error?.stack,
    }, userId, error?.stack);

    // In production, this would trigger alerts (email, SMS, PagerDuty, etc.)
    console.error('[CRITICAL]', message, error);
  }

  /**
   * Generic log method
   */
  private log(
    level: LogEntry['level'],
    message: string,
    context?: Record<string, any>,
    userId?: number,
    stackTrace?: string
  ): void {
    const entry: LogEntry = {
      timestamp: new Date(),
      level,
      message,
      context,
      userId,
      stackTrace,
    };

    this.logs.push(entry);

    // Trim logs if exceeded max
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(-this.maxLogs);
    }

    // Console output with colors (development)
    const colors: Record<string, string> = {
      info: '\x1b[36m',
      warn: '\x1b[33m',
      error: '\x1b[31m',
      critical: '\x1b[35m',
    };
    const reset = '\x1b[0m';

    // Sanitize level to prevent format string injection
    const sanitizedLevel = ['info', 'warn', 'error', 'critical'].includes(level) ? level : 'info';
    const colorCode = colors[sanitizedLevel] || '';

    // Sanitize message to prevent format string injection by escaping % format specifiers
    const sanitizedMessage = String(message).replace(/%/g, '%%');

    // Log without passing context directly to console.log to avoid format string injection
    if (context) {
      console.log(
        `${colorCode}[${sanitizedLevel.toUpperCase()}]${reset} ${sanitizedMessage}`,
        JSON.stringify(context)
      );
    } else {
      console.log(`${colorCode}[${sanitizedLevel.toUpperCase()}]${reset} ${sanitizedMessage}`);
    }
  }

  /**
   * Track performance metric
   */
  trackPerformance(name: string, duration: number, metadata?: Record<string, any>): void {
    const metric: PerformanceMetric = {
      name,
      duration,
      timestamp: new Date(),
      metadata,
    };

    this.performanceMetrics.push(metric);

    // Trim metrics if exceeded max
    if (this.performanceMetrics.length > this.maxMetrics) {
      this.performanceMetrics = this.performanceMetrics.slice(-this.maxMetrics);
    }

    // Log slow operations
    if (duration > 1000) {
      this.warn(`Slow operation detected: ${name} took ${duration}ms`, metadata);
    }
  }

  /**
   * Create a performance tracker
   */
  startTimer(name: string): () => void {
    const start = Date.now();

    return (metadata?: Record<string, any>) => {
      const duration = Date.now() - start;
      this.trackPerformance(name, duration, metadata);
    };
  }

  /**
   * Performance decorator for async functions
   */
  measureAsync<T extends (...args: any[]) => Promise<any>>(
    fn: T,
    name?: string
  ): T {
    return (async (...args: Parameters<T>): Promise<ReturnType<T>> => {
      const timer = this.startTimer(name || fn.name);
      try {
        const result = await fn(...args);
        timer({ success: true });
        return result;
      } catch (error) {
        timer({ success: false, error: (error as Error).message });
        throw error;
      }
    }) as T;
  }

  /**
   * Get recent logs
   */
  getRecentLogs(limit: number = 100, level?: LogEntry['level']): LogEntry[] {
    let logs = this.logs;

    if (level) {
      logs = logs.filter(log => log.level === level);
    }

    return logs.slice(-limit).reverse();
  }

  /**
   * Get logs for specific user
   */
  getUserLogs(userId: number, limit: number = 50): LogEntry[] {
    return this.logs
      .filter(log => log.userId === userId)
      .slice(-limit)
      .reverse();
  }

  /**
   * Get performance metrics summary
   */
  getPerformanceSummary(operation?: string): {
    operation: string;
    count: number;
    avgDuration: number;
    minDuration: number;
    maxDuration: number;
    p95: number;
    p99: number;
  }[] {
    const grouped = new Map<string, number[]>();

    this.performanceMetrics.forEach(metric => {
      if (operation && metric.name !== operation) return;

      if (!grouped.has(metric.name)) {
        grouped.set(metric.name, []);
      }
      grouped.get(metric.name)!.push(metric.duration);
    });

    const summaries = Array.from(grouped.entries()).map(([name, durations]) => {
      const sorted = durations.sort((a, b) => a - b);
      const sum = durations.reduce((a, b) => a + b, 0);

      return {
        operation: name,
        count: durations.length,
        avgDuration: Math.round(sum / durations.length),
        minDuration: sorted[0],
        maxDuration: sorted[sorted.length - 1],
        p95: sorted[Math.floor(sorted.length * 0.95)] || 0,
        p99: sorted[Math.floor(sorted.length * 0.99)] || 0,
      };
    });

    return summaries.sort((a, b) => b.avgDuration - a.avgDuration);
  }

  /**
   * System health check
   */
  async performHealthCheck(): Promise<{
    status: 'healthy' | 'degraded' | 'down';
    checks: HealthCheck[];
    uptime: number;
    memory: {
      used: string;
      total: string;
      percentage: number;
    };
  }> {
    const checks: HealthCheck[] = [];

    // Database check
    const dbCheck = await this.checkDatabase();
    checks.push(dbCheck);

    // Cache check
    checks.push({
      service: 'cache',
      status: 'healthy',
      latency: 1,
      message: 'In-memory cache operational',
    });

    // Error rate check
    const recentErrors = this.getRecentLogs(100).filter(
      log => log.level === 'error' || log.level === 'critical'
    );

    if (recentErrors.length > 10) {
      checks.push({
        service: 'error_rate',
        status: 'degraded',
        message: `High error rate: ${recentErrors.length} errors in last 100 logs`,
      });
    } else {
      checks.push({
        service: 'error_rate',
        status: 'healthy',
        message: `Error rate normal: ${recentErrors.length}/100`,
      });
    }

    // Overall status
    const hasDown = checks.some(c => c.status === 'down');
    const hasDegraded = checks.some(c => c.status === 'degraded');

    const status = hasDown ? 'down' : hasDegraded ? 'degraded' : 'healthy';

    // Memory usage
    const memUsage = process.memoryUsage();
    const totalMem = memUsage.heapTotal;
    const usedMem = memUsage.heapUsed;
    const percentage = Math.round((usedMem / totalMem) * 100);

    return {
      status,
      checks,
      uptime: process.uptime(),
      memory: {
        used: `${Math.round(usedMem / 1024 / 1024)}MB`,
        total: `${Math.round(totalMem / 1024 / 1024)}MB`,
        percentage,
      },
    };
  }

  /**
   * Check database connectivity
   */
  private async checkDatabase(): Promise<HealthCheck> {
    const start = Date.now();

    try {
      // In production, this would actually query the database
      // For now, simulate a check
      await new Promise(resolve => setTimeout(resolve, 10));

      const latency = Date.now() - start;

      return {
        service: 'database',
        status: latency < 100 ? 'healthy' : 'degraded',
        latency,
        message: `Database responding in ${latency}ms`,
      };
    } catch (error) {
      return {
        service: 'database',
        status: 'down',
        message: `Database unreachable: ${(error as Error).message}`,
      };
    }
  }

  /**
   * Get error statistics
   */
  getErrorStats(timeWindow: number = 3600000): {
    total: number;
    byLevel: Record<string, number>;
    topErrors: Array<{ message: string; count: number }>;
  } {
    const cutoff = new Date(Date.now() - timeWindow);
    const recentLogs = this.logs.filter(log => log.timestamp > cutoff);

    const byLevel: Record<string, number> = {
      info: 0,
      warn: 0,
      error: 0,
      critical: 0,
    };

    const errorCounts = new Map<string, number>();

    recentLogs.forEach(log => {
      byLevel[log.level]++;

      if (log.level === 'error' || log.level === 'critical') {
        const count = errorCounts.get(log.message) || 0;
        errorCounts.set(log.message, count + 1);
      }
    });

    const topErrors = Array.from(errorCounts.entries())
      .map(([message, count]) => ({ message, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    return {
      total: recentLogs.length,
      byLevel,
      topErrors,
    };
  }

  /**
   * Clear old logs and metrics
   */
  cleanup(olderThan: Date): number {
    const initialSize = this.logs.length + this.performanceMetrics.length;

    this.logs = this.logs.filter(log => log.timestamp > olderThan);
    this.performanceMetrics = this.performanceMetrics.filter(
      metric => metric.timestamp > olderThan
    );

    const finalSize = this.logs.length + this.performanceMetrics.length;

    return initialSize - finalSize;
  }
}

export const monitoringService = new MonitoringService();

// Global error handlers
process.on('uncaughtException', (error) => {
  monitoringService.critical('Uncaught Exception', error);
  // In production, gracefully shut down
});

process.on('unhandledRejection', (reason, promise) => {
  monitoringService.critical('Unhandled Rejection', new Error(String(reason)), {
    promise: String(promise),
  });
});
