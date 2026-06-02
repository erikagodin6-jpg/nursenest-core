# Phase 5 — Sitemap Validation Report
Generated: 2026-05-30 | Source: sitemap route handlers, `sitemap-static-xml.ts`

---

## Sitemap Architecture

```
/sitemap.xml (index)
├── /sitemap-core.xml          — Homepage, marketing hubs, country pages, tools
├── /sitemap-pathways.xml      — Exam pathway hubs, topic programmatic, lesson hubs
├── /sitemap-lessons.xml       — Individual lesson detail pages (DB-backed)
├── /sitemap-blog.xml          — English blog posts
├── /sitemap-fr-blog.xml       — French blog posts
├── /sitemap-es-blog.xml       — Spanish blog posts
├── /sitemap-allied.xml        — Allied health pathway pages
├── /sitemap-cnple.xml         — CA NP CNPLE-specific pages
├── /sitemap-new-grad.xml      — New grad transition pages
├── /sitemap-authority-clusters.xml — Healthcare authority cluster pages
└── /sitemap-clinical-modules.xml   — ECG, hemodynamics, lab modules
```

---

## Sitemap Validation Rules (Active)

**Source:** `filterPublicSitemapEntries()` in `sitemap-public-index-filter.ts`

All entries pass through:
1. URL format validation (must be absolute HTTPS, same origin)
2. Path must not start with `/app/`, `/admin/`, `/api/`, `/internal/`
3. `isRegionalMarketingUrlPublished()` — unpublished expansion regions filtered out
4. Deduplication

---

## Key Pages Confirmed IN Sitemap

| Page | Sitemap File | Source |
|---|---|---|
| `/us/rn/nclex-rn` | `sitemap-pathways.xml` | `listPublishedExamPathwaysForPublicSite()` |
| `/us/rn/nclex-rn/pricing` | `sitemap-pathways.xml` | Same |
| `/us/rn/nclex-rn/questions` | `sitemap-pathways.xml` | Same |
| `/us/rn/nclex-rn/lessons` | `sitemap-pathways.xml` | Same |
| `/us/rn/nclex-rn/cat` | `sitemap-pathways.xml` | Same |
| `/canada/rn/nclex-rn` | `sitemap-pathways.xml` | Same |
| `/nclex-question-bank` | `sitemap-core.xml` | `NCLEX_COMMERCIAL_SITEMAP_PATHS` |
| `/cat-nclex-simulator` | `sitemap-core.xml` | Same |
| `/free-nclex-practice-questions` | `sitemap-core.xml` | Same |
| US lesson detail pages | `sitemap-lessons.xml` | DB-backed, filtered to `NCLEX_RN` examKey |
| `/us` | `sitemap-core.xml` | Static core paths |

---

## Pages Correctly Excluded From Sitemap

| Page | Reason |
|---|---|
| `/app/*` | Path filter |
| `/admin/*` | Path filter |
| `/api/*` | Path filter |
| International shell pages (`/exams/uk`, etc.) | `isRegionPublishedForPublicSite("uk") === false` |
| Filtered question pages (`?topic=`) | Not in sitemap generation (only canonical URLs) |
| Auth pages (`/login`, `/signup`) | Not in core sitemap paths |
| Draft/noindex blog posts | Per-post `published` check |

---

## Sitemap Health Issues Found

### Issue 1 — Fallback pathway paths are hardcoded (stale risk)
**Source:** `SITEMAP_FALLBACK_PATHWAYS_PATHS` in `sitemap-index-children.ts`

The fallback list is static and may diverge from the live pathway registry. The live path (`collectPathwaysSegmentUrls`) uses the registry, but the fallback (used on DB error) has fixed strings.

**Risk:** If a pathway URL changes (e.g., exam code changes), the fallback could emit a stale 404 URL.

**Fix:** Periodically sync `SITEMAP_FALLBACK_PATHWAYS_PATHS` with `listPublishedExamPathwaysForPublicSite()`. No immediate action needed (fallback is only used on DB failure).

### Issue 2 — Lesson sitemap is DB-backed (potential 5xx during crawl)
**Source:** `sitemap-lessons.xml/route.ts`

Lesson detail URLs require a DB query. If the DB is slow during a crawl, the sitemap returns an error or fewer URLs.

**Fix:** Add `revalidate = 86400` (already set) and verify Railway DB is healthy before Google crawls.

### Issue 3 — Sitemap budget cap (48,000 URLs max)
**Source:** `MAX_PATHWAY_DERIVED_SITEMAP_URLS = 48_000` in `sitemap-static-xml.ts`

If the lesson + topic URL count exceeds 48,000, newer URLs are silently dropped.

**Current estimate:** With 200 US lessons + 190 CA lessons + programmatic topic pages, total is well under the cap. Monitor as content grows.

---

## Recommendations

| Action | Priority | Day |
|---|---|---|
| Submit `/sitemap.xml` to Google Search Console | **CRITICAL** | Day 1 |
| Submit individual sitemaps for re-indexing | HIGH | Day 1 |
| Validate sitemap via `https://nursenest.io/sitemap.xml` → check all child sitemaps load without error | HIGH | Day 2 |
| Verify US lesson detail pages appear in `sitemap-lessons.xml` | HIGH | Day 2 |
| Monitor sitemap processing in GSC (Sitemaps report) | MEDIUM | Week 1 |
| Set up GSC "URL Inspection" for top 10 US pages | MEDIUM | Day 3 |
