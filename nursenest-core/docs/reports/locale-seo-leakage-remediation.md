# Locale SEO leakage remediation

> Removes Google Search Console "Indexed, though blocked by robots.txt" warnings caused by
> contradictory locale signals between `robots.txt`, `<meta name="robots">`, sitemaps, and
> hreflang. The fix is intentionally surgical: stop blocking incomplete-locale paths in
> robots.txt and rely on the already-correct page-level `noindex,follow` policy.

- Date: 2026-05-11
- Scope: marketing locale paths (`/{code}/…`) and auth/utility pages (login, signup,
  forgot-password, reset-password)
- Surfaces touched: `src/lib/i18n/language-readiness.ts`,
  `src/app/robots.txt/route.ts`, new contract tests
- Affected GSC examples (now corrected): `/pa/terms`, `/zh-tw/guides/...`, `/ht/lessons/...`,
  `/it/forgot-password`, `/tr/`, `/ko/`, `/ur/clinical-clarity/...`

---

## 1. Root causes

### 1a. `robots.txt` blocked the same locale paths the app already marked `noindex`

The previous `robots.txt` route iterated `MARKETING_LANGUAGES` and emitted
`Disallow: /{code}/` for every `incomplete`-tier locale (plus an explicit
`SEO_BLOCKED_LOCALES` override list).

The page metadata layer (`safeGenerateMetadata` + `localeRobotsOverride`) already injects
`<meta name="robots" content="noindex,follow">` for the **same** locales. Both signals
were on at once.

### 1b. Per Google's docs, blocking via `robots.txt` is the wrong de-indexing channel

If Googlebot is `Disallow`-blocked from a URL, it cannot fetch the page and **cannot read
the `noindex` tag**. URLs discovered via internal links, prior crawls, or external links
remain queued for indexing — producing the
"Indexed, though blocked by robots.txt" report in Google Search Console.

The correct de-indexing mechanism is the `noindex` meta or `X-Robots-Tag: noindex` HTTP
header on a **crawlable** URL. `robots.txt` should only be used to keep crawlers off
genuinely private surfaces (`/app`, `/admin`, `/internal`, `/api`, `/seo/`).

### 1c. Sitemap, hreflang, and auth-page exclusion were already correct

The audit confirmed:

- `getSitemapIncludedLocales()` — only tier=full and not in `SEO_BLOCKED_LOCALES`.
- `getHreflangEligibleLocales()` — only tier=full and not in `SEO_BLOCKED_LOCALES`.
- `marketingAlternatesForNoindexUtilityPage()` — returns `{ canonical }` only,
  **no** `languages` cluster — so auth pages do not pull each other into hreflang.
- `isAuthNoindexMarketingPathname()` / `isEligiblePublicIndexSitemapLoc()` — drop every
  `(locale, auth-path)` combination from any sitemap.
- Auth pages set `robots: { index: false, follow: true }` explicitly.

The only contradicting signal was the per-locale `Disallow` line. Removing it is enough.

---

## 2. Locales — before vs after

`MARKETING_LANGUAGES` (27 routable codes) is unchanged. The crawl/index columns reflect
state **after** the fix.

