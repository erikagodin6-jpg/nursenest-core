import type { CountryCode, TierCode } from "@prisma/client";
import type { AccessScope } from "@/lib/entitlements/resolve-entitlement";
import { EXAM_PATHWAYS, getExamPathwayById } from "@/lib/exam-pathways/exam-product-registry";
import type { ExamPathwayDefinition } from "@/lib/exam-pathways/types";

/**
 * Phase 1: subscription still uses Prisma `TierCode` + `CountryCode`.
 * Pathway compatibility = same stripe tier + same country + active subscription (or admin).
 * NP specialties share the NP tier until Stripe supports per-pathway prices — use `User.learnerPath` = pathway.id to pick content.
 */
export function listPathwaysCompatibleWithSubscription(scope: AccessScope): ExamPathwayDefinition[] {
  if (!scope.hasAccess || scope.reason === "no_access") return [];
  if (scope.reason === "admin_override") {
    return EXAM_PATHWAYS.filter((p) => p.status !== "hidden");
  }
  const tier = scope.tier as TierCode | null;
  const country = scope.country as CountryCode | null;
  if (!tier || !country) return [];
  return EXAM_PATHWAYS.filter(
    (p) => p.stripeTier === tier && p.countryCode === country && p.status !== "hidden",
  );
}

/** True if the user's subscription tier/country could include this pathway (not specialty-specific yet). */
export function subscriptionCoversPathwayBase(scope: AccessScope, pathway: ExamPathwayDefinition): boolean {
  if (!scope.hasAccess) return false;
  if (scope.reason === "admin_override") return pathway.status !== "hidden";
  const tier = scope.tier as TierCode | null;
  const country = scope.country as CountryCode | null;
  return tier === pathway.stripeTier && country === pathway.countryCode;
}

/**
 * When User.learnerPath is set to a registry id, scope NP (and other) content to that track.
 * Returns null if unset or unknown id.
 */
export function pathwayFromLearnerPath(learnerPath: string | null | undefined): ExamPathwayDefinition | undefined {
  if (!learnerPath || learnerPath.trim().length === 0) return undefined;
  return getExamPathwayById(learnerPath.trim());
}
