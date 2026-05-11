/**
 * Respiratory therapy (RRT) exam question pool — same composition as allied hub inventory + allied profession scope.
 * Framework-agnostic (no `server-only`) so CLI audit scripts can import safely.
 */
import type { Prisma } from "@prisma/client";
import { questionBankWhereForProfile } from "@/lib/entitlements/content-access-scope";
import { expandedExamKeysForPathwayPool } from "@/lib/content-quality/exam-question-exam-normalization";
import { getExamPathwayById } from "@/lib/exam-pathways/exam-product-registry";
import { NON_ECG_PRACTICE_EXAM_WHERE } from "@/lib/practice-tests/cat-question-completeness";
import { generalStudyBankModuleSurfaceWhere } from "@/lib/study-question-pool/study-question-pool-gates";
import { prismaWhereForAlliedProfessionExamQuestions } from "@/lib/allied/allied-exam-question-scope";
import { US_ALLIED_CORE_PATHWAY_ID } from "@/lib/allied/allied-hub-program-model";

/** Matches {@link pathwayExamQuestionMarketingWhere} for non-NP pathways (allied core). */
export function pathwayExamQuestionMarketingWhereForAlliedCore(): Prisma.ExamQuestionWhereInput | null {
  const pathway = getExamPathwayById(US_ALLIED_CORE_PATHWAY_ID);
  if (!pathway) return null;
  const profile = questionBankWhereForProfile(pathway.countryCode, pathway.stripeTier);
  if (pathway.contentExamKeys.length === 0) {
    return profile;
  }
  const examPool = expandedExamKeysForPathwayPool([...new Set(pathway.contentExamKeys)]);
  return {
    AND: [profile, { exam: { in: examPool } }],
  };
}

/** Same gates as `pathwayExamQuestionMarketingHubInventoryWhere` for `us-allied-core`. */
export function usAlliedMarketingHubInventoryWhere(): Prisma.ExamQuestionWhereInput | null {
  const base = pathwayExamQuestionMarketingWhereForAlliedCore();
  if (!base) return null;
  return {
    AND: [base, NON_ECG_PRACTICE_EXAM_WHERE, generalStudyBankModuleSurfaceWhere()],
  };
}

/**
 * RT / respiratory therapy scoped pool: tier + exam keys + study-bank gates + legacy career/tag map for `respiratory`.
 * Returns null only if pathway or profession scope cannot be built (registry misconfiguration).
 */
export function respiratoryTherapyExamQuestionPoolWhere(): Prisma.ExamQuestionWhereInput | null {
  const hub = usAlliedMarketingHubInventoryWhere();
  if (!hub) return null;
  const prof = prismaWhereForAlliedProfessionExamQuestions(US_ALLIED_CORE_PATHWAY_ID, "respiratory");
  if (!prof) return null;
  return { AND: [hub, prof] };
}
