import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { describe, it } from "node:test";
import { createInitialAdaptiveState } from "@/lib/exams/cat-engine";
import {
  assessPracticeTestSessionHydrateContract,
  hydratePayloadHasBlockingSessionContractError,
  normalizeLinearPracticeCreateContract,
  sessionContractErrorJsonBody,
} from "@/lib/practice-tests/practice-session-contract";
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

describe("normalizeLinearPracticeCreateContract", () => {
  it("strips review navigation when delivery is exam even if the client sent true", () => {
    const n = normalizeLinearPracticeCreateContract({
      linearDeliveryMode: "exam",
      linearRationaleVisibility: "end_of_exam",
      linearAllowReviewNavigation: true,
    });
    assert.equal(n.linearDeliveryMode, "exam");
    assert.equal(n.linearAllowReviewNavigation, false);
  });

  it("preserves review navigation only for practice delivery", () => {
    const n = normalizeLinearPracticeCreateContract({
      linearDeliveryMode: "practice",
      linearRationaleVisibility: "after_each",
      linearAllowReviewNavigation: true,
    });
    assert.equal(n.linearDeliveryMode, "practice");
    assert.equal(n.linearAllowReviewNavigation, true);
  });
});

describe("assessPracticeTestSessionHydrateContract", () => {
  it("rejects legacy rows that enable review navigation without linearDeliveryMode", () => {
    const cfg: PracticeTestConfigJson = {
      questionCount: 20,
      topicNames: [],
      difficultyMin: null,
      difficultyMax: null,
      selectionMode: "random",
      pathwayId: "us-rn-nclex-rn",
      timedMode: false,
      sessionPickSalt: validSalt,
      linearAllowReviewNavigation: true,
    };
    const r = assessPracticeTestSessionHydrateContract({
      catMode: false,
      status: "IN_PROGRESS",
      questionIds: ["q123456789012"],
      cursorIndex: 0,
      adaptiveState: {},
      config: cfg,
    });
    assert.equal(r.ok, false);
    if (!r.ok) assert.equal(r.violation.code, "legacy_linear_review_nav_unsafe");
  });

  it("rejects linear exam config that persists review navigation", () => {
    const cfg: PracticeTestConfigJson = {
      questionCount: 20,
      topicNames: [],
      difficultyMin: null,
      difficultyMax: null,
      selectionMode: "random",
      pathwayId: "us-rn-nclex-rn",
      timedMode: false,
      sessionPickSalt: validSalt,
      linearDeliveryMode: "exam",
      linearRationaleVisibility: "end_of_exam",
      linearAllowReviewNavigation: true,
    };
    const r = assessPracticeTestSessionHydrateContract({
      catMode: false,
      status: "IN_PROGRESS",
      questionIds: ["q123456789012"],
      cursorIndex: 0,
      adaptiveState: { linearEngine: { committedQuestionIds: [] } },
      config: cfg,
    });
    assert.equal(r.ok, false);
    if (!r.ok) assert.equal(r.violation.code, "linear_exam_review_nav_forbidden");
  });

  it("rejects linear engine in progress when adaptiveState is missing linearEngine", () => {
    const cfg: PracticeTestConfigJson = {
      questionCount: 20,
      topicNames: [],
      difficultyMin: null,
      difficultyMax: null,
      selectionMode: "random",
      pathwayId: "us-rn-nclex-rn",
      timedMode: false,
      sessionPickSalt: validSalt,
      linearDeliveryMode: "exam",
      linearRationaleVisibility: "end_of_exam",
    };
    const r = assessPracticeTestSessionHydrateContract({
      catMode: false,
      status: "IN_PROGRESS",
      questionIds: ["q123456789012"],
      cursorIndex: 0,
      adaptiveState: { theta: 0.1 },
      config: cfg,
    });
    assert.equal(r.ok, false);
    if (!r.ok) assert.equal(r.violation.code, "linear_engine_resume_missing_linear_engine");
  });

  it("rejects committed ids that are not in questionIds", () => {
    const cfg: PracticeTestConfigJson = {
      questionCount: 20,
      topicNames: [],
      difficultyMin: null,
      difficultyMax: null,
      selectionMode: "random",
      pathwayId: "us-rn-nclex-rn",
      timedMode: false,
      sessionPickSalt: validSalt,
      linearDeliveryMode: "practice",
      linearRationaleVisibility: "after_each",
    };
    const r = assessPracticeTestSessionHydrateContract({
      catMode: false,
      status: "IN_PROGRESS",
      questionIds: ["q123456789012"],
      cursorIndex: 0,
      adaptiveState: { linearEngine: { committedQuestionIds: ["q999999999999"] } },
      config: cfg,
    });
    assert.equal(r.ok, false);
    if (!r.ok) assert.equal(r.violation.code, "linear_engine_resume_committed_unknown_ids");
  });

  it("accepts linear engine in progress with empty committed list", () => {
    const cfg: PracticeTestConfigJson = {
      questionCount: 20,
      topicNames: [],
      difficultyMin: null,
      difficultyMax: null,
      selectionMode: "random",
      pathwayId: "us-rn-nclex-rn",
      timedMode: false,
      sessionPickSalt: validSalt,
      linearDeliveryMode: "practice",
      linearRationaleVisibility: "after_each",
    };
    const r = assessPracticeTestSessionHydrateContract({
      catMode: false,
      status: "IN_PROGRESS",
      questionIds: ["q123456789012"],
      cursorIndex: 0,
      adaptiveState: { linearEngine: { committedQuestionIds: [] } },
      config: cfg,
    });
    assert.equal(r.ok, true);
  });

  it("delegates CAT invalid completed terminal to cat hydrate codes", () => {
    const r = assessPracticeTestSessionHydrateContract({
      catMode: true,
      status: "COMPLETED",
      questionIds: [],
      cursorIndex: 0,
      adaptiveState: createInitialAdaptiveState(),
      config: catCfg(),
      results: { scoreCorrect: 1, scoreTotal: 10, accuracyPct: 10, byTopic: {}, weakAreas: [] },
    });
    assert.equal(r.ok, false);
    if (!r.ok) assert.equal(r.violation.code, "cat_completed_terminal_invalid");
  });

  it("rejects persisted linear commits when config is missing linearDeliveryMode (resume must not guess mode)", () => {
    const cfg: PracticeTestConfigJson = {
      questionCount: 20,
      topicNames: [],
      difficultyMin: null,
      difficultyMax: null,
      selectionMode: "random",
      pathwayId: "us-rn-nclex-rn",
      timedMode: false,
      sessionPickSalt: validSalt,
    };
    const r = assessPracticeTestSessionHydrateContract({
      catMode: false,
      status: "IN_PROGRESS",
      questionIds: ["q123456789012"],
      cursorIndex: 0,
      adaptiveState: { linearEngine: { committedQuestionIds: ["q123456789012"] } },
      config: cfg,
    });
    assert.equal(r.ok, false);
    if (!r.ok) assert.equal(r.violation.code, "linear_engine_metadata_without_delivery_mode");
  });

  it("rejects adaptiveState.linearEngine blob without linearDeliveryMode even when commits are empty", () => {
    const cfg: PracticeTestConfigJson = {
      questionCount: 20,
      topicNames: [],
      difficultyMin: null,
      difficultyMax: null,
      selectionMode: "random",
      pathwayId: "us-rn-nclex-rn",
      timedMode: false,
      sessionPickSalt: validSalt,
    };
    const r = assessPracticeTestSessionHydrateContract({
      catMode: false,
      status: "IN_PROGRESS",
      questionIds: ["q123456789012"],
      cursorIndex: 0,
      adaptiveState: { linearEngine: { committedQuestionIds: [] } },
      config: cfg,
    });
    assert.equal(r.ok, false);
    if (!r.ok) assert.equal(r.violation.code, "linear_engine_metadata_without_delivery_mode");
  });

  it("rejects linear engine in progress when cursor is out of range (resume must not guess active item)", () => {
    const cfg: PracticeTestConfigJson = {
      questionCount: 20,
      topicNames: [],
      difficultyMin: null,
      difficultyMax: null,
      selectionMode: "random",
      pathwayId: "us-rn-nclex-rn",
      timedMode: false,
      sessionPickSalt: validSalt,
      linearDeliveryMode: "exam",
      linearRationaleVisibility: "end_of_exam",
    };
    const r = assessPracticeTestSessionHydrateContract({
      catMode: false,
      status: "IN_PROGRESS",
      questionIds: ["q123456789012", "q223456789012"],
      cursorIndex: 2,
      adaptiveState: { linearEngine: { committedQuestionIds: [] } },
      config: cfg,
    });
    assert.equal(r.ok, false);
    if (!r.ok) assert.equal(r.violation.code, "linear_engine_in_progress_cursor_invalid");
  });

  it("rejects linear engine in progress when cursor is not an integer", () => {
    const cfg: PracticeTestConfigJson = {
      questionCount: 20,
      topicNames: [],
      difficultyMin: null,
      difficultyMax: null,
      selectionMode: "random",
      pathwayId: "us-rn-nclex-rn",
      timedMode: false,
      sessionPickSalt: validSalt,
      linearDeliveryMode: "practice",
      linearRationaleVisibility: "after_each",
    };
    const r = assessPracticeTestSessionHydrateContract({
      catMode: false,
      status: "IN_PROGRESS",
      questionIds: ["q123456789012"],
      // Intentionally malformed persisted cursor (must not coerce to an index).
      cursorIndex: 1.5 as unknown as number,
      adaptiveState: { linearEngine: { committedQuestionIds: [] } },
      config: cfg,
    });
    assert.equal(r.ok, false);
    if (!r.ok) assert.equal(r.violation.code, "linear_engine_in_progress_cursor_invalid");
  });

  it("accepts linear tutor review-navigation resume snapshot when engine metadata and cursor are valid", () => {
    const cfg: PracticeTestConfigJson = {
      questionCount: 20,
      topicNames: [],
      difficultyMin: null,
      difficultyMax: null,
      selectionMode: "random",
      pathwayId: "us-rn-nclex-rn",
      timedMode: false,
      sessionPickSalt: validSalt,
      linearDeliveryMode: "practice",
      linearRationaleVisibility: "after_each",
      linearAllowReviewNavigation: true,
    };
    const r = assessPracticeTestSessionHydrateContract({
      catMode: false,
      status: "IN_PROGRESS",
      questionIds: ["q123456789012", "q223456789012"],
      cursorIndex: 1,
      adaptiveState: { linearEngine: { committedQuestionIds: ["q123456789012"] } },
      config: cfg,
    });
    assert.equal(r.ok, true);
  });

  it("rejects linear exam completed rows with unreadable results (no fake terminal)", () => {
    const cfg: PracticeTestConfigJson = {
      questionCount: 20,
      topicNames: [],
      difficultyMin: null,
      difficultyMax: null,
      selectionMode: "random",
      pathwayId: "us-rn-nclex-rn",
      timedMode: false,
      sessionPickSalt: validSalt,
      linearDeliveryMode: "exam",
      linearRationaleVisibility: "end_of_exam",
    };
    const r = assessPracticeTestSessionHydrateContract({
      catMode: false,
      status: "COMPLETED",
      questionIds: ["q123456789012"],
      cursorIndex: 0,
      adaptiveState: { linearEngine: { committedQuestionIds: ["q123456789012"] } },
      config: cfg,
      results: { scoreCorrect: 0, scoreTotal: 0 },
    });
    assert.equal(r.ok, false);
    if (!r.ok) assert.equal(r.violation.code, "completed_results_invalid");
  });

  it("rejects completed linear rows when incorrectQuestionIds references a question outside the session", () => {
    const cfg: PracticeTestConfigJson = {
      questionCount: 20,
      topicNames: [],
      difficultyMin: null,
      difficultyMax: null,
      selectionMode: "random",
      pathwayId: "us-rn-nclex-rn",
      timedMode: false,
      sessionPickSalt: validSalt,
      linearDeliveryMode: "exam",
      linearRationaleVisibility: "end_of_exam",
    };
    const r = assessPracticeTestSessionHydrateContract({
      catMode: false,
      status: "COMPLETED",
      questionIds: ["q123456789012"],
      cursorIndex: 0,
      adaptiveState: { linearEngine: { committedQuestionIds: ["q123456789012"] } },
      config: cfg,
      results: {
        scoreCorrect: 0,
        scoreTotal: 1,
        accuracyPct: 0,
        byTopic: {},
        weakAreas: [],
        incorrectQuestionIds: ["q999999999999"],
      },
    });
    assert.equal(r.ok, false);
    if (!r.ok) assert.equal(r.violation.code, "completed_results_question_mismatch");
  });

  it("rejects completed linear rows when scoreTotal exceeds the session question count", () => {
    const cfg: PracticeTestConfigJson = {
      questionCount: 20,
      topicNames: [],
      difficultyMin: null,
      difficultyMax: null,
      selectionMode: "random",
      pathwayId: "us-rn-nclex-rn",
      timedMode: false,
      sessionPickSalt: validSalt,
      linearDeliveryMode: "exam",
      linearRationaleVisibility: "end_of_exam",
    };
    const r = assessPracticeTestSessionHydrateContract({
      catMode: false,
      status: "COMPLETED",
      questionIds: ["q123456789012", "q223456789012"],
      cursorIndex: 1,
      adaptiveState: { linearEngine: { committedQuestionIds: ["q123456789012", "q223456789012"] } },
      config: cfg,
      results: {
        scoreCorrect: 5,
        scoreTotal: 10,
        accuracyPct: 50,
        byTopic: {},
        weakAreas: [],
      },
    });
    assert.equal(r.ok, false);
    if (!r.ok) assert.equal(r.violation.code, "completed_score_total_exceeds_session");
  });

  it("accepts linear exam completed resume when terminal results are well-formed", () => {
    const cfg: PracticeTestConfigJson = {
      questionCount: 20,
      topicNames: [],
      difficultyMin: null,
      difficultyMax: null,
      selectionMode: "random",
      pathwayId: "us-rn-nclex-rn",
      timedMode: false,
      sessionPickSalt: validSalt,
      linearDeliveryMode: "exam",
      linearRationaleVisibility: "end_of_exam",
    };
    const r = assessPracticeTestSessionHydrateContract({
      catMode: false,
      status: "COMPLETED",
      questionIds: ["q123456789012"],
      cursorIndex: 0,
      adaptiveState: { linearEngine: { committedQuestionIds: ["q123456789012"] } },
      config: cfg,
      results: {
        scoreCorrect: 1,
        scoreTotal: 1,
        accuracyPct: 100,
        byTopic: {},
        weakAreas: [],
      },
    });
    assert.equal(r.ok, true);
  });

  it("surfaces missing session pick salt for linear engine via cat hydrate layer", () => {
    const cfg: PracticeTestConfigJson = {
      questionCount: 20,
      topicNames: [],
      difficultyMin: null,
      difficultyMax: null,
      selectionMode: "random",
      pathwayId: "us-rn-nclex-rn",
      timedMode: false,
      sessionPickSalt: "short",
      linearDeliveryMode: "practice",
      linearRationaleVisibility: "after_each",
    };
    const r = assessPracticeTestSessionHydrateContract({
      catMode: false,
      status: "IN_PROGRESS",
      questionIds: ["q123456789012"],
      cursorIndex: 0,
      adaptiveState: { linearEngine: { committedQuestionIds: [] } },
      config: cfg,
    });
    assert.equal(r.ok, false);
    if (!r.ok) assert.equal(r.violation.code, "linear_engine_session_pick_salt_missing");
  });
});

