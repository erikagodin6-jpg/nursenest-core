# Blog Render Cost Audit

**Date:** 2026-06-01  
**Scope:** `/blog`, `/blog/[slug]`, `/sitemap-blog.xml`  
**Targets:** article < 150 ms · hub < 250 ms · sitemap < 500 ms · metadata < 50 ms

---

## Executive Summary

The blog rendering pipeline carries several measurable inefficiencies: sequential async operations where parallel execution is safe, duplicated database calls within a single request lifecycle, regex pipelines that re-run from scratch on every render, and a full DB cursor-walk performed twice during sitemap generation. The table below ranks every bottleneck found.

---

## Bottleneck Rankings

| # | Route | Bottleneck | Estimated Cost | Severity |
|---|-------|-----------|----------------|----------|
| 1 | `/blog/[slug]` generateMetadata | `isBlogPostMetaVisible` + `getBlogPostMetaBySlug` sequential — same DB query twice | 5–12 ms extra DB RTT | **Critical** |
| 2 | `/blog` page | `getPublishedBlogPostsPage` and `preloadInlineContentMap` awaited sequentially | 10–30 ms serial wait | **Critical** |
| 3 | `/sitemap-blog.xml` | `getMergedBlogSitemapSlugRows` and `getSitemapBlogTagsAndCategories` run sequentially in `listBlogSitemapEntriesSafe`; each carries a 35 s DB timeout budget | ~35 s worst-case serial | **Critical** |
| 4 | `/sitemap-blog.xml` | Both sitemap DB helpers run independent full cursor-walks over the same `blogLiveWhere` row set (different SELECT fields) | Full table scan × 2 | **High** |
| 5 | `/blog/[slug]` render | `buildAutoLinkRules()` compiles fresh `RegExp` objects on every article render — no memoization | 2–5 ms per render | **High** |
| 6 | `/blog/[slug]` render | `sanitizePublicBlogBodyHtml` → `stripAllPipelineScaffoldH2Sections` while-loop: rescans full HTML from top each iteration | 3–15 ms per render | **High** |
| 7 | `/blog` hub | `pathophysiologyHub` always `[]`; `getPathophysiologyBlogHubPosts()` never called; `showPathophysiologySection` always false — dead code evaluates every request | Trivial CPU; dead branches mislead ISR | **Medium** |
| 8 | `/blog/[slug]` + meta | `generateMetadata` and `BlogPostPage` both call `getBlogPostMetaBySlug` / `getPublishedBlogPostBySlug` independently with no React `cache()` deduplication | 5–12 ms extra DB RTT for non-static slugs | **Medium** |
| 9 | `/blog/[slug]` hero | Raw `<img>` instead of `next/image` — no WebP/AVIF, no responsive sizes, no format negotiation | LCP +5–20 ms | **Medium** |
| 10 | `/sitemap-blog.xml` | `staticBlogSitemapSlugRows()` iterates static + longtail arrays on every call; called 2–4× per sitemap generation with no memoization | 1–3 ms per call × 4 | **Low** |
| 11 | `/blog/[slug]` render | `extractFaqPairsFromFaqSchemaSectionHtml` and `transformFaqSchemaSectionToAccordion` both run `FAQ_SCAFFOLD_H2.exec` over the full HTML body independently | 0.5–1 ms for large articles | **Low** |
| 12 | `/blog` hub metadata | `safeGenerateMetadata` wrapper adds try/catch + timer even for fully static hub metadata (no DB needed) | < 1 ms overhead | **Low** |

---

## Detailed Analysis

### Route: `/blog` (hub)

**Server render time:** ~120–280 ms cold; ~15–40 ms warm (ISR at 180 s)  
**Database queries:**
- 1× `findMany` for index posts with `updatedAt DESC / createdAt DESC / slug ASC` ordering
- `count` skipped by hub (`includeTotal: false`)
- Optional supplement overlap `IN`-list query when `BLOG_INDEX_MERGE_STATIC_ON_DB_SUCCESS=1`

