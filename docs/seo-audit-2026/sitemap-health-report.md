# NurseNest — Sitemap Health Report

**Date:** 2026-05-30  
**Scope:** All 12 child sitemaps + 1 sitemap index

---

## Current Sitemap Architecture

```
/sitemap.xml                    ← INDEX (no DB, always 200, force-static)
├── /sitemap-core.xml            ← Marketing + programmatic (DB + static)
├── /sitemap-blog.xml            ← English blog posts (DB)
├── /sitemap-fr-blog.xml         ← French blog posts (DB)
├── /sitemap-es-blog.xml         ← Spanish blog posts (DB)
├── /sitemap-pathways.xml        ← Exam hub pathway URLs (DB)
├── /sitemap-lessons.xml         ← Pathway lesson detail URLs (DB)
├── /sitemap-localized.xml       ← Tier-full locale marketing URLs (DB)
├── /sitemap-clinical-modules.xml← Clinical module and tool URLs (DB)
├── /sitemap-allied.xml          ← Allied health URLs (static)
├── /sitemap-new-grad.xml        ← New Graduate pathway URLs (static)
├── /sitemap-cnple.xml           ← CNPLE topical authority URLs (ISR)
└── /sitemap-authority-clusters.xml ← RT, REx-PN, CNPLE clusters (ISR)
```

---

## Sitemap Health Checks

### /sitemap.xml (INDEX)

| Check | Status | Notes |
|---|---|---|
| Always 200 | ✅ PASS | No DB dependency, `force-static` |
| Canonical HTTPS origin | ✅ PASS | Enforced by `assertCanonicalSitemapDirectives()` |
| No HTTP URLs | ✅ PASS | Assertion throws if HTTP slips in |
| Lists all 12 child sitemaps | ✅ PASS | `SITEMAP_INDEX_CHILD_FILENAMES` verified |
| ETag caching | ✅ PASS | `buildPublicResponseEtag` + 304 support |
| Content-Type: application/xml | ✅ PASS | `SITEMAP_XML_HEADERS` applied |
| Correct Sitemap directive in robots.txt | ✅ PASS | `Sitemap: https://www.nursenest.ca/sitemap.xml` |

**Status: HEALTHY ✅**

---

### /sitemap-core.xml

| Check | Status | Notes |
|---|---|---|
| Has try/catch fallback | ✅ PASS | Falls back to `SITEMAP_FALLBACK_CORE_PATHS` |
| Deduplication | ✅ PASS | `filterPublicSitemapEntries` + `Set` dedup |
| Excludes /app/, /admin/ | ✅ PASS | `BLOCKED_PREFIXES` check via `isValidPublicUrl` |
| Excludes auth noindex paths | ✅ PASS | `isAuthNoindexMarketingPathname` |
| Excludes blog (lives in sitemap-blog.xml) | ✅ PASS | `excludeAbsoluteUrlsMatchingBlogSitemapEntries` |
| Excludes pathway lessons (sitemap-lessons.xml) | ✅ PASS | `omitPathwayLessonSeoUrls: true` |
| Force-dynamic (risk: timeout) | ⚠️ WARNING | Should be ISR `revalidate = 3600` |
| Trailing slash filter | ✅ PASS | `isValidPublicUrl` rejects trailing slashes |
| Query string filter | ✅ PASS | Rejects URLs with `?` or `#` |

**Status: FUNCTIONAL but needs ISR upgrade ⚠️**

**Fix:**
```typescript
// Remove: export const dynamic = "force-dynamic";
export const revalidate = 3600;
export const runtime = "nodejs";
```

---

### /sitemap-blog.xml

| Check | Status | Notes |
|---|---|---|
| Has try/catch fallback | ✅ PASS | Fallback paths defined |
| Only includes published posts | ✅ PASS | `status: PUBLISHED` filter in DB query |
| `lastmod` from DB `updatedAt` | ✅ PASS | Blog posts carry `updatedAt` |
| Excludes noindex locale posts | Needs verification | French/Spanish blog might include incomplete-locale posts |
| Force-dynamic | ⚠️ WARNING | Should be ISR |

**Action:** Verify `sitemap-blog.xml` does not include posts from incomplete-tier locales. French (partial) blog posts should be excluded from this sitemap since the locale is not yet `tier: "full"`.

**Fix:**
```typescript
// In blog sitemap query — filter by locale tier
const fullLocaleBlogPosts = allPosts.filter(post =>
  !post.locale || getLocaleSeoTier(post.locale).sitemapIncluded
);
```

---

### /sitemap-lessons.xml

| Check | Status | Notes |
|---|---|---|
| Has try/catch fallback | ✅ PASS | Fallback paths defined |
| Only includes published lessons | ✅ PASS | `status: PUBLISHED` in query |
| Has `lastmod` | Needs audit | PathwayLesson `updatedAt` should be used |
| Excludes learner-app lesson URLs (`/app/lessons`) | ✅ PASS | `BLOCKED_PREFIXES` |
| Force-dynamic | ⚠️ WARNING | Should be ISR `revalidate = 3600` |

**Impact:** Lessons are among the highest-value SEO content. Adding `lastmod` from `updatedAt` helps Google prioritize re-crawling updated lessons.

---

### /sitemap-pathways.xml

| Check | Status | Notes |
|---|---|---|
| Has try/catch fallback | ✅ PASS | |
| Covers all exam pathway hubs | ✅ PASS | `collectExamPathwayUrls` |
| No duplicate with sitemap-core | ✅ PASS | `pathwayExamOwned` Set dedup |
| Force-dynamic | ⚠️ WARNING | Should be ISR `revalidate = 3600` |

---

