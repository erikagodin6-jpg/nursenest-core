import assert from "node:assert/strict";
import { describe, it } from "node:test";
import type {
  NpCanonicalCoverageMapJson,
  NpSpineSystem,
  NpSpineTopic,
  PathwayLessonMatchRow,
} from "./np-spine-db-alignment";
import {
  buildFullNpExecutionPlan,
  decideExecutionDecision,
  sortScoredLessonsDeterministically,
  validateExecutionPlan,
  type CandidateLessonMatch,
  type ExecutionDecision,
} from "./np-spine-execution-plan";

const cardioSystem: NpSpineSystem = {
  id: "cardiovascular",
  name: "Cardiovascular",
  topics: [],
};

function lesson(overrides: Partial<PathwayLessonMatchRow>): PathwayLessonMatchRow {
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

function candidate(
  score: number,
  depthScore: number,
  overrides: Partial<CandidateLessonMatch> = {},
): CandidateLessonMatch {
  const baseLesson = lesson({
    id: overrides.lesson?.id ?? `lesson-${score}-${depthScore}`,
    slug: overrides.lesson?.slug ?? `lesson-${score}-${depthScore}`,
    title: overrides.lesson?.title ?? "Heart failure board review",
    topicSlug: overrides.lesson?.topicSlug ?? "cv-heart-failure",
  });
  return {
    lesson: baseLesson,
    score,
    depth: {
      sectionCount: 5,
      approxChars: 6000,
      depthScore,
    },
    signals: ["exact_topicSlug", "title_similarity", "topic_field_overlap", "body_system"],
    ...overrides,
    lesson: { ...baseLesson, ...(overrides.lesson ?? {}) },
  };
}

describe("np-spine-execution-plan", () => {
  it("maps strong existing matches to EXISTS_STRONG_SKIP", () => {
    const decision = decideExecutionDecision({
      pathwayId: "us-np-fnp",
      system: cardioSystem,
      topic: {
        id: "cv-heart-failure",
        title: "Heart failure",
        exams: ["FNP"],
      },
      mergeTargetTopicId: undefined,
      rankedCandidates: [candidate(0.91, 0.88)],
    });

    assert.equal(decision.decision, "EXISTS_STRONG_SKIP");
    assert.equal(decision.winningLessonId, "lesson-0.91-0.88");
  });

  it("maps usable but shallow matches to EXISTS_UPGRADE", () => {
    const decision = decideExecutionDecision({
      pathwayId: "us-np-fnp",
      system: cardioSystem,
      topic: {
        id: "cv-heart-failure",
        title: "Heart failure",
        exams: ["FNP"],
      },
      mergeTargetTopicId: undefined,
      rankedCandidates: [candidate(0.83, 0.24)],
    });

    assert.equal(decision.decision, "EXISTS_UPGRADE");
  });

  it("enforces merge hints ahead of candidate creation decisions", () => {
    const decision = decideExecutionDecision({
      pathwayId: "us-np-fnp",
      system: cardioSystem,
      topic: {
        id: "resp-pe",
        title: "Pulmonary embolism",
        exams: ["FNP"],
      },
      mergeTargetTopicId: "cv-pe",
      rankedCandidates: [],
    });

    assert.equal(decision.decision, "MERGE");
    assert.equal(decision.mergeTargetTopicSlug, "cv-pe");
  });

  it("sends duplicate high-confidence clusters to DUPLICATE_CLUSTER_REVIEW", () => {
    const decision = decideExecutionDecision({
      pathwayId: "us-np-fnp",
      system: cardioSystem,
      topic: {
        id: "cv-afib",
        title: "Atrial fibrillation",
        exams: ["FNP"],
      },
      mergeTargetTopicId: undefined,
      rankedCandidates: [
        candidate(0.84, 0.72, {
          lesson: { id: "afib-a", slug: "afib-a", topicSlug: "cv-afib", title: "Atrial fibrillation A" },
        }),
        candidate(0.81, 0.7, {
          lesson: { id: "afib-b", slug: "afib-b", topicSlug: "cv-afib", title: "Atrial fibrillation B" },
        }),
      ],
    });

    assert.equal(decision.decision, "DUPLICATE_CLUSTER_REVIEW");
  });

  it("sends borderline ambiguous matches to REVIEW_NEEDED", () => {
    const decision = decideExecutionDecision({
      pathwayId: "us-np-fnp",
      system: cardioSystem,
      topic: {
        id: "cv-risk",
        title: "Cardiovascular risk stratification",
        exams: ["FNP"],
      },
      mergeTargetTopicId: undefined,
      rankedCandidates: [
        candidate(0.69, 0.46, {
          signals: ["title_similarity", "body_system"],
          lesson: { id: "risk-1", slug: "risk-1", topicSlug: "cv-other", title: "Cardiovascular risk basics" },
        }),
      ],
    });

    assert.equal(decision.decision, "REVIEW_NEEDED");
  });

  it("creates new rows when nothing acceptable exists", () => {
    const decision = decideExecutionDecision({
      pathwayId: "us-np-fnp",
      system: cardioSystem,
      topic: {
        id: "cv-new-topic",
        title: "Brand new topic",
        exams: ["FNP"],
      },
      mergeTargetTopicId: undefined,
      rankedCandidates: [],
    });

    assert.equal(decision.decision, "CREATE_NEW");
  });

  it("uses deterministic tie-breaking when scores are otherwise equal", () => {
    const ranked = sortScoredLessonsDeterministically([
      candidate(0.8, 0.65, {
        lesson: { id: "b-id", slug: "b-slug", title: "Same title" },
      }),
      candidate(0.8, 0.65, {
        lesson: { id: "a-id", slug: "a-slug", title: "Same title" },
      }),
    ]);

    assert.deepEqual(
      ranked.map((entry) => entry.lesson.id),
      ["a-id", "b-id"],
    );
  });

  it("validates exactly one decision per topicSlug plus pathwayId", () => {
    const issues = validateExecutionPlan({
      generatedAt: "2026-04-10T00:00:00.000Z",
      spineFile: "fake.json",
      dataSources: ["canonical_spine"],
      mode: "report",
      dbAccessEnabled: false,
      applyEnabled: false,
      summaryByPathway: {},
      summaryBySystemCategory: {},
      summaryByDecision: {} as Record<ExecutionDecision, number>,
      rows: [
        {
          pathwayId: "us-np-fnp",
          topicSlug: "cv-heart-failure",
          canonicalTopicId: "cv-heart-failure",
          canonicalTitle: "Heart failure",
          examTags: ["FNP"],
          systemId: "cardiovascular",
          systemName: "Cardiovascular",
          decision: "CREATE_NEW",
          confidence: 0,
          matchedLessonIds: [],
          matchedLessonSlugs: [],
          winningLessonId: null,
          winningLessonSlug: null,
          recommendedCanonicalSlug: "cv-heart-failure",
          mergeTargetTopicSlug: null,
          reasonCodes: ["no_candidates"],
          validationIssues: [],
          notes: [],
          reuseStatus: "new_pathway_specific",
          overlayNeeded: false,
          scoreSummary: null,
        },
        {
          pathwayId: "us-np-fnp",
          topicSlug: "cv-heart-failure",
          canonicalTopicId: "cv-heart-failure",
          canonicalTitle: "Heart failure",
          examTags: ["FNP"],
          systemId: "cardiovascular",
          systemName: "Cardiovascular",
          decision: "REVIEW_NEEDED",
          confidence: 0.4,
          matchedLessonIds: [],
          matchedLessonSlugs: [],
          winningLessonId: null,
          winningLessonSlug: null,
          recommendedCanonicalSlug: "cv-heart-failure",
          mergeTargetTopicSlug: null,
          reasonCodes: ["ambiguous_match"],
          validationIssues: [],
          notes: [],
          reuseStatus: "needs_review",
          overlayNeeded: false,
          scoreSummary: null,
        },
      ],
    });

    assert.ok(issues.some((issue) => issue.code === "duplicate_topic_pathway_decision"));
  });

  it("keeps summary totals aligned with row counts", () => {
    const map: NpCanonicalCoverageMapJson = {
      systems: [
        {
          id: "cardiovascular",
          name: "Cardiovascular",
          topics: [
            { id: "cv-pe", title: "Pulmonary embolism canonical", exams: ["FNP"] },
            { id: "cv-heart-failure", title: "Heart failure", exams: ["FNP"] },
            { id: "resp-pe", title: "Pulmonary embolism", exams: ["FNP"], auditDefault: "MERGE" },
          ],
        },
      ],
      totals: {
        mergeHints: [{ id: "resp-pe", mergeInto: "cv-pe" }],
      },
    };

    const plan = buildFullNpExecutionPlan({
      map,
      lessons: [lesson({ id: "hf-1", slug: "hf-1", title: "Heart failure", topicSlug: "cv-heart-failure" })],
      spineFile: "fake.json",
      mode: "report",
      dbAccessEnabled: false,
      applyEnabled: false,
    });

    const totalRows = plan.rows.length;
    const counted = Object.values(plan.summaryByDecision).reduce((sum, value) => sum + value, 0);
    assert.equal(counted, totalRows);
    assert.equal(plan.validationIssues.length, 0);
  });
});
