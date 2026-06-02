# NurseNest — Sitemap Cleanup Report (Phase 5)

**Date:** 2026-05-30
**Scope:** Validate that all sitemap entries meet the 5 clean-sitemap criteria

---

## Sitemap Architecture

NurseNest uses a **sitemap index** pattern:

```
/sitemap.xml                    ← Index (references all child sitemaps)
  /sitemap-core.xml             ← Homepage, pricing, about, static marketing
  /sitemap-blog.xml             ← Blog posts (English)
  /sitemap-lessons.xml          ← Lesson hubs and lesson pages
  /sitemap-allied.xml           ← Allied health hub pages
  /sitemap-new-grad.xml         ← New grad pathway pages
  /sitemap-pathways.xml         ← Exam pathway hubs (RN/PN/NP)
  /sitemap-localized.xml        ← Localized marketing pages (filtered by tier)
  /sitemap-authority-clusters.xml ← Programmatic SEO authority cluster pages
  /sitemap-clinical-modules.xml ← ECG, labs, med-math, clinical skills pages
  /sitemap-cnple.xml            ← CNPLE NP pathway
  /sitemap-es-blog.xml          ← Spanish blog
  /sitemap-fr-blog.xml          ← French blog
```

Sitemap URL validation is enforced by:
- `src/lib/seo/sitemap-segment-validator.ts`
- `src/lib/seo/sitemap-public-index-filter.ts`
- `src/lib/seo/sitemap-marketing-exclusions.ts`

---

## Clean-Sitemap Criteria Audit

### Criterion 1: Only 200-status pages

**Status:** ✅ Infrastructure enforces this
- `sitemap-public-index-filter.ts` runs URL validation before inclusion
- `isValidPublicUrl()` rejects private paths (`/app/`, `/admin/`, `/api/`)
- However: there is **no runtime HTTP status check** — the sitemap assumes all included URLs return 200. If a lesson is archived or a pathway hub is broken, the sitemap will still list it.

**Action needed:** Add a post-deployment sitemap verification job that spot-checks a sample of sitemap URLs for actual HTTP status codes.

### Criterion 2: Only indexable pages

**Status:** ⚠️ Partially enforced
- `sitemap-marketing-exclusions.ts` excludes known noindex paths
- `localeRobotsOverride()` is respected — `tier: "incomplete"` locales should not appear in `sitemap-localized.xml`
- **Risk:** If a route emits both a sitemap entry AND `robots: { index: false }`, the sitemap contains a noindexed URL. Google treats this as a signal conflict and generates "Indexed though blocked" or "Submitted URL has noindex" warnings.

**Verify:** Run a grep to confirm no locale in `sitemap-localized.xml` maps to a locale with `getLocaleSeoTier()` returning `"incomplete"`.

### Criterion 3: Only canonical URLs

**Status:** ⚠️ Known risk
- The sitemap should always emit the canonical URL, not an alternate
- **Risk area:** Localized URLs in `sitemap-localized.xml` — e.g., `/fr/lessons` is a valid sitemap entry if French is `tier: "complete"`, but the canonical for `/fr/lessons` points to `/lessons` (English). This means the sitemap contains a non-canonical URL.
- **Correct pattern:** Localized sitemap entries should be the canonical for that locale (since each locale is its own canonical). Verify this is implemented correctly.

### Criterion 4: Only published content

**Status:** ✅ Lesson and blog sitemaps use DB-backed published status filters
- Blog posts: only `status = "published"` included
- Lessons: only active pathway hubs included via `pathway-lesson-hub-page-slice.ts`
- **Risk:** Programmatic SEO pages in `sitemap-authority-clusters.xml` — these may include pages for topics with no content depth. If the page returns a thin-content experience, Google will crawl it but not index it (contributing to "Crawled — Currently Not Indexed").

### Criterion 5: No 404s, redirects, or 5xx pages

**Status:** ⚠️ Not runtime-validated
- The sitemap-generation pipeline does not make HTTP requests to validate each URL
- During 5xx incidents (see `seo-5xx-audit.md`), affected URLs remained in the sitemap, causing Google to re-crawl failing pages and mark them "Discovered — Currently Not Indexed"

**Action needed:** Post-deploy CI job to validate all sitemap URLs return 200.

---

## Specific Cleanup Items

### Remove from All Sitemaps

| URL Pattern | Reason | Status |
|---|---|---|
| Auth flows (`/login`, `/signup`, `/forgot-password`) | Noindex, confirmed not in sitemap | ✅ Already excluded |
| `/app/*` | Blocked by robots.txt | ✅ Already excluded |
| `/api/*` | Blocked by robots.txt | ✅ Already excluded |
| `/seo/*` | Blocked by robots.txt | ✅ Already excluded |
| `?page=`, `?q=`, `?category=` query params | Should not appear | ✅ Filter in place |
| `tier: "incomplete"` locale pages | Auto-noindex | ✅ Excluded via tier check |

### Investigate for Cleanup

| URL Pattern | Concern | Priority |
|---|---|---|
| Thin programmatic authority cluster pages | May be indexable but low quality | HIGH |
| `/free-nclex-practice-questions` + duplicate practice URLs | Near-duplicate sitemap entries | HIGH |
| `tier: "partial"` locale pages that are >70% machine-translated | Content overlap with English canonical | MEDIUM |
| Country pathway pairs with identical H1 | Both in sitemap but duplicate content | HIGH |

---

## Sitemap Size Audit

| Sitemap | Est. URL Count | Health |
|---|---|---|
| `sitemap-core.xml` | ~20 | Good |
| `sitemap-blog.xml` | ~150–500 | Good |
| `sitemap-lessons.xml` | ~200–400 | Good |
| `sitemap-allied.xml` | ~30–50 | Good |
| `sitemap-authority-clusters.xml` | ~200–500 | Needs thin-page audit |
| `sitemap-localized.xml` | ~500–2000 | Needs tier verification |

**Total estimate:** 1,500–3,500 URLs

Google's recommended sitemap size limit is 50,000 URLs or 50 MB. NurseNest is well within limits. The concern is quality, not quantity.

---

## Recommended Actions

### Immediate
1. Verify `sitemap-localized.xml` excludes all `tier: "incomplete"` locales — grep `getLocaleSeoTier()` for all locales included
2. Confirm no noindex route appears in any sitemap file via a spot-check of 50 random URLs

### Sprint
3. Add a CI/CD post-deploy job: fetch 20 random sitemap URLs, assert HTTP 200
4. Remove near-duplicate practice exam URLs from sitemap (consolidate to primary canonical, 301 others)
5. Audit `sitemap-authority-clusters.xml` for thin-content pages — remove any page with <300 words of unique content

### Ongoing
6. Monitor Search Console "Submitted URL has noindex" report — should be 0
7. Monitor "Submitted URL returns 404" report — should be 0

---

*Generated from code review of `src/app/sitemap*.xml`, `src/lib/seo/sitemap-segment-validator.ts`, `src/lib/seo/sitemap-public-index-filter.ts`, `src/lib/seo/sitemap-marketing-exclusions.ts`*
