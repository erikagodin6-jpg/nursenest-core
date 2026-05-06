/**
 * NurseNest — canonical content source-of-truth registry.
 *
 * **Rule:** For each type, admin write path, canonical storage, public read, and learner read
 * must match unless `verificationStatus` is `NOT_VERIFIED` or `legacyFallbackAllowed` is explicitly
 * documented (and gated by env / migration flags).
 *
 * Guard tests + `npm run content:source-of-truth:check` consume this file.
 */

export type ContentVerificationStatus = "VERIFIED" | "PARTIAL" | "NOT_VERIFIED";

export type ContentRegistryId =
  | "lessons"
  | "flashcards"
  | "practice_questions"
  | "cat_questions"
  | "osce_stations"
  | "medication_mastery"
  | "blogs"
  | "new_grad_content"
  | "allied_health_content"
  | "study_plan_items"
  | "report_card_progress";

export type ContentRegistryEntry = {
  id: ContentRegistryId;
  /** Prisma model / table name(s) or explicit `none` when not DB-backed. */
  canonicalStorageModel: string | null;
  /** Human-readable import/migration sources permitted to touch canonical storage. */
  allowedImportSources: readonly string[];
  adminCreateRoute: string | null;
  adminEditRoute: string | null;
  /** Route pattern with placeholders `{locale}`, `{hubSlug}`, `{examCode}`, `{lessonSlug}`, `{blogSlug}`, `{stationId}`, `{pathwayLessonId}`. */
  publicReadRoutePattern: string | null;
  learnerReadRoutePattern: string | null;
  /** Exported validation helper name in codebase, or null if none. */
  validationFunction: string | null;
  ownershipPathwayMapping: string;
  legacyFallbackAllowed: boolean;
  /** When legacy reads are allowed, name the env flag or loader gate (must be explicit). */
  legacyFallbackNotes: string;
  generatedFolderAllowed: boolean;
  generatedFolderNotes: string;
  verificationStatus: ContentVerificationStatus;
  notes: string;
};

