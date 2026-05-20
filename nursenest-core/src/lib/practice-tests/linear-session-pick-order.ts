import { shuffleSeeded } from "@/lib/practice-tests/session-seeded-random";

export const PRACTICE_TEST_MIN_Q = 5;
export const PRACTICE_TEST_MAX_Q = 100;

/**
 * Deterministic shuffle + truncate for linear practice (mirrors `pickPracticeQuestionIds` after recent filtering).
 * Server-free: unit tests import this instead of `pick-question-ids.ts` (DB / server-only graph).
 */
export function linearSessionPickOrder(
  poolIds: readonly string[],
  questionCount: number,
  sessionPickSalt?: string | null,
): string[] {
  const n = Math.min(PRACTICE_TEST_MAX_Q, Math.max(PRACTICE_TEST_MIN_Q, Math.floor(questionCount)));
  if (poolIds.length === 0) return [];
  const salt = sessionPickSalt?.trim();
  const ordered =
    salt && salt.length >= 8 ? shuffleSeeded([...poolIds], `${salt}:linear-pool`) : shuffle([...poolIds]);
  return ordered.slice(0, Math.min(n, ordered.length));
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j]!, a[i]!];
  }
  return a;
}
