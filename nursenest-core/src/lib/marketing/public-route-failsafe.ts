/**
 * Public Route Failsafe (Phase 7: Resiliency)
 * 
 * Provides graceful degradation for public marketing routes.
 * Ensures routes remain operational during DB/auth failures.
 */

import { safeServerLog } from "@/lib/observability/safe-server-log";

/**
 * Execute operation with fallback
 * 
 * If operation fails, return fallback value and log error.
 * Public routes remain operational even if optional data fails to load.
 */
export async function withPublicRouteFallback<T>(
  operation: () => Promise<T>,
  fallback: T,
  label: string
): Promise<T> {
  try {
    return await operation();
  } catch (error) {
    safeServerLog('resilience', 'public_route_fallback', {
      label,
      error: error instanceof Error ? error.message : String(error)
    });
    
    // Record metric for monitoring
    recordPublicRouteFallback(label);
    
    return fallback;
  }
}

/**
 * Execute operation with timeout and fallback
 */
export async function withPublicRouteFallbackTimeout<T>(
  operation: () => Promise<T>,
  fallback: T,
  label: string,
  timeoutMs: number = 3000
): Promise<T> {
  try {
    const result = await Promise.race([
      operation(),
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('Timeout')), timeoutMs)
      )
    ]);
    return result;
  } catch (error) {
    safeServerLog('resilience', 'public_route_fallback_timeout', {
      label,
      timeout_ms: timeoutMs,
      error: error instanceof Error ? error.message : String(error)
    });
    
    recordPublicRouteFallback(label);
    
    return fallback;
  }
}

/**
 * Static fallback data for common public route needs
 */
export const PUBLIC_ROUTE_FALLBACKS = {
  homeStats: {
    questions: 10000,
    lessons: 500,
    flashcards: 5000,
    users: 50000
  },
  
  blogPosts: [],
  
  pathwayInfo: {
    title: 'Exam Preparation',
    description: 'Comprehensive study resources',
    features: []
  },
  
  pricingPlans: [
    {
      id: 'basic',
      name: 'Basic',
      price: 29,
      features: ['Practice questions', 'Flashcards', 'Basic support']
    }
  ]
} as const;

/**
 * Record fallback activation for monitoring
 */
function recordPublicRouteFallback(label: string): void {
  // Send to metrics system
  if (typeof globalThis !== 'undefined' && (globalThis as any).__METRICS__) {
    (globalThis as any).__METRICS__.increment('public_route_fallback', {
      label
    });
  }
}

/**
 * Check if public route should use degraded mode
 */
export function shouldUsePublicRouteDegradedMode(): boolean {
  // Check environment flag
  if (process.env.NN_DEGRADED_MODE === '1' || process.env.NN_DEGRADED_MODE === 'true') {
    return true;
  }
  
  // Check auto-degraded mode
  if (process.env.NODE_ENV === 'production') {
    try {
      const { isAutoDegradedActive } = require('@/lib/config/auto-degraded-mode');
      return isAutoDegradedActive();
    } catch {
      return false;
    }
  }
  
  return false;
}

/**
 * Get static fallback for route
 */
export function getStaticFallbackForRoute(route: string): any {
  if (route === '/' || route.startsWith('/home')) {
    return { stats: PUBLIC_ROUTE_FALLBACKS.homeStats };
  }
  
  if (route.startsWith('/blog')) {
    return { posts: PUBLIC_ROUTE_FALLBACKS.blogPosts };
  }
  
  if (route.startsWith('/pricing')) {
    return { plans: PUBLIC_ROUTE_FALLBACKS.pricingPlans };
  }
  
  return null;
}
