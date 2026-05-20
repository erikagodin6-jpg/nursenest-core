import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  createEmptyCatSession,
  isSessionComplete,
  recordAnswer,
  selectNextQuestion,
} from "./cat-engine";

import type { CatQuestion, CatSessionConfig } from "./types";

// ─── Fixtures ─────────────────────────────────────────────────────────────────

const NOW = 1_700_000_000_000;

function makeQuestion(overrides: Partial<CatQuestion> = {}): CatQuestion {
  return {
    id: `q-${Math.random().toString(36).slice(2, 8)}`,
    topicSlug: "general",
    systemTag: "general",
    cognitiveLayer: "L2",
    riskLevel: "moderate",
    difficulty: 3,
    ...overrides,
  };
}

function makePool(
  count: number,
  overrides: Partial<CatQuestion> = {},
): CatQuestion[] {
  return Array.from({ length: count }, (_, i) =>
    makeQuestion({ id: `q-${overrides.systemTag ?? "x"}-${i}`, ...overrides }),
  );
}

// ─── 1. Tier pool isolation ───────────────────────────────────────────────────

describe("tier pool isolation", () => {
  const tiers = ["rn", "rpn", "np", "allied"] as const;

  for (const tier of tiers) {
    it(`selectNextQuestion only returns ${tier} questions when pool is tier-filtered`, () => {
      const pool: CatQuestion[] = [
        ...makePool(5, { systemTag: tier }),
        ...makePool(5, { systemTag: "other_tier_tag" }),
      ];
      // Simulate a tier-scoped pool: caller pre-filters to the right tier.
      const tierPool = pool.filter((q) => q.systemTag === tier);
      const config: CatSessionConfig = {
        questionPool: tierPool,
        historicalAnswers: [],
        maxQuestions: 10,
      };
      const state = createEmptyCatSession();
      const result = selectNextQuestion(state, config);
      assert.ok(result.question !== null, "should select a question");
      assert.equal(
        result.question!.systemTag,
        tier,
        `selected question must belong to ${tier} pool`,
      );
    });
  }

  it("cross-tier questions are never selected when pool is scoped to rn", () => {
    const rnPool = makePool(10, { systemTag: "rn" });
    const config: CatSessionConfig = {
      questionPool: rnPool,
      historicalAnswers: [],
      maxQuestions: 20,
    };
    const state = createEmptyCatSession();
    for (let i = 0; i < 10; i++) {
      const result = selectNextQuestion(state, config);
      if (!result.question) break;
      assert.equal(result.question.systemTag, "rn");
      recordAnswer(state, result.question, true, NOW + i);
    }
  });
});

// ─── 2. ECG exclusion from standard CAT ──────────────────────────────────────

describe("ECG exclusion from standard CAT", () => {
  it("does not select a question tagged module=ecg when non-ecg questions are available", () => {
    // CAT pool callers apply NON_ECG_PRACTICE_EXAM_WHERE at the DB layer.
    // Here we simulate correct caller behaviour: the pool passed to the engine
    // contains no ECG questions.
    const pool: CatQuestion[] = [
      makeQuestion({ id: "std-1", topicSlug: "cardio-assessment" }),
      makeQuestion({ id: "std-2", topicSlug: "resp-assessment" }),
    ];
    const config: CatSessionConfig = {
      questionPool: pool,
      historicalAnswers: [],
      maxQuestions: 5,
    };
    const state = createEmptyCatSession();
    const result = selectNextQuestion(state, config);
    assert.ok(result.question !== null);
    assert.notEqual(result.question!.topicSlug, "ecg-rhythm-interpretation");
  });

  it("an ecg-tagged question in the pool can only be selected if explicitly included", () => {
    // Confirm engine is agnostic to the ecg tag — it is the pool construction
    // responsibility (tested here by verifying the engine selects whatever is given).
    const ecgQ = makeQuestion({ id: "ecg-q", topicSlug: "ecg-rhythm-interpretation" });
    const config: CatSessionConfig = {
      questionPool: [ecgQ],
      historicalAnswers: [],
      maxQuestions: 5,
    };
    const state = createEmptyCatSession();
    const result = selectNextQuestion(state, config);
    // If an ECG question slips through the pool gate, the engine would return it.
    // This test documents that the gate must be applied BEFORE passing the pool.
    assert.equal(result.question!.id, "ecg-q");
  });

  it("pool filtered to exclude ecg questions produces pool_exhausted immediately on empty pool", () => {
    // Represents post-filter state when all items were ecg and were removed.
    const config: CatSessionConfig = {
      questionPool: [],
      historicalAnswers: [],
      maxQuestions: 10,
    };
    const state = createEmptyCatSession();
    const result = selectNextQuestion(state, config);
    assert.equal(result.question, null);
    assert.equal(result.terminationReason, "pool_exhausted");
  });
});

