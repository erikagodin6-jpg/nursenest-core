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

  it("rejects CAT completed with invalid results payload (no fake terminal)", () => {
    const r = assessCatPracticeHydrateInvariants({
      catMode: true,
      status: "COMPLETED",
      questionIds: ["q123456789012"],
      adaptiveState: createInitialAdaptiveState(),
      config: catCfg(),
      results: { scoreCorrect: 0, scoreTotal: 0 },
    });
    assert.equal(r.ok, false);
    if (!r.ok) assert.equal(r.code, "cat_completed_terminal_invalid");
  });

  it("rejects CAT completed with zero question ids even if results look populated", () => {
    const r = assessCatPracticeHydrateInvariants({
      catMode: true,
      status: "COMPLETED",
      questionIds: [],
      adaptiveState: createInitialAdaptiveState(),
      config: catCfg(),
      results: {
        scoreCorrect: 5,
        scoreTotal: 10,
        accuracyPct: 50,
        byTopic: {},
        weakAreas: [],
      },
    });
    assert.equal(r.ok, false);
    if (!r.ok) assert.equal(r.code, "cat_completed_terminal_invalid");
  });

  it("rejects CAT in progress when cursor is out of range", () => {
    const r = assessCatPracticeHydrateInvariants({
      catMode: true,
      status: "IN_PROGRESS",
      questionIds: ["q123456789012"],
      adaptiveState: createInitialAdaptiveState(),
      config: catCfg(),
      cursorIndex: 3,
    });
    assert.equal(r.ok, false);
    if (!r.ok) assert.equal(r.code, "cat_in_progress_cursor_invalid");
  });

  it("rejects linear engine in progress with zero question ids", () => {
    const r = assessCatPracticeHydrateInvariants({
      catMode: false,
      status: "IN_PROGRESS",
      questionIds: [],
      config: {
        questionCount: 10,
        topicNames: [],
        difficultyMin: null,
        difficultyMax: null,
        selectionMode: "random",
        pathwayId: "us-rn-nclex-rn",
        timedMode: false,
        sessionPickSalt: validSalt,
        linearDeliveryMode: "exam",
      },
    });
    assert.equal(r.ok, false);
    if (!r.ok) assert.equal(r.code, "linear_engine_in_progress_no_questions");
  });

  it("rejects linear engine in progress when sessionPickSalt is missing or too short", () => {
    const r = assessCatPracticeHydrateInvariants({
      catMode: false,
      status: "IN_PROGRESS",
      questionIds: ["q123456789012"],
      config: {
        questionCount: 10,
        topicNames: [],
        difficultyMin: null,
        difficultyMax: null,
        selectionMode: "random",
        pathwayId: "us-rn-nclex-rn",
        timedMode: false,
        sessionPickSalt: "short",
        linearDeliveryMode: "practice",
      },
    });
    assert.equal(r.ok, false);
    if (!r.ok) assert.equal(r.code, "linear_engine_session_pick_salt_missing");
  });

  it("rejects CAT in progress with malformed adaptive state even when cursor and salt are valid", () => {
    const r = assessCatPracticeHydrateInvariants({
      catMode: true,
      status: "IN_PROGRESS",
      questionIds: ["q123456789012"],
      adaptiveState: { notCatEngine: true },
      config: catCfg(),
      cursorIndex: 0,
    });
    assert.equal(r.ok, false);
    if (!r.ok) assert.equal(r.code, "cat_adaptive_state_corrupt");
  });
});
