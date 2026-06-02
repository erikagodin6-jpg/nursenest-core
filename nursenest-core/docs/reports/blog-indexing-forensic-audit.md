# Blog Indexing Forensic SEO Audit
**Date:** 2026-05-12  
**Scope:** Full blog system — `/blog`, `/blog/[slug]`, `/blog/rn/[slug]`, `/blog/tag/[tag]`, `/blog/category/[category]`, multilingual blog, allied-health blog, sitemap infrastructure, robots.txt, structured data, ISR/revalidation pipeline.

---

## Executive Summary

The NurseNest blog system is architecturally sound but had **5 concrete indexing blockers** that were fixed in this audit. The most serious was a **silent duplicate-content loop**: career-scoped blog posts (e.g., `careerSlug=rn`) were accessible at both `/blog/{slug}` (non-canonical) and `/blog/rn/{slug}` (canonical sitemap URL), with each declaring itself canonical. Google would see the same body at two conflicting self-declared canonicals — a classic duplicate-without-user-selected-canonical GSC warning. Other confirmed issues included missing Twitter/OG image metadata on the main blog post template, a pagination canonical bug on the blog index, stale sitemap CDN caching after publish, and tag/category hub pages absent from all sitemaps.

No noindex bugs were found on live posts. robots.txt, structured data, ISR config, and the auth-surface exclusion logic are all correct.

---

## Part 1 — Indexing Failures

### 1.1 noindex / x-robots-tag audit
**Status: CLEAN**

- `safeGenerateMetadata` in `src/lib/seo/safe-marketing-metadata.ts` enforces `robots: { index: true, follow: true }` for all route groups in `BLOG_ROUTE_GROUPS_FORCE_INDEX_FOLLOW`. This set covers the main blog index, post pages, tag pages, localized blog, and allied-health blog post pages.
- The only deliberate noindex emitted on blog surfaces is on tag/category hub pages when `count === 0` (correct thin-content guard) and on multilingual posts that have not passed quality review (`evaluateMultilingualBlogIndexability`).
- No accidental x-robots-tag emission found in any route handler.

### 1.2 Canonical to wrong URL — FIXED

**Root cause:** `getPublishedBlogPostBySlug(slug)` called with no scope in `/blog/[slug]/page.tsx` returns **any** post matching that slug, including posts whose `careerSlug` is `rn`, `pn`, `np`, or an allied-health profession. `expectedCanonicalBlogPath` routes these to `/blog/rn/{slug}`, `/nursing/{career}/blog/{slug}`, or `/allied-health/{profession}/blog/{slug}`. The default page was setting `canonical = /blog/{slug}` via `resolvePublicCanonicalUrl` while the sitemap listed the career-scoped path.

**Impact:** Every career-scoped post was simultaneously accessible at two URLs. Google would see "duplicate without user-selected canonical" because each URL declared itself canonical. Affected posts unable to consolidate link equity, potentially suppressed in SERPs.

**Fix applied (`src/app/(marketing)/(default)/blog/[slug]/page.tsx`):**
```typescript
const canonicalPath = expectedCanonicalBlogPath(slug, post.careerSlug);
if (canonicalPath !== `/blog/${slug}`) redirect(canonicalPath);
```
Career-scoped posts now 307-redirect to their canonical URL the moment the server renders the page. Google follows the redirect and consolidates to the single canonical.

### 1.3 Canonical to homepage — NOT FOUND
No evidence of blog posts canonicalizing to `/`. `resolvePublicCanonicalUrl` always produces `/blog/{slug}` unless `seo.canonicalPath` is set, and `sanitizeCanonicalPath` rejects any value that is not exactly `/blog/{slug}`.

### 1.4 Blog pages in sitemap — CONFIRMED
`/sitemap-blog.xml` is served via a dedicated `force-dynamic` route handler that reads from DB (`getMergedBlogSitemapSlugRows`) with a static-corpus fallback. The sitemap index at `/sitemap.xml` lists `/sitemap-blog.xml`. Posts are included once they pass `blogLiveWhere` (postStatus=PUBLISHED with workflowStatus=PUBLISHED, or APPROVED, or SCHEDULED past publishAt).

