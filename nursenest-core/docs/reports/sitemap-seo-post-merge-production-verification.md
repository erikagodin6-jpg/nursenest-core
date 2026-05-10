# Sitemap SEO post-merge production verification (Phase 11)

**Purpose:** Verify deployed production sitemap and SEO behavior after merge.

**Production URL checked:** `https://www.nursenest.ca`

**Verification time:** 2026-05-10 06:33 UTC

**Scope:** Production verification/report only. No runtime code, sitemap segment definitions, `robots.txt`, canonical logic, hreflang logic, route behavior, or entitlement/paywall behavior changed in this phase.

---

## Summary

**Status:** **No-go for final production signoff.**

Local branch validation is green, but live production does not yet match the approved post-Phase-10 sitemap architecture. Production `https://www.nursenest.ca/sitemap.xml` is returning the older 5-child sitemap index instead of the approved 8-child index, and the live child sitemap set contains duplicate page loc values.

This appears to be a deployment/state mismatch rather than a local code failure: local `seo:guardrails`, `sitemap:validate`, and `sitemap:report` all pass against the current implementation.

---

## Commands run

| Command | Status |
|---|---|
| `npm run typecheck:critical` | Pass |
| `npm run seo:guardrails` | Pass |
| `npm run sitemap:validate` | Pass |
| `npm run sitemap:report` | Pass |
| Production HTTP verification script against `https://www.nursenest.ca` | Fail: production sitemap architecture mismatch + duplicate locs |

Local validation summary from `npm run sitemap:report`:

| Field | Value |
|---|---|
| Index child set matches approved | yes |
| Duplicate page `<loc>` count | 0 |
| Invalid page loc occurrences | 0 |
| Errors | 0 |
| Warnings | 0 |

---

## Production sitemap index evidence

`https://www.nursenest.ca/sitemap.xml` returned HTTP 200 with `application/xml; charset=utf-8` and root `<sitemapindex>`.

Production sample:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>https://www.nursenest.ca/sitemap-core.xml</loc>
    <lastmod>2026-05-10</lastmod>
  </sitemap>
  <sitemap>
    <loc>https://www.nursenest.ca/sitemap-blog.xml</loc>
    <lastmod>2026-05-10</lastmod>
  </sitemap>
  <sitemap>
    <loc>https://www.nursenest.ca/sitemap-lessons.xml</loc>
    <lastmod>2026-05-10</lastmod>
  </sitemap>
  <sitemap>
    <loc>https://www.nursenest.ca/sitemap-allied.xml</loc>
    <lastmod>2026-05-10</lastmod>
  </sitemap>
  <sitemap>
    <loc>https://www.nursenest.ca/sitemap-new-grad.xml</loc>
    <lastmod>2026-05-10</lastmod>
  </sitemap>
</sitemapindex>
```

Expected approved child set from the current local implementation:

- `https://www.nursenest.ca/sitemap-core.xml`
- `https://www.nursenest.ca/sitemap-blog.xml`
- `https://www.nursenest.ca/sitemap-pathways.xml`
- `https://www.nursenest.ca/sitemap-lessons.xml`
- `https://www.nursenest.ca/sitemap-localized.xml`
- `https://www.nursenest.ca/sitemap-clinical-modules.xml`
- `https://www.nursenest.ca/sitemap-allied.xml`
- `https://www.nursenest.ca/sitemap-new-grad.xml`

**Result:** Fail. Production is missing `sitemap-pathways.xml`, `sitemap-localized.xml`, and `sitemap-clinical-modules.xml` from the index.

---

## robots.txt evidence

`https://www.nursenest.ca/robots.txt` returned HTTP 200 with `text/plain; charset=utf-8`.

Production sample:

```txt
User-agent: *
Allow: /
Disallow: /app/
Disallow: /admin/
Disallow: /internal/
Disallow: /api/
Disallow: /seo/
Disallow: /ta/
Disallow: /te/
Disallow: /bn/
Disallow: /mr/
Disallow: /gu/
```

Verification notes:

- `robots.txt` includes `Disallow: /app/`, `/admin/`, `/api/`, and `/seo/`.
- The production response contains a single sitemap directive pointing to `https://www.nursenest.ca/sitemap.xml`.
- Strategy is correct: robots points to the index only.

**Result:** Pass.

---

## Child sitemap production checks

| Child sitemap | HTTP/XML status | URL count | Invalid/private locs | Sample locs |
|---|---:|---:|---:|---|
| `sitemap-core.xml` | 200 / valid `urlset` | 482 | 0 | `/`, `/about`, `/question-bank`, `/practice-exams`, `/pricing` |
| `sitemap-blog.xml` | 200 / valid `urlset` | 48 | 0 | `/blog`, `/blog/acute-kidney-injury-prerenal-intrinsic-postrenal`, `/blog/asthma-pathophysiology-emergency-nursing-interventions` |
| `sitemap-lessons.xml` | 200 / valid `urlset` | 7 | 0 | `/lessons`, `/canada/np/cnple/lessons`, `/canada/rn/nclex-rn/lessons` |
| `sitemap-allied.xml` | 200 / valid `urlset` | 24 | 0 | `/allied/allied-health`, `/allied-health`, `/allied-health/pta-exam-prep` |
| `sitemap-new-grad.xml` | 200 / valid `urlset` | 46 | 0 | `/us/new-grad`, `/us/new-grad/med-surg`, `/us/new-grad/emergency-department` |

