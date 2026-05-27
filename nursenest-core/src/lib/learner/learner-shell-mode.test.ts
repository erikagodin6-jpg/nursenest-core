import * as assert from "node:assert/strict";
import { test } from "node:test";
import { learnerShellFlags, resolveLearnerShellMode } from "./learner-shell-mode";

// ── resolveLearnerShellMode ────────────────────────────────────────────────────

test("exam-focused: active practice test sessions", () => {
  assert.equal(resolveLearnerShellMode("/app/practice-tests/session_abc123"), "exam-focused");
  assert.equal(resolveLearnerShellMode("/app/practice-tests/cuid2_0xdeadbeef"), "exam-focused");
  // query strings are fine
  assert.equal(resolveLearnerShellMode("/app/practice-tests/session_123?examShell=1"), "exam-focused");
});

test("exam-focused: trailing slash on session id is still exam-focused", () => {
  // trailing slash normalised away, still a valid single-segment session path
  assert.equal(resolveLearnerShellMode("/app/practice-tests/session_abc/"), "exam-focused");
});

test("NOT exam-focused: practice-tests static leaves stay standard", () => {
  assert.equal(resolveLearnerShellMode("/app/practice-tests"), "study-hub");
  assert.equal(resolveLearnerShellMode("/app/practice-tests/"), "study-hub");
  assert.equal(resolveLearnerShellMode("/app/practice-tests/start"), "standard");
  assert.equal(resolveLearnerShellMode("/app/practice-tests/cat-launch"), "standard");
  assert.equal(resolveLearnerShellMode("/app/practice-tests/cat-insights"), "standard");
  // results sub-route must not be exam-focused
  assert.equal(resolveLearnerShellMode("/app/practice-tests/session_123/results"), "standard");
});

test("dashboard: root app route only", () => {
  assert.equal(resolveLearnerShellMode("/app"), "dashboard");
  assert.equal(resolveLearnerShellMode("/app/"), "dashboard");
  assert.equal(resolveLearnerShellMode("/app?tab=overview"), "dashboard");
});

test("flashcards-study: active deck session routes", () => {
  assert.equal(resolveLearnerShellMode("/app/flashcards/my-deck-ref"), "flashcards-study");
  assert.equal(resolveLearnerShellMode("/app/flashcards/rncore-2025"), "flashcards-study");
  // query strings on a deck route
  assert.equal(resolveLearnerShellMode("/app/flashcards/rncore?start=1"), "flashcards-study");
  // study-tools session player route
  assert.equal(
    resolveLearnerShellMode("/app/study-tools/flashcards/decks/deck_abc123/session/sess_xyz"),
    "flashcards-study",
  );
});

test("NOT flashcards-study: flashcards/decks sub-path is standard", () => {
  // The "decks" segment is the static gateway to study-tools decks, not a study session
  assert.equal(resolveLearnerShellMode("/app/flashcards/decks"), "standard");
});

test("study-hub: flashcards hub landing", () => {
  assert.equal(resolveLearnerShellMode("/app/flashcards"), "study-hub");
  assert.equal(resolveLearnerShellMode("/app/flashcards/"), "study-hub");
  assert.equal(resolveLearnerShellMode("/app/flashcards?pathwayId=rn"), "study-hub");
});

test("study-hub: practice-tests hub landing", () => {
  assert.equal(resolveLearnerShellMode("/app/practice-tests"), "study-hub");
  assert.equal(resolveLearnerShellMode("/app/practice-tests/"), "study-hub");
  assert.equal(resolveLearnerShellMode("/app/practice-tests?pathwayId=rn&catLaunch=1"), "study-hub");
});

