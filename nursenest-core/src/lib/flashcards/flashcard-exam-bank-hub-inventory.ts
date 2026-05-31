import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import type { GlobalExamContext } from "@/lib/exam-context/global-exam-context";
import type { AccessScope } from "@/lib/entitlements/resolve-entitlement";
import type { BankExamRowForFlashcard } from "@/lib/flashcards/bank-exam-question-to-flashcard-select";
import { resolveBuilderCategoryId } from "@/lib/flashcards/flashcard-builder-taxonomy";
import {
  flashcardLearnerExamPoolCandidateScopes,
  flashcardLearnerExamPoolWhereSql,
} from "@/lib/flashcards/flashcard-learner-exam-pool-sql";
import { getStudyLinkPathwayColumnExists } from "@/lib/flashcards/flashcard-exam-pool-column-guard";
import type { ExamPathwayDefinition } from "@/lib/exam-pathways/types";
import {
  DISCOVERY_STATEMENT_TIMEOUT_MS,
  discoveryExamContextScopeForFlashcardFallback,
  examQuestionsDiscoveryWhereSql,
} from "@/lib/questions/subscriber-discovery-aggregates";
import { standardExamPrepQuestionScopeSql } from "@/lib/questions/difficulty-scope-filter";
import { safeServerLog } from "@/lib/observability/safe-server-log";
import { GENERAL_STUDY_BANK_MODULE_SCOPE_SQL } from "@/lib/study-question-pool/study-question-pool-gates";

/** Match discovery-style caps — only affects grouped rows, not the total COUNT(*). */
const EXAM_HUB_GROUP_ROW_LIMIT = 320;

/** Cap rows pulled when building learner sessions from the live exam bank (bounded query). */
const EXAM_FLASHCARD_SESSION_POOL_CAP = 4000;

/**
 * SQL fragment that excludes question formats unsuitable for normal flashcard study:
 * - ECG / EKG / rhythm strip questions (separate premium module)
 * - Video / media-only questions (require player, not displayable as text cards)
 * - Questions with no stem text (cannot render a card front)
 * - Questions with no correct answer (cannot render a card back)
 */
const FLASHCARD_USABILITY_SQL = Prisma.sql`
  AND (question_format IS NULL OR lower(trim(question_format)) NOT IN ('ecg', 'ekg', 'video', 'video_case', 'media', 'image_only'))
  AND NOT ('ecg-video' = ANY(tags))
  AND coalesce(trim(stem), '') <> ''
  AND correct_answer IS NOT NULL
  ${standardExamPrepQuestionScopeSql()}
  ${GENERAL_STUDY_BANK_MODULE_SCOPE_SQL}
`;

export type ExamQuestionHubInventory = {
  total: number;
  countsByBuilderId: Record<string, number>;
};

type GroupRow = { grp_kind: string; grp_value: string; cnt: bigint };

/**
 * Pathway-scoped exam question counts grouped once per question (topic preferred, else body_system, else uncategorized),
 * then mapped through {@link resolveBuilderCategoryId} so flashcards hub rows match practice-question taxonomy.
 *
 * Fallback behaviour:
 * - If the exam context scope would produce `AND FALSE` (e.g., pathway has empty contentExamKeys),
 *   the scope is skipped — entitlement WHERE (tier + region) does the scoping.
 * - If the scoped query returns 0 rows despite a non-empty scope, the function retries without the
 *   exam scope. This handles pathways where ExamQuestion rows have mismatched `exam` column values.
 *
 * ECG / video / media question formats are always excluded from the flashcard pool.
 */
function topicOrBodySystemMatchSql(topicFilter: string | null | undefined): Prisma.Sql {
  const t = topicFilter?.trim();
  if (!t || t.length > 160) return Prisma.empty;
  const slug = t.toLowerCase().replace(/\s+/g, "-");
  return Prisma.sql` AND (
    lower(trim(coalesce(topic, ''))) = lower(${t}::text)
    OR lower(trim(coalesce(body_system, ''))) = lower(${t}::text)
    OR lower(regexp_replace(trim(coalesce(topic, '')), '[^a-zA-Z0-9]+', '-', 'g')) = lower(${slug}::text)
    OR lower(regexp_replace(trim(coalesce(body_system, '')), '[^a-zA-Z0-9]+', '-', 'g')) = lower(${slug}::text)
  )`;
}

