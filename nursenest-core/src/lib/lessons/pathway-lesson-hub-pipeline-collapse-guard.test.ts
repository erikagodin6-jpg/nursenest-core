import assert from "node:assert/strict";
import test from "node:test";
import {
  assessCanadaRnNclexLessonHubPipelineCollapseGuard,
  assessMarketingLessonHubPipelineCollapseGuard,
  LESSON_HUB_PIPELINE_MULTILESSON_THRESHOLD,
  shouldShowMarketingLessonHubInvariantErrorShell,
} from "@/lib/lessons/pathway-lesson-hub-pipeline-collapse-guard";

test("passes when upstream inventory is at or below threshold", () => {
  const r = assessMarketingLessonHubPipelineCollapseGuard({
    rawDbCount: LESSON_HUB_PIPELINE_MULTILESSON_THRESHOLD,
    renderableAllCount: 18,
    afterPrepareCount: 18,
    afterVerifyCount: 18,
    stage6LinkableLessonRows: 18,
  });
  assert.equal(r.kind, "ok");
});

test("flags loader collapse: raw DB >> threshold but renderableAll <= 1", () => {
  const r = assessMarketingLessonHubPipelineCollapseGuard({
    rawDbCount: 80,
    renderableAllCount: 1,
    afterPrepareCount: 1,
    afterVerifyCount: 1,
    stage6LinkableLessonRows: 1,
  });
  assert.equal(r.kind, "violation");
  if (r.kind === "violation") {
    assert.equal(r.metricEvent, "lesson_hub_inventory_tiny");
    assert.equal(r.invariantCode, "raw_db_gt_threshold_renderable_le_1");
  }
});

test("flags verify collapse: many prepared but verify keeps <= 1", () => {
  const r = assessMarketingLessonHubPipelineCollapseGuard({
    rawDbCount: 0,
    renderableAllCount: 50,
    afterPrepareCount: 50,
    afterVerifyCount: 1,
    stage6LinkableLessonRows: 1,
  });
  assert.equal(r.kind, "violation");
  if (r.kind === "violation") assert.equal(r.metricEvent, "lesson_hub_verify_collapse");
});

test("flags render collapse: many verified but almost no linkable rows in section model", () => {
  const r = assessMarketingLessonHubPipelineCollapseGuard({
    rawDbCount: 0,
    renderableAllCount: 50,
    afterPrepareCount: 50,
    afterVerifyCount: 50,
    stage6LinkableLessonRows: 0,
  });
  assert.equal(r.kind, "violation");
  if (r.kind === "violation") assert.equal(r.metricEvent, "lesson_hub_render_collapse");
});

test("deprecated alias matches marketing guard", () => {
  const a = assessMarketingLessonHubPipelineCollapseGuard({
    rawDbCount: 10,
    renderableAllCount: 10,
    afterPrepareCount: 10,
    afterVerifyCount: 10,
    stage6LinkableLessonRows: 10,
  });
  const b = assessCanadaRnNclexLessonHubPipelineCollapseGuard({
    rawDbCount: 10,
    renderableAllCount: 10,
    afterPrepareCount: 10,
    afterVerifyCount: 10,
    stage6LinkableLessonRows: 10,
  });
  assert.deepEqual(a, b);
});

test("shouldShowMarketingLessonHubInvariantErrorShell: no UX hard-fail when inventory exists", () => {
  const violation = assessMarketingLessonHubPipelineCollapseGuard({
    rawDbCount: 80,
    renderableAllCount: 1,
    afterPrepareCount: 1,
    afterVerifyCount: 1,
    stage6LinkableLessonRows: 1,
  });
  assert.equal(violation.kind, "violation");
  assert.equal(shouldShowMarketingLessonHubInvariantErrorShell(violation, 5), false);
  assert.equal(shouldShowMarketingLessonHubInvariantErrorShell(violation, 11), false);
  assert.equal(shouldShowMarketingLessonHubInvariantErrorShell(violation, 0), true);
});

test("shouldShow: ok assessment never blocks render", () => {
  const ok = assessMarketingLessonHubPipelineCollapseGuard({
    rawDbCount: 10,
    renderableAllCount: 10,
    afterPrepareCount: 10,
    afterVerifyCount: 10,
    stage6LinkableLessonRows: 10,
  });
  assert.equal(shouldShowMarketingLessonHubInvariantErrorShell(ok, 0), false);
});
