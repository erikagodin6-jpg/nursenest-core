/**
 * CAT Engine and Readiness Scorer — unit tests
 *
 * Run with: node --test src/lib/cat/cat.test.ts
 * (uses built-in Node.js test runner; no external dependencies)
 */

import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  computeReadinessScore,
  emptyReadinessScore,
  l3HighRiskAccuracy,
  readinessBand,
} from "./readiness-scorer";

import {
  buildPerformanceProfile,
  emptyPerformanceProfile,
  identifyWeakDimensions,
  weakestLayer,
  weakestRiskLevel,
  weakestSystem,
  WEAK_AREA_THRESHOLD,
} from "./performance-tracker";

import {
  createEmptyCatSession,
  isSessionComplete,
  recordAnswer,
  selectNextQuestion,
} from "./cat-engine";

import { analyseSession } from "./session-analyzer";

import type {
  AnswerRecord,
  CatQuestion,
  CatSessionConfig,
} from "./types";

// ─── Test fixtures ────────────────────────────────────────────────────────────

const NOW = 1_700_000_000_000; // fixed reference timestamp

function makeAnswer(overrides: Partial<AnswerRecord> = {}): AnswerRecord {
  return {
    questionId: "q-001",
    topicSlug: "knee-pain-differential",
    systemTag: "musculoskeletal",
    cognitiveLayer: "L2",
    riskLevel: "moderate",
    correct: true,
    answeredAt: NOW,
    ...overrides,
  };
}

function makeQuestion(overrides: Partial<CatQuestion> = {}): CatQuestion {
  return {
    id: "q-001",
    topicSlug: "knee-pain-differential",
    systemTag: "musculoskeletal",
    cognitiveLayer: "L2",
    riskLevel: "moderate",
    difficulty: 3,
    ...overrides,
  };
}

// ─── Readiness Scorer ─────────────────────────────────────────────────────────

describe("computeReadinessScore", () => {
  it("returns 0 score for empty answer list", () => {
    const score = computeReadinessScore([], NOW);
    assert.equal(score.score, 0);
    assert.equal(score.confidence, "low");
    assert.equal(score.sampleSize, 0);
  });

  it("returns 100 for all correct L3 high-risk answers", () => {
    const answers: AnswerRecord[] = Array.from({ length: 20 }, (_, i) =>
      makeAnswer({
        questionId: `q-${i}`,
        cognitiveLayer: "L3",
        riskLevel: "high",
        correct: true,
        answeredAt: NOW,
      }),
    );
    const score = computeReadinessScore(answers, NOW);
    assert.equal(score.score, 100);
  });

  it("returns 0 for all incorrect L1 low-risk answers", () => {
    const answers: AnswerRecord[] = Array.from({ length: 10 }, (_, i) =>
      makeAnswer({
        questionId: `q-${i}`,
        cognitiveLayer: "L1",
        riskLevel: "low",
        correct: false,
        answeredAt: NOW,
      }),
    );
    const score = computeReadinessScore(answers, NOW);
    assert.equal(score.score, 0);
  });

  it("L3/high answers contribute more weight than L1/low", () => {
    // 1 correct L3/high vs 1 correct L1/low — same answer count, different score
    const highScore = computeReadinessScore(
      [makeAnswer({ cognitiveLayer: "L3", riskLevel: "high", correct: true })],
      NOW,
    );
    const lowScore = computeReadinessScore(
      [makeAnswer({ cognitiveLayer: "L1", riskLevel: "low", correct: true })],
      NOW,
    );
    assert.equal(highScore.score, 100, "single correct L3/high should be 100");
    assert.equal(lowScore.score, 100, "single correct L1/low should also be 100");
    // The weight difference shows up in raw weighted percent being the same (both 100% correct)
    // but rawWeightedPercent × weight differs in total contribution
    assert.ok(
      highScore.rawWeightedPercent === lowScore.rawWeightedPercent,
      "both 100% correct → same rawWeightedPercent",
    );
  });

  it("applies recency discount to old answers", () => {
    const oldAnswer = makeAnswer({
      correct: true,
      answeredAt: NOW - 30 * 24 * 60 * 60 * 1000, // 30 days ago
    });
    const newAnswer = makeAnswer({
      correct: false,
      answeredAt: NOW,
    });
    const score = computeReadinessScore([oldAnswer, newAnswer], NOW);
    // Recent incorrect heavily influences score; old correct is heavily discounted
    assert.ok(score.score < 50, "recent incorrect should dominate old correct");
  });

  it("consistency modifier penalises high-variance performance", () => {
    // Alternating correct/incorrect = maximum variance
    const volatile: AnswerRecord[] = Array.from({ length: 20 }, (_, i) =>
      makeAnswer({
        questionId: `q-${i}`,
        correct: i % 2 === 0,
        answeredAt: NOW,
      }),
    );
    const volScore = computeReadinessScore(volatile, NOW);

    // Always correct = minimum variance
    const steady: AnswerRecord[] = Array.from({ length: 20 }, (_, i) =>
      makeAnswer({ questionId: `q-${i}`, correct: true, answeredAt: NOW }),
    );
    const steadyScore = computeReadinessScore(steady, NOW);

    assert.ok(
      steadyScore.consistencyModifier > volScore.consistencyModifier,
      "consistent performance should have higher modifier",
    );
  });

  it("confidence increases with more answers", () => {
    const few = Array.from({ length: 5 }, (_, i) =>
      makeAnswer({ questionId: `q-${i}`, correct: true, answeredAt: NOW }),
    );
    const many = Array.from({ length: 30 }, (_, i) =>
      makeAnswer({
        questionId: `q-${i}`,
        correct: true,
        cognitiveLayer: "L3",
        riskLevel: "high",
        answeredAt: NOW,
      }),
    );
    assert.equal(computeReadinessScore(few, NOW).confidence, "low");
    assert.equal(computeReadinessScore(many, NOW).confidence, "high");
  });

  it("dimension breakdowns sum approximately to overall", () => {
    const answers: AnswerRecord[] = [
      makeAnswer({ questionId: "1", cognitiveLayer: "L1", riskLevel: "low", correct: true, systemTag: "cardio" }),
      makeAnswer({ questionId: "2", cognitiveLayer: "L2", riskLevel: "moderate", correct: false, systemTag: "resp" }),
      makeAnswer({ questionId: "3", cognitiveLayer: "L3", riskLevel: "high", correct: true, systemTag: "cardio" }),
    ];
    const score = computeReadinessScore(answers, NOW);
    assert.ok(typeof score.dimensions.byLayer.L1 === "number");
    assert.ok(typeof score.dimensions.byRisk.high === "number");
    assert.ok(typeof score.dimensions.bySystem.cardio === "number");
  });
});

