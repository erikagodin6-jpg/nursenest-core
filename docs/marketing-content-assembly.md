# Marketing default layout — content assembly and validation

## Order of assembly (public `(marketing)/(default)`)

1. **Root layout** (`src/app/layout.tsx`): document shell, `lang="en"` default.
2. **Default marketing layout** (`src/app/(marketing)/(default)/layout.tsx`): exactly one `SiteHeader` and one `SiteFooter`; `MarketingI18nProvider` with chrome shards; optional `MarketingMainI18nShards` for `pages.*` under `<main>`.
3. **Route body** (e.g. `page.tsx` for `/`): JSON-LD, optional safe modes, then `HomeRestoredWithDeferredStats` and tail sections.

## Fallback precedence

1. Primary locale messages from loaded shards.
2. `fallbackMessages` (canonical English) inside `formatMarketingMessage` when a key is missing in the primary map.
3. `humanizedKeyFallback` only when neither map has the key (logged; must not ship for required chrome — caught by `assertMarketingLayoutMessagesIntegrity` in dev/build where enabled).
4. Homepage empty i18n: `MarketingHomeSafeMode` (embedded) from `page.tsx`.
5. Fatal layout: `MarketingDefaultLayoutChromeFailsafeShell` (diagnostic / last-resort).

## Build and deploy gates (do not bypass)

- `node scripts/validate-marketing-production-surface.mjs` — required keys + stub scan + single header/footer in default layout. Runs from `run-build-prechecks.mjs` even when `SKIP_I18N_PREBUILD=1`, and from `npm run build:deploy:full` before `next build`.
- `npm run i18n:validate-production` / `i18n:validate-chrome` when prebuild is not skipped (`ci:verify`, local `build:verify`).
- Post-deploy: `VERIFY_MARKETING_SENTINELS=1 node nursenest-core/scripts/verify-deploy-health.mjs` (Tier 4 HTML checks for `/`, `/pricing`, `/login`).

## Playwright

- `tests/e2e/public/marketing-production-sentinel.spec.ts` — placeholder / pricing / header / `/admin` redirect smoke.
