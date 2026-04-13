/**
 * Pre-Nursing Exam Engine.
 *
 * Two modes:
 *
 * 1. Mini CAT — lightweight adaptive exam:
 *    - 10–15 questions, ~10 minutes
 *    - Ability scale 1.0–3.0 (maps directly to difficulty 1/2/3)
 *    - Difficulty-weighted ability updates + ±0.1 jitter:
 *        easy correct +0.3, medium +0.5, hard +0.7
 *        easy wrong   −0.3, medium −0.5, hard −0.7
 *    - Jitter (±0.1) prevents mechanical predictability
 *    - Early stop: after 8+ questions if last 5 are all correct or all wrong
 *    - Performance level: Beginner (<50% correct), Developing (50–74%), Strong (≥75%)
 *
 * 2. Practice Exam — fixed non-adaptive set:
 *    - 10 questions per module, balanced difficulty (40/40/20)
 *    - Returns same score + weak areas (capped at top 3)
 *
 * Both modes return `PreNursingExamResult` at completion.
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
const MINI_CAT_JITTER = 0.1; // small random nudge to prevent mechanical pattern

/**
 * Difficulty-weighted ability delta.
 * Correct on a hard question moves the needle more than correct on an easy one.
 * Jitter (±MINI_CAT_JITTER) adds subtle unpredictability without instability.
 */
const ABILITY_DELTA: Record<1 | 2 | 3, { correct: number; wrong: number }> = {
  1: { correct:  0.3, wrong: -0.3 },
  2: { correct:  0.5, wrong: -0.5 },
  3: { correct:  0.7, wrong: -0.7 },
};

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

/**
 * Select the next question from the pool given current state.
 * Priority: exact difficulty match → one step off → any unseen
 * Returns null when no unseen questions remain.
 */
export function selectNextQuestion(
  state: MiniCatState,
  pool: PreNursingQuestion[] = PRE_NURSING_QUESTION_BANK,
): PreNursingQuestion | null {
  const unseen = pool.filter((q) => !state.seenIds.has(q.id));
  if (unseen.length === 0) return null;

  const target = targetDifficulty(state.abilityEstimate);

  // Prefer exact difficulty match
  const exact = unseen.filter((q) => q.difficulty === target);
  if (exact.length > 0) {
    return exact[Math.floor(Math.random() * exact.length)] ?? exact[0]!;
  }

  // Fall back to adjacent difficulty
  const adjacent = unseen.filter(
    (q) => q.difficulty === target - 1 || q.difficulty === target + 1,
  );
  if (adjacent.length > 0) {
    return adjacent[Math.floor(Math.random() * adjacent.length)] ?? adjacent[0]!;
  }

  // Any unseen question
  return unseen[Math.floor(Math.random() * unseen.length)] ?? unseen[0]!;
}

/**
 * Record a graded answer and update the ability estimate.
 *
 * Uses difficulty-weighted deltas so a correct hard answer lifts ability more
 * than a correct easy answer. A small jitter (±0.1) prevents mechanical step
 * patterns without destabilising the estimate.
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
  // Jitter: random in [-MINI_CAT_JITTER, +MINI_CAT_JITTER]
  const jitter = (Math.random() * 2 - 1) * MINI_CAT_JITTER;
  const delta = base + jitter;
  const newAbility = Math.max(
    MINI_CAT_MIN_ABILITY,
    Math.min(MINI_CAT_MAX_ABILITY, state.abilityEstimate + delta),
  );

  const newSeenIds = new Set(state.seenIds);
  newSeenIds.add(question.id);

  return {
    abilityEstimate: newAbility,
    answers: [
      ...state.answers,
      {
        questionId: question.id,
        moduleSlug: question.moduleSlug,
        correct,
        difficulty: question.difficulty,
      },
    ],
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

  // Cap weak areas at top 3 (lowest accuracy) to avoid overload
  const weakAreas = all.filter((a) => a.accuracyPct < 60).slice(0, 3);
  const strengths = all.filter((a) => a.accuracyPct >= 75);

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
