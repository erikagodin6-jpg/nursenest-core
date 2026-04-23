/** Discriminates real empty inventory from “we could not read primary or secondary”. */
export type StudyDataSourceUsed = "primary" | "secondary";

/**
 * Versioned JSON files written by export jobs / publish hooks (same contract as primary DB reads).
 * @see scripts/study-snapshots/export-pathway-lessons-hub-snapshot.mts
 */
export type StudyPublishedSnapshotEnvelope<TPayload> = {
  schema: "nursenest.study_snapshot.v1";
  /** Logical surface: `pathway_lessons_hub` | `flashcards_subscriber_list` | … */
  surface: string;
  /** Monotonic or content-hash version string from the publisher. */
  version: string;
  /** ISO-8601 capture time (used for snapshot_age_ms). */
  capturedAt: string;
  payload: TPayload;
};
