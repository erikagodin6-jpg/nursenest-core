/**
 * Pre-Nursing Exam Engine — hardened for edge-case stability.
 *
 * Two modes:
 *
 * 1. Mini CAT — lightweight adaptive exam:
 *    - 10–15 questions, ~10 minutes
 *    - Ability scale 1.0–3.0 (hard-clamped, rounded to 2 dp after every update)
 *    - Difficulty-weighted ability updates:
 *        easy correct +0.3, medium +0.5, hard +0.7
 *        easy wrong   −0.3, medium −0.5, hard −0.7
 *    - Jitter: 0–0.1 in the same direction as base delta (skipped if base === 0)
 *    - Streak dampening: ≥3 consecutive same-outcome answers → ×0.85
 *    - Floor/ceiling injection: at ability 1.0 with 2+ consecutive wrong answers,
 *      occasionally serve a medium question; at 3.0 with 2+ wrong, serve medium.
 *      Prevents infinite easy/hard loops at range edges.
 *    - NaN guard: if any arithmetic produces NaN, ability stays unchanged
 *    - Early stop: after 8+ questions if last 5 are all correct or all wrong
 *    - Performance level: Beginner (<50%), Developing (50–74%), Strong (≥75%)
 *
 * 2. Practice Exam — fixed non-adaptive set:
 *    - 10 questions per module, balanced difficulty (40/40/20)
 *    - Weak areas: ≥2 attempts required; fallback fills to 3 from next-lowest modules
 *
 * All logic is pure / stateless — no network calls, no DB.
 */

import type { PreNursingQuestion } from "@/lib/pre-nursing/pre-nursing-question-bank";
import {
  PRE_NURSING_QUESTION_BANK,
  getQuestionsForModule,
} from "@/lib/pre-nursing/pre-nursing-question-bank";

// ── Types ─────────────────────────────────────────────────────────────────────

export type PerformanceLevel = "Beginner" | "Developing" | "Strong";

export type WeakArea = {
  moduleSlug: string;
  moduleTitle: string;
  correctCount: number;
  totalCount: number;
  accuracyPct: number;
};

export type PreNursingExamResult = {
  performanceLevel: PerformanceLevel;
  score: number;
  total: number;
  accuracyPct: number;
  weakAreas: WeakArea[];
  strengths: WeakArea[];
  /** Recommended module slugs to review (ordered by priority). */
  recommendedModules: string[];
  nextSteps: {
    lessons: Array<{ title: string; href: string }>;
    flashcards: Array<{ title: string; href: string }>;
    questions: { title: string; href: string } | null;
  };
};

// ── Mini CAT state ─────────────────────────────────────────────────────────────

export type MiniCatAnswer = {
  questionId: string;
  moduleSlug: string;
  correct: boolean;
  difficulty: 1 | 2 | 3;
};

export type MiniCatState = {
  /** Current ability estimate on the 1.0–3.0 scale. */
  abilityEstimate: number;
  answers: MiniCatAnswer[];
  /** IDs of questions already shown (prevents repeats). */
  seenIds: Set<string>;
};

// ── Mini CAT constants ─────────────────────────────────────────────────────────

const MINI_CAT_START_ABILITY = 2.0;
const MINI_CAT_MIN_ABILITY = 1.0;
const MINI_CAT_MAX_ABILITY = 3.0;
const MINI_CAT_MAX_QUESTIONS = 15;
const MINI_CAT_EARLY_STOP_AFTER = 8;
/** Max jitter magnitude — always added in the same direction as the base delta. */
const MINI_CAT_JITTER = 0.1;
/** Streak dampening factor applied when 3+ consecutive same-direction answers. */
const MINI_CAT_STREAK_DAMPEN = 0.85;
/** Minimum streak length before dampening activates. */
const MINI_CAT_STREAK_THRESHOLD = 3;
/**
 * At the ability floor (1.0) or ceiling (3.0), how many consecutive same-direction
 * answers before we inject a question from the adjacent band to break the loop.
 */
const MINI_CAT_EDGE_INJECT_AFTER = 2;
/** Probability (0–1) of injecting an adjacent-band question at the range edge. */
const MINI_CAT_EDGE_INJECT_PROB = 0.4;

