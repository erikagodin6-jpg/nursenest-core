import type { ContentItemLessonRow } from "./lesson-accessibility-audit";
import type { NpMergeExecutionDbRow, NpMergePlanRow } from "./np-merge-execution";
import type {
  CandidateLessonMatch,
  ExecutionPlanRow,
  ExecutionPlanSummary,
} from "./np-spine-execution-plan";
import type { NpSpineSystem, NpSpineTopic, PathwayLessonMatchRow } from "./np-spine-db-alignment";

export function buildNpSpineSystem(overrides: Partial<NpSpineSystem> = {}): NpSpineSystem {
  return {
    id: "cardiovascular",
    name: "Cardiovascular",
    topics: [],
    ...overrides,
  };
}

export function buildNpSpineTopic(overrides: Partial<NpSpineTopic> = {}): NpSpineTopic {
  return {
    id: "cv-heart-failure",
    title: "Heart failure",
    exams: ["FNP"],
    ...overrides,
  };
}

export function buildPathwayLessonMatchRow(
  overrides: Partial<PathwayLessonMatchRow> = {},
): PathwayLessonMatchRow {
  return {
    id: "lesson-1",
    pathwayId: "us-np-fnp",
    slug: "cv-heart-failure",
    title: "Heart failure",
    topic: "Heart failure",
    topicSlug: "cv-heart-failure",
    bodySystem: "Cardiovascular",
    status: "PUBLISHED",
    sections: Array.from({ length: 5 }, (_, i) => ({ id: String(i), body: "x".repeat(1800) })),
    ...overrides,
  };
}

export function buildCandidateLessonMatch(params: {
  score: number;
  depthScore: number;
  lesson?: Partial<PathwayLessonMatchRow>;
  overrides?: Omit<Partial<CandidateLessonMatch>, "lesson" | "score" | "depth">;
}): CandidateLessonMatch {
  const { score, depthScore, lesson, overrides } = params;
  const lessonDefaults = buildPathwayLessonMatchRow({
    id: `lesson-${score}-${depthScore}`,
    slug: `lesson-${score}-${depthScore}`,
    title: "Heart failure board review",
    topicSlug: "cv-heart-failure",
  });
  return {
    lesson: { ...lessonDefaults, ...(lesson ?? {}) },
    score,
    depth: {
      sectionCount: 5,
      approxChars: 6000,
      depthScore,
    },
    signals: ["exact_topicSlug", "title_similarity", "topic_field_overlap", "body_system"],
    ...(overrides ?? {}),
  };
}

export function buildExecutionPlanRow(overrides: Partial<ExecutionPlanRow> = {}): ExecutionPlanRow {
  return {
    pathwayId: "us-np-fnp",
    topicSlug: "resp-pe",
    canonicalTopicId: "resp-pe",
    canonicalTitle: "Pulmonary embolism",
    examTags: ["FNP"],
    systemId: "respiratory",
    systemName: "Respiratory",
    decision: "MERGE",
    confidence: 0.4,
    matchedLessonIds: ["src-1"],
    matchedLessonSlugs: ["pulmonary-embolism-np"],
    winningLessonId: "src-1",
    winningLessonSlug: "pulmonary-embolism-np",
    recommendedCanonicalSlug: "cv-pe",
    mergeTargetTopicSlug: "cv-pe",
    reasonCodes: ["merge_hint_enforced"],
    validationIssues: [],
    notes: ['Canonical merge hint routes this topic into "cv-pe".'],
    sharedLessonReuseSufficient: true,
    overlayNeeded: false,
    reuseStatus: "shared_reuse_sufficient",
    scoreSummary: {
      candidateCount: 1,
      topScore: 0.4,
      secondScore: null,
      topDepthScore: 0.3,
      topSignals: ["title_similarity"],
    },
    contentItemHints: [],
    ...overrides,
  };
}

export function buildMergePlanRow(overrides: Partial<NpMergePlanRow> = {}): NpMergePlanRow {
  return {
    ...buildExecutionPlanRow({ decision: "MERGE" }),
    ...overrides,
    decision: "MERGE",
  };
}

export function buildNpMergeExecutionDbRow(
  overrides: Partial<NpMergeExecutionDbRow> = {},
): NpMergeExecutionDbRow {
  return {
    id: "row-1",
    pathwayId: "us-np-fnp",
    topicSlug: "resp-pe",
    slug: "pulmonary-embolism-np",
    title: "Pulmonary embolism",
    locale: "en",
    status: "PUBLISHED",
    sortOrder: 1,
    ...overrides,
  };
}

export function buildContentItemLessonRow(
  overrides: Partial<ContentItemLessonRow> = {},
): ContentItemLessonRow {
  return {
    id: "1",
    slug: "lesson-slug",
    title: "Lesson title",
    type: "lesson",
    status: "published",
    tier: "free",
    regionScope: "BOTH",
    ...overrides,
  };
}

export function buildExecutionPlanSummary(
  overrides: Partial<ExecutionPlanSummary> = {},
): ExecutionPlanSummary {
  return {
    EXISTS_STRONG_SKIP: 0,
    EXISTS_UPGRADE: 0,
    CREATE_NEW: 0,
    MERGE: 0,
    REVIEW_NEEDED: 0,
    DUPLICATE_CLUSTER_REVIEW: 0,
    rowsEvaluated: 0,
    ...overrides,
  };
}
