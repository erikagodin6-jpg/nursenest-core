/**
 * Runtime Boundary Violations Dashboard (Phase 8: Observability)
 * 
 * Tracks architectural violations and runtime boundary crossings.
 */

export interface RuntimeBoundaryViolation {
  timestamp: string;
  route: string;
  violation_type: 'cookies' | 'headers' | 'auth' | 'prisma' | 'force_dynamic';
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  stack_trace?: string;
}

export interface RuntimeBoundaryMetrics {
  period: string;
  violations: {
    total: number;
    by_type: {
      cookies: number;
      headers: number;
      auth: number;
      prisma: number;
      force_dynamic: number;
    };
    by_severity: {
      low: number;
      medium: number;
      high: number;
      critical: number;
    };
  };
  trends: {
    force_dynamic_count: number;
    force_dynamic_change: number;
    public_routes_with_auth: number;
    public_routes_with_prisma: number;
  };
}

/**
 * Record runtime boundary violation
 */
export function recordRuntimeBoundaryViolation(
  violation: RuntimeBoundaryViolation
): void {
  // Log to observability system
  if (violation.severity === 'critical' || violation.severity === 'high') {
    console.error('[RuntimeBoundaryViolation]', {
      type: violation.violation_type,
      route: violation.route,
      severity: violation.severity,
      message: violation.message
    });
  }
  
  // Send to metrics system
  // recordMetric('runtime_boundary_violation', 1, {
  //   type: violation.violation_type,
  //   severity: violation.severity
  // });
}

/**
 * Get runtime boundary metrics
 */
export async function getRuntimeBoundaryMetrics(
  period: '1h' | '24h' | '7d' = '24h'
): Promise<RuntimeBoundaryMetrics> {
  // Query your metrics store
  // This is a placeholder
  
  return {
    period,
    violations: {
      total: 0,
      by_type: {
        cookies: 0,
        headers: 0,
        auth: 0,
        prisma: 0,
        force_dynamic: 0
      },
      by_severity: {
        low: 0,
        medium: 0,
        high: 0,
        critical: 0
      }
    },
    trends: {
      force_dynamic_count: 212,
      force_dynamic_change: 0,
      public_routes_with_auth: 7,
      public_routes_with_prisma: 5
    }
  };
}

/**
 * Check for architectural regressions
 */
export function detectArchitecturalRegression(
  current: RuntimeBoundaryMetrics,
  baseline: RuntimeBoundaryMetrics
): boolean {
  return (
    current.trends.force_dynamic_count > baseline.trends.force_dynamic_count + 5 ||
    current.trends.public_routes_with_auth > baseline.trends.public_routes_with_auth ||
    current.trends.public_routes_with_prisma > baseline.trends.public_routes_with_prisma
  );
}
