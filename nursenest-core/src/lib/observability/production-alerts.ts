/**
 * Production Alert Definitions (Phase 7: Resiliency)
 * 
 * Defines alert thresholds and actions for production monitoring.
 */

export interface AlertDefinition {
  name: string;
  threshold: number | string;
  severity: 'info' | 'warning' | 'high' | 'critical';
  action: string;
  description: string;
}

/**
 * Production alert definitions
 */
export const PRODUCTION_ALERTS: Record<string, AlertDefinition> = {
  db_timeout: {
    name: 'Database Timeout',
    threshold: 5, // 5 timeouts in 5 minutes
    severity: 'critical',
    action: 'activate_degraded_mode',
    description: 'Multiple database timeouts detected. Activating degraded mode.'
  },
  
  large_cold_render: {
    name: 'Large Cold Render',
    threshold: 3000, // 3 second render
    severity: 'warning',
    action: 'log_and_notify',
    description: 'Route render time exceeds 3 seconds. Investigate optimization opportunities.'
  },
  
  hydration_failure: {
    name: 'Hydration Failure',
    threshold: 10, // 10 failures in 5 minutes
    severity: 'high',
    action: 'notify_team',
    description: 'Multiple hydration failures detected. Check for SSR/client mismatches.'
  },
  
  catalog_read_spike: {
    name: 'Catalog Read Spike',
    threshold: 100, // 100 catalog reads/minute
    severity: 'warning',
    action: 'check_cache_health',
    description: 'Unusual spike in catalog reads. Verify cache is working correctly.'
  },
  
  prisma_saturation: {
    name: 'Prisma Connection Pool Saturation',
    threshold: 0.9, // 90% connection pool usage
    severity: 'critical',
    action: 'activate_degraded_mode',
    description: 'Database connection pool near capacity. Activating degraded mode.'
  },
  
  route_render_stall: {
    name: 'Route Render Stall',
    threshold: 5000, // 5 second stall
    severity: 'critical',
    action: 'circuit_break',
    description: 'Route render stalled for 5+ seconds. Circuit breaker activated.'
  },
  
  force_dynamic_growth: {
    name: 'Force-Dynamic Count Growth',
    threshold: 220, // 212 baseline + 8 tolerance
    severity: 'high',
    action: 'block_deployment',
    description: 'Force-dynamic count exceeded threshold. Blocking deployment.'
  },
  
  memory_pressure: {
    name: 'Memory Pressure',
    threshold: 0.85, // 85% memory usage
    severity: 'high',
    action: 'log_and_notify',
    description: 'Memory usage exceeds 85%. Monitor for memory leaks.'
  },
  
  error_rate_spike: {
    name: 'Error Rate Spike',
    threshold: 0.05, // 5% error rate
    severity: 'critical',
    action: 'notify_team',
    description: 'Error rate exceeds 5%. Investigate immediately.'
  },
  
  cache_miss_rate: {
    name: 'High Cache Miss Rate',
    threshold: 0.5, // 50% miss rate
    severity: 'warning',
    action: 'check_cache_health',
    description: 'Cache miss rate exceeds 50%. Verify cache configuration.'
  },
  
  deployment_regression: {
    name: 'Deployment Regression',
    threshold: 'any',
    severity: 'critical',
    action: 'rollback',
    description: 'Deployment gates failed. Initiating rollback.'
  },
  
  degraded_mode_activation: {
    name: 'Degraded Mode Activated',
    threshold: 1,
    severity: 'high',
    action: 'notify_team',
    description: 'System entered degraded mode. Optional features disabled.'
  }
};

/**
 * Check if alert should fire
 */
export function shouldFireAlert(
  alertName: string,
  currentValue: number
): boolean {
  const alert = PRODUCTION_ALERTS[alertName];
  if (!alert) return false;
  
  if (typeof alert.threshold === 'number') {
    return currentValue >= alert.threshold;
  }
  
  return false;
}

/**
 * Execute alert action
 */
export async function executeAlertAction(
  alertName: string,
  context: Record<string, any>
): Promise<void> {
  const alert = PRODUCTION_ALERTS[alertName];
  if (!alert) return;
  
  console.error(`[ALERT] ${alert.name}:`, {
    severity: alert.severity,
    action: alert.action,
    description: alert.description,
    context
  });
  
  // Execute action based on type
  switch (alert.action) {
    case 'activate_degraded_mode':
      await activateDegradedMode(alertName);
      break;
    
    case 'circuit_break':
      await activateCircuitBreaker(context.dependency);
      break;
    
    case 'block_deployment':
      // Handled by CI/CD gates
      break;
    
    case 'notify_team':
      await notifyTeam(alert, context);
      break;
    
    case 'rollback':
      // Handled by deployment system
      break;
    
    default:
      // Log only
      break;
  }
}

async function activateDegradedMode(reason: string): Promise<void> {
  // Set degraded mode flag
  process.env.NN_DEGRADED_MODE = '1';
  console.warn(`[DEGRADED_MODE] Activated due to: ${reason}`);
}

async function activateCircuitBreaker(dependency: string): Promise<void> {
  // Circuit breaker logic
  console.warn(`[CIRCUIT_BREAKER] Activated for: ${dependency}`);
}

async function notifyTeam(alert: AlertDefinition, context: Record<string, any>): Promise<void> {
  // Send notification (Slack, PagerDuty, etc.)
  console.error(`[NOTIFY] ${alert.name}:`, context);
}
