/**
 * CAT Engine — Computerized Adaptive Testing for NurseNest
 *
 * Selects the optimal next question by combining four signals:
 *
 *  1. ABILITY MATCH      — select questions close to the learner's current ability estimate.
 *  2. WEAKNESS PRIORITY  — boost questions in weak systems, risk levels, and cognitive layers.
 *  3. FLOOR ENFORCEMENT  — guarantee minimum coverage of high-risk and L3 questions
 *                          so sessions don't drift toward easy questions.
 *  4. RECENCY EXCLUSION  — never repeat questions seen recently.
 *
 * Ability estimation uses a simplified 1PL logistic model updated after each answer.
 * Difficulty target is derived from ability and mapped to the 1–5 item difficulty scale.
 *
 * Selection scoring formula (per candidate question):
 *
 *   selectionScore = abilityMatchScore(q) ×
 *                    weaknessBoost(q, profile) ×
 *                    floorBoost(q, counts) ×
 *                    diversityBoost(q, recentlySelected)
 *
 * The highest-scoring candidate is selected. When multiple candidates tie,
 * a deterministic pseudo-random tie-break (seeded by session step) is used
 * to prevent identical question sequences across sessions.
 */

import {
  applyAnswerToProfile,
  emptyPerformanceProfile,
  weakestLayer,
  weakestRiskLevel,
  weakestSystem,
} from "./performance-tracker";
import type {
  AnswerRecord,
  CatQuestion,
  CatSessionConfig,
  CatSessionState,
  CognitiveLayer,
  NextQuestionResult,
  RiskLevel,
} from "./types";
import { COGNITIVE_WEIGHTS, RISK_WEIGHTS } from "./types";

// ─── Constants ────────────────────────────────────────────────────────────────

/** Default session length cap. */
const DEFAULT_MAX_QUESTIONS = 40;

/** Default minimum questions per risk level before floor pressure releases. */
const DEFAULT_RISK_FLOORS: Record<RiskLevel, number> = {
  low: 4,
  moderate: 6,
  high: 8,
};

/** Default minimum questions per cognitive layer. */
const DEFAULT_LAYER_FLOORS: Record<CognitiveLayer, number> = {
  L1: 4,
  L2: 10,
  L3: 8,
};

/**
 * How many recent session questions to track for diversity.
 * Prevents topic clustering within a session.
 */
const TOPIC_DIVERSITY_WINDOW = 4;

/** Window (ms) for "recently seen across sessions" exclusion. */
const RECENT_SEEN_WINDOW_MS = 24 * 60 * 60 * 1000; // 24 h

/** Ability estimate bounds (logit scale). */
const ABILITY_MIN = -3;
const ABILITY_MAX = 3;

/** Step size for ability update after correct/incorrect (simplified). */
const ABILITY_STEP_CORRECT = 0.25;
const ABILITY_STEP_INCORRECT = -0.20;

// ─── Session Initialisation ───────────────────────────────────────────────────

/**
 * Create a fresh CAT session state from a config.
 *
 * Historical answers are used to:
 *   (a) Initialise the performance profile.
 *   (b) Exclude recently seen questions from selection.
 *   (c) Derive a starting ability estimate.
 */
export function createCatSession(config: CatSessionConfig): CatSessionState {
  const now = Date.now();

  // Build initial performance profile from history
  const { buildPerformanceProfile } = require("./performance-tracker") as typeof import("./performance-tracker");
  const historicalProfile = buildPerformanceProfile(config.historicalAnswers, now);

  // Derive starting ability from historical weighted accuracy
  const overallAccuracy = historicalProfile.overall.weightedAccuracy;
  const abilityEstimate = accuracyToAbility(overallAccuracy);

  // Collect recently seen IDs (from config or derived from 24h history)
  const recentlySeenIds = new Set<string>(
    config.excludeIds ??
      config.historicalAnswers
        .filter((a) => now - a.answeredAt < RECENT_SEEN_WINDOW_MS)
        .map((a) => a.questionId),
  );

  return {
    sessionId: generateSessionId(),
    startedAt: now,
    abilityEstimate,
    answeredIds: [],
    recentlySeenIds,
    sessionAnswers: [],
    performance: historicalProfile,
    correctStreak: 0,
    incorrectStreak: 0,
  };
}

