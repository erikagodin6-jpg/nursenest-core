import assert from "node:assert/strict";
import { describe, it } from "node:test";
import type {
  NpCanonicalCoverageMapJson,
  NpSpineTopic,
} from "./np-spine-db-alignment";
import {
  buildFullNpExecutionPlan,
  decideExecutionDecision,
  sortScoredLessonsDeterministically,
  validateExecutionPlan,
  type ExecutionDecision,
} from "./np-spine-execution-plan";
import {
  buildCandidateLessonMatch,
  buildExecutionPlanSummary,
  buildExecutionPlanRow,
  buildPathwayLessonMatchRow,
  buildNpSpineSystem,
} from "./test-fixtures";

const cardioSystem = buildNpSpineSystem();

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
      rankedCandidates: [buildCandidateLessonMatch({ score: 0.91, depthScore: 0.88 })],
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
      rankedCandidates: [buildCandidateLessonMatch({ score: 0.83, depthScore: 0.24 })],
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
        buildCandidateLessonMatch({
          score: 0.84,
          depthScore: 0.72,
          lesson: { id: "afib-a", slug: "afib-a", topicSlug: "cv-afib", title: "Atrial fibrillation A" },
        }),
        buildCandidateLessonMatch({
          score: 0.81,
          depthScore: 0.7,
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
        buildCandidateLessonMatch({
          score: 0.69,
          depthScore: 0.46,
          overrides: { signals: ["title_similarity", "body_system"] },
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
      buildCandidateLessonMatch({
        score: 0.8,
        depthScore: 0.65,
        lesson: { id: "b-id", slug: "b-slug", title: "Same title" },
      }),
      buildCandidateLessonMatch({
        score: 0.8,
        depthScore: 0.65,
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
      summaryByDecision: buildExecutionPlanSummary() as Record<ExecutionDecision, number>,
      rows: [
        buildExecutionPlanRow({
          topicSlug: "cv-heart-failure",
          canonicalTopicId: "cv-heart-failure",
          canonicalTitle: "Heart failure",
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
          sharedLessonReuseSufficient: false,
          reuseStatus: "new_pathway_specific",
          overlayNeeded: false,
          scoreSummary: null,
        }),
        buildExecutionPlanRow({
          topicSlug: "cv-heart-failure",
          canonicalTopicId: "cv-heart-failure",
          canonicalTitle: "Heart failure",
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
          sharedLessonReuseSufficient: false,
          reuseStatus: "needs_review",
          overlayNeeded: false,
          scoreSummary: null,
        }),
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
      lessons: [buildPathwayLessonMatchRow({ id: "hf-1", slug: "hf-1", title: "Heart failure", topicSlug: "cv-heart-failure" })],
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
