/**
 * Session Analyzer
 *
 * After a CAT session completes, this module:
 *
 *  1. Identifies weak areas across all tracked dimensions.
 *  2. Generates prioritised lesson recommendations mapped to those weak areas.
 *  3. Builds a targeted follow-up question set for remediation.
 *  4. Produces a full `SessionAnalysis` summary.
 *
 * Design principles:
 *  - Lesson recommendations address clinical risk gaps first (high-risk weaknesses
 *    before cognitive-layer or system weaknesses).
 *  - Follow-up question sets are balanced: they do not exclusively present hard items,
 *    ensuring the learner rebuilds confidence while reinforcing gaps.
 *  - All outputs are deterministic given the same inputs (no Math.random()).
 */

import {
  buildPerformanceProfile,
  identifyWeakDimensions,
  WEAK_AREA_THRESHOLD,
} from "./performance-tracker";
import {
  computeReadinessScore,
  scoreDelata,
} from "./readiness-scorer";
import type {
  AnswerRecord,
  CatQuestion,
  CatSessionState,
  CognitiveLayer,
  FollowUpQuestionSet,
  LessonCatalogEntry,
  LessonRecommendation,
  PerformanceProfile,
  RiskLevel,
  SessionAnalysis,
  WeakArea,
} from "./types";
import { COGNITIVE_WEIGHTS, RISK_WEIGHTS } from "./types";

// ─── Constants ────────────────────────────────────────────────────────────────

/** Maximum weak areas to surface in analysis (prevents overwhelming the learner). */
const MAX_WEAK_AREAS = 8;

/** Maximum lesson recommendations. */
const MAX_LESSON_RECS = 5;

/**
 * Target follow-up session size.
 * Intentionally shorter than a full session — focused remediation.
 */
const FOLLOW_UP_SESSION_SIZE = 20;

/**
 * Balance ratio for follow-up question difficulty:
 * 50% at learner's current level, 35% harder (to push growth), 15% easier (confidence rebuilding).
 */
const FOLLOW_UP_MIX = { current: 0.50, harder: 0.35, easier: 0.15 };

/** Estimated minutes per question (conservative estimate for UI display). */
const MINUTES_PER_QUESTION = 1.5;

// ─── Human-readable labels ────────────────────────────────────────────────────

const RISK_LABELS: Record<RiskLevel, string> = {
  low: "Low-risk content",
  moderate: "Moderate-risk content",
  high: "High-risk / critical content",
};

const LAYER_LABELS: Record<CognitiveLayer, string> = {
  L1: "Recognition (L1)",
  L2: "Interpretation (L2)",
  L3: "Clinical action (L3)",
};

// ─── Main Analyser ────────────────────────────────────────────────────────────

export interface SessionAnalyzerInput {
  /** The completed session state. */
  sessionState: CatSessionState;
  /** All historical answers INCLUDING this session. */
  allAnswers: AnswerRecord[];
  /** Pre-session readiness score (for delta computation). May be null on first session. */
  baselineScore?: import("./types").ReadinessScore | null;
  /** Question pool used in the session (needed to build follow-up set). */
  questionPool: CatQuestion[];
  /** Lesson catalog for recommendation generation. */
  lessonCatalog: LessonCatalogEntry[];
  /** Reference timestamp in ms. Defaults to Date.now(). */
  now?: number;
}

/**
 * Analyse a completed CAT session and produce actionable insights.
 */
export function analyseSession(input: SessionAnalyzerInput): SessionAnalysis {
  const now = input.now ?? Date.now();
  const { sessionState, allAnswers, baselineScore, questionPool, lessonCatalog } = input;

  // ── 1. Performance profile from full history ──────────────────────────────

  const profile = buildPerformanceProfile(allAnswers, now);

  // ── 2. Readiness score ────────────────────────────────────────────────────

  const readinessScore = computeReadinessScore(allAnswers, now);
  const scoreDelta = scoreDelata(baselineScore, readinessScore);

  // ── 3. Session summary ────────────────────────────────────────────────────

  const sessionAnswers = sessionState.sessionAnswers;
  const totalCorrect = sessionAnswers.filter((a) => a.correct).length;
  const sessionAccuracy =
    sessionAnswers.length > 0 ? totalCorrect / sessionAnswers.length : 0;

  // ── 4. Weak areas ─────────────────────────────────────────────────────────

  const weakDims = identifyWeakDimensions(profile).slice(0, MAX_WEAK_AREAS);
  const weakAreas: WeakArea[] = weakDims.map((wd) => ({
    dimension: wd.dimension,
    key: wd.key,
    label: labelForDimension(wd.dimension, wd.key),
    accuracy: wd.performance.accuracy,
    recentAccuracy: wd.performance.recentAccuracy,
    attempted: wd.performance.attempted,
    remediationPriority: Math.min(1, wd.priority / 3),
  }));

  // ── 5. Lesson recommendations ─────────────────────────────────────────────

  const lessonRecs = generateLessonRecommendations(weakAreas, lessonCatalog, profile);

  // ── 6. Follow-up question set ─────────────────────────────────────────────

  const followUpQuestions = buildFollowUpSet(
    sessionState,
    weakAreas,
    questionPool,
    now,
  );

  return {
    sessionId: sessionState.sessionId,
    analyzedAt: new Date(now).toISOString(),
    summary: {
      totalAnswered: sessionAnswers.length,
      totalCorrect,
      sessionAccuracy: Math.round(sessionAccuracy * 1000) / 1000,
      readinessScore,
      scoreDelta,
    },
    weakAreas,
    lessonRecommendations: lessonRecs,
    followUpQuestions,
    performanceSnapshot: profile,
  };
}