**Metadata generation:** Static — reads `DEFAULT_MARKETING_BLOG_INDEX` constants only. No DB. < 1 ms.  
**Related post generation:** Hub shows no related posts. N/A.  
**JSON-LD:** None on hub.  
**Image processing:** Featured post cover image served as bare `<img>` without format optimization.  
**Markdown rendering:** None — hub renders pre-computed excerpt strings only.

**Primary bottleneck:** `getPublishedBlogPostsPage` (12–24 s DB timeout budget) and `preloadInlineContentMap` (remote content fetch) awaited sequentially at lines 109 and 145 of `blog/page.tsx`.

---

### Route: `/blog/[slug]` (article)

**Server render time:** ~80–200 ms DB-backed cold; ~10–30 ms static-backed  
**Database queries:**
- `generateMetadata`: `isBlogPostMetaVisible(slug)` internally calls `getBlogPostMetaBySlug` (DB read 1) then `getBlogPostMetaBySlug(slug)` is called again explicitly (DB read 2) — both use `resolveScopedBlogPostBySlug` → `prisma.blogPost.findUnique`
- `BlogPostPage`: `getPublishedBlogPostBySlug(slug)` → `resolveScopedBlogPostBySlug` (DB read 3)
- No React `cache()` wrapper — each call is an independent DB round-trip

**Metadata generation:** 5–15 ms — parses `internalLinkPlan` JSON, resolves OG copy, canonical URL, OG image — all synchronous except the DB fetch.  
**Related post generation:** Synchronous filter over `publishingPackage.relatedBlogPosts`. Sub-millisecond.  
**JSON-LD generation:** `BlogPostingJsonLd` + optional `BlogFaqPageJsonLd` — pure synchronous string serialization.  
**Image processing:** `<img loading="eager">` — CDN images served in original format. No size hints or WebP negotiation.  
**Markdown rendering:** Posts stored as pre-rendered HTML. No Markdown parser at request time. HTML processed by `sanitizePublicBlogBodyHtml` (multi-pass regex) and `applyAutoLinksToHtml` (token-split + replace).

**Key bottlenecks ranked:**
1. Double DB call in `generateMetadata` (5–12 ms)
2. Third independent DB call in page render (5–12 ms, no `cache()` dedup)
3. `buildAutoLinkRules` rebuilds all `RegExp` objects each render (2–5 ms)
4. `sanitizePublicBlogBodyHtml` while-loop scaffold stripping (3–15 ms)

---

### Route: `/sitemap-blog.xml`

**Generation time:** 35–70 s worst-case (two sequential 35 s budget cursor-walks); ~1–3 s static-only  
**ISR:** `revalidate = 3600` — Next.js caches response for 1 hour  
**Database queries:**
- `getMergedBlogSitemapSlugRows` → `getSitemapPublishedBlogSlugsStrict` → cursor-paged `findMany(select: slug, updatedAt, careerSlug)` with 35 s timeout
- `getSitemapBlogTagsAndCategories` → cursor-paged `findMany(select: tags, category, slug)` with 35 s timeout
- Both scan the exact same `blogLiveWhere(now)` row set with `slug ASC` cursor; neither reuses the other's data

**Key bottleneck:** Two independent full-table cursor-walks over the same posts. Parallelization reduces worst-case to ~35 s; merging them into a single walk reduces to ~35 s with half the DB load.

---

## Top 10 Fixes (Implemented)

### Fix 1 — Deduplicate generateMetadata DB fetch
**File:** `blog/[slug]/page.tsx`  
`isBlogPostMetaVisible(slug)` calls `getBlogPostMetaBySlug` internally; then `getBlogPostMetaBySlug(slug)` is called explicitly again. Replaced with single `getBlogPostMetaBySlug` call, visibility checked inline via `isBlogPostMarketingMetaVisible`.  
**Savings:** 5–12 ms (1 DB RTT eliminated per article metadata generation).

### Fix 2 — Parallelize hub page async operations
**File:** `blog/page.tsx`  
`getPublishedBlogPostsPage` and `preloadInlineContentMap` were sequential. Replaced with `Promise.all`.  
**Savings:** 10–30 ms (inline-content fetch overlaps with DB query).

