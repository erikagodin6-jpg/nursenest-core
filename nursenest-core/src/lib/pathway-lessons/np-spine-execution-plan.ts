import {
  DEPTH_OK,
  DUPLICATE_BAND,
  HIGH_TIER,
  STRONG_SCORE,
  WEAK_FLOOR,
  buildMergeHintIndex,
  collectContentItemHintsForSpineTopic,
  pathwayIdsForSpineTopic,
  rankPathwayLessonCandidatesForSpineTopic,
  sortScoredLessonsDeterministically,
  type ContentItemMatchRow,
  type NpCanonicalCoverageMapJson,
  type NpSpineSystem,
  type NpSpineTopic,
  type PathwayLessonMatchRow,
  type ScoredLesson,
} from "./np-spine-db-alignment";

export { sortScoredLessonsDeterministically };

export type CanonicalTopicRow = {
  pathwayId: string;
  examTags: string[];
  systemId: string;
  systemName: string;
  topic: NpSpineTopic;
  mergeTargetTopicId?: string;
};

export type CandidateLessonMatch = ScoredLesson;

export type ExecutionDecision =
  | "EXISTS_STRONG_SKIP"
  | "EXISTS_UPGRADE"
  | "CREATE_NEW"
  | "MERGE"
  | "REVIEW_NEEDED"
  | "DUPLICATE_CLUSTER_REVIEW";

export type ExecutionReuseStatus =
  | "shared_reuse_sufficient"
  | "shared_reuse_with_overlay"
  | "new_pathway_specific"
  | "needs_review";

export type ExecutionPlanValidationIssue = {
  code:
    | "duplicate_topic_pathway_decision"
    | "missing_topic_pathway_decision"
    | "merge_target_missing"
    | "merge_conflict"
    | "summary_count_mismatch"
    | "pathway_summary_mismatch"
    | "system_summary_mismatch"
    | "rows_not_sorted";
  severity: "error" | "warning";
  message: string;
  pathwayId?: string;
  topicSlug?: string;
  canonicalTopicId?: string;
};

export type ExecutionPlanSummary = {
  EXISTS_STRONG_SKIP: number;
  EXISTS_UPGRADE: number;
  CREATE_NEW: number;
  MERGE: number;
  REVIEW_NEEDED: number;
  DUPLICATE_CLUSTER_REVIEW: number;
  rowsEvaluated: number;
};

export type ExecutionPlanRow = {
  pathwayId: string;
  topicSlug: string;
  canonicalTopicId: string;
  canonicalTitle: string;
  examTags: string[];
  systemId: string;
  systemName: string;
  decision: ExecutionDecision;
  confidence: number;
  matchedLessonIds: string[];
  matchedLessonSlugs: string[];
  winningLessonId: string | null;
  winningLessonSlug: string | null;
  recommendedCanonicalSlug: string | null;
  mergeTargetTopicSlug: string | null;
  reasonCodes: string[];
  validationIssues: string[];
  notes: string[];
  sharedLessonReuseSufficient: boolean;
  overlayNeeded: boolean;
  reuseStatus: ExecutionReuseStatus;
  scoreSummary: {
    candidateCount: number;
    topScore: number | null;
    secondScore: number | null;
    topDepthScore: number | null;
    topSignals: string[];
  } | null;
  contentItemHints?: { id: string; slug: string; score: number }[];
};

export type NpExecutionPlanReport = {
  generatedAt: string;
  spineFile: string;
  dataSources: string[];
  mode: "report" | "db";
  dbAccessEnabled: boolean;
  applyEnabled: boolean;
  summaryByPathway: Record<string, ExecutionPlanSummary>;
  summaryBySystemCategory: Record<string, Omit<ExecutionPlanSummary, "rowsEvaluated">>;
  summaryByDecision: Record<ExecutionDecision, number>;
  validationIssues: ExecutionPlanValidationIssue[];
  rows: ExecutionPlanRow[];
};

