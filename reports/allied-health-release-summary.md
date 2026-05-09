# Allied Health deliverable — release summary (Parts 1–7)

Date: 2026-05-09  
Workspace: `/root/nursenest-core` (app: `nursenest-core/`)

## Part 1 — Inventory

- **`reports/allied-health-hub-inventory.md`** — All **19** occupations from `ALLIED_PROFESSIONS`, pathway IDs `us-allied-core` / `ca-allied-core`, hub routes, premium module columns, honest **TBD** for numeric counts with audit commands documented.
- **Truthpack:** `.vibecheck/truthpack/` not present in this clone; source used: Prisma enums + `exam-pathways-data-segment-d.ts` + `allied-professions-registry.ts`.

## Part 2 — Minimum standards + gap matrix

- **`reports/allied-health-minimum-content-standards.md`**
- **`reports/allied-health-gap-matrix.md`**

## Part 3 — Implementation

- Allied hubs omit **NGN tools** tile (`roleTrack === "allied"` branch in `exam-pathway-hub-premium-modules.ts`). ECG remains RN/NP-only via `pathwayAllowsEcgLinkedLearning`.
- Contract tests in `exam-pathway-hub-premium-modules.contract.test.tsx`.

## Part 5 — Playwright

- **`nursenest-core/tests/e2e/public/allied-health-hubs.spec.ts`**
- Screenshots dir: **`nursenest-core/docs/screenshots/allied-health-e2e/`** (PNGs gitignored)

## Part 6 — Commands

| Command | Result |
|---------|--------|
| `npm run test:homepage` | **PASS** (71 pass, 1 skip) |
| `npm run typecheck:critical` | **PASS** |
| `playwright test ... --list` | **OK** |
| `npm run build` | **Not completed** in session (long-running build pipeline) |
| Full release gate | **Not run** |

## Git

Commit selective docs + e2e + screenshot readme when ready; verify `git push` after local gates.

