/**
 * Types + JSON parsing for `scripts/legacy/*-legacy-public-content.mts`.
 *
 * Export shape (version 1) — prefer committing a sanitized JSON export from the legacy site:
 *
 * ```json
 * {
 *   "version": 1,
 *   "lessons": [
 *     {
 *       "pathwayId": "ca-rn-nclex-rn",
 *       "slug": "fluid-electrolytes-basics",
 *       "title": "Fluid & electrolytes",
 *       "topic": "Fluids",
 *       "topicSlug": "fluids",
 *       "bodySystem": "renal",
 *       "legacyUrl": "https://legacy.example/...",
 *       "status": "PUBLISHED",
 *       "visiblePublic": true,
 *       "tierCode": "LVN_LPN",
 *       "sections": []
 *     }
 *   ],
 *   "flashcards": {
 *     "tags": [{ "slug": "pharmacology", "name": "Pharmacology" }],
 *     "deckTagLinks": [{ "deckSlug": "med-math", "tagSlug": "pharmacology" }]
 *   }
 * }
 * ```
 *
 * - `sections` is optional on lessons; when missing, imports **update metadata only** unless
 *   `LEGACY_IMPORT_CREATE_MISSING_LESSONS=1` (still requires sections for brand-new creates).
 */

export type LegacyLessonExportRow = {
  pathwayId: string;
  slug: string;
  title: string;
  topic?: string;
  topicSlug?: string;
  bodySystem?: string;
  legacyUrl?: string;
  /** Prisma `ContentStatus` string */
  status?: "DRAFT" | "IN_REVIEW" | "PUBLISHED" | "ARCHIVED";
  visiblePublic?: boolean;
  tierCode?: string | null;
  /** Optional ordering when creating a new row from export */
  sortOrder?: number;
  /** Full lesson JSON — only used when explicitly creating rows */
  sections?: unknown;
};

export type LegacyFlashcardTagExportRow = {
  slug: string;
  name: string;
};

export type LegacyDeckTagLinkExportRow = {
  deckSlug: string;
  tagSlug: string;
};

export type LegacyFlashcardDeckPatchRow = {
  slug: string;
  title?: string;
  /** When set, updates deck visibility for existing published marketing-scope decks (never creates decks). */
  visibility?: "PUBLIC_PREVIEW" | "SUBSCRIBER" | "HIDDEN";
};

export type LegacyFlashcardExportBundle = {
  tags?: LegacyFlashcardTagExportRow[];
  deckTagLinks?: LegacyDeckTagLinkExportRow[];
  decks?: LegacyFlashcardDeckPatchRow[];
};

export type LegacyPublicContentExportV1 = {
  version: 1;
  lessons?: LegacyLessonExportRow[];
  flashcards?: LegacyFlashcardExportBundle;
};

export type LegacyAuditReport = {
  legacyLessonsFound: number;
  currentLessonsMatched: number;
  currentLessonsMissing: number;
  slugMismatches: number;
  pathwayMismatches: number;
  categorySystemMismatches: number;
  lessonsWouldBecomePublicRenderable: number;
  flashcardTagsInExport: number;
  flashcardDeckLinksInExport: number;
  flashcardDecksMissingInDb: number;
  flashcardTagsMissingInDb: number;
  /** Sample rows for human review */
  samples: {
    slugMismatch: Array<{ legacySlug: string; currentSlug: string; pathwayId: string }>;
    pathwayMismatch: Array<{ legacyPathwayId: string; currentPathwayId: string; slug: string }>;
    missingLesson: Array<{ pathwayId: string; slug: string }>;
  };
};

export type LegacyChangeLogEntry = {
  entity: "pathway_lesson" | "flashcard_tag" | "flashcard_deck" | "flashcard_deck_on_tag" | "exam_question";
  id: string;
  action: "update" | "create" | "connect";
  before: Record<string, unknown>;
  after: Record<string, unknown>;
};

export type LegacyImportResult = {
  dryRun: boolean;
  changes: LegacyChangeLogEntry[];
  errors: string[];
  audit: LegacyAuditReport;
};

/** Shared options for legacy DB import pipelines (lessons + optional flashcards / exam questions). */
export type LegacyPipelineOptions = {
  apply: boolean;
  overwriteBody: boolean;
  allowPathwayCorrection: boolean;
  allowCreateMissingLessons: boolean;
};

const SLUG_SAFE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function normalizeLegacySlug(raw: string): string {
  const s = raw
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 120);
  if (!s || !SLUG_SAFE.test(s)) return "";
  return s;
}

export function parseLegacyPublicContentExportJson(text: string): LegacyPublicContentExportV1 {
  let parsed: unknown;
  try {
    parsed = JSON.parse(text) as unknown;
  } catch (e) {
    throw new Error(`Invalid JSON: ${e instanceof Error ? e.message : String(e)}`);
  }
  if (!parsed || typeof parsed !== "object") throw new Error("Export root must be an object");
  const root = parsed as Record<string, unknown>;
  if (root.version !== 1) throw new Error('Export "version" must be 1');
  const lessons = Array.isArray(root.lessons) ? (root.lessons as LegacyLessonExportRow[]) : [];
  const flashcards =
    root.flashcards && typeof root.flashcards === "object"
      ? (root.flashcards as LegacyFlashcardExportBundle)
      : {};
  return { version: 1, lessons, flashcards };
}