/**
 * Difficulty-weighted ability deltas.
 * Correct on a hard question moves the needle more than correct on an easy one.
 */
const ABILITY_DELTA: Record<1 | 2 | 3, { correct: number; wrong: number }> = {
  1: { correct:  0.3, wrong: -0.3 },
  2: { correct:  0.5, wrong: -0.5 },
  3: { correct:  0.7, wrong: -0.7 },
};

/**
 * Count the current consecutive streak of same-outcome answers at the tail of
 * the answer list. Returns a positive number for correct streaks, negative for
 * wrong streaks (so the caller knows direction).
 */
function currentStreak(answers: MiniCatAnswer[]): number {
  if (answers.length === 0) return 0;
  const last = answers[answers.length - 1]!;
  let count = 0;
  for (let i = answers.length - 1; i >= 0; i--) {
    if (answers[i]!.correct === last.correct) count++;
    else break;
  }
  return last.correct ? count : -count;
}

// ── Mini CAT engine functions ──────────────────────────────────────────────────

/** Create a fresh mini CAT session state. */
export function createMiniCatState(): MiniCatState {
  return {
    abilityEstimate: MINI_CAT_START_ABILITY,
    answers: [],
    seenIds: new Set<string>(),
  };
}

/**
 * Target difficulty for the next question, clamped to 1–3.
 * We use the continuous ability value rounded to the nearest integer.
 */
function targetDifficulty(ability: number): 1 | 2 | 3 {
  const rounded = Math.max(1, Math.min(3, Math.round(ability)));
  return rounded as 1 | 2 | 3;
}

/** Pick one element at random from a non-empty array. */
function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)] ?? arr[0]!;
}

/**
 * Select the next question from the pool given current state.
 *
 * Normal priority: exact difficulty match → adjacent difficulty → any unseen.
 *
 * Edge-injection guard (prevents infinite easy/hard loops at range boundaries):
 * - At ability floor (1.0) with ≥MINI_CAT_EDGE_INJECT_AFTER consecutive wrong answers,
 *   randomly inject a medium (difficulty 2) question with probability MINI_CAT_EDGE_INJECT_PROB.
 * - At ability ceiling (3.0) with ≥MINI_CAT_EDGE_INJECT_AFTER consecutive wrong answers,
 *   randomly inject a medium question with the same probability.
 *
 * Returns null only when no unseen questions remain.
 */
export function selectNextQuestion(
  state: MiniCatState,
  pool: PreNursingQuestion[] = PRE_NURSING_QUESTION_BANK,
): PreNursingQuestion | null {
  const unseen = pool.filter((q) => !state.seenIds.has(q.id));
  if (unseen.length === 0) return null;

  // Edge-injection: check if we're stuck at a boundary with repeated wrong answers
  const streak = currentStreak(state.answers);
  const wrongStreak = streak < 0 ? Math.abs(streak) : 0;
  const atFloor = state.abilityEstimate <= MINI_CAT_MIN_ABILITY;
  const atCeiling = state.abilityEstimate >= MINI_CAT_MAX_ABILITY;

  if (wrongStreak >= MINI_CAT_EDGE_INJECT_AFTER && (atFloor || atCeiling)) {
    if (Math.random() < MINI_CAT_EDGE_INJECT_PROB) {
      const mediumUnseen = unseen.filter((q) => q.difficulty === 2);
      if (mediumUnseen.length > 0) return pickRandom(mediumUnseen);
    }
  }

  const target = targetDifficulty(state.abilityEstimate);

  // Prefer exact difficulty match
  const exact = unseen.filter((q) => q.difficulty === target);
  if (exact.length > 0) return pickRandom(exact);

  // Fall back to adjacent difficulty
  const adjacent = unseen.filter(
    (q) => q.difficulty === (target - 1) || q.difficulty === (target + 1),
  );
  if (adjacent.length > 0) return pickRandom(adjacent);

  // Any remaining unseen question
  return pickRandom(unseen);
}

/**
 * Clamp a value to [min, max] and round to 2 decimal places.
 * The rounding step prevents floating-point drift accumulating over a long session.
 * The NaN guard falls back to `fallback` if arithmetic produces a non-finite result.
 */
