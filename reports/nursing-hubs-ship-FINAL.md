# Nursing pathway hubs — ship report (FINAL)

## Git / deploy

- **Branch:** `main`
- **Commits:** `bec9a04c6` feat(marketing) nursing premium tiles + QA + docs; `94791dad` defensive ECG guard for new‑grad IDs in `pathwayAllowsEcgLinkedLearning`; `194bdb5e2` follow-up patches (reports).
- **Push:** ✅ `origin` (`main`).
- **Deploy:** unchanged by this slice (CI/production promotion not triggered from this session).

## Summary

Premium module grid completes the nursing-tier marketing hubs: pathway **lessons**, **CAT explainer**, RN/RPN **clinical scenarios** tile (distinct QA marker vs NP branching cases), **New Grad prioritization drills**, Playwright/smoke asserts, bilingual marketing overlays + manifest. Figma placeholders: `reports/nursing-hubs-figma-brief.md` and `nursenest-core/docs/reports/nursing-hubs-figma-brief.md`.

## Source audit

Public tier hub chain:

```
nursenest-core/src/app/(marketing)/(default)/[locale]/[slug]/[examCode]/page.tsx
  → NursingTierHubPage (nursing-tier-hub-page.tsx)
    → ExamPathwayHubPremiumModules (exam-pathway-hub-premium-modules.tsx)
      → buildPremiumMarketingModuleCards (exam-pathway-hub-premium-modules.ts)
```

`exam-pathway-hub-body.tsx` exists and mounts the same **`ExamPathwayHubPremiumModules`** via **`ExamPathwayHub`** / **`ExamPathwayHubBody`** (parallel marketing shell sharing the secondary grid).

## Routes verified

| Tier | Canonical example |
|------|-------------------|
| RN US | `/us/rn/nclex-rn` |
| RPN CA | `/canada/pn/rex-pn` |
| NP US | `/us/np/fnp` |
| New Grad | `/us/rn/new-grad-transition` |

## Product gates

| Rule | Enforcement |
|------|--------------|
| ECG RN/NP tile | Tier RN/NP (`pathwayAllowsEcgLinkedLearning`) + rex-pn guard + downstream new-grad pathway id guard (`94791dad`) |
| ECG absent RPN/New Grad | Confirmed NEW_GRAD stripe tier + qa contracts |
| NP clinical branching | `clinical_cases` + `data-nn-qa-hub-np-cases` |
| Nursing scenarios RN/RPN | `clinical_scenarios` tile + `data-nn-qa-hub-clinical-scenarios` |

## Exam countdown

Readiness **`exam_plan`** card links **`/app/exam-plan`** (existing); no invented marketing countdown route.

## Screenshots (`docs/screenshots/nursing-hubs-e2e/`)

Playwright **`playwright.nursing-hubs.config.ts`** writes `{hub}-{desktop|mobile}-{ocean|blossom|midnight}.png`. Run locally:

`cd nursenest-core && npx playwright test -c playwright.nursing-hubs.config.ts`

(This agent did **not** host Next + capture PNGs.)

## Validation (inside `nursenest-core/` package)

| Command | Result |
|---------|--------|
| `npm run test:homepage` | PASS exit 0 |
| `npm run typecheck:critical` | PASS exit 0 |

## Files shipped (canonical list)

| Path |
|------|
| `nursenest-core/src/lib/marketing/exam-pathway-hub-premium-modules.ts` |
| `nursenest-core/src/components/exam-pathways/exam-pathway-hub-premium-modules.tsx` |
| `nursenest-core/src/components/exam-pathways/exam-pathway-hub-premium-modules.contract.test.tsx` |
| `tests/e2e/public/pathway-hub-premium-modules-interaction.spec.ts` |
| `tests/e2e/public/nursing-pathway-hubs-smoke.spec.ts` |
| `tools/i18n/marketing/marketing-en.json` + `tools/i18n/marketing/locale/marketing-*.json` |
| `src/lib/i18n/marketing-message-keys.generated.ts` |
| Reports (duplicated mirror): `reports/*` & `nursenest-core/docs/reports/*` |

## Related follow-up commits

Additional hardening landed immediately after (`94791dad`) tightening ECG exclusions for pathways whose identifiers include **`new-grad`**.

## Remaining manual work

- Paste real Figma file URLs/node IDs replacing **TBD** rows in both Figma briefs.
- Optionally run **`npm run i18n:compile`** plus stage `public/i18n/*` shards on a workstation without unrelated dirty trees if CI expects compiled bundles before deploy.