const REVIEW_SCORE = 0.62;
const SPECIALTY_OVERLAY_SYSTEMS: Record<string, Set<string>> = {
  "us-np-whnp": new Set(["womens_health"]),
  "us-np-pnp-pc": new Set(["pediatrics"]),
  "us-np-pmhnp": new Set(["mental_health"]),
};

function buildEmptySummary(): ExecutionPlanSummary {
  return {
    EXISTS_STRONG_SKIP: 0,
    EXISTS_UPGRADE: 0,
    CREATE_NEW: 0,
    MERGE: 0,
    REVIEW_NEEDED: 0,
    DUPLICATE_CLUSTER_REVIEW: 0,
    rowsEvaluated: 0,
  };
}

function buildDecisionTotals(): Record<ExecutionDecision, number> {
  return {
    EXISTS_STRONG_SKIP: 0,
    EXISTS_UPGRADE: 0,
    CREATE_NEW: 0,
    MERGE: 0,
    REVIEW_NEEDED: 0,
    DUPLICATE_CLUSTER_REVIEW: 0,
  };
}

function isDuplicateCluster(rankedCandidates: CandidateLessonMatch[]): boolean {
  if (rankedCandidates.length < 2) return false;
  const high = rankedCandidates.filter((candidate) => candidate.score >= HIGH_TIER);
  if (high.length < 2) return false;
  return Math.abs(high[0]!.score - high[1]!.score) < DUPLICATE_BAND && high[0]!.score >= HIGH_TIER;
}

function hasStructuralTopicSignal(candidate: CandidateLessonMatch): boolean {
  return (
    candidate.signals.includes("exact_topicSlug") ||
    candidate.signals.includes("partial_topicSlug") ||
    candidate.signals.includes("slug_overlap")
  );
}

function hasSemanticTopicSignal(candidate: CandidateLessonMatch): boolean {
  return candidate.signals.includes("title_similarity") && candidate.signals.includes("topic_field_overlap");
}

function isUsableExistingLesson(candidate: CandidateLessonMatch): boolean {
  return hasStructuralTopicSignal(candidate) || hasSemanticTopicSignal(candidate);
}

function topicIsPathwaySpecific(topic: NpSpineTopic): boolean {
  return pathwayIdsForSpineTopic(topic).length <= 1;
}

function requiresSpecialtyOverlay(pathwayId: string, systemId: string): boolean {
  return SPECIALTY_OVERLAY_SYSTEMS[pathwayId]?.has(systemId) ?? false;
}

function deriveReuseStatus(params: {
  pathwayId: string;
  systemId: string;
  topic: NpSpineTopic;
  decision: ExecutionDecision;
}): {
  sharedLessonReuseSufficient: boolean;
  overlayNeeded: boolean;
  reuseStatus: ExecutionReuseStatus;
} {
  const overlayNeeded = requiresSpecialtyOverlay(params.pathwayId, params.systemId);
  if (params.decision === "REVIEW_NEEDED" || params.decision === "DUPLICATE_CLUSTER_REVIEW") {
    return {
      sharedLessonReuseSufficient: false,
      overlayNeeded,
      reuseStatus: "needs_review",
    };
  }
  if (topicIsPathwaySpecific(params.topic) && params.decision === "CREATE_NEW") {
    return {
      sharedLessonReuseSufficient: false,
      overlayNeeded,
      reuseStatus: "new_pathway_specific",
    };
  }
  if (overlayNeeded) {
    return {
      sharedLessonReuseSufficient: false,
      overlayNeeded: true,
      reuseStatus: "shared_reuse_with_overlay",
    };
  }
  return {
    sharedLessonReuseSufficient: true,
    overlayNeeded: false,
    reuseStatus: "shared_reuse_sufficient",
  };
}

function buildScoreSummary(
  rankedCandidates: CandidateLessonMatch[],
): ExecutionPlanRow["scoreSummary"] {
  const best = rankedCandidates[0];
  if (!best) {
    return {
      candidateCount: 0,
      topScore: null,
      secondScore: null,
      topDepthScore: null,
      topSignals: [],
    };
  }
  return {
    candidateCount: rankedCandidates.length,
    topScore: best.score,
    secondScore: rankedCandidates[1]?.score ?? null,
    topDepthScore: best.depth.depthScore,
    topSignals: [...best.signals],
  };
}

