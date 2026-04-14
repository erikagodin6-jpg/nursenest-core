import "server-only";

import type { ExamPathwayDefinition } from "@/lib/exam-pathways/types";
import { subscriptionCoversPathwayBase } from "@/lib/exam-pathways/pathway-entitlements";
import type { AccessScope } from "@/lib/entitlements/resolve-entitlement";

/**
 * Single server-side check for pathway-scoped paid content: caller must already have resolved
 * `entitlement` for `userId`. Use alongside `requireSubscriberSession()` for APIs that serve
 * RN/PN/NP/allied pools — does not replace session auth.
 */
export function assertSubscriberPathwayAccess(
  entitlement: AccessScope,
  pathway: ExamPathwayDefinition | null | undefined,
): { ok: true } | { ok: false; code: "no_subscription" | "pathway_not_in_plan" } {
  if (!entitlement.hasAccess) {
    return { ok: false, code: "no_subscription" };
  }
  const p = pathway ?? null;
  if (p && !subscriptionCoversPathwayBase(entitlement, p)) {
    return { ok: false, code: "pathway_not_in_plan" };
  }
  return { ok: true };
}