| code  | mkt tier   | SEO tier   | indexable | in sitemap | in hreflang | robots disallowed | explicit block override |
| ----- | ---------- | ---------- | --------- | ---------- | ----------- | ----------------- | ----------------------- |
| en    | full       | production | yes       | yes        | yes         | no                | —                       |
| es    | full       | production | yes       | yes        | yes         | no                | —                       |
| tl    | full       | production | yes       | yes        | yes         | no                | —                       |
| hi    | full       | production | yes       | yes        | yes         | no                | —                       |
| fr    | partial    | preview    | no        | no         | no          | no (was no)       | —                       |
| ta    | incomplete | preview    | no        | no         | no          | **no (was YES)**  | —                       |
| te    | incomplete | preview    | no        | no         | no          | **no (was YES)**  | —                       |
| bn    | incomplete | preview    | no        | no         | no          | **no (was YES)**  | —                       |
| mr    | incomplete | preview    | no        | no         | no          | **no (was YES)**  | —                       |
| gu    | incomplete | preview    | no        | no         | no          | **no (was YES)**  | —                       |
| zh    | incomplete | preview    | no        | no         | no          | **no (was YES)**  | yes                     |
| zh-tw | incomplete | preview    | no        | no         | no          | **no (was YES)**  | —                       |
| ar    | incomplete | preview    | no        | no         | no          | **no (was YES)**  | —                       |
| ko    | incomplete | preview    | no        | no         | no          | **no (was YES)**  | yes                     |
| pt    | full       | preview    | no        | no         | no          | **no (was YES)**  | yes                     |
| pa    | incomplete | preview    | no        | no         | no          | **no (was YES)**  | yes                     |
| vi    | incomplete | preview    | no        | no         | no          | **no (was YES)**  | yes                     |
| ht    | incomplete | preview    | no        | no         | no          | **no (was YES)**  | —                       |
| ur    | incomplete | preview    | no        | no         | no          | **no (was YES)**  | yes                     |
| ja    | incomplete | preview    | no        | no         | no          | **no (was YES)**  | —                       |
| fa    | incomplete | preview    | no        | no         | no          | **no (was YES)**  | yes                     |
| de    | incomplete | preview    | no        | no         | no          | **no (was YES)**  | —                       |
| th    | incomplete | preview    | no        | no         | no          | **no (was YES)**  | —                       |
| tr    | incomplete | preview    | no        | no         | no          | **no (was YES)**  | yes                     |
| id    | incomplete | preview    | no        | no         | no          | **no (was YES)**  | —                       |
| it    | incomplete | preview    | no        | no         | no          | **no (was YES)**  | yes                     |
| hu    | incomplete | preview    | no        | no         | no          | **no (was YES)**  | —                       |
| ru    | incomplete | preview    | no        | no         | no          | **no (was YES)**  | —                       |

> `pt` (Brazilian Portuguese) is `tier: full` in `MARKETING_LANGUAGES` but is explicitly
> kept in `SEO_BLOCKED_LOCALES` until UI completeness is re-verified. That contradiction
> is preserved (out of scope for this remediation).

### Net change (22 locales)

22 incomplete-tier locales + the explicit `pt` override are now **crawlable** with
page-level `noindex,follow`. All other SEO signals (sitemap inclusion, hreflang clusters,
canonical alternates) are unchanged — those were already correct and excluded preview
locales.

---

## 3. Robots strategy after the fix

`robots.txt` now serves a single static body for every request:

```
User-agent: *
Allow: /
Disallow: /app/
Disallow: /admin/
Disallow: /internal/
Disallow: /api/
Disallow: /seo/

Sitemap: https://www.nursenest.ca/sitemap.xml
```

Properties locked by `assertCanonicalSitemapDirectives()`:

- Exactly **one** `Sitemap:` directive, pointing at the canonical sitemap index.
- Production `https` origin only (no `http://`, no `allied.nursenest.ca` sitemap leak).
- No per-locale `Disallow: /{code}/` lines for any of the 27 marketing locales — enforced
  by `language-readiness-robots.test.ts` and `robots-route-source.contract.test.ts`.

### Why no `X-Robots-Tag` header

A request-time `X-Robots-Tag: noindex, follow` header was considered, but the existing
page-level `<meta name="robots" content="noindex,follow">` (injected by
`safeGenerateMetadata` via `localeRobotsOverride`) already provides exactly the same
signal for `preview`-tier locales and auth/utility pages. Adding an HTTP header on top
would duplicate the signal, add proxy/middleware complexity, and require a new always-on
path-prefix check in `proxy.ts`. The simpler, layered approach is preferred and matches
NurseNest's "auth and admin gating server-enforced, but no parallel response-header
mechanism for SEO" rule.

---

## 4. Sitemap / hreflang / canonicals — confirmed invariants

Already correct before this fix; now locked in by `locale-seo-leakage.contract.test.ts`:

