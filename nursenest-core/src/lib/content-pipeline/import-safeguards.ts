/**
 * Operational limits for content imports — tune per environment if needed.
 * Keep validation chunks small enough to avoid GC pressure; DB chunks small enough to avoid long locks.
 *
 * @see docs/OPERATOR_DATA_IMPORT_AND_BUILD.md — build vs import separation and CI guardrails.
 */

/** Max logical lines/records per import run (JSONL rows or array items). */
export const IMPORT_BATCH_MAX_LINES = 50_000;

/** Validate this many records before yielding / logging progress in a long loop. */
export const IMPORT_VALIDATE_CHUNK = 200;

/** Target rows per Prisma transaction or createMany batch (implementations should stay ≤ this). */
export const IMPORT_DB_UPSERT_CHUNK = 100;

/** Max OR branches per stem-hash existence query (legacy TS import scripts). */
export const IMPORT_SCOPED_KEY_OR_CHUNK = 60;

/** Flashcard upserts per transaction (legacy TS import). */
export const IMPORT_FLASHCARD_TX_BATCH = 40;

/** Reject absurdly large text fields before hitting DB (characters, not bytes). */
export const IMPORT_MAX_STEM_CHARS = 32_000;
export const IMPORT_MAX_RATIONALE_CHARS = 64_000;
