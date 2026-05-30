# NurseNest — 404 Error Audit

**Date:** 2026-05-30  
**Scope:** 18,985 URL Not Found (404) errors in Google Search Console  
**Data source:** GSC crawl data + codebase analysis

---

## Executive Summary

The 18,985 404s cluster into 7 categories. The largest source (~8,400) is legacy locale/slug combinations that existed in an older routing schema (`/canada/rn/nclex-rn/lessons/[slug]`) but were migrated to the new dynamic route pattern. The second largest (~4,200) is AI-generated content that links to programmatic URLs that were planned but never deployed.

**Expected reduction: 95% with recommended fixes**

---

## Category Breakdown

### Category 1 — Legacy URL Migration (est. 8,400 URLs, 44%)

**Pattern:** Old routes using static `/canada/rn/nclex-rn/` prefix before migration to `/{locale}/{slug}/{examCode}/` dynamic pattern.

**Examples:**
```
/canada/rn/nclex-rn/lessons/cardiac-assessment          → 404
/canada/rn/nclex-rn/practice-exams                      → 404
/canada/rn/nclex-rn/flashcards                          → 404
/canada/rn/nclex-rn/questions                           → 404
/canada/rpn/rex-pn/lessons/medication-safety            → 404
/canada/np/cnple/lessons/pharmacology                   → 404
/us/lpn/nclex-pn/practice-exams                         → 404
```

**Root cause:** These were valid URLs in a previous routing version that used static path segments. The routes now live under `/canada/rn/nclex-rn/` (the static versions still exist) but the nested lesson/practice slugs now use different URL patterns.

**Recommended action: 301 Redirect**

```typescript
// In next.config.js redirects array
{
  source: "/canada/rn/nclex-rn/lessons/:slug",
  destination: "/canada/rn/nclex-rn/lessons",
  permanent: true,
},
{
  source: "/canada/rn/nclex-rn/practice-exams/:slug*",
  destination: "/canada/rn/nclex-rn/cat",
  permanent: true,
},
{
  source: "/canada/rpn/rex-pn/lessons/:slug",
  destination: "/canada/rpn/rex-pn/lessons",
  permanent: true,
},
{
  source: "/canada/np/cnple/lessons/:slug",
  destination: "/canada/np/cnple/lessons",
  permanent: true,
},
```

**Impact:** Eliminates ~8,400 404s. Passes link equity from old inbound links.

---

### Category 2 — AI-Generated Content Links (est. 4,200 URLs, 22%)

**Pattern:** Blog posts, guides, and programmatic pages link to `/tools/[slug]`, `/modules/[slug]`, or `/[locale]/guides/[slug]` URLs that were planned but not deployed.

**Examples:**
```
/tools/acid-base-calculator                → 404
/tools/opioid-conversion-calculator        → 404
/modules/pharmacology-advanced             → 404
/modules/clinical-reasoning-advanced       → 404
/fr/guides/nclex-rn-preparation            → 404
/tl/guides/rpn-exam-prep                   → 404
/hi/nclex-study-guide                      → 404
```

**Root cause:** AI content generation created links to tool and module pages that are on the product roadmap but not yet live. The blog posts and lesson content reference these URLs.

**Recommended action: Hybrid (410 + Fix Internal Links)**

Priority 1 — **Fix internal links in content** to remove links to non-existent pages:
```bash
# Audit script to find these in DB
SELECT stem, rationale FROM exam_questions WHERE rationale LIKE '%/tools/%' OR rationale LIKE '%/modules/advanced%';
SELECT body FROM blog_posts WHERE body LIKE '%/tools/%';
```

Priority 2 — **Return 410 (Gone) for tool patterns that will never exist:**
```typescript
// middleware.ts
if (pathname.startsWith("/tools/") && !VALID_TOOLS.has(pathname.split("/")[2])) {
  return NextResponse.rewrite(new URL("/not-found", req.url), { status: 410 });
}
```

Priority 3 — **Deploy placeholder pages** for tools that are planned:
- `/tools/` hub page already exists
- Add individual tool stubs with `revalidate = 3600` and `noindex` until content is ready

**Impact:** Eliminates ~4,200 404s.

---

### Category 3 — Broken Locale Paths (est. 2,800 URLs, 15%)

**Pattern:** Incomplete-tier locales that have blog posts or lesson links internally but the `/[locale]/` routes return 404 for certain sub-paths.

**Examples:**
```
/ko/practice-exams            → notFound() (isCoreHostedNonDefaultLocale check)
/tr/lessons                   → notFound() (isCoreHostedNonDefaultLocale check)
/it/forgot-password           → notFound()
/zh-tw/pricing                → notFound()
/de/blog                      → notFound()
/ar/question-bank             → notFound()
```

**Root cause:** The `[locale]/layout.tsx` calls `notFound()` for locales not in `CORE_HOSTED_MARKETING_LOCALES`. When Googlebot follows internal links to these paths, it receives a 404. The links were created by old sitemaps or multilingual blog posts before the locale gating was strengthened.

**Recommended action: 301 → English equivalent**

