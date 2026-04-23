import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { createInitialAdaptiveState } from "@/lib/exams/cat-engine";
import { assessCatPracticeHydrateInvariants } from "@/lib/practice-tests/cat-session-surface-invariants";
import type { PracticeTestConfigJson } from "@/lib/practice-tests/types";

const validSalt = "a".repeat(12);

function catCfg(partial: Partial<PracticeTestConfigJson> = {}): PracticeTestConfigJson {
  return {
    questionCount: 75,
    topicNames: [],
    difficultyMin: null,
    difficultyMax: null,
    selectionMode: "cat",
    pathwayId: "us-rn-nclex-rn",
    timedMode: false,
    sessionPickSalt: validSalt,
    ...partial,
  };
}

describe("assessCatPracticeHydrateInvariants", () => {
  it("allows non-CAT sessions without adaptive payload", () => {
    const r = assessCatPracticeHydrateInvariants({
      catMode: false,
      status: "IN_PROGRESS",
      questionIds: [],
    });
    assert.equal(r.ok, true);
  });

  it("rejects CAT in progress with zero question ids", () => {
    const r = assessCatPracticeHydrateInvariants({
      catMode: true,
      status: "IN_PROGRESS",
      questionIds: [],
      adaptiveState: createInitialAdaptiveState(),
      config: catCfg(),
    });
    assert.equal(r.ok, false);
    if (!r.ok) assert.equal(r.code, "cat_in_progress_no_questions");
  });

  it("rejects missing sessionPickSalt for active CAT", () => {
    const r = assessCatPracticeHydrateInvariants({
      catMode: true,
      status: "IN_PROGRESS",
      questionIds: ["q123456789012"],
      adaptiveState: createInitialAdaptiveState(),
      config: catCfg({ sessionPickSalt: "short" }),
    });
    assert.equal(r.ok, false);
    if (!r.ok) assert.equal(r.code, "cat_config_session_pick_salt_missing");
  });

  it("rejects null adaptive state when CAT is in progress", () => {
    const r = assessCatPracticeHydrateInvariants({
      catMode: true,
      status: "IN_PROGRESS",
      questionIds: ["q123456789012"],
      adaptiveState: null,
      config: catCfg(),
    });
    assert.equal(r.ok, false);
    if (!r.ok) assert.equal(r.code, "cat_adaptive_state_corrupt");
  });

  it("rejects unparseable adaptive state", () => {
    const r = assessCatPracticeHydrateInvariants({
      catMode: true,
      status: "IN_PROGRESS",
      questionIds: ["q123456789012"],
      adaptiveState: { v: 99, theta: 0, targetDifficulty: 3 },
      config: catCfg(),
    });
    assert.equal(r.ok, false);
    if (!r.ok) assert.equal(r.code, "cat_adaptive_state_corrupt");
  });

  it("accepts valid CAT hydrate snapshot", () => {
    const r = assessCatPracticeHydrateInvariants({
      catMode: true,
      status: "IN_PROGRESS",
      questionIds: ["q123456789012"],
      adaptiveState: createInitialAdaptiveState(),
      config: catCfg(),
    });
    assert.equal(r.ok, true);
  });
});