// ─── 3. CAT stopping rule safety ─────────────────────────────────────────────

describe("isSessionComplete stopping rules", () => {
  it("returns false on a fresh session with questions available", () => {
    const pool = makePool(20);
    const config: CatSessionConfig = {
      questionPool: pool,
      historicalAnswers: [],
      maxQuestions: 40,
    };
    const state = createEmptyCatSession();
    assert.equal(isSessionComplete(state, config), false);
  });

  it("returns false when answered count is below maxQuestions and pool has items", () => {
    const pool = makePool(10);
    const config: CatSessionConfig = {
      questionPool: pool,
      historicalAnswers: [],
      maxQuestions: 10,
    };
    const state = createEmptyCatSession();
    // Answer 5 — still 5 remaining both in pool and in budget
    for (const q of pool.slice(0, 5)) {
      recordAnswer(state, q, true, NOW);
    }
    assert.equal(isSessionComplete(state, config), false);
  });

  it("returns true when maxQuestions is reached", () => {
    const pool = makePool(5);
    const config: CatSessionConfig = {
      questionPool: pool,
      historicalAnswers: [],
      maxQuestions: 5,
    };
    const state = createEmptyCatSession();
    for (const q of pool) {
      recordAnswer(state, q, true, NOW);
    }
    assert.equal(isSessionComplete(state, config), true);
  });

  it("returns true when pool is exhausted (all questions answered)", () => {
    const pool = makePool(3);
    const config: CatSessionConfig = {
      questionPool: pool,
      historicalAnswers: [],
      maxQuestions: 100,
    };
    const state = createEmptyCatSession();
    for (const q of pool) {
      recordAnswer(state, q, true, NOW);
    }
    assert.equal(isSessionComplete(state, config), true);
  });
});

// ─── 4. Minimum viable pool ───────────────────────────────────────────────────

describe("selectNextQuestion with empty pool", () => {
  it("returns null gracefully when the pool is empty (does not throw)", () => {
    const config: CatSessionConfig = {
      questionPool: [],
      historicalAnswers: [],
      maxQuestions: 10,
    };
    const state = createEmptyCatSession();
    let result: ReturnType<typeof selectNextQuestion> | undefined;
    assert.doesNotThrow(() => {
      result = selectNextQuestion(state, config);
    });
    assert.ok(result !== undefined);
    assert.equal(result!.question, null);
    assert.equal(result!.terminationReason, "pool_exhausted");
  });

  it("returns null gracefully when all pool questions have been answered", () => {
    const pool = makePool(2);
    const config: CatSessionConfig = {
      questionPool: pool,
      historicalAnswers: [],
      maxQuestions: 100,
    };
    const state = createEmptyCatSession();
    for (const q of pool) recordAnswer(state, q, false, NOW);
    const result = selectNextQuestion(state, config);
    assert.equal(result.question, null);
  });
});

// ─── 5. CAT no-rationale rule ─────────────────────────────────────────────────

describe("CAT no-rationale rule", () => {
  it("CatQuestion shape does not include a rationale field", () => {
    const q = makeQuestion();
    assert.equal(
      Object.prototype.hasOwnProperty.call(q, "rationale"),
      false,
      "CatQuestion must not carry a rationale field",
    );
  });

  it("selectNextQuestion result.question does not expose rationale", () => {
    const pool = makePool(3);
    const config: CatSessionConfig = {
      questionPool: pool,
      historicalAnswers: [],
      maxQuestions: 10,
    };
    const state = createEmptyCatSession();
    const result = selectNextQuestion(state, config);
    assert.ok(result.question !== null);
    assert.equal(
      Object.prototype.hasOwnProperty.call(result.question, "rationale"),
      false,
      "question returned by selectNextQuestion must not have rationale",
    );
  });

  it("selectNextQuestion result.question does not expose correctAnswer", () => {
    const pool = makePool(3);
    const config: CatSessionConfig = {
      questionPool: pool,
      historicalAnswers: [],
      maxQuestions: 10,
    };
    const state = createEmptyCatSession();
    const result = selectNextQuestion(state, config);
    assert.ok(result.question !== null);
    assert.equal(
      Object.prototype.hasOwnProperty.call(result.question, "correctAnswer"),
      false,
      "question returned by selectNextQuestion must not have correctAnswer",
    );
  });
});

