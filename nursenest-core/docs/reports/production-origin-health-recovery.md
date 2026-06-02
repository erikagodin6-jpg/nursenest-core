# Production Origin Health Recovery

Generated: 2026-05-31T23:55:00Z

## Verdict

Production origin health is **not yet certified recovered**.

The production app can return healthy responses at rest, but the full indexability rerun reproduced `504 no_healthy_upstream` during a crawl of the blog article corpus. A local code fix has been implemented to reduce public blog route pressure, but it must be deployed before production can meet the acceptance criteria.

## Root Cause

Evidence points to public blog article route pressure exhausting or destabilizing the active DigitalOcean upstream during high-volume crawl traffic.

Observed sequence:

1. Before the rerun, production returned 200 for `/`, `/healthz`, `/readyz`, `/blog`, `/sitemap.xml`, and `/sitemap-blog.xml`.
2. The rerun crawled the same 4,632 URL corpus used by the original full indexability audit.
3. During the crawl, 4,133 URLs returned `HTTP 504` with `x-do-failure-code: UH`, `x-do-failure-msg: no_healthy_upstream`, and `x-do-orig-status: 503`.
4. Immediately after the crawl, `/healthz` and `/readyz` also returned the same `504 no_healthy_upstream`.
5. A few minutes later, `/healthz`, `/readyz`, and the sampled article URL recovered to 200.

The likely failing pattern is too many simultaneous public blog detail requests causing the runtime to overload DB-backed blog reads and/or process resources. The active route previously performed DB-first slug resolution even when a source-controlled static article exists, and there was no per-process cap on public blog DB reads.

## Files Changed

| File | Purpose |
| --- | --- |
| `src/lib/blog/safe-blog-queries.ts` | Added public blog DB-read concurrency cap and static-first fallback for source-controlled blog details. |
| `scripts/seo/full-indexability-audit-rerun.mts` | Added a rerun script that reuses the exact prior 4,632 URL corpus and exports fresh JSON/CSV/MD evidence. |
| `docs/reports/full-indexability-audit-rerun.md` | Fresh rerun summary. |
| `reports/full-indexability-audit-rerun/results.json` | Fresh per-URL rerun results. |
| `reports/full-indexability-audit-rerun/failures.csv` | Fresh failure export. |

## Environment / Config Findings

- No DigitalOcean API or service-log access was available in this shell, so App Platform service health, boot logs, OOM events, and readiness-probe timing could not be directly inspected.
- Prior repository evidence in `docs/reports/digitalocean-runtime-env-final-deploy-evidence.md` shows historical deployment instability around runtime/build env and a rollback active deployment. This is relevant background, but the current reproduction was triggered by live public blog route load.
- Current production intermittently recovers at rest, which makes this look like load-triggered upstream instability rather than a permanently missing route or sitemap template.

## Before / After Health Checks

### Initial live checks before rerun

| URL | Status | Notes |
| --- | ---: | --- |
| `https://nursenest.ca/` | 200 | Origin status 200. |
| `https://nursenest.ca/healthz` | 200 | Origin status 200. |
| `https://nursenest.ca/readyz` | 200 | Origin status 200. |
| `https://nursenest.ca/blog` | 200 | Cloudflare cache hit, origin status 200. |
| `https://nursenest.ca/sitemap.xml` | 200 | Cloudflare cache hit, origin status 200. |
| `https://nursenest.ca/sitemap-blog.xml` | 200 | Cloudflare cache hit, origin status 200. |

### Immediately after full rerun load

| URL | Status | Notes |
| --- | ---: | --- |
| `https://nursenest.ca/healthz` | 504 | `x-do-failure-msg: no_healthy_upstream`; `x-do-orig-status: 503`. |
| `https://nursenest.ca/readyz` | 504 | `x-do-failure-msg: no_healthy_upstream`; `x-do-orig-status: 503`. |
| `https://nursenest.ca/blog/canadian-np-adult-womens-sexual-health-prescribing-safety-documentation` | 504 | Same DigitalOcean upstream failure. |
| `https://nursenest.ca/blog` | 200 | Served stale/updating Cloudflare cached HTML. |

### Recovery-at-rest spot check

| URL | Status | Notes |
| --- | ---: | --- |
| `https://nursenest.ca/healthz` | 200 | Recovered after crawl pressure stopped. |
| `https://nursenest.ca/readyz` | 200 | Recovered after crawl pressure stopped. |
| `https://nursenest.ca/blog/canadian-np-adult-womens-sexual-health-prescribing-safety-documentation` | 200 | Recovered after crawl pressure stopped. |
| `https://nursenest.ca/sitemap-blog.xml` | 200 | Cached sitemap remained available. |

## Indexability Before / After

