import type { ContentRegistryId } from "./content-registry";
import { CONTENT_REGISTRY } from "./content-registry";

export type ContentRouteContext = {
  locale?: string;
  /** Marketing hub slug segment, e.g. `nursing` or country slug (`{hubSlug}`). */
  marketingSlug?: string;
  /** Alias for marketing hub slug in templates. */
  hubSlug?: string;
  examCode?: string;
  pathwayId?: string;
  /** Pathway lesson DB id (cuid) for learner lesson detail. */
  pathwayLessonId?: string;
  lessonSlug?: string;
  blogSlug?: string;
  /** OSCE public slug (stable station id string). */
  osceStationSlug?: string;
};

export type ResolvedContentRoutes = {
  contentType: ContentRegistryId;
  contentId: string;
  publicRoute: string | null;
  learnerRoute: string | null;
  adminEditRoute: string | null;
  adminCreateRoute: string | null;
  canonicalSource: string | null;
  pathwayId: string | null;
  /** True when registry marks VERIFIED and canonical storage is non-null. */
  isLive: boolean;
};

function fill(pattern: string | null, ctx: ContentRouteContext, contentId: string): string | null {
  if (pattern == null) return null;
  let out = pattern;
  out = out.replaceAll("{locale}", ctx.locale ?? "{locale}");
  const hub = ctx.hubSlug ?? ctx.marketingSlug;
  out = out.replaceAll("{hubSlug}", hub ?? "{hubSlug}");
  out = out.replaceAll("{examCode}", ctx.examCode ?? "{examCode}");
  out = out.replaceAll("{lessonSlug}", ctx.lessonSlug ?? contentId);
  out = out.replaceAll("{pathwayLessonId}", ctx.pathwayLessonId ?? contentId);
  out = out.replaceAll("{id}", contentId);
  out = out.replaceAll("{stationId}", ctx.osceStationSlug ?? contentId);
  out = out.replaceAll("{slugOrId}", contentId);
  out = out.replaceAll("{blogSlug}", ctx.blogSlug ?? contentId);
  return out;
}

/**
 * Resolve stable admin / public / learner route templates for audits, migrations, and tests.
 * Patterns come from {@link CONTENT_REGISTRY}; placeholders are best-effort string replace.
 */
export function resolveContentRoutes(
  contentType: ContentRegistryId,
  contentId: string,
  ctx: ContentRouteContext = {},
): ResolvedContentRoutes {
  const row = CONTENT_REGISTRY[contentType];
  const isLive = row.verificationStatus === "VERIFIED" && Boolean(row.canonicalStorageModel);

  return {
    contentType,
    contentId,
    publicRoute: fill(row.publicReadRoutePattern, ctx, contentId),
    learnerRoute: fill(row.learnerReadRoutePattern, ctx, contentId),
    adminEditRoute: row.adminEditRoute,
    adminCreateRoute: row.adminCreateRoute,
    canonicalSource: row.canonicalStorageModel,
    pathwayId: ctx.pathwayId ?? null,
    isLive,
  };
}
