# Sitemap Health Report

Generated: 2026-06-01T01:26:47.645Z

## Sitemap Index Children

| Child Sitemap | Expected Policy |
| --- | --- |
| sitemap-en.xml | Must return 200 XML, no redirect, only indexable public URLs |
| sitemap-fr.xml | Must return 200 XML, no redirect, only indexable public URLs |
| sitemap-es.xml | Must return 200 XML, no redirect, only indexable public URLs |
| sitemap-hi.xml | Must return 200 XML, no redirect, only indexable public URLs |
| sitemap-pt.xml | Must return 200 XML, no redirect, only indexable public URLs |
| sitemap-ar.xml | Must return 200 XML, no redirect, only indexable public URLs |
| sitemap-de.xml | Must return 200 XML, no redirect, only indexable public URLs |
| sitemap-jp.xml | Must return 200 XML, no redirect, only indexable public URLs |
| sitemap-ko.xml | Must return 200 XML, no redirect, only indexable public URLs |
| sitemap-zh.xml | Must return 200 XML, no redirect, only indexable public URLs |
| sitemap-zh-tw.xml | Must return 200 XML, no redirect, only indexable public URLs |
| sitemap-it.xml | Must return 200 XML, no redirect, only indexable public URLs |
| sitemap-tl.xml | Must return 200 XML, no redirect, only indexable public URLs |
| sitemap-core.xml | Must return 200 XML, no redirect, only indexable public URLs |
| sitemap-blog.xml | Must return 200 XML, no redirect, only indexable public URLs |
| sitemap-fr-blog.xml | Must return 200 XML, no redirect, only indexable public URLs |
| sitemap-es-blog.xml | Must return 200 XML, no redirect, only indexable public URLs |
| sitemap-pathways.xml | Must return 200 XML, no redirect, only indexable public URLs |
| sitemap-lessons.xml | Must return 200 XML, no redirect, only indexable public URLs |
| sitemap-localized.xml | Must return 200 XML, no redirect, only indexable public URLs |
| sitemap-clinical-modules.xml | Must return 200 XML, no redirect, only indexable public URLs |
| sitemap-allied.xml | Must return 200 XML, no redirect, only indexable public URLs |
| sitemap-new-grad.xml | Must return 200 XML, no redirect, only indexable public URLs |
| sitemap-cnple.xml | Must return 200 XML, no redirect, only indexable public URLs |
| sitemap-authority-clusters.xml | Must return 200 XML, no redirect, only indexable public URLs |

## Local Sitemap Guards

- `filterPublicSitemapEntries` rejects auth noindex paths, app/admin/api/internal, `/seo/`, query/hash URLs, wrong origins, non-HTTPS URLs, and trailing slash variants.
- `/sitemap.xml` is an index route and does not require database reads.
- Build-time sitemap validation artifact exists at `reports/build-artifact-cache/sitemap-validation.json`.

## Local Validation Run

- `npm run sitemap:validate` passed on 2026-05-30.
- Local segment validation emitted 12 approved sitemap children, 1,413 page URLs, 0 duplicate `<loc>` values, 0 invalid private/excluded locs, 0 errors, and 0 warnings.
- Local metadata spot checks for production-noindex suspects returned indexable metadata in this workspace.

## Live Production Smoke Run

`SITEMAP_VERIFY_MAX_URLS=500 SITEMAP_VERIFY_CONCURRENCY=8 npm run verify:sitemap` checked the first 500 production sitemap URLs on 2026-05-30. It found 38 failures: 17 route timeouts and 21 HTML noindex responses.

Timeout URLs:

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

HTML noindex URLs:

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

## Known Exclusions

- `/app/*`
- `/admin/*`
- `/api/*`
- `/internal/*`
- `/seo/*`
- Auth noindex routes unless explicitly allowed for crawler discovery.

## Health Checks To Run

```bash
npm run verify:robots
SITEMAP_VERIFY_MAX_URLS=5000 SITEMAP_VERIFY_CONCURRENCY=8 npm run verify:sitemap
npm run sitemap:validate
npm run test:seo-sitemap
npm run qa:crawl-health
```

## Required Sitemap Cleanliness

Sitemap URL sets must contain zero 404s, zero redirects, zero noindex pages, zero blocked URLs, and zero 5xx routes. The live verifier is the enforcement tool for that contract.
