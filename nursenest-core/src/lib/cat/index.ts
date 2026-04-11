/**
 * NurseNest CAT (Computerized Adaptive Testing) Engine — Public API
 *
 * ──────────────────────────────────────────────────────────────────────────────
 * Quick start:
 *
 *   import { createCatSession, selectNextQuestion, recordAnswer, analyseSession }
 *     from "@/lib/cat";
 *
 *   // 1. Create a session from a question pool and prior history
 *   const state = createCatSession({ questionPool, historicalAnswers });
 *
 *   // 2. Session loop
 *   while (!isSessionComplete(state, config)) {
 *     const { question } = selectNextQuestion(state, config);
 *     if (!question) break;
 *     const correct = await showQuestionToLearner(question);
 *     recordAnswer(state, question, correct);
 *   }
 *
 *   // 3. Analyse results
 *   const analysis = analyseSession({ sessionState: state, allAnswers, lessonCatalog });
 *   // → analysis.weakAreas, analysis.lessonRecommendations, analysis.followUpQuestions
 *
 * ──────────────────────────────────────────────────────────────────────────────
 *
 * Module map:
 *   types.ts               — All TypeScript interfaces and weight constants
 *   readiness-scorer.ts    — 0–100 readiness score with recency + consistency
 *   performance-tracker.ts — Per-dimension accuracy tracking and weak-area detection
 *   cat-engine.ts          — Adaptive question selection and session management
 *   session-analyzer.ts    — Post-session analysis, lesson recs, follow-up sets
 */

// ─── Types (re-export everything consumers need) ──────────────────────────────

export type {
  AnswerRecord,
  CatQuestion,
  CatSessionConfig,
  CatSessionState,
  ClinicalPriority,
  CognitiveLayer,
  DimensionPerformance,
  DispositionTag,
  FollowUpQuestionSet,
  LessonCatalogEntry,
  LessonRecommendation,
  NextQuestionResult,
  PerformanceProfile,
  ReadinessScore,
  RiskLevel,
  SessionAnalysis,
  WeakArea,
} from "./types";

export {
  COGNITIVE_WEIGHTS,
  MAX_ITEM_WEIGHT,
  RISK_WEIGHTS,
} from "./types";

// ─── Readiness Scorer ─────────────────────────────────────────────────────────

export {
  computeReadinessScore,
  emptyReadinessScore,
  l3HighRiskAccuracy,
  normaliseItemWeight,
  readinessBand,
  scoreDelata,
} from "./readiness-scorer";

// ─── Performance Tracker ──────────────────────────────────────────────────────

export {
  applyAnswerToProfile,
  buildPerformanceProfile,
  emptyPerformanceProfile,
  identifyWeakDimensions,
  mergeProfiles,
  MIN_RELIABLE_SAMPLE,
  STRONG_AREA_THRESHOLD,
  WEAK_AREA_THRESHOLD,
  weakestLayer,
  weakestRiskLevel,
  weakestSystem,
} from "./performance-tracker";

export type { WeakDimension } from "./performance-tracker";

// ─── CAT Engine ───────────────────────────────────────────────────────────────

export {
  createCatSession,
  createEmptyCatSession,
  isSessionComplete,
  recordAnswer,
  selectNextQuestion,
} from "./cat-engine";

// ─── Session Analyzer ─────────────────────────────────────────────────────────

export { analyseSession } from "./session-analyzer";

export type { SessionAnalyzerInput } from "./session-analyzer";
