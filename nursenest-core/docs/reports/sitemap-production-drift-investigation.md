# Sitemap production drift investigation

**Purpose:** Investigate why production does not match the validated local sitemap architecture.

**Scope:** Deployment/caching drift only. No sitemap features, canonical logic, hreflang logic, routing, or paywall behavior changed.

**Production URL checked:** `https://www.nursenest.ca`

**Investigation time:** 2026-05-10 06:36 UTC

---

## Executive summary

Production is serving an older/incomplete sitemap deployment.

The strongest evidence is that cache-busted production requests to `/sitemap.xml` still return the older 5-child sitemap index from origin, and direct requests to the three new sitemap routes return regular HTML instead of sitemap XML. This is not explained by Cloudflare cache alone.

**Most likely root cause:** the production runtime/build artifact does not include the Phase 1-10 sitemap route handlers and current sitemap index bundle. Either the Phase 1-10 branch was not deployed, the deployment promoted an older `.next` artifact, or the deploy/build pipeline ran a postbuild step without a fresh `next build`.

---

## Root cause findings

| Finding | Evidence | Confidence |
|---|---|---|
| Production is not serving the validated 8-child sitemap index. | Live `/sitemap.xml` lists only `sitemap-core.xml`, `sitemap-blog.xml`, `sitemap-lessons.xml`, `sitemap-allied.xml`, and `sitemap-new-grad.xml`. | High |
| Cloudflare is caching the old index, but cache is not the only cause. | Normal `/sitemap.xml` returned `cf-cache-status: HIT`, `Age: 265`; cache-busted `/sitemap.xml?phase11_cache_bust=1` returned `cf-cache-status: MISS` but still returned the old 5-child index with the same ETag. | High |
| New sitemap route handlers are not deployed/routed in production. | `/sitemap-pathways.xml`, `/sitemap-localized.xml`, and `/sitemap-clinical-modules.xml` returned HTTP 200 HTML documents with `Content-Type: text/html`, not XML urlsets. | High |
| Live build version endpoint cannot prove deployed SHA. | `/api/version` returned `{"ok":true,"commit":null,"branch":null,"recordedAt":"2026-05-10T05:17:36.649Z"}`. | High |
| Local source has the approved route handlers. | Local files exist for `src/app/sitemap-pathways.xml/route.ts`, `src/app/sitemap-localized.xml/route.ts`, and `src/app/sitemap-clinical-modules.xml/route.ts`. | High |
| Local source has the approved 8-child index. | `SITEMAP_INDEX_CHILD_FILENAMES` includes `core`, `blog`, `pathways`, `lessons`, `localized`, `clinical-modules`, `allied`, `new-grad`. | High |
| Local validation is green. | `npm run seo:guardrails`, `npm run sitemap:validate`, and `npm run sitemap:report` pass locally with 0 duplicate locs and 0 invalid locs. | High |
| Local checked-in build metadata differs from live metadata. | Local `public/nn-build-meta.json` reports commit `4cfdd53343b29dec59bd4fe3a84a1c046fad8fad`; production `/api/version` reports `commit:null`. Local git HEAD during investigation was `e88cd4c856ee58d2a40ce7abe63c91c4bcbecfae`. | Medium |
| Existing local `.next` artifact appears stale/incomplete. | Local `.next/server/app/sitemap*.xml/route.js` listed only `sitemap.xml`, `sitemap-allied.xml`, and `sitemap-new-grad.xml`; no route bundles for `core`, `blog`, `lessons`, `pathways`, `localized`, or `clinical-modules`. | Medium |
| No static public sitemap XML artifact is overriding the routes locally. | `public/sitemap*.xml` returned no files. | High |

---

## Production vs local differences

### Sitemap index children

Expected local architecture:

- `https://www.nursenest.ca/sitemap-core.xml`
- `https://www.nursenest.ca/sitemap-blog.xml`
- `https://www.nursenest.ca/sitemap-pathways.xml`
- `https://www.nursenest.ca/sitemap-lessons.xml`
- `https://www.nursenest.ca/sitemap-localized.xml`
- `https://www.nursenest.ca/sitemap-clinical-modules.xml`
- `https://www.nursenest.ca/sitemap-allied.xml`
- `https://www.nursenest.ca/sitemap-new-grad.xml`

