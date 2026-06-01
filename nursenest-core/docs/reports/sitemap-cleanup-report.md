# Sitemap Cleanup Report

Generated: 2026-06-01T01:26:47.645Z

## Sitemap Contract

Sitemaps must contain only 200-status, indexable, canonical, published, public content URLs.

They must remove 404s, redirects, noindex URLs, robots-blocked URLs, 5xx/timeouts, and private app/admin/API/internal/auth routes.

## Sitemap Children

| Child Sitemap | Policy |
| --- | --- |
| sitemap-en.xml | 200 XML only; indexable public canonical URLs only. |
| sitemap-fr.xml | 200 XML only; indexable public canonical URLs only. |
| sitemap-es.xml | 200 XML only; indexable public canonical URLs only. |
| sitemap-hi.xml | 200 XML only; indexable public canonical URLs only. |
| sitemap-pt.xml | 200 XML only; indexable public canonical URLs only. |
| sitemap-ar.xml | 200 XML only; indexable public canonical URLs only. |
| sitemap-de.xml | 200 XML only; indexable public canonical URLs only. |
| sitemap-jp.xml | 200 XML only; indexable public canonical URLs only. |
| sitemap-ko.xml | 200 XML only; indexable public canonical URLs only. |
| sitemap-zh.xml | 200 XML only; indexable public canonical URLs only. |
| sitemap-zh-tw.xml | 200 XML only; indexable public canonical URLs only. |
| sitemap-it.xml | 200 XML only; indexable public canonical URLs only. |
| sitemap-tl.xml | 200 XML only; indexable public canonical URLs only. |
| sitemap-core.xml | 200 XML only; indexable public canonical URLs only. |
| sitemap-blog.xml | 200 XML only; indexable public canonical URLs only. |
| sitemap-fr-blog.xml | 200 XML only; indexable public canonical URLs only. |
| sitemap-es-blog.xml | 200 XML only; indexable public canonical URLs only. |
| sitemap-pathways.xml | 200 XML only; indexable public canonical URLs only. |
| sitemap-lessons.xml | 200 XML only; indexable public canonical URLs only. |
| sitemap-localized.xml | 200 XML only; indexable public canonical URLs only. |
| sitemap-clinical-modules.xml | 200 XML only; indexable public canonical URLs only. |
| sitemap-allied.xml | 200 XML only; indexable public canonical URLs only. |
| sitemap-new-grad.xml | 200 XML only; indexable public canonical URLs only. |
| sitemap-cnple.xml | 200 XML only; indexable public canonical URLs only. |
| sitemap-authority-clusters.xml | 200 XML only; indexable public canonical URLs only. |

## Source Guards

- `filterPublicSitemapEntries` applies URL-level public index eligibility checks.
- `isEligiblePublicIndexSitemapLoc` rejects private, noindex, query/hash, trailing slash, wrong-origin, and non-HTTPS locs.
- `/sitemap.xml` is a sitemap index and avoids DB-heavy generation.
- Proxy bypass covers `/sitemap.xml`, `/sitemap-*.xml`, and `/robots.txt`.

## Known Production Smoke Issues To Recheck

Timeouts from first 500 production sitemap URLs on 2026-05-30:

- https://nursenest.ca/canada/rn/nclex-rn/questions
- https://nursenest.ca/us/rn/nclex-rn/questions
- https://nursenest.ca/us/np/fnp/questions
- https://nursenest.ca/us/np/pmhnp/questions
- https://nursenest.ca/us/np/whnp/questions
- https://nursenest.ca/us/np/pnp-pc
- https://nursenest.ca/us/np/pnp-pc/pricing
- https://nursenest.ca/us/np/pnp-pc/questions
- https://nursenest.ca/us/rn/nclex-rn/test-bank
- https://nursenest.ca/canada/rpn/rex-pn/test-bank
- https://nursenest.ca/canada/np/cnple/test-bank
- https://nursenest.ca/us/np/fnp/test-bank
- https://nursenest.ca/us/np/agpcnp/test-bank
- https://nursenest.ca/canada/pn/rex-pn/rex-pn-practice-questions-cardiovascular
- https://nursenest.ca/canada/pn/rex-pn/rex-pn-practice-questions-respiratory
- https://nursenest.ca/canada/pn/rex-pn/rex-pn-practice-questions-gastrointestinal
- https://nursenest.ca/canada/pn/rex-pn/rex-pn-practice-questions-neurological

Noindex HTML from first 500 production sitemap URLs on 2026-05-30:

- https://nursenest.ca/canada/np/cnple/pricing
- https://nursenest.ca/canada/np/cnple/np-clinical-practice-cardiovascular
- https://nursenest.ca/canada/np/cnple/np-clinical-practice-respiratory
- https://nursenest.ca/canada/np/cnple/np-clinical-practice-renal-and-fluid
- https://nursenest.ca/canada/np/cnple/np-clinical-practice-gastrointestinal
- https://nursenest.ca/canada/np/cnple/np-clinical-practice-neurological
- https://nursenest.ca/canada/np/cnple/np-clinical-practice-endocrine
- https://nursenest.ca/canada/np/cnple/np-clinical-practice-musculoskeletal
- https://nursenest.ca/canada/np/cnple/np-clinical-practice-immune-and-infection
- https://nursenest.ca/canada/np/cnple/np-lessons-cardiovascular
- https://nursenest.ca/canada/np/cnple/np-lessons-respiratory
- https://nursenest.ca/canada/np/cnple/np-lessons-renal-and-fluid
- https://nursenest.ca/canada/np/cnple/np-lessons-gastrointestinal
- https://nursenest.ca/canada/np/cnple/np-lessons-neurological
- https://nursenest.ca/canada/np/cnple/np-lessons-endocrine
- https://nursenest.ca/canada/np/cnple/np-lessons-musculoskeletal
- https://nursenest.ca/canada/np/cnple/np-lessons-immune-and-infection
- https://nursenest.ca/canada/np/cnple/pharmacology-nursing-cardiac-meds
- https://nursenest.ca/canada/np/cnple/pharmacology-nursing-diabetes-meds
- https://nursenest.ca/canada/np/cnple/pharmacology-nursing-antibiotics
- https://nursenest.ca/canada/np/cnple/pharmacology-nursing-pain-and-sedation

## Required Cleanup Command

```bash
SITEMAP_VERIFY_MAX_URLS=5000 SITEMAP_VERIFY_CONCURRENCY=4 npm run verify:sitemap
```
