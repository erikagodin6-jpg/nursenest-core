/**
 * Contract tests for learner-shell predicates (Node — no Playwright).
 */
import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { isLearnerShell } from "../../../src/lib/navigation/learner-shell";
import { isLearnerNavInternalHref } from "./learner-shell";

describe("isLearnerShell", () => {
  it("accepts /app dashboard and nested learner routes", () => {
    assert.equal(isLearnerShell("/app"), true);
    assert.equal(isLearnerShell("/app/lessons"), true);
    assert.equal(isLearnerShell("/app/practice-tests"), true);
  });
  it("accepts top-level learner hubs", () => {
    assert.equal(isLearnerShell("/lessons"), true);
    assert.equal(isLearnerShell("/questions"), true);
    assert.equal(isLearnerShell("/flashcards"), true);
  });
  it("rejects auth and onboarding", () => {
    assert.equal(isLearnerShell("/login"), false);
    assert.equal(isLearnerShell("/signup"), false);
    assert.equal(isLearnerShell("/app/onboarding"), false);
    assert.equal(isLearnerShell("/app/onboarding/step"), false);
  });
  it("does not treat unrelated /app* prefixes as learner shell", () => {
    assert.equal(isLearnerShell("/application"), false);
    assert.equal(isLearnerShell("/apple"), false);
  });
});

describe("isLearnerNavInternalHref", () => {
  it("matches /app and /lessons style hrefs", () => {
    assert.equal(isLearnerNavInternalHref("/app/questions"), true);
    assert.equal(isLearnerNavInternalHref("/lessons/foo"), true);
    assert.equal(isLearnerNavInternalHref("https://example.com/flashcards"), true);
  });
  it("rejects external marketing", () => {
    assert.equal(isLearnerNavInternalHref("/pricing"), false);
  });
});
