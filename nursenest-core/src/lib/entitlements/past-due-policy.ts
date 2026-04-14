/**
 * Billing alignment for Stripe `past_due` subscriptions.
 *
 * - `strict` (default): past_due never grants premium (Option A).
 * - `grace`: premium until the earlier of (updatedAt + grace days) and currentPeriodEnd (Option B).
 *
 * Env:
 * - `ENTITLEMENT_PAST_DUE_POLICY` — `strict` | `grace` (default `strict`)
 * - `ENTITLEMENT_PAST_DUE_GRACE_DAYS` — positive integer days when policy is `grace` (default `7`)
 *
 * Note: `updatedAt` can move on unrelated subscription writes; prefer a dedicated `pastDueSince`
 * field if you need a stable clock for retries.
 */

export type PastDueEntitlementPolicy = "strict" | "grace";

const MS_PER_DAY = 86_400_000;

export function readPastDueEntitlementPolicy(): PastDueEntitlementPolicy {
  const raw = process.env.ENTITLEMENT_PAST_DUE_POLICY?.trim().toLowerCase();
  if (raw === "grace") return "grace";
  return "strict";
}

export function readPastDueGraceDays(): number {
  const raw = process.env.ENTITLEMENT_PAST_DUE_GRACE_DAYS?.trim();
  const n = raw ? Number.parseInt(raw, 10) : 7;
  if (!Number.isFinite(n) || n < 1) return 7;
  return Math.min(Math.floor(n), 365);
}

export function pastDueSubscriptionGrantsPremium(
  policy: PastDueEntitlementPolicy,
  sub: { updatedAt: Date; currentPeriodEnd: Date | null },
  nowMs: number = Date.now(),
): boolean {
  if (policy !== "grace") return false;
  const graceDays = readPastDueGraceDays();
  const windowEndMs = Math.min(
    sub.updatedAt.getTime() + graceDays * MS_PER_DAY,
    sub.currentPeriodEnd ? sub.currentPeriodEnd.getTime() : Number.POSITIVE_INFINITY,
  );
  return nowMs <= windowEndMs;
}