export function sortExecutionPlanRowsDeterministically(rows: ExecutionPlanRow[]): ExecutionPlanRow[] {
  return [...rows].sort((a, b) => {
    const pathwayCmp = a.pathwayId.localeCompare(b.pathwayId);
    if (pathwayCmp !== 0) return pathwayCmp;
    const systemCmp = a.systemId.localeCompare(b.systemId);
    if (systemCmp !== 0) return systemCmp;
    const topicCmp = a.topicSlug.localeCompare(b.topicSlug);
    if (topicCmp !== 0) return topicCmp;
    return a.decision.localeCompare(b.decision);
  });
}

export function flattenCanonicalTopicRows(map: NpCanonicalCoverageMapJson): CanonicalTopicRow[] {
  const mergeHints = buildMergeHintIndex(map);
  const rows: CanonicalTopicRow[] = [];
  for (const system of map.systems) {
    for (const topic of system.topics) {
      const pathwayIds = pathwayIdsForSpineTopic(topic);
      for (const pathwayId of pathwayIds) {
        rows.push({
          pathwayId,
          examTags: [...topic.exams],
          systemId: system.id,
          systemName: system.name,
          topic,
          mergeTargetTopicId: mergeHints.get(topic.id),
        });
      }
    }
  }
  return rows.sort((a, b) => {
    const pathwayCmp = a.pathwayId.localeCompare(b.pathwayId);
    if (pathwayCmp !== 0) return pathwayCmp;
    const systemCmp = a.systemId.localeCompare(b.systemId);
    if (systemCmp !== 0) return systemCmp;
    return a.topic.id.localeCompare(b.topic.id);
  });
}

