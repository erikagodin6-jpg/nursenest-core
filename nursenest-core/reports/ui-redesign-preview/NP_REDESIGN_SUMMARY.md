# NP pathway redesign — completion summary

## Files changed
- `src/components/marketing/nursing-tier-hub-page.tsx` — `data-pathway-track`
- `src/components/pathway-lessons/pathway-topic-cluster-grouped-nav.tsx` — `tone` prop
- `src/components/pathway-lessons/pathway-lessons-grouped-hub.tsx` — pass `tone` for NP
- `src/components/pathway-lessons/fnp-lessons-hub.tsx` — `tone="np"`
- `src/app/premium-redesign-2026.css` — NP hero + topic group tokens

## Verification
- `npm run typecheck:critical` — PASS
- `npm run test:homepage` — PASS
- Playwright NP QA — blocked (no dev server on :3000)

## Screenshots
Not captured; run dev server and save to `preview-screenshots/`.

## Routes tested (automated)

None via Playwright (server unavailable). Intended manual URLs: `/us/np/fnp`, `/us/np/fnp/lessons`, `/canada/np/cnple`.

## Design notes

- NP overview hubs isolated via `[data-pathway-track="np"]` for hero gradients using semantic brand + chart hues.
- Lesson browse: each topic-cluster editorial group gets `--nn-np-group-accent` mapped from semantic tokens (safety → warning, respiratory → info, pharmacology → brand, etc.).
- Chip overflow: max-width + text-balance under `.nn-np-hub-root`.

## Lesson interior

Existing `lesson-section-theme.ts` continues to drive diagnostics / treatment / pearls / patient-ed section colouring inside lesson bodies; unchanged.

