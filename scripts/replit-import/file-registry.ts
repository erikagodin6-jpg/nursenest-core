/**
 * Maps staged export filenames to domain + Drizzle table targets (shared/schema.ts).
 * Confidence: files not listed here are "unknown" until manually classified.
 */
export type ExportDomain =
  | "nursing_questions"
  | "allied_health"
  | "lessons"
  | "translations"
  | "blog_content"
  | "users_auth"
  | "ops_analytics"
  | "imaging"
  | "seo"
  | "flashcards"
  | "generation"
  | "commerce"
  | "paramedic"
  | "unknown";

export type FileRegistryEntry = {
  /** Lower = imported first when batching */
  importPriority: number;
  domain: ExportDomain;
  /** Primary Postgres table name (snake_case) or descriptive target */
  targetTable: string;
  confidence: "high" | "medium" | "low";
  notes: string;
};

export const FILE_REGISTRY: Record<string, FileRegistryEntry> = {
  ai_cache: {
    importPriority: 1,
    domain: "nursing_questions",
    targetTable: "ai_cache + exam_questions (extract output_json[] items with stem/options)",
    confidence: "high",
    notes:
      "Each row is a cache entry; output_json is typically an array of MCQ objects (stem, options, correctAnswer). Nursing exam_questions extraction is the priority.",
  },
  qbank_drafts: {
    importPriority: 2,
    domain: "nursing_questions",
    targetTable: "qbank_drafts",
    confidence: "medium",
    notes: "Draft banks; questions may live in questions_json. Map to qbank_drafts then publish pipeline — not direct exam_questions without review.",
  },
  question_type_registry: {
    importPriority: 15,
    domain: "nursing_questions",
    targetTable: "question_type_registry (if table exists) or config",
    confidence: "low",
    notes: "Verify table exists in migrations; may be app config rather than bulk import.",
  },
  qbank_prompt_templates: {
    importPriority: 20,
    domain: "nursing_questions",
    targetTable: "prompt_templates / qbank_prompt_templates",
    confidence: "medium",
    notes: "Align with server/prompts or dedicated table — confirm schema before import.",
  },
  allied_blueprints: {
    importPriority: 10,
    domain: "allied_health",
    targetTable: "allied_blueprints",
    confidence: "high",
    notes: "Allied exam blueprint JSON — not individual questions.",
  },
  encyclopedia_entries: {
    importPriority: 12,
    domain: "blog_content",
    targetTable: "encyclopedia_entries",
    confidence: "high",
    notes: "Long-form profession articles.",
  },
  flashcard_decks: {
    importPriority: 11,
    domain: "flashcards",
    targetTable: "flashcard_decks",
    confidence: "high",
    notes: "Requires valid owner_id or system user.",
  },
  flashcard_preview_config: {
    importPriority: 30,
    domain: "flashcards",
    targetTable: "flashcard_preview_config",
    confidence: "high",
    notes: "Single-row upsert per content_type.",
  },
  generation_jobs: {
    importPriority: 25,
    domain: "generation",
    targetTable: "generation_jobs",
    confidence: "high",
    notes: "Job metadata only.",
  },
  generation_events: {
    importPriority: 26,
    domain: "generation",
    targetTable: "generation_events",
    confidence: "high",
    notes: "Audit stream — large; often optional for content restore.",
  },
  imaging_blog_articles: {
    importPriority: 18,
    domain: "imaging",
    targetTable: "imaging_blog_articles",
    confidence: "high",
    notes: "",
  },
  imaging_flashcards: {
    importPriority: 17,
    domain: "imaging",
    targetTable: "imaging_flashcards",
    confidence: "high",
    notes: "",
  },
  imaging_physics_topics: {
    importPriority: 16,
    domain: "imaging",
    targetTable: "imaging_physics_topics",
    confidence: "high",
    notes: "",
  },
  imaging_positioning_entries: {
    importPriority: 16,
    domain: "imaging",
    targetTable: "imaging_positioning_entries",
    confidence: "high",
    notes: "",
  },
  imaging_questions: {
    importPriority: 14,
    domain: "imaging",
    targetTable: "imaging_questions",
    confidence: "high",
    notes: "Imaging MCQ bank — separate from NCLEX exam_questions.",
  },
  imaging_seo_pages: {
    importPriority: 19,
    domain: "imaging",
    targetTable: "imaging_seo_pages",
    confidence: "high",
    notes: "",
  },
  kill_switches: {
    importPriority: 40,
    domain: "ops_analytics",
    targetTable: "kill_switches",
    confidence: "high",
    notes: "Import with enabled=false by default; use scripts/replit-export-import safety flags.",
  },
  lesson_images: {
    importPriority: 8,
    domain: "lessons",
    targetTable: "lesson_images",
    confidence: "high",
    notes: "Maps lesson_id to image paths.",
  },
  lesson_overrides: {
    importPriority: 7,
    domain: "lessons",
    targetTable: "lesson_overrides",
    confidence: "high",
    notes: "Authoritative lesson HTML overrides.",
  },
  paramedic_scenarios: {
    importPriority: 13,
    domain: "paramedic",
    targetTable: "paramedic_scenarios",
    confidence: "high",
    notes: "",
  },
  paramedic_waveform_assets: {
    importPriority: 13,
    domain: "paramedic",
    targetTable: "paramedic_waveform_assets",
    confidence: "medium",
    notes: "Confirm column names vs schema.",
  },
  pricing_plans: {
    importPriority: 35,
    domain: "commerce",
    targetTable: "pricing_plans",
    confidence: "high",
    notes: "Commerce — review Stripe IDs before prod.",
  },
  product_generations: {
    importPriority: 24,
    domain: "generation",
    targetTable: "product_generations",
    confidence: "high",
    notes: "User-scoped generation jobs.",
  },
  seo_pages: {
    importPriority: 22,
    domain: "translations",
    targetTable: "seo_pages",
    confidence: "high",
    notes: "Includes language_code — many rows are localized (translations of SEO content).",
  },
  seo_clusters: {
    importPriority: 23,
    domain: "seo",
    targetTable: "seo_clusters",
    confidence: "medium",
    notes: "Verify table in schema.",
  },
  seo_articles: {
    importPriority: 21,
    domain: "blog_content",
    targetTable: "seo_articles",
    confidence: "medium",
    notes: "Confirm table name vs content_items in some code paths.",
  },
  verification_reports: {
    importPriority: 28,
    domain: "nursing_questions",
    targetTable: "verification_reports",
    confidence: "high",
    notes: "AI verification of exam_question entities — references entity_id.",
  },
  users: {
    importPriority: 99,
    domain: "users_auth",
    targetTable: "users",
    confidence: "high",
    notes: "CONTAINS PASSWORD HASHES — exclude from routine import; legal/security review required.",
  },
  user_stats: {
    importPriority: 98,
    domain: "users_auth",
    targetTable: "user_stats",
    confidence: "high",
    notes: "User PII-adjacent; merge carefully.",
  },
  user_exam_profile: {
    importPriority: 98,
    domain: "users_auth",
    targetTable: "user_exam_profile",
    confidence: "medium",
    notes: "Verify table exists.",
  },
  mock_exam_attempts: {
    importPriority: 97,
    domain: "users_auth",
    targetTable: "mock_exam_attempts",
    confidence: "high",
    notes: "User session data — often obsolete for content restore.",
  },
  test_results: {
    importPriority: 96,
    domain: "users_auth",
    targetTable: "test_results",
    confidence: "medium",
    notes: "Lesson quiz results.",
  },
  trial_sessions: {
    importPriority: 95,
    domain: "users_auth",
    targetTable: "trial_sessions",
    confidence: "medium",
    notes: "",
  },
  saved_decks: {
    importPriority: 94,
    domain: "users_auth",
    targetTable: "saved_decks",
    confidence: "high",
    notes: "User–deck join table.",
  },
  study_groups: {
    importPriority: 93,
    domain: "users_auth",
    targetTable: "study_groups",
    confidence: "high",
    notes: "",
  },
  study_group_members: {
    importPriority: 93,
    domain: "users_auth",
    targetTable: "study_group_members",
    confidence: "high",
    notes: "",
  },
  study_plan_schedule: {
    importPriority: 92,
    domain: "users_auth",
    targetTable: "study_plan_schedule",
    confidence: "medium",
    notes: "Align with study_coaching_engine tables.",
  },
  page_views: {
    importPriority: 100,
    domain: "ops_analytics",
    targetTable: "page_views",
    confidence: "high",
    notes: "Analytics — usually skip for content migration.",
  },
  page_views_daily: {
    importPriority: 100,
    domain: "ops_analytics",
    targetTable: "page_views_daily",
    confidence: "medium",
    notes: "Aggregates — often obsolete.",
  },
  notification_log: {
    importPriority: 100,
    domain: "ops_analytics",
    targetTable: "notification_log",
    confidence: "medium",
    notes: "",
  },
  platform_alerts: {
    importPriority: 100,
    domain: "ops_analytics",
    targetTable: "platform_alerts",
    confidence: "medium",
    notes: "",
  },
  platform_emergency_log: {
    importPriority: 100,
    domain: "ops_analytics",
    targetTable: "platform_emergency_log",
    confidence: "medium",
    notes: "",
  },
  platform_health_checks: {
    importPriority: 100,
    domain: "ops_analytics",
    targetTable: "platform_health_checks",
    confidence: "medium",
    notes: "",
  },
  reliability_alerts: {
    importPriority: 100,
    domain: "ops_analytics",
    targetTable: "reliability_alerts",
    confidence: "medium",
    notes: "",
  },
  synthetic_test_results: {
    importPriority: 100,
    domain: "ops_analytics",
    targetTable: "synthetic_test_results",
    confidence: "medium",
    notes: "Monitoring — skip for content.",
  },
  upgrade_funnel_events: {
    importPriority: 100,
    domain: "ops_analytics",
    targetTable: "upgrade_funnel_events",
    confidence: "medium",
    notes: "",
  },
  tester_invite_codes: {
    importPriority: 90,
    domain: "users_auth",
    targetTable: "tester_invite_codes",
    confidence: "medium",
    notes: "Verify table name in schema.",
  },
};

export function registryKeyFromFilename(fileName: string): string {
  return fileName.replace(/\.json$/i, "").toLowerCase();
}

export function getRegistryEntry(fileName: string): FileRegistryEntry | null {
  return FILE_REGISTRY[registryKeyFromFilename(fileName)] ?? null;
}
