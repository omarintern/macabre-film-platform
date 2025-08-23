/**
 * Performance testing utilities for components and pages
 */

import { render, RenderOptions, RenderResult } from '@testing-library/react';
import { ReactElement } from 'react';
import { act } from '@testing-library/react';

// Performance test configuration
export const PERFORMANCE_CONFIG = {
  // Component render thresholds
  componentRenderThreshold: 100, // ms
  componentUpdateThreshold: 50, // ms
  
  // Page load thresholds
  pageLoadThreshold: 2000, // ms
  pageHydrationThreshold: 500, // ms
  
  // Memory usage thresholds
  memoryUsageThreshold: 50 * 1024 * 1024, // 50MB
  
  // Bundle size thresholds
  bundleSizeThreshold: 500 * 1024, // 500KB
  
  // Network request thresholds
  apiResponseThreshold: 1000, // ms
  imageLoadThreshold: 2000, // ms
};

// Performance metrics interface
export interface PerformanceMetrics {
  renderTime: number;
  updateTime?: number;
  memoryUsage?: number;
  bundleSize?: number;
  networkRequests?: number;
  domNodes?: number;
  reflows?: number;
  repaints?: number;
}

// Performance test utilities
export class PerformanceTestUtils {
  private metrics: PerformanceMetrics[] = [];
  private startTime: number = 0;
  private memoryBefore: number = 0;

  /**
   * Measure component render performance
   */
  async measureComponentRender(
    component: ReactElement,
    options?: {
      iterations?: number;
      warmup?: boolean;
      measureUpdates?: boolean;
    }
  ): Promise<PerformanceMetrics> {
    const { iterations = 10, warmup = true, measureUpdates = false } = options || {};
    
    // Warmup run
    if (warmup) {
      await this.renderComponent(component);
    }

    const metrics: PerformanceMetrics[] = [];

    for (let i = 0; i < iterations; i++) {
      const startTime = performance.now();
      
      const { unmount } = await this.renderComponent(component);
      
      const renderTime = performance.now() - startTime;
      
      let updateTime: number | undefined;
      if (measureUpdates) {
        updateTime = await this.measureComponentUpdate(component);
      }
      
      unmount();
      
      metrics.push({
        renderTime,
        updateTime,
        domNodes: document.querySelectorAll('*').length,
      });
    }

    // Calculate average metrics
    const avgMetrics = this.calculateAverageMetrics(metrics);
    this.metrics.push(avgMetrics);
    
    return avgMetrics;
  }

  /**
   * Measure component update performance
   */
  async measureComponentUpdate(component: ReactElement): Promise<number> {
    const { rerender } = await this.renderComponent(component);
    
    const startTime = performance.now();
    
    await act(async () => {
      rerender(component);
    });
    
    return performance.now() - startTime;
  }

  /**
   * Measure page load performance
   */
  async measurePageLoad(
    pageComponent: ReactElement,
    options?: {
      measureHydration?: boolean;
      measureNetwork?: boolean;
    }
  ): Promise<PerformanceMetrics> {
    const { measureHydration = true, measureNetwork = true } = options || {};
    
    this.startTime = performance.now();
    this.memoryBefore = this.getMemoryUsage();
    
    const { unmount } = await this.renderComponent(pageComponent);
    
    const renderTime = performance.now() - this.startTime;
    
    let hydrationTime: number | undefined;
    if (measureHydration) {
      hydrationTime = await this.measureHydrationTime();
    }
    
    const memoryUsage = this.getMemoryUsage() - this.memoryBefore;
    const domNodes = document.querySelectorAll('*').length;
    
    unmount();
    
    const metrics: PerformanceMetrics = {
      renderTime,
      updateTime: hydrationTime,
      memoryUsage,
      domNodes,
    };
    
    this.metrics.push(metrics);
    return metrics;
  }

  /**
   * Measure API performance
   */
  async measureAPIPerformance(
    apiCall: () => Promise<any>,
    options?: {
      iterations?: number;
      concurrent?: boolean;
    }
  ): Promise<PerformanceMetrics> {
    const { iterations = 5, concurrent = false } = options || {};
    
    const startTime = performance.now();
    const results: number[] = [];
    
    if (concurrent) {
      // Concurrent API calls
      const promises = Array(iterations).fill(0).map(async () => {
        const callStart = performance.now();
        await apiCall();
        return performance.now() - callStart;
      });
      
      const times = await Promise.all(promises);
      results.push(...times);
    } else {
      // Sequential API calls
      for (let i = 0; i < iterations; i++) {
        const callStart = performance.now();
        await apiCall();
        results.push(performance.now() - callStart);
      }
    }
    
    const totalTime = performance.now() - startTime;
    const avgTime = results.reduce((sum, time) => sum + time, 0) / results.length;
    
    const metrics: PerformanceMetrics = {
      renderTime: avgTime,
      networkRequests: iterations,
    };
    
    this.metrics.push(metrics);
    return metrics;
  }