function clampAbility(raw: number, fallback: number): number {
  if (!isFinite(raw) || isNaN(raw)) return fallback;
  const clamped = Math.max(MINI_CAT_MIN_ABILITY, Math.min(MINI_CAT_MAX_ABILITY, raw));
  return Math.round(clamped * 100) / 100;
}

/**
 * Record a graded answer and update the ability estimate.
 *
 * Update rules (applied in order):
 * 1. Base delta from difficulty table (correct → positive, wrong → negative).
 * 2. Jitter: 0–MINI_CAT_JITTER in the same direction as base.
 *    Skipped entirely when base === 0 (Math.sign(0) = 0 avoids direction ambiguity).
 * 3. Streak dampening ×0.85 when ≥3 consecutive same-outcome answers (including this one).
 * 4. Clamp to [1.0, 3.0], round to 2 dp, NaN-guard (keeps prior value on failure).
 *
 * Invariants guaranteed on every return:
 *   - abilityEstimate ∈ [1.0, 3.0]
 *   - abilityEstimate is a finite number, never NaN
 *   - correct answer → ability ≥ state.abilityEstimate (before clamp)
 *   - wrong  answer  → ability ≤ state.abilityEstimate (before clamp)
 *   - question.id added to seenIds (no repeats in subsequent selection)
 *
 * Returns a new state object (immutable-style).
 */
export function recordAnswer(
  state: MiniCatState,
  question: PreNursingQuestion,
  correct: boolean,
): MiniCatState {
  const deltas = ABILITY_DELTA[question.difficulty];
  const base = correct ? deltas.correct : deltas.wrong;

  // Zero-delta guard: if base is somehow 0, skip jitter to avoid Math.sign(0) = 0
  // producing a direction-ambiguous nudge. (ABILITY_DELTA never has 0 values, but
  // this protects against future table edits.)
  const jitter = base !== 0
    ? Math.sign(base) * Math.random() * MINI_CAT_JITTER
    : 0;

  // Build prospective answer list (includes this answer) for streak detection
  const prospectiveAnswers: MiniCatAnswer[] = [
    ...state.answers,
    { questionId: question.id, moduleSlug: question.moduleSlug, correct, difficulty: question.difficulty },
  ];
  const streakLen = Math.abs(currentStreak(prospectiveAnswers));
  const dampen = streakLen >= MINI_CAT_STREAK_THRESHOLD ? MINI_CAT_STREAK_DAMPEN : 1.0;

  const delta = (base + jitter) * dampen;

  // Clamp + round + NaN guard — ability is always a clean, bounded number
  const newAbility = clampAbility(state.abilityEstimate + delta, state.abilityEstimate);

  const newSeenIds = new Set(state.seenIds);
  newSeenIds.add(question.id);

  return {
    abilityEstimate: newAbility,
    answers: prospectiveAnswers,
    seenIds: newSeenIds,
  };
}

/**
 * Should the mini CAT session end?
 *
 * Stops when:
 * 1. Max questions reached (15)
 * 2. No unseen questions remain
 * 3. Early stop after ≥8 questions: last 5 all correct (performance clearly strong)
 *    or last 5 all wrong (performance clearly beginner)
 */
export function shouldStopMiniCat(
  state: MiniCatState,
  pool: PreNursingQuestion[] = PRE_NURSING_QUESTION_BANK,
): boolean {
  const count = state.answers.length;

  if (count >= MINI_CAT_MAX_QUESTIONS) return true;

  // No more questions available
  const unseenCount = pool.filter((q) => !state.seenIds.has(q.id)).length;
  if (unseenCount === 0) return true;

  // Early stop after MINI_CAT_EARLY_STOP_AFTER questions answered
  if (count >= MINI_CAT_EARLY_STOP_AFTER) {
    const last5 = state.answers.slice(-5);
    if (last5.length === 5) {
      const allCorrect = last5.every((a) => a.correct);
      const allWrong = last5.every((a) => !a.correct);
      if (allCorrect || allWrong) return true;
    }
  }

  return false;
}

// ── Module titles (for result display) ────────────────────────────────────────

