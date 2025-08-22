/**
 * Database optimization utilities for NeonDB serverless Postgres
 */

export interface QueryMetrics {
  query: string;
  duration: number;
  timestamp: number;
  success: boolean;
  error?: string;
}

export interface ConnectionMetrics {
  activeConnections: number;
  totalConnections: number;
  connectionErrors: number;
  averageQueryTime: number;
}

class DatabaseOptimizer {
  private queryMetrics: QueryMetrics[] = [];
  private connectionMetrics: ConnectionMetrics = {
    activeConnections: 0,
    totalConnections: 0,
    connectionErrors: 0,
    averageQueryTime: 0,
  };

  /**
   * Track query performance
   */
  trackQuery(query: string, startTime: number, success: boolean, error?: string): void {
    const duration = Date.now() - startTime;
    const metric: QueryMetrics = {
      query: this.sanitizeQuery(query),
      duration,
      timestamp: startTime,
      success,
      error,
    };

    this.queryMetrics.push(metric);
    this.updateConnectionMetrics(duration, success);

    // Log slow queries for optimization
    if (duration > 1000) {
      console.warn(`[DB] Slow query detected: ${duration}ms - ${this.sanitizeQuery(query)}`);
    }

    // Log failed queries
    if (!success) {
      console.error(`[DB] Query failed: ${error} - ${this.sanitizeQuery(query)}`);
    }
  }

  /**
   * Sanitize query for logging (remove sensitive data)
   */
  private sanitizeQuery(query: string): string {
    return query
      .replace(/\s+/g, ' ')
      .trim()
      .substring(0, 200); // Limit length for logging
  }

  /**
   * Update connection metrics
   */
  private updateConnectionMetrics(duration: number, success: boolean): void {
    this.connectionMetrics.totalConnections++;
    
    if (!success) {
      this.connectionMetrics.connectionErrors++;
    }

    // Update average query time
    const totalQueries = this.queryMetrics.length;
    const totalDuration = this.queryMetrics.reduce((sum, m) => sum + m.duration, 0);
    this.connectionMetrics.averageQueryTime = totalDuration / totalQueries;
  }

  /**
   * Get database performance summary
   */
  getPerformanceSummary(): {
    totalQueries: number;
    averageQueryTime: number;
    slowQueries: number;
    failedQueries: number;
    connectionMetrics: ConnectionMetrics;
  } {
    const slowQueries = this.queryMetrics.filter(m => m.duration > 1000).length;
    const failedQueries = this.queryMetrics.filter(m => !m.success).length;

    return {
      totalQueries: this.queryMetrics.length,
      averageQueryTime: Math.round(this.connectionMetrics.averageQueryTime),
      slowQueries,
      failedQueries,
      connectionMetrics: { ...this.connectionMetrics },
    };
  }

  /**
   * Clear metrics (useful for memory management in serverless)
   */
  clear(): void {
    this.queryMetrics = [];
    this.connectionMetrics = {
      activeConnections: 0,
      totalConnections: 0,
      connectionErrors: 0,
      averageQueryTime: 0,
    };
  }
}

// Global database optimizer instance
export const databaseOptimizer = new DatabaseOptimizer();

/**
 * Query optimization decorator
 */
export function withQueryOptimization<T extends unknown[], R>(
  fn: (...args: T) => Promise<R>
): (...args: T) => Promise<R> {
  return async (...args: T): Promise<R> => {
    const startTime = Date.now();
    
    try {
      const result = await fn(...args);
      databaseOptimizer.trackQuery('function_call', startTime, true);
      return result;
    } catch (error) {
      databaseOptimizer.trackQuery('function_call', startTime, false, error instanceof Error ? error.message : 'Unknown error');
      throw error;
    }
  };
}

/**
 * NeonDB specific optimizations
 */
export const neonOptimizations = {
  /**
   * Connection pooling configuration for NeonDB
   */
  connectionPool: {
    maxConnections: 10,
    idleTimeout: 30000, // 30 seconds
    connectionTimeout: 10000, // 10 seconds
  },

  /**
   * Query optimization hints for NeonDB
   */
  queryHints: {
    // Use prepared statements for repeated queries
    usePreparedStatements: true,
    
    // Enable query result caching
    enableResultCache: true,
    
    // Set statement timeout
    statementTimeout: 30000, // 30 seconds
    
    // Enable query plan caching
    enablePlanCache: true,
  },

  /**
   * Index recommendations for common queries
   */
  recommendedIndexes: [
    // For works pagination
    'CREATE INDEX IF NOT EXISTS idx_works_created_at ON works(created_at DESC)',
    
    // For works by creator
    'CREATE INDEX IF NOT EXISTS idx_works_creator_id ON works(creator_id)',
    
    // For works by classification
    'CREATE INDEX IF NOT EXISTS idx_works_classification ON works(classification)',
    
    // For tags search
    'CREATE INDEX IF NOT EXISTS idx_works_tags_gin ON works USING GIN(tags)',
    
    // For user authentication
    'CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)',
  ],
};

/**
 * Database health check utility
 */
export async function checkDatabaseHealth(): Promise<{
  status: 'healthy' | 'degraded' | 'unhealthy';
  metrics: {
    totalQueries: number;
    averageQueryTime: number;
    slowQueries: number;
    failedQueries: number;
    connectionMetrics: ConnectionMetrics;
  };
  recommendations: string[];
}> {
  const summary = databaseOptimizer.getPerformanceSummary();
  const recommendations: string[] = [];

  // Determine health status
  let status: 'healthy' | 'degraded' | 'unhealthy' = 'healthy';

  if (summary.failedQueries > summary.totalQueries * 0.1) {
    status = 'unhealthy';
    recommendations.push('High query failure rate detected');
  } else if (summary.slowQueries > summary.totalQueries * 0.05) {
    status = 'degraded';
    recommendations.push('Multiple slow queries detected - consider query optimization');
  }

  if (summary.averageQueryTime > 500) {
    status = status === 'healthy' ? 'degraded' : 'unhealthy';
    recommendations.push('High average query time - consider database optimization');
  }

  if (summary.connectionMetrics.connectionErrors > 0) {
    status = status === 'healthy' ? 'degraded' : 'unhealthy';
    recommendations.push('Connection errors detected - check database connectivity');
  }

  return {
    status,
    metrics: summary,
    recommendations,
  };
}
