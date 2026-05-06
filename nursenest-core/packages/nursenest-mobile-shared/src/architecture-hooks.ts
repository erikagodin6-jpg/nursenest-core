/**
 * Future native capabilities — **interfaces only** (no drivers, no fake notifications).
 * Aligns conceptually with `src/lib/mobile-native/offline-sync-queue.ts` and `push-notifications.ts`.
 */

export type ExamOfflineReviewQueueItemKind = "flashcard_rating" | "practice_patch" | "cat_np_answer";

export type ExamOfflineReviewQueueItem = {
  readonly id: string;
  readonly kind: ExamOfflineReviewQueueItemKind;
  readonly createdAtMs: number;
  /** Small opaque payload — bounded at enqueue time in real implementations. */
  readonly payload: Readonly<Record<string, string>>;
};

export interface ExamOfflineReviewQueueSink {
  enqueue(item: ExamOfflineReviewQueueItem): Promise<void>;
}

export type PushReminderIntent = "due_flashcards" | "streak_at_risk" | "practice_resume";

export interface PushReminderSchedulerPort {
  /** Register server-authorized reminder metadata; implementation may no-op until product enables push. */
  schedule(intent: PushReminderIntent, fireAtMs: number, dedupeKey: string): Promise<void>;
  cancel(dedupeKey: string): Promise<void>;
}

export type RecommendationSurface = "home" | "post_session";

export interface StudyRecommendationPort {
  /** Server-backed suggestions only — return empty when offline or unauthenticated. */
  load(surface: RecommendationSurface): Promise<readonly string[]>;
}