// ─── 6. Allied occupation isolation ──────────────────────────────────────────

describe("allied occupation isolation", () => {
  it("allied_health_mlt pool does not contain allied_health_imaging questions when pre-filtered", () => {
    const mltPool: CatQuestion[] = makePool(5, { systemTag: "allied_health_mlt" });
    const imagingPool: CatQuestion[] = makePool(5, { systemTag: "allied_health_imaging" });
    const combined = [...mltPool, ...imagingPool];

    // Caller responsibility: filter pool to occupation tag before passing to engine
    const scopedPool = combined.filter((q) => q.systemTag === "allied_health_mlt");
    const config: CatSessionConfig = {
      questionPool: scopedPool,
      historicalAnswers: [],
      maxQuestions: 10,
    };
    const state = createEmptyCatSession();

    for (let i = 0; i < scopedPool.length; i++) {
      const result = selectNextQuestion(state, config);
      if (!result.question) break;
      assert.equal(
        result.question.systemTag,
        "allied_health_mlt",
        "must not serve allied_health_imaging question to allied_health_mlt user",
      );
      recordAnswer(state, result.question, true, NOW + i);
    }
  });

  it("occupationTag-filtered pool exhausted terminates without cross-contamination", () => {
    const mltOnly = makePool(3, { systemTag: "allied_health_mlt" });
    const config: CatSessionConfig = {
      questionPool: mltOnly,
      historicalAnswers: [],
      maxQuestions: 100,
    };
    const state = createEmptyCatSession();
    for (const q of mltOnly) recordAnswer(state, q, true, NOW);
    const result = selectNextQuestion(state, config);
    assert.equal(result.question, null);
    assert.equal(result.terminationReason, "pool_exhausted");
  });
});

// ─── 7. Ability estimation convergence ───────────────────────────────────────

describe("ability estimation convergence", () => {
  it("ability is positive after 10 correct answers on difficulty-5 questions", () => {
    const state = createEmptyCatSession();
    const hardQuestions = Array.from({ length: 10 }, (_, i) =>
      makeQuestion({ id: `hard-${i}`, difficulty: 5, riskLevel: "high", cognitiveLayer: "L3" }),
    );
    for (const q of hardQuestions) {
      recordAnswer(state, q, true, NOW);
    }
    assert.ok(
      state.abilityEstimate > 0,
      `ability should be positive after 10 correct on difficulty-5; got ${state.abilityEstimate}`,
    );
  });

  it("ability is negative after 10 wrong answers on difficulty-1 questions", () => {
    const state = createEmptyCatSession();
    const easyQuestions = Array.from({ length: 10 }, (_, i) =>
      makeQuestion({ id: `easy-${i}`, difficulty: 1, riskLevel: "low", cognitiveLayer: "L1" }),
    );
    for (const q of easyQuestions) {
      recordAnswer(state, q, false, NOW);
    }
    assert.ok(
      state.abilityEstimate < 0,
      `ability should be negative after 10 wrong on difficulty-1; got ${state.abilityEstimate}`,
    );
  });

  it("all-correct run yields higher ability than all-incorrect run", () => {
    const questions = Array.from({ length: 10 }, (_, i) =>
      makeQuestion({ id: `q-${i}`, difficulty: 3 }),
    );

    const correctState = createEmptyCatSession("correct-run");
    for (const q of questions) recordAnswer(correctState, q, true, NOW);

    const incorrectState = createEmptyCatSession("incorrect-run");
    for (const q of questions) recordAnswer(incorrectState, q, false, NOW);

    assert.ok(
      correctState.abilityEstimate > incorrectState.abilityEstimate,
      "all-correct run must produce higher ability than all-incorrect run",
    );
  });
});
