/**
 * Process-local last-known-good cache for optional learner shell data **after** entitlement resolution.
 * Keys are scoped by user + entitlement snapshot — never shared across users or incompatible scopes.
 */
import type { PageEntitlementResult } from "@/lib/entitlements/resolve-entitlement-for-page";

const MAX_ENTRIES = 2_000;
const store = new Map<string, unknown>();

/**
 * Stable key: user + access shape. Omit when entitlement could not be resolved (`"error"`).
 */
export function learnerFallbackCacheKey(userId: string, entitlement: PageEntitlementResult): string | null {
  if (!userId || entitlement === "error") return null;
  const { hasAccess, reason, tier, country } = entitlement;
  return [
    userId,
    hasAccess ? "1" : "0",
    reason,
    tier ?? "null",
    country ?? "null",
  ].join("|");
}

export function getLearnerFallback<T>(userId: string, entitlement: PageEntitlementResult, isT: (v: unknown) => v is T): T | null {
  const key = learnerFallbackCacheKey(userId, entitlement);
  if (!key) return null;
  const raw = store.get(key);
  if (raw === undefined || !isT(raw)) return null;
  return raw;
}

export function setLearnerFallback(userId: string, entitlement: PageEntitlementResult, value: unknown): void {
  const key = learnerFallbackCacheKey(userId, entitlement);
  if (!key) return;
  if (store.size >= MAX_ENTRIES) {
    const first = store.keys().next().value as string | undefined;
    if (first !== undefined) store.delete(first);
  }
  store.set(key, value);
}
