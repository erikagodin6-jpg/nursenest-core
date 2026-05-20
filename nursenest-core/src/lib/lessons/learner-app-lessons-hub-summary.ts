/**
 * `/app/lessons` hub: single source of truth for empty-state vs search/filter miss.
 * List rows (`resolvedRenderableLessons`) and `catalogMatchTotal` must come from the same
 * server list block; this module only classifies UX.
 */
export type LearnerAppLessonsHubEmptyReason =
  | "none"
  | "catalog_empty"
  | "search_or_filters_no_matches"
  /** `catalogMatchTotal > 0` but zero rows — should not happen after pagination redirects; log + recover UX. */
  | "count_rows_mismatch";

export type LearnerAppLessonsHubSummary = {
  catalogMatchTotal: number;
  emptyReason: LearnerAppLessonsHubEmptyReason;
  /** When true, show the generic "no lessons in library" empty surface. */
  showCatalogEmpty: boolean;
  /** When true, show "no matches" (search / topic / pathway) — not the generic catalog-empty message. */
  showFilterMissEmpty: boolean;
  /** Rare: total says rows exist but this page rendered none. */
  showCountMismatchHint: boolean;
};

export function hasActiveLessonsHubFilters(args: {
  qEffective: string | null;
  topicFilter: string | null;
  topicSlugFilter: string | null;
  pathwayIdFilter: string | null;
}): boolean {
  return Boolean(
    (args.qEffective && args.qEffective.trim().length > 0) ||
      (args.topicFilter && args.topicFilter.trim().length > 0) ||
      (args.topicSlugFilter && args.topicSlugFilter.trim().length > 0) ||
      (args.pathwayIdFilter && args.pathwayIdFilter.trim().length > 0),
  );
}

export function buildLearnerAppLessonsHubSummary<T>(args: {
  rows: readonly T[];
  catalogMatchTotal: number;
  qEffective: string | null;
  topicFilter: string | null;
  topicSlugFilter: string | null;
  pathwayIdFilter: string | null;
}): LearnerAppLessonsHubSummary & { resolvedRenderableLessons: readonly T[] } {
  const resolvedRenderableLessons = args.rows;
  const renderedCount = resolvedRenderableLessons.length;
  const catalogMatchTotal = Math.max(0, args.catalogMatchTotal);
  const filters = hasActiveLessonsHubFilters({
    qEffective: args.qEffective,
    topicFilter: args.topicFilter,
    topicSlugFilter: args.topicSlugFilter,
    pathwayIdFilter: args.pathwayIdFilter,
  });

  if (renderedCount > 0) {
    return {
      resolvedRenderableLessons,
      catalogMatchTotal,
      emptyReason: "none",
      showCatalogEmpty: false,
      showFilterMissEmpty: false,
      showCountMismatchHint: false,
    };
  }

  if (catalogMatchTotal > 0) {
    return {
      resolvedRenderableLessons,
      catalogMatchTotal,
      emptyReason: "count_rows_mismatch",
      showCatalogEmpty: false,
      showFilterMissEmpty: filters,
      showCountMismatchHint: true,
    };
  }

  if (filters) {
    return {
      resolvedRenderableLessons,
      catalogMatchTotal,
      emptyReason: "search_or_filters_no_matches",
      showCatalogEmpty: false,
      showFilterMissEmpty: true,
      showCountMismatchHint: false,
    };
  }

  return {
    resolvedRenderableLessons,
    catalogMatchTotal,
    emptyReason: "catalog_empty",
    showCatalogEmpty: true,
    showFilterMissEmpty: false,
    showCountMismatchHint: false,
  };
}
