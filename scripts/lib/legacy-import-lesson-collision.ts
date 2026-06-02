/**
 * Secondary lesson title collision detection for legacy JSON/NDJSON imports.
 * Primary dedupe remains pathwayId + slug; this module flags same-pathway title identity with different slugs.
 */
import crypto from "node:crypto";

/** Quarantine / log reason codes (stable strings for reports and collision-rules.json). */
export const LESSON_IMPORT_REASON_CODES = {
  /** Same normalized title hash as another row in this import run, but different slug. */
  LESSON_TITLE_SLUG_COLLISION_IMPORT: "LESSON_TITLE_SLUG_COLLISION_IMPORT",
  /** Same normalized title as an existing DB lesson for this pathway/locale, but different slug. */
  LESSON_TITLE_SLUG_COLLISION_DB: "LESSON_TITLE_SLUG_COLLISION_DB",
  /** Second+ import row reuses pathwayId+slug (duplicate slug rows). */
  LESSON_DUPLICATE_SLUG_IMPORT_ROW: "LESSON_DUPLICATE_SLUG_IMPORT_ROW",
} as const;

export type LessonImportReasonCode =
  (typeof LESSON_IMPORT_REASON_CODES)[keyof typeof LESSON_IMPORT_REASON_CODES];

/**
 * Normalize titles for comparison: case-fold, strip punctuation runs, collapse whitespace.
 * Not for display — collision detection only.
 */
export function normalizeLessonTitleForCollision(raw: string): string {
  return raw
    .normalize("NFKC")
    .toLowerCase()
    .replace(/[^a-z0-9]+/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** Short stable key from normalized title (hex). */
export function lessonTitleCollisionKey(normalized: string): string {
  if (!normalized) return "";
  return crypto.createHash("sha256").update(normalized).digest("hex").slice(0, 16);
}
