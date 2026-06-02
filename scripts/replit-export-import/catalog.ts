/**
 * Maps Replit / legacy JSON export filenames to Postgres tables and feature areas.
 * Used by inventory + import for classification and documentation.
 */
export type ExportFileInfo = {
  fileName: string;
  table: string;
  featureArea: string;
  notes: string;
};

export const REPLIT_EXPORT_CATALOG: ExportFileInfo[] = [
  {
    fileName: "ai_cache.json",
    table: "ai_cache (+ optional flashcard_bank / exam_questions)",
    featureArea: "LLM cache; secondary extraction to question/flashcard tables",
    notes:
      "Raw rows use cache_key + output_json. By default the CLI extracts into flashcard_bank (content_hash) and exam_questions (stem_hash) when output_json matches front/back or stem/options. Pass --no-ai-cache-extract to skip extraction.",
  },
  {
    fileName: "allied_blueprints.json",
    table: "allied_blueprints",
    featureArea: "Allied exam blueprint configuration",
    notes: "Upsert by primary id. Preserves versioned blueprints for allied generators.",
  },
  {
    fileName: "encyclopedia_entries.json",
    table: "encyclopedia_entries",
    featureArea: "Encyclopedia / long-form profession articles",
    notes: "Upsert on (profession, slug) when unique index exists; otherwise skip with error log.",
  },
  {
    fileName: "flashcard_decks.json",
    table: "flashcard_decks",
    featureArea: "User/system flashcard decks",
    notes: "Requires owner_id on each row or REPLIT_IMPORT_DECK_OWNER_ID for missing values.",
  },
  {
    fileName: "deck_flashcards.json",
    table: "deck_flashcards",
    featureArea: "Cards belonging to flashcard_decks",
    notes: "Import after flashcard_decks; FK on deck_id.",
  },
  {
    fileName: "flashcard_preview_config.json",
    table: "flashcard_preview_config",
    featureArea: "Free preview / paywall limits for flashcards",
    notes: "Upsert on content_type (usually 'flashcards').",
  },
  {
    fileName: "generation_events.json",
    table: "generation_events",
    featureArea: "Content generation pipeline audit",
    notes: "Job event stream; safe to upsert by id.",
  },
  {
    fileName: "generation_jobs.json",
    table: "generation_jobs",
    featureArea: "Content generation batch jobs",
    notes: "Upsert by id.",
  },
  {
    fileName: "imaging_blog_articles.json",
    table: "imaging_blog_articles",
    featureArea: "Imaging marketing / education blog",
    notes: "Upsert on slug (unique).",
  },
  {
    fileName: "imaging_flashcards.json",
    table: "imaging_flashcards",
    featureArea: "Imaging flashcard bank",
    notes: "Upsert by id.",
  },
  {
    fileName: "imaging_physics_topics.json",
    table: "imaging_physics_topics",
    featureArea: "Imaging physics lessons",
    notes: "Upsert by id.",
  },
  {
    fileName: "imaging_positioning_entries.json",
    table: "imaging_positioning_entries",
    featureArea: "Positioning guides",
    notes: "Upsert by id.",
  },
  {
    fileName: "imaging_questions.json",
    table: "imaging_questions",
    featureArea: "Imaging MCQ bank",
    notes: "Upsert by id.",
  },
  {
    fileName: "imaging_seo_pages.json",
    table: "imaging_seo_pages",
    featureArea: "Imaging SEO landing pages",
    notes: "Upsert on slug (unique).",
  },
  {
    fileName: "kill_switches.json",
    table: "kill_switches",
    featureArea: "Operational feature kill switches (backend-resilience)",
    notes:
      "Table created by ensureResilienceTables. By default imported with enabled=false unless --apply-kill-switch-state is passed (dangerous).",
  },
  {
    fileName: "lesson_images.json",
    table: "lesson_images",
    featureArea: "Lesson ↔ image asset links",
    notes: "Upsert by id when present; otherwise insert (may duplicate if ids unstable).",
  },
  {
    fileName: "lesson_overrides.json",
    table: "lesson_overrides",
    featureArea: "Authoritative JSON overrides layered on lessons",
    notes: "Upsert on lesson_id PK.",
  },
];

export const CATALOG_BY_FILE = new Map(REPLIT_EXPORT_CATALOG.map((e) => [e.fileName, e]));
