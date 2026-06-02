# Locale, region, and theme (Phase 3)

Canonical static i18n pipeline (compile paths, loaders, locales): **[docs/i18n-architecture.md](../../../../docs/i18n-architecture.md)** (repo root).

## Resolution order

1. **Marketing UI locale** — Taken from the URL prefix: paths under `/{locale}/…` use that `locale` for `MarketingI18nProvider` with messages loaded from the **merged** flat map at `public/i18n/{locale}.json` (built from `tools/i18n/source` + `tools/i18n/marketing`). Paths without a prefix (`/`, `/pricing`, …) use **`en`**.
2. **Clinical / catalog region (US vs CA)** — `useNursenestRegion()` (client persistence). Independent of marketing locale; it only affects copy that references measurements, exam names, and similar region-specific content.
3. **Theme** — `AppThemeProvider` (`next-themes`, `data-theme` on `<html>`). Default theme is **lavender** (`NURSENEST_DEFAULT_THEME`). Region and locale do not change the theme automatically.

## Non-conflicting behavior

- Changing **language** does not reset **region** or **theme**.
- Changing **region** does not change **locale** or **theme**.
- **Exam** surfaces (see `(student)/app/exams`) do not import marketing i18n or `MarketingI18nProvider`; they keep the isolated exam shell from the structural pass.

## Payload loading

- **All locales**: `loadMarketingMessages(locale)` reads the merged JSON bundle from disk (`nursenest-core/public/i18n/{locale}.json`). Regenerate with `npm run i18n:compile` from the repository root after editing `tools/i18n/source` or `tools/i18n/marketing`.
