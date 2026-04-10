/**
 * Route QA: pathway lesson CTAs must not send users to generic `/app/exams` when a pathway-scoped
 * hub exists (`/app/practice-tests?pathwayId=`). `/app/exams` remains valid for cross-pathway timed mock history (nav).
 */
import assert from "node:assert/strict";
import test from "node:test";
import { buildAppPracticeTestsHubHref, practiceTestsWeakFocusHref } from "./study-loop-recommendations";

test("buildAppPracticeTestsHubHref encodes pathwayId", () => {
  assert.equal(
    buildAppPracticeTestsHubHref("us-rn-nclex-rn"),
    "/app/practice-tests?pathwayId=us-rn-nclex-rn",
  );
  assert.equal(buildAppPracticeTestsHubHref("  "), "/app/practice-tests");
});

test("practiceTestsWeakFocusHref keeps weak focus and pathwayId", () => {
  assert.equal(
    practiceTestsWeakFocusHref("ca-rpn-rex-pn"),
    "/app/practice-tests?cat=1&focus=weak&pathwayId=ca-rpn-rex-pn",
  );
  assert.equal(practiceTestsWeakFocusHref(null), "/app/practice-tests?cat=1&focus=weak");
});
