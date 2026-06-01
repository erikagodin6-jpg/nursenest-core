import "server-only";

import { getCatalogPathwayLessonsSync } from "@/lib/lessons/pathway-lesson-catalog-sync";
import { safeServerLog } from "@/lib/observability/safe-server-log";

/**
 * Infers the primary pathway ID from a subscriber's entitlement when no explicit
 * pathway is available (e.g., generic lesson list). Used only for tertiary fallback.
 */
function inferPathwayFromEntitlement(tier: string, country: string): string | null {
  const c = (country ?? "").toUpperCase();
  const t = (tier ?? "").toUpperCase();
  if (c === "CA") {
    if (t === "RPN") return "ca-rpn-rexpn";
    if (t === "NP") return "ca-np-cnple";
    return "ca-rn-nclex-rn";
  }
  if (c === "US") {
    if (t === "NP") return "us-np-fnp";
    if (t === "LVN_LPN") return "us-pn-nclex-pn";
    return "us-rn-nclex-rn";
  }
  return null;
}

export type CatalogLessonListItem = {
  id: string;
  slug: string | null;
  title: string;
  summary: string | undefined;
};

export type CatalogLessonListResult = {
  page: number;
  pageSize: number;
  total: number;
  pageCount: number;
  lessons: CatalogLessonListItem[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
  mode: "subscriber";
  source_used: "tertiary";
  fallback_reason: string;
  pagination: {
    mode: "offset";
    pageSize: number;
    hasMore: boolean;
    totalCount: number;
    page: number;
    maxPage: number;
  };
};

/**
 * Synthesizes a lesson list from catalog JSON when the DB and all snapshots are unavailable.
 * Returns null if no catalog lessons exist for the inferred pathway.
 *
 * Progress-based data (recent, bookmarks) is not available — learners get a raw catalog list.
 */
export function buildLessonsListCatalogFallback(params: {
  tier: string;
  country: string;
  page: number;
  pageSize: number;
  reason: string;
}): CatalogLessonListResult | null {
  try {
    const pathwayId = inferPathwayFromEntitlement(params.tier, params.country);
    if (!pathwayId) return null;

    const lessons = getCatalogPathwayLessonsSync(pathwayId);
    if (!lessons || lessons.length === 0) return null;

    const total = lessons.length;
    const pageCount = Math.max(1, Math.ceil(total / params.pageSize));
    const clampedPage = Math.min(params.page, pageCount);
    const skip = (clampedPage - 1) * params.pageSize;
    const slice = lessons.slice(skip, skip + params.pageSize);

    const items: CatalogLessonListItem[] = slice.map((l) => ({
      id: `catalog:${l.slug}`,
      slug: l.slug ?? null,
      title: l.title,
      summary: undefined,
    }));

    safeServerLog("study_delivery", "self_healing_fallback", {
      surface: "lesson_list",
      from_tier: "secondary",
      to_tier: "tertiary",
      pathway_id: pathwayId,
      tier: params.tier,
      country: params.country,
      reason: params.reason,
      cards_served: items.length,
      source: "catalog_virtual",
    });

    return {
      page: clampedPage,
      pageSize: params.pageSize,
      total,
      pageCount,
      lessons: items,
      totalCount: total,
      currentPage: clampedPage,
      totalPages: pageCount,
      mode: "subscriber",
      source_used: "tertiary",
      fallback_reason: params.reason,
      pagination: {
        mode: "offset",
        pageSize: params.pageSize,
        hasMore: clampedPage < pageCount,
        totalCount: total,
        page: clampedPage,
        maxPage: pageCount,
      },
    };
  } catch (err) {
    safeServerLog("study_delivery", "catalog_fallback_error", {
      surface: "lesson_list",
      tier: params.tier,
      country: params.country,
      error: err instanceof Error ? err.message.slice(0, 200) : "unknown",
    });
    return null;
  }
}
