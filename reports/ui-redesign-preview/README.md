# UI redesign preview captures

Populated by marketing/visual QA workflows:

1. **`npm run ui-preview:capture`** from `nursenest-core/` (writes `nursenest-core/preview-screenshots/`).
2. Optional mirror: `UI_PREVIEW_MIRROR_REPORTS=1 npm run ui-preview:capture` copies the full tree here.

## Folder layout (after mirror)

- `desktop/`, `tablet/`, `mobile/` — PNG per `/preview/[surface]` route (and per-theme suffix when `UI_PREVIEW_THEMES` lists multiple themes).

## Related

- Governance + inventory: `reports/premium-marketing-screenshot-refresh.md`
- Production CDN screenshots registry: `nursenest-core/src/lib/marketing/screenshot-registry.ts`
