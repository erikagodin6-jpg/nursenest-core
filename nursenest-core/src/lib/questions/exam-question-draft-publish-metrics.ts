import type { PrismaClient } from "@prisma/client";
import { Prisma } from "@prisma/client";

import { examQuestionExamPublishAllowlist } from "@/lib/content-quality/exam-question-exam-normalization";
import {
  EXAM_QUESTION_CORRECT_ANSWER_PRESENT_SQL,
  EXAM_QUESTION_DRAFT_STATUS_SQL,
  EXAM_QUESTION_FLASHCARD_ELIGIBLE_FORMAT_SQL,
  EXAM_QUESTION_NON_ECG_TAG_SQL,
  EXAM_QUESTION_TOPIC_OR_BODY_SQL,
  examQuestionDraftPublishableMinimalRequireRationaleSql,
  examQuestionDraftPublishableMinimalSql,
  examQuestionDraftPublishableStrictSql,
} from "@/lib/questions/exam-question-bank-sql";
import type { DraftPublishMode } from "@/lib/questions/exam-question-draft-publish";
import { draftPublishWhereSql } from "@/lib/questions/exam-question-draft-publish";

const EXAM_ALLOWLIST_SQL = Prisma.sql`exam IN (${Prisma.join([...examQuestionExamPublishAllowlist()])})`;

const PRIMARY_INELIGIBLE_MINIMAL = Prisma.sql`
CASE
  WHEN length(trim(coalesce(stem, ''))) < 10 THEN 'short_stem'
  WHEN NOT (${EXAM_QUESTION_CORRECT_ANSWER_PRESENT_SQL}) THEN 'missing_or_invalid_correct_answer'
  WHEN NOT (${EXAM_QUESTION_FLASHCARD_ELIGIBLE_FORMAT_SQL}) OR NOT (${EXAM_QUESTION_NON_ECG_TAG_SQL}) THEN 'ecg_or_video_format_or_tag'
  WHEN NOT (${EXAM_ALLOWLIST_SQL}) THEN 'invalid_exam'
  WHEN length(trim(coalesce(rationale, ''))) BETWEEN 1 AND 4 THEN 'rationale_too_short_when_present'
  WHEN NOT (${EXAM_QUESTION_TOPIC_OR_BODY_SQL}) THEN 'missing_topic_or_body_system'
  ELSE 'other'
END`;

const PRIMARY_INELIGIBLE_MINIMAL_REQUIRE_RAT = Prisma.sql`
CASE
  WHEN length(trim(coalesce(stem, ''))) < 10 THEN 'short_stem'
  WHEN NOT (${EXAM_QUESTION_CORRECT_ANSWER_PRESENT_SQL}) THEN 'missing_or_invalid_correct_answer'
  WHEN NOT (${EXAM_QUESTION_FLASHCARD_ELIGIBLE_FORMAT_SQL}) OR NOT (${EXAM_QUESTION_NON_ECG_TAG_SQL}) THEN 'ecg_or_video_format_or_tag'
  WHEN NOT (${EXAM_ALLOWLIST_SQL}) THEN 'invalid_exam'
  WHEN length(trim(coalesce(rationale, ''))) BETWEEN 1 AND 4 THEN 'rationale_too_short_when_present'
  WHEN length(trim(coalesce(rationale, ''))) = 0 THEN 'empty_rationale'
  WHEN NOT (${EXAM_QUESTION_TOPIC_OR_BODY_SQL}) THEN 'missing_topic_or_body_system'
  ELSE 'other'
END`;

const PRIMARY_INELIGIBLE_STRICT = Prisma.sql`
CASE
  WHEN coalesce(trim(stem), '') = '' THEN 'empty_stem'
  WHEN correct_answer IS NULL THEN 'missing_correct_answer_column'
  WHEN coalesce(trim(rationale), '') = '' THEN 'empty_rationale'
  WHEN NOT (${EXAM_QUESTION_FLASHCARD_ELIGIBLE_FORMAT_SQL}) OR NOT (${EXAM_QUESTION_NON_ECG_TAG_SQL}) THEN 'ecg_or_video_format_or_tag'
  WHEN NOT (
    coalesce(trim(topic), '') <> ''
    OR coalesce(trim(body_system), '') <> ''
    OR coalesce(trim(nclex_client_needs_category), '') <> ''
  ) THEN 'strict_taxonomy_signal_missing'
  WHEN NOT (${EXAM_ALLOWLIST_SQL}) THEN 'invalid_exam'
  ELSE 'other'
END`;

function bn(v: bigint | number | null | undefined): number {
  if (v == null) return 0;
  return typeof v === "bigint" ? Number(v) : Number(v);
}

export type DraftPublishPrimaryReasonRow = { reason: string; c: bigint };