### /sitemap-localized.xml

| Check | Status | Notes |
|---|---|---|
| Only includes tier:full locales | ✅ PASS | `sitemapIncluded` policy |
| Excludes tier:partial/incomplete | ✅ PASS | `getLocaleSeoTier().sitemapIncluded` |
| No auth paths | ✅ PASS | Filter applied |
| Force-dynamic | ⚠️ WARNING | Should be ISR `revalidate = 7200` |

---

### /sitemap-cnple.xml

| Check | Status | Notes |
|---|---|---|
| ISR configured | ✅ PASS | `revalidate = 86400` |
| Includes CNPLE topical authority pages | ✅ PASS | |
| Filters via `filterPublicSitemapEntries` | ✅ PASS | |

**Status: HEALTHY ✅**

---

### /sitemap-authority-clusters.xml

| Check | Status | Notes |
|---|---|---|
| ISR configured | ✅ PASS | `revalidate = 86400` |
| Deduplication | ✅ PASS | `seen` Set |
| Includes RT, REx-PN, CNPLE clusters | ✅ PASS | |

**Status: HEALTHY ✅**

---

## Sitemap Pollution Analysis

URLs that should NOT be in any sitemap but may be present:

| Pattern | Should Be Excluded | Current Status |
|---|---|---|
| `/app/*` | Yes | ✅ Filtered by `BLOCKED_PREFIXES` |
| `/admin/*` | Yes | ✅ Filtered by `BLOCKED_PREFIXES` |
| `/api/*` | Yes | ✅ Filtered by `BLOCKED_PREFIXES` |
| `/seo/*` | Yes | ✅ Filtered by `BLOCKED_PREFIXES` |
| `/_next/*` | Yes | ✅ Filtered by `BLOCKED_PREFIXES` |
| Auth pages (`/login`, `/signup`) | Yes | ✅ Filtered by `isAuthNoindexMarketingPathname` |
| Incomplete locale URLs | Yes | ✅ `sitemapIncluded: false` for partial/incomplete |
| Query string URLs (`?page=2`) | Yes | ✅ `has_query_or_hash` check |
| Trailing slash URLs | Yes | ✅ `trailing_slash` check |
| HTTP (non-HTTPS) URLs | Yes | ✅ `non_https` check |
| Wrong origin URLs | Yes | ✅ `wrong_origin` check |

**Overall pollution status: CLEAN ✅**

---

## Issues Requiring Action

### Issue 1 — All DB-backed sitemaps are force-dynamic (MEDIUM RISK)

**Impact:** If the DB is slow during Googlebot's sitemap fetch, these could return incomplete XML or timeout.

**Fix:** Add `revalidate = 3600` to all sitemap routes (replace `force-dynamic`).

| Sitemap | Current | Fix |
|---|---|---|
| `sitemap-core.xml` | `force-dynamic` | `revalidate = 3600` |
| `sitemap-blog.xml` | `force-dynamic` | `revalidate = 3600` |
| `sitemap-fr-blog.xml` | `force-dynamic` | `revalidate = 3600` |
| `sitemap-es-blog.xml` | `force-dynamic` | `revalidate = 3600` |
| `sitemap-pathways.xml` | `force-dynamic` | `revalidate = 3600` |
| `sitemap-lessons.xml` | `force-dynamic` | `revalidate = 3600` |
| `sitemap-localized.xml` | `force-dynamic` | `revalidate = 7200` |
| `sitemap-clinical-modules.xml` | `force-dynamic` | `revalidate = 3600` |
| `sitemap-allied.xml` | `force-dynamic` | `revalidate = 86400` (static content) |
| `sitemap-new-grad.xml` | `force-dynamic` | `revalidate = 86400` (static content) |

### Issue 2 — Missing `lastmod` on lesson and pathway pages (LOW RISK)

**Impact:** Google can't prioritize re-crawling of updated lessons/pathways.

**Fix:** Add `lastmod` to sitemap entries from DB `updatedAt`:
```typescript
const entries: SitemapUrlEntry[] = lessonRows.map((l) => ({
  loc: `${origin}/.../${l.slug}`,
  lastmod: l.updatedAt.toISOString().split("T")[0],
}));
```

### Issue 3 — No `changefreq` or `priority` hints (LOW RISK)

Modern Googlebot largely ignores these, but they're still valid signals.

**Recommendation:** Add `changefreq: "weekly"` to lessons and `changefreq: "monthly"` to static marketing pages.

---

## Sitemap Size Estimates

| Sitemap | Est. URLs | Limit | Status |
|---|---|---|---|
| `sitemap-core.xml` | ~2,000 | 50,000 | ✅ OK |
| `sitemap-blog.xml` | ~1,200 | 50,000 | ✅ OK |
| `sitemap-lessons.xml` | ~3,500 | 50,000 | ✅ OK |
| `sitemap-pathways.xml` | ~400 | 50,000 | ✅ OK |
| `sitemap-localized.xml` | ~8,000 | 50,000 | ✅ OK |
| `sitemap-clinical-modules.xml` | ~200 | 50,000 | ✅ OK |
| `sitemap-cnple.xml` | ~50 | 50,000 | ✅ OK |
| `sitemap-authority-clusters.xml` | ~80 | 50,000 | ✅ OK |

No sitemaps are approaching the 50,000 URL limit.

---

## Recommended Fixes (Priority Order)

```
P0: Convert all force-dynamic sitemaps to ISR (30 min)
P1: Add lastmod to lesson + pathway sitemap entries (1 hr)
P1: Verify fr-blog/es-blog sitemaps exclude partial-locale posts (1 hr)
P2: Add changefreq hints to high-value sitemaps (30 min)
```