async function runHubInventoryQuery(
  tx: Parameters<Parameters<typeof prisma.$transaction>[0]>[0],
  w: Prisma.Sql,
  contextScope: Prisma.Sql,
  topicScope: Prisma.Sql,
): Promise<{ total: number; groupRows: GroupRow[] }> {
  const [totalRows, rows] = await Promise.all([
    tx.$queryRaw<[{ n: bigint }]>`
      SELECT COUNT(*)::bigint AS n
      FROM exam_questions
      WHERE ${w}${contextScope}${topicScope}${FLASHCARD_USABILITY_SQL}
    `,
    tx.$queryRaw<GroupRow[]>`
      SELECT
        (CASE
          WHEN coalesce(trim(topic), '') <> '' THEN 'topic'
          WHEN coalesce(trim(body_system), '') <> '' THEN 'body'
          WHEN coalesce(trim(nclex_client_needs_category), '') <> '' THEN 'exam_cat'
          ELSE 'none'
        END)::text AS grp_kind,
        (CASE
          WHEN coalesce(trim(topic), '') <> '' THEN trim(topic)
          WHEN coalesce(trim(body_system), '') <> '' THEN trim(body_system)
          WHEN coalesce(trim(nclex_client_needs_category), '') <> '' THEN trim(nclex_client_needs_category)
          ELSE 'Uncategorized'
        END)::text AS grp_value,
        COUNT(*)::bigint AS cnt
      FROM exam_questions
      WHERE ${w}${contextScope}${topicScope}${FLASHCARD_USABILITY_SQL}
      GROUP BY 1, 2
      ORDER BY cnt DESC
      LIMIT ${EXAM_HUB_GROUP_ROW_LIMIT}
    `,
  ]);

  const rawTotal = totalRows[0]?.n;
  const countedTotal = typeof rawTotal === "bigint" ? Number(rawTotal) : Number(rawTotal ?? 0);
  return { total: countedTotal, groupRows: rows };
}

export async function loadExamQuestionHubInventoryForPathway(
  entitlement: AccessScope,
  pathwayId: string | null | undefined,
  examContext: GlobalExamContext | null,
  topicFilter: string | null = null,
): Promise<ExamQuestionHubInventory> {
  const pid = pathwayId?.trim();
  if (!pid || !entitlement.hasAccess) {
    return { total: 0, countsByBuilderId: {} };
  }

  const w = examQuestionsDiscoveryWhereSql(entitlement);
  const topicScope = topicOrBodySystemMatchSql(topicFilter);

  // Use the flashcard-specific fallback scope: returns Prisma.empty (not AND FALSE) when
  // the pathway has no contentExamKeys configured.
  const { sql: contextScope, hasScopeFilter } = discoveryExamContextScopeForFlashcardFallback(examContext);

  const { total, groupRows } = await prisma.$transaction(
    async (tx) => {
      await tx.$executeRawUnsafe(`SET LOCAL statement_timeout = '${DISCOVERY_STATEMENT_TIMEOUT_MS}ms'`);

      const result = await runHubInventoryQuery(tx, w, contextScope, topicScope);

      // Fallback: if the scoped query returned 0 rows but we had an active exam scope,
      // retry without the scope. This handles cases where ExamQuestion rows have exam/tier
      // values that do not exactly match the pathway's contentExamKeys (e.g. 'nclex-rn' vs 'NCLEX-RN').
      if (result.total === 0 && hasScopeFilter) {
        safeServerLog("flashcards", "hub_inventory_exam_scope_zero_fallback", {
          pathwayId: pid,
          topicFilter: topicFilter?.slice(0, 80) ?? "",
          reason: "scoped_query_returned_zero_retrying_without_exam_scope",
        });
        const fallback = await runHubInventoryQuery(tx, w, Prisma.empty, topicScope);
        if (fallback.total > 0) {
          safeServerLog("flashcards", "hub_inventory_exam_scope_fallback_success", {
            pathwayId: pid,
            total: fallback.total,
            groupCount: fallback.groupRows.length,
          });
          return fallback;
        }
      }

      return result;
    },
    { maxWait: 8_000, timeout: 12_000 },
  );

  const countsByBuilderId: Record<string, number> = {};
  for (const r of groupRows) {
    const kind = (r.grp_kind ?? "").trim();
    const value = (r.grp_value ?? "Uncategorized").trim() || "Uncategorized";
    const n = typeof r.cnt === "bigint" ? Number(r.cnt) : Number(r.cnt ?? 0);
    if (!Number.isFinite(n) || n <= 0) continue;

    const examTopic = kind === "topic" ? value : null;
    const examBodySystem = kind === "body" ? value : null;
    const examCategoryLabel = kind === "exam_cat" ? value : null;

    const id = resolveBuilderCategoryId({
      label: examCategoryLabel ?? value,
      pathwayId: pid,
      deckTitle: null,
      front: "",
      back: "",
      examBodySystem,
      examTopic,
    });
    countsByBuilderId[id] = (countsByBuilderId[id] ?? 0) + n;
  }

  // Debug log: report categories that resolved to zero despite total > 0
  if (process.env.NODE_ENV === "development" && total > 0) {
    const zeroBuckets = groupRows
      .filter((r) => {
        const n = typeof r.cnt === "bigint" ? Number(r.cnt) : Number(r.cnt ?? 0);
        return n > 0;
      })
      .map((r) => r.grp_value)
      .filter((v) => {
        // Check if this group value resolved to a builder bucket that actually got a count
        return false; // Only log if something went wrong — rely on overall countsByBuilderId check
      });
    void zeroBuckets;
    if (Object.keys(countsByBuilderId).length === 0 && total > 0) {
      safeServerLog("flashcards", "hub_inventory_zero_buckets_despite_total", {
        pathwayId: pid,
        total,
        groupCount: groupRows.length,
        sampleGroups: groupRows.slice(0, 5).map((r) => `${r.grp_kind}:${r.grp_value}`).join(", "),
      });
    }
  }

  return { total, countsByBuilderId };
}

