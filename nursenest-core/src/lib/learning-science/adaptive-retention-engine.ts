export type ConfidenceLevel = "low" | "medium" | "high";
export type RetentionOutcome = "correct" | "incorrect";
export type ReviewPriority = "low" | "medium" | "high" | "critical";

export type RetentionEvent = {
  learnerId?: string;
  conceptId: string;
  surface: "lesson" | "flashcard" | "practice_question" | "cat" | "simulation" | "ecg";
  outcome: RetentionOutcome;
  confidence: ConfidenceLevel;
  responseTimeMs?: number;
  misconception?: string;
  occurredAt: Date;
};

export type RetentionMemoryState = {
  conceptId: string;
  memoryStrength: number;
  confidenceCalibration: number;
  correctStreak: number;
  incorrectStreak: number;
  overconfidenceMisses: number;
  lastReviewedAt: Date;
  nextReviewAt: Date;
  priority: ReviewPriority;
  recommendedAction: string;
};

const CONFIDENCE_SCORE: Record<ConfidenceLevel, number> = {
  low: 0.35,
  medium: 0.65,
  high: 0.9,
};

function clamp(value: number, min = 0, max = 1): number {
  return Math.min(max, Math.max(min, value));
}

function addHours(date: Date, hours: number): Date {
  const next = new Date(date);
  next.setHours(next.getHours() + hours);
  return next;
}

export function calculateRetentionDelta(event: RetentionEvent): number {
  const confidence = CONFIDENCE_SCORE[event.confidence];
  if (event.outcome === "correct") {
    // Correct + lower confidence still needs reinforcement, so the gain is smaller.
    return confidence >= 0.8 ? 0.16 : confidence >= 0.6 ? 0.11 : 0.07;
  }

  // High-confidence errors are the most dangerous because they indicate a stable misconception.
  return confidence >= 0.8 ? -0.28 : confidence >= 0.6 ? -0.2 : -0.13;
}

export function calculateCalibrationDelta(event: RetentionEvent): number {
  const confidence = CONFIDENCE_SCORE[event.confidence];
  const accuracy = event.outcome === "correct" ? 1 : 0;
  return 1 - Math.abs(accuracy - confidence);
}

export function chooseReviewPriority(input: {
  memoryStrength: number;
  confidenceCalibration: number;
  overconfidenceMisses: number;
  incorrectStreak: number;
}): ReviewPriority {
  if (input.overconfidenceMisses >= 2 || input.incorrectStreak >= 2) return "critical";
  if (input.memoryStrength < 0.45 || input.confidenceCalibration < 0.45) return "high";
  if (input.memoryStrength < 0.7 || input.confidenceCalibration < 0.7) return "medium";
  return "low";
}

export function scheduleNextReview(input: {
  occurredAt: Date;
  memoryStrength: number;
  priority: ReviewPriority;
  outcome: RetentionOutcome;
}): Date {
  if (input.priority === "critical") return addHours(input.occurredAt, 4);
  if (input.priority === "high") return addHours(input.occurredAt, 24);
  if (input.priority === "medium") return addHours(input.occurredAt, input.outcome === "correct" ? 72 : 36);
  return addHours(input.occurredAt, input.memoryStrength > 0.9 ? 336 : 168);
}

export function recommendedRetentionAction(state: Pick<RetentionMemoryState, "priority" | "overconfidenceMisses" | "incorrectStreak" | "memoryStrength">): string {
  if (state.overconfidenceMisses > 0) {
    return "Show misconception repair: ask the learner why their answer was tempting, then contrast it with the correct clue.";
  }
  if (state.incorrectStreak >= 2) {
    return "Return to a short teaching card before more questions; the learner is not ready for pure testing.";
  }
  if (state.memoryStrength < 0.55) {
    return "Schedule retrieval practice with hints withheld until after commitment.";
  }
  if (state.priority === "medium") {
    return "Interleave this concept with two similar look-alikes to strengthen discrimination.";
  }
  return "Use spaced review later; do not over-practice mastered content.";
}

export function updateRetentionMemory(
  previous: RetentionMemoryState | null,
  event: RetentionEvent,
): RetentionMemoryState {
  const baseStrength = previous?.memoryStrength ?? 0.5;
  const delta = calculateRetentionDelta(event);
  const memoryStrength = clamp(baseStrength + delta);
  const calibrationSample = calculateCalibrationDelta(event);
  const confidenceCalibration = previous
    ? clamp(previous.confidenceCalibration * 0.72 + calibrationSample * 0.28)
    : calibrationSample;

  const correctStreak = event.outcome === "correct" ? (previous?.correctStreak ?? 0) + 1 : 0;
  const incorrectStreak = event.outcome === "incorrect" ? (previous?.incorrectStreak ?? 0) + 1 : 0;
  const overconfidenceMisses =
    event.outcome === "incorrect" && event.confidence === "high"
      ? (previous?.overconfidenceMisses ?? 0) + 1
      : previous?.overconfidenceMisses ?? 0;

  const priority = chooseReviewPriority({
    memoryStrength,
    confidenceCalibration,
    overconfidenceMisses,
    incorrectStreak,
  });

  const nextReviewAt = scheduleNextReview({
    occurredAt: event.occurredAt,
    memoryStrength,
    priority,
    outcome: event.outcome,
  });

  const state: RetentionMemoryState = {
    conceptId: event.conceptId,
    memoryStrength,
    confidenceCalibration,
    correctStreak,
    incorrectStreak,
    overconfidenceMisses,
    lastReviewedAt: event.occurredAt,
    nextReviewAt,
    priority,
    recommendedAction: "",
  };

  return {
    ...state,
    recommendedAction: recommendedRetentionAction(state),
  };
}

export function sortConceptsForReview(states: readonly RetentionMemoryState[], now = new Date()): readonly RetentionMemoryState[] {
  const priorityWeight: Record<ReviewPriority, number> = {
    critical: 4,
    high: 3,
    medium: 2,
    low: 1,
  };

  return [...states]
    .filter((state) => state.nextReviewAt <= now || state.priority === "critical")
    .sort((a, b) => {
      const priorityDiff = priorityWeight[b.priority] - priorityWeight[a.priority];
      if (priorityDiff !== 0) return priorityDiff;
      return a.memoryStrength - b.memoryStrength;
    });
}
