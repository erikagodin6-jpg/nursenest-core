/**
 * ECG Learner Mastery State Machine
 *
 * Tracks per-rhythm mastery states across a learner's session and history.
 * Used by the adaptive study queue, remediation engine, and progress UI.
 *
 * State machine:
 *
 *   not_started ──► learning ──► proficient ──► mastered
 *                     │              │
 *                     ▼              ▼
 *                  struggling    needs_review
 *                     │              │
 *                     └──────────────┘
 *                            │
 *                          (remediation)
 *                            │
 *                     ◄──────┘
 *
 * Transition rules:
 *   not_started  → learning       first attempt on this rhythm
 *   learning     → proficient     accuracy ≥ minimumPassScore across ≥ 3 attempts
 *   learning     → struggling     accuracy < 0.40 across ≥ 3 attempts
 *   proficient   → mastered       accuracy ≥ masteryThreshold across ≥ 5 attempts, recency ≤ 7 days
 *   proficient   → needs_review   ≥ 14 days since last correct answer
 *   mastered     → needs_review   ≥ 30 days since last correct answer (spaced repetition)
 *   struggling   → learning       remediation completed; ≥ 1 correct on retry
 *   needs_review → proficient     ≥ 2 correct on review set (accuracy ≥ 0.70)
 *
 * Architecture:
 *   - Pure functions only — the caller owns the EcgMasteryRecord store.
 *   - EcgMasteryRecord is serializable to/from JSON for server-side persistence.
 *   - computeEcgMasteryState() is idempotent for the same input.
 *
 * All thresholds use the per-topic values from ECG_FULL_CURRICULUM where the
 * rhythmTag maps to a curriculum topic; fallback to module defaults otherwise.
 */

import {
  getEcgCurriculumTopic,
  type EcgCurriculumTopic,
} from "@/lib/ecg-module/ecg-curriculum-config";
import { resolveEcgCurriculumUnitIdForTag } from "@/lib/ecg-module/ecg-rhythm-tag-registry";

// ─── Types ─────────────────────────────────────────────────────────────────────

export type EcgMasteryState =
  | "not_started"
  | "learning"
  | "struggling"
  | "proficient"
  | "mastered"
  | "needs_review";

/** Serializable record of a learner's mastery on a single rhythm. */
export type EcgMasteryRecord = {
  rhythmTag: string;
  state: EcgMasteryState;
  /** Total correct answers across all attempts. */
  correctCount: number;
  /** Total attempts (correct + incorrect). */
  totalAttempts: number;
  /** Number of consecutive correct answers in the most recent streak. */
  currentStreak: number;
  /** Number of consecutive incorrect answers in the most recent streak. */
  currentWrongStreak: number;
  /** ISO-8601 datetime of most recent correct answer. */
  lastCorrectAt: string | null;
  /** ISO-8601 datetime of most recent attempt. */
  lastAttemptAt: string | null;
  /** Whether remediation was completed after the last struggling period. */
  remediationCompleted: boolean;
  /** Number of times remediation has been completed for this rhythm. */
  remediationCount: number;
  /** Whether scaffold was used on the most recent correct answer. */
  lastAnsweredWithScaffold: boolean;
};

/** Input snapshot used to compute or transition mastery state. */
export type EcgMasteryInput = {
  rhythmTag: string;
  currentRecord: EcgMasteryRecord;
  /** Whether the most recent answer was correct. */
  isCorrect: boolean;
  /** Whether scaffold was completed before this answer. */
  scaffoldCompleted: boolean;
  /** Current timestamp as ISO-8601. */
  nowIso: string;
};

/** Result of a mastery state computation. */
export type EcgMasteryTransition = {
  previousState: EcgMasteryState;
  nextState: EcgMasteryState;
  transitioned: boolean;
  transitionReason: string;
  updatedRecord: EcgMasteryRecord;
};

// ─── Module-level defaults (used when no curriculum topic maps to the rhythm) ──

const DEFAULT_MIN_PASS_SCORE = 0.75;
const DEFAULT_MASTERY_THRESHOLD = 0.88;
const MIN_ATTEMPTS_TO_ADVANCE = 3;
const MIN_ATTEMPTS_TO_MASTER = 5;
const STRUGGLING_ACCURACY_CEILING = 0.40;
const NEEDS_REVIEW_PROFICIENT_DAYS = 14;
const NEEDS_REVIEW_MASTERED_DAYS = 30;
const REVIEW_RECOVERY_ACCURACY = 0.70;
const REVIEW_RECOVERY_MIN_ATTEMPTS = 2;

// ─── Utilities ─────────────────────────────────────────────────────────────────

function daysSince(isoDate: string | null, nowIso: string): number {
  if (!isoDate) return Infinity;
  const then = new Date(isoDate).getTime();
  const now = new Date(nowIso).getTime();
  return Math.max(0, (now - then) / (1000 * 60 * 60 * 24));
}

