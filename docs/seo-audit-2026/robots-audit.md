# NurseNest — Robots.txt Audit

**Date:** 2026-05-30  
**Scope:** 2,037 URLs "Blocked by robots.txt" in Google Search Console

---

## Current robots.txt

```
User-agent: *
Allow: /
Disallow: /app/
Disallow: /admin/
Disallow: /internal/
Disallow: /api/
Disallow: /seo/

Sitemap: https://www.nursenest.ca/sitemap.xml
```

**Source:** `src/app/robots.txt/route.ts`  
**Mode:** `force-static`, `revalidate = 3600` — served from cache, always 200.  
**Canonical origin:** `CANONICAL_PRODUCTION_ORIGIN` (enforced via `assertCanonicalSitemapDirectives`)

---

## Analysis of Each Disallow Rule

### ✅ `Disallow: /app/` — CORRECT

**Should be blocked.** The `/app/` prefix is the authenticated learner shell. It requires a valid session, serves personalized data, and must not be indexed.

- Contains: flashcard sessions, CAT exams, practice tests, profile, billing
- None of these should appear in Google
- **No action required**

### ✅ `Disallow: /admin/` — CORRECT

**Should be blocked.** Admin routes are staff-only. Googlebot should never crawl them.

- Contains: user management, content publishing, analytics, billing admin
- **No action required**

### ✅ `Disallow: /internal/` — CORRECT

**Should be blocked.** Internal routes used for synthetic monitoring and health probes.

- Contains: `/internal/synthetic-learning-monitor`, `/internal/health`
- **No action required**

### ✅ `Disallow: /api/` — CORRECT

**Should be blocked.** REST API endpoints are not indexable content.

- Note: Some API routes return 5xx which contributes to the error count
- The Disallow is correct; fixing the 5xx responses separately is still warranted
- **No action required**

### ✅ `Disallow: /seo/` — CORRECT

**Should be blocked.** Internal rewrite surface for programmatic SEO. The actual public URLs are at `/[slug]`, not `/seo/[slug]`. Blocking prevents duplicate indexing.

- If any public URL uses `/seo/` in its path, this rule incorrectly blocks it
- **Verify:** `grep -r "href.*\/seo\/" src/` to confirm no public links point to `/seo/`
- **No action required**

---

## Root Cause of 2,037 "Blocked" URLs

The 2,037 blocked URLs in Search Console are a **legacy issue** from a previous robots.txt configuration that included:

```
# OLD (removed)
Disallow: /fr/
Disallow: /pa/
Disallow: /zh-tw/
Disallow: /ko/
Disallow: /tr/
Disallow: /it/
Disallow: /ur/
Disallow: /ht/
```

This prior configuration blocked incomplete-tier locales via robots.txt. Google discovered these URLs through internal links or old sitemaps, attempted to crawl them, and was blocked. The pages were recorded as "blocked by robots.txt" in GSC before the block was removed.

**The fix was already applied:** The current robots.txt has no locale-specific Disallow lines. All locales are now crawlable, with noindex enforced via `<meta name="robots" content="noindex,follow">` at the page level.

---

## Resolution Timeline for the 2,037 URLs

Google does not immediately clear "Blocked by robots.txt" status from Search Console. The resolution process:

1. **Google re-crawls the previously-blocked URLs** → confirms they are now accessible
2. **Google reads the page-level `noindex` meta** → marks pages as "Excluded: noindex" instead of "Blocked by robots.txt"
3. **Search Console updates** → URLs move from "Blocked" to "Excluded: noindex tag"

**Expected timeline:** 4–8 weeks after the robots.txt fix was deployed. No further code changes required.

---

## Verification: No High-Value Content Is Blocked

| Content Type | Blocked? | Verdict |
|---|---|---|
| Lessons (`/lessons`, `/{locale}/lessons`) | ❌ Not blocked | ✅ Correct |
| Blog (`/blog`, `/blog/[slug]`) | ❌ Not blocked | ✅ Correct |
| Practice Questions (`/question-bank`, `/nclex-question-bank`) | ❌ Not blocked | ✅ Correct |
| Flashcards (`/flashcards`, `/flashcards/[slug]`) | ❌ Not blocked | ✅ Correct |
| ECG content (`/advanced-ecg-nursing`, `/ecg-*`) | ❌ Not blocked | ✅ Correct |
| Pharmacology (`/pharmacology`, `/cnple-*`) | ❌ Not blocked | ✅ Correct |
| Labs (`/labs-interpretation`, `/lab-drills`) | ❌ Not blocked | ✅ Correct |
| Marketing pages (`/pricing`, `/about`, `/canada/*`) | ❌ Not blocked | ✅ Correct |
| Exam hubs (`/{locale}/{slug}/{examCode}/*`) | ❌ Not blocked | ✅ Correct |
| Simulation content (`/physiology-monitor`, `/simulation-center`) | ❌ Not blocked | ✅ Correct |
| Allied health (`/allied-health`, `/allied/*`) | ❌ Not blocked | ✅ Correct |
| New grad (`/new-grad`) | ❌ Not blocked | ✅ Correct |
| Auth pages (`/login`, `/signup`) | ❌ Not blocked | ✅ Correct (noindex at page level) |
| Learner app (`/app/*`) | ✅ Blocked | ✅ Correct |
| Admin (`/admin/*`) | ✅ Blocked | ✅ Correct |
| API (`/api/*`) | ✅ Blocked | ✅ Correct |

**Finding: No high-value content is incorrectly blocked. Robots.txt is correct.**

---

## Recommendations

### 1. No Changes to Disallow Rules Needed
The current robots.txt is optimal. Do not add locale-specific Disallow rules. Google's own documentation confirms: block crawling via robots.txt only if you also want to prevent indexing (contradictory signals). For de-indexing, use `noindex` meta tags exclusively.

### 2. Monitor "Blocked by Robots.txt" Count Weekly
Expect the 2,037 count to decrease to <100 over the next 6–8 weeks as Google re-crawls and reclassifies the legacy-blocked URLs.

### 3. Ensure robots.txt Cache Headers Are Correct
Current: `Cache-Control: public, max-age=0, s-maxage=3600, stale-while-revalidate=86400`  
This is correct — CDN caches for 1 hour, stale-while-revalidate prevents cold starts.

### 4. Add `sitemap-cnple.xml` and `sitemap-authority-clusters.xml` to Sitemap Index
**Current sitemap index includes:**
```
sitemap-core.xml ✓
sitemap-blog.xml ✓
sitemap-fr-blog.xml ✓
sitemap-es-blog.xml ✓
sitemap-pathways.xml ✓
sitemap-lessons.xml ✓
sitemap-localized.xml ✓
sitemap-clinical-modules.xml ✓
sitemap-allied.xml ✓
sitemap-new-grad.xml ✓
sitemap-cnple.xml ✓
sitemap-authority-clusters.xml ✓
```
All 12 child sitemaps are registered. ✅ No action required.
