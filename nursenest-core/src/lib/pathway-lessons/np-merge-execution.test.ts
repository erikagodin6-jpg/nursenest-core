import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  buildNpMergeExecutionReport,
  evaluateMergeExecutionRow,
  filterMergePlanRows,
} from "./np-merge-execution";
import {
  buildExecutionPlanRow,
  buildMergePlanRow,
  buildNpMergeExecutionDbRow,
} from "./test-fixtures";

describe("np-merge-execution", () => {
  it("filters only MERGE rows from the execution plan", () => {
    const rows = filterMergePlanRows([
      buildMergePlanRow(),
      buildExecutionPlanRow({ topicSlug: "cv-pe", decision: "CREATE_NEW", mergeTargetTopicSlug: null }),
    ]);
    assert.equal(rows.length, 1);
    assert.equal(rows[0]?.decision, "MERGE");
  });

  it("marks row as WOULD_APPLY when one target exists and source rows are published", () => {
    const result = evaluateMergeExecutionRow({
      row: buildMergePlanRow(),
      dbRows: [
        buildNpMergeExecutionDbRow({ id: "src-1", topicSlug: "resp-pe", slug: "pulmonary-embolism-np" }),
        buildNpMergeExecutionDbRow({ id: "target-1", topicSlug: "cv-pe", slug: "cardio-pulmonary-embolism-np" }),
      ],
      applyEnabled: false,
    });

    assert.equal(result.status, "WOULD_APPLY");
    assert.deepEqual(result.sourceLessonIds, ["src-1"]);
    assert.deepEqual(result.targetLessonIds, ["target-1"]);
  });

  it("marks row as APPLIED when apply mode is enabled and validation passes", () => {
    const result = evaluateMergeExecutionRow({
      row: buildMergePlanRow(),
      dbRows: [
        buildNpMergeExecutionDbRow({ id: "src-1", topicSlug: "resp-pe", slug: "pulmonary-embolism-np" }),
        buildNpMergeExecutionDbRow({ id: "target-1", topicSlug: "cv-pe", slug: "cardio-pulmonary-embolism-np" }),
      ],
      applyEnabled: true,
      appliedArchiveCount: 1,
    });

    assert.equal(result.status, "APPLIED");
  });

  it("treats already-suppressed rows as UNCHANGED", () => {
    const result = evaluateMergeExecutionRow({
      row: buildMergePlanRow(),
      dbRows: [buildNpMergeExecutionDbRow({ id: "target-1", topicSlug: "cv-pe", slug: "cardio-pulmonary-embolism-np" })],
      applyEnabled: false,
    });

    assert.equal(result.status, "UNCHANGED");
    assert.equal(result.reasonCode, "no_published_source_rows");
  });

  it("rejects rows when the target lesson is missing", () => {
    const result = evaluateMergeExecutionRow({
      row: buildMergePlanRow(),
      dbRows: [buildNpMergeExecutionDbRow({ id: "src-1", topicSlug: "resp-pe", slug: "pulmonary-embolism-np" })],
      applyEnabled: false,
    });

    assert.equal(result.status, "REJECTED");
    assert.equal(result.reasonCode, "target_missing");
  });

  it("rejects rows when the target topic is ambiguous", () => {
    const result = evaluateMergeExecutionRow({
      row: buildMergePlanRow(),
      dbRows: [
        buildNpMergeExecutionDbRow({ id: "src-1", topicSlug: "resp-pe", slug: "pulmonary-embolism-np" }),
        buildNpMergeExecutionDbRow({ id: "target-1", topicSlug: "cv-pe", slug: "cv-pe-one" }),
        buildNpMergeExecutionDbRow({ id: "target-2", topicSlug: "cv-pe", slug: "cv-pe-two" }),
      ],
      applyEnabled: false,
    });

    assert.equal(result.status, "REJECTED");
    assert.equal(result.reasonCode, "target_ambiguous");
  });

  it("rejects self-targeted merge rows", () => {
    const result = evaluateMergeExecutionRow({
      row: buildMergePlanRow({ mergeTargetTopicSlug: "resp-pe" }),
      dbRows: [buildNpMergeExecutionDbRow({ id: "src-1", topicSlug: "resp-pe", slug: "pulmonary-embolism-np" })],
      applyEnabled: false,
    });

    assert.equal(result.status, "REJECTED");
    assert.equal(result.reasonCode, "invalid_merge_target");
  });

  it("builds deterministic merge execution summaries", () => {
    const report = buildNpMergeExecutionReport({
      planRows: [
        buildMergePlanRow({ pathwayId: "us-np-whnp", topicSlug: "wh-osteoporosis", mergeTargetTopicSlug: "endo-osteoporosis" }),
        buildMergePlanRow(),
      ],
      dbRows: [
        buildNpMergeExecutionDbRow({ id: "src-a", pathwayId: "us-np-fnp", topicSlug: "resp-pe", slug: "pulmonary-embolism-np" }),
        buildNpMergeExecutionDbRow({ id: "target-a", pathwayId: "us-np-fnp", topicSlug: "cv-pe", slug: "cardio-pe" }),
        buildNpMergeExecutionDbRow({ id: "src-b", pathwayId: "us-np-whnp", topicSlug: "wh-osteoporosis", slug: "womens-health-osteoporosis-np" }),
        buildNpMergeExecutionDbRow({ id: "target-b", pathwayId: "us-np-whnp", topicSlug: "endo-osteoporosis", slug: "endo-osteoporosis-core" }),
      ],
      applyEnabled: false,
      planFile: "plan.json",
      dbAccessEnabled: true,
    });

    assert.equal(report.rows[0]?.pathwayId, "us-np-fnp");
    assert.equal(report.summary.WOULD_APPLY, 2);
    assert.equal(report.summary.REJECTED, 0);
  });
});