Production child sitemap findings:

- All child sitemaps currently listed in production return HTTP 200 and valid XML.
- No `/app`, `/admin`, `/api`, `/seo`, query, or hash locs were found in listed child sitemap URLs.
- **Duplicate loc values across the live child sitemap set: 24.**

**Result:** Fail due to duplicate locs and incomplete approved child sitemap set.

---

## Representative page checks

| Page family | Representative URL | HTTP status | Canonical | Hreflang | BreadcrumbList JSON-LD | Status |
|---|---|---:|---|---:|---|---|
| Blog | `https://www.nursenest.ca/blog/acute-kidney-injury-prerenal-intrinsic-postrenal` | 200 | Not found in parsed response | 0 | Present/valid | Warning |
| Lesson | `https://www.nursenest.ca/lessons` | 200 | `https://www.nursenest.ca/lessons` | 6 | Present/valid | Pass |
| Allied | `https://www.nursenest.ca/allied/allied-health` | 200 | `https://www.nursenest.ca/allied/allied-health` | 0 | Not found | Warning |
| New grad | `https://www.nursenest.ca/us/new-grad` | 200 | `https://www.nursenest.ca/us/new-grad` | 0 | Present/valid | Pass |

Representative pathway and localized URLs were not selected from the production sitemap because the live production index does not include the approved `sitemap-pathways.xml` or `sitemap-localized.xml` children.

**Result:** Partial. Representative URLs that were available resolved, but production sitemap architecture prevented full pathway/localized verification through the approved sitemap index.

---

## Pass/fail status

| Requirement | Status | Notes |
|---|---|---|
| `https://www.nursenest.ca/sitemap.xml` returns sitemap index XML | Pass | Root is `<sitemapindex>`. |
| All child sitemap URLs return valid XML | Pass | For the 5 children currently listed in production. |
| `robots.txt` references approved sitemap strategy | Pass | Index-only strategy retained. |
| No private/system/query/hash URLs appear | Pass | 0 invalid/private locs found in listed production children. |
| No duplicate loc values across child sitemaps | **Fail** | 24 duplicate locs found in the live production child set. |
| Blog representative URL resolves | Pass with warning | 200 + BreadcrumbList; canonical not found in parsed response. |
| Lesson representative URL resolves | Pass | 200 + canonical + hreflang + BreadcrumbList. |
| Pathway representative URL resolves from approved segment | **Fail/blocked** | Production index lacks `sitemap-pathways.xml`. |
| Allied representative URL resolves | Pass with warning | 200 + canonical; BreadcrumbList not found. |
| New-grad representative URL resolves | Pass | 200 + canonical + BreadcrumbList. |
| Localized representative URL resolves from approved segment | **Fail/blocked** | Production index lacks `sitemap-localized.xml`. |
| Representative localized hreflang alternates | **Fail/blocked** | No localized segment available from production index. |

---

## Blockers

1. **Production sitemap index is not on the approved 8-child architecture.**
   - Live index lists only `core`, `blog`, `lessons`, `allied`, and `new-grad`.
   - Expected index also includes `pathways`, `localized`, and `clinical-modules`.

2. **Production child sitemap set has duplicate loc values.**
   - Live verification found 24 duplicate locs across the currently listed child sitemaps.
   - Local `sitemap:validate` reports duplicate loc count 0, which reinforces that production is behind or serving an older build.

3. **Full representative pathway/localized verification is blocked by production index state.**
   - The approved pathway and localized child sitemaps are not advertised by the live index.

---

## Non-blocking warnings

- Representative blog page resolved with valid BreadcrumbList JSON-LD, but no canonical tag was found by the lightweight parser in the sampled HTML response.
- Representative allied page resolved with a canonical tag, but BreadcrumbList JSON-LD was not found by the lightweight parser. This may be expected for that template, but should be confirmed against the breadcrumb audit expectations.
- Search Console submission evidence was not available in this local verification session.

---

## Rollback / release recommendation

**Do not submit the current production sitemap state to Search Console as the completed Phase 11 release.**

Recommended action:

1. Confirm the Phase 1-10 branch has actually deployed to production and that no CDN/application cache is serving the old sitemap index.
2. Re-run production verification after deploy/cache confirmation.
3. If production cannot be updated quickly and sitemap duplicates are causing crawl issues, roll back to the last known intentional sitemap policy only through the normal deployment path, preserving public URL filtering and `robots.txt` index-only behavior.
4. Do not change runtime code during Phase 11 unless a confirmed production blocker is traced to current code rather than stale deployment state.

---

## Search Console next steps

- Do not mark Search Console handoff complete until production `https://www.nursenest.ca/sitemap.xml` lists the approved 8 child sitemaps.
- After production matches local validation, submit only `https://www.nursenest.ca/sitemap.xml`.
- Monitor submitted vs indexed counts, sitemap fetch status, duplicate canonical warnings, alternate/hreflang warnings, excluded URLs, and private route leakage after submission.
- Record submission date/time and unresolved warnings in the release ticket.

---

## Final status

**Production verification failed due to deployed sitemap architecture drift.**

Local implementation remains green and release-ready, but production is not yet serving the approved sitemap index and child sitemap partitioning.
