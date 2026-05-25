/**
 * 📊 Production Metrics & Observability
 *
 * Centralized metrics collection for production hardening monitoring.
 * Tracks runtime isolation, scalability, deployment safety, and cache efficiency.
 */

export interface PublicRuntimeMetrics {
  ttfb: {
    p50: number;
    p95: number;
    p99: number;
  };
  cacheHitRatio: number;
  renderDuration: number;
  routeFailures: number;
  staticFallbackUsage: number;
}

export interface LearnerRuntimeMetrics {
  queryDuration: {
    p50: number;
    p95: number;
    p99: number;
  };
  payloadSizeKB: number;
  sessionConcurrency: number;
  recommendationLatency: number;
  catTiming: {
    questionLoad: number;
    answerSubmit: number;
  };
}

export interface InfrastructureMetrics {
  memoryUsageMB: number;
  cpuUsagePercent: number;
  prismaPoolUtilization: number;
  deploymentStability: number;
  runtimeBoundaryViolations: number;
}

export interface ArchitecturalMetrics {
  forceDynamicCount: number;
  unboundedQueryCount: number;
  runtimeBoundaryViolations: number;
  cacheEfficiency: number;
  degradedModeActivations: number;
}

/**
 * Metric collection interface
 */
export class ProductionMetricsCollector {
  private metrics: Map<string, number> = new Map();
  
  /**
   * Record a metric value
   */
  record(name: string, value: number): void {
    this.metrics.set(name, value);
  }
  
  /**
   * Increment a counter
   */
  increment(name: string, delta: number = 1): void {
    const current = this.metrics.get(name) || 0;
    this.metrics.set(name, current + delta);
  }
  
  /**
   * Get metric value
   */
  get(name: string): number | undefined {
    return this.metrics.get(name);
  }
  
  /**
   * Get all metrics
   */
  getAll(): Record<string, number> {
    return Object.fromEntries(this.metrics);
  }
  
  /**
   * Reset metrics
   */
  reset(): void {
    this.metrics.clear();
  }
}

/**
 * Global metrics collector instance
 */
export const metricsCollector = new ProductionMetricsCollector();

/**
 * Metric names (constants for consistency)
 */
export const METRICS = {
  // Public Runtime
  PUBLIC_TTFB: 'public.ttfb',
  PUBLIC_CACHE_HIT: 'public.cache_hit',
  PUBLIC_CACHE_MISS: 'public.cache_miss',
  PUBLIC_RENDER_DURATION: 'public.render_duration',
  PUBLIC_ROUTE_FAILURE: 'public.route_failure',
  PUBLIC_STATIC_FALLBACK: 'public.static_fallback',
  
  // Learner Runtime
  LEARNER_QUERY_DURATION: 'learner.query_duration',
  LEARNER_PAYLOAD_SIZE: 'learner.payload_size',
  LEARNER_SESSION_COUNT: 'learner.session_count',
  LEARNER_RECOMMENDATION_LATENCY: 'learner.recommendation_latency',
  LEARNER_CAT_QUESTION_LOAD: 'learner.cat.question_load',
  LEARNER_CAT_ANSWER_SUBMIT: 'learner.cat.answer_submit',
  
  // Infrastructure
  INFRA_MEMORY_MB: 'infra.memory_mb',
  INFRA_CPU_PERCENT: 'infra.cpu_percent',
  INFRA_PRISMA_POOL: 'infra.prisma_pool_utilization',
  INFRA_DEPLOYMENT_SUCCESS: 'infra.deployment_success',
  INFRA_DEPLOYMENT_FAILURE: 'infra.deployment_failure',
  
  // Architectural
  ARCH_FORCE_DYNAMIC_COUNT: 'arch.force_dynamic_count',
  ARCH_UNBOUNDED_QUERY: 'arch.unbounded_query',
  ARCH_RUNTIME_VIOLATION: 'arch.runtime_boundary_violation',
  ARCH_DEGRADED_MODE: 'arch.degraded_mode_activation',
} as const;

/**
 * Calculate cache hit ratio
 */
export function calculateCacheHitRatio(): number {
  const hits = metricsCollector.get(METRICS.PUBLIC_CACHE_HIT) || 0;
  const misses = metricsCollector.get(METRICS.PUBLIC_CACHE_MISS) || 0;
  const total = hits + misses;
  
  if (total === 0) return 0;
  return hits / total;
}

/**
 * Check if metrics meet performance budgets
 */
export function validatePerformanceBudgets(metrics: {
  publicTTFB?: number;
  learnerTTFB?: number;
  cacheHitRatio?: number;
  forceDynamicCount?: number;
}): {
  passed: boolean;
  violations: string[];
} {
  const violations: string[] = [];
  
  // Public TTFB budget: <300ms p95
  if (metrics.publicTTFB !== undefined && metrics.publicTTFB > 300) {
    violations.push(`Public TTFB (${metrics.publicTTFB}ms) exceeds budget (300ms)`);
  }
  
  // Learner TTFB budget: <500ms p95
  if (metrics.learnerTTFB !== undefined && metrics.learnerTTFB > 500) {
    violations.push(`Learner TTFB (${metrics.learnerTTFB}ms) exceeds budget (500ms)`);
  }
  
  // Cache hit ratio budget: >80%
  if (metrics.cacheHitRatio !== undefined && metrics.cacheHitRatio < 0.80) {
    violations.push(`Cache hit ratio (${(metrics.cacheHitRatio * 100).toFixed(1)}%) below budget (80%)`);
  }
  
  // Force-dynamic budget: <150
  if (metrics.forceDynamicCount !== undefined && metrics.forceDynamicCount > 150) {
    violations.push(`Force-dynamic count (${metrics.forceDynamicCount}) exceeds budget (150)`);
  }
  
  return {
    passed: violations.length === 0,
    violations,
  };
}

/**
 * Export metrics for monitoring dashboards
 */
export function exportMetricsForDashboard(): {
  publicRuntime: Partial<PublicRuntimeMetrics>;
  learnerRuntime: Partial<LearnerRuntimeMetrics>;
  infrastructure: Partial<InfrastructureMetrics>;
  architectural: Partial<ArchitecturalMetrics>;
  timestamp: string;
} {
  return {
    publicRuntime: {
      cacheHitRatio: calculateCacheHitRatio(),
      routeFailures: metricsCollector.get(METRICS.PUBLIC_ROUTE_FAILURE) || 0,
      staticFallbackUsage: metricsCollector.get(METRICS.PUBLIC_STATIC_FALLBACK) || 0,
    },
    learnerRuntime: {
      sessionConcurrency: metricsCollector.get(METRICS.LEARNER_SESSION_COUNT) || 0,
    },
    infrastructure: {
      memoryUsageMB: metricsCollector.get(METRICS.INFRA_MEMORY_MB) || 0,
      cpuUsagePercent: metricsCollector.get(METRICS.INFRA_CPU_PERCENT) || 0,
      prismaPoolUtilization: metricsCollector.get(METRICS.INFRA_PRISMA_POOL) || 0,
    },
    architectural: {
      forceDynamicCount: metricsCollector.get(METRICS.ARCH_FORCE_DYNAMIC_COUNT) || 0,
      unboundedQueryCount: metricsCollector.get(METRICS.ARCH_UNBOUNDED_QUERY) || 0,
      runtimeBoundaryViolations: metricsCollector.get(METRICS.ARCH_RUNTIME_VIOLATION) || 0,
      degradedModeActivations: metricsCollector.get(METRICS.ARCH_DEGRADED_MODE) || 0,
    },
    timestamp: new Date().toISOString(),
  };
}
