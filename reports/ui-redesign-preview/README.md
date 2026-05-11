# UI preview screenshots

This folder receives outputs from `npm run ui-preview:capture` (see `scripts/capture-ui-previews.mjs`), typically **desktop / tablet / mobile** viewports against a local Next dev server.

## Env options

| Variable | Purpose |
|----------|---------|
| `UI_PREVIEW_THEMES` | Comma-separated preview themes (e.g. `ocean,midnight`). When more than one theme is set, filenames include `-ocean`, `-midnight`, etc. Default: `ocean`. |
| `UI_PREVIEW_MIRROR_REPORTS` | Set to `1` to copy this tree into `reports/ui-redesign-preview/` after capture (for PR docs). |
| `UI_PREVIEW_BASE_URL` | Point at an already-running dev server (skip auto-start). |
| `UI_PREVIEW_PORT` | Port when the script starts `dev:next` (default `3100`). |

## Allied Health slice (2026-05)

For **before/after** documentation of the Allied ecosystem redesign, capture at minimum:

| Route | Notes |
|-------|--------|
| `/allied-health` | Marketing landing, grouped professions |
| `/allied/allied-health` | Global pathway occupation chooser |
| `/allied/mlt` | Sample occupation hub (lab badge) |
| `/allied/paramedic` | Acute badge |

Set `UI_PREVIEW_BASE_URL` if the server is non-default, or allow the script to spawn `dev:next` on port `3100`.

Copy representative PNGs into `reports/ui-redesign-preview/` when attaching to PR description (per governance checklist).

**Parity audit write-up:** `reports/ui-redesign-preview/ALLIED_NEWGRAD_PREMIUM_PARITY_REPORT.md` (allied + new grad shells, loaders, PW evidence).
