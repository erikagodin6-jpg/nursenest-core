/**
 * Billing alignment for Stripe `past_due` subscriptions.
 *
 * - `strict` (default): past_due never grants premium (Option A).
 * - `grace`: premium until the earlier of (grace anchor + grace days) and `currentPeriodEnd` (Option B).
 *
 * Grace anchor: {@link PastDueGrantInput.pastDueSince} when set (first transition into PAST_DUE);
 * otherwise falls back to `updatedAt` for legacy rows.
 *
 * Env:
 * - `ENTITLEMENT_PAST_DUE_POLICY` — `strict` | `grace` (default `strict`)
 * - `ENTITLEMENT_PAST_DUE_GRACE_DAYS` — positive integer days when policy is `grace` (default `7`)
 */

export type PastDueEntitlementPolicy = "strict" | "grace";

const MS_PER_DAY = 86_400_000;

export type PastDueGrantInput = {
  updatedAt: Date;
  currentPeriodEnd: Date | null;
  /** Set when the subscription first entered PAST_DUE; preferred over `updatedAt` for the grace clock. */
  pastDueSince?: Date | null;
};

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

/** Millisecond timestamp when the configured grace window ends (min of anchor+days and period end). */
export function pastDueGraceWindowEndMs(sub: PastDueGrantInput, graceDays: number): number {
  const anchorMs = (sub.pastDueSince ?? sub.updatedAt).getTime();
  const capMs = sub.currentPeriodEnd ? sub.currentPeriodEnd.getTime() : Number.POSITIVE_INFINITY;
  return Math.min(anchorMs + graceDays * MS_PER_DAY, capMs);
}

export function pastDueSubscriptionGrantsPremium(
  policy: PastDueEntitlementPolicy,
  sub: PastDueGrantInput,
  nowMs: number = Date.now(),
): boolean {
  if (policy !== "grace") return false;
  const graceDays = readPastDueGraceDays();
  return nowMs <= pastDueGraceWindowEndMs(sub, graceDays);
}