export const CONTENT_REGISTRY: Record<ContentRegistryId, ContentRegistryEntry> = {
  lessons: {
    id: "lessons",
    canonicalStorageModel: "PathwayLesson (pathway_lessons)",
    allowedImportSources: [
      "src/content/pathway-lessons/*.json catalogs (merge only; DB wins when row exists)",
      "pathway-lesson-catalog-sync",
      "admin PATCH /api/admin/pathway-lessons/[id]",
    ],
    adminCreateRoute: "/admin/pathway-lessons (open/create flows)",
    adminEditRoute: "/admin/pathway-lessons/edit | /admin/pathway-lessons/[id]",
    publicReadRoutePattern: "/{locale}/{hubSlug}/{examCode}/lessons/{lessonSlug}",
    learnerReadRoutePattern: "/app/lessons/{pathwayLessonId}",
    validationFunction: "evaluatePathwayLessonStructuralGate / validateLessonForPublish (publish pipeline)",
    ownershipPathwayMapping: "pathwayId + locale on PathwayLesson; catalog shards keyed by pathwayId",
    legacyFallbackAllowed: true,
    legacyFallbackNotes:
      "Catalog JSON + ContentItem-linked legacy slugs may hydrate until DB row exists; authoring SoT is PathwayLesson (Option B).",
    generatedFolderAllowed: true,
    generatedFolderNotes:
      "pathway-lessons/generated-indexes/*.json — build artifacts; not authoring SoT. Rebuild on deploy after lesson changes.",
    verificationStatus: "VERIFIED",
    notes: "See pathway-lesson-loader header comment for read stack.",
  },
  flashcards: {
    id: "flashcards",
    canonicalStorageModel: "Flashcard, FlashcardDeck (Prisma)",
    allowedImportSources: [
      "POST/PATCH /api/admin/flashcards*",
      "Verified study promotion routes",
      "Optional marketing samples: src/content/flashcard-samples.json (read-only teaser)",
    ],
    adminCreateRoute: "/admin/ai/flashcards",
    adminEditRoute: "/admin/ai/flashcards | /admin/study-cards",
    publicReadRoutePattern: "/{locale}/{hubSlug}/{examCode}/flashcards",
    learnerReadRoutePattern: "/app/flashcards",
    validationFunction: null,
    ownershipPathwayMapping: "Deck/card tags + pathwayId metadata on rows where present",
    legacyFallbackAllowed: false,
    legacyFallbackNotes: "Subscriber snapshot readers are resilience/cache — not a second authoring corpus.",
    generatedFolderAllowed: false,
    generatedFolderNotes: "N/A",
    verificationStatus: "PARTIAL",
    notes: "Public marketing vs /api/flashcards subscriber split; both must read published DB rows.",
  },
  practice_questions: {
    id: "practice_questions",
    canonicalStorageModel: "ExamQuestion (exam_questions)",
    allowedImportSources: [
      "PATCH /api/admin/questions/[id]",
      "Import/draft promotion pipelines",
    ],
    adminCreateRoute: "/admin/ai/exam-questions",
    adminEditRoute: "/admin/questions | /admin/ai/drafts/questions/[id]",
    publicReadRoutePattern: null,
    learnerReadRoutePattern: "/app/questions",
    validationFunction: null,
    ownershipPathwayMapping: "tier, exam, topic tags, pathway links on ExamQuestion",
    legacyFallbackAllowed: false,
    legacyFallbackNotes: "client/src legacy banks are migration sources only — not live Next read path.",
    generatedFolderAllowed: false,
    generatedFolderNotes: "N/A",
    verificationStatus: "VERIFIED",
    notes: "No full public question page; learner + API are canonical consumers.",
  },
  cat_questions: {
    id: "cat_questions",
    canonicalStorageModel: "ExamQuestion pool + CatBlueprintSession / CAT runtime services",
    allowedImportSources: [
      "Same as practice_questions for item bodies",
      "CAT blueprint diagnostics under /api/admin/cat-blueprint-sessions",
    ],
    adminCreateRoute: null,
    adminEditRoute: "/admin/diagnostics/cat-blueprint-sessions",
    publicReadRoutePattern: null,
    learnerReadRoutePattern: "/app/exams (CAT flows)",
    validationFunction: null,
    ownershipPathwayMapping: "Exam selection scoped by entitlement + pathway context at runtime",
    legacyFallbackAllowed: false,
    legacyFallbackNotes: "No standalone legacy CAT JSON as SoT for production.",
    generatedFolderAllowed: false,
    generatedFolderNotes: "N/A",
    verificationStatus: "PARTIAL",
    notes: "Authoring is the question bank; CAT adds session/blueprint diagnostics — tighten pool guard tests separately.",
  },
  osce_stations: {
    id: "osce_stations",
    canonicalStorageModel: "OsceStation (osce_stations)",
    allowedImportSources: [
      "scripts migrate-osce-stations (or equivalent)",
      "POST/PATCH /api/admin/osce-stations*",
      "@legacy-client bundles — migration input only",
    ],
    adminCreateRoute: "POST /api/admin/osce-stations (no dedicated create page yet)",
    adminEditRoute: "/admin/osce-stations | /admin/osce-stations/[id]",
    publicReadRoutePattern: "/{locale}/{hubSlug}/{examCode}/osce/{stationId}",
    learnerReadRoutePattern: "/app/osce | /app/osce/{stationId}",
    validationFunction: "osceStationPostSchema / osceStationPatchSchema",
    ownershipPathwayMapping: "pathwayId nullable (shared bank); category/domain fields on row",
    legacyFallbackAllowed: true,
    legacyFallbackNotes:
      "Legacy JSON only when **no published** `osce_stations` rows exist **and** OSCE_LEGACY_FALLBACK is enabled (see `osce-legacy-fallback.ts`). Any published DB row blocks legacy on public/learner reads.",
    generatedFolderAllowed: false,
    generatedFolderNotes: "N/A",
    verificationStatus: "VERIFIED",
    notes:
      "DB published rows are canonical for public + learner loaders (`hasAnyPublishedOsceStation` gate). Contract + e2e tests cover Prisma write ↔ loader read; HTTP admin auth E2E remains environment-specific.",
  },
  medication_mastery: {
    id: "medication_mastery",
    canonicalStorageModel: "PathwayLesson + ExamQuestion (target state)",
    allowedImportSources: [
      "client/src/data/lessons/med-math-lessons.ts (legacy — migrate)",
      "client/src/data/med-math-questions.ts (legacy — migrate)",
      "npm run migrate:med-math:* scripts",
    ],
    adminCreateRoute: "/admin/pathway-lessons",
    adminEditRoute: "/admin/pathway-lessons/* + /admin/questions",
    publicReadRoutePattern: "/{locale}/{hubSlug}/{examCode}/lessons/{lessonSlug}",
    learnerReadRoutePattern: "/app/lessons/{pathwayLessonId}",
    validationFunction: "med-math migration pipeline tests (see test:pathway-lessons includes med-math contract)",
    ownershipPathwayMapping: "pathwayId per med-math rollout (e.g. us-rn-nclex-rn)",
    legacyFallbackAllowed: true,
    legacyFallbackNotes: "Legacy TS modules remain until migration completes.",
    generatedFolderAllowed: false,
    generatedFolderNotes: "N/A",
    verificationStatus: "NOT_VERIFIED",
    notes: "Canonical target is pathway_lessons + question bank; full migration not complete.",
  },
  blogs: {
    id: "blogs",
    canonicalStorageModel: "BlogPost",
    allowedImportSources: [
      "publishBlogPostCanonical",
      "/api/admin/blog/*",
      "Generation jobs → persist to BlogPost",
      "blog-static-posts.ts / .json — build-time corpus when DB absent only",
    ],
    adminCreateRoute: "/admin/blog/control-panel",
    adminEditRoute: "/admin/blog/control-panel | /admin/blog?id=",
    publicReadRoutePattern: "/blog/{blogSlug}",
    learnerReadRoutePattern: null,
    validationFunction: "blogLiveWhere / publish gates (see blog contracts)",
    ownershipPathwayMapping: "tags, locale, career/program metadata on BlogPost",
    legacyFallbackAllowed: true,
    legacyFallbackNotes: "Static corpus when DB skipped at build — documented in blog contracts.",
    generatedFolderAllowed: true,
    generatedFolderNotes: "Generation output must land in BlogPost before counting as live.",
    verificationStatus: "VERIFIED",
    notes: "Hidden/generated recovery tracked by blog recovery tests and content:report-hidden-blogs.",
  },
  new_grad_content: {
    id: "new_grad_content",
    canonicalStorageModel: "PathwayLesson (+ pathway catalogs)",
    allowedImportSources: [
      "pathway-lessons/new-grad-transition-catalog.json",
      "Same admin APIs as lessons",
    ],
    adminCreateRoute: "/admin/pathway-lessons",
    adminEditRoute: "/admin/pathway-lessons/*",
    publicReadRoutePattern: "/{locale}/{hubSlug}/{examCode}/lessons/{lessonSlug}",
    learnerReadRoutePattern: "/app/lessons/{pathwayLessonId}",
    validationFunction: "same as lessons",
    ownershipPathwayMapping: "New Grad pathwayId in exam-pathway registry — not a separate CMS",
    legacyFallbackAllowed: false,
    legacyFallbackNotes: "No parallel New Grad storage; catalog merge feeds PathwayLesson.",
    generatedFolderAllowed: true,
    generatedFolderNotes: "Catalog JSON shards under pathway-lessons/ — merge inputs, DB authoritative when present.",
    verificationStatus: "PARTIAL",
    notes: "Architecture matches RN; automated parity smoke for every hub route not yet exhaustive.",
  },
  allied_health_content: {
    id: "allied_health_content",
    canonicalStorageModel: "PathwayLesson (+ allied catalogs)",
    allowedImportSources: [
      "pathway-lessons/allied-bundled-catalog.json",
      "PATCH /api/admin/pathway-lessons/[id]",
    ],
    adminCreateRoute: "/admin/pathway-lessons",
    adminEditRoute: "/admin/pathway-lessons/*",
    publicReadRoutePattern: "/{locale}/{hubSlug}/{examCode}/lessons/{lessonSlug}",
    learnerReadRoutePattern: "/app/lessons/{pathwayLessonId}",
    validationFunction: "allied-health-pathway-lesson-contracts tests",
    ownershipPathwayMapping: "pathwayId for each allied occupation",
    legacyFallbackAllowed: false,
    legacyFallbackNotes: "Same stack as RN; no second learner app.",
    generatedFolderAllowed: true,
    generatedFolderNotes: "Catalog JSON — merge only.",
    verificationStatus: "PARTIAL",
    notes: "Framework + contracts exist; 200+ lesson completeness is out of scope for this registry row.",
  },
  study_plan_items: {
    id: "study_plan_items",
    canonicalStorageModel: "none (computed from progress + PathwayLesson + planner context)",
    allowedImportSources: ["User progress tables", "PathwayLesson catalog for recommendations"],
    adminCreateRoute: null,
    adminEditRoute: null,
    publicReadRoutePattern: null,
    learnerReadRoutePattern: "/app/study-plan",
    validationFunction: null,
    ownershipPathwayMapping: "Derived from learner pathway + completion tables",
    legacyFallbackAllowed: false,
    legacyFallbackNotes: "No frozen JSON SoT for plan rows.",
    generatedFolderAllowed: false,
    generatedFolderNotes: "N/A",
    verificationStatus: "NOT_VERIFIED",
    notes: "No single CRUD table; treat planner as derived surface until a DB model is explicitly introduced.",
  },
  report_card_progress: {
    id: "report_card_progress",
    canonicalStorageModel: "Progress* / UserTopicStats / dashboard aggregates (multiple Prisma models)",
    allowedImportSources: ["Runtime progress writes via app APIs", "No direct markdown authoring"],
    adminCreateRoute: null,
    adminEditRoute: "/admin/analytics/* (read-mostly)",
    publicReadRoutePattern: null,
    learnerReadRoutePattern: "/app (dashboard / report card surfaces)",
    validationFunction: null,
    ownershipPathwayMapping: "userId + pathway prefixes on progress rows",
    legacyFallbackAllowed: false,
    legacyFallbackNotes: "N/A",
    generatedFolderAllowed: false,
    generatedFolderNotes: "N/A",
    verificationStatus: "PARTIAL",
    notes: "Authoring is learner activity, not content CMS; admin views are analytics.",
  },
} as const;

export const CONTENT_REGISTRY_IDS = Object.keys(CONTENT_REGISTRY) as ContentRegistryId[];

/** Top-level directories allowed under `src/content/`. */
export const APPROVED_SRC_CONTENT_TOP_LEVEL_DIRS = [
  "allied-mastery",
  "lessons",
  "pathway-lessons",
  "pre-nursing",
  "topic-maps",
] as const;

/** Root-level files allowed under `src/content/`. */
export const APPROVED_SRC_CONTENT_ROOT_FILES = new Set([
  "blog-static-posts.json",
  "blog-static-posts.ts",
  "clinical-case-studies.json",
  "flashcard-samples.json",
  "tools-overlays-all.json",
  "transfusion-safety-questions.json",
]);

export function assertEveryRegistryEntryHasId(): void {
  for (const id of CONTENT_REGISTRY_IDS) {
    if (CONTENT_REGISTRY[id].id !== id) {
      throw new Error(`Registry key/id mismatch for ${id}`);
    }
  }
}

export function listRegistryEntries(): ContentRegistryEntry[] {
  return CONTENT_REGISTRY_IDS.map((id) => CONTENT_REGISTRY[id]);
}
