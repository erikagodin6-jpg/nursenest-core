/**
 * Central toggles for production safety features (set via env; defaults favor protection).
 * Does not alter auth, entitlements, or admin RBAC — only operational guards.
 *
 * Infrastructure (multi-instance, managed DB, backups, autoscaling min/max) is platform-level;
 * document in your host (e.g. DigitalOcean App Platform + Managed Postgres).
 */
function envBool(v: string | undefined, defaultOn: boolean): boolean {
  if (v === undefined || v.trim() === "") return defaultOn;
  const t = v.trim().toLowerCase();
  if (t === "0" || t === "false" || t === "no" || t === "off") return false;
  if (t === "1" || t === "true" || t === "yes" || t === "on") return true;
  return defaultOn;
}

/** Global API rate limiting (`src/proxy.ts` + `src/lib/server/rate-limit.ts`). Default: on. */
export function isRateLimitingEnabled(): boolean {
  return envBool(process.env.NN_ENABLE_RATE_LIMITING, true);
}

export { isPublicRateLimitStrictMode } from "@/lib/config/rate-limit-tightening";

/** Circuit breaker for optional dependencies (e.g. email). Default: on. */
export function isCircuitBreakerEnabled(): boolean {
  return envBool(process.env.NN_ENABLE_CIRCUIT_BREAKER, true);
}

/** `withTimeout` / `safeOptional` hard deadlines. Default: on. Entitlement-critical paths keep their own contracts. */
export function isQueryTimeoutsEnabled(): boolean {
  return envBool(process.env.NN_ENABLE_QUERY_TIMEOUTS, true);
}

/** ~500KB JSON response guard on guarded routes. Default: on. */
export function isResponseGuardEnabled(): boolean {
  return envBool(process.env.NN_ENABLE_RESPONSE_GUARD, true);
}

/** Suggested wall-clock budget for optional server work (request-budget helper). Not globally enforced. */
export const REQUEST_WALL_CLOCK_BUDGET_MS = 5000;