- **Sitemap** — `getSitemapIncludedLocales()` returns only production-tier locales.
  `isEligiblePublicIndexSitemapLoc()` drops every `(locale, /login|/signup|/forgot-password|/reset-password)`
  combination, and `filterPublicSitemapEntries()` enforces this for every segment urlset.
- **Hreflang** — `marketingHreflangLanguagesForEnPath()` references only production
  locales (mapped via `getHreflangEligibleLocales()`); preview locales never appear in
  the cluster. `x-default` + `en-CA` always point at the English-default URL.
- **Canonical alternates** — `marketingAlternatesSharedPage()` returns the same set;
  `marketingAlternatesForNoindexUtilityPage()` returns `{ canonical }` only (no
  `languages` cluster) so auth pages do not advertise sibling locales.

---

## 5. Locale SEO policy (the canonical "tier" system)

A single source of truth, exposed in `src/lib/i18n/language-readiness.ts`:

```ts
type LocaleSeoTier = "production" | "preview" | "blocked";
getLocaleSeoTier(code): LocaleSeoTier
getProductionSeoLocales(): readonly string[]
getPreviewSeoLocales(): readonly string[]
```

| SEO tier   | Where used today                  | indexable | sitemap | hreflang | canonical alt | robots.txt          | page meta                  | switcher        |
| ---------- | --------------------------------- | --------- | ------- | -------- | ------------- | ------------------- | -------------------------- | --------------- |
| production | `en`, `es`, `tl`, `hi`            | yes       | yes     | yes      | yes           | crawlable           | default (no override)      | yes, no label   |
| preview    | every non-production marketing locale | no   | no      | no       | no            | crawlable           | `noindex,follow` (forced)  | partial: label; incomplete: hidden |
| blocked    | (reserved — no locale today)      | no        | no      | no       | no            | n/a (would 404/302) | n/a                        | hidden          |

### Promotion path (preview → production)

1. Translate the bundle and pass `i18n:audit:*` for the locale.
2. Run `getLocalizedSeoAuditLocales()` audit (`npm run audit:localized-seo`).
3. Walk every item in `LANGUAGE_PROMOTION_CHECKLIST`.
4. Change `MARKETING_LANGUAGES[*].tier` to `"full"`; if the code is in
   `SEO_BLOCKED_LOCALES`, remove it.
5. The SEO tier flips from `preview` → `production` automatically. No robots, sitemap,
   or hreflang code changes required.

Likely near-term path: keep `en` production today, promote `fr` once translation
completes, evaluate `es` (already production) coverage for additional country regions.

### Hard-blocking (`blocked`)

Reserved for a future locale we explicitly take **off the network**: the route should
`notFound()` (or 308-redirect to default) and no sitemap/hreflang/canonical entry should
ever reference it. No locale uses this tier today.

---

## 6. Tests / contracts added or updated

Locked by `npm run test:seo-sitemap` and the focused suite below.

- `src/lib/i18n/language-readiness-robots.test.ts` (rewritten)
  - `isLocaleRobotsPathDisallowed` returns `false` for every marketing locale, every
    explicit blocked override, and every tier — locked at the API level.
  - `robots.txt` source contains the canonical disallow set and **no** per-locale
    Disallow lines (string assertion over every `MARKETING_LANGUAGES[*].code`).
  - `getLocaleSeoTier` classifies `en/es/tl/hi` as production and partial/incomplete/blocked
    overrides as preview; nothing is `blocked` today.

- `src/lib/seo/locale-seo-leakage.contract.test.ts` (new — 5 contracts, 17 tests)
  1. No noindex/blocked locale appears in sitemap inclusion (full sweep over
     `getSitemapIncludedLocales`, `getPreviewSeoLocales`, `SEO_BLOCKED_LOCALES`).
  2. Hreflang excludes every preview locale; `marketingHreflangLanguagesForEnPath` only
     references production locales.
  3. Utility/auth pages are recognized as noindex, dropped from sitemap for every locale,
     and `marketingAlternatesForNoindexUtilityPage` does not emit a `languages` cluster.
  4. No locale is simultaneously Disallowed in robots **and** present in sitemap/hreflang
     (no conflict). Preview locales emit `{ index: false, follow: true }`; production
     locales emit no override.
  5. Canonical alternates only include production locales; preview locales (including
     all GSC-reported examples: `pa`, `zh-tw`, `ht`, `it`, `tr`, `ko`, `ur`) are not in
     `getIndexableLocales()` and not hreflang-eligible.

