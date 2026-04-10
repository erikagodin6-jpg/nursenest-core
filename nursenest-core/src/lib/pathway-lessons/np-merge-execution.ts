import type { ExecutionPlanRow } from "./np-spine-execution-plan";

export type NpMergePlanRow = ExecutionPlanRow & { decision: "MERGE" };

export type NpMergeExecutionDbRow = {
  id: string;
  pathwayId: string;
  topicSlug: string;
  slug: string;
  title: string;
  locale: string;
  status: string;
  sortOrder: number;
};

export type NpMergeExecutionStatus = "DEFERRED" | "WOULD_APPLY" | "APPLIED" | "REJECTED" | "UNCHANGED";

export type NpMergeExecutionReasonCode =
  | "db_access_disabled"
  | "invalid_merge_target"
  | "target_missing"
  | "target_ambiguous"
  | "source_target_overlap"
  | "no_published_source_rows"
  | "archive_count_mismatch"
  | "archive_applied";

export type NpMergeExecutionRow = {
  pathwayId: string;
  topicSlug: string;
  mergeTargetTopicSlug: string | null;
  status: NpMergeExecutionStatus;
  reasonCode: NpMergeExecutionReasonCode;
  sourceLessonIds: string[];
  sourceLessonSlugs: string[];
  targetLessonIds: string[];
  targetLessonSlugs: string[];
  notes: string[];
  appliedArchiveCount: number;
};

export type NpMergeExecutionSummary = Record<NpMergeExecutionStatus, number> & {
  totalRows: number;
};

export type NpMergeExecutionReport = {
  generatedAt: string;
  planFile: string;
  dbAccessEnabled: boolean;
  applyEnabled: boolean;
  summary: NpMergeExecutionSummary;
  rows: NpMergeExecutionRow[];
};

function publishedRowsForTopic(
  dbRows: NpMergeExecutionDbRow[],
  pathwayId: string,
  topicSlug: string,
): NpMergeExecutionDbRow[] {
  return dbRows
    .filter(
      (row) =>
        row.pathwayId === pathwayId &&
        row.topicSlug === topicSlug &&
        row.locale === "en" &&
        row.status === "PUBLISHED",
    )
    .sort((a, b) => {
      if (a.sortOrder !== b.sortOrder) return a.sortOrder - b.sortOrder;
      const slugCmp = a.slug.localeCompare(b.slug);
      if (slugCmp !== 0) return slugCmp;
      return a.id.localeCompare(b.id);
    });
}

export function filterMergePlanRows(rows: ExecutionPlanRow[]): NpMergePlanRow[] {
  return rows
    .filter((row): row is NpMergePlanRow => row.decision === "MERGE")
    .sort((a, b) => {
      const pathwayCmp = a.pathwayId.localeCompare(b.pathwayId);
      if (pathwayCmp !== 0) return pathwayCmp;
      return a.topicSlug.localeCompare(b.topicSlug);
    });
}

