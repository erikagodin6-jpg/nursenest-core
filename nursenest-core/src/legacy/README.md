# Legacy marketing components (Replit-era UI, controlled reuse)

This folder holds **extracted** marketing sections (heroes, feature grids, conversion blocks) that power the **Next.js** marketing experience.

## How they are loaded

Do **not** import the entire folder from the root layout. The integration point is:

- `src/components/marketing/home-restored-client.tsx`

That file uses `next/dynamic` for each legacy module and `LazySection` for viewport-based loading so the first paint stays light.

## Rules when editing

1. **Before adding new behavior**, search this folder and `git` history for an existing implementation; adapt it rather than re-implementing from scratch (see `docs/legacy-restoration-map.md` → *Restoration workflow*).
2. **Prefer changing files here** over duplicating JSX in `client/src/components/` (Vite SPA has a parallel marketing stack; see `docs/legacy-restoration-map.md`).
3. **Images:** Never use `gs://` or other non-browser schemes in `<img src>`. Use `marketing-assets` helpers and proxy paths from `@/lib/marketing-assets`.
4. **i18n:** Marketing strings are merged via the repo-wide compile pipeline (`tools/i18n/marketing/`, `npm run i18n:compile`); use `useMarketingI18n` patterns already in these components.
5. **Performance:** Avoid adding synchronous heavy imports at the top of legacy files; keep sections self-contained for code-splitting.

## Related docs

- [Legacy restoration map](../../../docs/legacy-restoration-map.md) (repository root)