- `src/lib/seo/robots-route-source.contract.test.ts` (extended)
  - Asserts the route file does not import `MARKETING_LANGUAGES` or
    `isLocaleRobotsPathDisallowed` — no per-locale loop can re-appear by accident.

---

## 7. Commands run

All commands run from `/root/nursenest-core/nursenest-core/`.

| Command | Result |
| --- | --- |
| `node --import tsx --test src/lib/i18n/language-readiness-robots.test.ts src/lib/i18n/language-readiness-sitemap.test.ts src/lib/seo/locale-seo-leakage.contract.test.ts src/lib/seo/robots-route-source.contract.test.ts src/lib/seo/sitemap-marketing-exclusions.test.ts src/app/robots.txt/route.test.ts` | **44 pass / 0 fail** |
| `npm run test:seo-sitemap` | **54 pass / 0 fail** |
| `npm run test:sitemap` | **30 pass / 0 fail** |
| `npm run test:localized-seo` | **15 pass / 0 fail** |
| `npm run typecheck:critical` | **clean** (no diagnostics) |
| `npm run sitemap:validate` | **0 invalid locs, 0 errors, 0 warnings** across all 10 segments (`core`, `blog`, `fr-blog`, `es-blog`, `pathways`, `lessons`, `localized`, `clinical-modules`, `allied`, `new-grad`) |
| `npm run test:homepage` | **80 pass / 0 fail / 1 skipped** (pre-existing skip) |

---

## 8. Files changed

- `src/lib/i18n/language-readiness.ts` — added `LocaleSeoTier`,
  `getLocaleSeoTier`, `getProductionSeoLocales`, `getPreviewSeoLocales`; flipped
  `isLocaleRobotsPathDisallowed` to always return `false` (with `@deprecated` JSDoc);
  updated the file-header status table.
- `src/app/robots.txt/route.ts` — removed the per-locale `Disallow` loop; body is now a
  single static `STATIC_BODY` constant; removed unused imports
  (`MARKETING_LANGUAGES`, `isLocaleRobotsPathDisallowed`, `DEFAULT_MARKETING_LOCALE`).
- `src/lib/i18n/language-readiness-robots.test.ts` — rewritten; asserts no marketing
  locale is ever Disallowed, and asserts the robots.txt source has no per-locale loop.
- `src/lib/seo/robots-route-source.contract.test.ts` — added a guard that prevents the
  per-locale loop pattern from regressing.
- `src/lib/seo/locale-seo-leakage.contract.test.ts` — new cross-cutting contract test
  covering the five invariants listed above.
- `docs/reports/locale-seo-leakage-remediation.md` — this report.

No schema, response-shape, page-route, copy, env, or auth changes.

---

## 9. Follow-ups (optional, not part of this remediation)

1. **GSC validation** — after deploy, request "Validate fix" in Google Search Console
   for the "Indexed, though blocked by robots.txt" report. Expected: those URLs flip to
   "Excluded by 'noindex' tag" within 1–2 crawl cycles.
2. **Resolve the `pt` contradiction** — `pt` is `tier: full` in `MARKETING_LANGUAGES`
   but kept on `SEO_BLOCKED_LOCALES`. Either remove from the override list (promote to
   production) or downgrade to `tier: partial` so the registry agrees with the runtime
   policy. Out of scope here because it requires translation-coverage review.
3. **Promote `fr` to production** when the partial-tier audit hits the
   `LANGUAGE_PROMOTION_CHECKLIST` bar — no SEO code changes required; flip the tier.
4. **Optional hard-block tier** — if/when a locale is intentionally retired, implement
   `blocked` semantics: `notFound()` from `/[locale]/layout.tsx` for that code and add
   a sitemap/hreflang assertion that it never re-appears.