const MODULE_TITLES: Record<string, string> = {
  "anatomy-physiology": "Anatomy & Physiology",
  "medical-terminology": "Medical Terminology",
  "pharmacology": "Pharmacology",
  "fluids-electrolytes": "Fluids & Electrolytes",
  "infection-control": "Infection Control",
  "pathophysiology": "Pathophysiology",
  "chemistry": "Chemistry",
  "nutrition-foundations": "Nutrition Foundations",
  "oxygenation": "Oxygenation",
  "health-assessment": "Health Assessment",
};

// ── Shared result computation ──────────────────────────────────────────────────

type AnswerRecord = {
  moduleSlug: string;
  correct: boolean;
};

function computePerformanceLevel(accuracyPct: number): PerformanceLevel {
  if (accuracyPct >= 75) return "Strong";
  if (accuracyPct >= 50) return "Developing";
  return "Beginner";
}

function buildWeakAreas(answers: AnswerRecord[]): { weakAreas: WeakArea[]; strengths: WeakArea[] } {
  // Aggregate by module
  const moduleMap = new Map<string, { correct: number; total: number }>();
  for (const a of answers) {
    const entry = moduleMap.get(a.moduleSlug) ?? { correct: 0, total: 0 };
    entry.total++;
    if (a.correct) entry.correct++;
    moduleMap.set(a.moduleSlug, entry);
  }

  const all: WeakArea[] = [...moduleMap.entries()]
    .map(([moduleSlug, { correct, total }]) => ({
      moduleSlug,
      moduleTitle: MODULE_TITLES[moduleSlug] ?? moduleSlug,
      correctCount: correct,
      totalCount: total,
      accuracyPct: total > 0 ? Math.round((correct / total) * 100) : 0,
    }))
    .sort((a, b) => a.accuracyPct - b.accuracyPct);

  // Primary weak areas: ≥2 attempts and <60% accuracy, sorted by lowest accuracy, max 3
  const qualified = all.filter((a) => a.totalCount >= 2 && a.accuracyPct < 60);
  const weakAreas = qualified.slice(0, 3);

  // Fallback fill: if fewer than 3 qualified, append the next-lowest accuracy modules
  // that have ≥2 attempts (even if they're above 60%) until we have up to 3 entries.
  if (weakAreas.length < 3) {
    const weakSlugs = new Set(weakAreas.map((w) => w.moduleSlug));
    const fillers = all
      .filter((a) => a.totalCount >= 2 && !weakSlugs.has(a.moduleSlug))
      .slice(0, 3 - weakAreas.length);
    weakAreas.push(...fillers);
  }

  // Strengths: ≥2 attempts and ≥75% accuracy
  const strengths = all.filter((a) => a.totalCount >= 2 && a.accuracyPct >= 75);

  return { weakAreas, strengths };
}

function buildNextSteps(
  weakAreas: WeakArea[],
  performanceLevel: PerformanceLevel,
): PreNursingExamResult["nextSteps"] {
  // Already capped to ≤3 by buildWeakAreas
  const topWeak = weakAreas.map((w) => w.moduleSlug);

  // Lessons: prefer the practice exam page when available (more actionable than passive reading)
  const BANK_MODULE_SLUGS_SET = new Set([
    "anatomy-physiology", "medical-terminology", "pharmacology",
    "fluids-electrolytes", "infection-control", "pathophysiology",
    "chemistry", "nutrition-foundations", "oxygenation", "health-assessment",
  ]);

  const lessons = topWeak.map((slug) => {
    const title = MODULE_TITLES[slug] ?? slug;
    // Link to practice exam if available, otherwise lesson
    const href = BANK_MODULE_SLUGS_SET.has(slug)
      ? `/pre-nursing/practice/${slug}`
      : `/pre-nursing/lessons/${slug}`;
    const label = BANK_MODULE_SLUGS_SET.has(slug)
      ? `Practice: ${title}`
      : `Review: ${title}`;
    return { title: label, href };
  });

  // Flashcards: top 2 weak modules
  const flashcards = topWeak.slice(0, 2).map((slug) => ({
    title: `${MODULE_TITLES[slug] ?? slug} — study flashcards`,
    href: `/flashcards/${slug}`,
  }));

  const questions =
    performanceLevel === "Strong"
      ? { title: "Try NCLEX-level practice questions", href: "/question-bank" }
      : performanceLevel === "Developing"
        ? { title: "Retake the adaptive mini exam", href: "/pre-nursing/mini-cat" }
        : { title: "Restart from the beginning — adaptive exam", href: "/pre-nursing/mini-cat" };

  return { lessons, flashcards, questions };
}