  /**
   * Measure bundle size impact
   */
  async measureBundleSize(component: ReactElement): Promise<PerformanceMetrics> {
    // This would integrate with webpack bundle analyzer
    // For now, we'll estimate based on component complexity
    
    const { container } = await this.renderComponent(component);
    const domNodes = container.querySelectorAll('*').length;
    
    // Rough estimation: 1KB per 10 DOM nodes
    const estimatedSize = Math.ceil(domNodes / 10) * 1024;
    
    const metrics: PerformanceMetrics = {
      renderTime: 0,
      bundleSize: estimatedSize,
      domNodes,
    };
    
    this.metrics.push(metrics);
    return metrics;
  }

  /**
   * Run performance benchmarks
   */
  async runPerformanceBenchmarks(
    components: Array<{
      name: string;
      component: ReactElement;
      type: 'component' | 'page';
    }>
  ): Promise<Record<string, PerformanceMetrics>> {
    const results: Record<string, PerformanceMetrics> = {};
    
    for (const { name, component, type } of components) {
      console.log(`[PERFORMANCE] Benchmarking: ${name}`);
      
      try {
        if (type === 'component') {
          results[name] = await this.measureComponentRender(component, {
            iterations: 20,
            warmup: true,
            measureUpdates: true,
          });
        } else {
          results[name] = await this.measurePageLoad(component, {
            measureHydration: true,
            measureNetwork: true,
          });
        }
        
        console.log(`[PERFORMANCE] ✅ Completed: ${name}`);
      } catch (error) {
        console.error(`[PERFORMANCE] ❌ Failed: ${name}`, error);
      }
    }
    
    return results;
  }

  /**
   * Generate performance report
   */
  generatePerformanceReport(): {
    summary: {
      totalTests: number;
      averageRenderTime: number;
      slowestComponent: string;
      fastestComponent: string;
      recommendations: string[];
    };
    details: PerformanceMetrics[];
  } {
    if (this.metrics.length === 0) {
      throw new Error('No performance metrics available');
    }
    
    const avgRenderTime = this.metrics.reduce((sum, m) => sum + m.renderTime, 0) / this.metrics.length;
    
    const slowest = this.metrics.reduce((max, m) => m.renderTime > max.renderTime ? m : max);
    const fastest = this.metrics.reduce((min, m) => m.renderTime < min.renderTime ? m : min);
    
    const recommendations: string[] = [];
    
    if (avgRenderTime > PERFORMANCE_CONFIG.componentRenderThreshold) {
      recommendations.push('Consider optimizing component render performance');
    }
    
    if (slowest.renderTime > PERFORMANCE_CONFIG.pageLoadThreshold) {
      recommendations.push('Investigate slow component rendering');
    }
    
    const memoryUsage = this.metrics.reduce((sum, m) => sum + (m.memoryUsage || 0), 0);
    if (memoryUsage > PERFORMANCE_CONFIG.memoryUsageThreshold) {
      recommendations.push('Monitor memory usage and implement cleanup');
    }
    
    return {
      summary: {
        totalTests: this.metrics.length,
        averageRenderTime: avgRenderTime,
        slowestComponent: `Render time: ${slowest.renderTime.toFixed(2)}ms`,
        fastestComponent: `Render time: ${fastest.renderTime.toFixed(2)}ms`,
        recommendations,
      },
      details: this.metrics,
    };
  }

  /**
   * Validate performance against thresholds
   */
  validatePerformance(metrics: PerformanceMetrics): {
    passed: boolean;
    violations: string[];
  } {
    const violations: string[] = [];
    
    if (metrics.renderTime > PERFORMANCE_CONFIG.componentRenderThreshold) {
      violations.push(`Render time (${metrics.renderTime.toFixed(2)}ms) exceeds threshold (${PERFORMANCE_CONFIG.componentRenderThreshold}ms)`);
    }
    
    if (metrics.updateTime && metrics.updateTime > PERFORMANCE_CONFIG.componentUpdateThreshold) {
      violations.push(`Update time (${metrics.updateTime.toFixed(2)}ms) exceeds threshold (${PERFORMANCE_CONFIG.componentUpdateThreshold}ms)`);
    }
    
    if (metrics.memoryUsage && metrics.memoryUsage > PERFORMANCE_CONFIG.memoryUsageThreshold) {
      violations.push(`Memory usage (${(metrics.memoryUsage / 1024 / 1024).toFixed(2)}MB) exceeds threshold (${PERFORMANCE_CONFIG.memoryUsageThreshold / 1024 / 1024}MB)`);
    }
    
    if (metrics.bundleSize && metrics.bundleSize > PERFORMANCE_CONFIG.bundleSizeThreshold) {
      violations.push(`Bundle size (${(metrics.bundleSize / 1024).toFixed(2)}KB) exceeds threshold (${PERFORMANCE_CONFIG.bundleSizeThreshold / 1024}KB)`);
    }
    
    return {
      passed: violations.length === 0,
      violations,
    };
  }

