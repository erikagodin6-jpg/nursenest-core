export interface PrescribingMemoryCard {
  id: string;
  topic: string;
  prompt: string;
  answer: string;
  easeFactor: number;
  intervalDays: number;
  repetitions: number;
  nextReviewIso: string;
}

export interface PrescribingReviewResult {
  quality: 0 | 1 | 2 | 3 | 4 | 5;
  reviewedAtIso: string;
}

export function updateSpacedRepetitionCard(
  card: PrescribingMemoryCard,
  result: PrescribingReviewResult
): PrescribingMemoryCard {
  const nextEaseFactor = Math.max(
    1.3,
    card.easeFactor + (0.1 - (5 - result.quality) * 0.08)
  );

  const nextRepetitions =
    result.quality >= 3 ? card.repetitions + 1 : 0;

  const nextIntervalDays =
    nextRepetitions <= 1
      ? 1
      : Math.round(card.intervalDays * nextEaseFactor);

  const nextReviewDate = new Date();
  nextReviewDate.setDate(
    nextReviewDate.getDate() + nextIntervalDays
  );

  return {
    ...card,
    easeFactor: Number(nextEaseFactor.toFixed(2)),
    repetitions: nextRepetitions,
    intervalDays: nextIntervalDays,
    nextReviewIso: nextReviewDate.toISOString()
  };
}