export type DraftPublishAggregateRow = {
  total_drafts: bigint;
  minimal_eligible: bigint;
  minimal_require_rationale_eligible: bigint;
  strict_eligible: bigint;
  minimal_eligible_empty_rationale: bigint;
  minimal_eligible_short_rationale_5_49: bigint;
  draft_short_stem_lt10: bigint;
  draft_ecg_or_video_format_or_tag: bigint;
  draft_invalid_exam: bigint;
  draft_missing_or_invalid_correct_answer: bigint;
  draft_rationale_too_short_when_present_1_4: bigint;
  draft_missing_topic_or_body: bigint;
};

export async function fetchDraftPublishAggregateRow(prisma: PrismaClient): Promise<DraftPublishAggregateRow> {
  const [row] = await prisma.$queryRaw<DraftPublishAggregateRow[]>`
    SELECT
      COUNT(*) FILTER (WHERE ${EXAM_QUESTION_DRAFT_STATUS_SQL})::bigint AS total_drafts,
      COUNT(*) FILTER (WHERE ${examQuestionDraftPublishableMinimalSql()})::bigint AS minimal_eligible,
      COUNT(*) FILTER (WHERE ${examQuestionDraftPublishableMinimalRequireRationaleSql()})::bigint AS minimal_require_rationale_eligible,
      COUNT(*) FILTER (WHERE ${examQuestionDraftPublishableStrictSql()})::bigint AS strict_eligible,
      COUNT(*) FILTER (WHERE ${examQuestionDraftPublishableMinimalSql()} AND length(trim(coalesce(rationale, ''))) = 0)::bigint AS minimal_eligible_empty_rationale,
      COUNT(*) FILTER (WHERE ${examQuestionDraftPublishableMinimalSql()} AND length(trim(coalesce(rationale, ''))) BETWEEN 5 AND 49)::bigint AS minimal_eligible_short_rationale_5_49,
      COUNT(*) FILTER (WHERE ${EXAM_QUESTION_DRAFT_STATUS_SQL} AND length(trim(coalesce(stem, ''))) < 10)::bigint AS draft_short_stem_lt10,
      COUNT(*) FILTER (WHERE ${EXAM_QUESTION_DRAFT_STATUS_SQL} AND (
        NOT (${EXAM_QUESTION_FLASHCARD_ELIGIBLE_FORMAT_SQL})
        OR NOT (${EXAM_QUESTION_NON_ECG_TAG_SQL})
      ))::bigint AS draft_ecg_or_video_format_or_tag,
      COUNT(*) FILTER (WHERE ${EXAM_QUESTION_DRAFT_STATUS_SQL} AND NOT (${EXAM_ALLOWLIST_SQL}))::bigint AS draft_invalid_exam,
      COUNT(*) FILTER (WHERE ${EXAM_QUESTION_DRAFT_STATUS_SQL} AND NOT (${EXAM_QUESTION_CORRECT_ANSWER_PRESENT_SQL}))::bigint AS draft_missing_or_invalid_correct_answer,
      COUNT(*) FILTER (WHERE ${EXAM_QUESTION_DRAFT_STATUS_SQL} AND length(trim(coalesce(rationale, ''))) BETWEEN 1 AND 4)::bigint AS draft_rationale_too_short_when_present_1_4,
      COUNT(*) FILTER (WHERE ${EXAM_QUESTION_DRAFT_STATUS_SQL} AND NOT (${EXAM_QUESTION_TOPIC_OR_BODY_SQL}))::bigint AS draft_missing_topic_or_body
    FROM exam_questions
  `;
  return row!;
}

export async function fetchDraftPublishPrimaryIneligibleReasons(
  prisma: PrismaClient,
  mode: DraftPublishMode,
): Promise<Record<string, number>> {
  const publishWhere = draftPublishWhereSql(mode);
  const reasonExpr =
    mode === "strict"
      ? PRIMARY_INELIGIBLE_STRICT
      : mode === "minimal_require_rationale"
        ? PRIMARY_INELIGIBLE_MINIMAL_REQUIRE_RAT
        : PRIMARY_INELIGIBLE_MINIMAL;

  const rows = await prisma.$queryRaw<DraftPublishPrimaryReasonRow[]>`
    SELECT reason, COUNT(*)::bigint AS c
    FROM (
      SELECT (${reasonExpr})::text AS reason
      FROM exam_questions
      WHERE ${EXAM_QUESTION_DRAFT_STATUS_SQL}
        AND NOT (${publishWhere})
    ) x
    GROUP BY reason
    ORDER BY reason
  `;
  const out: Record<string, number> = {};
  for (const r of rows) {
    out[r.reason] = bn(r.c);
  }
  return out;
}

export async function fetchSampleIds(
  prisma: PrismaClient,
  where: Prisma.Sql,
  limit: number,
): Promise<string[]> {
  const rows = await prisma.$queryRaw<{ id: string }[]>`
    SELECT id::text AS id FROM exam_questions WHERE ${where} ORDER BY id ASC LIMIT ${limit}
  `;
  return rows.map((r) => r.id);
}