### 1.5 HTTP 200 — CONFIRMED
Blog post pages return 200 for live posts, 404 via `notFound()` for posts failing `blogLiveWhere`, and now 307 for career-scoped posts. No 503 risk on the blog post route (ISR cached; DB timeout falls back to static corpus).

### 1.6 Server-rendered HTML — CONFIRMED
All blog post pages are Next.js Server Components with `revalidate = 3600`. Initial HTML response includes full article body via `dangerouslySetInnerHTML`. No client-only rendering of body content. Google can read full article text without JS.

---

## Part 2 — Sitemap Governance

### 2.1 Architecture
The sitemap hierarchy:
```
/sitemap.xml (index)
  ├── /sitemap-core.xml       — homepage, pricing, lessons, programmatic SEO
  ├── /sitemap-blog.xml       — /blog, all canonical post URLs, tag/category hubs [FIXED]
  ├── /sitemap-fr-blog.xml    — French multilingual blog registry entries
  ├── /sitemap-es-blog.xml    — Spanish multilingual blog registry entries
  ├── /sitemap-pathways.xml   — exam hubs, pathway topics, lesson hubs
  ├── /sitemap-lessons.xml    — lesson detail pages
  ├── /sitemap-localized.xml  — /{locale}/… pages for tier=full locales
  ├── /sitemap-clinical-modules.xml
  ├── /sitemap-allied.xml
  ├── /sitemap-new-grad.xml
  └── /sitemap-cnple.xml
```

### 2.2 Tag/category pages absent from all sitemaps — FIXED

**Root cause:** `/blog/tag/{tag}` and `/blog/category/{category}` are important hub pages with distinct H1s, breadcrumbs, and BreadcrumbJsonLd. None of the 11 sitemap segments included them. Google had to discover them by crawling tag links inside post footers — if crawl budget was limited, they might never be discovered.

**Fix applied (`src/lib/seo/sitemap-blog-xml.ts` + `src/lib/blog/safe-blog-queries.ts`):**
- Added `getSitemapBlogTagsAndCategories()` to `safe-blog-queries.ts`. Collects unique tags and categories from the static longtail corpus (fast, no DB timeout risk) merged with a live DB walk identical to the existing sitemap slug walk. Returns sorted, deduped `{ tags, categories }`.
- `listBlogSitemapEntriesSafe()` now appends `/blog/tag/{encodeURIComponent(tag)}` and `/blog/category/{encodeURIComponent(cat)}` entries after the post URLs. Errors are caught and logged without failing the sitemap.

### 2.3 Sitemap not revalidated after publish — FIXED

**Root cause:** `revalidateBlogPublishingSurfaces()` called `/sitemap.xml` revalidation but not `/sitemap-blog.xml`, `/sitemap-fr-blog.xml`, or `/sitemap-es-blog.xml`. The blog sitemap uses `force-dynamic` so every request is fresh, but the CDN caches it for up to 24 hours (`s-maxage=86400`). After a new post published, CDN nodes could serve the old sitemap for up to a day.

**Fix applied (`src/lib/blog/blog-revalidate-publishing.ts`):**
```typescript
revalidatePath("/sitemap-blog.xml");
revalidatePath("/sitemap-fr-blog.xml");
revalidatePath("/sitemap-es-blog.xml");
```
On-demand revalidation now busts all blog sitemap CDN nodes immediately on publish/approve.

### 2.4 Build-time sitemap uses static corpus only
**Status: By design, low risk.** `shouldSkipBlogDbForProductionBuild()` returns true during `next build`, causing `getMergedBlogSitemapSlugRows` to use the bundled static corpus. DB-backed post URLs appear in the sitemap only after the first runtime request post-deployment. This is intentional to prevent build failures when Postgres isn't reachable during CI/CD. The `force-dynamic` on the blog sitemap route means the first request after deployment regenerates the sitemap from live DB. **Recommendation:** ensure the deploy warmup sequence hits `/sitemap-blog.xml` so Google's next crawl gets the full URL set.

