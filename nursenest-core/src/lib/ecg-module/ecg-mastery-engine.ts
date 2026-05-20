/**
 * ECG Mastery Engine — pure-function learner state computation.
 *
 * This module is the single source of truth for:
 *   - Mastery state transitions per rhythm/topic
 *   - Per-domain mastery score computation
 *   - Spaced-repetition scheduling
 *   - Clinical readiness score generation
 *   - Competency decay modeling
 *
 * Architecture constraints:
 *   - Pure functions only — no I/O, no side effects, no database calls.
 *   - The caller (API route, server action) owns state persistence.
 *   - All inputs are plain serializable data (no class instances).
 *   - Deterministic given the same inputs — enables server-side precomputation.
 *
 * State persistence contract:
 *   The engine computes what the state SHOULD be. The API layer persists it.
 *   Suggested storage: Prisma model `EcgLearnerMastery` with columns:
 *     userId, rhythmTag, topicId, domainId, state, accuracyRate, attemptCount,
 *     lastAttemptAt, lastCorrectAt, nextReviewAt, scaffoldDependenceRate,
 *     intervalMeasurementAccuracy
 */

import type { EcgCompetencyDomainId } from "@/lib/ecg-module/ecg-competency-domains";
import {
  ECG_COMPETENCY_DOMAINS,
  computeEcgOverallReadinessScore,
  isEcgAclsReady,
  isEcgNclexReady,
  getWeakEcgDomains,
} from "@/lib/ecg-module/ecg-competency-domains";

// ─── Mastery state ─────────────────────────────────────────────────────────────

/**
 * Mastery state machine for a single rhythm or curriculum topic.
 *
 * Transitions:
 *   not_started → learning         (first attempt)
 *   learning → struggling          (accuracy < 50% after ≥3 attempts)
 *   learning → proficient          (accuracy ≥ 75% over ≥5 attempts)
 *   struggling → learning          (after completing targeted remediation)
 *   proficient → mastered          (accuracy ≥ 90% over ≥8 attempts, no recent miss)
 *   mastered → needs_review        (decay: no correct attempt in > stalePeriodDays)
 *   needs_review → proficient      (one correct attempt after resurfacing)
 *   any state → struggling         (3 consecutive incorrect answers)
 */
export type EcgMasteryState =
  | "not_started"
  | "learning"
  | "struggling"
  | "proficient"
  | "mastered"
  | "needs_review";

/** Serializable snapshot of a learner's mastery for one rhythm or topic. */
export type EcgTopicMasteryRecord = {
  topicId: string;           // curriculum topic ID or rhythmTag
  state: EcgMasteryState;
  /** Running accuracy rate [0–1] over all attempts. */
  accuracyRate: number;
  /** Total number of attempts. */
  attemptCount: number;
  /** Number of consecutive correct answers (resets on wrong answer). */
  consecutiveCorrect: number;
  /** Number of consecutive incorrect answers (resets on correct answer). */
  consecutiveIncorrect: number;
  /** ISO datetime of most recent attempt. */
  lastAttemptAt: string;
  /** ISO datetime of most recent CORRECT attempt. null if never correct. */
  lastCorrectAt: string | null;
  /** ISO datetime of next scheduled review (for spaced repetition). null = not scheduled. */
  nextReviewAt: string | null;
  /**
   * Proportion of attempts where the learner completed the scaffold vs. skipped [0–1].
   * High scaffold dependence + high accuracy = proficiency with scaffolding only.
   * Low scaffold use + high accuracy = true independent competency.
   */
  scaffoldDependenceRate: number;
  /**
   * Accuracy of interval measurements during scaffold [0–1].
   * null = no scaffold measurement data available.
   */
  intervalMeasurementAccuracy: number | null;
};

/** Aggregated learner mastery across all domains. */
export type EcgLearnerMasteryProfile = {
  userId: string;
  /** Per-topic mastery records. */
  topics: EcgTopicMasteryRecord[];
  /** Per-domain computed scores [0–1]. */
  domainScores: Partial<Record<EcgCompetencyDomainId, number>>;
  /** Overall ECG readiness score [0–1]. */
  overallReadinessScore: number;
  /** True when all ACLS-required domains are at proficiency threshold. */
  isAclsReady: boolean;
  /** True when all NCLEX-required domains are at proficiency threshold. */
  isNclexReady: boolean;
  /** ISO datetime of profile computation. */
  computedAt: string;
};

// ─── State transition parameters ──────────────────────────────────────────────

