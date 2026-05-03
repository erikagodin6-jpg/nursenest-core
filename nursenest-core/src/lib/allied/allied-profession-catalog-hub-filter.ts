import type { LessonInput } from "@/lib/lessons/pathway-lesson-catalog-sync";
import { isAlliedMarketingCorePathwayId } from "@/lib/lessons/canonical-lessons-hubs";
import { catalogLessonInputBelongsToAlliedProfession } from "@/lib/allied/allied-profession-lesson-exclusive-scope";

/**
 * Marketing allied profession hubs: when `alliedProfessionKey` is set on the hub, only lessons that
 * explicitly match that key **or** resolve to this profession under exclusive per-topic ownership
 * (see {@link catalogLessonInputBelongsToAlliedProfession}) are listed. There is **no** fallback to
 * the full shared catalog for keyed hubs.
 */
export function filterCatalogLessonsForAlliedProfessionHub(
  rows: LessonInput[],
  alliedProfessionKey: string | undefined,
  pathwayId: string | undefined,
): LessonInput[] {
  const key = alliedProfessionKey?.trim().toLowerCase();
  if (!key) return rows;
  const pid = pathwayId?.trim() ?? "";
  if (!pid) return [];
  if (!isAlliedMarketingCorePathwayId(pid)) {
    return rows.filter((r) => (r.alliedProfessionKey ?? "").trim().toLowerCase() === key);
  }
  return rows.filter((r) => catalogLessonInputBelongsToAlliedProfession(r, pid, key));
}