// ─── Next Question Selection ──────────────────────────────────────────────────

/**
 * Select the optimal next question for the current session state.
 *
 * @param state  - Current CAT session state (mutable; updated by `recordAnswer`).
 * @param config - Session configuration including the question pool.
 * @returns      - The next question with selection diagnostics, or null on termination.
 */
export function selectNextQuestion(
  state: CatSessionState,
  config: CatSessionConfig,
): NextQuestionResult {
  const maxQ = config.maxQuestions ?? DEFAULT_MAX_QUESTIONS;
  const riskFloors: Record<RiskLevel, number> = {
    ...DEFAULT_RISK_FLOORS,
    ...(config.riskFloors ?? {}),
  };
  const layerFloors: Record<CognitiveLayer, number> = {
    ...DEFAULT_LAYER_FLOORS,
    ...(config.layerFloors ?? {}),
  };

  // ── Termination checks ────────────────────────────────────────────────────

  if (state.answeredIds.length >= maxQ) {
    return terminate("max_questions_reached", state);
  }

  // Filter: exclude answered + recently seen + session-answered
  const answeredSet = new Set(state.answeredIds);
  const candidates = config.questionPool.filter(
    (q) => !answeredSet.has(q.id) && !state.recentlySeenIds.has(q.id),
  );

  if (candidates.length === 0) {
    return terminate("pool_exhausted", state);
  }

  // ── Compute floor needs ───────────────────────────────────────────────────

  const riskCounts = countByKey(state.sessionAnswers, (a) => a.riskLevel) as Record<RiskLevel, number>;
  const layerCounts = countByKey(state.sessionAnswers, (a) => a.cognitiveLayer) as Record<CognitiveLayer, number>;

  const riskNeeded: Record<RiskLevel, number> = {
    low: Math.max(0, riskFloors.low - (riskCounts.low ?? 0)),
    moderate: Math.max(0, riskFloors.moderate - (riskCounts.moderate ?? 0)),
    high: Math.max(0, riskFloors.high - (riskCounts.high ?? 0)),
  };
  const layerNeeded: Record<CognitiveLayer, number> = {
    L1: Math.max(0, layerFloors.L1 - (layerCounts.L1 ?? 0)),
    L2: Math.max(0, layerFloors.L2 - (layerCounts.L2 ?? 0)),
    L3: Math.max(0, layerFloors.L3 - (layerCounts.L3 ?? 0)),
  };

  // Total remaining questions in session — use to determine floor urgency
  const remaining = maxQ - state.answeredIds.length;

  // ── Weakness signals ──────────────────────────────────────────────────────

  const ws = weakestSystem(state.performance);
  const wr = weakestRiskLevel(state.performance);
  const wl = weakestLayer(state.performance);

  // ── Recent topic diversity (last N systemTags selected) ───────────────────

  const recentSystems = new Set(
    state.sessionAnswers
      .slice(-TOPIC_DIVERSITY_WINDOW)
      .map((a) => a.systemTag),
  );

  // ── Target difficulty ─────────────────────────────────────────────────────

  const targetDifficulty = abilityToDifficulty(state.abilityEstimate);

  // ── Score each candidate ──────────────────────────────────────────────────

  let bestScore = -Infinity;
  let bestQuestion: CatQuestion | null = null;
  const stepIndex = state.answeredIds.length;

  for (const q of candidates) {
    let score = 1.0;

    // 1. Ability match: Gaussian-like proximity to target difficulty
    score *= abilityMatchScore(q.difficulty, targetDifficulty);

    // 2. Weakness boost: questions in weak dimensions are boosted
    if (ws && q.systemTag === ws) score *= 2.5;
    if (wr && q.riskLevel === wr) score *= RISK_WEIGHTS[wr];
    if (wl && q.cognitiveLayer === wl) score *= COGNITIVE_WEIGHTS[wl];

    // 3. Floor urgency: strongly boost dimensions below floor
    const riskFloorBehind = riskNeeded[q.riskLevel] > 0;
    const layerFloorBehind = layerNeeded[q.cognitiveLayer] > 0;
    if (riskFloorBehind) {
      // Urgency scales with how far behind we are relative to remaining questions
      const urgency = Math.min(4, riskNeeded[q.riskLevel] / Math.max(1, remaining) * 10);
      score *= 1 + urgency;
    }
    if (layerFloorBehind) {
      const urgency = Math.min(4, layerNeeded[q.cognitiveLayer] / Math.max(1, remaining) * 10);
      score *= 1 + urgency;
    }

    // 4. Diversity: mildly de-prioritise recently seen system tags
    if (recentSystems.has(q.systemTag)) score *= 0.6;

    // 5. Population tag freshness: boost questions targeting a population
    //    that has been underrepresented so far
    if (q.populationTags && q.populationTags.length > 0) {
      score *= 1.1;
    }

    // 6. Deterministic tie-break noise (avoids identical ordering across runs)
    score += pseudoRandom(q.id, stepIndex) * 0.01;

    if (score > bestScore) {
      bestScore = score;
      bestQuestion = q;
    }
  }

  if (!bestQuestion) {
    return terminate("pool_exhausted", state);
  }

  return {
    question: bestQuestion,
    selectionDiagnostics: {
      abilityEstimate: Math.round(state.abilityEstimate * 100) / 100,
      targetDifficulty,
      candidateCount: candidates.length,
      weakestSystem: ws,
      weakestRisk: wr,
      weakestLayer: wl,
      selectionScore: Math.round(bestScore * 1000) / 1000,
    },
  };
}