export function decideExecutionDecision(params: {
  pathwayId: string;
  system: NpSpineSystem;
  topic: NpSpineTopic;
  mergeTargetTopicId?: string;
  rankedCandidates: CandidateLessonMatch[];
  contentItemHints?: { id: string; slug: string; score: number }[];
}): ExecutionPlanRow {
  const { pathwayId, system, topic, mergeTargetTopicId, rankedCandidates } = params;
  const best = rankedCandidates[0];
  const second = rankedCandidates[1];
  const notes: string[] = [];
  const validationIssues: string[] = [];
  const reasonCodes: string[] = [];

  if (mergeTargetTopicId && mergeTargetTopicId !== topic.id) {
    reasonCodes.push("merge_hint_enforced");
    notes.push(`Canonical merge hint routes this topic into "${mergeTargetTopicId}".`);
    if (isDuplicateCluster(rankedCandidates)) {
      reasonCodes.push("merge_topic_duplicate_cluster");
      const reuse = deriveReuseStatus({
        pathwayId,
        systemId: system.id,
        topic,
        decision: "DUPLICATE_CLUSTER_REVIEW",
      });
      return {
        pathwayId,
        topicSlug: topic.id,
        canonicalTopicId: topic.id,
        canonicalTitle: topic.title,
        examTags: [...topic.exams],
        systemId: system.id,
        systemName: system.name,
        decision: "DUPLICATE_CLUSTER_REVIEW",
        confidence: best?.score ?? 0,
        matchedLessonIds: rankedCandidates.map((candidate) => candidate.lesson.id),
        matchedLessonSlugs: rankedCandidates.map((candidate) => candidate.lesson.slug),
        winningLessonId: best?.lesson.id ?? null,
        winningLessonSlug: best?.lesson.slug ?? null,
        recommendedCanonicalSlug: mergeTargetTopicId,
        mergeTargetTopicSlug: mergeTargetTopicId,
        reasonCodes,
        validationIssues,
        notes: [...notes, "Existing duplicate-like rows need review before merge cleanup."],
        ...reuse,
        scoreSummary: buildScoreSummary(rankedCandidates),
        contentItemHints: params.contentItemHints,
      };
    }
    const reuse = deriveReuseStatus({
      pathwayId,
      systemId: system.id,
      topic,
      decision: "MERGE",
    });
    return {
      pathwayId,
      topicSlug: topic.id,
      canonicalTopicId: topic.id,
      canonicalTitle: topic.title,
      examTags: [...topic.exams],
      systemId: system.id,
      systemName: system.name,
      decision: "MERGE",
      confidence: best?.score ?? 1,
      matchedLessonIds: rankedCandidates.map((candidate) => candidate.lesson.id),
      matchedLessonSlugs: rankedCandidates.map((candidate) => candidate.lesson.slug),
      winningLessonId: best?.lesson.id ?? null,
      winningLessonSlug: best?.lesson.slug ?? null,
      recommendedCanonicalSlug: mergeTargetTopicId,
      mergeTargetTopicSlug: mergeTargetTopicId,
      reasonCodes,
      validationIssues,
      notes,
      ...reuse,
      scoreSummary: buildScoreSummary(rankedCandidates),
      contentItemHints: params.contentItemHints,
    };
  }

  if (!best || best.score < WEAK_FLOOR) {
    reasonCodes.push("no_acceptable_candidate");
    const reuse = deriveReuseStatus({
      pathwayId,
      systemId: system.id,
      topic,
      decision: "CREATE_NEW",
    });
    return {
      pathwayId,
      topicSlug: topic.id,
      canonicalTopicId: topic.id,
      canonicalTitle: topic.title,
      examTags: [...topic.exams],
      systemId: system.id,
      systemName: system.name,
      decision: "CREATE_NEW",
      confidence: best?.score ?? 0,
      matchedLessonIds: [],
      matchedLessonSlugs: [],
      winningLessonId: null,
      winningLessonSlug: null,
      recommendedCanonicalSlug: topic.id,
      mergeTargetTopicSlug: null,
      reasonCodes,
      validationIssues,
      notes: ["No PathwayLesson row reached the minimum reusable-match threshold."],
      ...reuse,
      scoreSummary: buildScoreSummary(rankedCandidates),
      contentItemHints: params.contentItemHints,
    };
  }

  if (isDuplicateCluster(rankedCandidates)) {
    reasonCodes.push("duplicate_cluster_detected");
    const reuse = deriveReuseStatus({
      pathwayId,
      systemId: system.id,
      topic,
      decision: "DUPLICATE_CLUSTER_REVIEW",
    });
    return {
      pathwayId,
      topicSlug: topic.id,
      canonicalTopicId: topic.id,
      canonicalTitle: topic.title,
      examTags: [...topic.exams],
      systemId: system.id,
      systemName: system.name,
      decision: "DUPLICATE_CLUSTER_REVIEW",
      confidence: best.score,
      matchedLessonIds: rankedCandidates.map((candidate) => candidate.lesson.id),
      matchedLessonSlugs: rankedCandidates.map((candidate) => candidate.lesson.slug),
      winningLessonId: best.lesson.id,
      winningLessonSlug: best.lesson.slug,
      recommendedCanonicalSlug: best.lesson.slug,
      mergeTargetTopicSlug: null,
      reasonCodes,
      validationIssues,
      notes: ["Multiple strong candidate rows are too close to choose a single canonical winner safely."],
      ...reuse,
      scoreSummary: buildScoreSummary(rankedCandidates),
      contentItemHints: params.contentItemHints,
    };
  }

  const secondCompetitive = Boolean(second && second.score >= HIGH_TIER);
  const strongSingle =
    best.score >= STRONG_SCORE && best.depth.depthScore >= DEPTH_OK && !secondCompetitive && isUsableExistingLesson(best);

  if (strongSingle) {
    reasonCodes.push("strong_existing_match");
    const reuse = deriveReuseStatus({
      pathwayId,
      systemId: system.id,
      topic,
      decision: "EXISTS_STRONG_SKIP",
    });
    return {
      pathwayId,
      topicSlug: topic.id,
      canonicalTopicId: topic.id,
      canonicalTitle: topic.title,
      examTags: [...topic.exams],
      systemId: system.id,
      systemName: system.name,
      decision: "EXISTS_STRONG_SKIP",
      confidence: best.score,
      matchedLessonIds: [best.lesson.id],
      matchedLessonSlugs: [best.lesson.slug],
      winningLessonId: best.lesson.id,
      winningLessonSlug: best.lesson.slug,
      recommendedCanonicalSlug: best.lesson.slug,
      mergeTargetTopicSlug: null,
      reasonCodes,
      validationIssues,
      notes: ["Strong existing lesson match with sufficient depth; no action needed in this pass."],
      ...reuse,
      scoreSummary: buildScoreSummary(rankedCandidates),
      contentItemHints: params.contentItemHints,
    };
  }

  if (best.score >= HIGH_TIER && isUsableExistingLesson(best)) {
    reasonCodes.push(best.depth.depthScore < DEPTH_OK ? "existing_match_depth_gap" : "existing_match_needs_upgrade");
    const reuse = deriveReuseStatus({
      pathwayId,
      systemId: system.id,
      topic,
      decision: "EXISTS_UPGRADE",
    });
    return {
      pathwayId,
      topicSlug: topic.id,
      canonicalTopicId: topic.id,
      canonicalTitle: topic.title,
      examTags: [...topic.exams],
      systemId: system.id,
      systemName: system.name,
      decision: "EXISTS_UPGRADE",
      confidence: best.score,
      matchedLessonIds: sortScoredLessonsDeterministically(rankedCandidates).slice(0, 3).map((candidate) => candidate.lesson.id),
      matchedLessonSlugs: sortScoredLessonsDeterministically(rankedCandidates)
        .slice(0, 3)
        .map((candidate) => candidate.lesson.slug),
      winningLessonId: best.lesson.id,
      winningLessonSlug: best.lesson.slug,
      recommendedCanonicalSlug: best.lesson.slug,
      mergeTargetTopicSlug: null,
      reasonCodes,
      validationIssues,
      notes: [
        best.depth.depthScore < DEPTH_OK
          ? "Existing lesson is usable but needs deeper canonical coverage."
          : "Existing lesson is structurally aligned but should be upgraded before execution.",
      ],
      ...reuse,
      scoreSummary: buildScoreSummary(rankedCandidates),
      contentItemHints: params.contentItemHints,
    };
  }

  if (best.score >= REVIEW_SCORE || params.contentItemHints?.length) {
    reasonCodes.push("ambiguous_match");
    validationIssues.push("manual_review_recommended");
    const reuse = deriveReuseStatus({
      pathwayId,
      systemId: system.id,
      topic,
      decision: "REVIEW_NEEDED",
    });
    return {
      pathwayId,
      topicSlug: topic.id,
      canonicalTopicId: topic.id,
      canonicalTitle: topic.title,
      examTags: [...topic.exams],
      systemId: system.id,
      systemName: system.name,
      decision: "REVIEW_NEEDED",
      confidence: best.score,
      matchedLessonIds: rankedCandidates.slice(0, 3).map((candidate) => candidate.lesson.id),
      matchedLessonSlugs: rankedCandidates.slice(0, 3).map((candidate) => candidate.lesson.slug),
      winningLessonId: best.lesson.id,
      winningLessonSlug: best.lesson.slug,
      recommendedCanonicalSlug: best.lesson.slug,
      mergeTargetTopicSlug: null,
      reasonCodes,
      validationIssues,
      notes: ["Borderline or weakly structured match requires manual review before planning execution."],
      ...reuse,
      scoreSummary: buildScoreSummary(rankedCandidates),
      contentItemHints: params.contentItemHints,
    };
  }

  reasonCodes.push("low_confidence_candidates");
  const reuse = deriveReuseStatus({
    pathwayId,
    systemId: system.id,
    topic,
    decision: "CREATE_NEW",
  });
  return {
    pathwayId,
    topicSlug: topic.id,
    canonicalTopicId: topic.id,
    canonicalTitle: topic.title,
    examTags: [...topic.exams],
    systemId: system.id,
    systemName: system.name,
    decision: "CREATE_NEW",
    confidence: best.score,
    matchedLessonIds: rankedCandidates.slice(0, 3).map((candidate) => candidate.lesson.id),
    matchedLessonSlugs: rankedCandidates.slice(0, 3).map((candidate) => candidate.lesson.slug),
    winningLessonId: null,
    winningLessonSlug: null,
    recommendedCanonicalSlug: topic.id,
    mergeTargetTopicSlug: null,
    reasonCodes,
    validationIssues,
    notes: ["Candidate rows exist but none is strong enough to reuse safely."],
    ...reuse,
    scoreSummary: buildScoreSummary(rankedCandidates),
    contentItemHints: params.contentItemHints,
  };
}