const MAX_WOULD_UPDATE_IDS = 200;
const TRUNCATE_WOULD_UPDATE_IDS_AT = 100;

export async function fetchWouldUpdateIds(prisma: PrismaClient, publishWhere: Prisma.Sql): Promise<{
  ids?: string[];
  truncated?: boolean;
}> {
  const [c] = await prisma.$queryRaw<[{ n: bigint }]>`
    SELECT COUNT(*)::bigint AS n FROM exam_questions WHERE ${publishWhere}
  `;
  const n = bn(c.n);
  if (n > MAX_WOULD_UPDATE_IDS) {
    return {};
  }
  const truncated = n > TRUNCATE_WOULD_UPDATE_IDS_AT;
  const take = truncated ? TRUNCATE_WOULD_UPDATE_IDS_AT : n;
  const ids = await fetchSampleIds(prisma, publishWhere, take);
  return truncated ? { ids, truncated: true } : { ids };
}

export type DraftPublishDiagnosticsJson = {
  draftShortStemLt10: number;
  draftEcgOrVideoFormatOrTag: number;
  draftInvalidExam: number;
  draftMissingOrInvalidCorrectAnswer: number;
  draftRationaleTooShortWhenPresent14: number;
  draftMissingTopicOrBody: number;
};

export type DraftPublishDryRunJson = {
  mode: DraftPublishMode;
  totalDrafts: number;
  eligibleCount: number;
  compareEligible: {
    minimal: number;
    minimalRequireRationale: number;
    strict: number;
  };
  ineligibleReasonCounts: Record<string, number>;
  warningCounts: {
    eligibleEmptyRationale: number;
    eligibleShortMinimalRationale: number;
  };
  sampleIds: {
    eligibleEmptyRationale: string[];
    eligibleShortMinimalRationale: string[];
  };
  diagnostics: DraftPublishDiagnosticsJson;
  wouldUpdateIds?: string[];
  wouldUpdateIdsTruncated?: boolean;
};

export function aggregateRowToDiagnostics(row: DraftPublishAggregateRow): DraftPublishDiagnosticsJson {
  return {
    draftShortStemLt10: bn(row.draft_short_stem_lt10),
    draftEcgOrVideoFormatOrTag: bn(row.draft_ecg_or_video_format_or_tag),
    draftInvalidExam: bn(row.draft_invalid_exam),
    draftMissingOrInvalidCorrectAnswer: bn(row.draft_missing_or_invalid_correct_answer),
    draftRationaleTooShortWhenPresent14: bn(row.draft_rationale_too_short_when_present_1_4),
    draftMissingTopicOrBody: bn(row.draft_missing_topic_or_body),
  };
}

export async function buildDraftPublishDryRunJson(
  prisma: PrismaClient,
  mode: DraftPublishMode,
): Promise<DraftPublishDryRunJson> {
  const agg = await fetchDraftPublishAggregateRow(prisma);
  const publishWhere = draftPublishWhereSql(mode);
  const ineligibleReasonCounts = await fetchDraftPublishPrimaryIneligibleReasons(prisma, mode);
  const eligibleCount =
    mode === "strict"
      ? bn(agg.strict_eligible)
      : mode === "minimal_require_rationale"
        ? bn(agg.minimal_require_rationale_eligible)
        : bn(agg.minimal_eligible);

  const emptyRatWhere = Prisma.sql`${examQuestionDraftPublishableMinimalSql()} AND length(trim(coalesce(rationale, ''))) = 0`;
  const shortRatWhere = Prisma.sql`${examQuestionDraftPublishableMinimalSql()} AND length(trim(coalesce(rationale, ''))) BETWEEN 5 AND 49`;

  const [eligibleEmptySamples, shortRatSamples, would] = await Promise.all([
    fetchSampleIds(prisma, emptyRatWhere, 8),
    fetchSampleIds(prisma, shortRatWhere, 8),
    fetchWouldUpdateIds(prisma, publishWhere),
  ]);

  return {
    mode,
    totalDrafts: bn(agg.total_drafts),
    eligibleCount,
    compareEligible: {
      minimal: bn(agg.minimal_eligible),
      minimalRequireRationale: bn(agg.minimal_require_rationale_eligible),
      strict: bn(agg.strict_eligible),
    },
    ineligibleReasonCounts,
    warningCounts: {
      eligibleEmptyRationale: bn(agg.minimal_eligible_empty_rationale),
      eligibleShortMinimalRationale: bn(agg.minimal_eligible_short_rationale_5_49),
    },
    sampleIds: {
      eligibleEmptyRationale: eligibleEmptySamples,
      eligibleShortMinimalRationale: shortRatSamples,
    },
    diagnostics: aggregateRowToDiagnostics(agg),
    ...(would.ids ? { wouldUpdateIds: would.ids, ...(would.truncated ? { wouldUpdateIdsTruncated: true } : {}) } : {}),
  };
}
