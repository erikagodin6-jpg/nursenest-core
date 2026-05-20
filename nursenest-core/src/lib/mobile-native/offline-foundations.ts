/**
 * Phase 9 — **offline foundations** (types + policy hooks only).
 *
 * Policy: **do not persist full premium lesson bodies** offline without a fresh server proof of entitlement
 * (e.g. signed capability or short-lived content token). Prefer stable **IDs** + sync queue entries that
 * refetch on reconnect.
 */

/** Identifies a flashcard deck slice the user may study offline (IDs only in persisted form). */
export type MobileNativeOfflineFlashcardDeckHandle = {
  readonly pathwayId: string;
  readonly deckId: string;
  /** Schema version for migrations. */
  readonly formatVersion: 1;
};

/**
 * What may appear in a lesson **reader snapshot** cache (explicitly not "full HTML body" by default).
 */
export type MobileNativeLessonReaderSnapshotPolicy =
  | {
      readonly mode: "metadata_only";
      readonly lessonId: string;
      readonly title?: string;
      readonly lastResumeSectionId?: string;
    }
  | {
      readonly mode: "entitled_excerpt";
      readonly lessonId: string;
      /** Server-issued capability id proving fetch was entitled; validate before widening cache. */
      readonly entitlementProofId: string;
      readonly excerptMaxChars: number;
    };

/** One progress mutation to replay when online (minimal PII: prefer opaque item ids). */
export type MobileNativeProgressSyncQueueItem = {
  readonly id: string;
  readonly userIdOpaque?: string;
  readonly surface: "flashcard" | "lesson" | "practice" | "cat" | "question_bank" | "unknown";
  readonly ref: { readonly kind: string; readonly id: string };
  readonly payloadSummary: string;
  readonly clientCreatedAtMs: number;
};

/**
 * **Resumable session** — bookmark for UX only; server authoritative for graded state.
 */
export type MobileNativeResumableSessionToken = {
  readonly surface: "flashcards" | "practice" | "cat" | "lesson_reader";
  readonly sessionKey: string;
  readonly position?: { readonly step: string; readonly ordinal: number };
  readonly updatedAtMs: number;
};

/** When API/DB is degraded, clients should read-only cache and block writes that could fork state. */
export type MobileNativeDegradedModeInteraction = "read_only_cache" | "queue_writes" | "block_all";