### 2.5 Duplicate URL dedupe — CONFIRMED
`listBlogSitemapEntriesSafe` maintains a `seenLoc` Set. `filterPublicSitemapEntries` in the route handler applies a second dedupe layer. Cross-sitemap overlap between `/sitemap-core.xml` and `/sitemap-blog.xml` is prevented by `excludeAbsoluteUrlsMatchingBlogSitemapEntries` in the core sitemap collector.

### 2.6 Draft/unpublished posts excluded — CONFIRMED
`blogLiveWhere` requires `postStatus = PUBLISHED | APPROVED | SCHEDULED` with `workflowStatus = PUBLISHED` (for PUBLISHED posts) and `publishAt <= now` for SCHEDULED posts. Draft, FAILED, and pipeline-in-progress posts are excluded at the Prisma query level. E2E test artifacts (`bloge2e` slug/title pattern) are also excluded.

### 2.7 lastmod dates — CONFIRMED
`getMergedBlogSitemapSlugRows` passes `r.updatedAt.toISOString()` for each row. Static corpus rows use `createdAt` (ISO 8601 format with T12:00:00Z normalization). The RN hub uses the max `updatedAt` of its member posts. Tag/category entries intentionally omit `lastmod` (no single authoritative timestamp).

---

## Part 3 — Blog Content Quality Signals

### 3.1 Static longtail records lack SEO metadata
**Risk: MEDIUM.** `blogMetaFromLongtailRecord` and the `getBlogPostMetaBySlug` static path both set `seoTitle: null` and `seoDescription: null` for static longtail records. These fall back to `title` and `excerpt` in metadata generation. The title/excerpt fallback is reasonable but suboptimal — the static longtail type has `seoTitle` and `seoDescription` fields but they are not wired into `blogMetaFromLongtailRecord`. 

**Recommendation:** Update `blogMetaFromLongtailRecord` to pass `lt.seoTitle` and `lt.seoDescription`:
```typescript
seoTitle: lt.seoTitle?.trim() || null,
seoDescription: lt.seoDescription?.trim() || null,
```
This uses the editorially-optimized SEO copy when available, falling back to title/excerpt only for records that don't have it.

### 3.2 Word count enforcement
**Status: ENFORCED.** `BLOG_ARTICLE_MIN_WORDS` is checked during blog generation pipeline. Blog articles below the minimum are rejected at publish time.

### 3.3 Long-tail static records missing exam context
`blogMetaFromLongtailRecord` sets `exam: null` and `countryTarget: null`. Long-tail records that are exam-specific (e.g., NCLEX pathophysiology content) don't get exam-aware auto-linking or exam-framing HTML. This affects the RN and CNPLE-specific long-tail articles.

---

## Part 4 — Internal Linking

### 4.1 BlogRelatedReadingSection links to wrong canonical for career-scoped posts
**Risk: LOW-MEDIUM.** `BlogRelatedReadingSection` hardcodes `href="/blog/${encodeURIComponent(r.slug)}"`. If a related post has `careerSlug=rn`, the link points to `/blog/{slug}` which now 307-redirects to `/blog/rn/{slug}`. Functionally correct after Fix 2 is applied, but introduces an unnecessary redirect hop in the internal link graph.

**Recommendation:** Pass `careerSlug` through `BlogPublishingRelatedPost` and use `expectedCanonicalBlogPath(r.slug, r.careerSlug)` in the link href.

### 4.2 Auto-link cap on main blog post
`applyAutoLinksToHtml` uses `maxTotalAutoLinks: 6` on the main blog post page vs `maxTotalAutoLinks: 14` on RN and allied-health pages. Long-form nursing content (2000+ words) benefits from more contextual internal links.

