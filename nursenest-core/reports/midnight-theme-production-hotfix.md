# Midnight theme production hotfix

## Executive summary

Midnight (and other `[data-theme="…"]` palette blocks) authored `--theme-page-bg` / `--theme-card-bg` in `theme-palettes.css`, but the higher-specificity bridge in `globals.css` (`html[data-theme]`) **re-derived** page/card tokens from `:root` `--palette-*` neutrals. That forced **light surfaces** under **dark-theme text** — unreadable contrast on production.

## Root cause

1. **Specificity inversion**: `[data-theme="midnight"]` loses to `html[data-theme]` for variables the bridge overwrote.
2. **Broken fallback chain**: `--background` / `--surface` did not prefer palette-authored `--theme-page-bg` / `--theme-card-bg` before light `--palette-*` fallbacks.
3. **Duplicate legacy block**: A tiny early `[data-theme="midnight"]` stub was redundant with the full Midnight block in `theme-palettes.css` and was removed.

## Token / bridge fix

In `src/app/globals.css` (`html[data-theme]`):

- `--background` prefers `var(--theme-page-bg, var(--theme-background, var(--color-background, var(--palette-background))))`.
- `--surface` prefers `var(--theme-surface, var(--theme-card-bg, var(--color-card, var(--palette-surface-alt))))`.
- Removed lines that **overwrote** `--theme-page-bg: var(--background)` and `--theme-card-bg: var(--surface)` so palette-authored values survive.

In the unified **dark** chrome block (`html[data-theme="midnight"], …`):

- Stopped resetting `--theme-page-bg` from light `--palette-background`.
- Synced `--background`, `--page-bg`, `--bg-page`, and `--surface` with the same theme-token-aware fallbacks.

## Blog automation artifacts (`bloge2e*`)

- **`blogLiveWhere`** (`blog-visibility.ts`): Prisma `AND` includes `slug` not `startsWith` `bloge2e` (insensitive).
- **`sqlBlogLiveWhere`** (`blog-patho-pharm-detection.ts`): Adds `AND lower(slug) NOT LIKE 'bloge2e%'` with parentheses so it applies to the full live predicate.
- **`getBlogPostMetaBySlug` / `getPublishedBlogPostBySlug`** (`safe-blog-queries.ts`): Early `return null` when `isBlogSlugHiddenFromPublicMarketingCatalog(slug)`.
- **Static corpus** (`static-blog-posts.ts`): Index list filters hidden slugs; `getStaticBlogPost` returns `undefined` for `bloge2e*`.

Optional DB cleanup: `scripts/blog/hide-bloge2e-automation-slugs.mts` (`--dry-run` / `--write`; requires **`DATABASE_URL`**).

## Files touched

| Area | Path |
|------|------|
| Theme bridge | `src/app/globals.css` |
| Midnight stub | `src/app/theme-palettes.css` |
| Blog visibility + tests | `src/lib/blog/blog-visibility.ts`, `src/lib/blog/blog-visibility.test.ts` |
| SQL live guard | `src/lib/blog/blog-patho-pharm-detection.ts` |
| Slug loaders + static corpus | `src/lib/blog/safe-blog-queries.ts`, `src/lib/blog/static-blog-posts.ts` |
| E2E | `tests/e2e/public/midnight-theme-contrast.spec.ts` |
| npm script | `package.json` |
| DB script | `scripts/blog/hide-bloge2e-automation-slugs.mts` |

## Screenshots

Playwright writes to `docs/screenshots/midnight-hotfix/` when `npm run test:e2e:midnight-contrast` runs successfully.

## Validation (commands + exit codes)

From **`nursenest-core/`**:

| Command | Result |
|---------|--------|
| `npm run typecheck:critical` | exit **0** |
| `npm run test:homepage` | exit **0** (78 pass, 1 skip) |
| `node --import tsx --test src/lib/blog/blog-visibility.test.ts` | exit **0** (12 tests) |
| `npm run test:e2e:midnight-contrast` | Run with app reachable (`baseURL` / webServer); guest routes `/`, `/blog`, `/pricing` |

## Playwright / contrast heuristic

`midnight-theme-contrast.spec.ts` sets `data-theme="midnight"`, samples computed `color` vs `backgroundColor` on `html` and first `h1`, asserts WCAG-style contrast ratio ≥ ~4.5.

## Git

Focused commit recommended; **push** only after explicit production deploy approval.