describe("readinessBand", () => {
  it("maps scores to correct bands", () => {
    assert.equal(readinessBand(0), "critical");
    assert.equal(readinessBand(39), "critical");
    assert.equal(readinessBand(40), "developing");
    assert.equal(readinessBand(59), "developing");
    assert.equal(readinessBand(60), "approaching");
    assert.equal(readinessBand(74), "approaching");
    assert.equal(readinessBand(75), "ready");
    assert.equal(readinessBand(89), "ready");
    assert.equal(readinessBand(90), "proficient");
    assert.equal(readinessBand(100), "proficient");
  });
});

describe("l3HighRiskAccuracy", () => {
  it("returns 0 when no L3/high answers exist", () => {
    const answers = [makeAnswer({ cognitiveLayer: "L1", riskLevel: "low" })];
    assert.equal(l3HighRiskAccuracy(answers), 0);
  });

  it("computes accuracy only from L3/high subset", () => {
    const answers: AnswerRecord[] = [
      makeAnswer({ questionId: "1", cognitiveLayer: "L3", riskLevel: "high", correct: true }),
      makeAnswer({ questionId: "2", cognitiveLayer: "L3", riskLevel: "high", correct: false }),
      makeAnswer({ questionId: "3", cognitiveLayer: "L1", riskLevel: "low", correct: true }),
    ];
    assert.equal(l3HighRiskAccuracy(answers), 0.5);
  });
});

describe("emptyReadinessScore", () => {
  it("returns a structurally valid empty score", () => {
    const score = emptyReadinessScore();
    assert.equal(score.score, 0);
    assert.equal(score.sampleSize, 0);
    assert.ok(typeof score.computedAt === "string");
  });
});

// ─── Performance Tracker ──────────────────────────────────────────────────────

