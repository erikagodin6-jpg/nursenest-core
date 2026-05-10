/**
 * Bundled static corpus + repo long-tail markdown supplements for public blog merge paths.
 * Live DB slugs win on overlap (see {@link fetchLiveBlogSlugsOverlappingSupplementSlugs} in `safe-blog-queries.ts`).
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

export function resolveSupplementPublishedSlug(slug: string): "static-corpus" | "longtail" | null {
  const trimmed = slug.trim();
  if (!trimmed) return null;
  if (getStaticBlogPost(trimmed)) return "static-corpus";
  const lt = listBlogStaticLongtailRecords().find((r) => r.slug.trim() === trimmed);
  return lt ? "longtail" : null;
}

/** Slugs from bundled static + longtail that carry `tag` (bounded union for overlap `IN` queries). */
export function supplementSlugsForTagOverlapQuery(tag: string): string[] {
  const needle = tag.trim().toLowerCase();
  if (!needle) return [];
  const seen = new Set<string>();
  const out: string[] = [];
  const tagHit = (tags: string[] | undefined) =>
    (tags ?? []).some((t) => t.trim().toLowerCase() === needle);
  for (const p of listStaticBlogPostsForIndex()) {
    if (!tagHit(p.tags)) continue;
    const s = p.slug.trim();
    if (!s || seen.has(s)) continue;
    seen.add(s);
    out.push(s);
  }
  for (const r of listBlogStaticLongtailRecords()) {
    if (!tagHit(r.tags)) continue;
    const s = r.slug.trim();
    if (!s || seen.has(s)) continue;
    seen.add(s);
    out.push(s);
  }
  return out;
}

/** Slugs from bundled static + longtail in `category` (trimmed equality). */
export function supplementSlugsForCategoryOverlapQuery(category: string): string[] {
  const cat = category.trim();
  if (!cat) return [];
  const seen = new Set<string>();
  const out: string[] = [];
  for (const p of listStaticBlogPostsForIndex()) {
    if ((p.category ?? "").trim() !== cat) continue;
    const s = p.slug.trim();
    if (!s || seen.has(s)) continue;
    seen.add(s);
    out.push(s);
  }
  for (const r of listBlogStaticLongtailRecords()) {
    if ((r.category ?? "").trim() !== cat) continue;
    const s = r.slug.trim();
    if (!s || seen.has(s)) continue;
    seen.add(s);
    out.push(s);
  }
  return out;
}

export function supplementBlogIndexMergeRowsForTag(tag: string, liveOverlap: Set<string>): BlogIndexMergeRow[] {
  const needle = tag.trim().toLowerCase();
  if (!needle) return [];
  const rows: BlogIndexMergeRow[] = [];
  const tagHit = (tags: string[] | undefined) =>
    (tags ?? []).some((t) => t.trim().toLowerCase() === needle);
  for (const p of listStaticBlogPostsForIndex()) {
    const s = p.slug.trim();
    if (!s || liveOverlap.has(s) || !tagHit(p.tags)) continue;
    rows.push(staticRecordToBlogIndexMergeRow(p));
  }
  const staticSlugSet = new Set(
    listStaticBlogPostsForIndex()
      .map((p) => p.slug.trim())
      .filter(Boolean),
  );
  for (const r of listBlogStaticLongtailRecords()) {
    const s = r.slug.trim();
    if (!s || liveOverlap.has(s) || staticSlugSet.has(s) || !tagHit(r.tags)) continue;
    rows.push(blogStaticLongtailRecordToBlogIndexMergeRow(r));
  }
  return rows;
}

export function supplementBlogIndexMergeRowsForCategory(category: string, liveOverlap: Set<string>): BlogIndexMergeRow[] {
  const cat = category.trim();
  if (!cat) return [];
  const rows: BlogIndexMergeRow[] = [];
  for (const p of listStaticBlogPostsForIndex()) {
    const s = p.slug.trim();
    if (!s || liveOverlap.has(s) || (p.category ?? "").trim() !== cat) continue;
    rows.push(staticRecordToBlogIndexMergeRow(p));
  }
  const staticSlugSet = new Set(
    listStaticBlogPostsForIndex()
      .map((p) => p.slug.trim())
      .filter(Boolean),
  );
  for (const r of listBlogStaticLongtailRecords()) {
    const s = r.slug.trim();
    if (!s || liveOverlap.has(s) || staticSlugSet.has(s) || (r.category ?? "").trim() !== cat) continue;
    rows.push(blogStaticLongtailRecordToBlogIndexMergeRow(r));
  }
  return rows;
}
