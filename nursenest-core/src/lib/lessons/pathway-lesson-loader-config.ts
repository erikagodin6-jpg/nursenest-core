/**
 * Shared lesson-loader constants that should not pull the full lesson loader graph.
 * Import from here when a module only needs config, not lesson data access.
 */
export const PATHWAY_LESSON_DB_TIMEOUT_MS = 1000;

/**
 * Marketing lessons hub runs {@link verifyMarketingHubLessonRowsResolve} with one full-row Prisma read per slug.
 * The default 1s cap races large `sections` JSON and cold DB latency, returns fallback `null`, and collapses the hub
 * to a handful of “lucky” fast rows. Keep this bounded but high enough for production lesson payloads.
 */
export const PATHWAY_LESSON_MARKETING_HUB_VERIFY_DB_TIMEOUT_MS = 15_000;
