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

/** Stage counts inside {@link prepareLessonsForHubCurriculumWithDiagnostics} (marketing hub only). */
export type HubCurriculumPrepareStageDiagnostics = {
  incomingFromLoader: number;
  afterRenderableSlugFilter: number;
  droppedMissingOrUnsafeSlug: number;
  afterLibraryDedupe: number;
  droppedDuplicateSlug: number;
  afterOrganize: number;
  droppedOrganizeShrink: number;
  afterMarketingHrefFilter: number;
  droppedNoMarketingHref: number;
};

/** Structured counts for marketing lessons hub verify — safe to pass into presentation components. */
export type MarketingHubLessonVerifyDiagnostics = {
  pathwayId: string;
  lessonContentLocale: string;
  /** Hub page marketing locale (overlays) — same as {@link getPathwayLessonsPageFresh} `marketingLocale`. */
  hubPageMarketingLocale?: string;
  /** Dominant list warehouse locale passed into verify (DB shard fallback when rows omit `localeMeta`). */
  verifyListWarehouseLocale?: string;
  /** Populated when verify merges `prepareLessonsForHubCurriculumWithDiagnostics` output. */
  prepareStages?: HubCurriculumPrepareStageDiagnostics;
  /** Rows passed into verify (after hub prepare / dedupe on the marketing lessons page). */
  incomingPreparedRowCount: number;
  uniqueSlugCount: number;
  keptRowCount: number;
  droppedRowCount: number;
  /** Count of **unique slugs** failing detail resolution. */
  excludedUniqueSlugCount: number;
  /** Resolver invocations (one per unique slug in current verify implementation). */
  verifyResolverCallCount: number;
  excludedByReason: Partial<Record<HubMarketingLessonDetailFailureReason, number>>;
  /**
   * Same data as `excludedByReason`, sorted by descending count for structured logs / dashboards.
   * Present whenever verify ran with at least one incoming row.
   */
  exclusionReasonsRanked?: Array<{ reason: HubMarketingLessonDetailFailureReason; count: number }>;
  /** Capped unique-slug failures for debug (`NN_MARKETING_HUB_PIPELINE_DEBUG=1`) and ops triage. */
  excludedSlugSamples?: Array<{ slug: string; reason: HubMarketingLessonDetailFailureReason }>;
};

export type PublicMarketingLessonCrossLinkExclusionReason =
  | HubMarketingLessonDetailFailureReason
  | "cross_link_pathway_missing"
  | "cross_link_slug_parse_failed";
