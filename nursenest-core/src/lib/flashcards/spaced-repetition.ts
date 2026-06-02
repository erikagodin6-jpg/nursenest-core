/**
 * SM-2–style scheduling with lapse tracking.
 * Quality maps: again < 3 (fail/lapse), hard = 3, good = 4, easy = 5 for EF formula.
 *
 * Lapse: card was previously learned (repetitions > 0) and rated "again".
 * Each lapse increments the lapses counter and shortens the relearn interval.
 */

export type FlashcardRating = "again" | "hard" | "good" | "easy";

function qualityFromRating(rating: FlashcardRating): number {
  switch (rating) {
    case "again":
      return 1;
    case "hard":
      return 3;
    case "good":
      return 4;
    case "easy":
      return 5;
    default:
      return 3;
  }
}

export type Sm2State = {
  easeFactor: number;
  intervalDays: number;
  repetitions: number;
  lapses?: number;
};

export type Sm2Result = {
  easeFactor: number;
  intervalDays: number;
  repetitions: number;
  lapses: number;
  nextReviewAt: Date;
};

/**
 * Compute the next SM-2 schedule.
 *
 * Lapses are incremented when a previously-learned card (repetitions > 0) is
 * rated "again". New cards that fail simply restart without incrementing lapses.
 *
 * @param prev - current SM-2 state for the card
 * @param rating - learner confidence rating
 * @param now - anchor for next review (server `new Date()`)
 */
export function computeNextSchedule(
  prev: Sm2State,
  rating: FlashcardRating,
  now: Date = new Date(),
): Sm2Result {
  const q = qualityFromRating(rating);
  let ef = Math.max(1.3, prev.easeFactor);
  let interval = Math.max(0, prev.intervalDays);
  let reps = Math.max(0, prev.repetitions);
  let lapses = Math.max(0, prev.lapses ?? 0);

  if (q < 3) {
    const wasLearned = reps > 0;
    if (wasLearned) lapses += 1;
    reps = 0;
    // Lapsing cards get a shorter relearn interval than brand-new cards:
    // first lapse → 1 day, subsequent lapses → 1 day (scheduler keeps resetting)
    interval = 1;
    ef = Math.max(1.3, ef - 0.2);
  } else {
    ef = Math.max(1.3, ef + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02)));
    if (reps === 0) {
      reps = 1;
      interval = 1;
    } else if (reps === 1) {
      reps = 2;
      interval = 6;
    } else {
      reps = reps + 1;
      interval = Math.max(1, Math.round(interval * ef));
    }
  }

  const next = new Date(now.getTime());
  next.setUTCDate(next.getUTCDate() + interval);
  return { easeFactor: ef, intervalDays: interval, repetitions: reps, lapses, nextReviewAt: next };
}

export function initialSm2State(): Sm2State {
  return { easeFactor: 2.5, intervalDays: 0, repetitions: 0, lapses: 0 };
}