function accuracy(record: EcgMasteryRecord): number {
  if (record.totalAttempts === 0) return 0;
  return record.correctCount / record.totalAttempts;
}

function topicForRhythm(rhythmTag: string): EcgCurriculumTopic | undefined {
  const unitId = resolveEcgCurriculumUnitIdForTag(rhythmTag);
  return unitId ? getEcgCurriculumTopic(unitId) : undefined;
}

function minPassScore(rhythmTag: string): number {
  return topicForRhythm(rhythmTag)?.minimumPassScore ?? DEFAULT_MIN_PASS_SCORE;
}

function masteryThreshold(rhythmTag: string): number {
  return topicForRhythm(rhythmTag)?.masteryThreshold ?? DEFAULT_MASTERY_THRESHOLD;
}

// ─── Public API ─────────────────────────────────────────────────────────────────

/**
 * Creates a fresh mastery record for a learner who has never attempted this rhythm.
 */
export function createInitialMasteryRecord(rhythmTag: string): EcgMasteryRecord {
  return {
    rhythmTag,
    state: "not_started",
    correctCount: 0,
    totalAttempts: 0,
    currentStreak: 0,
    currentWrongStreak: 0,
    lastCorrectAt: null,
    lastAttemptAt: null,
    remediationCompleted: false,
    remediationCount: 0,
    lastAnsweredWithScaffold: false,
  };
}

/**
 * Applies a single answer event to the mastery record and computes the next state.
 * Returns the full transition including the updated record.
 *
 * This is the primary state-transition function. The caller persists `updatedRecord`.
 */
export function applyEcgAnswerToMastery(input: EcgMasteryInput): EcgMasteryTransition {
  const { currentRecord, isCorrect, scaffoldCompleted, nowIso } = input;
  const prev = currentRecord.state;

  const updated: EcgMasteryRecord = {
    ...currentRecord,
    totalAttempts: currentRecord.totalAttempts + 1,
    correctCount: currentRecord.correctCount + (isCorrect ? 1 : 0),
    currentStreak: isCorrect ? currentRecord.currentStreak + 1 : 0,
    currentWrongStreak: isCorrect ? 0 : currentRecord.currentWrongStreak + 1,
    lastAttemptAt: nowIso,
    lastCorrectAt: isCorrect ? nowIso : currentRecord.lastCorrectAt,
    lastAnsweredWithScaffold: scaffoldCompleted,
  };

  const acc = accuracy(updated);
  const passScore = minPassScore(input.rhythmTag);
  const masterScore = masteryThreshold(input.rhythmTag);

  let next: EcgMasteryState = prev;
  let reason = "no change";

  switch (prev) {
    case "not_started":
      next = "learning";
      reason = "first attempt";
      break;

    case "learning":
      if (updated.totalAttempts >= MIN_ATTEMPTS_TO_ADVANCE && acc < STRUGGLING_ACCURACY_CEILING) {
        next = "struggling";
        reason = `accuracy ${(acc * 100).toFixed(0)}% < ${(STRUGGLING_ACCURACY_CEILING * 100).toFixed(0)}% threshold across ${updated.totalAttempts} attempts`;
      } else if (updated.totalAttempts >= MIN_ATTEMPTS_TO_ADVANCE && acc >= passScore) {
        next = "proficient";
        reason = `accuracy ${(acc * 100).toFixed(0)}% ≥ pass score ${(passScore * 100).toFixed(0)}% across ${updated.totalAttempts} attempts`;
      }
      break;

    case "struggling":
      if (isCorrect && updated.remediationCompleted) {
        next = "learning";
        reason = "remediation completed + correct answer on retry";
      } else if (isCorrect && updated.currentStreak >= 2) {
        next = "learning";
        reason = `${updated.currentStreak} consecutive correct answers after struggling`;
      }
      break;

    case "proficient": {
      const daysSinceCorrect = daysSince(updated.lastCorrectAt, nowIso);
      if (daysSinceCorrect > NEEDS_REVIEW_PROFICIENT_DAYS) {
        next = "needs_review";
        reason = `${Math.round(daysSinceCorrect)} days since last correct answer (threshold: ${NEEDS_REVIEW_PROFICIENT_DAYS})`;
      } else if (updated.totalAttempts >= MIN_ATTEMPTS_TO_MASTER && acc >= masterScore) {
        next = "mastered";
        reason = `accuracy ${(acc * 100).toFixed(0)}% ≥ mastery threshold ${(masterScore * 100).toFixed(0)}% across ${updated.totalAttempts} attempts`;
      }
      break;
    }

    case "mastered": {
      const daysSinceCorrect = daysSince(updated.lastCorrectAt, nowIso);
      if (daysSinceCorrect > NEEDS_REVIEW_MASTERED_DAYS) {
        next = "needs_review";
        reason = `${Math.round(daysSinceCorrect)} days since last correct answer (spaced repetition: ${NEEDS_REVIEW_MASTERED_DAYS})`;
      }
      break;
    }

    case "needs_review": {
      // Count attempts since the needs_review transition was triggered.
      // Approximation: use currentStreak as a proxy for recent performance.
      if (
        updated.currentStreak >= REVIEW_RECOVERY_MIN_ATTEMPTS &&
        acc >= REVIEW_RECOVERY_ACCURACY
      ) {
        next = "proficient";
        reason = `${updated.currentStreak} correct in a row with accuracy ${(acc * 100).toFixed(0)}% during review`;
      }
      break;
    }
  }

  return {
    previousState: prev,
    nextState: next,
    transitioned: next !== prev,
    transitionReason: reason,
    updatedRecord: { ...updated, state: next },
  };
}

