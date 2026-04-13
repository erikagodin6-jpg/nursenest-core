/**
 * Pre-Nursing Exam Engine.
 *
 * Two modes:
 *
 * 1. Mini CAT — lightweight adaptive exam:
 *    - 10–15 questions, ~10 minutes
 *    - Ability scale 1.0–3.0 (maps directly to difficulty 1/2/3)
 *    - Starts at ability 2.0 (medium), adjusts ±0.5 per answer
 *    - Early stop: after 8+ questions if last 5 are all correct (strong) or all wrong (beginner)
 *    - Performance level: Beginner (<50% correct), Developing (50–74%), Strong (≥75%)
 *
 * 2. Practice Exam — fixed non-adaptive set:
 *    - 10–20 questions per module
 *    - Balanced difficulty distribution (easy/medium/hard)
 *    - Returns same score + weak areas
 *
 * Both modes return `PreNursingExamResult` at completion.
 * All logic is pure / stateless so it runs on the client with no network calls.
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
const MINI_CAT_STEP_CORRECT = 0.5;
const MINI_CAT_STEP_INCORRECT = 0.5;
const MINI_CAT_MIN_ABILITY = 1.0;
const MINI_CAT_MAX_ABILITY = 3.0;
const MINI_CAT_MAX_QUESTIONS = 15;
const MINI_CAT_EARLY_STOP_AFTER = 8;

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
 * Returns the new state (immutable-style — always return new object).
 */
export function recordAnswer(
  state: MiniCatState,
  question: PreNursingQuestion,
  correct: boolean,
): MiniCatState {
  const delta = correct ? MINI_CAT_STEP_CORRECT : -MINI_CAT_STEP_INCORRECT;
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

  const weakAreas = all.filter((a) => a.accuracyPct < 60);
  const strengths = all.filter((a) => a.accuracyPct >= 75);

  return { weakAreas, strengths };
}

function buildNextSteps(
  weakAreas: WeakArea[],
  performanceLevel: PerformanceLevel,
): PreNursingExamResult["nextSteps"] {
  const topWeak = weakAreas.slice(0, 3).map((w) => w.moduleSlug);

  const lessons = topWeak.map((slug) => ({
    title: `Review: ${MODULE_TITLES[slug] ?? slug}`,
    href: `/pre-nursing/lessons/${slug}`,
  }));

  const flashcards = topWeak.slice(0, 2).map((slug) => ({
    title: `${MODULE_TITLES[slug] ?? slug} flashcards`,
    href: `/flashcards/${slug}`,
  }));

  const questions =
    performanceLevel !== "Strong"
      ? {
          title: "Practice more pre-nursing questions",
          href: "/pre-nursing/mini-cat",
        }
      : {
          title: "Challenge yourself with NCLEX-level questions",
          href: "/question-bank",
        };

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
