import * as assert from "node:assert/strict";
import { test } from "node:test";

import { learnerShellFlags, resolveLearnerShellMode } from "./learner-shell-mode";

test("learner shell mode keeps hub and content routes in the standard content pipeline", () => {
  for (const path of [
    "/app",
    "/app/lessons",
    "/app/flashcards",
    "/app/practice-tests",
    "/app/practice-tests/start",
    "/app/practice-tests/cat-launch",
    "/app/practice-tests/cat-insights",
  ]) {
    const flags = learnerShellFlags(path);
    assert.equal(flags.suppressFullChrome, false, `${path} must not suppress the full chrome`);
  }
});

test("learner shell mode focuses only active sessions, not review or hub pages", () => {
  assert.equal(resolveLearnerShellMode("/app/practice-tests/session_123"), "exam-focused");
  assert.equal(resolveLearnerShellMode("/app/flashcards/my-deck"), "flashcards-study");
  assert.equal(resolveLearnerShellMode("/app/study-tools/flashcards/decks/deck_1/session/session_1"), "flashcards-study");

  for (const path of [
    "/app/practice-tests/session_123/results",
    "/app/flashcards/decks",
    "/app/flashcards/decks/deck_1",
    "/app/flashcards/weak-areas",
  ]) {
    assert.notEqual(resolveLearnerShellMode(path), "exam-focused", `${path} must not use exam focused mode`);
  }
});
