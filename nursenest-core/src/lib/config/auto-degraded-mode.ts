/**
 * Optional auto-degraded mode (Node server only): augments `NN_DEGRADED_MODE` when stress signals spike.
 * Does not change entitlements — only skips Tier-2 optional work via {@link shouldSkipNonCriticalLearnerWork}.
 */
import type { CircuitDependency } from "@/lib/server/circuit-breaker";

const g = globalThis as unknown as {
  __nnAutoDegradedUntil?: number;
  __nnAutoDegradedLogged?: boolean;
};

const WINDOW_MS = 60_000;
const SLOW_CRITICAL_BURST = 12;
const CIRCUIT_BURST = 2;

type Ring = number[];

function pushTimeWindow(ring: Ring, now: number): void {
  ring.push(now);
  while (ring.length > 0 && now - ring[0]! > WINDOW_MS) {
    ring.shift();
  }
}

const slowCriticalRing: Ring = [];
const circuitOpenRing: Ring = [];

export function recordSlowQueryCriticalForAutoDegraded(durationMs: number): void {
  if (durationMs <= 1000) return;
  const now = Date.now();
  pushTimeWindow(slowCriticalRing, now);
  maybeEnableAutoDegraded("slow_query_spike", slowCriticalRing.length >= SLOW_CRITICAL_BURST);
}

export function recordCircuitOpenForAutoDegraded(dep: CircuitDependency): void {
  const now = Date.now();
  pushTimeWindow(circuitOpenRing, now);
  maybeEnableAutoDegraded(`circuit_${dep}`, circuitOpenRing.length >= CIRCUIT_BURST);
}

function maybeEnableAutoDegraded(reason: string, condition: boolean): void {
  if (!condition) return;
  const until = Date.now() + 5 * 60_000;
  g.__nnAutoDegradedUntil = Math.max(g.__nnAutoDegradedUntil ?? 0, until);
  if (!g.__nnAutoDegradedLogged) {
    g.__nnAutoDegradedLogged = true;
    void import("@/lib/observability/safe-server-log").then(({ safeServerLog }) => {
      safeServerLog("resilience", "auto_degraded_mode_enabled", { reason: reason.slice(0, 80) });
    });
  }
}

/** Clears one-shot log flag after window so future spikes can log again (best-effort). */
function refreshLogGate(): void {
  const now = Date.now();
  if (slowCriticalRing.length === 0 && circuitOpenRing.length === 0 && (g.__nnAutoDegradedUntil ?? 0) < now) {
    g.__nnAutoDegradedLogged = false;
  }
}

/**
 * Server-only: true when recent stress exceeded thresholds (until cooldown elapses).
 */
export function isAutoDegradedActive(): boolean {
  if (typeof window !== "undefined") return false;
  refreshLogGate();
  const until = g.__nnAutoDegradedUntil ?? 0;
  return Date.now() < until;
}