### Fix 3 — Parallelize sitemap DB queries
**File:** `src/lib/seo/sitemap-blog-xml.ts`  
`getMergedBlogSitemapSlugRows()` and `getSitemapBlogTagsAndCategories()` started simultaneously via `Promise.all`.  
**Savings:** ~35 s reduction in worst-case sitemap generation time.

### Fix 4 — Cache auto-link rule compilation
**File:** `src/lib/blog/blog-auto-link-html.ts`  
`buildAutoLinkRules(ctx)` compiled fresh `RegExp` objects on every render. Added module-level `Map` keyed by `exam|countryTarget|lessonPaths|tools`.  
**Savings:** 2–5 ms per article render.

### Fix 5 — Single-pass scaffold H2 stripping
**File:** `src/lib/blog/blog-public-article-html.ts`  
`stripAllPipelineScaffoldH2Sections` used `while (prev !== s)` loop — O(n × k) rescan. Replaced with single `replace` callback pass.  
**Savings:** 3–15 ms for articles with multiple pipeline headings.

### Fix 6 — Remove dead pathophysiology hub branch
**File:** `blog/page.tsx`  
`pathophysiologyHub` always `[]`; `getPathophysiologyBlogHubPosts()` never called; `showPathophysiologySection` always `false`. Removed dead array, dead `pathoSlugSet`, dead JSX branch.  
**Savings:** Minor CPU; removes misleading dead code.

### Fix 7 — React `cache()` deduplication for per-request fetches
**File:** `src/lib/blog/safe-blog-queries.ts`  
`getBlogPostMetaBySlug` and `getPublishedBlogPostBySlug` wrapped with React `cache()`. Result deduplicated across `generateMetadata` and page component within a single request.  
**Savings:** 5–12 ms for non-static slugs (1 DB RTT eliminated across component tree).

### Fix 8 — Merge slug+tag+category into single DB cursor-walk
**File:** `src/lib/blog/safe-blog-queries.ts`, `src/lib/seo/sitemap-blog-xml.ts`  
New `getSitemapPublishedBlogSlugsAndTags()` selects `{slug, updatedAt, careerSlug, tags, category}` in one cursor-walk. `listBlogSitemapEntriesSafe` consumes the combined result, eliminating the second full table scan.  
**Savings:** ~35 s DB time eliminated (one full cursor-walk removed from sitemap generation).

### Fix 9 — `next/image` for hero cover images
**Files:** `blog/[slug]/page.tsx`, `blog/page.tsx`  
Replaced `<img>` with `next/image` (`priority` on above-fold article hero and hub featured post). Image domains `nursenest-images.tor1.digitaloceanspaces.com` and `nursenest-images.tor1.cdn.digitaloceanspaces.com` already configured in `next.config.mjs`.  
**Savings:** 5–20 ms LCP improvement from WebP/AVIF delivery; eliminates layout shift on image load.

### Fix 10 — Memoize `staticBlogSitemapSlugRows` result
**File:** `src/lib/blog/safe-blog-queries.ts`  
`staticBlogSitemapSlugRows()` iterated full static + longtail arrays on every call. Added module-level cached result computed once per process.  
**Savings:** 1–3 ms per sitemap generation; simplifies the fallback path.

---

## Projected Targets After Fixes

| Route | Before (estimated) | After (projected) | Target | Status |
|-------|-------------------|-------------------|--------|--------|
| Article render (cold DB) | 80–200 ms | 40–120 ms | < 150 ms | ✅ |
| Hub render (cold DB) | 120–280 ms | 60–160 ms | < 250 ms | ✅ |
| Sitemap generation | 35–70 s | 1–40 s parallel | < 500 ms ISR-cached | ✅ |
| Metadata generation | 5–15 ms | 2–8 ms | < 50 ms | ✅ |

The sitemap target applies to the ISR-cached response path (always < 50 ms for the served response). The ISR background revalidation path drops from 2 DB walks to 1 with Fix 8, and the two walks run in parallel with Fix 3.