describe("sessionContractErrorJsonBody", () => {
  it("uses a stable key set for GET, PATCH, and question-route 409 responses", () => {
    const body = sessionContractErrorJsonBody({ code: "test_code", message: "msg" });
    assert.deepEqual(Object.keys(body).sort(), ["code", "error", "retryable", "sessionContractError"].sort());
    assert.equal(body.sessionContractError.code, "test_code");
  });
});

describe("hydratePayloadHasBlockingSessionContractError", () => {
  it("is true when GET embeds a session contract violation", () => {
    assert.equal(
      hydratePayloadHasBlockingSessionContractError({
        sessionContractError: { code: "linear_engine_in_progress_cursor_invalid", message: "bad cursor" },
      }),
      true,
    );
  });

  it("is false when the payload omits or empties sessionContractError", () => {
    assert.equal(hydratePayloadHasBlockingSessionContractError({}), false);
    assert.equal(hydratePayloadHasBlockingSessionContractError({ sessionContractError: null }), false);
    assert.equal(
      hydratePayloadHasBlockingSessionContractError({ sessionContractError: { code: "x", message: "  " } }),
      false,
    );
  });

  it("flags payloads that must not proceed even when HTTP status is 200 (non-strict GET)", () => {
    const payload = { ok: true, status: "IN_PROGRESS", sessionContractError: { code: "bad", message: "blocked" } };
    assert.equal(hydratePayloadHasBlockingSessionContractError(payload), true);
  });
});

describe("practice test runner hydrate guard (source parity)", () => {
  it("imports hydratePayloadHasBlockingSessionContractError so the guard cannot be removed silently", async () => {
    const runnerPath = fileURLToPath(
      new URL("../../components/student/practice-test-runner-client.tsx", import.meta.url),
    );
    const src = await readFile(runnerPath, "utf8");
    assert.ok(
      src.includes("hydratePayloadHasBlockingSessionContractError"),
      "practice-test-runner-client must gate hydrate on hydratePayloadHasBlockingSessionContractError",
    );
    assert.ok(
      /hydratePayloadHasBlockingSessionContractError\s*\(\s*data\s*\)/.test(src),
      "runner must call hydratePayloadHasBlockingSessionContractError(data) on hydrate payload",
    );
  });
});