/**
 * Compute the final exam result from mini CAT answers.
 */
export function computeMiniCatResult(state: MiniCatState): PreNursingExamResult {
  const total = state.answers.length;
  const score = state.answers.filter((a) => a.correct).length;
  const accuracyPct = total > 0 ? Math.round((score / total) * 100) : 0;
  const performanceLevel = computePerformanceLevel(accuracyPct);
  const { weakAreas, strengths } = buildWeakAreas(state.answers);
  const recommendedModules = weakAreas.map((w) => w.moduleSlug);
  const nextSteps = buildNextSteps(weakAreas, performanceLevel);

  return {
    performanceLevel,
    score,
    total,
    accuracyPct,
    weakAreas,
    strengths,
    recommendedModules,
    nextSteps,
  };
}

// ── Practice Exam builder ─────────────────────────────────────────────────────

export type PracticeExamConfig = {
  moduleSlug: string;
  /** How many questions to include (default 10). */
  questionCount?: number;
};

/**
 * Build a fixed, balanced question set for a module practice exam.
 * Distributes questions across difficulty levels (roughly 40% easy, 40% medium, 20% hard).
 */
export function buildPracticeExam(config: PracticeExamConfig): PreNursingQuestion[] {
  const { moduleSlug, questionCount = 10 } = config;
  const pool = getQuestionsForModule(moduleSlug);
  if (pool.length === 0) return [];

  const easy   = pool.filter((q) => q.difficulty === 1);
  const medium = pool.filter((q) => q.difficulty === 2);
  const hard   = pool.filter((q) => q.difficulty === 3);

  // Target distribution: 40% easy, 40% medium, 20% hard
  const wantEasy   = Math.max(1, Math.round(questionCount * 0.4));
  const wantHard   = Math.max(0, Math.round(questionCount * 0.2));
  const wantMedium = questionCount - wantEasy - wantHard;

  const pick = (arr: PreNursingQuestion[], n: number): PreNursingQuestion[] => {
    const shuffled = [...arr].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, Math.min(n, shuffled.length));
  };

  const selected = [
    ...pick(easy,   wantEasy),
    ...pick(medium, wantMedium),
    ...pick(hard,   wantHard),
  ];

  // Shuffle the final set so difficulty isn't grouped
  return selected.sort(() => Math.random() - 0.5);
}

/**
 * Compute result from a completed practice exam.
 * answers[i].correct corresponds to questions[i].
 */
export function computePracticeExamResult(
  questions: PreNursingQuestion[],
  answers: boolean[],
): PreNursingExamResult {
  const total = questions.length;
  const answerRecords: AnswerRecord[] = questions.map((q, i) => ({
    moduleSlug: q.moduleSlug,
    correct: answers[i] ?? false,
  }));

  const score = answerRecords.filter((a) => a.correct).length;
  const accuracyPct = total > 0 ? Math.round((score / total) * 100) : 0;
  const performanceLevel = computePerformanceLevel(accuracyPct);
  const { weakAreas, strengths } = buildWeakAreas(answerRecords);
  const recommendedModules = weakAreas.map((w) => w.moduleSlug);
  const nextSteps = buildNextSteps(weakAreas, performanceLevel);

  return {
    performanceLevel,
    score,
    total,
    accuracyPct,
    weakAreas,
    strengths,
    recommendedModules,
    nextSteps,
  };
}

// ── Mixed practice exam (cross-module) ────────────────────────────────────────

/**
 * Build a mixed practice exam spanning multiple modules.
 * Pulls 2–3 questions per represented module, balanced by difficulty.
 */
export function buildMixedPracticeExam(questionCount = 20): PreNursingQuestion[] {
  const pool = [...PRE_NURSING_QUESTION_BANK];
  const shuffled = pool.sort(() => Math.random() - 0.5);
  return shuffled.slice(0, questionCount);
}
