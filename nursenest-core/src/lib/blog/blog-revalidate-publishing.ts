/**
 * Uses Next `revalidatePath` / `revalidateTag`. Not marked `server-only` so Node `tsx --test` can load the module;
 * do not import from client bundles.
 */
import { revalidatePath, revalidateTag } from "next/cache";

import {
  CACHE_TAG_MARKETING_BLOG_SURFACES,
  CACHE_TAG_MARKETING_PUBLIC_FLASHCARD_TAGS,
  CACHE_TAG_PATHWAY_LESSON_INDEX,
  cacheTagPathwayLessonsHub,
} from "@/lib/cache/cache-tags";
import { buildExamPathwayPath } from "@/lib/exam-pathways/build-exam-pathway-path";
import { listPublishedExamPathwaysForPublicSite } from "@/lib/navigation/country-exam-launch-readiness";

export type BlogPublishingRevalidateOptions = {
  /** Canonical marketing slug — invalidates `/blog/[slug]` (global posts) or scoped detail paths when nursing/allied set */
  slug?: string | null;
  /** When set with `slug`, also invalidates `/allied-health/{key}/blog/{slug}` */
  alliedProfessionKey?: string | null;
  /** Nursing hub career (`rn`, `pn`, `np`). `rn` uses `/blog/rn/{slug}`; others use `/nursing/{career}/blog/{slug}`. */
  nursingCareerSlug?: string | null;
  /** Revalidates `/blog/tag/{tag}` for each value (bounded). */
  tags?: readonly string[] | null;
  /** Revalidates `/blog/{slug}` for each (e.g. cron batch publish; bounded). */
  promotedSlugs?: readonly string[] | null;
};

const MAX_TAG_PATH_REVALIDATIONS = 24;
const MAX_BATCH_SLUG_REVALIDATIONS = 120;

/** Paths touched when blog posts go live or sitemap should refresh (keep aligned with `/api/cron/blog-publish`). */
export function revalidateBlogPublishingSurfaces(options?: BlogPublishingRevalidateOptions): void {
  revalidatePath("/blog");
  revalidatePath("/blog", "layout");
  /** Primary tag for seeded pathophysiology series (`getPathophysiologyBlogHubPosts` hub link). */
  revalidatePath("/blog/tag/pathophysiology");
  revalidatePath("/");
  revalidatePath("/lessons");
  revalidatePath("/flashcards");
  revalidatePath("/sitemap.xml");
  revalidatePath("/sitemap-allied.xml");
  revalidatePath("/sitemap-new-grad.xml");

  const slug = options?.slug?.trim();
  const nursing = options?.nursingCareerSlug?.trim().toLowerCase();
  const allied = options?.alliedProfessionKey?.trim();

  if (slug) {
    if (nursing === "rn") {
      revalidatePath(`/blog/rn/${slug}`);
      revalidatePath("/blog/rn");
    } else if (nursing && nursing !== "rn") {
      revalidatePath(`/nursing/${nursing}/blog/${slug}`);
      revalidatePath(`/nursing/${nursing}/blog`);
    } else {
      revalidatePath(`/blog/${slug}`);
    }
  }

  if (slug && allied) {
    revalidatePath(`/allied-health/${allied}/blog/${slug}`);
  }

  let tagN = 0;
  for (const raw of options?.tags ?? []) {
    if (tagN >= MAX_TAG_PATH_REVALIDATIONS) break;
    const t = raw.trim();
    if (t.length < 1 || t.length > 160) continue;
    revalidatePath(`/blog/tag/${encodeURIComponent(t)}`);
    tagN++;
  }

  let batchN = 0;
  for (const raw of options?.promotedSlugs ?? []) {
    if (batchN >= MAX_BATCH_SLUG_REVALIDATIONS) break;
    const s = raw.trim();
    if (!s) continue;
    revalidatePath(`/blog/${s}`);
    batchN++;
  }

  /**
   * Bust marketing `unstable_cache` layers that may have cached empty payloads during DB outages
   * (flashcard tag list + per-pathway lesson hub lists used by sitemap/ISR surfaces).
   */
  revalidateTag(CACHE_TAG_MARKETING_BLOG_SURFACES, "default");
  revalidateTag(CACHE_TAG_MARKETING_PUBLIC_FLASHCARD_TAGS, "default");
  revalidateTag(CACHE_TAG_PATHWAY_LESSON_INDEX, "default");
  for (const pathway of listPublishedExamPathwaysForPublicSite()) {
    revalidatePath(buildExamPathwayPath(pathway, "lessons"));
    revalidateTag(cacheTagPathwayLessonsHub(pathway.id), "default");
  }
}
