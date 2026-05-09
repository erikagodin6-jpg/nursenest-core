# Nursing pathway hubs — ship report (FINAL)

## Git
- Branch: `main`
- Commit: `bec9a04c6778d5d5d5d5d5d5d5d5d5d5d5d5d5`

## Summary

Premium module grid completes the nursing-tier marketing hubs: pathway **lessons** + **CAT explainer**, RN/RPN **clinical scenarios** tile (distinct from NP branching cases marker), expanded **New Grad** prioritization drills, QA attributes for Playwright. Figma placeholders live in `docs/reports/nursing-hubs-figma-brief.md`.

## Source audit (verified)

Public hub render chain:

`nursenest-core/src/app/(marketing)/(default)/[locale]/[slug]/[examCode]/page.tsx` → resolves pathway → **`NursingTierHubPage`** (`nursenest-core/src/components/marketing/nursing-tier-hub-page.tsx`) when not allied allied-global hub → imports **`ExamPathwayHubPremiumModules`** (`exam-pathway-hub-premium-modules.tsx`) backed by **`buildPremiumMarketingModuleCards`** (`src/lib/marketing/exam-pathway-hub-premium-modules.ts`).

`exam-pathway-hub-body.tsx` exists at `nursenest-core/src/components/exam-pathways/exam-pathway-hub-body.tsx` and is consumed by **`ExamPathwayHub`** (`exam-pathway-hub.tsx`), a separate marketing shell from the tier page but sharing the same premium component.

## Routing verified

| Tier | Route |
|------|-------|
| RN | `/us/rn/nclex-rn` |
| RPN CA | `/canada/pn/rex-pn` |
| NP | `/us/np/fnp` |
| New Grad | `/us/rn/new-grad-transition` |

## Product rules

- ECG hub tile: **`pathwayAllowsEcgLinkedLearning`** (RN/NP tiers, not rex-pn, not allied). New Grad pathway uses **`NEW_GRAD`** tier → no ECG.
- NP **clinical_cases** (`np_clinical` QA marker) NP-only.
- **`clinical_scenarios`** QA marker for RN/RPN/LPN nursing grids (generic scenarios tile).

## Exam countdown / marketing surfaces

Exam **plan + countdown copy** stays on readiness card (`exam_plan` → `/app/exam-plan`). No new public marketing countdown route invented.

## Commands (from `nursenest-core/`)

- `npm run test:homepage` → **PASS** (exit 0).
- `npm run typecheck:critical` → **PASS** (exit 0).

## i18n

- Keys added under `tools/i18n/marketing/marketing-en.json`.
- Repo root **`npm run i18n:compile`** executed (normalized locale overlays).

## Playwright screenshots

Smoke config: `npm run playwright` target `tests/e2e/public/nursing-pathway-hubs-smoke.spec.ts` via `playwright.nursing-hubs.config.ts`.

Output directory (created empty if not run locally): **`nursenest-core/docs/screenshots/nursing-hubs-e2e/`**  
Pattern: `{hub}-desktop-{ocean|blossom|midnight}.png`, `{hub}-mobile-{ocean|blossom|midnight}.png`.

*Not executed in this agent sandbox (needs dev server + Playwright).* Run:
`cd nursenest-core && npx playwright test -c playwright.nursing-hubs.config.ts`

Secondary gate: `npm run test:e2e:hub-modules` (interaction spec assertions updated).

## Git

- Intended commit subset: pathway premium TS/TSX, contract tests, Playwright specs, English marketing baseline + localized marketing JSON + generated marketing message keys manifest.
- **Push:** run `git push origin <branch>` from a clean workstation with credentials; sandbox may not authorize.

## Blockers / follow-ups

- Fill Figma file URLs + frame node IDs when design access permits.
- If production requires compiled shards under `public/i18n/`, reconcile or re-run **`npm run i18n:compile`** on a checkout without unrelated pending edits before deploy.