export type ExamQuestionFlashcardPoolRow = BankExamRowForFlashcard & {
  topic: string | null;
  bodySystem: string | null;
  clinicalPearl?: string | null;
  keyTakeaway?: string | null;
  images?: Prisma.JsonValue | null;
};

/**
 * Loads a bounded slice of exam questions for learner flashcard sessions using the same
 * {@link flashcardLearnerExamPoolWhereSql} stack as {@link loadFlashcardsExamInventoryForPathway}
 * (normalized exam keys, study_link_pathway_id OR, NP specialty gates, non-ECG flashcard quality gates).
 * Does **not** widen the pool by dropping exam scope — inventory and session rows stay aligned.
 */
export async function loadExamQuestionRowsForFlashcardPool(
  poolScope: AccessScope,
  pathway: ExamPathwayDefinition,
  topicFilter: string | null = null,
  take: number,
): Promise<ExamQuestionFlashcardPoolRow[]> {
  if (!poolScope.hasAccess) return [];

  const topicScope = topicOrBodySystemMatchSql(topicFilter);
  const cap = Math.min(Math.max(Math.floor(take), 1), EXAM_FLASHCARD_SESSION_POOL_CAP);
  const hasStudyLinkCol = await getStudyLinkPathwayColumnExists();
  const candidateScopes = flashcardLearnerExamPoolCandidateScopes(poolScope, pathway);

  const rows = await prisma.$transaction(
    async (tx) => {
      await tx.$executeRawUnsafe(`SET LOCAL statement_timeout = '${DISCOVERY_STATEMENT_TIMEOUT_MS}ms'`);
      let selectedRows: ExamQuestionFlashcardPoolRow[] = [];
      for (let i = 0; i < candidateScopes.length; i += 1) {
        const candidateScope = candidateScopes[i] ?? poolScope;
        const whereSql = flashcardLearnerExamPoolWhereSql(candidateScope, pathway, hasStudyLinkCol);
        const candidateRows = await tx.$queryRaw<ExamQuestionFlashcardPoolRow[]>`
          SELECT
            q.id,
            q.stem,
            q.options,
            q.correct_answer AS "correctAnswer",
            q.question_type AS "questionType",
            q.rationale,
            q.distractor_rationales AS "distractorRationales",
            q.incorrect_answer_rationale AS "incorrectAnswerRationale",
            q.correct_answer_explanation AS "correctAnswerExplanation",
            q.clinical_pearl AS "clinicalPearl",
            q.key_takeaway AS "keyTakeaway",
            q.images,
            q.topic,
            q.body_system AS "bodySystem"
          FROM exam_questions q
          WHERE ${whereSql}${topicScope}${FLASHCARD_USABILITY_SQL}
          ORDER BY q.id
          LIMIT ${cap}
        `;
        selectedRows = candidateRows;
        if (candidateRows.length > 0 || i === candidateScopes.length - 1) break;
        safeServerLog("flashcards", "exam_flashcard_rows_candidate_scope_zero", {
          pathwayId: pathway.id,
          country: candidateScope.country != null ? String(candidateScope.country) : "",
          tier: candidateScope.tier != null ? String(candidateScope.tier) : "",
          nextCandidateAvailable: i + 1 < candidateScopes.length ? 1 : 0,
        });
      }
      return selectedRows;
    },
    { maxWait: 8_000, timeout: 12_000 },
  );

  return Array.isArray(rows) ? rows : [];
}