const MASTERY_PARAMS = {
  /** Minimum attempts before struggling/proficient transitions are allowed. */
  minAttemptsForTransition: 3,
  /** Minimum attempts for proficient → mastered transition. */
  minAttemptsForMastery: 8,
  /** Accuracy threshold for proficient state. */
  proficientThreshold: 0.75,
  /** Accuracy threshold for mastered state. */
  masteredThreshold: 0.90,
  /** Accuracy threshold below which → struggling. */
  strugglingThreshold: 0.50,
  /** Consecutive correct answers required to confirm proficient from struggling. */
  consecutiveCorrectForRecovery: 3,
  /** Consecutive incorrect answers that force → struggling regardless of overall accuracy. */
  consecutiveIncorrectForStruggling: 3,
  /** Days without a correct answer before mastered → needs_review. */
  masteryDecayDays: 21,
  /** Days without a correct answer before proficient → needs_review. */
  proficiencyDecayDays: 14,
} as const;

// ─── State transition logic ────────────────────────────────────────────────────

type AnswerEvent = {
  isCorrect: boolean;
  scaffoldCompleted: boolean;
  scaffoldSkipped: boolean;
  /** The learner's rate measurement if applicable [bpm], null if not measured. */
  measuredRateBpm: number | null;
  /** The correct rate for the question [bpm], null if not applicable. */
  correctRateBpm: number | null;
  attemptedAt: string;
};

/**
 * Computes the next mastery record after a single answer event.
 * Pure function — returns a new record, does not mutate input.
 */
export function applyEcgAnswerEvent(
  current: EcgTopicMasteryRecord,
  event: AnswerEvent,
): EcgTopicMasteryRecord {
  const newAttemptCount = current.attemptCount + 1;
  const newConsecutiveCorrect = event.isCorrect ? current.consecutiveCorrect + 1 : 0;
  const newConsecutiveIncorrect = event.isCorrect ? 0 : current.consecutiveIncorrect + 1;

  // Running accuracy (Bayesian-smoothed: weight recent answers more)
  const decayFactor = 0.85;
  const smoothedAccuracy =
    current.attemptCount === 0
      ? (event.isCorrect ? 1 : 0)
      : current.accuracyRate * decayFactor + (event.isCorrect ? 1 : 0) * (1 - decayFactor);

  // Scaffold dependence rate (exponential moving average)
  const usedScaffold = event.scaffoldCompleted && !event.scaffoldSkipped ? 1 : 0;
  const newScaffoldDependenceRate =
    current.attemptCount === 0
      ? usedScaffold
      : current.scaffoldDependenceRate * 0.8 + usedScaffold * 0.2;

  // Interval measurement accuracy
  let newIntervalMeasurementAccuracy = current.intervalMeasurementAccuracy;
  if (event.measuredRateBpm !== null && event.correctRateBpm !== null && event.correctRateBpm > 0) {
    const measurementAccuracy = Math.max(
      0,
      1 - Math.abs(event.measuredRateBpm - event.correctRateBpm) / event.correctRateBpm,
    );
    newIntervalMeasurementAccuracy =
      newIntervalMeasurementAccuracy === null
        ? measurementAccuracy
        : newIntervalMeasurementAccuracy * 0.8 + measurementAccuracy * 0.2;
  }

  const nextState = computeNextMasteryState(current.state, {
    attemptCount: newAttemptCount,
    accuracyRate: smoothedAccuracy,
    consecutiveCorrect: newConsecutiveCorrect,
    consecutiveIncorrect: newConsecutiveIncorrect,
    lastCorrectAt: event.isCorrect ? event.attemptedAt : current.lastCorrectAt,
  });

  return {
    ...current,
    state: nextState,
    accuracyRate: smoothedAccuracy,
    attemptCount: newAttemptCount,
    consecutiveCorrect: newConsecutiveCorrect,
    consecutiveIncorrect: newConsecutiveIncorrect,
    lastAttemptAt: event.attemptedAt,
    lastCorrectAt: event.isCorrect ? event.attemptedAt : current.lastCorrectAt,
    nextReviewAt: computeNextReviewAt(nextState, event.attemptedAt),
    scaffoldDependenceRate: newScaffoldDependenceRate,
    intervalMeasurementAccuracy: newIntervalMeasurementAccuracy,
  };
}

