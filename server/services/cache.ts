/**
 * In-Memory Caching Service
 * Redis-compatible caching layer for performance optimization
 */

interface CacheEntry {
  value: any;
  expiry?: number;
  tags?: string[];
}

export class CacheService {
  private cache: Map<string, CacheEntry> = new Map();
  private readonly defaultTTL = 300; // 5 minutes in seconds

  /**
   * Set a value in cache
   */
  set(key: string, value: any, ttl?: number, tags?: string[]): void {
    const expiry = ttl ? Date.now() + ttl * 1000 : undefined;

    this.cache.set(key, {
      value,
      expiry,
      tags,
    });
  }

  /**
   * Get a value from cache
   */
  get<T = any>(key: string): T | null {
    const entry = this.cache.get(key);

    if (!entry) {
      return null;
    }

    // Check if expired
    if (entry.expiry && Date.now() > entry.expiry) {
      this.cache.delete(key);
      return null;
    }

    return entry.value as T;
  }

  /**
   * Get or set pattern - if key doesn't exist, compute and cache it
   */
  async getOrSet<T>(
    key: string,
    computeFn: () => Promise<T> | T,
    ttl?: number,
    tags?: string[]
  ): Promise<T> {
    const cached = this.get<T>(key);

    if (cached !== null) {
      return cached;
    }

    const value = await computeFn();
    this.set(key, value, ttl || this.defaultTTL, tags);

    return value;
  }

  /**
   * Delete a key from cache
   */
  delete(key: string): boolean {
    return this.cache.delete(key);
  }

  /**
   * Check if key exists
   */
  has(key: string): boolean {
    const entry = this.cache.get(key);

    if (!entry) {
      return false;
    }

    // Check expiry
    if (entry.expiry && Date.now() > entry.expiry) {
      this.cache.delete(key);
      return false;
    }

    return true;
  }

  /**
   * Invalidate cache by tag
   */
  invalidateByTag(tag: string): number {
    let count = 0;

    for (const [key, entry] of this.cache.entries()) {
      if (entry.tags && entry.tags.includes(tag)) {
        this.cache.delete(key);
        count++;
      }
    }

    return count;
  }

  /**
   * Invalidate cache by pattern
   */
  invalidateByPattern(pattern: string): number {
    let count = 0;
    const regex = new RegExp(pattern);

    for (const key of this.cache.keys()) {
      if (regex.test(key)) {
        this.cache.delete(key);
        count++;
      }
    }

    return count;
  }

  /**
   * Clear all cache
   */
  clear(): void {
    this.cache.clear();
  }

  /**
   * Get cache statistics
   */
  getStats(): {
    size: number;
    keys: string[];
    memory: string;
  } {
    const keys = Array.from(this.cache.keys());

    // Rough memory estimation
    const memoryBytes = JSON.stringify(Array.from(this.cache.entries())).length;
    const memoryKB = (memoryBytes / 1024).toFixed(2);
    const memoryMB = (memoryBytes / 1024 / 1024).toFixed(2);

    const memory = memoryBytes < 1024 * 1024 ? `${memoryKB} KB` : `${memoryMB} MB`;

    return {
      size: this.cache.size,
      keys,
      memory,
    };
  }

  /**
   * Clean up expired entries
   */
  cleanup(): number {
    let count = 0;
    const now = Date.now();

    for (const [key, entry] of this.cache.entries()) {
      if (entry.expiry && now > entry.expiry) {
        this.cache.delete(key);
        count++;
      }
    }

    return count;
  }

  /**
   * Cache wrapper for functions
   */
  memoize<T extends (...args: any[]) => any>(
    fn: T,
    options: {
      keyFn?: (...args: Parameters<T>) => string;
      ttl?: number;
      tags?: string[];
    } = {}
  ): T {
    const { keyFn, ttl, tags } = options;

    return ((...args: Parameters<T>): ReturnType<T> => {
      const key = keyFn ? keyFn(...args) : `memoize:${fn.name}:${JSON.stringify(args)}`;

      const cached = this.get<ReturnType<T>>(key);
      if (cached !== null) {
        return cached;
      }

      const result = fn(...args);

      // Handle promises
      if (result instanceof Promise) {
        return result.then(value => {
          this.set(key, value, ttl || this.defaultTTL, tags);
          return value;
        }) as ReturnType<T>;
      }

      this.set(key, result, ttl || this.defaultTTL, tags);
      return result;
    }) as T;
  }

  /**
   * Create a cache namespace
   */
  namespace(prefix: string) {
    return {
      set: (key: string, value: any, ttl?: number, tags?: string[]) =>
        this.set(`${prefix}:${key}`, value, ttl, tags),
      get: <T = any>(key: string) => this.get<T>(`${prefix}:${key}`),
      delete: (key: string) => this.delete(`${prefix}:${key}`),
      has: (key: string) => this.has(`${prefix}:${key}`),
      getOrSet: <T>(key: string, computeFn: () => Promise<T> | T, ttl?: number, tags?: string[]) =>
        this.getOrSet<T>(`${prefix}:${key}`, computeFn, ttl, tags),
    };
  }
}

// Singleton instance
export const cacheService = new CacheService();

// Common cache namespaces
export const cacheNamespaces = {
  analytics: cacheService.namespace('analytics'),
  bots: cacheService.namespace('bots'),
  templates: cacheService.namespace('templates'),
  users: cacheService.namespace('users'),
  suggestions: cacheService.namespace('suggestions'),
  benchmarks: cacheService.namespace('benchmarks'),
};

// Start periodic cleanup (every 5 minutes)
setInterval(() => {
  const cleaned = cacheService.cleanup();
  if (cleaned > 0) {
    console.log(`[Cache] Cleaned up ${cleaned} expired entries`);
  }
}, 5 * 60 * 1000);
