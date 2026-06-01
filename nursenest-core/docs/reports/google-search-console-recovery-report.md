# Google Search Console Recovery Report

Generated: 2026-06-01

## Executive Summary

The Search Console recovery priority is origin health first, then crawl queue recovery. The latest local GSC indexing audit and full indexability artifacts show that SEO metadata fixes are secondary while large portions of public content have recently returned origin-level failures.

The highest-value 500 URL crawl queue has been exported to:

```text
reports/search-console-recovery/highest-value-500-urls.csv
```

This queue contains:

- 490 URLs that were HTTP 200, sitemap-discovered, and not noindexed in the rerun artifact.
- 7 URLs with fetch errors that require live review before submission.
- 3 URLs returning HTTP 504/noindex that must wait until the production origin fix is deployed and verified.

## Evidence Sources

- `docs/reports/google-search-console-indexing-emergency-audit.md`
- `docs/reports/sitemap-health-report.md`
- `docs/reports/full-indexability-audit-rerun.md`
- `reports/full-indexability-audit-rerun/results.json`
- `reports/search-console-recovery/highest-value-500-urls.csv`

No local Search Console export CSVs were found, so URL-level prioritization is based on sitemap, live/indexability, and local crawl artifacts.

## Sitemap Freshness

The sitemap index is segmented and generated DB-free. The latest GSC emergency audit was generated at:

```text
2026-06-01T01:26:47.645Z
```

The highest-priority blog URLs in the 500-row queue have `lastmod` values concentrated around:

- `2026-05-27T12:00:00.000Z`
- `2026-05-10T01:18:14.994Z`
- `2026-05-09T12:00:00.000Z`
- `2026-04-14T01:39:20.244Z` through `2026-04-14T01:39:20.316Z`

These dates are fresh enough for resubmission once HTTP and canonical/internal-link prerequisites are cleared.

## Sitemap Segmentation

The sitemap index includes 25 child urlsets:

- `sitemap-en.xml`
- `sitemap-fr.xml`
- `sitemap-es.xml`
- `sitemap-hi.xml`
- `sitemap-pt.xml`
- `sitemap-ar.xml`
- `sitemap-de.xml`
- `sitemap-jp.xml`
- `sitemap-ko.xml`
- `sitemap-zh.xml`
- `sitemap-zh-tw.xml`
- `sitemap-it.xml`
- `sitemap-tl.xml`
- `sitemap-core.xml`
- `sitemap-blog.xml`
- `sitemap-fr-blog.xml`
- `sitemap-es-blog.xml`
- `sitemap-pathways.xml`
- `sitemap-lessons.xml`
- `sitemap-localized.xml`
- `sitemap-clinical-modules.xml`
- `sitemap-allied.xml`
- `sitemap-new-grad.xml`
- `sitemap-cnple.xml`
- `sitemap-authority-clusters.xml`

Local sitemap validation reported:

- Approved children: 12
- Page URLs validated: 1,413
- Duplicate sitemap URLs: 0
- Invalid private/excluded locs: 0
- Errors: 0
- Warnings: 0

## Blog Sitemap Coverage

Blog coverage exists in:

- `sitemap-blog.xml`
- `sitemap-fr-blog.xml`
- `sitemap-es-blog.xml`

The highest-value queue is primarily sourced from `sitemap-blog`, which confirms that the crawl-priority articles are discoverable through sitemap segmentation.

The known weakness is not initial sitemap inclusion for the top queue. The recurring blockers are:

- canonical missing
- not internally linked
- not linked from a hub
- production 504/fetch errors for a small tail of the top 500

## Multilingual Sitemap Coverage

Multilingual sitemap segmentation is present for site-wide locale coverage and blog-specific French/Spanish coverage:

- Site-wide locale sitemaps include English, French, Spanish, Hindi, Portuguese, Arabic, German, Japanese, Korean, Simplified Chinese, Traditional Chinese, Italian, and Tagalog.
- Blog-specific multilingual sitemaps currently include French and Spanish.

Two existing multilingual SEO contract tests currently fail on locale-gating expectations. Do not submit multilingual blog URLs aggressively until those gates are reconciled and production status is verified.

## Current Indexability Context

The latest full rerun artifact was generated before the current `/blog` hardening and reported:

| Metric | Count |
| --- | ---: |
| Audited URLs | 4,632 |
| Fully indexable URLs | 0 |
| Non-indexable or failing URLs | 4,632 |
| HTTP issues | 4,140 |
| HTTP 504 | 4,133 |
| Canonical issues | 4,625 |
| Noindex URLs | 4,135 |
| Missing from sitemap | 415 |
| Not internally linked | 4,582 |
| Not linked from blog hub | 4,582 |

The HTTP 504 problem must be treated as the first recovery gate. Google should not be asked to recrawl URLs that still return error HTML.

## Prioritized Reindexing Plan

### Phase 0: Confirm Origin Recovery

Before any GSC submission:

1. Deploy the `/blog` timeout hardening.
2. Verify:
   - `/`
   - `/healthz`
   - `/readyz`
   - `/blog`
   - `/blog?page=2`
   - `/blog?page=5`
   - `/blog?page=10`
   - `/sitemap.xml`
   - `/sitemap-blog.xml`
3. Confirm HTTP 504 count is zero or explicitly isolated.

### Phase 1: Resubmit Sitemap Index

Submit:

```text
https://nursenest.ca/sitemap.xml
```

Then submit priority child sitemaps:

```text
https://nursenest.ca/sitemap-blog.xml
https://nursenest.ca/sitemap-fr-blog.xml
https://nursenest.ca/sitemap-es-blog.xml
https://nursenest.ca/sitemap-pathways.xml
https://nursenest.ca/sitemap-lessons.xml
https://nursenest.ca/sitemap-allied.xml
https://nursenest.ca/sitemap-authority-clusters.xml
```

### Phase 2: Fix Canonical and Hub Links for the 490 Ready Candidates

The first 490 URLs in `highest-value-500-urls.csv` are not noindexed and were HTTP 200 in the rerun artifact. Their current reindex prerequisite is:

```text
submit_after_canonical_internal_link_fix
```

Fix canonical tags and ensure every URL is linked from at least one hub/category page before manual inspection requests.

### Phase 3: Review Fetch Errors

Ranks 491-497 have `fetch_error` in the rerun artifact. Recheck them live after deployment and submit only if they return 200, are indexable, and self-canonicalize.

### Phase 4: Submit the Three 504 Tail URLs Only After Repair

Ranks 498-500 returned 504/noindex in the rerun artifact. Do not submit these until they return 200 and no longer emit noindex:

- `https://nursenest.ca/blog/nclex-ngn-rn-pn-abcs-vs-maslow-nclex-cat-testing-strategy`
- `https://nursenest.ca/blog/nclex-ngn-rn-pn-abcs-vs-maslow-nclex-common-mistakes`
- `https://nursenest.ca/blog/nclex-ngn-rn-pn-abcs-vs-maslow-nclex-first-attempt-guide`

## Highest-Value URL Queue

Full export:

```text
reports/search-console-recovery/highest-value-500-urls.csv
```

Top 25 URLs:

1. `https://nursenest.ca/blog/asthma-pathophysiology-emergency-nursing-interventions`
2. `https://nursenest.ca/blog/beta-blockers-mechanism-side-effects-nursing-teaching`
3. `https://nursenest.ca/blog/acute-kidney-injury-prerenal-intrinsic-postrenal`
4. `https://nursenest.ca/blog/abg-interpretation-advanced-review-np-certification`
5. `https://nursenest.ca/blog/abo-rh-blood-group-typing-forward-reverse-mlt`
6. `https://nursenest.ca/blog/acc-injury-care-nursing-documentation-basics-nz-education`
7. `https://nursenest.ca/blog/ace-inhibitors-clinical-pharmacology-pharmacy-guide`
8. `https://nursenest.ca/blog/activity-analysis-ot-student-guide`
9. `https://nursenest.ca/blog/acute-abdominal-pain-workup-np-certification`
10. `https://nursenest.ca/blog/acute-care-ot-discharge-planning-basics`
11. `https://nursenest.ca/blog/acute-kidney-injury-fluid-electrolyte-nursing-review-australia`
12. `https://nursenest.ca/blog/acute-kidney-injury-nursing-priorities-licensing-exams-longtail`
13. `https://nursenest.ca/blog/acute-psychosis-agitation-prehospital-sedation-protocol-ems`
14. `https://nursenest.ca/blog/acute-stroke-management-np-certification`
15. `https://nursenest.ca/blog/adapting-to-nursing-work-australia-for-international-nurse-graduates`
16. `https://nursenest.ca/blog/adaptive-equipment-adls-ot`
17. `https://nursenest.ca/blog/adhd-management-review-np-certification`
18. `https://nursenest.ca/blog/adls-vs-iadls-ot-student-guide`
19. `https://nursenest.ca/blog/ahpra-nurse-registration-pathway-international-educational-overview`
20. `https://nursenest.ca/blog/airway-adjuncts-ems-difficult-airway-communication-and-plan-b-ems`
21. `https://nursenest.ca/blog/airway-adjuncts-ems-op-vs-npa-indications-and-sizing-ems`
22. `https://nursenest.ca/blog/airway-adjuncts-ems-post-intubation-confirmation-and-etco2-ems`
23. `https://nursenest.ca/blog/airway-adjuncts-ems-suction-bvm-and-two-person-ventilation-ems`
24. `https://nursenest.ca/blog/airway-adjuncts-ems-supraglottic-airway-selection-basics-ems`
25. `https://nursenest.ca/blog/altitude-illness-hape-hace-prehospital-recognition-ems`

## Go/No-Go

Current recommendation: **No-Go for bulk GSC URL inspection requests until production origin recovery is verified.**

After `/blog`, `/sitemap-blog.xml`, and sampled article URLs return stable 200 responses, proceed with sitemap resubmission and the first 490 URL queue after canonical/internal-link fixes.

