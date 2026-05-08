# Allied Health UI redesign — completion summary (2026-05-08)

## Completed work

- **`AlliedHealthPathwayHub`:** `.nn-premium-pathway-hub`, `.nn-nursing-tier-hub-hero-band`, `.nn-premium-home-eyebrow`, `.nn-marketing-h1`, `.nn-marketing-body`; section titles `.nn-marketing-h2`; tighter `space-y-10`–`lg:space-y-14`; occupation cards show **`hubCategory`** badges (`.nn-badge-semantic-*`) + short label + `title` from `ALLIED_HUB_CATEGORY_META.*.sublabel`.
- **`globals.css`:** Allied hero band shares nursing tier hub gradient/border (`.nn-premium-pathway-hub[data-nn-allied-pathway-hub="1"] .nn-nursing-tier-hub-hero-band`).
- **`/allied-health/page.tsx`:** Marketing hero uses same typography tokens; page uses `gap-10`–`lg:gap-14`; slightly reduced hero padding clamp.
- **`allied-health-hub-content.tsx`:** Tighter margins (`mt-*`, `space-y-*`) on scan strip, region strip, profession sections.
- **`allied/[career]/page.tsx`:** Category line uses `.nn-marketing-label`.

## Occupation-by-occupation (registry-driven)

19 professions in `ALLIED_PROFESSIONS`; badge hue maps **`hubCategory`**: therapy → info, lab → warning, acute → danger, clinical & support → success.

## Validation run

- `npm run typecheck:critical` — pass  
- `npm run test:homepage` — pass  
- Playwright (allied): blocked locally by `pathway-readiness-snapshot.json` import-attribute error when loading config — rerun in CI or after Node/tsconfig alignment.

## Files touched

`src/app/globals.css`, `src/components/marketing/allied-health-pathway-hub.tsx`, `src/components/marketing/allied-health-hub-content.tsx`, `src/app/(marketing)/(default)/allied-health/page.tsx`, `src/app/(marketing)/(default)/allied/[career]/page.tsx`, `preview-screenshots/README.md`.

## Screenshots

Not captured in-session; use `npm run ui-preview:capture` with dev server (see `preview-screenshots/README.md`). Copy key PNGs under `reports/ui-redesign-preview/` for PRs.

## Regression checklist

- Homepage contracts (`test:homepage`) — green.  
- Recommend before merge: `npm run test:allied-health`, `npm run test:pathway-lessons`.  
