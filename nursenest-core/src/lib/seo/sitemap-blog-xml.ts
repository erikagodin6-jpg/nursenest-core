import "server-only";

import { expectedCanonicalBlogPath } from "@/lib/blog/generated-blog-post-publish";
import { safeServerLog } from "@/lib/observability/safe-server-log";
import { getMergedBlogSitemapSlugRows, getSitemapBlogTagsAndCategories } from "@/lib/blog/safe-blog-queries";
import {
  buildSitemapUrlsetFromAbsoluteUrls,
  minimalUrlsetSingleHome,
  normalizeOrigin,
  resolveSitemapOrigin,
  type SitemapUrlEntry,
} from "@/lib/seo/sitemap-static-xml";
import { logSeoEmittedUrlBatch } from "@/lib/seo/seo-url-emission-audit";

/**
 * Blog slice for merged `/sitemap.xml`: `/blog` plus post URLs from {@link getMergedBlogSitemapSlugRows}
 * (live DB when configured; otherwise the bundled static corpus aligned with `/blog` HTML).
 */
export async function listBlogSitemapUrlsSafe(): Promise<string[]> {
  const entries = await listBlogSitemapEntriesSafe();
  return entries.map((entry) => entry.loc);
}

export async function listBlogSitemapEntriesSafe(): Promise<SitemapUrlEntry[]> {
  const origin = normalizeOrigin(resolveSitemapOrigin());
  const entries: SitemapUrlEntry[] = [{ loc: `${origin}/blog` }];
  const seenLoc = new Set<string>([`${origin}/blog`]);

  /** Sitemaps support at most ~50k URLs per file; split into multiple sitemaps if you exceed this. */
  const SITEMAP_BLOG_CAP = 50_000;
  const rows = await getMergedBlogSitemapSlugRows();
  if (rows.length >= SITEMAP_BLOG_CAP) {
    safeServerLog("seo", "sitemap_blog_url_cap_reached", { cap: SITEMAP_BLOG_CAP });
  }
  let rnHubLastMod: Date | null = null;
  for (const r of rows) {
    const slug = r.slug?.trim();
    if (!slug) continue;
    const career = r.careerSlug?.trim().toLowerCase() ?? null;
    if (career === "rn") {
      const u = r.updatedAt;
      rnHubLastMod = rnHubLastMod == null || u.getTime() > rnHubLastMod.getTime() ? u : rnHubLastMod;
    }
    const path = expectedCanonicalBlogPath(slug, r.careerSlug);
    const loc = `${origin}${path}`;
    if (seenLoc.has(loc)) continue;
    seenLoc.add(loc);
    entries.push({
      loc,
      lastmod: r.updatedAt.toISOString(),
    });
  }
  const rnHub = `${origin}/blog/rn`;
  if (rnHubLastMod && !seenLoc.has(rnHub)) {
    entries.push({ loc: rnHub, lastmod: rnHubLastMod.toISOString() });
  }

  // Tag and category hub pages — discoverable without hitting post-level crawl budget.
  // Empty hubs emit `robots: noindex` at the page level so including them here is safe.
  try {
    const { tags, categories } = await getSitemapBlogTagsAndCategories();
    for (const tag of tags) {
      const loc = `${origin}/blog/tag/${encodeURIComponent(tag)}`;
      if (!seenLoc.has(loc)) { seenLoc.add(loc); entries.push({ loc }); }
    }
    for (const cat of categories) {
      const loc = `${origin}/blog/category/${encodeURIComponent(cat)}`;
      if (!seenLoc.has(loc)) { seenLoc.add(loc); entries.push({ loc }); }
    }
  } catch (e) {
    safeServerLog("seo", "sitemap_blog_tag_category_collection_failed", {
      error: e instanceof Error ? e.message.slice(0, 200) : String(e).slice(0, 200),
    });
  }

  logSeoEmittedUrlBatch("sitemap_blog", entries.map((e) => e.loc), {
    entryCount: String(entries.length),
  });
  return entries;
}

/**
 * Blog sitemap XML wrapper around `listBlogSitemapUrlsSafe`.
 */
export async function buildBlogSitemapXmlSafe(): Promise<string> {
  try {
    const entries = await listBlogSitemapEntriesSafe();
    return buildSitemapUrlsetFromAbsoluteUrls(entries);
  } catch {
    return minimalUrlsetSingleHome();
  }
}
