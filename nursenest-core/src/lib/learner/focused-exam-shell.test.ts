import * as assert from "node:assert/strict";
import { test } from "node:test";

import { isFocusedPracticeTestSessionPath } from "./focused-exam-shell";

test("detects active practice test sessions as focused exam shell routes", () => {
  assert.equal(isFocusedPracticeTestSessionPath("/app/practice-tests/session_123"), true);
  assert.equal(isFocusedPracticeTestSessionPath("/app/practice-tests/abc-def_123"), true);
});

test("keeps learner shell on non-session practice routes", () => {
  assert.equal(isFocusedPracticeTestSessionPath("/app/practice-tests"), false);
  assert.equal(isFocusedPracticeTestSessionPath("/app/practice-tests/start"), false);
  assert.equal(isFocusedPracticeTestSessionPath("/app/practice-tests/cat-insights"), false);
  assert.equal(isFocusedPracticeTestSessionPath("/app/practice-tests/session_123/results"), false);
});

test("ignores unrelated learner routes and query strings", () => {
  assert.equal(isFocusedPracticeTestSessionPath("/app"), false);
  assert.equal(isFocusedPracticeTestSessionPath("/app/questions/session"), false);
  assert.equal(isFocusedPracticeTestSessionPath("/app/practice-tests/session_123?examShell=1"), true);
});