Production children observed:

- `https://www.nursenest.ca/sitemap-core.xml`
- `https://www.nursenest.ca/sitemap-blog.xml`
- `https://www.nursenest.ca/sitemap-lessons.xml`
- `https://www.nursenest.ca/sitemap-allied.xml`
- `https://www.nursenest.ca/sitemap-new-grad.xml`

Missing in production:

- `https://www.nursenest.ca/sitemap-pathways.xml`
- `https://www.nursenest.ca/sitemap-localized.xml`
- `https://www.nursenest.ca/sitemap-clinical-modules.xml`

### Production direct route behavior

| Route | Expected | Production observed | Result |
|---|---|---|---|
| `/sitemap.xml` | 8-child sitemap index XML | 5-child sitemap index XML | Fail |
| `/sitemap-pathways.xml` | XML urlset | HTML page (`text/html`) | Fail |
| `/sitemap-localized.xml` | XML urlset | HTML page (`text/html`) | Fail |
| `/sitemap-clinical-modules.xml` | XML urlset | HTML page (`text/html`) | Fail |
| `/robots.txt` | Text robots file with one sitemap index directive | Correct strategy observed | Pass |

---

## Cache observations

| URL | Cache headers / state | Observation |
|---|---|---|
| `/sitemap.xml` | `Cache-Control: public, max-age=0, s-maxage=86400, stale-while-revalidate=604800`; `cf-cache-status: HIT`; `Age: 265`; ETag `W/"rKf8HnjtR5VL27gaIYw2VbXMQZK"` | Cloudflare is serving a cached old sitemap index. |
| `/sitemap.xml?phase11_cache_bust=1` | `cf-cache-status: MISS` on first request; same old 5-child body and same ETag | Origin itself is also returning the old body; not just edge cache. |
| `/sitemap-core.xml`, `/sitemap-blog.xml`, `/sitemap-lessons.xml`, `/sitemap-allied.xml`, `/sitemap-new-grad.xml` | `cf-cache-status: HIT`, long `s-maxage`, stable ETags | Existing old child routes are cached at Cloudflare. |
| `/sitemap-pathways.xml`, `/sitemap-localized.xml`, `/sitemap-clinical-modules.xml` | `cf-cache-status: MISS`, `Cache-Control: private, no-cache, no-store`, `Content-Type: text/html` | Requests reach origin but the sitemap XML handlers are absent/not routed in the deployed build. |
| `/robots.txt` | `Cache-Control: public, max-age=0, s-maxage=3600, stale-while-revalidate=86400`; `x-nextjs-cache: HIT`; `cf-cache-status: HIT`; `Age: 2623` | Robots is cached but policy content is correct. |

**Cache conclusion:** Purging Cloudflare alone would not fix the missing sitemap routes. The origin must be redeployed with a fresh build artifact first; then purge/revalidate sitemap and robots paths if needed.

---

## Deployment observations

- Production `/api/version` returned `commit:null`, so the deployed commit SHA cannot be verified from the live endpoint.
- Production `/api/version` `recordedAt` was `2026-05-10T05:17:36.649Z`.
- Local git HEAD at investigation time was `e88cd4c856ee58d2a40ce7abe63c91c4bcbecfae` (`feat(sitemap): restructure sitemap architecture for improved segmentation`).
- Local checked-in `public/nn-build-meta.json` showed `commit: 4cfdd53343b29dec59bd4fe3a84a1c046fad8fad`, `branch: main`, `recordedAt: 2026-05-10T01:28:40.389Z`; this appears stale relative to current local HEAD and production reports no commit.
- Deploy scripts include `scripts/write-build-git-meta.mjs`, but production did not receive a commit value, likely because `.git` metadata was absent and no CI commit env var was available when the build meta was written.
- The package script `build:deploy` runs only `build:deploy:postbuild`; it does not run `next build` itself. A deploy path that calls `npm run build:deploy` without a preceding `npm run build` can promote stale `.next` output.
- Droplet `deploy-app.sh` calls `npm run build:deploy:full`, but `package.json` does not show a `build:deploy:full` script in the visible script block; this should be verified before using that deploy path.