**Recommendation:** Increase to 10–12 on the main post page.

### 4.3 Internal linking coverage
The `BlogPostDistributionFooter` wires each post to:
- Related lesson paths (up to 5)
- Practice hub (exam-aware anchor text)
- CAT-style exam hub
- Flashcard hub
- Question bank (gated)
- Tools (up to 5)

This gives strong blog → app conversion links. The `BlogRelatedReadingSection` provides blog → blog links when `publishingPackage.relatedBlogPosts` is populated.

**Gap:** No blog → simulation links for CNPLE posts. CNPLE posts should link to `/canada/np/cnple/simulation`.

### 4.4 Crawl depth
All blog posts are linked from `/blog` (index, paginated). Tag and category pages provide additional entry points. The `/blog/rn` hub links to RN-scoped posts. Allied-health hub pages at `/allied-health/{slug}/blog` link to profession-scoped posts. Crawl depth to any post: 2 clicks from homepage → `/blog` → post. Within budget.

---

## Part 5 — Technical SEO

### 5.1 Missing Twitter card on main blog post — FIXED

**Root cause:** `generateMetadata` in `/blog/[slug]/page.tsx` emitted only `title`, `description`, `alternates`, and `openGraph` — no `twitter` object. The RN page (`/blog/rn/[slug]`) and allied-health page correctly emitted `twitter: { card: "summary_large_image", ... }`. This meant Twitter/X and any Twitter-card parser (Slack, Discord) rendered plain links for main blog posts with no rich preview.

**Fix applied (`src/app/(marketing)/(default)/blog/[slug]/page.tsx`):**
```typescript
import { resolveBlogOgImageAbsolute } from "@/lib/blog/blog-seo-automation";
// ...
const ogImage = resolveBlogOgImageAbsolute(seo, post.coverImage);
return {
  // ...
  openGraph: {
    // ...
    ...(ogImage ? { images: [{ url: ogImage }] } : {}),
  },
  twitter: {
    card: "summary_large_image",
    title: og.title,
    description: og.description,
    ...(ogImage ? { images: [ogImage] } : {}),
  },
};
```

### 5.2 Dynamic metadata generation
All blog pages use `safeGenerateMetadata` which:
- Catches and logs all errors without throwing
- Applies locale-based `noindex` for non-default locales (partial/incomplete tier)
- Force-overrides to `robots: { index: true, follow: true }` for blog route groups

This is correct. No metadata silent-failure risk.

### 5.3 Structured data
**BlogPosting JSON-LD:** Emitted on every blog post page. Fields populated: `headline`, `description`, `datePublished`, `dateModified`, `url`, `mainEntityOfPage`, `author` (Person or Organization fallback), `reviewedBy` (when medical reviewer set), `publisher`, `image` (when cover set), `keywords`, `articleSection`.

**FAQPage JSON-LD:** Emitted when ≥2 FAQ items exist. Sourced from `post.faqBlock` or extracted from structured `<section data-schema="faq">` HTML.

**BreadcrumbList JSON-LD:** Emitted via `BreadcrumbBar` / `BreadcrumbJsonLd` on all blog pages. Trail: Home → Blog → [Category] → Article.

**Gap:** No `MedicalWebPage` type on blog posts. Nursing content is YMYL; lesson pages already use `["MedicalWebPage", "Article", "LearningResource"]`. Blog posts should similarly use `["BlogPosting", "MedicalWebPage"]` for YMYL authority signaling.

### 5.4 Pagination canonical — FIXED

**Root cause:** `generateMetadata()` for the `/blog` index page did not accept `searchParams`, so it always emitted `canonical: absoluteUrl("/blog")` regardless of page number. Google would see page 2, 3, etc. all self-declaring canonical as page 1 — classic "duplicate, Google chose different canonical" outcome.

