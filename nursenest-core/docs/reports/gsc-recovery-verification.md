# GSC Recovery Verification

Generated: 2026-06-01T02:39:39.237Z

| Metric | Count |
| --- | ---: |
| Previous GSC 5xx count | 8120+ |
| Current audited 5xx count | 5910 |
| Reduction percentage vs 8,120 baseline | 27.2% |
| Crawl success rate | 22.4% |

Goal: reduce GSC 5xx URLs from 8,120+ to under 50.

Verdict: target not met.

## Local Recovery Status

The runtime bootstrap recovery has been implemented and validated locally, but the live production crawl cannot be considered recovered until this build is deployed and the full sitemap audit is rerun against the promoted deployment.

Validation completed:

- `node --test scripts/standalone-bootstrap-healthz-preload.test.cjs scripts/start-standalone-bootstrap-runtime.test.cjs` — pass, 6/6.
- `NN_APPLY_NEXT_BUILD_HEAP_LIMIT=1 npm run build:production` — pass.

Current live spot check after the audit showed `/healthz`, `/readyz`, `/blog`, and `/sitemap.xml` returning `200` at rest, but the emergency crawl still recorded 5,910 `504` responses under sitemap-scale load. Treat Search Console recovery as **not certified** until the bootstrap fix is deployed and the emergency audit is rerun with `5xx < 50`.
