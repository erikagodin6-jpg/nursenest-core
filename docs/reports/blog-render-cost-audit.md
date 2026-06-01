# Blog Render Cost Audit
**Generated:** 2026-06-01  
**Scope:** `/blog` hub · `/blog/[slug]` article · `/sitemap-blog.xml`  
**Targets:** article < 150ms · hub < 250ms · sitemap < 500ms · metadata < 50ms

---

## Executive Summary

| Route | Bottleneck Category | Estimated Cold Render | Root Cause |
|---|---|---|---|
| `/blog` (hub) | DB + sequential I/O | ~180–320ms | Two serial awaits; pathophysiology dead branch |
| `/blog/[slug]` (article) | Duplicate DB fetch + HTML processing | ~120–400ms | Double `getBlogPostMetaBySlug` in metadata; no request-scoped dedup; multi-pass regex |
| `/sitemap-blog.xml` | Two serial DB cursor-walks | ~35–70s cold | Sequential slug + tag/category scans; each 35s timeout |
| Metadata generation | Double DB round-trip | ~10–25ms extra | `isBlogPostMetaVisible` internally calls `getBlogPostMetaBySlug`, then caller calls it again |

---

## Bottleneck Inventory (Ranked by Impact)

### B1 — Duplicate DB read in `generateMetadata` (CRITICAL)
**File:** `blog/[slug]/page.tsx` lines 65–68  
**Cost:** +1 full DB round-trip per uncached article render (~5–15ms)

```ts
// BEFORE — two sequential DB calls for the same row
const visible = await isBlogPostMetaVisible(slug);   // internally calls getBlogPostMetaBySlug → DB
if (!visible) return {};
const post = await getBlogPostMetaBySlug(slug);       // DB again, same slug
```

`isBlogPostMetaVisible` is a thin wrapper that calls `getBlogPostMetaBySlug` then runs `isBlogPostMarketingMetaVisible` on the result. The caller immediately calls `getBlogPostMetaBySlug` again. For any DB-backed post this is 2 Prisma queries for 1 row.

---

### B2 — Sequential `getPublishedBlogPostsPage` + `preloadInlineContentMap` on hub (HIGH)
**File:** `blog/page.tsx` lines 109–145  
**Cost:** adds 5–30ms to every hub render (the two calls are fully independent)

```ts
// BEFORE — sequential
const { posts, ... } = await getPublishedBlogPostsPage(...);
// ... 30 lines of synchronous work ...
const blogInlinePreloaded = await preloadInlineContentMap([...BLOG_INLINE_KEYS]);
```

`preloadInlineContentMap` fetches 3 inline CMS strings and is fully independent of the post list.

---

### B3 — Two serial DB cursor-walks in sitemap generation (CRITICAL for sitemap)
**File:** `sitemap-blog-xml.ts` lines 31 & 68  
**Cost:** doubles sitemap cold-generation time (~35s → ~70s worst case)

```ts
// BEFORE — sequential
const rows = await getMergedBlogSitemapSlugRows();          // 35s timeout, cursor-walks entire table
// ...processes rows...
const { tags, categories } = await getSitemapBlogTagsAndCategories(); // 35s timeout, SECOND cursor-walk
```

Both functions independently page through every live `BlogPost` row with a 35-second budget. They are structurally independent and can run in parallel.

---

### B4 — Auto-link rules rebuilt from scratch on every article render (MEDIUM)
**File:** `blog-auto-link-html.ts` line 107 → `buildAutoLinkRules(ctx)`  
**Cost:** ~2–5ms per render — allocates new `RegExp` objects, sorts, dedupes for every single page view

`buildAutoLinkRules` constructs an array of `new RegExp(...)` calls, sorts by length, and dedupes on every invocation. The inputs (exam, countryTarget, relatedLessonPaths, relatedTools) are stable across ISR renders of the same post.

---

### B5 — `sanitizePublicBlogBodyHtml` multi-pass while-loop for scaffold H2 stripping (MEDIUM)
**File:** `blog-public-article-html.ts` lines 164–172  
**Cost:** O(n²) for HTML with many H2 sections — rescans from character 0 after each strip

```ts
function stripAllPipelineScaffoldH2Sections(html: string): string {
  let s = html;
  let prev = "";
  while (prev !== s) {    // restarts full scan after each match
    prev = s;
    s = stripFirstPredicateH2Section(s, isPipelineOnlyPublicH2Inner);
  }
  return s;
}
```

For a 10,000-word article with 5 scaffold H2s this runs 5 full `/<h2[^>]*>/gi` scans.

---

### B6 — `getMergedBlogSitemapSlugRows` + `getSitemapBlogTagsAndCategories` each scan static corpus independently (MEDIUM-sitemap)
**File:** `safe-blog-queries.ts` lines 1679–1691 and 1768–1776  
**Cost:** Two O(n) iterations over the same static corpus arrays per sitemap request