test("standard: all other learner routes", () => {
  assert.equal(resolveLearnerShellMode("/app/lessons"), "standard");
  assert.equal(resolveLearnerShellMode("/app/lessons/some-slug"), "standard");
  assert.equal(resolveLearnerShellMode("/app/account"), "standard");
  assert.equal(resolveLearnerShellMode("/app/account/study-preferences"), "standard");
  assert.equal(resolveLearnerShellMode("/app/cat"), "standard");
  assert.equal(resolveLearnerShellMode("/app/exams"), "standard");
  assert.equal(resolveLearnerShellMode("/app/questions"), "standard");
});

test("null/undefined/empty input", () => {
  assert.equal(resolveLearnerShellMode(null), "standard");
  assert.equal(resolveLearnerShellMode(undefined), "standard");
  // empty string normalises to /app → dashboard (same as navigating to root)
  assert.equal(resolveLearnerShellMode(""), "dashboard");
});

// ── learnerShellFlags ─────────────────────────────────────────────────────────

test("exam-focused flags: chrome suppressed, widgets suppressed, not dashboard", () => {
  const f = learnerShellFlags("/app/practice-tests/session_abc");
  assert.equal(f.mode, "exam-focused");
  assert.equal(f.suppressFullChrome, true);
  assert.equal(f.suppressStudyWidgets, true);
  assert.equal(f.isDashboard, false);
});

test("flashcards-study flags: chrome suppressed, widgets suppressed, not dashboard", () => {
  const f = learnerShellFlags("/app/flashcards/my-deck");
  assert.equal(f.mode, "flashcards-study");
  assert.equal(f.suppressFullChrome, true);
  assert.equal(f.suppressStudyWidgets, true);
  assert.equal(f.isDashboard, false);
});

test("study-hub flags: chrome visible, widgets suppressed, not dashboard", () => {
  const fFlash = learnerShellFlags("/app/flashcards");
  assert.equal(fFlash.mode, "study-hub");
  assert.equal(fFlash.suppressFullChrome, false);
  assert.equal(fFlash.suppressStudyWidgets, true);
  assert.equal(fFlash.isDashboard, false);

  const fPt = learnerShellFlags("/app/practice-tests");
  assert.equal(fPt.mode, "study-hub");
  assert.equal(fPt.suppressStudyWidgets, true);
});

test("dashboard flags: chrome visible, widgets visible, isDashboard=true", () => {
  const f = learnerShellFlags("/app");
  assert.equal(f.mode, "dashboard");
  assert.equal(f.suppressFullChrome, false);
  assert.equal(f.suppressStudyWidgets, false);
  assert.equal(f.isDashboard, true);
});

test("standard flags: nothing suppressed", () => {
  const f = learnerShellFlags("/app/lessons/some-slug");
  assert.equal(f.mode, "standard");
  assert.equal(f.suppressFullChrome, false);
  assert.equal(f.suppressStudyWidgets, false);
  assert.equal(f.isDashboard, false);
});

// ── Cross-cutting regression guards ──────────────────────────────────────────

test("regression: exam-focused never returns a falsy suppressFullChrome", () => {
  const examPaths = [
    "/app/practice-tests/cuid_abc123",
    "/app/practice-tests/abc-session-id",
    "/app/practice-tests/session_1?examShell=1",
  ];
  for (const p of examPaths) {
    const f = learnerShellFlags(p);
    assert.ok(f.suppressFullChrome, `suppressFullChrome must be true for exam path: ${p}`);
  }
});

test("regression: non-session practice routes never suppress full chrome", () => {
  const nonSessionPaths = [
    "/app/practice-tests",
    "/app/practice-tests/start",
    "/app/practice-tests/cat-launch",
    "/app/practice-tests/cat-insights",
    "/app/practice-tests/session_abc/results",
  ];
  for (const p of nonSessionPaths) {
    const f = learnerShellFlags(p);
    assert.equal(f.suppressFullChrome, false, `suppressFullChrome must be false for non-session path: ${p}`);
  }
});

test("regression: dashboard never suppresses chrome or widgets", () => {
  const f = learnerShellFlags("/app");
  assert.equal(f.suppressFullChrome, false);
  assert.equal(f.suppressStudyWidgets, false);
});
