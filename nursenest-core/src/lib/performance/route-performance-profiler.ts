/**
 * Route Performance Profiler
 * 
 * Comprehensive per-request instrumentation for scalability hardening.
 * Measures TTFB, DB query count, memory allocation, payload size, and more.
 */

interface PerformanceSegment {
  name: string;
  durationMs: number;
  startMemoryMb: number;
  endMemoryMb: number;
  memoryDeltaMb: number;
}

interface RoutePerformanceMetrics {
  route: string;
  method: string;
  timestamp: string;
  totalDurationMs: number;
  dbQueryCount: number;
  dbTotalDurationMs: number;
  slowQueryCount: number;
  startMemoryMb: number;
  peakMemoryMb: number;
  endMemoryMb: number;
  memoryDeltaMb: number;
  requestBodyBytes?: number;
  responseBodyBytes?: number;
  segments: PerformanceSegment[];
  statusCode?: number;
  isError: boolean;
  errorMessage?: string;
  cpuUserMs?: number;
  cpuSystemMs?: number;
}

export class RoutePerformanceProfiler {
  private route: string;
  private method: string;
  private startTime: number;
  private startMemory: NodeJS.MemoryUsage;
  private peakMemoryMb = 0;
  private dbQueryCount = 0;
  private dbTotalDurationMs = 0;
  private slowQueryCount = 0;
  private segments: PerformanceSegment[] = [];
  private requestBodyBytes?: number;
  
  constructor(route: string, method: string) {
    this.route = route;
    this.method = method;
    this.startTime = performance.now();
    this.startMemory = process.memoryUsage();
    this.peakMemoryMb = this.startMemory.heapUsed / 1024 / 1024;
  }
  
  private trackMemory(): number {
    const current = process.memoryUsage();
    const currentMb = current.heapUsed / 1024 / 1024;
    if (currentMb > this.peakMemoryMb) {
      this.peakMemoryMb = currentMb;
    }
    return currentMb;
  }
  
  measure<T>(name: string, fn: () => T): T {
    const startMemoryMb = this.trackMemory();
    const startTime = performance.now();
    
    try {
      return fn();
    } finally {
      const endTime = performance.now();
      const endMemoryMb = this.trackMemory();
      
      this.segments.push({
        name,
        durationMs: endTime - startTime,
        startMemoryMb,
        endMemoryMb,
        memoryDeltaMb: endMemoryMb - startMemoryMb,
      });
    }
  }
  
  async measureAsync<T>(name: string, fn: () => Promise<T>): Promise<T> {
    const startMemoryMb = this.trackMemory();
    const startTime = performance.now();
    
    try {
      return await fn();
    } finally {
      const endTime = performance.now();
      const endMemoryMb = this.trackMemory();
      
      this.segments.push({
        name,
        durationMs: endTime - startTime,
        startMemoryMb,
        endMemoryMb,
        memoryDeltaMb: endMemoryMb - startMemoryMb,
      });
    }
  }
  
  trackDbQuery(durationMs: number): void {
    this.dbQueryCount++;
    this.dbTotalDurationMs += durationMs;
    if (durationMs > 500) {
      this.slowQueryCount++;
    }
  }
  
  setRequestBodySize(bytes: number): void {
    this.requestBodyBytes = bytes;
  }
  
  complete(response: Response): Response {
    const metrics = this.buildMetrics(response);
    this.logMetrics(metrics);
    
    if (process.env.NODE_ENV !== 'production') {
      const headers = new Headers(response.headers);
      headers.set('X-Performance-Total-Ms', metrics.totalDurationMs.toFixed(2));
      headers.set('X-Performance-DB-Queries', metrics.dbQueryCount.toString());
      headers.set('X-Performance-DB-Ms', metrics.dbTotalDurationMs.toFixed(2));
      headers.set('X-Performance-Memory-Delta-Mb', metrics.memoryDeltaMb.toFixed(2));
      
      return new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers,
      });
    }
    
    return response;
  }
  
  completeWithError(error: unknown): Response {
    const metrics = this.buildMetrics(null, error);
    this.logMetrics(metrics);
    
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
  
  private buildMetrics(response: Response | null, error?: unknown): RoutePerformanceMetrics {
    const endTime = performance.now();
    const endMemory = process.memoryUsage();
    const cpuUsage = process.cpuUsage();
    
    const metrics: RoutePerformanceMetrics = {
      route: this.route,
      method: this.method,
      timestamp: new Date().toISOString(),
      totalDurationMs: endTime - this.startTime,
      dbQueryCount: this.dbQueryCount,
      dbTotalDurationMs: this.dbTotalDurationMs,
      slowQueryCount: this.slowQueryCount,
      startMemoryMb: this.startMemory.heapUsed / 1024 / 1024,
      peakMemoryMb: this.peakMemoryMb,
      endMemoryMb: endMemory.heapUsed / 1024 / 1024,
      memoryDeltaMb: (endMemory.heapUsed - this.startMemory.heapUsed) / 1024 / 1024,
      requestBodyBytes: this.requestBodyBytes,
      segments: this.segments,
      isError: !!error,
      errorMessage: error instanceof Error ? error.message : String(error),
      cpuUserMs: cpuUsage.user / 1000,
      cpuSystemMs: cpuUsage.system / 1000,
    };
    
    if (response) {
      metrics.statusCode = response.status;
      const contentLength = response.headers.get('Content-Length');
      if (contentLength) {
        metrics.responseBodyBytes = parseInt(contentLength, 10);
      }
    }
    
    return metrics;
  }
  
  private logMetrics(metrics: RoutePerformanceMetrics): void {
    const isSlow = metrics.totalDurationMs > 1000;
    const hasSlowQueries = metrics.slowQueryCount > 0;
    const highMemory = metrics.memoryDeltaMb > 100;
    const manyQueries = metrics.dbQueryCount > 25;
    
    const logLevel = metrics.isError ? 'error' 
      : (isSlow || hasSlowQueries || highMemory || manyQueries) ? 'warn' 
      : 'info';
    
    const logData = {
      event: 'route_performance',
      ...metrics,
      flags: {
        slow: isSlow,
        slowQueries: hasSlowQueries,
        highMemory,
        manyQueries,
      },
    };
    
    console[logLevel](JSON.stringify(logData));
  }
}

export function createPerformanceMiddleware() {
  return async (params: any, next: any) => {
    const startTime = performance.now();
    
    try {
      const result = await next(params);
      const durationMs = performance.now() - startTime;
      
      if (durationMs > 500) {
        console.warn(JSON.stringify({
          event: 'slow_prisma_query',
          model: params.model,
          action: params.action,
          durationMs: durationMs.toFixed(2),
        }));
      }
      
      return result;
    } catch (error) {
      const durationMs = performance.now() - startTime;
      
      console.error(JSON.stringify({
        event: 'prisma_query_error',
        model: params.model,
        action: params.action,
        durationMs: durationMs.toFixed(2),
        error: error instanceof Error ? error.message : String(error),
      }));
      
      throw error;
    }
  };
}

export function withPerformanceProfiler<T extends (...args: any[]) => Promise<Response>>(
  route: string,
  method: string,
  handler: T
): T {
  return (async (...args: any[]) => {
    const profiler = new RoutePerformanceProfiler(route, method);
    
    try {
      const response = await handler(...args);
      return profiler.complete(response);
    } catch (error) {
      return profiler.completeWithError(error);
    }
  }) as T;
}