**Fix applied (`src/app/(marketing)/(default)/blog/page.tsx`):**
```typescript
export async function generateMetadata({ searchParams }: { searchParams: Promise<{ page?: string }> }): Promise<Metadata> {
  const sp = await searchParams;
  const page = ...;
  const canonicalPath = page <= 1 ? "/blog" : `/blog?page=${page}`;
  // ...
  alternates: { canonical: absoluteUrl(canonicalPath) },
```

Note: Tag and category pages already handle pagination canonical correctly.

### 5.5 Hreflang coverage
- French/Spanish blog variants under `/{locale}/blog/{slug}` emit full `alternates.languages` hreflang via `buildMultilingualBlogHreflangLanguages`.
- **Gap:** English source posts at `/blog/{slug}` do not emit hreflang pointing back to their multilingual variants. This is a one-way hreflang. Google should still infer the relationship from the FR/ES page's hreflang, but a bidirectional signal would be stronger.
- **Recommendation:** In `generateMetadata` for `/blog/[slug]/page.tsx`, query the multilingual registry for any translations of this slug and include `alternates.languages` pointing to `/{locale}/blog/{localizedSlug}`.

### 5.6 ISR revalidation timing
| Route | `revalidate` | On-demand |
|---|---|---|
| `/blog` | 180s | `revalidateBlogPublishingSurfaces()` |
| `/blog/[slug]` | 3600s | `revalidatePath("/blog/{slug}")` on publish |
| `/blog/rn/[slug]` | 3600s | `revalidatePath("/blog/rn/{slug}")` on publish |
| `/blog/tag/[tag]` | 3600s | `revalidatePath("/blog/tag/{tag}")` on publish |
| `/sitemap-blog.xml` | force-dynamic | Now busted on publish [FIXED] |

### 5.7 TTFB / rendering strategy
Blog post pages are ISR Server Components. No client-only hydration of article body. `BlogArticleToc` is a client component (scroll-sync TOC) but doesn't affect initial HTML for crawlers. The `BlogMarketingPostListClient` on the blog index page renders the post grid client-side — this is an issue for bots that don't execute JS, though the featured post above the fold is still SSR. **Recommendation:** Consider converting `BlogMarketingPostListClient` to a Server Component for the first page of the index.

---

## Part 6 — Blog Architecture

### 6.1 Static fallback system
The static fallback probe checks whether Postgres has live posts before falling back to the bundled corpus. The probe itself has a 12s timeout. This means:
- Build time: static corpus only (correct)
- Runtime with DB: DB-first, static supplements non-overlapping slugs
- Runtime without DB: static corpus only
- Runtime DB timeout: probe fails → static NOT used (avoids masking outages)

**Risk:** On cold start after deployment, if the first request to `/blog` times out (12s probe + query), the page may show static-only posts. This is visible to real users but not a crawler issue (ISR will serve the cached version).

### 6.2 APPROVED posts in public feed
Posts with `postStatus = APPROVED` are treated as live even without `workflowStatus = PUBLISHED`. This is intentional (see comment in `blogLiveWhere`). The practical effect is that editorially-approved posts appear on `/blog` without needing an explicit "Publish now" action. All downstream SEO logic (sitemap, canonical, metadata) treats APPROVED as live.

### 6.3 Route parameter / slug normalization
`expectedCanonicalBlogPath` is the single source of truth for routing career-scoped posts. It covers:
- `null` / `""` → `/blog/{slug}`
- `rn` → `/blog/rn/{slug}`
- `paramedic`, `respiratory`, `mlt`, `imaging`, `sonography` → `/allied-health/{career}/blog/{slug}`
- All other values → `/nursing/{career}/blog/{slug}`

NP/CNPLE posts (`careerSlug=np`) would route to `/nursing/np/blog/{slug}`. Confirm this matches the actual `/nursing/[careerSlug]/blog/[postSlug]/page.tsx` route handler.

