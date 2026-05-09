/**
 * Bundled static corpus + repo long-tail markdown supplements for public blog merge paths.
 * Live DB slugs win on overlap (see {@link fetchLiveBlogSlugsOverlappingSupplementSlugs}).
 */
import type { BlogIndexMergeRow } from "@/lib/blog/blog-public-merge";
import { blogStaticLongtailRecordToBlogIndexMergeRow, staticRecordToBlogIndexMergeRow } from "@/lib/blog/blog-public-merge";
import { listBlogStaticLongtailRecords } from "@/lib/blog/blog-static-longtail-load";
import { getStaticBlogPost, listStaticBlogPostsForIndex } from "@/lib/blog/static-blog-posts";

/** Slugs for overlap queries: bundled static first; long-tail slugs not already in static. */
export function allSupplementSlugsForOverlapQuery(): string[] {
  const staticSlugs = listStaticBlogPostsForIndex()
    .map((p) => p.slug.trim())
    .filter(Boolean);
  const seen = new Set(staticSlugs);
  const out = [...staticSlugs];
  for (const r of listBlogStaticLongtailRecords()) {
    const s = r.slug.trim();
    if (!s || seen.has(s)) continue;
    seen.add(s);
    out.push(s);
  }
  return out;
}

export function buildSupplementBlogIndexRowsExcludingLiveSlugs(liveOverlap: Set<string>): BlogIndexMergeRow[] {
  const rows: BlogIndexMergeRow[] = [];
  for (const p of listStaticBlogPostsForIndex()) {
    const s = p.slug.trim();
    if (!s || liveOverlap.has(s)) continue;
    rows.push(staticRecordToBlogIndexMergeRow(p));
  }
  const staticSlugSet = new Set(
    listStaticBlogPostsForIndex()
      .map((p) => p.slug.trim())
      .filter(Boolean),
  );
  for (const r of listBlogStaticLongtailRecords()) {
    const s = r.slug.trim();
    if (!s || liveOverlap.has(s) || staticSlugSet.has(s)) continue;
    rows.push(blogStaticLongtailRecordToBlogIndexMergeRow(r));
  }
  return rows;
}

export function isGlobalMarketingBlogSupplementScope(scope?: {
  locale?: string;
  careerSlug?: string;
  exam?: string;
}): boolean {
  return !scope?.locale && !scope?.careerSlug && !scope?.exam;
}

export function resolveSupplementPublishedSlug(slug: string): "static-corpus" | "longtail" | null {
  const trimmed = slug.trim();
  if (!trimmed) return null;
  if (getStaticBlogPost(trimmed)) return "static-corpus";
  const lt = listBlogStaticLongtailRecords().find((r) => r.slug.trim() === trimmed);
  return lt ? "longtail" : null;
}
