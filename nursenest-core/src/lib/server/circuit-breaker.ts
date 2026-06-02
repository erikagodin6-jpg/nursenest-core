import "server-only";

/**
 * In-process circuit breaker per dependency (single Node instance / isolate).
 * OPEN: callers should use fallbacks (e.g. skip email, skip optional HTTP).
 */
import { isCircuitBreakerEnabled } from "@/lib/config/production-safety-flags";
import { safeServerLog } from "@/lib/observability/safe-server-log";

export type CircuitDependency = "db" | "external_http" | "email";

type State = "CLOSED" | "OPEN" | "HALF_OPEN";

type Bucket = {
  state: State;
  failures: number[];
  openUntil: number;
};

const FAILURE_WINDOW_MS = 30_000;
const OPEN_THRESHOLD = 5;
const COOLDOWN_MS = 30_000;

const buckets = new Map<CircuitDependency, Bucket>();

function bucket(dep: CircuitDependency): Bucket {
  let b = buckets.get(dep);
  if (!b) {
    b = { state: "CLOSED", failures: [], openUntil: 0 };
    buckets.set(dep, b);
  }
  return b;
}

function pruneFailures(b: Bucket, now: number): void {
  b.failures = b.failures.filter((t) => now - t < FAILURE_WINDOW_MS);
}

function maybeTransitionOpenToHalfOpen(dep: CircuitDependency): void {
  const b = bucket(dep);
  const now = Date.now();
  if (b.state === "OPEN" && now >= b.openUntil) {
    b.state = "HALF_OPEN";
    b.failures = [];
  }
}

export function recordCircuitSuccess(dep: CircuitDependency): void {
  const b = bucket(dep);
  if (b.state === "HALF_OPEN" || b.state === "CLOSED") {
    b.state = "CLOSED";
    b.failures = [];
    b.openUntil = 0;
  }
}

export function recordCircuitFailure(dep: CircuitDependency): void {
  const b = bucket(dep);
  const now = Date.now();
  maybeTransitionOpenToHalfOpen(dep);
  if (b.state === "OPEN") return;

  pruneFailures(b, now);
  b.failures.push(now);
  if (b.failures.length >= OPEN_THRESHOLD) {
    b.state = "OPEN";
    b.openUntil = now + COOLDOWN_MS;
    safeServerLog("resilience", "circuit_open", { dependency: dep, reason: "failure_threshold" });
    void import("@/lib/config/auto-degraded-mode").then((m) => m.recordCircuitOpenForAutoDegraded(dep));
  }
}

export function isCircuitOpen(dep: CircuitDependency): boolean {
  const b = bucket(dep);
  const now = Date.now();
  if (b.state === "OPEN" && now >= b.openUntil) {
    b.state = "HALF_OPEN";
    b.failures = [];
  }
  return b.state === "OPEN";
}

/**
 * When the circuit is OPEN, returns `fallback()` immediately. Otherwise runs `fn` and records success/failure.
 */
export async function runWithCircuitBreaker<T>(
  dep: CircuitDependency,
  fn: () => Promise<T>,
  fallback: () => T | Promise<T>,
): Promise<T> {
  if (!isCircuitBreakerEnabled()) {
    return fn();
  }
  maybeTransitionOpenToHalfOpen(dep);
  if (isCircuitOpen(dep)) {
    return fallback();
  }
  try {
    const r = await fn();
    recordCircuitSuccess(dep);
    return r;
  } catch (e) {
    recordCircuitFailure(dep);
    throw e;
  }
}
