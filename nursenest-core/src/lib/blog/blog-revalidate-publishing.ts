import "server-only";

import { revalidatePath, revalidateTag } from "next/cache";

import {
  CACHE_TAG_MARKETING_PUBLIC_FLASHCARD_TAGS,
  cacheTagPathwayLessonsHub,
} from "@/lib/cache/cache-tags";
import { listPublishedExamPathwaysForPublicSite } from "@/lib/navigation/country-exam-launch-readiness";

export type BlogPublishingRevalidateOptions = {
  /** Canonical marketing slug — invalidates `/blog/[slug]` */
  slug?: string | null;
  /** When set with `slug`, also invalidates `/allied-health/{key}/blog/{slug}` */
  alliedProfessionKey?: string | null;
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
  revalidatePath("/sitemap.xml");

  const slug = options?.slug?.trim();
  if (slug) {
    revalidatePath(`/blog/${slug}`);
  }

  const allied = options?.alliedProfessionKey?.trim();
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
  revalidateTag(CACHE_TAG_MARKETING_PUBLIC_FLASHCARD_TAGS);
  for (const pathway of listPublishedExamPathwaysForPublicSite()) {
    revalidateTag(cacheTagPathwayLessonsHub(pathway.id));
  }
}