// ─── Lesson Recommendations ───────────────────────────────────────────────────

function generateLessonRecommendations(
  weakAreas: WeakArea[],
  catalog: LessonCatalogEntry[],
  profile: PerformanceProfile,
): LessonRecommendation[] {
  if (weakAreas.length === 0 || catalog.length === 0) return [];

  // Build relevance scores for each lesson
  const lessonScores = new Map<string, { entry: LessonCatalogEntry; score: number; addressing: string[] }>();

  for (const lesson of catalog) {
    let score = 0;
    const addressing: string[] = [];

    for (const area of weakAreas) {
      let match = false;

      if (area.dimension === "system" && lesson.systemTag === area.key) {
        match = true;
      } else if (area.dimension === "risk" && lesson.riskLevel === area.key) {
        match = true;
      } else if (area.dimension === "topic" && lesson.topicSlug === area.key) {
        match = true;
        // Topic match is strongest signal — boost it
        score += area.remediationPriority * 3;
        addressing.push(area.label);
        continue;
      } else if (area.dimension === "layer") {
        // Layer doesn't directly map to lessons; use as a tiebreaker
        score += 0.1;
      }

      if (match) {
        // Risk-level match boosted by the risk weight for that level
        const riskBoost = lesson.riskLevel
          ? RISK_WEIGHTS[lesson.riskLevel as RiskLevel] ?? 1.0
          : 1.0;
        score += area.remediationPriority * riskBoost;
        addressing.push(area.label);
      }
    }

    // Penalise lessons in dimensions where learner is already strong (>80%)
    const systemPerf = profile.bySystem[lesson.systemTag];
    if (systemPerf && systemPerf.recentAccuracy > 0.80 && systemPerf.attempted >= 5) {
      score *= 0.5;
    }

    if (score > 0) {
      const existing = lessonScores.get(lesson.lessonSlug);
      if (!existing || score > existing.score) {
        lessonScores.set(lesson.lessonSlug, { entry: lesson, score, addressing: [...new Set(addressing)] });
      }
    }
  }

  // Sort by score, take top N
  const sorted = [...lessonScores.values()].sort((a, b) => b.score - a.score);

  return sorted.slice(0, MAX_LESSON_RECS).map((item, i) => ({
    lessonSlug: item.entry.lessonSlug,
    lessonTitle: item.entry.lessonTitle,
    topicSlug: item.entry.topicSlug,
    reason: buildRecommendationReason(item.entry, item.addressing),
    rank: i + 1,
    addressesWeakAreas: item.addressing,
  }));
}

function buildRecommendationReason(
  lesson: LessonCatalogEntry,
  addressing: string[],
): string {
  if (addressing.length === 0) return "Suggested to strengthen knowledge breadth.";
  if (addressing.length === 1) return `Addresses your weak area in: ${addressing[0]}.`;
  return `Targets gaps in: ${addressing.slice(0, 2).join(", ")}${addressing.length > 2 ? ", and more" : ""}.`;
}

// ─── Follow-up Question Set ───────────────────────────────────────────────────

