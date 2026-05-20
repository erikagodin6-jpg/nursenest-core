import test from "node:test";
import assert from "node:assert/strict";
import { subscriberMayResolveExplicitExamQuestionRows } from "@/lib/lessons/lesson-explicit-exam-question-access-pure";

test("subscriberMayResolveExplicitExamQuestionRows is false without premium access", () => {
  assert.equal(subscriberMayResolveExplicitExamQuestionRows({ hasAccess: false }), false);
});

test("subscriberMayResolveExplicitExamQuestionRows is true for entitled learners", () => {
  assert.equal(subscriberMayResolveExplicitExamQuestionRows({ hasAccess: true }), true);
});