### 6.4 Multilingual routing
`/{locale}/blog/{slug}` routes are for the multilingual registry (FR/ES articles with their own `localizedSlug`). These are distinct from the localized pathway exam blog at `/{locale}/{region}/{profession}/{exam}/blog/{slug}` (the `LocalizedBlogArticle` DB table). Both are included in their respective sitemaps.

---

## Part 7 — Google Search Console Forensics

### Recommended GSC segments to monitor

| GSC Category | Expected Cause | Action |
|---|---|---|
| Duplicate without user-selected canonical | Career-scoped posts at `/blog/{slug}` | Fixed by redirect in Fix 2 |
| Crawled – currently not indexed | Long-tail static records with thin/duplicate content | Audit word counts; ensure unique nursing-specific content |
| Discovered – currently not indexed | Tag/category pages with 1 post | Normal; noindex fires correctly |
| Page with redirect | `/blog/{slug}` for career-scoped posts after Fix 2 | Expected; Google will consolidate to canonical |
| Blocked by robots.txt | None expected on `/blog/*` | Verify robots.txt `Allow: /` covers `/blog` |
| Valid (indexed) | All live `/blog/{slug}`, `/blog/rn/{slug}`, etc. | Track growth over 90-day window |

### GSC tooling recommendations
1. **Index coverage script:** Compare URLs from `/sitemap-blog.xml` against GSC Index Coverage API to find submitted-but-not-indexed posts.
2. **Canonical mismatch check:** Pull "Duplicate without user-selected canonical" GSC report; after Fix 2 deploys, this list should shrink to zero for blog posts.
3. **Soft 404 detection:** Verify `blogLiveWhere` correctly excludes FAILED/DRAFT posts. A post that exists in DB but fails `blogLiveWhere` returns `notFound()` (real 404), not a soft 404.

---

## Part 8 — Fixes Applied

| # | File | Fix |
|---|---|---|
| 1 | `src/app/(marketing)/(default)/blog/[slug]/page.tsx` | Added `resolveBlogOgImageAbsolute`, `twitter` card metadata, and OG `images` to `generateMetadata` |
| 2 | `src/app/(marketing)/(default)/blog/[slug]/page.tsx` | Added `redirect(canonicalPath)` for career-scoped posts using `expectedCanonicalBlogPath` |
| 3 | `src/app/(marketing)/(default)/blog/page.tsx` | Fixed `generateMetadata` to read `searchParams` and emit correct `canonical` for paginated pages |
| 4 | `src/lib/blog/blog-revalidate-publishing.ts` | Added `revalidatePath` for `/sitemap-blog.xml`, `/sitemap-fr-blog.xml`, `/sitemap-es-blog.xml` |
| 5 | `src/lib/blog/safe-blog-queries.ts` | Added `getSitemapBlogTagsAndCategories()` — collects unique tags/categories from DB + static corpus |
| 6 | `src/lib/seo/sitemap-blog-xml.ts` | Wired `getSitemapBlogTagsAndCategories()` into `listBlogSitemapEntriesSafe()` |

---

## Part 9 — Remaining Risks

| Severity | Issue | Recommendation |
|---|---|---|
| MEDIUM | `blogMetaFromLongtailRecord` ignores `lt.seoTitle`/`lt.seoDescription` | Update to pass through SEO fields from the longtail record |
| MEDIUM | `BlogRelatedReadingSection` links to `/blog/{slug}` for career-scoped posts (now a redirect hop) | Pass `careerSlug` through `BlogPublishingRelatedPost` type; use `expectedCanonicalBlogPath` |
| MEDIUM | No bidirectional hreflang from English posts to their FR/ES variants | Query multilingual registry in `/blog/[slug]` metadata and emit `alternates.languages` |
| MEDIUM | No `MedicalWebPage` type on blog `BlogPosting` JSON-LD | Add to `BlogPostingJsonLd` schema; YMYL content benefits from medical context signal |
| MEDIUM | `BlogMarketingPostListClient` renders post grid client-side on `/blog` index | Convert to Server Component to ensure bot-visible HTML on first load |
| LOW | `maxTotalAutoLinks: 6` on main blog post (vs 14 on RN/allied pages) | Increase to 10–12 for long-form nursing content |
| LOW | CNPLE blog posts missing simulation internal link | Add `/canada/np/cnple/simulation` to `blogStudyAnchorTargets` for NP/CNPLE exam context |
| LOW | No per-post sitemap `lastmod` for tag/category hub entries | Derive `lastmod` from the most-recently-updated post in each tag/category |
| INFO | Build-time sitemap uses static corpus only | Ensure deploy warmup sequence hits `/sitemap-blog.xml` post-deployment |
| INFO | `BLOG_ROUTE_GROUPS_FORCE_INDEX_FOLLOW` missing `marketing.default.blog.category` | Add if category pages need locale-override protection |