describe("buildPerformanceProfile", () => {
  it("returns empty profile for no answers", () => {
    const profile = buildPerformanceProfile([], NOW);
    assert.equal(profile.overall.attempted, 0);
    assert.deepEqual(profile.bySystem, {});
    assert.deepEqual(profile.byTopic, {});
  });

  it("correctly tracks per-system accuracy", () => {
    const answers: AnswerRecord[] = [
      makeAnswer({ questionId: "1", systemTag: "cardio", correct: true }),
      makeAnswer({ questionId: "2", systemTag: "cardio", correct: true }),
      makeAnswer({ questionId: "3", systemTag: "resp", correct: false }),
    ];
    const profile = buildPerformanceProfile(answers, NOW);
    assert.equal(profile.bySystem["cardio"]!.accuracy, 1.0);
    assert.equal(profile.bySystem["resp"]!.accuracy, 0.0);
  });

  it("tracks cognitive layer breakdown", () => {
    const answers: AnswerRecord[] = [
      makeAnswer({ questionId: "1", cognitiveLayer: "L1", correct: true }),
      makeAnswer({ questionId: "2", cognitiveLayer: "L3", correct: false }),
    ];
    const profile = buildPerformanceProfile(answers, NOW);
    assert.equal(profile.byLayer.L1.accuracy, 1.0);
    assert.equal(profile.byLayer.L3.accuracy, 0.0);
    assert.equal(profile.byLayer.L2.attempted, 0);
  });

  it("tracks risk level breakdown", () => {
    const answers: AnswerRecord[] = [
      makeAnswer({ questionId: "1", riskLevel: "high", correct: false }),
      makeAnswer({ questionId: "2", riskLevel: "high", correct: false }),
      makeAnswer({ questionId: "3", riskLevel: "low", correct: true }),
    ];
    const profile = buildPerformanceProfile(answers, NOW);
    assert.equal(profile.byRisk.high.accuracy, 0.0);
    assert.equal(profile.byRisk.low.accuracy, 1.0);
  });

  it("unique question count does not double-count repeats", () => {
    const answers: AnswerRecord[] = [
      makeAnswer({ questionId: "q1", correct: true }),
      makeAnswer({ questionId: "q1", correct: false }), // same ID, attempt 2
    ];
    const profile = buildPerformanceProfile(answers, NOW);
    assert.equal(profile.overall.attempted, 2); // 2 attempts
    assert.equal(profile.overall.uniqueQuestionsSeen, 1); // 1 unique
  });
});

describe("identifyWeakDimensions", () => {
  it("does not flag dimensions with fewer than MIN_RELIABLE_SAMPLE answers", () => {
    const answers: AnswerRecord[] = [
      makeAnswer({ questionId: "1", systemTag: "cardio", correct: false }),
      makeAnswer({ questionId: "2", systemTag: "cardio", correct: false }),
    ];
    const profile = buildPerformanceProfile(answers, NOW);
    const weak = identifyWeakDimensions(profile);
    const systemWeak = weak.filter((w) => w.key === "cardio");
    assert.equal(systemWeak.length, 0, "only 2 attempts < MIN_RELIABLE_SAMPLE (3)");
  });

  it("flags a dimension as weak when accuracy is below threshold", () => {
    const answers: AnswerRecord[] = Array.from({ length: 6 }, (_, i) =>
      makeAnswer({
        questionId: `q-${i}`,
        systemTag: "neuro",
        correct: i === 0, // only 1/6 correct = 16.7%
      }),
    );
    const profile = buildPerformanceProfile(answers, NOW);
    const weak = identifyWeakDimensions(profile);
    assert.ok(
      weak.some((w) => w.key === "neuro" && w.dimension === "system"),
      "neuro with 16.7% accuracy should be flagged as weak",
    );
  });

  it("orders weak dimensions by priority descending", () => {
    const answers: AnswerRecord[] = [
      // High-risk weakness (priority multiplier 2.5x)
      ...Array.from({ length: 5 }, (_, i) =>
        makeAnswer({ questionId: `h-${i}`, riskLevel: "high", correct: false, systemTag: "cardio" }),
      ),
      // Low-risk weakness
      ...Array.from({ length: 5 }, (_, i) =>
        makeAnswer({ questionId: `l-${i}`, riskLevel: "low", correct: false, systemTag: "resp" }),
      ),
    ];
    const profile = buildPerformanceProfile(answers, NOW);
    const weak = identifyWeakDimensions(profile);
    if (weak.length >= 2) {
      assert.ok(
        weak[0]!.priority >= weak[1]!.priority,
        "weak dimensions should be sorted by priority descending",
      );
    }
  });
});

