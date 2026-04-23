/**
 * `/app/lessons` hub list source selection.
 *
 * Pathway lessons are paginated with {@link paginatePathwayLessonsForAppSubscriberHubMatchingDetailResolver},
 * so every listed row matches `/app/lessons/[id]` pathway resolution. `content_items` uses a different
 * resolver on detail — prefer pathway whenever any entitled pathway row exists so the hub never
 * surfaces dead pathway links ahead of the canonical list.
 */
export type AppLessonsHubListSource = "pathway_lessons" | "content_items" | "legacy_content_map";

export function pickAppLessonsHubListSource(args: {
  pathwaySampleExists: boolean;
  contentTotal: number;
  pathwayIdFilter: string | null | undefined;
}): AppLessonsHubListSource {
  if (args.pathwaySampleExists) return "pathway_lessons";
  if (args.contentTotal > 0 && !args.pathwayIdFilter) return "content_items";
  return "legacy_content_map";
}