export function validateExecutionPlan(
  report: Pick<
    NpExecutionPlanReport,
    "rows" | "summaryByDecision" | "summaryByPathway" | "summaryBySystemCategory"
  > &
    Partial<NpExecutionPlanReport>,
): ExecutionPlanValidationIssue[] {
  const issues: ExecutionPlanValidationIssue[] = [];
  const seen = new Map<string, ExecutionPlanRow[]>();
  const canonicalTopicIds = new Set(report.rows.map((row) => row.topicSlug));

  for (const row of report.rows) {
    const key = `${row.pathwayId}::${row.topicSlug}`;
    const bucket = seen.get(key) ?? [];
    bucket.push(row);
    seen.set(key, bucket);

    if (row.decision === "MERGE") {
      if (!row.mergeTargetTopicSlug || !canonicalTopicIds.has(row.mergeTargetTopicSlug)) {
        issues.push({
          code: "merge_target_missing",
          severity: "error",
          pathwayId: row.pathwayId,
          topicSlug: row.topicSlug,
          canonicalTopicId: row.canonicalTopicId,
          message: `Merge target "${row.mergeTargetTopicSlug ?? "null"}" is not present in the canonical topic set.`,
        });
      }
    }
  }

  for (const [key, rows] of seen) {
    if (rows.length === 0) {
      const [pathwayId, topicSlug] = key.split("::");
      issues.push({
        code: "missing_topic_pathway_decision",
        severity: "error",
        pathwayId,
        topicSlug,
        message: `No final decision emitted for ${key}.`,
      });
      continue;
    }
    if (rows.length > 1) {
      const [pathwayId, topicSlug] = key.split("::");
      issues.push({
        code: "duplicate_topic_pathway_decision",
        severity: "error",
        pathwayId,
        topicSlug,
        message: `Multiple decisions emitted for ${key}: ${rows.map((row) => row.decision).join(", ")}.`,
      });
      if (rows.some((row) => row.decision === "MERGE") && rows.some((row) => row.decision !== "MERGE")) {
        issues.push({
          code: "merge_conflict",
          severity: "error",
          pathwayId,
          topicSlug,
          message: `MERGE conflicts with other decisions for ${key}.`,
        });
      }
    }
  }

  const summaryCount = Object.values(report.summaryByDecision).reduce((sum, value) => sum + value, 0);
  if (summaryCount !== report.rows.length) {
    issues.push({
      code: "summary_count_mismatch",
      severity: "error",
      message: `summaryByDecision=${summaryCount} but rows=${report.rows.length}.`,
    });
  }

  for (const [pathwayId, summary] of Object.entries(report.summaryByPathway)) {
    const actual = report.rows.filter((row) => row.pathwayId === pathwayId).length;
    if (summary.rowsEvaluated !== actual) {
      issues.push({
        code: "pathway_summary_mismatch",
        severity: "error",
        pathwayId,
        message: `Pathway summary rowsEvaluated=${summary.rowsEvaluated} but actual rows=${actual}.`,
      });
    }
  }

  for (const [systemId, summary] of Object.entries(report.summaryBySystemCategory)) {
    const actual = report.rows.filter((row) => row.systemId === systemId).length;
    const counted =
      summary.EXISTS_STRONG_SKIP +
      summary.EXISTS_UPGRADE +
      summary.CREATE_NEW +
      summary.MERGE +
      summary.REVIEW_NEEDED +
      summary.DUPLICATE_CLUSTER_REVIEW;
    if (counted !== actual) {
      issues.push({
        code: "system_summary_mismatch",
        severity: "error",
        topicSlug: systemId,
        message: `System summary counted=${counted} but actual rows=${actual} for ${systemId}.`,
      });
    }
  }

  const sorted = sortExecutionPlanRowsDeterministically(report.rows);
  for (let i = 0; i < sorted.length; i += 1) {
    const actual = report.rows[i];
    const expected = sorted[i];
    if (!actual || actual.pathwayId !== expected.pathwayId || actual.topicSlug !== expected.topicSlug) {
      issues.push({
        code: "rows_not_sorted",
        severity: "error",
        message: "Execution plan rows are not deterministically sorted.",
      });
      break;
    }
  }

  return issues;
}

