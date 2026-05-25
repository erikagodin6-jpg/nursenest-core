/**
 * Route Performance Profiler
 * 
 * Comprehensive per-request instrumentation for scalability hardening.
 * Measures TTFB, DB query count, memory allocation, payload size, and more.
 * 
 * Usage:
 * ```ts
 * export async function GET(request: Request) {
 *   const profiler = new RoutePerformanceProfiler('/api/my-route', 'GET');
 *   
 *   try {
 *     const data = await profiler.measureAsync('fetch-data', async () => {
 *       return await prisma.user.findMany();
 *     });
 *     
 *     return profiler.complete(Response.json(data));
 *   } catch (error) {
 *     return profiler.completeWithError(error);
 *   }
 * }
 * ```
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
  
  // Database metrics
  dbQueryCount: number;
  dbTotalDurationMs: number;
  slowQueryCount: number; // queries > 500ms
  
  // Memory metrics
  startMemoryMb: number;
  peakMemoryMb: number;
  endMemoryMb: number;
  memoryDeltaMb: number;
  
  // Payload metrics
  requestBodyBytes?: number;
  responseBodyBytes?: number;
  
  // Timing segments
  segments: PerformanceSegment[];
  
  // Status
  statusCode?: number;
  isError: boolean;
  errorMessage?: string;
  
  // CPU (if available)
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
  
  /**
   * Track memory usage and update peak
   */
  private trackMemory(): number {
    const current = process.memoryUsage();
    const currentMb = current.heapUsed / 1024 / 1024;
    if (currentMb > this.peakMemoryMb) {
      this.peakMemoryMb = currentMb;
    }
    return currentMb;
  }
  
  /**
   * Measure a synchronous operation
   */
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
  
  /**
   * Measure an asynchronous operation
   */
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
  
  /**
   * Track a database query (called by Prisma middleware)
   */
  trackDbQuery(durationMs: number): void {
    this.dbQueryCount++;
    this.dbTotalDurationMs += durationMs;
    
    if (durationMs > 500) {
      this.slowQueryCount++;
    }
  }
  
  /**
   * Set request body size
   */
  setRequestBodySize(bytes: number): void {
    this.requestBodyBytes = bytes;
  }
  
  /**
   * Complete profiling with a successful response
   */
  complete(response: Response): Response {
    const metrics = this.buildMetrics(response);
    this.logMetrics(metrics);
    
    // Add performance headers (non-production only)
    if (process.env.NODE_ENV !== 'production') {
      response.headers.set('X-Performance-Total-Ms', metrics.totalDurationMs.toFixed(2));
      response.headers.set('X-Performance-DB-Queries', metrics.dbQueryCount.toString());
      response.headers.set('X-Performance-DB-Ms', metrics.dbTotalDurationMs.toFixed(2));
      response.headers.set('X-Performance-Memory-Delta-Mb', metrics.memoryDeltaMb.toFixed(2));
    }
    
    return response;
  }
  
  /**
   * Complete profiling with an error
   */
  completeWithError(error: unknown): Response {
    const metrics = this.buildMetrics(null, error);
    this.logMetrics(metrics);
    
    // Return a generic error response
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
  
  /**
   * Build metrics object
   */
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
      
      // Try to get response body size
      const contentLength = response.headers.get('Content-Length');
      if (contentLength) {
        metrics.responseBodyBytes = parseInt(contentLength, 10);
      }
    }
    
    return metrics;
  }
  
  /**
   * Log metrics
   */
  private logMetrics(metrics: RoutePerformanceMetrics): void {
    // Determine log level based on performance
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
      
      // Add flags for easy filtering
      flags: {
        slow: isSlow,
        slowQueries: hasSlowQueries,
        highMemory,
        manyQueries,
      },
    };
    
    // Use structured logging
    console[logLevel](JSON.stringify(logData));
    
    // Also emit to monitoring system if available
    if (typeof globalThis.__emitMetric === 'function') {
      globalThis.__emitMetric('route.performance', metrics);
    }
  }
}

/**
 * Prisma middleware to track query performance
 * 
 * Add to your Prisma client setup:
 * ```ts
 * prisma.$use(createPerformanceMiddleware());
 * ```
 */
export function createPerformanceMiddleware() {
  return async (params: any, next: any) => {
    const startTime = performance.now();
    
    try {
      const result = await next(params);
      const durationMs = performance.now() - startTime;
      
      // Track in active profiler if available
