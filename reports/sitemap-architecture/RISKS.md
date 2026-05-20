# Sitemap architecture — risks

## P0
- **R1** Listing `/app` or `/api` in sitemap — mitigated by `isValidPublicUrl` + tests; extend grep in CI if segmenting.
- **R2** Sitemap URLs that 404 or noindex at scale — use `PUBLIC_URL_HTTP_VALIDATE`, monitor pathway DB skips.

## P1
- **R4** Approaching 50k URLs in one urlset — caps exist; plan index + chunks (see PROPOSED_STRUCTURE).
- **R5** DB/build skip silently thinning pathway URLs — log review.

## P2
- **R7** New Grad sitemap fallback `/new-grad` may 404 — fix fallback to `/us/new-grad`.
- **R8** Duplicate URLs across main + segment sitemaps — acceptable; dedupe within file only.

## P3
- **R11** Robots + `verify-robots.ts` hard-code three sitemap lines — centralize when adding index.

See AUDIT.md for hreflang partial-tier notes.
