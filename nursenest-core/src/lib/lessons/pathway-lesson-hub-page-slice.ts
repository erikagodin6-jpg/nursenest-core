import { maxSafeOffsetPage } from "@/lib/api/api-pagination-limits";
import type { PathwayLessonRecord } from "@/lib/lessons/pathway-lesson-types";
import { PATHWAY_HUB_PAGE_SIZE_MAX } from "@/lib/lessons/pathway-lesson-scale";

export type HubRenderablePageSlice = {
  items: PathwayLessonRecord[];
  total: number;
  page: number;
  pageSize: number;
  pageCount: number;
};

function clampPageSize(pageSize: number): number {
  return Math.min(PATHWAY_HUB_PAGE_SIZE_MAX, Math.max(1, Math.floor(pageSize)));
}

function clampPage(page: number): number {
  return Math.max(1, Math.floor(page));
}

/**
 * Offset-pagination for an already-normalized marketing hub lesson list.
 * `total` always equals `renderableAll.length` — use this so header counts and list slices cannot disagree.
 */
export function sliceNormalizedHubLessons(
  renderableAll: PathwayLessonRecord[],
  page: number,
  pageSize: number,
): HubRenderablePageSlice {
  const ps = clampPageSize(pageSize);
  const p = Math.min(clampPage(page), maxSafeOffsetPage(ps));
  const total = renderableAll.length;
  const pageCount = Math.max(1, Math.ceil(total / ps) || 1);
  const safePage = Math.min(p, pageCount);
  const start = (safePage - 1) * ps;
  const items = renderableAll.slice(start, start + ps);
  return { items, total, page: safePage, pageSize: ps, pageCount };
}
