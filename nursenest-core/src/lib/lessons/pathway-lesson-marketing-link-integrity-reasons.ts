/**
 * Failure reasons for marketing lesson hub row resolution and public lesson cross-link integrity.
 * Dependency-free so pure filters/tests can import without `server-only` loader chains.
 */
export type HubMarketingLessonDetailFailureReason =
  | "missing_slug"
  | "detail_loader_miss"
  | "detail_not_public_complete"
  | "pathway_context_mismatch"
  | "professional_hub_corpus_guard"
  | "taxonomy_review_required";

/** Structured counts for marketing lessons hub verify — safe to pass into presentation components. */
export type MarketingHubLessonVerifyDiagnostics = {
  pathwayId: string;
  lessonContentLocale: string;
  /** Rows passed into verify (after hub prepare / dedupe on the marketing lessons page). */
  incomingPreparedRowCount: number;
  uniqueSlugCount: number;
  keptRowCount: number;
  droppedRowCount: number;
  /** Count of **unique slugs** failing detail resolution. */
  excludedUniqueSlugCount: number;
  excludedByReason: Partial<Record<HubMarketingLessonDetailFailureReason, number>>;
  /**
   * Same data as `excludedByReason`, sorted by descending count for structured logs / dashboards.
   * Present whenever verify ran with at least one incoming row.
   */
  exclusionReasonsRanked?: Array<{ reason: HubMarketingLessonDetailFailureReason; count: number }>;
};

export type PublicMarketingLessonCrossLinkExclusionReason =
  | HubMarketingLessonDetailFailureReason
  | "cross_link_pathway_missing"
  | "cross_link_slug_parse_failed";