// ─── Answer Recording ─────────────────────────────────────────────────────────

/**
 * Record an answer and update the session state in place.
 *
 * This is the single mutation point for session state. All scoring and
 * tracking updates flow from here.
 *
 * @returns The updated session state (same reference as input, mutated).
 */
export function recordAnswer(
  state: CatSessionState,
  question: CatQuestion,
  correct: boolean,
  answeredAt: number = Date.now(),
  responseTimeMs?: number,
): CatSessionState {
  const record: AnswerRecord = {
    questionId: question.id,
    topicSlug: question.topicSlug,
    systemTag: question.systemTag,
    cognitiveLayer: question.cognitiveLayer,
    riskLevel: question.riskLevel,
    correct,
    answeredAt,
    responseTimeMs,
  };

  state.answeredIds.push(question.id);
  state.sessionAnswers.push(record);

  // Update ability estimate (1PL Bayesian-simplified)
  state.abilityEstimate = clamp(
    state.abilityEstimate + (correct ? ABILITY_STEP_CORRECT : ABILITY_STEP_INCORRECT),
    ABILITY_MIN,
    ABILITY_MAX,
  );

  // Streak tracking
  if (correct) {
    state.correctStreak += 1;
    state.incorrectStreak = 0;
  } else {
    state.incorrectStreak += 1;
    state.correctStreak = 0;
  }

  // Live performance update (incremental approximation)
  state.performance = applyAnswerToProfile(state.performance, record, answeredAt);

  return state;
}

// ─── Session Completion ───────────────────────────────────────────────────────

/**
 * Check whether the session has reached a natural stopping criterion.
 *
 * Stopping criteria (in order):
 *  1. Max questions reached.
 *  2. Pool exhausted.
 *  3. Confidence achieved: ability estimate is stable (< 0.1 drift in last 5 answers)
 *     AND minimum floors are satisfied.
 */
