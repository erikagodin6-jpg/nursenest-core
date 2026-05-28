import "server-only";

import type { Prisma } from "@prisma/client";
import type { AccessScope } from "@/lib/entitlements/resolve-entitlement";
import { questionAccessWhere } from "@/lib/entitlements/content-access-scope";
import type { ExamPathwayDefinition } from "@/lib/exam-pathways/types";
import { questionAccessWhereWithPathway } from "@/lib/exam-pathways/pathway-content-scope";
import { NON_ECG_PRACTICE_EXAM_WHERE } from "@/lib/practice-tests/cat-pool";
import { generalStudyBankModuleSurfaceWhere } from "@/lib/study-question-pool/study-question-pool-gates";
import { rtVentilatorPremiumBankGateWhere } from "@/lib/rt-ventilator/rt-ventilator-bank-pool-gate";
import {
  npProviderQuestionScopeWhere,
  standardExamPrepQuestionScopeWhere,
} from "@/lib/questions/difficulty-scope-filter";

/**
 * Lightweight shape for inventory / category counting from ExamQuestion.
 * Select only what is needed — never pull heavy fields (stem, options, rationale)
 * for inventory purposes.
 */
export type ExamQuestionLite = {
  id: string;
  bodySystem: string | null;
  topic: string | null;
};

/**
 * THE canonical WHERE clause for all question-based features:
 * CAT exams, Practice exams, Flashcard inventory, Flashcard sessions.
 *
 * Do NOT deviate from this for any ExamQuestion access.
 * - questionAccessWhere: enforces entitlement tier / country scoping
 * - NON_ECG_PRACTICE_EXAM_WHERE: excludes ECG / video question formats
 * - generalStudyBankModuleSurfaceWhere: excludes lab-drills / med-calc only rows
 * - standardExamPrepQuestionScopeWhere: excludes ICU/RT/provider-level leakage
 */
export function getCanonicalExamQuestionWhere(
  entitlement: AccessScope,
): Prisma.ExamQuestionWhereInput {
  const scopeGate = entitlement.tier === "NP" ? npProviderQuestionScopeWhere() : standardExamPrepQuestionScopeWhere();
  return {
    AND: [
      questionAccessWhere(entitlement),
      NON_ECG_PRACTICE_EXAM_WHERE,
      generalStudyBankModuleSurfaceWhere(),
      rtVentilatorPremiumBankGateWhere(entitlement),
      scopeGate,
    ],
  };
}

/**
 * Pathway-scoped canonical pool — same AND stack as {@link fetchCatPracticePool} base
 * (`questionAccessWhereWithPathway` + non-ECG + general study-bank surface), so flashcard
 * inventory counts align with CAT / adaptive practice for the same `pathwayId`.
 */
export function getCanonicalExamQuestionWhereForPathway(
  entitlement: AccessScope,
  pathway: ExamPathwayDefinition,
): Prisma.ExamQuestionWhereInput {
  const scopeGate = pathway.roleTrack === "np" ? npProviderQuestionScopeWhere() : standardExamPrepQuestionScopeWhere();
  return {
    AND: [
      questionAccessWhereWithPathway(entitlement, pathway),
      NON_ECG_PRACTICE_EXAM_WHERE,
      generalStudyBankModuleSurfaceWhere(),
      rtVentilatorPremiumBankGateWhere(entitlement),
      scopeGate,
    ],
  };
}