function buildFollowUpSet(
  sessionState: CatSessionState,
  weakAreas: WeakArea[],
  questionPool: CatQuestion[],
  now: number,
): FollowUpQuestionSet {
  const answeredIds = new Set(sessionState.answeredIds);
  const currentDifficulty = Math.round(
    (Math.tanh(sessionState.abilityEstimate / 2) + 1) / 2 * 4 + 1,
  );

  // Prioritised filter: prefer questions in weak areas
  const weakSystems = new Set(weakAreas.filter((w) => w.dimension === "system").map((w) => w.key));
  const weakRisks = new Set(weakAreas.filter((w) => w.dimension === "risk").map((w) => w.key) as RiskLevel[]);
  const weakLayers = new Set(weakAreas.filter((w) => w.dimension === "layer").map((w) => w.key) as CognitiveLayer[]);
  const weakTopics = new Set(weakAreas.filter((w) => w.dimension === "topic").map((w) => w.key));

  // Score each question for follow-up relevance
  type ScoredQ = { q: CatQuestion; score: number; bucket: "harder" | "current" | "easier" };
  const scoredCandidates: ScoredQ[] = [];

  for (const q of questionPool) {
    // Skip recently answered — allow some repetition for remediation but not immediately
    if (answeredIds.has(q.id)) continue;

    let score = 0;
    if (weakSystems.has(q.systemTag)) score += 3;
    if (weakRisks.has(q.riskLevel)) score += RISK_WEIGHTS[q.riskLevel] * 2;
    if (weakLayers.has(q.cognitiveLayer)) score += COGNITIVE_WEIGHTS[q.cognitiveLayer];
    if (weakTopics.has(q.topicSlug)) score += 4;

    // Tie-break by deterministic hash
    score += (stringHash(q.id) % 100) / 10000;

    let bucket: ScoredQ["bucket"];
    if (q.difficulty > currentDifficulty) bucket = "harder";
    else if (q.difficulty < currentDifficulty) bucket = "easier";
    else bucket = "current";

    scoredCandidates.push({ q, score, bucket });
  }

  // Sort within each bucket by relevance score
  const harder = scoredCandidates.filter((x) => x.bucket === "harder").sort((a, b) => b.score - a.score);
  const current = scoredCandidates.filter((x) => x.bucket === "current").sort((a, b) => b.score - a.score);
  const easier = scoredCandidates.filter((x) => x.bucket === "easier").sort((a, b) => b.score - a.score);

  const nCurrent = Math.round(FOLLOW_UP_SESSION_SIZE * FOLLOW_UP_MIX.current);
  const nHarder = Math.round(FOLLOW_UP_SESSION_SIZE * FOLLOW_UP_MIX.harder);
  const nEasier = FOLLOW_UP_SESSION_SIZE - nCurrent - nHarder;

  const selected: CatQuestion[] = [
    ...current.slice(0, nCurrent).map((x) => x.q),
    ...harder.slice(0, nHarder).map((x) => x.q),
    ...easier.slice(0, nEasier).map((x) => x.q),
  ];

  // Shuffle the selection so the learner doesn't get all easy then all hard
  const shuffled = stableShuffleByScore(selected, scoredCandidates);

  const setId = `followup-${sessionState.sessionId}-${now.toString(36)}`;

  return {
    setId,
    questions: shuffled.slice(0, FOLLOW_UP_SESSION_SIZE),
    targetingWeakAreas: weakAreas.slice(0, 3),
    estimatedMinutes: Math.round(shuffled.length * MINUTES_PER_QUESTION),
  };
}

// ─── Utility ──────────────────────────────────────────────────────────────────

function labelForDimension(
  dimension: WeakArea["dimension"],
  key: string,
): string {
  if (dimension === "risk") return RISK_LABELS[key as RiskLevel] ?? key;
  if (dimension === "layer") return LAYER_LABELS[key as CognitiveLayer] ?? key;
  if (dimension === "system") return toTitleCase(key.replace(/-/g, " "));
  if (dimension === "topic") return toTitleCase(key.replace(/-/g, " "));
  return key;
}

function toTitleCase(str: string): string {
  return str.replace(/\b\w/g, (c) => c.toUpperCase());
}

/** Deterministic string hash (djb2). */
function stringHash(s: string): number {
  let h = 5381;
  for (let i = 0; i < s.length; i++) {
    h = ((h << 5) + h + s.charCodeAt(i)) >>> 0;
  }
  return h;
}

/**
 * Interleave question buckets so the sequence varies in difficulty rather than
 * presenting all current-level then all harder questions.
 * Ordering is deterministic (seeded by question IDs).
 */
function stableShuffleByScore(
  questions: CatQuestion[],
  scored: Array<{ q: CatQuestion; score: number }>,
): CatQuestion[] {
  const scoreMap = new Map(scored.map((x) => [x.q.id, x.score]));
  return [...questions].sort((a, b) => {
    const sa = scoreMap.get(a.id) ?? 0;
    const sb = scoreMap.get(b.id) ?? 0;
    if (Math.abs(sa - sb) > 1.0) return sb - sa; // big score difference → sort by score
    // Near-equal: use deterministic hash to interleave
    return (stringHash(a.id) % 100) - (stringHash(b.id) % 100);
  });
}

// ─── Re-exports for convenience ───────────────────────────────────────────────

export { computeReadinessScore, buildPerformanceProfile, identifyWeakDimensions };