function computeNextMasteryState(
  current: EcgMasteryState,
  data: {
    attemptCount: number;
    accuracyRate: number;
    consecutiveCorrect: number;
    consecutiveIncorrect: number;
    lastCorrectAt: string | null;
  },
): EcgMasteryState {
  const { attemptCount, accuracyRate, consecutiveCorrect, consecutiveIncorrect } = data;

  // Consecutive incorrect always forces struggling (safety: prevents proficient learner
  // from ignoring a sudden slump on ACLS-critical rhythms)
  if (
    consecutiveIncorrect >= MASTERY_PARAMS.consecutiveIncorrectForStruggling &&
    current !== "not_started"
  ) {
    return "struggling";
  }

  if (current === "not_started") {
    return "learning";
  }

  if (current === "learning" || current === "needs_review") {
    if (
      attemptCount >= MASTERY_PARAMS.minAttemptsForTransition &&
      accuracyRate < MASTERY_PARAMS.strugglingThreshold
    ) {
      return "struggling";
    }
    if (
      attemptCount >= MASTERY_PARAMS.minAttemptsForTransition &&
      accuracyRate >= MASTERY_PARAMS.proficientThreshold
    ) {
      return "proficient";
    }
    return "learning";
  }

  if (current === "struggling") {
    // Recovery from struggling requires demonstrated consecutive correct answers
    if (consecutiveCorrect >= MASTERY_PARAMS.consecutiveCorrectForRecovery) {
      return "learning";
    }
    return "struggling";
  }

  if (current === "proficient") {
    if (
      attemptCount >= MASTERY_PARAMS.minAttemptsForMastery &&
      accuracyRate >= MASTERY_PARAMS.masteredThreshold &&
      consecutiveIncorrect === 0
    ) {
      return "mastered";
    }
    if (accuracyRate < MASTERY_PARAMS.strugglingThreshold) {
      return "struggling";
    }
    return "proficient";
  }

  // mastered stays mastered (decay is handled separately via computeMasteryDecay)
  return current;
}

/**
 * Applies time-based decay to a mastery record.
 * Call periodically (e.g. on session start) to detect stale mastery.
 */
export function computeEcgMasteryDecay(
  record: EcgTopicMasteryRecord,
  referenceDate: Date = new Date(),
): EcgTopicMasteryRecord {
  if (record.state !== "mastered" && record.state !== "proficient") return record;
  if (!record.lastCorrectAt) return { ...record, state: "needs_review" };

  const daysSinceCorrect =
    (referenceDate.getTime() - new Date(record.lastCorrectAt).getTime()) / (1000 * 60 * 60 * 24);

  const decayThreshold =
    record.state === "mastered"
      ? MASTERY_PARAMS.masteryDecayDays
      : MASTERY_PARAMS.proficiencyDecayDays;

  if (daysSinceCorrect > decayThreshold) {
    return { ...record, state: "needs_review", nextReviewAt: referenceDate.toISOString() };
  }
  return record;
}

function computeNextReviewAt(
  state: EcgMasteryState,
  fromDate: string,
): string | null {
  const base = new Date(fromDate);
  switch (state) {
    case "struggling":
      // Resurface within 1 day — most urgent
      base.setDate(base.getDate() + 1);
      return base.toISOString();
    case "learning":
      // 3-day interval
      base.setDate(base.getDate() + 3);
      return base.toISOString();
    case "needs_review":
      // Immediate
      return base.toISOString();
    case "proficient":
      // 7-day interval
      base.setDate(base.getDate() + 7);
      return base.toISOString();
    case "mastered":
      // 21-day interval
      base.setDate(base.getDate() + 21);
      return base.toISOString();
    default:
      return null;
  }
}

// ─── Initial record factory ────────────────────────────────────────────────────

export function createInitialEcgMasteryRecord(topicId: string): EcgTopicMasteryRecord {
  return {
    topicId,
    state: "not_started",
    accuracyRate: 0,
    attemptCount: 0,
    consecutiveCorrect: 0,
    consecutiveIncorrect: 0,
    lastAttemptAt: new Date(0).toISOString(),
    lastCorrectAt: null,
    nextReviewAt: null,
    scaffoldDependenceRate: 0,
    intervalMeasurementAccuracy: null,
  };
}

// ─── Profile computation ──────────────────────────────────────────────────────

/**
 * Computes a full learner mastery profile from raw topic records.
 * Aggregates per-topic scores into domain scores, then into the overall score.
 */
export function computeEcgLearnerProfile(
  userId: string,
  records: EcgTopicMasteryRecord[],
): EcgLearnerMasteryProfile {
  const recordMap = new Map(records.map((r) => [r.topicId, r]));

  // Compute per-domain scores
  const domainScores: Partial<Record<EcgCompetencyDomainId, number>> = {};
  for (const domain of ECG_COMPETENCY_DOMAINS) {
    const topicScores = domain.topicIds
      .map((id) => recordMap.get(id)?.accuracyRate ?? 0);
    if (topicScores.length > 0) {
      domainScores[domain.id] = topicScores.reduce((s, v) => s + v, 0) / topicScores.length;
    }
  }

  const overallReadinessScore = computeEcgOverallReadinessScore(domainScores);

  return {
    userId,
    topics: records,
    domainScores,
    overallReadinessScore,
    isAclsReady: isEcgAclsReady(domainScores),
    isNclexReady: isEcgNclexReady(domainScores),
    computedAt: new Date().toISOString(),
  };
}

// ─── Adaptive queue scheduling ─────────────────────────────────────────────────

