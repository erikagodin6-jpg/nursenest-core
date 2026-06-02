import type { OfflineContentDomain } from "./types";

/** Prefix for persisted React Query keys (Phase 2 persister). */
export const OFFLINE_QUERY_PREFIX = "nn:rq:v1";

/** Bounded storage buckets — never grow without eviction policy. */
export const OFFLINE_STORAGE_BUCKETS = {
  lessons: "nn:offline:lessons",
  flashcards: "nn:offline:flashcards",
  sessionResume: "nn:offline:session_resume",
} as const;

const MAX_KEYS_PER_BUCKET: Record<keyof typeof OFFLINE_STORAGE_BUCKETS, number> = {
  lessons: 40,
  flashcards: 25,
  sessionResume: 15,
};

export function evictionLimitForBucket(bucket: keyof typeof OFFLINE_STORAGE_BUCKETS): number {
  return MAX_KEYS_PER_BUCKET[bucket];
}

export function storageKeyForLesson(slug: string): string {
  return `${OFFLINE_STORAGE_BUCKETS.lessons}:${slug}`;
}

export function storageKeyForFlashcards(deckId: string): string {
  return `${OFFLINE_STORAGE_BUCKETS.flashcards}:${deckId}`;
}

export function storageKeyForSessionResume(sessionId: string): string {
  return `${OFFLINE_STORAGE_BUCKETS.sessionResume}:${sessionId}`;
}

export function domainForBucket(bucket: keyof typeof OFFLINE_STORAGE_BUCKETS): OfflineContentDomain {
  switch (bucket) {
    case "lessons":
      return "lesson";
    case "flashcards":
      return "flashcard_deck";
    case "sessionResume":
      return "practice_session_resume";
  }
}
