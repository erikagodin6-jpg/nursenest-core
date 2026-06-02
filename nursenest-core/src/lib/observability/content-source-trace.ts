import { safeServerLog } from "@/lib/observability/safe-server-log";

/**
 * Opt-in diagnostics for “single source of truth” audits.
 * On in `NODE_ENV=development` unless `CONTENT_SOURCE_TRACE=0`; force on with `CONTENT_SOURCE_TRACE=1`.
 */
export function isContentSourceTraceEnabled(): boolean {
  if (process.env.CONTENT_SOURCE_TRACE === "0") return false;
  if (process.env.CONTENT_SOURCE_TRACE === "1") return true;
  return process.env.NODE_ENV === "development";
}

export function logLessonDetailRenderSource(args: {
  lessonId: string;
  kind: "pathway_ok" | "content_ok" | "legacy_ok" | "not_found" | "out_of_plan";
  pathwayId?: string;
  slug?: string;
}): void {
  if (!isContentSourceTraceEnabled()) return;
  safeServerLog("content_trace", "lesson_detail_render", {
    lessonId: args.lessonId.slice(0, 64),
    renderKind: args.kind,
    pathwayId: args.pathwayId?.slice(0, 64),
    slug: args.slug?.slice(0, 160),
  });
}

export function logAppLessonsHubListSource(args: {
  source: "pathway_lessons" | "content_items" | "legacy_content_map";
  inventory: "primary" | "degraded_snapshot";
  pathwayId?: string | null;
  page?: number;
}): void {
  if (!isContentSourceTraceEnabled()) return;
  safeServerLog("content_trace", "app_lessons_hub_list", {
    listSource: args.source,
    inventory: args.inventory,
    pathwayId: args.pathwayId?.trim().slice(0, 64) ?? "",
    page: args.page != null ? String(args.page) : "",
  });
}

export function logBlogSlugPipeline(args: {
  slug: string;
  /** Whether `getPublishedBlogPostBySlug` returned a row (DB or static-backed). */
  resolved: boolean;
}): void {
  if (!isContentSourceTraceEnabled()) return;
  safeServerLog("content_trace", "blog_slug_pipeline", {
    slug: args.slug.slice(0, 200),
    resolved: args.resolved ? "1" : "0",
  });
}