/**
 * Returns the ordered list of topics to prioritize in the next study session.
 *
 * Scheduling strategy:
 *   1. Due reviews (nextReviewAt ≤ now)
 *   2. Struggling topics — highest remediation priority first
 *   3. Weakest domain topics — fills weakest domain first
 *   4. Not-started topics — in curriculum order
 *
 * @param records All mastery records for this learner
 * @param sessionCount Maximum number of topics to return (default 5)
 */
export function scheduleEcgAdaptiveSession(
  records: EcgTopicMasteryRecord[],
  domainScores: Partial<Record<EcgCompetencyDomainId, number>>,
  sessionCount = 5,
): EcgTopicMasteryRecord[] {
  const now = new Date();
  const queue: EcgTopicMasteryRecord[] = [];
  const selected = new Set<string>();

  function push(r: EcgTopicMasteryRecord) {
    if (!selected.has(r.topicId) && queue.length < sessionCount) {
      queue.push(r);
      selected.add(r.topicId);
    }
  }

  // 1. Due reviews
  for (const r of records) {
    if (r.nextReviewAt && new Date(r.nextReviewAt) <= now) push(r);
  }

  // 2. Struggling
  for (const r of records.filter((r) => r.state === "struggling")) {
    push(r);
  }

  // 3. Weakest domain topics
  const weakDomains = getWeakEcgDomains(domainScores);
  for (const domain of weakDomains) {
    for (const topicId of domain.topicIds) {
      const r = records.find((r) => r.topicId === topicId);
      if (r) push(r);
    }
  }

  // 4. Learning topics not yet pushed
  for (const r of records.filter((r) => r.state === "learning")) {
    push(r);
  }

  return queue;
}

// ─── Clinical readiness scoring ────────────────────────────────────────────────

export type EcgClinicalReadinessReport = {
  /** Overall ECG readiness score [0–100]. */
  overallScore: number;
  /** Readiness for ACLS-provider recertification. */
  aclsReadiness: { ready: boolean; score: number; weakDomains: string[] };
  /** Readiness for NCLEX ECG questions. */
  nclexReadiness: { ready: boolean; score: number; weakDomains: string[] };
  /** Telemetry confidence score [0–100]. */
  telemetryConfidence: number;
  /** Interpretation consistency: scaffold measurement accuracy [0–100]. */
  interpretationConsistency: number;
  /** Overall differential accuracy [0–100]. */
  differentialAccuracy: number;
};

/**
 * Produces the learner-facing clinical readiness report.
 * Scores are [0–100] for UI presentation.
 */
export function computeEcgClinicalReadinessReport(
  profile: EcgLearnerMasteryProfile,
): EcgClinicalReadinessReport {
  const domainScores = profile.domainScores;

  const aclsDomains = ECG_COMPETENCY_DOMAINS.filter((d) => d.requiredForAcls);
  const aclsScore =
    aclsDomains.reduce((s, d) => s + (domainScores[d.id] ?? 0), 0) / aclsDomains.length;
  const aclsWeak = aclsDomains
    .filter((d) => (domainScores[d.id] ?? 0) < d.proficiencyThreshold)
    .map((d) => d.label);

  const nclexDomains = ECG_COMPETENCY_DOMAINS.filter((d) => d.requiredForNclex);
  const nclexScore =
    nclexDomains.reduce((s, d) => s + (domainScores[d.id] ?? 0), 0) / nclexDomains.length;
  const nclexWeak = nclexDomains
    .filter((d) => (domainScores[d.id] ?? 0) < d.proficiencyThreshold)
    .map((d) => d.label);

  const telemetryScore = (domainScores["telemetry_interpretation"] ?? 0) * 100;

  // Interpretation consistency = average interval measurement accuracy across topics
  const measurementScores = profile.topics
    .map((t) => t.intervalMeasurementAccuracy)
    .filter((v): v is number => v !== null);
  const interpretationConsistency =
    measurementScores.length > 0
      ? (measurementScores.reduce((s, v) => s + v, 0) / measurementScores.length) * 100
      : 0;

  // Differential accuracy = accuracy on topics with differentials required
  const differentialTopics = profile.topics.filter((t) => t.attemptCount >= 3);
  const differentialAccuracy =
    differentialTopics.length > 0
      ? (differentialTopics.reduce((s, t) => s + t.accuracyRate, 0) / differentialTopics.length) * 100
      : 0;

  return {
    overallScore: Math.round(profile.overallReadinessScore * 100),
    aclsReadiness: {
      ready: profile.isAclsReady,
      score: Math.round(aclsScore * 100),
      weakDomains: aclsWeak,
    },
    nclexReadiness: {
      ready: profile.isNclexReady,
      score: Math.round(nclexScore * 100),
      weakDomains: nclexWeak,
    },
    telemetryConfidence: Math.round(telemetryScore),
    interpretationConsistency: Math.round(interpretationConsistency),
    differentialAccuracy: Math.round(differentialAccuracy),
  };
}
