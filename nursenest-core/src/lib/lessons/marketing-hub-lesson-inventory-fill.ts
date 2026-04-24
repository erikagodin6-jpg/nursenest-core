import type { PathwayLessonRecord } from "@/lib/lessons/pathway-lesson-types";
import { pathwayLessonHasRenderableHubSlug, pathwayLessonMarketingDetailHref } from "@/lib/lessons/pathway-lesson-types";

/** Marketing hub: avoid an empty-looking grid when verify is strict but the loader still has linkable rows. */
export const MARKETING_HUB_MIN_VISIBLE_LESSONS = 12;

/**
 * When verify returns fewer than `minVisible` cards but the pathway loader still has inventory,
 * append additional **linkable** rows from prepared/loader lists (marked degraded — detail may still gate).
 */
export function fillMarketingHubLessonsToMinimumVisible(args: {
  minVisible: number;
  lessonsBasePath: string;
  verifiedKept: PathwayLessonRecord[];
  hubCurriculumPrepared: PathwayLessonRecord[];
  loaderRenderable: PathwayLessonRecord[];
}): { lessons: PathwayLessonRecord[]; filledFromInventory: number } {
  const min = Math.max(0, Math.floor(args.minVisible));
  const out = [...args.verifiedKept];
  if (out.length >= min) return { lessons: out, filledFromInventory: 0 };

  const seen = new Set(out.map((l) => l.slug.trim()));
  let filled = 0;
  const candidates = [...args.hubCurriculumPrepared, ...args.loaderRenderable];

  for (const row of candidates) {
    if (out.length >= min) break;
    if (!pathwayLessonHasRenderableHubSlug(row)) continue;
    const slug = row.slug.trim();
    if (seen.has(slug)) continue;
    if (pathwayLessonMarketingDetailHref(args.lessonsBasePath, slug) == null) continue;
    seen.add(slug);
    out.push({
      ...row,
      hubMarketingDegraded: true,
      hubMarketingDegradedReason: "unverified_inventory_fill",
    });
    filled += 1;
  }

  return { lessons: out, filledFromInventory: filled };
}