export function evaluateMergeExecutionRow(params: {
  row: NpMergePlanRow;
  dbRows: NpMergeExecutionDbRow[];
  applyEnabled: boolean;
  dbAccessEnabled?: boolean;
  appliedArchiveCount?: number;
}): NpMergeExecutionRow {
  const { row, dbRows, applyEnabled, appliedArchiveCount } = params;
  const dbAccessEnabled = params.dbAccessEnabled ?? true;
  const targetTopicSlug = row.mergeTargetTopicSlug;
  const sourceRows = publishedRowsForTopic(dbRows, row.pathwayId, row.topicSlug);
  const targetRows =
    targetTopicSlug == null ? [] : publishedRowsForTopic(dbRows, row.pathwayId, targetTopicSlug);

  const base = {
    pathwayId: row.pathwayId,
    topicSlug: row.topicSlug,
    mergeTargetTopicSlug: targetTopicSlug ?? null,
    sourceLessonIds: sourceRows.map((entry) => entry.id),
    sourceLessonSlugs: sourceRows.map((entry) => entry.slug),
    targetLessonIds: targetRows.map((entry) => entry.id),
    targetLessonSlugs: targetRows.map((entry) => entry.slug),
    appliedArchiveCount: 0,
  };

  if (!dbAccessEnabled) {
    return {
      ...base,
      status: "DEFERRED",
      reasonCode: "db_access_disabled",
      notes: ["DB access disabled; merge execution requires explicit live validation."],
    };
  }

  if (!targetTopicSlug || targetTopicSlug === row.topicSlug) {
    return {
      ...base,
      status: "REJECTED",
      reasonCode: "invalid_merge_target",
      notes: ["Merge target is missing or self-referential."],
    };
  }

  if (targetRows.length === 0) {
    return {
      ...base,
      status: "REJECTED",
      reasonCode: "target_missing",
      notes: [`No published target lesson exists for topic "${targetTopicSlug}".`],
    };
  }

  if (targetRows.length > 1) {
    return {
      ...base,
      status: "REJECTED",
      reasonCode: "target_ambiguous",
      notes: [`Multiple published target lessons exist for topic "${targetTopicSlug}".`],
    };
  }

  if (sourceRows.some((entry) => targetRows.some((target) => target.id === entry.id))) {
    return {
      ...base,
      status: "REJECTED",
      reasonCode: "source_target_overlap",
      notes: ["Source and target lesson sets overlap; refusing to archive."],
    };
  }

  if (sourceRows.length === 0) {
    return {
      ...base,
      status: "UNCHANGED",
      reasonCode: "no_published_source_rows",
      notes: ["No published source rows remain; merge is already satisfied or previously suppressed."],
    };
  }

  if (!applyEnabled) {
    return {
      ...base,
      status: "WOULD_APPLY",
      reasonCode: "archive_applied",
      notes: [`Would archive ${sourceRows.length} published source row(s) after validating target coverage.`],
    };
  }

  if (appliedArchiveCount !== sourceRows.length) {
    return {
      ...base,
      status: "REJECTED",
      reasonCode: "archive_count_mismatch",
      notes: [
        `Expected to archive ${sourceRows.length} source row(s) but archived ${appliedArchiveCount ?? 0}.`,
      ],
      appliedArchiveCount: appliedArchiveCount ?? 0,
    };
  }

  return {
    ...base,
    status: "APPLIED",
    reasonCode: "archive_applied",
    notes: [`Archived ${sourceRows.length} published source row(s) after validating target coverage.`],
    appliedArchiveCount: appliedArchiveCount ?? 0,
  };
}

function emptySummary(): NpMergeExecutionSummary {
  return {
    DEFERRED: 0,
    WOULD_APPLY: 0,
    APPLIED: 0,
    REJECTED: 0,
    UNCHANGED: 0,
    totalRows: 0,
  };
}

export function buildNpMergeExecutionReport(params: {
  planRows: ExecutionPlanRow[];
  dbRows: NpMergeExecutionDbRow[];
  applyEnabled: boolean;
  planFile: string;
  dbAccessEnabled: boolean;
}): NpMergeExecutionReport {
  const mergeRows = filterMergePlanRows(params.planRows);
  const rows = mergeRows.map((row) =>
    evaluateMergeExecutionRow({
      row,
      dbRows: params.dbRows,
      applyEnabled: params.applyEnabled,
      dbAccessEnabled: params.dbAccessEnabled,
    }),
  );
  const summary = emptySummary();
  for (const row of rows) {
    summary[row.status] += 1;
    summary.totalRows += 1;
  }
  return {
    generatedAt: new Date().toISOString(),
    planFile: params.planFile,
    dbAccessEnabled: params.dbAccessEnabled,
    applyEnabled: params.applyEnabled,
    summary,
    rows,
  };
}
