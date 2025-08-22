/**
 * Performance monitoring utilities for serverless optimization
 */

export interface PerformanceMetrics {
  operation: string;
  duration: number;
  timestamp: number;
  endpoint: string;
  method: string;
  statusCode?: number;
  error?: string;
}

export interface CacheMetrics {
  hit: boolean;
  cacheType: string;
  duration: number;
}

class PerformanceMonitor {
  private metrics: PerformanceMetrics[] = [];
  private cacheMetrics: CacheMetrics[] = [];

  /**
   * Start performance monitoring for an operation
   */
  startTimer(operation: string): () => void {
    const startTime = Date.now();
    const startTimestamp = Date.now();

    return (endpoint?: string, method?: string, statusCode?: number, error?: string) => {
      const duration = Date.now() - startTime;
      const metric: PerformanceMetrics = {
        operation,
        duration,
        timestamp: startTimestamp,
        endpoint: endpoint || 'unknown',
        method: method || 'unknown',
        statusCode,
        error,
      };

      this.metrics.push(metric);
      this.logPerformance(metric);
    };
  }

  /**
   * Log performance metrics
   */
  private logPerformance(metric: PerformanceMetrics): void {
    const logLevel = metric.duration > 1000 ? 'warn' : 'log';
    const message = `[PERFORMANCE] ${metric.operation} completed in ${metric.duration}ms (${metric.method} ${metric.endpoint})`;
    
    if (logLevel === 'warn') {
      console.warn(message);
    } else {
      console.log(message);
    }

    // Log slow operations for optimization
    if (metric.duration > 2000) {
      console.error(`[PERFORMANCE] Very slow operation detected: ${metric.operation} took ${metric.duration}ms`);
    }
  }

  /**
   * Record cache metrics
   */
  recordCache(cacheType: string, hit: boolean, duration: number): void {
    const metric: CacheMetrics = {
      hit,
      cacheType,
      duration,
    };

    this.cacheMetrics.push(metric);
    console.log(`[CACHE] ${cacheType} ${hit ? 'HIT' : 'MISS'} in ${duration}ms`);
  }

  /**
   * Get performance summary
   */
  getSummary(): {
    totalOperations: number;
    averageDuration: number;
    slowOperations: number;
    cacheHitRate: number;
  } {
    if (this.metrics.length === 0) {
      return {
        totalOperations: 0,
        averageDuration: 0,
        slowOperations: 0,
        cacheHitRate: 0,
      };
    }

    const totalDuration = this.metrics.reduce((sum, m) => sum + m.duration, 0);
    const averageDuration = totalDuration / this.metrics.length;
    const slowOperations = this.metrics.filter(m => m.duration > 1000).length;

    const cacheHits = this.cacheMetrics.filter(m => m.hit).length;
    const cacheHitRate = this.cacheMetrics.length > 0 ? cacheHits / this.cacheMetrics.length : 0;

    return {
      totalOperations: this.metrics.length,
      averageDuration: Math.round(averageDuration),
      slowOperations,
      cacheHitRate: Math.round(cacheHitRate * 100),
    };
  }

  /**
   * Clear metrics (useful for memory management in serverless)
   */
  clear(): void {
    this.metrics = [];
    this.cacheMetrics = [];
  }

  /**
   * Export metrics for external monitoring
   */
  exportMetrics(): { performance: PerformanceMetrics[]; cache: CacheMetrics[] } {
    return {
      performance: [...this.metrics],
      cache: [...this.cacheMetrics],
    };
  }
}

// Global performance monitor instance
export const performanceMonitor = new PerformanceMonitor();

/**
 * Performance decorator for API routes
 */
export function withPerformanceMonitoring<T extends unknown[], R>(
  operation: string,
  fn: (...args: T) => Promise<R>
): (...args: T) => Promise<R> {
  return async (...args: T): Promise<R> => {
    const endTimer = performanceMonitor.startTimer(operation);
    
    try {
      const result = await fn(...args);
      endTimer();
      return result;
    } catch (error) {
      endTimer();
      throw error;
    }
  };
}

/**
 * Cache performance monitoring
 */
export function withCacheMonitoring<T>(
  cacheType: string,
  fn: () => Promise<T>
): () => Promise<T> {
  return async (): Promise<T> => {
    const startTime = Date.now();
    
    try {
      const result = await fn();
      const duration = Date.now() - startTime;
      performanceMonitor.recordCache(cacheType, true, duration);
      return result;
    } catch (error) {
      const duration = Date.now() - startTime;
      performanceMonitor.recordCache(cacheType, false, duration);
      throw error;
    }
  };
}