export function buildFullNpExecutionPlan(params: {
  map: NpCanonicalCoverageMapJson;
  lessons: PathwayLessonMatchRow[];
  spineFile: string;
  contentItems?: ContentItemMatchRow[];
  mode: "report" | "db";
  dbAccessEnabled: boolean;
  applyEnabled: boolean;
}): NpExecutionPlanReport {
  const rows: ExecutionPlanRow[] = [];
  const summaryByPathway: Record<string, ExecutionPlanSummary> = {};
  const summaryBySystemCategory: Record<string, Omit<ExecutionPlanSummary, "rowsEvaluated">> = {};
  const summaryByDecision = buildDecisionTotals();

  for (const canonicalRow of flattenCanonicalTopicRows(params.map)) {
    const system: NpSpineSystem = {
      id: canonicalRow.systemId,
      name: canonicalRow.systemName,
      topics: [],
    };
    const rankedCandidates = rankPathwayLessonCandidatesForSpineTopic(
      canonicalRow.pathwayId,
      system,
      canonicalRow.topic,
      params.lessons,
    );
    const contentItemHints = collectContentItemHintsForSpineTopic(canonicalRow.topic, params.contentItems);
    const row = decideExecutionDecision({
      pathwayId: canonicalRow.pathwayId,
      system,
      topic: canonicalRow.topic,
      mergeTargetTopicId: canonicalRow.mergeTargetTopicId,
      rankedCandidates,
      contentItemHints,
    });
    rows.push(row);

    summaryByDecision[row.decision] += 1;
    summaryByPathway[row.pathwayId] ??= buildEmptySummary();
    summaryByPathway[row.pathwayId]![row.decision] += 1;
    summaryByPathway[row.pathwayId]!.rowsEvaluated += 1;

    summaryBySystemCategory[row.systemId] ??= {
      EXISTS_STRONG_SKIP: 0,
      EXISTS_UPGRADE: 0,
      CREATE_NEW: 0,
      MERGE: 0,
      REVIEW_NEEDED: 0,
      DUPLICATE_CLUSTER_REVIEW: 0,
    };
    summaryBySystemCategory[row.systemId]![row.decision] += 1;
  }

  const sortedRows = sortExecutionPlanRowsDeterministically(rows);
  const baseReport = {
    generatedAt: new Date().toISOString(),
    spineFile: params.spineFile,
    dataSources: [
      "canonical_spine",
      ...(params.dbAccessEnabled ? ["PathwayLesson"] : []),
      ...(params.contentItems?.length ? ["ContentItem_hint"] : []),
    ],
    mode: params.mode,
    dbAccessEnabled: params.dbAccessEnabled,
    applyEnabled: params.applyEnabled,
    summaryByPathway,
    summaryBySystemCategory,
    summaryByDecision,
    rows: sortedRows,
  };

  return {
    ...baseReport,
    validationIssues: validateExecutionPlan(baseReport),
  };
}
