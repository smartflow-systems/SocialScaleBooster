/**
 * EXTREME PERFORMANCE: Real-time Performance Profiler
 * Identifies bottlenecks and optimization opportunities
 */

export interface ProfileEntry {
  name: string;
  duration: number;
  timestamp: number;
  type: 'query' | 'api' | 'computation' | 'io';
  metadata?: Record<string, any>;
}

export class PerformanceProfiler {
  private entries: ProfileEntry[];
  private activeTimers: Map<string, number>;
  private readonly maxEntries = 10000;

  constructor() {
    this.entries = [];
    this.activeTimers = new Map();
  }

  /**
   * Start timing an operation
   */
  start(name: string, type: ProfileEntry['type'] = 'computation'): string {
    const id = `${name}_${Date.now()}_${Math.random()}`;
    this.activeTimers.set(id, Date.now());
    return id;
  }

  /**
   * Stop timing and record
   */
  stop(id: string, name: string, type: ProfileEntry['type'] = 'computation', metadata?: Record<string, any>): number {
    const startTime = this.activeTimers.get(id);
    if (!startTime) return 0;

    const duration = Date.now() - startTime;
    this.activeTimers.delete(id);

    this.record({
      name,
      duration,
      timestamp: Date.now(),
      type,
      metadata,
    });

    return duration;
  }

  /**
   * Profile an async function
   */
  async profile<T>(
    name: string,
    fn: () => Promise<T>,
    type: ProfileEntry['type'] = 'computation',
    metadata?: Record<string, any>
  ): Promise<T> {
    const start = Date.now();

    try {
      const result = await fn();
      this.record({
        name,
        duration: Date.now() - start,
        timestamp: Date.now(),
        type,
        metadata: { ...metadata, success: true },
      });
      return result;
    } catch (error) {
      this.record({
        name,
        duration: Date.now() - start,
        timestamp: Date.now(),
        type,
        metadata: { ...metadata, success: false, error: (error as Error).message },
      });
      throw error;
    }
  }

  /**
   * Profile a synchronous function
   */
  profileSync<T>(
    name: string,
    fn: () => T,
    type: ProfileEntry['type'] = 'computation',
    metadata?: Record<string, any>
  ): T {
    const start = Date.now();

    try {
      const result = fn();
      this.record({
        name,
        duration: Date.now() - start,
        timestamp: Date.now(),
        type,
        metadata: { ...metadata, success: true },
      });
      return result;
    } catch (error) {
      this.record({
        name,
        duration: Date.now() - start,
        timestamp: Date.now(),
        type,
        metadata: { ...metadata, success: false, error: (error as Error).message },
      });
      throw error;
    }
  }

  /**
   * Get performance summary
   */
  getSummary(timeWindow?: number) {
    const cutoff = timeWindow ? Date.now() - timeWindow : 0;
    const relevantEntries = this.entries.filter(e => e.timestamp > cutoff);

    const byName = new Map<string, number[]>();
    const byType = new Map<string, number[]>();

    relevantEntries.forEach(entry => {
      // By name
      if (!byName.has(entry.name)) {
        byName.set(entry.name, []);
      }
      byName.get(entry.name)!.push(entry.duration);

      // By type
      if (!byType.has(entry.type)) {
        byType.set(entry.type, []);
      }
      byType.get(entry.type)!.push(entry.duration);
    });

    // Calculate statistics
    const operationStats = Array.from(byName.entries()).map(([name, durations]) => ({
      operation: name,
      count: durations.length,
      total: durations.reduce((a, b) => a + b, 0),
      avg: durations.reduce((a, b) => a + b, 0) / durations.length,
      min: Math.min(...durations),
      max: Math.max(...durations),
      p50: this.percentile(durations, 50),
      p95: this.percentile(durations, 95),
      p99: this.percentile(durations, 99),
    }));

    const typeStats = Array.from(byType.entries()).map(([type, durations]) => ({
      type,
      count: durations.length,
      total: durations.reduce((a, b) => a + b, 0),
      avg: durations.reduce((a, b) => a + b, 0) / durations.length,
    }));

    // Find bottlenecks (operations > 100ms average)
    const bottlenecks = operationStats
      .filter(op => op.avg > 100)
      .sort((a, b) => b.avg - a.avg);

    return {
      totalOperations: relevantEntries.length,
      timeWindow: timeWindow ? `${timeWindow / 1000}s` : 'all time',
      operationStats: operationStats.sort((a, b) => b.total - a.total).slice(0, 20),
      typeStats,
      bottlenecks,
      slowestOperations: operationStats.sort((a, b) => b.max - a.max).slice(0, 10),
    };
  }