`staticBlogSitemapSlugRows()` iterates `listStaticBlogPostsForIndex()` and `listBlogStaticLongtailRecords()`. `getSitemapBlogTagsAndCategories()` also iterates both. The result of `staticBlogSitemapSlugRows()` is not memoized at the module level.

---

### B7 — Dead pathophysiology hub initialization on every hub render (LOW)
**File:** `blog/page.tsx` line 112  
**Cost:** ~0ms but allocates an empty array, builds two Sets, and evaluates a dead conditional on every render

```ts
const pathophysiologyHub: typeof posts = [];   // always empty — getPathophysiologyBlogHubPosts() never called
// ...
const pathoSlugSet = new Set(pathophysiologyHub.map((p) => p.slug));   // always empty Set
const showPathophysiologySection = pathophysiologyHub.length > 0;      // always false
```

The pathophysiology spotlight section is never rendered. The three variables and their derived logic are dead code.

---

### B8 — No request-scoped deduplication between `generateMetadata` and page render (MEDIUM)
**File:** `blog/[slug]/page.tsx` — `generateMetadata` fetches meta, page component fetches full post  
**Cost:** 2 separate DB reads for the same slug within one HTTP request (~5–15ms per article)

Next.js App Router calls `generateMetadata` and the page component as separate async invocations. Without React `cache()` wrapping the DB fetch, Prisma executes two queries per request for the same slug row.

---

### B9 — Cover images use `<img>` instead of `next/image` (MEDIUM — LCP)
**File:** `blog/[slug]/page.tsx` lines 275–278; `blog/page.tsx` lines 250–255  
**Cost:** no automatic WebP/AVIF conversion, no responsive `srcset`, no blur placeholder. Cover image is above-fold (LCP element).

---

### B10 — `staticBlogSitemapSlugRows()` result not memoized (LOW-sitemap)
**File:** `safe-blog-queries.ts` line 1679  
**Cost:** Re-iterates static corpus arrays on every call within the same process — called up to 3 times per sitemap generation (getMergedBlogSitemapSlugRows, error retry, fallback)

---

## Fix Implementation Summary

| # | File(s) | Technique | Expected Saving |
|---|---|---|---|
| 1 | `blog/[slug]/page.tsx` | Inline `getBlogPostMetaBySlug` once in `generateMetadata`; drop `isBlogPostMetaVisible` call | −1 DB RTT per uncached article |
| 2 | `blog/page.tsx` | `Promise.all([getPublishedBlogPostsPage, preloadInlineContentMap])` | −10–30ms hub render |
| 3 | `sitemap-blog-xml.ts` | `Promise.all([getMergedBlogSitemapSlugRows, getSitemapBlogTagsAndCategories])` | −35s sitemap (serial→parallel) |
| 4 | `blog-auto-link-html.ts` | Module-level `Map` keyed by (exam, country, paths, tools) | −2–5ms per article |
| 5 | `blog-public-article-html.ts` | Single-pass scaffold H2 strip via `replace` + callback | −O(n²)→O(n) HTML processing |
| 6 | `blog/page.tsx` | Remove dead `pathophysiologyHub` array, `pathoSlugSet`, `showPathophysiologySection` | Code clarity + tiny allocations |
| 7 | `safe-blog-queries.ts` | Wrap `getBlogPostMetaBySlug` and `getPublishedBlogPostBySlug` with React `cache()` | −1 DB RTT when meta+body served in same request |
| 8 | `safe-blog-queries.ts` + `sitemap-blog-xml.ts` | Single DB cursor-walk combining slug + tag/category columns | −1 full table scan per sitemap |
| 9 | `blog/[slug]/page.tsx` + `blog/page.tsx` | Replace `<img>` with `next/image` for cover images | LCP improvement; CDN format negotiation |
| 10 | `safe-blog-queries.ts` | Module-level memo for `staticBlogSitemapSlugRows()` result | Eliminate repeated static corpus iteration |

---

## Revised Performance Budget (Post-Fix Estimates)

| Route | Before | After | Target |
|---|---|---|---|
| `/blog` hub | 180–320ms | 100–160ms | < 250ms ✅ |
| `/blog/[slug]` article | 120–400ms | 80–150ms | < 150ms ✅ |
| `/sitemap-blog.xml` cold | 35–70s | 35–40s | < 500ms (ISR cached after first hit) |
| Metadata generation | 15–30ms | 5–15ms | < 50ms ✅ |

> **Note on sitemap:** The 35-second figure reflects the DB cursor-walk timeout when the database contains thousands of posts. The `revalidate = 3600` ISR means this only runs once per hour; the served response is the cached XML. The target of < 500ms applies to the *cached* response, which is already met. Fix 3 + Fix 8 reduce the background *regeneration* latency.
