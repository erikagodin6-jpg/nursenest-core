import type { CountryCode, TierCode } from "@prisma/client";
import { examQuestionTierStringsForProfileTier } from "@/lib/entitlements/accessible-tiers";
import type { AccessScope } from "@/lib/entitlements/resolve-entitlement";
import { accessScopeIsStaffLearnerEntitlementBypass } from "@/lib/entitlements/staff-learner-bypass";
import { examRowToLessonBankItem, type ExamQuestionMcqRow } from "@/lib/lessons/exam-question-to-lesson-quiz-item";

export type ExplicitQuestionDropReason =
  | "malformed"
  | "duplicate"
  | "missing"
  | "inaccessible"
  | "wrong_region"
  | "non_mcq"
  | "finalize_drop";

export type ExplicitQuestionIdDrop = { id: string; reason: ExplicitQuestionDropReason };

const PUBLISHED_STATUS = new Set(["published", "PUBLISHED"]);

function statusPublished(status: string): boolean {
  return PUBLISHED_STATUS.has(status);
}

/** Region gate for lesson pathway country (matches explicit loader `regionWhereForCountry`). */
export function explicitExamQuestionRegionAllowsCountry(
  regionScope: string | null | undefined,
  pathwayCountryCode: CountryCode,
): boolean {
  if (!regionScope || regionScope === "BOTH") return true;
  if (pathwayCountryCode === "CA") return regionScope === "CA_ONLY" || regionScope === "BOTH";
  return regionScope === "US_ONLY" || regionScope === "BOTH";
}

/**
 * Tier + status (+ staff region) gate aligned with {@link questionAccessWhere} for diagnostics only.
 * `pathwayCountryCode` is used for the lesson’s pathway region filter; staff bypass still uses entitlement.country for OR region.
 */
export function examQuestionRowMeetsEntitlementAccess(
  row: { tier: string; status: string; regionScope: string | null | undefined },
  entitlement: AccessScope,
  pathwayCountryCode: CountryCode,
): boolean {
  if (!entitlement.hasAccess) return false;
  if (!statusPublished(row.status)) return false;
  if (accessScopeIsStaffLearnerEntitlementBypass(entitlement)) {
    const c = entitlement.country as CountryCode | null;
    if (!c) return true;
    return explicitExamQuestionRegionAllowsCountry(row.regionScope, c);
  }
  const tier = entitlement.tier as TierCode | null;
  if (!tier) return false;
  const tiers = examQuestionTierStringsForProfileTier(tier);
  if (!explicitExamQuestionRegionAllowsCountry(row.regionScope, pathwayCountryCode)) return false;
  return tiers.includes(row.tier);
}

export type ExamQuestionProbeRow = ExamQuestionMcqRow & {
  tier: string;
  status: string;
  regionScope: string | null;
};

/**
 * Classify a probe row (loaded by id without entitlement filter) for explicit-lesson diagnostics.
 */
export function classifyProbeRowExplicitDropReason(
  row: ExamQuestionProbeRow,
  pathwayCountryCode: CountryCode,
  entitlement: AccessScope,
): "wrong_region" | "non_mcq" | "inaccessible" | null {
  if (!explicitExamQuestionRegionAllowsCountry(row.regionScope, pathwayCountryCode)) return "wrong_region";
  if (!examRowToLessonBankItem(row)) return "non_mcq";
  if (!examQuestionRowMeetsEntitlementAccess(row, entitlement, pathwayCountryCode)) return "inaccessible";
  return null;
}

export function summarizeExplicitQuestionDropsByReason(drops: ExplicitQuestionIdDrop[]): Record<ExplicitQuestionDropReason, number> {
  const out: Record<ExplicitQuestionDropReason, number> = {
    malformed: 0,
    duplicate: 0,
    missing: 0,
    inaccessible: 0,
    wrong_region: 0,
    non_mcq: 0,
    finalize_drop: 0,
  };
  for (const d of drops) {
    out[d.reason] += 1;
  }
  return out;
}
