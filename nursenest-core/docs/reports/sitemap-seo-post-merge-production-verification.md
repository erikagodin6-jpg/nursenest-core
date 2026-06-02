# Sitemap SEO post-merge production verification (Phase 11)

**Purpose:** Verify deployed production sitemap and SEO behavior after merge, and track the deployment/artifact drift fix attempt.

**Production URL checked:** `https://www.nursenest.ca`

**Latest verification time:** 2026-05-10 06:49 UTC

**Scope:** Production verification and deployment/artifact readiness only. No sitemap architecture, `robots.txt` strategy, canonical logic, hreflang logic, route behavior, or entitlement/paywall behavior changed.

---

## Current status

**Status:** **Blocked before production redeploy.**

The local deployment artifact drift was corrected by deleting stale `.next`, running a fresh production build, and confirming all approved sitemap route bundles now exist in `.next`. Local sitemap validation and SEO guardrails are green.

Production has not yet been redeployed from this environment because DigitalOcean CLI access is not authenticated here (`doctl` reports: `access token is required`). Therefore live production may still serve the older 5-child sitemap index until an authenticated operator redeploys the fresh current branch/build and purges sitemap cache paths.

---

## Deployed commit SHA

| Source | Value | Notes |
|---|---|---|
| Local git HEAD prepared for deploy | `cefa108f623874e4a4b1f0e0107e574c723e5567` | Current local `main` at build time. |
| Fresh build metadata written locally | `cefa108f623874e4a4b1f0e0107e574c723e5567` | `npm run build` prebuild rewrote `public/nn-build-meta.json` with this commit. |
| Production `/api/version` from previous verification | `commit:null` | Production endpoint did not expose a deployed SHA, so live SHA remains unverified. |

---

## Fresh local build artifact route check

Before rebuilding, stale `.next` was removed with `rm -rf .next`.

A fresh `npm run build` completed successfully. The rebuilt `.next/server/app` output now includes route bundles for all approved sitemap routes:

| Approved route | Build artifact status |
|---|---|
| `sitemap.xml` | Present: `.next/server/app/sitemap.xml/route.js` |
| `sitemap-blog.xml` | Present: `.next/server/app/sitemap-blog.xml/route.js` |
| `sitemap-lessons.xml` | Present: `.next/server/app/sitemap-lessons.xml/route.js` |
| `sitemap-pathways.xml` | Present: `.next/server/app/sitemap-pathways.xml/route.js` |
| `sitemap-allied.xml` | Present: `.next/server/app/sitemap-allied.xml/route.js` |
| `sitemap-new-grad.xml` | Present: `.next/server/app/sitemap-new-grad.xml/route.js` |
| `sitemap-localized.xml` | Present: `.next/server/app/sitemap-localized.xml/route.js` |
| `sitemap-clinical-modules.xml` | Present: `.next/server/app/sitemap-clinical-modules.xml/route.js` |

**Result:** Pass.

---

## Commands run

| Command | Status |
|---|---|
| `rm -rf .next` | Pass |
| `npm run typecheck:critical` | Pass |
| `npm run build` | Pass |
| Build artifact route bundle check | Pass |
| `npm run seo:guardrails` | Pass |
| `npm run sitemap:validate` | Pass |
| `npm run sitemap:report` | Pass |
| `doctl apps list ...` | Blocked: DigitalOcean access token required |

Local validation summary from latest `npm run sitemap:report`:

| Field | Value |
|---|---|
| Index child set matches approved | yes |
| Duplicate page `<loc>` count | 0 |
| Invalid page loc occurrences | 0 |
| Errors | 0 |
| Warnings | 0 |

---

## Production sitemap status

Production was not redeployed during this update due to missing DigitalOcean authentication, so the last observed production status remains the known drift state from the earlier Phase 11 verification:

| Check | Last observed production status |
|---|---|
| `/sitemap.xml` root XML | Pass: returns `<sitemapindex>` |
| Production sitemap index child count | Fail: 5 children observed, expected 8 |
| Missing children | `sitemap-pathways.xml`, `sitemap-localized.xml`, `sitemap-clinical-modules.xml` |
| New child route XML status | Fail: missing routes returned HTML during prior check |
| Duplicate loc count | Fail: 24 duplicate locs observed in live child set during prior check |
| Private URL leak check | Pass: 0 private/system/query/hash locs observed in listed production children |
| `robots.txt` strategy | Pass: index-only strategy observed |

---

## Deployment blocker

DigitalOcean deployment could not be triggered from this environment because `doctl` is unauthenticated:

```txt
Error: Unable to initialize DigitalOcean API client: access token is required. (hint: run 'doctl auth init')
```

No speculative deployment, cache purge, or runtime fix was attempted after this blocker.

---

## Required authenticated deployment steps

An authenticated operator should now run one of the approved production deploy paths from the current branch/commit:

1. Confirm the deploy source is current `main` at `cefa108f623874e4a4b1f0e0107e574c723e5567` or a later commit containing the same rebuilt sitemap architecture.
2. Trigger a fresh DigitalOcean App Platform deployment using build command `npm run build` from source directory `nursenest-core`.
3. Confirm the deployment log includes a fresh build and not only postbuild packaging against stale `.next` output.
4. Confirm production `/api/version` reports the deployed commit if build metadata is available.
5. Purge/revalidate CDN cache for:
   - `/sitemap.xml`
   - `/robots.txt`
   - `/sitemap-core.xml`
   - `/sitemap-blog.xml`
   - `/sitemap-pathways.xml`
   - `/sitemap-lessons.xml`
   - `/sitemap-localized.xml`
   - `/sitemap-clinical-modules.xml`
   - `/sitemap-allied.xml`
   - `/sitemap-new-grad.xml`
6. Rerun production Phase 11 verification.

---

## Final go/no-go status

**No-go for final production sitemap/Search Console signoff until redeploy completes.**

The local fresh build is ready and validated, but production cannot be marked fixed until an authenticated deployment updates the live runtime and cache is purged or refreshed.

---

## Rollback recommendation

No rollback is recommended at this point because no new production deploy was performed from this session. If the authenticated redeploy later introduces sitemap 5xx errors, invalid XML, or private URL leakage, roll back through the normal DigitalOcean deployment mechanism to the last healthy release while preserving the index-only `robots.txt` strategy and public URL filtering.
