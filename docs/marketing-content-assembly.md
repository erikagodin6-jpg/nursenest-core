# Marketing content assembly (default locale)

Canonical locale for public marketing copy is **English (`en`)** under `public/i18n/en/*.json`. Runtime resolution uses `formatMarketingMessage` (`src/lib/marketing-i18n-core.ts`): primary shard → optional English `fallbackMessages` → humanized tail fallback (never raw `pages.*` paths in UI).

## Build-time order

1. `scripts/run-build-prechecks.mjs` — always runs `validate-marketing-production-surface.mjs` (stub/empty/required-key checks + single `SiteHeader` / `SiteFooter` in `(marketing)/(default)/layout.tsx`). When `SKIP_I18N_PREBUILD` is unset, also runs `i18n:validate-production` and `i18n:validate-chrome`.
2. `npm run build` — Next production build (`SKIP_I18N_PREBUILD=1` does **not** skip step 1’s surface validator).
3. `build:deploy:full` — runs `validate-marketing-production-surface.mjs` again immediately before `next build`, then standalone artifact checks.

## Deploy-time order

With `BASE_URL` set, `scripts/verify-deploy-health.mjs` supports:

- `VERIFY_CANONICAL_HOME=1` — GET `/` (redirect bounded).
- `VERIFY_MARKETING_SENTINELS=1` — GET `/`, `/pricing`, `/login`; rejects placeholder substrings, duplicate `nn-header-animate-in`, and missing `<html lang="en…">` on the default marketing HTML surface.

Production cron (`.github/workflows/production-public-health-watch.yml`) enables marketing sentinels when the verify base URL secret is configured.

## Homepage body order (client)

See `src/components/marketing/home-restored-client.tsx`: hero → hero screenshot carousel (with handoff copy) → how-it-works → proof stack → global hub strip (`introAfterHero`) → pathways → FAQ → final CTA.