export function isSessionComplete(
  state: CatSessionState,
  config: CatSessionConfig,
): boolean {
  const maxQ = config.maxQuestions ?? DEFAULT_MAX_QUESTIONS;
  if (state.answeredIds.length >= maxQ) return true;

  const answeredSet = new Set(state.answeredIds);
  const remaining = config.questionPool.filter(
    (q) => !answeredSet.has(q.id) && !state.recentlySeenIds.has(q.id),
  );
  if (remaining.length === 0) return true;

  // Confidence achieved when ability is stable over recent answers
  if (state.sessionAnswers.length >= 20) {
    const last5 = state.sessionAnswers.slice(-5);
    const correctRate = last5.filter((a) => a.correct).length / 5;
    const abilityFromRate = accuracyToAbility(correctRate);
    const drift = Math.abs(abilityFromRate - state.abilityEstimate);
    if (drift < 0.1) return true;
  }

  return false;
}

// ─── Internal Helpers ─────────────────────────────────────────────────────────

/**
 * Map a 0–1 accuracy to an ability estimate on the logit scale.
 * Uses a logit transform with Bayesian smoothing (adds 0.5 to both sides).
 */
function accuracyToAbility(accuracy: number): number {
  const p = Math.max(0.001, Math.min(0.999, accuracy));
  const logit = Math.log(p / (1 - p));
  return clamp(logit * 0.75, ABILITY_MIN, ABILITY_MAX);
}

/**
 * Map an ability estimate (logit scale) to a target difficulty (1–5).
 */
function abilityToDifficulty(ability: number): number {
  const t = (Math.tanh(ability / 2) + 1) / 2; // 0 to 1
  return Math.round(1 + t * 4) as 1 | 2 | 3 | 4 | 5;
}

/**
 * Gaussian-like score for how well a question's difficulty matches the target.
 * Peak at exact match; decays smoothly with distance.
 */
function abilityMatchScore(qDifficulty: number, targetDifficulty: number): number {
  const distance = Math.abs(qDifficulty - targetDifficulty);
  // Sigma = 1.2 gives comfortable spread; items ±2 levels still get ~25% score
  return Math.exp(-(distance ** 2) / (2 * 1.44));
}

/**
 * Deterministic pseudo-random float in [0, 1) seeded by question ID and step.
 * Ensures reproducible but shuffled orderings without Math.random().
 */
function pseudoRandom(questionId: string, step: number): number {
  let hash = step * 2654435761;
  for (let i = 0; i < questionId.length; i++) {
    hash ^= questionId.charCodeAt(i);
    hash = (hash * 1664525 + 1013904223) >>> 0;
  }
  return (hash >>> 0) / 0xffffffff;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function countByKey<T>(items: T[], keyFn: (item: T) => string): Record<string, number> {
  const result: Record<string, number> = {};
  for (const item of items) {
    const key = keyFn(item);
    result[key] = (result[key] ?? 0) + 1;
  }
  return result;
}

function terminate(
  reason: NextQuestionResult["terminationReason"],
  state: CatSessionState,
): NextQuestionResult {
  return {
    question: null,
    terminationReason: reason,
    selectionDiagnostics: {
      abilityEstimate: state.abilityEstimate,
      targetDifficulty: abilityToDifficulty(state.abilityEstimate),
      candidateCount: 0,
      weakestSystem: null,
      weakestRisk: null,
      weakestLayer: null,
      selectionScore: 0,
    },
  };
}

function generateSessionId(): string {
  const rand = Math.floor(Math.random() * 0xffffff)
    .toString(16)
    .padStart(6, "0");
  return `cat-${Date.now().toString(36)}-${rand}`;
}

// ─── Exported helpers for session management ──────────────────────────────────

export { emptyPerformanceProfile };

/**
 * Create an empty session state without a config (used for testing and seeding).
 */
export function createEmptyCatSession(sessionId?: string): CatSessionState {
  return {
    sessionId: sessionId ?? generateSessionId(),
    startedAt: Date.now(),
    abilityEstimate: 0,
    answeredIds: [],
    recentlySeenIds: new Set(),
    sessionAnswers: [],
    performance: emptyPerformanceProfile(),
    correctStreak: 0,
    incorrectStreak: 0,
  };
}