  /**
   * Get recommendations for optimization
   */
  getRecommendations(): string[] {
    const summary = this.getSummary(300000); // Last 5 minutes
    const recommendations: string[] = [];

    summary.bottlenecks.forEach(op => {
      if (op.avg > 1000) {
        recommendations.push(
          `CRITICAL: ${op.operation} averages ${op.avg.toFixed(0)}ms - Consider caching or optimization`
        );
      } else if (op.avg > 500) {
        recommendations.push(
          `WARNING: ${op.operation} averages ${op.avg.toFixed(0)}ms - Consider optimization`
        );
      } else if (op.avg > 100) {
        recommendations.push(
          `INFO: ${op.operation} averages ${op.avg.toFixed(0)}ms - Monitor for degradation`
        );
      }
    });

    // Check query performance
    const queryStats = summary.typeStats.find(t => t.type === 'query');
    if (queryStats && queryStats.avg > 50) {
      recommendations.push(
        `Database queries average ${queryStats.avg.toFixed(0)}ms - Consider indexing or query optimization`
      );
    }

    // Check API performance
    const apiStats = summary.typeStats.find(t => t.type === 'api');
    if (apiStats && apiStats.avg > 200) {
      recommendations.push(
        `API requests average ${apiStats.avg.toFixed(0)}ms - Consider caching or CDN`
      );
    }

    return recommendations;
  }

  /**
   * Clear old entries
   */
  cleanup(olderThan?: number): number {
    const cutoff = olderThan || Date.now() - 3600000; // Default 1 hour
    const initialLength = this.entries.length;
    this.entries = this.entries.filter(e => e.timestamp > cutoff);
    return initialLength - this.entries.length;
  }

  /**
   * Get recent entries
   */
  getRecentEntries(limit: number = 100): ProfileEntry[] {
    return this.entries.slice(-limit);
  }

  // Private methods

  private record(entry: ProfileEntry): void {
    this.entries.push(entry);

    // Trim if too many
    if (this.entries.length > this.maxEntries) {
      this.entries = this.entries.slice(-this.maxEntries);
    }

    // Log slow operations
    if (entry.duration > 1000) {
      console.warn(
        `[Profiler] SLOW OPERATION: ${entry.name} took ${entry.duration}ms`,
        entry.metadata
      );
    }
  }

  private percentile(values: number[], p: number): number {
    if (values.length === 0) return 0;
    const sorted = values.slice().sort((a, b) => a - b);
    const index = Math.ceil((p / 100) * sorted.length) - 1;
    return sorted[index];
  }
}

export const performanceProfiler = new PerformanceProfiler();

// Auto-cleanup every 10 minutes
setInterval(() => {
  const cleaned = performanceProfiler.cleanup();
  if (cleaned > 0) {
    console.log(`[Profiler] Cleaned ${cleaned} old entries`);
  }
}, 600000);

// Log performance summary every 5 minutes
setInterval(() => {
  const summary = performanceProfiler.getSummary(300000);
  if (summary.totalOperations > 0) {
    console.log('[Profiler] Performance Summary:', {
      operations: summary.totalOperations,
      bottlenecks: summary.bottlenecks.length,
      slowestOp: summary.slowestOperations[0]?.operation,
    });

    const recommendations = performanceProfiler.getRecommendations();
    if (recommendations.length > 0) {
      console.log('[Profiler] Recommendations:', recommendations);
    }
  }
}, 300000);
