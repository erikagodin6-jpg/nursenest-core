import type { TutoringEntitlementSnapshot } from "@/lib/ai-tutor/types";

function isNonEmptyPathwayId(pathwayId: unknown): pathwayId is string {
  return typeof pathwayId === "string" && pathwayId.trim().length > 0;
}

/**
 * Validates entitlement + pathway for tutoring / remediation pipelines.
 * Callers that bypass this must not ship — see unit tests.
 */
export function isValidTutoringEntitlementSnapshot(
  snapshot: unknown,
): snapshot is TutoringEntitlementSnapshot {
  if (!snapshot || typeof snapshot !== "object") return false;
  const s = snapshot as Partial<TutoringEntitlementSnapshot>;
  if (!s.hasAccess) return false;
  if (!isNonEmptyPathwayId(s.pathwayId)) return false;
  return true;
}

export type TutoringGuardFailure = { ok: false; reason: "missing_entitlement" | "missing_pathway" | "invalid_shape" };

export type TutoringGuardResult<T> =
  | ({ ok: true } & { value: T })
  | ({ ok: false } & TutoringGuardFailure);

/**
 * Returns a narrowed snapshot or a failure reason — **no throws** (use in API routes).
 */
export function guardTutoringEntitlementSnapshot(
  snapshot: unknown,
): TutoringGuardResult<TutoringEntitlementSnapshot> {
  if (!snapshot || typeof snapshot !== "object") {
    return { ok: false, reason: "invalid_shape" };
  }
  const s = snapshot as Partial<TutoringEntitlementSnapshot>;
  if (!isNonEmptyPathwayId(s.pathwayId)) {
    return { ok: false, reason: "missing_pathway" };
  }
  if (!s.hasAccess) {
    return { ok: false, reason: "missing_entitlement" };
  }
  return { ok: true, value: s as TutoringEntitlementSnapshot };
}

/**
 * Strict guard for internal call sites where a missing snapshot is a programmer error.
 * API routes should prefer {@link guardTutoringEntitlementSnapshot} and return empty payloads.
 */
export function requireTutoringEntitlementSnapshot(snapshot: unknown): TutoringEntitlementSnapshot {
  const g = guardTutoringEntitlementSnapshot(snapshot);
  if (g.ok) return g.value;
  throw new Error(`[ai-tutor] invalid TutoringEntitlementSnapshot: ${g.reason}`);
}
