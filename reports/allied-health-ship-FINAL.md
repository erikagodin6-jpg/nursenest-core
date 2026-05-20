# Allied Health ecosystem ship — FINAL report

**Date:** 2026-05-09  
**Branch:** `main`  
**Commit (feature):** `75f45a0be86ef831084364376e502422e0f6fdd9`  
**Deploy:** **Not deployed** (no CI/deploy credentials exercised from this environment).

## Scope delivered

- Public Allied global + occupation hubs: routing unchanged (`/allied/allied-health`, `/us/allied/allied-health`, `/allied/{professionKey}`).
- Premium module grid: core study tools + `pushAlliedSupplementalPremiumStudyTools` (skills refresher → medication drills query; CAT when `alliedHubCatSurfaceUnlocked`; clinical scenarios + locked CTA; career/blog when profession resolves).
- Policy locks + homepage matrix contract: `allied-hub-premium-module-policy.ts`, `allied-hub-premium-homepage-matrix.contract.test.ts` (no ECG/NGN in allied serialized chrome assertions; no `/admin` guest hrefs).
- Profession hero tone tweaks: `allied-professions-registry.ts` (`roleHero` for MLT, respiratory/RRT, paramedic among others).
- i18n: `tools/i18n/marketing/marketing-en.json` + `npm run i18n:compile` merged shards (`nursenest-core/public/i18n/**`, `client/public/i18n/**`).
- Figma intent doc: `reports/allied-health-figma-ship-brief.md` (**Figma URL:** **TBD**; MCP screenshots not pulled this session).

## Related routes / anchors

- `buildAlliedGlobalHubPath`, `AlliedHealthPathwayHub`, `ExamPathwayHubPremiumModules`, `buildPremiumMarketingModuleCards`, `applyAlliedOccupationPremiumModuleLocks`, `withAlliedProfessionMarketingQuery`.

## Git / push

- Push: attempt `git push origin main` from automation; record result below.

```text
To github.com:erikagodin6-jpg/nursenest-core.git
   a3b8b187f..75f45a0be  main -> main
```

## Validation (`nursenest-core/`)

| Command | Result |
|---------|--------|
| `npm run test:homepage` | **PASS** (77 pass, 1 skipped) |
| `npm run typecheck:critical` | **PASS** |
| `node --import tsx --test src/lib/marketing/allied-hub-premium-homepage-matrix.contract.test.ts` | **PASS** |
| `npx playwright test tests/e2e/public/allied-health-hubs.spec.ts --project=chromium` | **FAIL / TIMEOUT** — default Playwright `baseURL` `http://127.0.0.1:3000` with **no running Next server** (`webServer` not enabled in root config); suites exited ✘ after multi-minute timeouts. **Re-run** with app up or release-gate config + capture screenshots. |

## Screenshots

- Target folder `nursenest-core/docs/screenshots/allied-health-e2e/` contains **README + gitignore only** — Playwright did not produce PNGs because tests did not complete successfully against a live app.

## Outstanding / unstaged note

- Working tree may still contain **non-allied** edits (nav, Stripe, ECG module tiles elsewhere). Only allied+i18n paths were committed in `75f45a0be86ef831084364376e502422e0f6fdd9`.
- Optional local diff exists on `exam-pathway-hub-premium-modules.ts` for ECG publish alignment (**not** included in `75f45a0be86ef831084364376e502422e0f6fdd9`).

## Blockers for green E2E

1. Start app (`next dev` / staging URL) and set `BASE_URL` **or** use a Playwright project that defines `webServer`.
2. Regenerate `docs/screenshots/allied-health-e2e/*.png` from passing specs.

