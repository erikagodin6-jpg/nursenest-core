/**
 * Deterministic hashing for content deduplication.
 *
 * - `lessonDedupeKey` — matches PathwayLesson @@unique([pathwayId, slug, locale])
 * - `questionStemHash` — matches ExamQuestion.stemHash (consistent with
 *   src/lib/content/stem-hash.ts to avoid cross-system mismatch)
 * - `topicSlugToLessonSlug` — converts topicSlug to a valid lesson slug
 */

/**
 * Normalize a stem for hashing — trim, lowercase, collapse internal whitespace.
 * Must stay in sync with how ExamQuestion.stemHash is computed elsewhere
 * (src/lib/content/stem-hash.ts uses the same trim+lowercase approach).
 */
export function normalizeStemText(stem: string): string {
  return stem.replace(/\s+/g, " ").trim().toLowerCase();
}

/**
 * Deterministic short hash for a question stem.
 * Mirrors `stemHash` from `src/lib/content/stem-hash.ts` exactly so the
 * value written here will match duplicate checks on ExamQuestion.stemHash.
 */
export function questionStemHash(stem: string): string {
  const s = normalizeStemText(stem);
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (Math.imul(31, h) + s.charCodeAt(i)) | 0;
  return `s${(h >>> 0).toString(16)}`;
}

/**
 * Lesson dedup key — derived from the three fields of PathwayLesson's
 * @@unique constraint so the pipeline can skip before hitting the DB.
 *
 * Returns a compact lowercase hex string.
 */
export function lessonDedupeKey(pathwayId: string, slug: string, locale: string): string {
  const raw = `${pathwayId.toLowerCase()}|${slug.toLowerCase()}|${locale.toLowerCase()}`;
  let h = 0;
  for (let i = 0; i < raw.length; i++) h = (Math.imul(31, h) + raw.charCodeAt(i)) | 0;
  return `l${(h >>> 0).toString(16)}`;
}

/**
 * Convert a topicSlug to a valid PathwayLesson slug:
 * - already-kebab slugs pass through unchanged
 * - underscores become hyphens
 * - any other non-alphanumeric chars are replaced with hyphens
 * - leading/trailing hyphens stripped
 */
export function topicSlugToLessonSlug(topicSlug: string): string {
  return topicSlug
    .toLowerCase()
    .replace(/_/g, "-")
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
}

/**
 * Map difficulty label to the integer stored in ExamQuestion.difficulty.
 *   easy   → 2
 *   medium → 3
 *   hard   → 4
 */
export function difficultyLabelToInt(label: "easy" | "medium" | "hard"): number {
  switch (label) {
    case "easy":
      return 2;
    case "medium":
      return 3;
    case "hard":
      return 4;
  }
}

/**
 * Map PipelineExamCode to the tier string stored in ExamQuestion.tier
 * and the tierCode stored in PathwayLesson.tierCode.
 */
export function examCodeToTier(exam: string): string {
  switch (exam) {
    case "RN":
      return "RN";
    case "RPN":
    case "LPN":
      return "RPN";
    case "NP":
      return "NP";
    case "Allied":
      return "ALLIED";
    default:
      return exam;
  }
}

/**
 * Section id generator — stable, kebab-cased id for each lesson section kind.
 */
export function sectionId(kind: string): string {
  return `section-${kind.replace(/_/g, "-")}`;
}
