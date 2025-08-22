import { NextRequest, NextResponse } from 'next/server';
import { performanceMonitor } from '../../../lib/utils/performance';
import { cacheUtils } from '../../../lib/utils/cache';
import { databaseOptimizer, checkDatabaseHealth } from '../../../lib/utils/database-optimization';

/**
 * GET endpoint for performance metrics
 * Returns comprehensive performance data for monitoring and optimization
 */
export async function GET() {
  try {
    // Get performance metrics from all monitoring systems
    const performanceSummary = performanceMonitor.getSummary();
    const cacheStats = cacheUtils.getStats();
    const dbHealth = await checkDatabaseHealth();

    // System information
    const systemInfo = {
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      nodeVersion: process.version,
      platform: process.platform,
    };

    // Compile comprehensive performance report
    const performanceReport = {
      system: systemInfo,
      performance: {
        ...performanceSummary,
        cacheHitRate: cacheStats.hitRate,
        averageCacheDuration: cacheStats.totalHits > 0 ? 
          (cacheStats.totalHits * 100) / (cacheStats.totalHits + cacheStats.totalMisses) : 0,
      },
      cache: {
        ...cacheStats,
        recommendations: cacheStats.hitRate < 50 ? 
          ['Consider increasing cache TTL', 'Review cache invalidation strategy'] : 
          ['Cache performance is optimal'],
      },
      database: {
        ...dbHealth,
        recommendations: dbHealth.recommendations,
      },
      recommendations: generateOptimizationRecommendations({
        performance: performanceSummary,
        cache: cacheStats,
        database: dbHealth,
      }),
    };

    return NextResponse.json({
      success: true,
      data: performanceReport,
    });

  } catch (error) {
    console.error('Performance monitoring error:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to retrieve performance metrics',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

/**
 * POST endpoint for clearing performance metrics
 * Useful for serverless cleanup and memory management
 */
export async function POST(request: NextRequest) {
  try {
    const { action } = await request.json();

    switch (action) {
      case 'clear':
        // Clear all performance metrics
        performanceMonitor.clear();
        cacheUtils.invalidateAll();
        databaseOptimizer.clear();
        
        return NextResponse.json({
          success: true,
          message: 'All performance metrics cleared',
        });

      case 'reset':
        // Reset performance monitoring
        performanceMonitor.clear();
        databaseOptimizer.clear();
        
        return NextResponse.json({
          success: true,
          message: 'Performance monitoring reset',
        });

      default:
        return NextResponse.json(
          { 
            success: false, 
            error: 'Invalid action. Use "clear" or "reset"' 
          },
          { status: 400 }
        );
    }

  } catch (error) {
    console.error('Performance management error:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to manage performance metrics',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

/**
 * Generate optimization recommendations based on performance data
 */
function generateOptimizationRecommendations(data: {
  performance: {
    totalOperations: number;
    averageDuration: number;
    slowOperations: number;
    cacheHitRate: number;
  };
  cache: {
    size: number;
    maxSize: number;
    hitRate: number;
    totalHits: number;
    totalMisses: number;
  };
  database: {
    status: 'healthy' | 'degraded' | 'unhealthy';
    metrics: {
      totalQueries: number;
      averageQueryTime: number;
      slowQueries: number;
      failedQueries: number;
    };
    recommendations: string[];
  };
}): string[] {
  const recommendations: string[] = [];

  // Performance recommendations
  if (data.performance.averageDuration > 500) {
    recommendations.push('Consider implementing API response caching');
  }

  if (data.performance.slowOperations > 0) {
    recommendations.push('Review slow operations for optimization opportunities');
  }

  // Cache recommendations
  if (data.cache.hitRate < 30) {
    recommendations.push('Cache hit rate is low - consider adjusting cache strategy');
  }

  if (data.cache.size > data.cache.maxSize * 0.8) {
    recommendations.push('Cache is nearly full - consider increasing max size or TTL');
  }

  // Database recommendations
  if (data.database.status === 'degraded') {
    recommendations.push('Database performance is degraded - review query optimization');
  }

  if (data.database.status === 'unhealthy') {
    recommendations.push('Database health is poor - immediate attention required');
  }

  // General recommendations
  if (recommendations.length === 0) {
    recommendations.push('System performance is optimal');
  }

  return recommendations;
}