/**
 * Marks remediation as completed for a mastery record.
 * Triggers a struggling → learning transition if conditions are met.
 */
export function markEcgRemediationCompleted(
  record: EcgMasteryRecord,
): EcgMasteryRecord {
  const updated: EcgMasteryRecord = {
    ...record,
    remediationCompleted: true,
    remediationCount: record.remediationCount + 1,
  };
  if (record.state === "struggling") {
    return { ...updated, state: "learning" };
  }
  return updated;
}

/**
 * Computes mastery state purely from aggregate stats, without applying an event.
 * Used for batch migration of existing learner data.
 */
export function computeEcgMasteryState(
  rhythmTag: string,
  correctCount: number,
  totalAttempts: number,
  lastCorrectAt: string | null,
  nowIso: string,
): EcgMasteryState {
  if (totalAttempts === 0) return "not_started";

  const acc = totalAttempts > 0 ? correctCount / totalAttempts : 0;
  const passScore = minPassScore(rhythmTag);
  const masterScore = masteryThreshold(rhythmTag);
  const daysSinceCorrect = daysSince(lastCorrectAt, nowIso);

  if (totalAttempts < MIN_ATTEMPTS_TO_ADVANCE) return "learning";

  if (acc < STRUGGLING_ACCURACY_CEILING) {
    return daysSinceCorrect > 7 ? "needs_review" : "struggling";
  }

  if (acc >= masterScore && totalAttempts >= MIN_ATTEMPTS_TO_MASTER) {
    return daysSinceCorrect > NEEDS_REVIEW_MASTERED_DAYS ? "needs_review" : "mastered";
  }

  if (acc >= passScore) {
    return daysSinceCorrect > NEEDS_REVIEW_PROFICIENT_DAYS ? "needs_review" : "proficient";
  }

  return "learning";
}

// ─── Display helpers ──────────────────────────────────────────────────────────

const MASTERY_STATE_LABELS: Record<EcgMasteryState, string> = {
  not_started:   "Not started",
  learning:      "Learning",
  struggling:    "Needs practice",
  proficient:    "Proficient",
  mastered:      "Mastered",
  needs_review:  "Review needed",
};

const MASTERY_STATE_DESCRIPTIONS: Record<EcgMasteryState, string> = {
  not_started:   "You haven't attempted this rhythm yet.",
  learning:      "You're building familiarity. Keep going.",
  struggling:    "You've missed this a few times. Let's review the key concepts.",
  proficient:    "You're reliably identifying this rhythm. Keep it fresh.",
  mastered:      "You consistently identify this rhythm correctly.",
  needs_review:  "It's been a while — a quick review will sharpen your recall.",
};

export function getMasteryStateLabel(state: EcgMasteryState): string {
  return MASTERY_STATE_LABELS[state];
}

export function getMasteryStateDescription(state: EcgMasteryState): string {
  return MASTERY_STATE_DESCRIPTIONS[state];
}

/**
 * Returns a color token (Tailwind class suffix) for the mastery state badge.
 * Used for consistent progress-indicator coloring across the UI.
 */
export function getMasteryStateColor(
  state: EcgMasteryState,
): "slate" | "blue" | "amber" | "teal" | "emerald" | "violet" {
  const map: Record<EcgMasteryState, "slate" | "blue" | "amber" | "teal" | "emerald" | "violet"> =
    {
      not_started:  "slate",
      learning:     "blue",
      struggling:   "amber",
      proficient:   "teal",
      mastered:     "emerald",
      needs_review: "violet",
    };
  return map[state];
}

/**
 * Priority weight for adaptive queue ordering.
 * Higher = appears sooner in the adaptive study sequence.
 */
export function getMasteryQueueWeight(state: EcgMasteryState): number {
  const weights: Record<EcgMasteryState, number> = {
    struggling:   10,
    needs_review:  8,
    learning:      6,
    not_started:   4,
    proficient:    2,
    mastered:      1,
  };
  return weights[state];
}

/**
 * Returns true when the learner's mastery state suggests they would benefit from
 * seeing remediation recommendations after an incorrect answer.
 */
export function shouldSurfaceRemediation(record: EcgMasteryRecord): boolean {
  return (
    record.state === "struggling" ||
    record.currentWrongStreak >= 2 ||
    (record.state === "learning" && record.totalAttempts >= 3 && accuracy(record) < 0.5)
  );
}
