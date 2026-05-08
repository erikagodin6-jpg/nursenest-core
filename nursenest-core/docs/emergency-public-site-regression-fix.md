# Emergency public marketing site regression (hotfix)

**Branch:** `hotfix/public-site-keys-theme-routing`  
**Date:** 2026-05-08  
**Scope:** Public marketing i18n load path, merged bundle API, programmatic overlays, blog card title wrapping. No paywall, schema, or API contract changes.

## Root cause

Marketing copy is loaded from shard JSON under `public/i18n` (e.g. `en/pages.json`). Several loaders used **`process.cwd()/public/i18n`** as the only root.

When the Node/Next process **`cwd` is the monorepo root** (common in CI, tooling, or some deploy layouts) while the real shards live under **`nursenest-core/public/i18n`**, shard reads returned **empty objects**. The UI then surfaced **raw i18n keys**, empty sections, and inconsistent theme-related copy.

A secondary failure mode: **`resolveI18nDir()` returned the first existing directory** in a fixed list. If **`.next/static/i18n`** existed but was **empty or incomplete**, it could win over the full shard tree.

## Fixes implemented

1. **`resolveMarketingShardI18nRoot()`** (`load-marketing-message-shards.ts`): walks candidate roots (`public/i18n`, `nursenest-core/public/i18n`, `.next/static/i18n`, legacy `../client/public/i18n`) and **prefers a directory that contains `en/pages.json`**. Shard reads use **`path.join`**. Exported for reuse.
2. **`loadMarketingMessageShardsSync`** uses that resolver (fixes RSC/marketing components that merge shards).
3. **`load-marketing-messages.ts`**: adds **`nursenest-core/public/i18n`** to allowed roots; **`resolveI18nDir()`** prefers the same **`en/pages.json`** heuristic before falling back to “first existing dir”.
4. **`load-programmatic-overlay.ts`**: overlay bundles load from **`path.join(resolveMarketingShardI18nRoot(), "programmatic-overlays")`**.
5. **`/api/assets/i18n/[filename]`**: merged `{locale}.json` is read from **`path.join(resolveMarketingShardI18nRoot(), …)`** so the API matches server shard resolution.
6. **Blog cards** (`blog-post-card.tsx`): **`break-words`** on clamped titles to reduce overflow from long tokens.

## Truthpack

Requested files under `.vibecheck/truthpack/` were **not present** in this workspace clone; no product tier or route names were taken from truthpack. Tier/route verification was done against existing code paths only.

## Em dashes / copy / theme

- **`public/i18n/en/pages.json`**: no Unicode em dash (U+2014) matches in a quick grep at fix time; no bulk copy edit in this commit.
- **Semantic colors:** no new hardcoded hex in touched TSX; blog card already uses theme/semantic CSS variables.
- **Leaf logo:** not modified (`BrandLeafIcon` / branding assets untouched).

## Paywall / previews

No changes to entitlement checks, lesson paywall routes, or preview truncation logic. Public previews remain server-gated as before (verify in staging with a locked lesson).

## Routing / links

No URL structure changes. This hotfix addresses **resource path resolution** only.

## Screenshots

Directories created (placeholders for CI or manual capture):

- `nursenest-core/preview-screenshots/emergency-public-site/` (`.gitkeep`)
- `nursenest-core/reports/ui-redesign-preview/emergency-public-site/` (optional)

**Captured in this session:** none (no local dev server or Playwright run attached to production). Recommended: after deploy, capture `/`, `/pricing`, `/blog` desktop + mobile.

## Tests run

| Check | Result |
|--------|--------|
| ESLint diagnostics on touched TS files | Clean (IDE) |
| Full `npm run typecheck` | **Not completed** in time (long-running `tsc` in environment); re-run before merge |
| `npm run i18n:validate` / Playwright marketing smoke | **Not run** in this session; run before merge |

## Files changed (intended)

- `nursenest-core/src/lib/marketing-i18n/load-marketing-message-shards.ts`
- `nursenest-core/src/lib/marketing-i18n/load-marketing-messages.ts`
- `nursenest-core/src/lib/seo/load-programmatic-overlay.ts`
- `nursenest-core/src/app/api/assets/i18n/[filename]/route.ts`
- `nursenest-core/src/components/blog/blog-post-card.tsx`

Canonical report copy also requested at repo root: `reports/emergency-public-site-regression-fix.md` — if missing, use this file under `nursenest-core/docs/`.
