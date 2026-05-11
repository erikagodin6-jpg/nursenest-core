import type { Prisma } from "@prisma/client";
import { TierCode } from "@prisma/client";
import type { AlliedCareerKey } from "@/lib/pricing/display-catalog";
import type { AccessScope } from "@/lib/entitlements/resolve-entitlement";
import {
  examQuestionTierCaseInsensitiveWhere,
  questionAccessWhere,
} from "@/lib/entitlements/content-access-scope";
import { accessScopeIsStaffLearnerEntitlementBypass } from "@/lib/entitlements/staff-learner-bypass";
import { buildGlobalExamContext } from "@/lib/exam-context/exam-registry";
import { examQuestionPoolWhereForContext } from "@/lib/exam-context/query-scope";
import type { ExamPathwayDefinition } from "@/lib/exam-pathways/types";
import { npPathwaySpecialtyWhere } from "@/lib/exam-pathways/np-question-specialty-scope";
import { prismaWhereForAlliedProfessionExamQuestions } from "@/lib/allied/allied-exam-question-scope";
import { isAlliedMarketingCorePathwayId } from "@/lib/lessons/canonical-lessons-hubs";
import { canonicalProfessionKeyForAlliedCareer } from "@/lib/allied/allied-billing-career-resolution";

/**
 * When a pathway is active, `exam_questions` region + tier ladder must follow the **pathway**
 * catalog (same as the hub URL), not only the Stripe snapshot on `AccessScope` — otherwise
 * `questionAccessWhere` can filter to the wrong country/tier while pathway adds `exam` keys → empty AND.
 *
 * Staff bypass keeps the subscription-derived scope (broad published pool).
 */
export function alignAccessScopeToPathwayForExamQuestionPool(
  entitlement: AccessScope,
  pathway: ExamPathwayDefinition | null,
): AccessScope {
  if (!pathway) return entitlement;
  if (accessScopeIsStaffLearnerEntitlementBypass(entitlement)) return entitlement;
  if (!entitlement.hasAccess) return entitlement;
  return {
    ...entitlement,
    country: pathway.countryCode,
    tier: pathway.stripeTier,
  };
}

/**
 * Interim: ANDs pathway exam keys onto existing tier/country gates.
 * When `exam_questions` gains explicit pathway ids, replace `contentExamKeys` filter with FK or tags.
 */
export function questionAccessWhereWithPathway(
  entitlement: AccessScope,
  pathway: ExamPathwayDefinition | null,
): Prisma.ExamQuestionWhereInput {
  const aligned = alignAccessScopeToPathwayForExamQuestionPool(entitlement, pathway);
  const base = questionAccessWhere(aligned);
  if (!pathway) return base;
  const ctx = buildGlobalExamContext(pathway.id, "en");
  if (!ctx) return { id: { in: [] } };
  const scoped = examQuestionPoolWhereForContext(ctx);
  if (scoped.examIn.length === 0 || scoped.tierMatches.length === 0) {
    return { id: { in: [] } };
  }
  const npSpecialtyScope = npPathwaySpecialtyWhere(pathway);
  const pathwayScope: Prisma.ExamQuestionWhereInput = npSpecialtyScope
    ? {
        AND: [
          { exam: { in: scoped.examIn } },
          examQuestionTierCaseInsensitiveWhere(scoped.tierMatches),
          npSpecialtyScope,
        ],
      }
    : { exam: { in: scoped.examIn }, AND: [examQuestionTierCaseInsensitiveWhere(scoped.tierMatches)] };
  return {
    AND: [base, pathwayScope],
  };
}