---

## Multiple sitemap generator check

Local source search found one current index route at `src/app/sitemap.xml/route.ts`, using `buildSitemapIndexXmlForOrigin` and `SITEMAP_INDEX_CHILD_FILENAMES`.

No static `public/sitemap*.xml` files were found locally.

Production behavior is therefore more consistent with stale/incomplete deployed route bundles than with multiple local sitemap generators competing in source.

---

## Old static/build artifact check

Local static public artifacts:

- `public/sitemap*.xml`: none found.

Local existing `.next` route artifacts at investigation time:

- `.next/server/app/sitemap.xml/route.js`
- `.next/server/app/sitemap-allied.xml/route.js`
- `.next/server/app/sitemap-new-grad.xml/route.js`

This `.next` listing does not match current source and suggests the local build artifact is stale or incomplete. If the deployment pipeline packaged an older `.next` tree, production would show exactly the observed class of drift.

---

## Blocker severity

**Severity: High release blocker for sitemap/Search Console handoff.**

Production currently serves valid XML for the old sitemap architecture, but it does not match the approved validated sitemap architecture and has known duplicate locs across live child sitemaps. Do not complete Search Console submission/handoff as the final segmented sitemap release until production is redeployed and verified.

---

## Recommended fix path

1. **Verify deployment source SHA in DigitalOcean or the active droplet release.**
   - Confirm the deployed source is `e88cd4c856ee58d2a40ce7abe63c91c4bcbecfae` or the intended merge commit containing Phases 1-10.
   - If using artifact deploy, inspect the artifact for `.next/server/app/sitemap-pathways.xml/route.js`, `.next/server/app/sitemap-localized.xml/route.js`, and `.next/server/app/sitemap-clinical-modules.xml/route.js` before promotion.

2. **Run a fresh production build before postbuild packaging.**
   - Use the deploy path that runs `npm run build` before `npm run build:deploy:postbuild`, or update the deployment command so it cannot run postbuild against stale `.next` output.
   - Confirm `npm run build:deploy:full` exists before relying on `deploy/droplet/deploy-app.sh`, or replace it with the correct build sequence.

3. **Verify built route artifacts before deploy.**
   - Required artifacts should include route bundles for all sitemap routes: index, core, blog, pathways, lessons, localized, clinical-modules, allied, and new-grad.

4. **Deploy the fresh artifact/source.**
   - After deployment, query `/api/version`; if possible, ensure it reports a non-null commit.
   - If commit remains null, fix build metadata env wiring separately so future production verification can confirm SHA.

5. **Purge/revalidate sitemap-related cache after deploy.**
   - Purge Cloudflare cache for `/sitemap.xml`, all child sitemap routes, and `/robots.txt`, or wait for cache expiry only after confirming origin returns the new XML.

6. **Rerun Phase 11 verification.**
   - Production `/sitemap.xml` must list the approved 8 children.
   - New child sitemap routes must return XML urlsets, not HTML.
   - Duplicate loc count must be 0.

---

## Rollback recommendation

No immediate runtime rollback is recommended solely from this drift investigation because production is serving the previous sitemap architecture and no private sitemap URL leakage was observed.

However, treat the final sitemap/SEO release as **not deployed**. If the next deployment introduces sitemap 5xx errors, private route leakage, or invalid XML, roll back through the normal deployment mechanism to the last known healthy release while preserving `robots.txt` index-only behavior and public URL filtering.

---

## Final assessment

The production drift is deployment/artifact related, not a confirmed sitemap source-code defect.

Do not implement speculative sitemap changes. Fix the deploy/build artifact path, verify deployed SHA and route bundles, purge sitemap caches after the fresh deploy, then rerun production verification.
