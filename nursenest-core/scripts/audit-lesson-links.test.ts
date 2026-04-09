import assert from "node:assert/strict";
import test from "node:test";
import { isResolvableExamPathwayLessonsPath, PATHWAY_LESSONS_URL_RE } from "./audit-lesson-links";

test("PATHWAY_LESSONS_URL_RE matches hub and nested routes", () => {
  assert.equal(PATHWAY_LESSONS_URL_RE.test("/us/rn/nclex-rn/lessons"), true);
  assert.equal(PATHWAY_LESSONS_URL_RE.test("/us/rn/nclex-rn/lessons/foo"), true);
  assert.equal(PATHWAY_LESSONS_URL_RE.test("/us/rn/nclex-rn/lessons/topics/bar"), true);
  assert.equal(PATHWAY_LESSONS_URL_RE.test("/lessons"), false);
});

test("isResolvableExamPathwayLessonsPath accepts the six core marketing hubs", () => {
  assert.equal(isResolvableExamPathwayLessonsPath("/us/rn/nclex-rn/lessons"), true);
  assert.equal(isResolvableExamPathwayLessonsPath("/canada/rn/nclex-rn/lessons"), true);
  assert.equal(isResolvableExamPathwayLessonsPath("/us/lpn/nclex-pn/lessons"), true);
  assert.equal(isResolvableExamPathwayLessonsPath("/canada/rpn/rex-pn/lessons"), true);
  assert.equal(isResolvableExamPathwayLessonsPath("/us/np/fnp/lessons"), true);
  assert.equal(isResolvableExamPathwayLessonsPath("/canada/np/cnple/lessons"), true);
});

test("wrong role slug for US PN is rejected (use lpn, not pn)", () => {
  assert.equal(isResolvableExamPathwayLessonsPath("/us/pn/nclex-pn/lessons"), false);
});

test("NP SEO alias segments resolve", () => {
  assert.equal(isResolvableExamPathwayLessonsPath("/us/np/aanp-practice-test/lessons"), true);
});