| Metric | Original Audit | Rerun |
| --- | ---: | ---: |
| Audited URLs | 4,632 | 4,632 |
| Fully indexable URLs | 0 | 0 |
| HTTP issues | 4,628 | 4,140 |
| HTTP 504 count | 4,628 | 4,133 |
| Canonical issues | 4,632 | 4,625 |
| Noindex URLs | 4,629 | 4,135 |
| Missing from sitemap | 415 | 415 |
| Not internally linked | 4,432 | 4,582 |
| Not linked from hub | 4,432 | 4,582 |

Rerun exports:

- `docs/reports/full-indexability-audit-rerun.md`
- `reports/full-indexability-audit-rerun/results.json`
- `reports/full-indexability-audit-rerun/failures.csv`

## Sampled URLs

The first 25 rerun sample rows began as 200 responses, then the origin degraded later in the crawl. This mixed result is the key health signal: the app is not permanently down, but it cannot sustain the crawl.

Representative 504 rows from the rerun:

| URL | Status | Failure |
| --- | ---: | --- |
| `https://nursenest.ca/blog/canadian-np-adult-womens-sexual-health-prescribing-safety-documentation` | 504 | `no_healthy_upstream` |
| `https://nursenest.ca/blog/canadian-np-anchor-adult-ambiguous-chest-pain-office-triage` | 504 | `no_healthy_upstream` |
| `https://nursenest.ca/blog/canadian-np-anchor-anticoagulation-af-stroke-prevention-choice` | 504 | `no_healthy_upstream` |
| `https://nursenest.ca/blog/canadian-np-anchor-copd-exacerbation-ambulatory-management` | 504 | `no_healthy_upstream` |
| `https://nursenest.ca/blog/canadian-np-anchor-hfref-four-pillar-therapy-primary-care` | 504 | `no_healthy_upstream` |

## Fix Applied Locally

`src/lib/blog/safe-blog-queries.ts` now:

- caps concurrent public blog DB reads per process using `BLOG_PUBLIC_DB_CONCURRENCY` with a default of 4;
- serves source-controlled static blog details before querying the DB unless `BLOG_DETAIL_STATIC_FIRST=0`;
- preserves the existing static fallback for build-time, missing DB, DB miss, and non-live row cases.

This should reduce DB pressure for source-controlled long-tail articles and prevent crawler bursts from opening thousands of concurrent blog DB reads.

## Verification

Passed:

```text
node --require ./scripts/stub-server-only.cjs --import tsx --test \
  src/lib/blog/safe-blog-queries.build-phase.test.mts \
  src/lib/blog/safe-blog-queries.list-load.test.mts \
  src/lib/blog/safe-blog-queries.get-published-blog-post-by-slug.test.ts \
  src/lib/blog/blog-canonical-pipeline.contract.test.ts \
  src/lib/blog/blog-public-article-html.test.ts
```

Result: 5/5 passing.

Attempted:

```text
npx tsc --noEmit --pretty false
```

Result: failed on pre-existing unrelated TypeScript errors across lessons, sitemap locale routes, admin blog clients, authority engines, ECG modules, and other files. No errors were reported for `src/lib/blog/safe-blog-queries.ts`.

## Remaining SEO Defects After Origin Recovery

These are still secondary until production sustains a full crawl without 504s:

1. Missing canonicals on thousands of blog/article pages.
2. 415 static supplement URLs missing from the live sitemap.
3. Blog hub/internal-link coverage gaps.
4. Noindex responses on static supplement URLs and error responses.
5. Need a canonical/linking rerun after the blog route pressure fix is deployed.

## Next Recommended Fix Order

1. Deploy the blog route pressure fix.
2. Run `/healthz`, `/readyz`, `/blog`, `/sitemap-blog.xml`, and a 25-article sample immediately after deployment.
3. Rerun the full indexability audit with `INDEXABILITY_AUDIT_CONCURRENCY=4` first; if clean, rerun with concurrency 8.
4. If 504 persists, inspect DigitalOcean logs for OOM, process exits, readiness timeout, Prisma connection exhaustion, and database connection limits.
5. Only after HTTP 504 count is 0, repair canonical, noindex, sitemap, and internal-link defects.

## Acceptance Criteria Status

| Criterion | Status |
| --- | --- |
| Production `no_healthy_upstream` resolved | Not yet; reproduced under crawl load. |
| `/healthz: 200` | Pass at rest; fails during crawl pressure. |
| `/readyz: 200` | Pass at rest; fails during crawl pressure. |
| `/blog: 200` | Pass, often cache-served. |
| `/sitemap-blog.xml: 200` | Pass, cache-served. |
| Sample blog articles: 200 | Mixed; pass at rest, fail during crawl pressure. |
| HTTP 504 count: 0 | Fail; rerun found 4,133. |
| Fresh indexability audit completed | Pass; rerun completed and exported. |