  // Private helper methods
  private async renderComponent(component: ReactElement): Promise<{
    container: HTMLElement;
    rerender: (newComponent: ReactElement) => void;
    unmount: () => void;
  }> {
    let rerender: (newComponent: ReactElement) => void;
    let unmount: () => void;
    
    const result = render(component);
    
    return {
      container: result.container,
      rerender: result.rerender,
      unmount: result.unmount,
    };
  }

  private async measureHydrationTime(): Promise<number> {
    // Simulate hydration time measurement
    await new Promise(resolve => setTimeout(resolve, 100));
    return 100;
  }

  private getMemoryUsage(): number {
    // This would use performance.memory in browsers that support it
    // For now, return a simulated value
    return Math.random() * 10 * 1024 * 1024; // 0-10MB
  }

  private calculateAverageMetrics(metrics: PerformanceMetrics[]): PerformanceMetrics {
    const avg = metrics.reduce((sum, metric) => ({
      renderTime: sum.renderTime + metric.renderTime,
      updateTime: (sum.updateTime || 0) + (metric.updateTime || 0),
      memoryUsage: (sum.memoryUsage || 0) + (metric.memoryUsage || 0),
      bundleSize: (sum.bundleSize || 0) + (metric.bundleSize || 0),
      networkRequests: (sum.networkRequests || 0) + (metric.networkRequests || 0),
      domNodes: (sum.domNodes || 0) + (metric.domNodes || 0),
      reflows: (sum.reflows || 0) + (metric.reflows || 0),
      repaints: (sum.repaints || 0) + (metric.repaints || 0),
    }), {
      renderTime: 0,
      updateTime: 0,
      memoryUsage: 0,
      bundleSize: 0,
      networkRequests: 0,
      domNodes: 0,
      reflows: 0,
      repaints: 0,
    });

    const count = metrics.length;
    return {
      renderTime: avg.renderTime / count,
      updateTime: avg.updateTime / count,
      memoryUsage: avg.memoryUsage / count,
      bundleSize: avg.bundleSize / count,
      networkRequests: avg.networkRequests / count,
      domNodes: Math.round(avg.domNodes / count),
      reflows: Math.round(avg.reflows / count),
      repaints: Math.round(avg.repaints / count),
    };
  }
}

// Performance test helpers
export const performanceHelpers = {
  /**
   * Create performance test wrapper
   */
  withPerformanceTesting: <T extends any[], R>(
    fn: (...args: T) => R,
    options?: {
      name?: string;
      threshold?: number;
    }
  ) => {
    return async (...args: T): Promise<R> => {
      const startTime = performance.now();
      
      try {
        const result = await fn(...args);
        const executionTime = performance.now() - startTime;
        
        console.log(`[PERFORMANCE] ${options?.name || 'Function'} executed in ${executionTime.toFixed(2)}ms`);
        
        if (options?.threshold && executionTime > options.threshold) {
          console.warn(`[PERFORMANCE] ⚠️ Execution time exceeds threshold of ${options.threshold}ms`);
        }
        
        return result;
      } catch (error) {
        const executionTime = performance.now() - startTime;
        console.error(`[PERFORMANCE] ${options?.name || 'Function'} failed after ${executionTime.toFixed(2)}ms`, error);
        throw error;
      }
    };
  },

  /**
   * Measure function execution time
   */
  measureExecutionTime: async <T>(
    fn: () => Promise<T>,
    name?: string
  ): Promise<{ result: T; executionTime: number }> => {
    const startTime = performance.now();
    const result = await fn();
    const executionTime = performance.now() - startTime;
    
    console.log(`[PERFORMANCE] ${name || 'Function'} executed in ${executionTime.toFixed(2)}ms`);
    
    return { result, executionTime };
  },

  /**
   * Create performance monitoring hook
   */
  createPerformanceMonitor: () => {
    const metrics: Array<{ name: string; time: number; timestamp: number }> = [];
    
    return {
      start: (name: string) => {
        const startTime = performance.now();
        return {
          end: () => {
            const endTime = performance.now();
            metrics.push({
              name,
              time: endTime - startTime,
              timestamp: Date.now(),
            });
          },
        };
      },
      getMetrics: () => metrics,
      clear: () => {
        metrics.length = 0;
      },
    };
  },
};

// Export default utilities
export default {
  PerformanceTestUtils,
  performanceHelpers,
  PERFORMANCE_CONFIG,
};
