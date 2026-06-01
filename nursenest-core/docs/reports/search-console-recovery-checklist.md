# Search Console Recovery Checklist

Generated: 2026-06-01T01:26:47.645Z

## Before Validation

- [ ] Export GSC Server Error URL rows to `data/gsc-indexing/5xx.csv`.
- [ ] Run `npm run audit:gsc-indexing` and verify `docs/reports/seo-5xx-inventory.md` contains frequency-accurate rows.
- [ ] Run `npm run test:seo-sitemap`.
- [ ] Run `npm run qa:crawl-health` against local/staging.
- [ ] Run `SITEMAP_VERIFY_MAX_URLS=5000 SITEMAP_VERIFY_CONCURRENCY=4 npm run verify:sitemap` against production.
- [ ] Confirm all sitemap URLs return 200 indexable responses.
- [ ] Confirm no public route logs `crawl_surface public_route outcome=error`.

## Search Console Actions

- [ ] Resubmit `https://nursenest.ca/sitemap.xml`.
- [ ] Validate fix for Server Error (5xx).
- [ ] Request indexing only for high-value URLs after the route responds 200.
- [ ] Monitor Crawl Stats for server connectivity errors, DNS errors, and page fetch failures.
- [ ] Track daily 5xx count until it reaches zero.

## Deployment Gate

- [ ] CI blocks if public crawl health returns 5xx.
- [ ] CI blocks if sitemap contract tests fail.
- [ ] CI blocks if crawler path seeds fail.
- [ ] Production release notes include route-health artifacts and affected templates.

## Recovery Target

Search Console Server Errors (5xx): 8,122 -> 0.