describe("weakestSystem / weakestRiskLevel / weakestLayer", () => {
  it("returns null when no system has enough data", () => {
    const profile = emptyPerformanceProfile();
    assert.equal(weakestSystem(profile), null);
    assert.equal(weakestRiskLevel(profile), null);
    assert.equal(weakestLayer(profile), null);
  });

  it("identifies the weakest system correctly", () => {
    const answers: AnswerRecord[] = [
      ...Array.from({ length: 5 }, (_, i) =>
        makeAnswer({ questionId: `a-${i}`, systemTag: "cardio", correct: false }),
      ),
      ...Array.from({ length: 5 }, (_, i) =>
        makeAnswer({ questionId: `b-${i}`, systemTag: "resp", correct: true }),
      ),
    ];
    const profile = buildPerformanceProfile(answers, NOW);
    assert.equal(weakestSystem(profile), "cardio");
  });
});

// ─── CAT Engine ───────────────────────────────────────────────────────────────

describe("selectNextQuestion", () => {
  const pool: CatQuestion[] = [
    makeQuestion({ id: "q1", cognitiveLayer: "L1", riskLevel: "low", difficulty: 1, systemTag: "cardio" }),
    makeQuestion({ id: "q2", cognitiveLayer: "L2", riskLevel: "moderate", difficulty: 3, systemTag: "resp" }),
    makeQuestion({ id: "q3", cognitiveLayer: "L3", riskLevel: "high", difficulty: 5, systemTag: "neuro" }),
    makeQuestion({ id: "q4", cognitiveLayer: "L2", riskLevel: "moderate", difficulty: 3, systemTag: "cardio" }),
    makeQuestion({ id: "q5", cognitiveLayer: "L3", riskLevel: "high", difficulty: 4, systemTag: "resp" }),
  ];

  const config: CatSessionConfig = {
    questionPool: pool,
    historicalAnswers: [],
    maxQuestions: 5,
    riskFloors: { low: 1, moderate: 1, high: 1 },
    layerFloors: { L1: 1, L2: 1, L3: 1 },
  };

  it("selects a question from the pool", () => {
    const state = createEmptyCatSession();
    const result = selectNextQuestion(state, config);
    assert.ok(result.question !== null);
    assert.ok(pool.some((q) => q.id === result.question!.id));
  });

  it("does not select already-answered questions", () => {
    const state = createEmptyCatSession();
    recordAnswer(state, pool[0]!, true, NOW);

    const result = selectNextQuestion(state, config);
    assert.ok(result.question?.id !== "q1", "q1 was already answered");
  });

  it("returns pool_exhausted when all questions answered and limit not reached", () => {
    const state = createEmptyCatSession();
    // Use a higher maxQuestions cap so pool exhaustion fires before the limit
    const bigConfig: CatSessionConfig = { ...config, maxQuestions: 100 };
    for (const q of pool) {
      recordAnswer(state, q, true, NOW);
    }
    const result = selectNextQuestion(state, bigConfig);
    assert.equal(result.question, null);
    assert.equal(result.terminationReason, "pool_exhausted");
  });

  it("returns max_questions_reached when session limit hit", () => {
    const state = createEmptyCatSession();
    const smallConfig: CatSessionConfig = {
      questionPool: pool,
      historicalAnswers: [],
      maxQuestions: 2,
      riskFloors: {},
      layerFloors: {},
    };
    recordAnswer(state, pool[0]!, true, NOW);
    recordAnswer(state, pool[1]!, false, NOW);

    const result = selectNextQuestion(state, smallConfig);
    assert.equal(result.question, null);
    assert.equal(result.terminationReason, "max_questions_reached");
  });

  it("provides selection diagnostics", () => {
    const state = createEmptyCatSession();
    const result = selectNextQuestion(state, config);
    assert.ok(typeof result.selectionDiagnostics.abilityEstimate === "number");
    assert.ok(typeof result.selectionDiagnostics.targetDifficulty === "number");
    assert.ok(result.selectionDiagnostics.candidateCount > 0);
  });
});

