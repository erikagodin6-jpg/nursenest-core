/**
 * 🛡️ Resilience & Degraded-Mode Utilities
 *
 * Provides graceful degradation patterns to prevent cascading failures.
 * Public routes MUST survive learner/auth/DB instability.
 */

/**
 * Timeout standards
 */
export const TIMEOUT_MS = {
  PUBLIC_ROUTE: 3000,
  LEARNER_QUERY: 5000,
  OPTIONAL_SYSTEM: 2000,
  ADMIN_QUERY: 10000,
} as const;

/**
 * Circuit breaker states
 */
type CircuitState = "closed" | "open" | "half-open";

interface CircuitBreakerConfig {
  failureThreshold: number;
  resetTimeout: number;
  halfOpenAttempts: number;
}

class CircuitBreaker {
  private state: CircuitState = "closed";
  private failureCount = 0;
  private lastFailureTime = 0;
  private successCount = 0;

  constructor(private config: CircuitBreakerConfig) {}

  async execute<T>(fn: () => Promise<T>, fallback: () => T): Promise<T> {
    if (this.state === "open") {
      if (Date.now() - this.lastFailureTime > this.config.resetTimeout) {
        this.state = "half-open";
        this.successCount = 0;
      } else {
        return fallback();
      }
    }

    try {
      const result = await fn();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      return fallback();
    }
  }

  private onSuccess(): void {
    this.failureCount = 0;

    if (this.state === "half-open") {
      this.successCount++;
      if (this.successCount >= this.config.halfOpenAttempts) {
        this.state = "closed";
      }
    }
  }

  private onFailure(): void {
    this.failureCount++;
    this.lastFailureTime = Date.now();

    if (this.failureCount >= this.config.failureThreshold) {
      this.state = "open";
    }
  }

  getState(): CircuitState {
    return this.state;
  }
}

/**
 * Safe optional call with timeout
 */
export async function safeOptionalCall<T>(
  fn: () => Promise<T>,
  options: {
    timeout?: number;
    fallback: T;
    onError?: (error: unknown) => void;
  }
): Promise<T> {
  const timeout = options.timeout ?? TIMEOUT_MS.OPTIONAL_SYSTEM;

  try {
    const result = await Promise.race([
      fn(),
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error("Timeout")), timeout)
      ),
    ]);
    return result;
  } catch (error) {
    if (options.onError) {
      options.onError(error);
    }
    return options.fallback;
  }
}

/**
 * Timeout wrapper
 */
export async function withTimeout<T>(
  fn: () => Promise<T>,
  timeoutMs: number,
  timeoutError?: Error
): Promise<T> {
  return Promise.race([
    fn(),
    new Promise<never>((_, reject) =>
      setTimeout(
        () => reject(timeoutError ?? new Error(`Timeout after ${timeoutMs}ms`)),
        timeoutMs
      )
    ),
  ]);
}

/**
 * Circuit breaker wrapper
 */
const circuitBreakers = new Map<string, CircuitBreaker>();

export async function withCircuitBreaker<T>(
  key: string,
  fn: () => Promise<T>,
  fallback: () => T,
  config?: Partial<CircuitBreakerConfig>
): Promise<T> {
  if (!circuitBreakers.has(key)) {
    circuitBreakers.set(
      key,
      new CircuitBreaker({
        failureThreshold: config?.failureThreshold ?? 5,
        resetTimeout: config?.resetTimeout ?? 60000,
        halfOpenAttempts: config?.halfOpenAttempts ?? 3,
      })
    );
  }

  const breaker = circuitBreakers.get(key)!;
  return breaker.execute(fn, fallback);
}

/**
 * Get circuit breaker state for monitoring
 */
export function getCircuitBreakerState(key: string): CircuitState | null {
  return circuitBreakers.get(key)?.getState() ?? null;
}

/**
 * Retry with exponential backoff
 */
export async function withRetry<T>(
  fn: () => Promise<T>,
  options: {
    maxAttempts?: number;
    initialDelayMs?: number;
    maxDelayMs?: number;
    backoffMultiplier?: number;
  } = {}
): Promise<T> {
  const maxAttempts = options.maxAttempts ?? 3;
  const initialDelayMs = options.initialDelayMs ?? 100;
  const maxDelayMs = options.maxDelayMs ?? 5000;
  const backoffMultiplier = options.backoffMultiplier ?? 2;

  let lastError: unknown;
  let delayMs = initialDelayMs;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;

      if (attempt < maxAttempts) {
        await new Promise((resolve) => setTimeout(resolve, delayMs));
        delayMs = Math.min(delayMs * backoffMultiplier, maxDelayMs);
      }
    }
  }

  throw lastError;
}

/**
 * Degraded response helpers
 */
export interface DegradedResponse<T> {
  data: T | null;
  degraded: boolean;
  reason?: string;
}

export function createDegradedResponse<T>(
  data: T | null,
  reason?: string
): DegradedResponse<T> {
  return {
    data,
    degraded: data === null,
    reason,
  };
}

export function createSuccessResponse<T>(data: T): DegradedResponse<T> {
  return {
    data,
    degraded: false,
  };
}

/**
 * Safe DB query wrapper
 */
export async function safeDbQuery<T>(
  query: () => Promise<T>,
  options: {
    timeout?: number;
    fallback: T;
    onError?: (error: unknown) => void;
  }
): Promise<T> {
  return safeOptionalCall(query, {
    timeout: options.timeout ?? TIMEOUT_MS.LEARNER_QUERY,
    fallback: options.fallback,
    onError: options.onError,
  });
}

/**
 * Safe auth check wrapper
 */
export async function safeAuthCheck<T>(
  authFn: () => Promise<T>,
  fallback: T
): Promise<T> {
  return safeOptionalCall(authFn, {
    timeout: TIMEOUT_MS.OPTIONAL_SYSTEM,
    fallback,
    onError: (error) => {
      console.error("Auth check failed:", error);
    },
  });
}
