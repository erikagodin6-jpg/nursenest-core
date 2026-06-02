# Allied Health hub program — final report (Part 8)

_Generated: 2026-05-09T20:23:01Z_

## Inventory & minimums

| Artifact | Path |
|----------|------|
| Machine inventory + module matrix | `reports/allied-health-hub-program.md` (regenerate: `cd nursenest-core && npm run report:allied-hub`) |
| Figma / UI direction | `reports/allied-health-figma-ui-plan.md` |
| Program constants + occupation checklists | `nursenest-core/src/lib/allied/allied-hub-program-model.ts` |
| Report builder | `nursenest-core/src/lib/allied/allied-hub-report-markdown.ts` |

**Occupations included:** all entries in `ALLIED_PROFESSIONS` (currently **23** occupation keys — registry is source of truth; includes MLT, Paramedic, OT, Social Work, Psychotherapy, PSW, RT, Physiotherapy, PTA, and additional clinical/lab/support tracks).

**Counts vs minimums:** report marks DB-backed counts as **TODO** — do not fake numbers. Minimum floors are in `ALLIED_MINIMUM_CONTENT_PER_OCCUPATION`.

## Figma

- Plan documented in `reports/allied-health-figma-ui-plan.md`.
- **No new Figma file was created in this pass** — add file URLs when design owns the frames.

## Implementation (code)

- **New:** allied hub program model + markdown report script + contract tests.
- **Updated:** `tests/e2e/public/allied-health-hubs.spec.ts` — serial occupation pass (hero, single premium root, HTTP smoke for lessons/questions/cat per occupation, blossom screenshot for MLT), extended theme screenshots.

## Playwright

- Spec: `nursenest-core/tests/e2e/public/allied-health-hubs.spec.ts`
- Screenshots: `nursenest-core/docs/screenshots/allied-health-e2e/`
- Run: `cd nursenest-core && npx playwright test tests/e2e/public/allied-health-hubs.spec.ts` (requires healthy `BASE_URL`)

## Commands executed (this session)

| Command | Result |
|---------|--------|
| `npm run report:allied-hub` | OK — wrote `reports/allied-health-hub-program.md` |
| `node --import tsx --test src/lib/allied/allied-hub-program-model.contract.test.ts` | OK (3 tests) |
| `npm run test:homepage` | OK (76 pass, 1 skip) |
| `npm run typecheck:critical` | OK |
| Full Playwright / release gate / production build | **Not run** in this session |

## Files changed / added (Allied scope)

- `nursenest-core/src/lib/allied/allied-hub-program-model.ts` (new)
- `nursenest-core/src/lib/allied/allied-hub-report-markdown.ts` (new)
- `nursenest-core/src/lib/allied/allied-hub-program-model.contract.test.ts` (new)
- `nursenest-core/scripts/write-allied-hub-report.mts` (new)
- `nursenest-core/package.json` — script `report:allied-hub`
- `nursenest-core/tests/e2e/public/allied-health-hubs.spec.ts` (expanded)
- `reports/allied-health-hub-program.md` (generated)
- `reports/allied-health-figma-ui-plan.md`
- `reports/allied-health-hub-FINAL.md` (this file)

## Git

- **Branch:** main
- **Commit (short):** b2e51244a
- **Push / deploy:** not performed from this session

## Gated / intentional

- Occupation locks for labs / med calc / pharmacology / adaptive CAT marketing remain per `allied-hub-premium-module-policy.ts`.
- OSCE / scenarios use deterministic flags in generated report (`oscePublic: true`, `clinicalScenariosPublic: false` in script) — align with production flags when publishing.

*Verified By VibeCheck ✅* — pathway ids and routes cross-checked against `exam-pathways-data-segment-d.ts` and `allied-professions-registry.ts`.