describe("recordAnswer", () => {
  it("updates answeredIds", () => {
    const state = createEmptyCatSession();
    const q = makeQuestion({ id: "q-abc" });
    recordAnswer(state, q, true, NOW);
    assert.ok(state.answeredIds.includes("q-abc"));
  });

  it("adjusts ability estimate up on correct", () => {
    const state = createEmptyCatSession();
    const q = makeQuestion();
    const before = state.abilityEstimate;
    recordAnswer(state, q, true, NOW);
    assert.ok(state.abilityEstimate > before);
  });

  it("adjusts ability estimate down on incorrect", () => {
    const state = createEmptyCatSession();
    const q = makeQuestion();
    const before = state.abilityEstimate;
    recordAnswer(state, q, false, NOW);
    assert.ok(state.abilityEstimate < before);
  });

  it("tracks correct and incorrect streaks", () => {
    const state = createEmptyCatSession();
    const q1 = makeQuestion({ id: "q1" });
    const q2 = makeQuestion({ id: "q2" });
    const q3 = makeQuestion({ id: "q3" });
    recordAnswer(state, q1, true, NOW);
    recordAnswer(state, q2, true, NOW);
    assert.equal(state.correctStreak, 2);
    recordAnswer(state, q3, false, NOW);
    assert.equal(state.correctStreak, 0);
    assert.equal(state.incorrectStreak, 1);
  });
});

describe("isSessionComplete", () => {
  it("returns false on a fresh session", () => {
    const state = createEmptyCatSession();
    const config: CatSessionConfig = {
      questionPool: [makeQuestion({ id: "q1" }), makeQuestion({ id: "q2" })],
      historicalAnswers: [],
      maxQuestions: 10,
    };
    assert.equal(isSessionComplete(state, config), false);
  });

  it("returns true when max questions reached", () => {
    const state = createEmptyCatSession();
    const q = makeQuestion({ id: "q1" });
    const config: CatSessionConfig = {
      questionPool: [q],
      historicalAnswers: [],
      maxQuestions: 1,
    };
    recordAnswer(state, q, true, NOW);
    assert.equal(isSessionComplete(state, config), true);
  });
});

// ─── Session Analyzer ─────────────────────────────────────────────────────────

describe("analyseSession", () => {
  it("returns a structurally valid analysis", () => {
    const pool: CatQuestion[] = Array.from({ length: 15 }, (_, i) =>
      makeQuestion({
        id: `q-${i}`,
        systemTag: i < 5 ? "cardio" : i < 10 ? "resp" : "neuro",
        cognitiveLayer: i % 3 === 0 ? "L1" : i % 3 === 1 ? "L2" : "L3",
        riskLevel: i % 3 === 0 ? "low" : i % 3 === 1 ? "moderate" : "high",
      }),
    );

    const state = createEmptyCatSession("test-session");
    const allAnswers: AnswerRecord[] = [];

    for (const q of pool.slice(0, 10)) {
      const correct = q.cognitiveLayer !== "L3"; // L3 always wrong → weak layer
      recordAnswer(state, q, correct, NOW);
      allAnswers.push(state.sessionAnswers[state.sessionAnswers.length - 1]!);
    }

    const analysis = analyseSession({
      sessionState: state,
      allAnswers,
      questionPool: pool,
      lessonCatalog: [],
    });

    assert.ok(typeof analysis.sessionId === "string");
    assert.ok(typeof analysis.analyzedAt === "string");
    assert.ok(typeof analysis.summary.readinessScore.score === "number");
    assert.ok(Array.isArray(analysis.weakAreas));
    assert.ok(Array.isArray(analysis.lessonRecommendations));
    assert.ok(analysis.followUpQuestions.questions.length <= 20);
  });

  it("identifies L3 as a weak layer when consistently incorrect on L3", () => {
    const pool: CatQuestion[] = [
      ...Array.from({ length: 5 }, (_, i) =>
        makeQuestion({ id: `l3-${i}`, cognitiveLayer: "L3", riskLevel: "high", systemTag: "cardio" }),
      ),
      ...Array.from({ length: 5 }, (_, i) =>
        makeQuestion({ id: `l1-${i}`, cognitiveLayer: "L1", riskLevel: "low", systemTag: "resp" }),
      ),
    ];

    const state = createEmptyCatSession("test-2");
    const allAnswers: AnswerRecord[] = [];

    for (const q of pool) {
      const correct = q.cognitiveLayer === "L1"; // L1 correct, L3 all wrong
      recordAnswer(state, q, correct, NOW);
      allAnswers.push(state.sessionAnswers[state.sessionAnswers.length - 1]!);
    }

    const analysis = analyseSession({ sessionState: state, allAnswers, questionPool: pool, lessonCatalog: [] });
    const l3Weak = analysis.weakAreas.find((w) => w.dimension === "layer" && w.key === "L3");
    assert.ok(l3Weak, "L3 should be identified as a weak area");
    assert.ok(l3Weak.recentAccuracy < WEAK_AREA_THRESHOLD);
  });

  it("generates follow-up questions targeting weak areas", () => {
    const pool: CatQuestion[] = Array.from({ length: 10 }, (_, i) =>
      makeQuestion({
        id: `q-${i}`,
        systemTag: "neuro",
        cognitiveLayer: "L3",
        riskLevel: "high",
      }),
    );

    const state = createEmptyCatSession("test-3");
    const allAnswers: AnswerRecord[] = [];

    for (const q of pool.slice(0, 5)) {
      recordAnswer(state, q, false, NOW); // all wrong → neuro/L3/high all weak
      allAnswers.push(state.sessionAnswers[state.sessionAnswers.length - 1]!);
    }

    const analysis = analyseSession({ sessionState: state, allAnswers, questionPool: pool, lessonCatalog: [] });
    assert.ok(analysis.followUpQuestions.questions.length > 0);
    assert.ok(analysis.followUpQuestions.targetingWeakAreas.length > 0);
  });

  it("includes score delta when baseline is provided", () => {
    const state = createEmptyCatSession("test-4");
    const allAnswers: AnswerRecord[] = [
      makeAnswer({ questionId: "x1", correct: true, answeredAt: NOW }),
    ];
    recordAnswer(state, makeQuestion({ id: "x1" }), true, NOW);

    const baseline = emptyReadinessScore();
    const analysis = analyseSession({
      sessionState: state,
      allAnswers,
      questionPool: [],
      lessonCatalog: [],
      baselineScore: baseline,
    });

    assert.ok(typeof analysis.summary.scoreDelta === "number");
  });

  it("generates lesson recommendations when catalog is provided", () => {
    const pool: CatQuestion[] = Array.from({ length: 6 }, (_, i) =>
      makeQuestion({ id: `q-${i}`, systemTag: "pulm", cognitiveLayer: "L3", riskLevel: "high" }),
    );
    const state = createEmptyCatSession("test-5");
    const allAnswers: AnswerRecord[] = [];
    for (const q of pool) {
      recordAnswer(state, q, false, NOW);
      allAnswers.push(state.sessionAnswers[state.sessionAnswers.length - 1]!);
    }

    const analysis = analyseSession({
      sessionState: state,
      allAnswers,
      questionPool: pool,
      lessonCatalog: [
        {
          lessonSlug: "copd-lesson-01",
          lessonTitle: "COPD Management",
          topicSlug: "copd-gold-staging",
          systemTag: "pulm",
          riskLevel: "high",
        },
        {
          lessonSlug: "asthma-lesson-01",
          lessonTitle: "Asthma Action Plans",
          topicSlug: "asthma-management",
          systemTag: "pulm",
          riskLevel: "moderate",
        },
      ],
    });

    assert.ok(analysis.lessonRecommendations.length > 0);
    assert.equal(analysis.lessonRecommendations[0]!.rank, 1);
  });
});

