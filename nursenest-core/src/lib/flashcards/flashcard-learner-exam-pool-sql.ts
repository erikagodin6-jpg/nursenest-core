import { Prisma } from "@prisma/client";

import type { AccessScope } from "@/lib/entitlements/resolve-entitlement";
import { accessScopeIsStaffLearnerEntitlementBypass } from "@/lib/entitlements/staff-learner-bypass";
import { buildGlobalExamContext } from "@/lib/exam-context/exam-registry";
import type { ExamPathwayDefinition } from "@/lib/exam-pathways/types";
import { npPathwaySpecialtyAndSql } from "@/lib/flashcards/np-pathway-specialty-sql";
import {
  discoveryExamContextScopeForFlashcardFallback,
  examQuestionsDiscoveryWhereSql,
} from "@/lib/questions/subscriber-discovery-aggregates";
import {
  EXAM_QUESTION_CORRECT_ANSWER_PRESENT_SQL,
  EXAM_QUESTION_FLASHCARD_ELIGIBLE_FORMAT_SQL,
  EXAM_QUESTION_NON_ECG_TAG_SQL,
  EXAM_QUESTION_TOPIC_OR_BODY_SQL,
} from "@/lib/questions/exam-question-bank-sql";
import { GENERAL_STUDY_BANK_MODULE_SCOPE_SQL } from "@/lib/study-question-pool/study-question-pool-gates";

/**
 * Flashcard-usability + teaching-minimum gates aligned with
 * {@link countCorePathwayPublishedPool} / hub SQL (non-ECG, stem, JSON answer, taxonomy signal).
 */
export function flashcardLearnerExamQualityGatesSql(): Prisma.Sql {
  return Prisma.sql`
    AND length(trim(coalesce(stem, ''))) >= 10
    AND ${EXAM_QUESTION_CORRECT_ANSWER_PRESENT_SQL}
    AND ${EXAM_QUESTION_TOPIC_OR_BODY_SQL}
    AND ${EXAM_QUESTION_FLASHCARD_ELIGIBLE_FORMAT_SQL}
    AND ${EXAM_QUESTION_NON_ECG_TAG_SQL}
    ${GENERAL_STUDY_BANK_MODULE_SCOPE_SQL}
  `;
}

/**
 * Flashcards may materialize from the shared NCLEX-RN exam bank. If the Canada RN slice has
 * no rows because legacy imports marked shared RN content as US-only, retry with the US
 * region while keeping the same NCLEX-RN exam/tier pathway scope.
 */
export function flashcardLearnerExamPoolCandidateScopes(
  poolScope: AccessScope,
  pathway: ExamPathwayDefinition,
): AccessScope[] {
  const scopes: AccessScope[] = [poolScope];
  if (
    pathway.id === "ca-rn-nclex-rn" &&
    poolScope.hasAccess &&
    !accessScopeIsStaffLearnerEntitlementBypass(poolScope) &&
    poolScope.country === "CA" &&
    poolScope.tier === "RN"
  ) {
    scopes.push({ ...poolScope, country: "US" });
  }
  return scopes;
}

/**
 * WHERE clause (without leading `WHERE`) for learner flashcard exam-bank counts:
 * entitlement discovery SQL + pathway exam/tier scope using **normalized** exam keys (audit parity)
 * + optional `study_link_pathway_id` OR + NP specialty + quality gates.
 *
 * Pass `hasStudyLinkPathwayIdCol: false` when the production DB has not yet applied
 * migration 20260503180000_study_content_pathway_lesson_links — otherwise Postgres throws
 * "column study_link_pathway_id does not exist" and the entire inventory query fails.
 */
export function flashcardLearnerExamPoolWhereSql(
  poolScope: AccessScope,
  pathway: ExamPathwayDefinition,
  hasStudyLinkPathwayIdCol = true,
): Prisma.Sql {
  const base = examQuestionsDiscoveryWhereSql(poolScope);
  const ctx = buildGlobalExamContext(pathway.id, "en");
  const { sql: pathwayScope } = discoveryExamContextScopeForFlashcardFallback(ctx);
  const quality = flashcardLearnerExamQualityGatesSql();
  const np = npPathwaySpecialtyAndSql(pathway);
  const pid = pathway.id;
  const studyLinkOrClause = hasStudyLinkPathwayIdCol
    ? Prisma.sql`OR (coalesce(study_link_pathway_id, '') = ${pid})`
    : Prisma.empty;
  return Prisma.sql`
    ${base}
    AND (
      (1 = 1 ${pathwayScope})
      ${studyLinkOrClause}
    )
    ${quality}
    ${np}
  `;
}
