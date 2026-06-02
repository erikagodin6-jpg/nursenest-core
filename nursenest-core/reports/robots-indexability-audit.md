# Phase 1 — Robots.txt & Indexability Audit
Generated: 2026-05-30 | Source: `src/app/robots.txt/route.ts`

---

## Current robots.txt (live)

```
User-agent: *
Allow: /
Disallow: /app/
Disallow: /admin/
Disallow: /internal/
Disallow: /api/
Disallow: /seo/

Sitemap: https://nursenest.io/sitemap.xml
```

**Implementation note:** Static, no per-request variation. `Cache-Control: public, max-age=0, s-maxage=3600, stale-while-revalidate=86400`.

---

## Safe Blocks (Correct — No Action Needed)

| Path | Reason | Status |
|---|---|---|
| `/app/` | Learner shell (auth required, not public content) | ✅ Correctly blocked |
| `/admin/` | Admin panel (staff only) | ✅ Correctly blocked |
| `/api/` | API routes (not crawlable pages) | ✅ Correctly blocked |
| `/internal/` | Internal runtime routes | ✅ Correctly blocked |
| `/seo/` | Rewrite targets (prevents duplicate indexing of canonical `/slug` URLs) | ✅ Correctly blocked |

---

## Indexable Paths — Verified Safe

| Category | Path Pattern | Indexed? | Robots Control |
|---|---|---|---|
| US RN hub | `/us/rn/nclex-rn` | ✅ Yes | `index: true` via `marketingRobotsForExamPathway` |
| CA RN hub | `/canada/rn/nclex-rn` | ✅ Yes | Same |
| Pricing hub | `/us/rn/nclex-rn/pricing` | ✅ Yes | No explicit noindex |
| Questions hub | `/us/rn/nclex-rn/questions` | ✅ Yes | `index: false` only when filtered |
| Lessons hub | `/us/rn/nclex-rn/lessons` | ✅ Yes | No explicit noindex |
| CAT hub | `/us/rn/nclex-rn/cat` | ✅ Yes | No explicit noindex |
| Blog | `/blog/*` | ✅ Yes | Per-article control |
| Glossary | Via programmatic registry | ✅ Yes | Published entries |
| NCLEX landing | `/nclex-question-bank` etc. | ✅ Yes | Defaults to `published` |
| Marketing locale `/fr/…` | ✅ Crawlable | Noindex handled per-page |
| International shells | `/exams/uk`, `/exams/australia` | ✅ Crawlable | Noindex via `robotsForRegionalMarketingHub` — correct |

---

## Dangerous Blocks — NONE FOUND

The previous robots.txt (before locale remediation) had `Disallow: /{locale}/` for incomplete locales, which caused Google to see URLs but not read the `noindex` tag — causing "Blocked by robots.txt" in Search Console. This was fixed: locale paths are now crawlable, and noindex is per-page.

**The 2,037 "Blocked by robots.txt" in Search Console are historical artifacts** from the old locale-level blocks. These should clear over the next crawl cycles (typically 4–12 weeks) as Googlebot re-crawls and reads the page-level noindex.

---

## Action Items

| Issue | Severity | Action |
|---|---|---|
| 2,037 historical robots.txt blocks in GSC | MEDIUM | No code change needed — will clear as Google re-crawls. Submit sitemap.xml to GSC to prioritize re-crawl. |
| `/seo/` disallow (internal rewrites) | INFO | Correct as-is. Confirms public `/slug` URLs are canonical. |
| No `Disallow: /checkout/` | INFO | `/checkout` redirect to Stripe — low crawl risk. No action needed. |

---

## Verification

```bash
# Confirm robots.txt is correct in production
curl -s https://nursenest.io/robots.txt

# Expected: Allow: /, Disallow: /app/, /admin/, /internal/, /api/, /seo/
# Confirm sitemap URL is present
curl -s https://nursenest.io/robots.txt | grep Sitemap
```
