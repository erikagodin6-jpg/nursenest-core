/**
 * Offline cache domain identifiers (RN/RPN/NP study surfaces).
 * Keys are namespaced to avoid collisions with future product areas.
 */
export type OfflineContentDomain = "lesson" | "flashcard_deck" | "practice_session_resume";

export type OfflineRecordMeta = {
  domain: OfflineContentDomain;
  /** Stable id within domain (e.g. lesson slug, deck id). */
  recordKey: string;
  /** ISO timestamp when cached. */
  cachedAt: string;
  /** Optional content version / etag for reconciliation. */
  contentVersion?: string;
};

export type OfflineEnvelope<T> = {
  meta: OfflineRecordMeta;
  payload: T;
};
