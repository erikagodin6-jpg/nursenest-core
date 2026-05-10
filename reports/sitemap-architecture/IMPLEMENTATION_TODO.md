# Implementation TODO (Phase D deferred)

**Reason:** Current stack already implements **triple urlset** + strong static guards. Introducing a sitemap **index** and additional route handlers touches `robots.txt`, `verify-robots.ts`, multiple contract tests, `proxy.ts`, and all `revalidatePath` call sites — **high coordination risk** for a single pass without a dedicated SEO release window.

## Safe first slice (recommended)

1. Fix **New Grad sitemap fallback** (`/new-grad` → `/us/new-grad`) in `src/app/sitemap-new-grad.xml/route.ts` — one-line, low risk.
2. Add **`scripts/seo/verify-sitemap-loc-shape.mjs`** (or extend `verify-robots.ts`) to assert:
   - no `loc` contains `/app`, `/api`, `/seo/`, `/admin`
   - no duplicate `<loc>` within fetched XML (optional HTTP fetch in CI with `BASE_URL`)
3. Document `npm run` in `nursenest-core/package.json` only when script exists (user asked not to churn README unless script lands).

## Larger slice (sitemap index)

1. Implement `src/app/sitemap-index.xml/route.ts` returning `sitemapindex` XML.
2. Split collectors in `sitemap-static-xml.ts` into named exports consumed by child routes (no behavior change first).
3. Migrate `robots.txt` Sitemap lines + `scripts/seo/verify-robots.ts` + contract tests.
4. Run full crawl-health + GSC validation post-deploy.

## Explicit non-goals

- Do **not** add `/app/*` or learner session URLs to any public sitemap.
- Do **not** remove `Disallow` rules or weaken `isValidPublicUrl`.
