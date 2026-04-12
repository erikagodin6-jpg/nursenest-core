import type { FreemiumSnapshot } from "@/lib/entitlements/freemium";

/** True when the user has no complimentary question grades remaining. */
export function freemiumQuestionsExhausted(snap: FreemiumSnapshot | null | undefined): boolean {
  if (!snap) return true;
  return snap.questionRemaining <= 0;
}

/** True when the user has no complimentary lesson preview rows remaining. */
export function freemiumLessonsExhausted(snap: FreemiumSnapshot | null | undefined): boolean {
  if (!snap) return true;
  return snap.lessonRemaining <= 0;
}

/** Either complimentary track is exhausted — use for cross-surface upsell (non-blocking). */
export function freemiumAnyTrackExhausted(snap: FreemiumSnapshot | null | undefined): boolean {
  return freemiumQuestionsExhausted(snap) || freemiumLessonsExhausted(snap);
}