---

## Part 10 — Crawlability Assessment

### Before fixes
- Career-scoped posts: **DUPLICATE** — 2 URLs, conflicting self-canonicals
- Tag/category hubs: **UNDISCOVERABLE** — not in any sitemap
- Paginated blog index pages 2+: **DUPLICATE** — all declared canonical to page 1
- New post publish: sitemap CDN **STALE 24h**
- Social sharing: **NO RICH CARD** — missing twitter/OG image

### After fixes
- Career-scoped posts: **SINGLE CANONICAL** — `/blog/{slug}` 307s to `/blog/rn/{slug}` (or applicable path)
- Tag/category hubs: **IN SITEMAP** — 1-click crawl from sitemap
- Paginated blog index: **CORRECT SELF-CANONICAL** — each page declares its own URL
- New post publish: sitemap CDN **BUSTED IMMEDIATELY** via `revalidatePath`
- Social sharing: **FULL RICH CARD** — `summary_large_image` + OG image

---

## Part 11 — Top 20 Highest-Priority SEO Fixes (Remaining)

1. **Bidirectional hreflang** — add `alternates.languages` to `/blog/[slug]` for FR/ES variants
2. **`blogMetaFromLongtailRecord` SEO fields** — wire `lt.seoTitle`/`lt.seoDescription`
3. **MedicalWebPage on BlogPosting** — add to JSON-LD for YMYL authority
4. **BlogRelatedReadingSection career-aware hrefs** — use `expectedCanonicalBlogPath`
5. **`BlogMarketingPostListClient` → Server Component** — ensure bot-visible HTML on index
6. **CNPLE simulation internal link** — add `/canada/np/cnple/simulation` to distribution footer for NP posts
7. **Long-tail records exam context** — propagate `exam`/`countryTarget` from longtail frontmatter
8. **`maxTotalAutoLinks` on main post** — raise from 6 to 10–12
9. **Category sitemap `lastmod`** — use max `updatedAt` across posts in category
10. **`marketing.default.blog.category` in BLOG_ROUTE_GROUPS_FORCE_INDEX_FOLLOW** — prevent locale-override noindex
11. **Blog post `dateModified` freshness** — trigger `updatedAt` bump on content quality refreshes (avoid stale `dateModified`)
12. **Per-post `<link rel="alternate">` hreflang** in HTML head for bilingual articles
13. **Structured `apaReferences` as schema.org `citation`** — add to BlogPosting JSON-LD
14. **`keyTakeaways` as `abstract`** in BlogPosting schema for AI overview candidacy
15. **Soft 404 monitoring script** — detect posts in DB with no body (`body = ""`)
16. **GSC index coverage diff script** — compare sitemap URLs vs indexed set weekly
17. **`authorDisplayName` requirement gate** — block publish if E-E-A-T author fields empty on YMYL posts
18. **Nursing-specific entity schema** — `about: { "@type": "MedicalCondition" }` for pathophysiology posts
19. **Tag hub `description` meta** — currently just `posts tagged "{tag}" | NurseNest blog`; enrich with nursing context
20. **`og:locale` on all English blog posts** — add `openGraph.locale: "en_CA"` / `"en_US"` based on `countryTarget`