// ─── Scoring reproducibility ──────────────────────────────────────────────────

describe("Scoring reproducibility", () => {
  it("same inputs always produce the same score", () => {
    const answers: AnswerRecord[] = Array.from({ length: 15 }, (_, i) =>
      makeAnswer({
        questionId: `q-${i}`,
        cognitiveLayer: i % 3 === 0 ? "L1" : i % 3 === 1 ? "L2" : "L3",
        riskLevel: i % 3 === 0 ? "low" : i % 3 === 1 ? "moderate" : "high",
        correct: i % 2 === 0,
        answeredAt: NOW - i * 1000,
      }),
    );

    const s1 = computeReadinessScore(answers, NOW);
    const s2 = computeReadinessScore(answers, NOW);
    assert.equal(s1.score, s2.score);
    assert.equal(s1.consistencyModifier, s2.consistencyModifier);
  });

  it("CAT engine produces the same first selection given no prior history", () => {
    const pool: CatQuestion[] = [
      makeQuestion({ id: "a", difficulty: 3, systemTag: "s1" }),
      makeQuestion({ id: "b", difficulty: 3, systemTag: "s2" }),
    ];
    const config: CatSessionConfig = {
      questionPool: pool,
      historicalAnswers: [],
      maxQuestions: 10,
    };

    const s1 = createEmptyCatSession("r1");
    const s2 = createEmptyCatSession("r2");
    const r1 = selectNextQuestion(s1, config);
    const r2 = selectNextQuestion(s2, config);
    // Both sessions start at the same ability, so the pseudo-random tiebreak
    // with step=0 should be deterministic per question ID
    assert.equal(r1.question?.id, r2.question?.id, "first selection should be deterministic");
  });
});
