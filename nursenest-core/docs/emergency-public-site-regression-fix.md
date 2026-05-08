# Emergency public marketing site regression — fix report

**Branch:** `hotfix/public-site-keys-theme-routing`  
**Date:** 2026-05-08  

## Root cause

Marketing shard loads used **`process.cwd()/public/i18n` only**. When the process **`cwd` is the monorepo root**, shards live under **`nursenest-core/public/i18n`**, so reads returned **empty objects** and marketing copy failed. Picking the **first existing** i18n directory could also bind to **empty `.next/static/i18n`**.

## Fixes

1. **`resolveMarketingShardI18nRoot()`** — implemented in `src/lib/marketing-i18n/load-marketing-message-shards.ts` (exported). Prefers a root containing **`en/pages.json`**, then any existing candidate, then `public/i18n` under `cwd`.
2. **`loadMarketingMessageShardsSync`** — uses that root and **`path.join`** for shard files.
3. **`load-marketing-messages.ts`** — `KNOWN_I18N_ROOTS` includes **`nursenest-core/public/i18n`**.
4. **`load-programmatic-overlay.ts`** — reads `programmatic-overlays` beside the resolved shard root.
5. **`api/assets/i18n/[filename]/route.ts`** — merged `{lang}.json` from the same root.
6. **`public/i18n/en/pages.json`** — removed Unicode em dash (U+2014) in **281** string values.

## Paywall / branding

No paywall, schema, or API shape changes. Leaf logo untouched.

## Verification

- Lints on touched TS: clean.
- Run **`npm run typecheck`** in the app package before merging.

## Screenshots

Use `nursenest-core/preview-screenshots/emergency-public-site/` for local/staging captures.
