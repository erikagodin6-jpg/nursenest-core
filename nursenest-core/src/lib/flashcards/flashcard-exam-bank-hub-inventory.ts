import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import type { GlobalExamContext } from "@/lib/exam-context/global-exam-context";
import type { AccessScope } from "@/lib/entitlements/resolve-entitlement";
import type { BankExamRowForFlashcard } from "@/lib/flashcards/bank-exam-question-to-flashcard-select";
import { resolveBuilderCategoryId } from "@/lib/flashcards/flashcard-builder-taxonomy";
import {
  DISCOVERY_STATEMENT_TIMEOUT_MS,
  discoveryExamContextScopeSql,
  examQuestionsDiscoveryWhereSql,
} from "@/lib/questions/subscriber-discovery-aggregates";

/** Match discovery-style caps — only affects grouped rows, not the total COUNT(*). */
const EXAM_HUB_GROUP_ROW_LIMIT = 320;

/** Cap rows pulled when building learner sessions from the live exam bank (bounded query). */
const EXAM_FLASHCARD_SESSION_POOL_CAP = 4000;

export type ExamQuestionHubInventory = {
  total: number;
  countsByBuilderId: Record<string, number>;
};

type GroupRow = { grp_kind: string; grp_value: string; cnt: bigint };

/**
 * Pathway-scoped exam question counts grouped once per question (topic preferred, else body_system, else uncategorized),
 * then mapped through {@link resolveBuilderCategoryId} so flashcards hub rows match practice-question taxonomy.
 */
function topicOrBodySystemMatchSql(topicFilter: string | null | undefined): Prisma.Sql {
  const t = topicFilter?.trim();
  if (!t || t.length > 160) return Prisma.empty;
  return Prisma.sql` AND (
    lower(trim(coalesce(topic, ''))) = lower(${t}::text)
    OR lower(trim(coalesce(body_system, ''))) = lower(${t}::text)
  )`;
}

export async function loadExamQuestionHubInventoryForPathway(
  entitlement: AccessScope,
  pathwayId: string | null | undefined,
  examContext: GlobalExamContext | null,
  topicFilter: string | null = null,
): Promise<ExamQuestionHubInventory> {
  const pid = pathwayId?.trim();
  if (!pid || !examContext) {
    return { total: 0, countsByBuilderId: {} };
  }

  const w = examQuestionsDiscoveryWhereSql(entitlement);
  const contextScope = discoveryExamContextScopeSql(examContext);
  const topicScope = topicOrBodySystemMatchSql(topicFilter);

  const { total, groupRows } = await prisma.$transaction(
    async (tx) => {
      await tx.$executeRawUnsafe(`SET LOCAL statement_timeout = '${DISCOVERY_STATEMENT_TIMEOUT_MS}ms'`);

      const [totalRows, rows] = await Promise.all([
        tx.$queryRaw<[{ n: bigint }]>`SELECT COUNT(*)::bigint AS n FROM exam_questions WHERE ${w}${contextScope}${topicScope}`,
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
          WHERE ${w}${contextScope}${topicScope}
          GROUP BY 1, 2
          ORDER BY cnt DESC
          LIMIT ${EXAM_HUB_GROUP_ROW_LIMIT}
        `,
      ]);

      const rawTotal = totalRows[0]?.n;
      const countedTotal = typeof rawTotal === "bigint" ? Number(rawTotal) : Number(rawTotal ?? 0);
      return { total: countedTotal, groupRows: rows };
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

  return { total, countsByBuilderId };
}

export type ExamQuestionFlashcardPoolRow = BankExamRowForFlashcard & {
  topic: string | null;
  bodySystem: string | null;
};

/**
 * Loads a bounded slice of subscriber-scoped exam questions for the same pathway + entitlement scope
 * as {@link loadExamQuestionHubInventoryForPathway}, for flashcard sessions that must mirror the bank pool.
 */
export async function loadExamQuestionRowsForFlashcardPool(
  entitlement: AccessScope,
  pathwayId: string | null | undefined,
  examContext: GlobalExamContext | null,
  topicFilter: string | null = null,
  take: number,
): Promise<ExamQuestionFlashcardPoolRow[]> {
  const pid = pathwayId?.trim();
  if (!pid || !examContext) return [];

  const w = examQuestionsDiscoveryWhereSql(entitlement);
  const contextScope = discoveryExamContextScopeSql(examContext);
  const topicScope = topicOrBodySystemMatchSql(topicFilter);
  const cap = Math.min(Math.max(Math.floor(take), 1), EXAM_FLASHCARD_SESSION_POOL_CAP);

  const rows = await prisma.$transaction(
    async (tx) => {
      await tx.$executeRawUnsafe(`SET LOCAL statement_timeout = '${DISCOVERY_STATEMENT_TIMEOUT_MS}ms'`);
      return tx.$queryRaw<ExamQuestionFlashcardPoolRow[]>`
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
          q.topic,
          q.body_system AS "bodySystem"
        FROM exam_questions q
        WHERE ${w}${contextScope}${topicScope}
        ORDER BY q.id
        LIMIT ${cap}
      `;
    },
    { maxWait: 8_000, timeout: 12_000 },
  );

  return Array.isArray(rows) ? rows : [];
}
