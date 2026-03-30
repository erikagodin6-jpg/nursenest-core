/**
 * Lightweight SM-2–style scheduling (interval + ease factor + repetition count).
 * Quality maps: again &lt; 3 (fail), hard = 3, good = 4, easy = 5 for EF formula.
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
};

export type Sm2Result = Sm2State & { nextReviewAt: Date };

/**
 * @param now - anchor for next review (usually server `new Date()`).
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

  if (q < 3) {
    reps = 0;
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
  return { easeFactor: ef, intervalDays: interval, repetitions: reps, nextReviewAt: next };
}

export function initialSm2State(): Sm2State {
  return { easeFactor: 2.5, intervalDays: 0, repetitions: 0 };
}
