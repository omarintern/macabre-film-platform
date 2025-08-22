/**
 * Caching utilities for serverless optimization
 */

export interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

export interface CacheConfig {
  defaultTTL: number; // milliseconds
  maxSize: number;
  cleanupInterval: number; // milliseconds
}

class ServerlessCache {
  private cache = new Map<string, CacheEntry<unknown>>();
  private config: CacheConfig;
  private cleanupTimer?: NodeJS.Timeout;

  constructor(config: Partial<CacheConfig> = {}) {
    this.config = {
      defaultTTL: 5 * 60 * 1000, // 5 minutes
      maxSize: 1000,
      cleanupInterval: 60 * 1000, // 1 minute
      ...config,
    };

    this.startCleanup();
  }

  /**
   * Set a value in the cache
   */
  set<T>(key: string, data: T, ttl?: number): void {
    // Remove oldest entries if cache is full
    if (this.cache.size >= this.config.maxSize) {
      this.evictOldest();
    }

    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
      ttl: ttl || this.config.defaultTTL,
    };

    this.cache.set(key, entry);
  }

  /**
   * Get a value from the cache
   */
  get<T>(key: string): T | null {
    const entry = this.cache.get(key) as CacheEntry<T> | undefined;

    if (!entry) {
      return null; // Cache miss
    }

    // Check if entry has expired
    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return null; // Expired
    }

    return entry.data;
  }

  /**
   * Check if a key exists and is not expired
   */
  has(key: string): boolean {
    const entry = this.cache.get(key);
    
    if (!entry) {
      return false;
    }

    // Check if entry has expired
    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return false;
    }

    return true;
  }

  /**
   * Delete a key from the cache
   */
  delete(key: string): boolean {
    return this.cache.delete(key);
  }

  /**
   * Clear all cache entries
   */
  clear(): void {
    this.cache.clear();
  }

  /**
   * Get cache statistics
   */
  getStats(): {
    size: number;
    maxSize: number;
    hitRate: number;
    totalHits: number;
    totalMisses: number;
  } {
    const totalRequests = this.totalHits + this.totalMisses;
    const hitRate = totalRequests > 0 ? this.totalHits / totalRequests : 0;

    return {
      size: this.cache.size,
      maxSize: this.config.maxSize,
      hitRate: Math.round(hitRate * 100),
      totalHits: this.totalHits,
      totalMisses: this.totalMisses,
    };
  }

  /**
   * Evict the oldest cache entry
   */
  private evictOldest(): void {
    let oldestKey: string | null = null;
    let oldestTimestamp = Date.now();

    for (const [key, entry] of this.cache.entries()) {
      if (entry.timestamp < oldestTimestamp) {
        oldestTimestamp = entry.timestamp;
        oldestKey = key;
      }
    }

    if (oldestKey) {
      this.cache.delete(oldestKey);
    }
  }

  /**
   * Start periodic cleanup of expired entries
   */
  private startCleanup(): void {
    this.cleanupTimer = setInterval(() => {
      this.cleanup();
    }, this.config.cleanupInterval);
  }

  /**
   * Clean up expired cache entries
   */
  private cleanup(): void {
    const now = Date.now();
    const expiredKeys: string[] = [];

    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > entry.ttl) {
        expiredKeys.push(key);
      }
    }

    expiredKeys.forEach(key => this.cache.delete(key));

    if (expiredKeys.length > 0) {
      console.log(`[CACHE] Cleaned up ${expiredKeys.length} expired entries`);
    }
  }

  // Performance tracking
  private totalHits = 0;
  private totalMisses = 0;

  /**
   * Get with performance tracking
   */
  getWithStats<T>(key: string): { data: T | null; hit: boolean } {
    const data = this.get<T>(key);
    const hit = data !== null;

    if (hit) {
      this.totalHits++;
    } else {
      this.totalMisses++;
    }

    return { data, hit };
  }

  /**
   * Stop cleanup timer (useful for serverless cleanup)
   */
  destroy(): void {
    if (this.cleanupTimer) {
      clearInterval(this.cleanupTimer);
    }
    this.clear();
  }
}

// Global cache instance
export const serverlessCache = new ServerlessCache();

/**
 * Cache decorator for API functions
 */
export function withCaching<T>(
  key: string,
  ttl?: number,
  fn?: () => Promise<T>
): (() => Promise<T>) | T | null {
  if (fn) {
    // Direct execution with caching
    return async (): Promise<T> => {
      const cached = serverlessCache.get<T>(key);
      if (cached !== null) {
        return cached;
      }

      const result = await fn();
      serverlessCache.set(key, result, ttl);
      return result;
    };
  } else {
    // Return cached value or null
    return serverlessCache.get<T>(key);
  }
}

/**
 * Cache invalidation utilities
 */
export const cacheUtils = {
  /**
   * Invalidate cache by pattern
   */
  invalidatePattern(pattern: string): void {
    const keys = Array.from(serverlessCache['cache'].keys());
    const matchingKeys = keys.filter(key => key.includes(pattern));
    
    matchingKeys.forEach(key => serverlessCache.delete(key));
    console.log(`[CACHE] Invalidated ${matchingKeys.length} keys matching pattern: ${pattern}`);
  },

  /**
   * Invalidate all cache entries
   */
  invalidateAll(): void {
    serverlessCache.clear();
    console.log('[CACHE] All cache entries invalidated');
  },

  /**
   * Get cache statistics
   */
  getStats() {
    return serverlessCache.getStats();
  },
};