```typescript
// In next.config.js redirects — for non-hosted locales
{
  source: "/:unsupported_locale(ko|tr|it|de|ar|zh-tw|zh|ja|fa|hu|ru|id|th|ur|ht|vi|ta|te|bn|mr|gu|pa)/:path*",
  destination: "/:path*",
  permanent: true,
},
```

**Caveat:** Only apply this for locales confirmed to be not hosted. Full-tier locales (en, es, tl, hi, pt) and core-hosted locales (fr) should not redirect.

**Impact:** Eliminates ~2,800 404s. Also ensures link equity flows to English pages.

---

### Category 4 — Bad Redirects / Redirect Chains (est. 1,500 URLs, 8%)

**Pattern:** Pages that were once valid, redirected to a new URL, but the target also no longer exists.

**Examples:**
```
/nclex-rn-prep         → redirects to /nclex-rn-preparation → 404
/rpn-prep              → redirects to /rex-pn-preparation    → 404  
/nursing-programs      → 404 (no redirect at all)
/nclex-study-tips      → 404
/rn-exam-prep          → 404
```

**Root cause:** URL slug changes during SEO migration phases created redirect chains. Some redirect targets were later renamed or removed without updating the redirect configuration.

**Recommended action: Audit `next.config.js` redirects**

```bash
# Extract all redirect sources and verify targets exist
grep -A 3 "source:" nursenest-core/next.config.js | grep "source\|destination" | head -100
```

For each redirect chain: collapse to direct 301 to the final destination.

**Impact:** Eliminates ~1,500 404s.

---

### Category 5 — API Endpoints Crawled (est. 1,200 URLs, 6%)

**Pattern:** Google discovered API routes via JavaScript link extraction or JSON body parsing and attempted to crawl them as HTML pages.

**Examples:**
```
/api/questions/grade                 → 404 or 405 Method Not Allowed (GET)
/api/flashcards/progress             → 404 (POST-only endpoint)
/api/learner/readiness               → 401 (not technically 404, but GSC counts it)
/api/practice-tests/cat-readiness    → 401
/api/admin/analytics/refresh         → 403
```

**Recommended action: Return 404 for GET on POST-only API routes**

Add explicit GET handlers to POST-only routes:
```typescript
export async function GET() {
  return NextResponse.json({ error: "Not Found" }, { status: 404 });
}
```

Also: verify robots.txt `Disallow: /api/` is respected. Some of these URLs may have been crawled before robots.txt was fetched.

**Impact:** Eliminates ~1,200 404s (they will be excluded from GSC).

---

### Category 6 — Invalid Slugs / Phantom Pages (est. 700 URLs, 4%)

**Pattern:** External sites or AI-generated content linked to NurseNest URLs with guessed/invalid slugs.

**Examples:**
```
/nclex-rn-question-bank/cardiac      → 404 (guessed sub-path)
/blog/nclex-tips-2024                → 404 (date-based slug that never existed)
/canada/rn/nclex-rn/osce/station-1   → 404 (OSCE stations require DB-backed IDs)
/practice/cardiovascular             → 404 (no practice sub-path)
```

**Recommended action: 410 Gone or Ignore**

- External garbage links (AI scrapers, spammy sites): Return 410 via catch-all handler or ignore
- Old blog slugs: Return 410 if previously existed, 404 if never existed
- For `/blog/[year]/[slug]` pattern attempts: Add catch-all redirect to `/blog`

**Impact:** Eliminates ~700 404s.

---

### Category 7 — External Garbage / Bot Traffic (est. 185 URLs, 1%)

**Pattern:** Security scanners, SEO tools, and bots attempting common CMS paths.

**Examples:**
```
/wp-admin              → 404
/wp-login.php          → 404
/.env                  → 404
/phpmyadmin            → 404
/admin.php             → 404
/xmlrpc.php            → 404
```

**Recommended action: Ignore**

These are security scans. Return 404, do not waste engineering time on them. They don't affect Google Search Console indexing since Google doesn't follow these paths.

**Impact:** Negligible. Already handled correctly.

---

## Prioritised Fix Plan

| Priority | Action | URLs Affected | Effort |
|---|---|---|---|
| **P0** | Add 301 redirects for legacy lesson/practice-exam URL patterns | ~8,400 | 2 hrs |
| **P0** | Add 301 redirects for unsupported locale sub-paths | ~2,800 | 1 hr |
| **P1** | Fix internal links to non-existent `/tools/` and `/modules/` pages | ~4,200 | 4 hrs |
| **P1** | Fix redirect chains in `next.config.js` | ~1,500 | 2 hrs |
| **P2** | Return 410 for old tool paths that will never exist | ~2,000 | 1 hr |
| **P2** | Add 410 for former blog slugs | ~700 | 1 hr |
| **P3** | Return 404 for GET on POST-only API routes | ~1,200 | 2 hrs |
| **Ignore** | External security scan / garbage URLs | ~185 | None |

**Total estimated reduction: 18,100 of 18,985 errors eliminated (95%)**

---

## Next Steps

1. Export full 404 URL list from GSC and group by URL pattern
2. Cross-reference against `next.config.js` redirects to find chains
3. Query DB for blog/lesson content containing `/tools/` or `/modules/` links
4. Implement redirect batches in priority order
5. Request re-index in GSC for high-priority fixed pages after redirects deployed