---

## Part 12 — Top 20 Nursing Blog Opportunities Most Likely to Rank Quickly

These target long-tail, low-competition queries where NurseNest has existing product and content infrastructure to support fast indexing.

1. **"CNPLE exam study guide 2026"** — CNPLE lane is live; dedicated hub `/cnple-study-guide` exists
2. **"REx-PN vs NCLEX-PN differences"** — comparison intent; strong product coverage on both pathways
3. **"NCLEX Next Generation question types explained"** — page exists; blog post expands with examples
4. **"fluid and electrolytes nursing NCLEX review"** — pathophysiology content; high exam relevance
5. **"medication calculations for nursing students"** — tool exists (`/tools/med-math`); blog cross-links
6. **"what is the CNPLE exam for nurse practitioners"** — informational; CNPLE lane ready
7. **"NCLEX-RN pass rate by province Canada"** — data-driven; nursing audience; unique angle
8. **"pharmacology nursing mnemonics"** — high search volume; supplements flashcard content
9. **"priority setting in NCLEX questions"** — clinical judgment; core NCLEX content area
10. **"how long to prepare for NCLEX 2026"** — timing/planning intent; links to study plan
11. **"RN vs RPN scope of practice Canada"** — comparison; maps to both pathway lanes
12. **"respiratory nursing assessment NCLEX"** — body-system; supplemented by longtail corpus
13. **"SATA questions nursing strategy"** — NGN test type; strategy content
14. **"delegation and supervision NCLEX"** — management of care; NCLEX priority category
15. **"sepsis nursing interventions NCLEX"** — pathophysiology + pharmacology; high relevance
16. **"acid-base balance nursing easy explanation"** — perennial high-search nursing topic
17. **"NP prescribing authority by province Canada"** — CNPLE-relevant; unique Canadian angle
18. **"nursing care plan for heart failure"** — care planning content; long-form opportunity
19. **"therapeutic communication NCLEX questions"** — psychosocial integrity; broad relevance
20. **"best way to study for NCLEX in 2 weeks"** — urgency-intent; links to adaptive prep

---

## Part 13 — Fast Indexing Strategy for Newly Published Posts

### Immediate (on publish, already automated)
1. `revalidateBlogPublishingSurfaces()` fires — busts `/blog`, `/blog/{slug}`, `/sitemap.xml`, `/sitemap-blog.xml` [FIXED], tag pages
2. ISR cache for `/blog` index refreshes within 180s max (3-minute `revalidate`)
3. Sitemap CDN cache busted immediately via `revalidatePath` [FIXED]

### Within 1 hour of publish
4. If Google has the sitemap indexed, Googlebot discovers the new URL from `/sitemap-blog.xml` (CDN now fresh)
5. Internal links from the blog index (featured post slot on page 1) pass crawl signals immediately

### Manual acceleration (for high-priority posts)
6. **URL Inspection Tool in GSC** — paste the canonical URL and click "Request Indexing" after publish
7. **Ping sitemap via GSC** — submit `https://nursenest.ca/sitemap-blog.xml` directly in GSC if many posts publish at once
8. **Social share** — Twitter/X `summary_large_image` card now works [FIXED]; sharing on social creates external signals that accelerate discovery

### Structural improvements that accelerate indexing
9. **Prioritize blog posts in homepage teaser** — `HomeBlogTeaserSection.server.tsx` already links to recent posts from homepage (PageRank flows from root)
10. **Internal link from relevant lesson pages** — lesson pages with matching exam/topic should cross-link to the blog post
11. **Breadcrumb trail depth** — BreadcrumbList JSON-LD on every post signals clear site hierarchy to Google
12. **Submit individual URLs via Indexing API** — for time-sensitive CNPLE/NCLEX exam-date posts, use Google Indexing API immediately after publish (requires service account setup in GSC)
