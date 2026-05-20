# Crawl-health regression (Playwright)

Unauthenticated HTTP audit: sitemap URLs + a fixed seed list. Checks status codes, redirect depth, canonical link vs final URL, `robots` meta (with intentional exceptions for partial marketing locales), JSON-LD snippet presence, and a bounded sample of internal links.

## Local

From `nursenest-core/` (starts `next dev` unless the port is already up or you skip the server):

```bash
npm run qa:crawl-health
```

Against an already-running local server:

```bash
PLAYWRIGHT_SKIP_WEB_SERVER=1 BASE_URL=http://127.0.0.1:3000 npm run qa:crawl-health
```

## Production / staging

**Read-only, bounded** — keep concurrency low; do not run in tight loops without approval.

```bash
PLAYWRIGHT_SKIP_WEB_SERVER=1 BASE_URL=https://www.nursenest.ca npm run qa:crawl-health:remote
```

## Tunables (env)

| Variable | Default | Purpose |
|----------|---------|---------|
| `CRAWL_MAX_SITEMAP_URLS` | `120` | Cap sitemap `<loc>` intake |
| `CRAWL_MAX_REDIRECT_HOPS` | `3` | Fail if more hops than this |
| `CRAWL_MAX_INTERNAL_LINK_CHECKS` | `150` | Cap distinct internal paths checked |
| `CRAWL_LINK_SAMPLE_HTML_PAGES` | `10` | HTML pages to scrape for `<a href>` |
| `CRAWL_CONCURRENCY` | `3` | Parallel fetches |

## Artifacts

Written under the test output directory, e.g. `test-results/.../crawl-health-artifacts/`:

- `crawl-health-report.json` — full row detail
- `broken-urls.json`
- `redirect-chains.json` — any URL with 2+ redirect hops (informational)
- `redirect-failures.json` — exceeded max hops
- `canonical-mismatches.json`
- `noindex-index-mismatches.json` — sitemap URL with unexpected `noindex` (partial locales excluded)
- `sitemap-auth-pollution.json` — auth paths present as sitemap targets
- `broken-internal-links.json`
- `obvious-broken-html.json` — weak 404 heuristics on HTML
