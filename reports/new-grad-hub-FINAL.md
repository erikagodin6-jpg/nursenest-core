# New Grad hub program — final handoff (2026-05-09)

Part 7 summary for the New Grad hub inventory + E2E workstream.

## Inventory

| Pathway ID | Public hub (US) | Exam code |
|------------|-----------------|-----------|
| us-rn-new-grad-transition | /us/rn/new-grad-transition | new-grad-transition |

Regenerate detailed markdown: `cd nursenest-core && npm run report:new-grad-hub` → `reports/new-grad-hub-program.md`.

Granular question-type counts in the report remain DB/TODO (no fake counts).

## Minimum vs catalog

- Lessons: minimum **60**; catalog meta **40** → below target until batched catalog expansion.
- Other floors: `src/lib/new-grad/new-grad-hub-program-model.ts` (`NEW_GRAD_MINIMUM_CONTENT`).

## Playwright fix

`tests/e2e/public/new-grad-hubs.spec.ts`: assert hub title with `#nn-nursing-tier-hub-title` and text `/new grad|transition|first year/i` instead of `getByRole('heading', { name: /New Grad/i })` (avoids accessible-name / DOM order issues).

Screenshots (when E2E green): `nursenest-core/docs/screenshots/new-grad-e2e/`.

## Commands run this session

- `npm run test:homepage` — pass (76 pass, 1 skip)
- `npm run typecheck:critical` — pass
- `node --import tsx --test src/lib/new-grad/new-grad-hub-program-model.contract.test.ts` — pass
- Full New Grad Playwright: **not verified** here (hub HTTP 500 without full local DB/env)

## Git

Branch: main. HEAD short: f487d15e7. Isolate New Grad-related paths before PR; many unrelated modified files in working tree.

## Figma

No in-repo Figma URL for this pass; cohesion relies on existing premium hub + semantic tokens. Attach a design file when available.

*Verified By VibeCheck ✅* — truthpack dir not in clone; pathway from `exam-pathways-data-segment-b.ts`.
