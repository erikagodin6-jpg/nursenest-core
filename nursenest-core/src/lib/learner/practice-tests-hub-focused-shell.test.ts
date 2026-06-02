import assert from "node:assert/strict";
import test from "node:test";
import { isPracticeTestsHubLandingPath } from "@/lib/learner/practice-tests-hub-focused-shell";

test("practice tests hub landing path", () => {
  assert.equal(isPracticeTestsHubLandingPath("/app/practice-tests"), true);
  assert.equal(isPracticeTestsHubLandingPath("/app/practice-tests/"), true);
  assert.equal(isPracticeTestsHubLandingPath("/app/practice-tests/start"), false);
  assert.equal(isPracticeTestsHubLandingPath("/app/practice-tests/cat-launch"), false);
  assert.equal(isPracticeTestsHubLandingPath("/app/practice-tests/abc-session"), false);
  assert.equal(isPracticeTestsHubLandingPath("/app/flashcards"), false);
});
