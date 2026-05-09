# Release hardening status (2026-05-10)

**Git root:** `/root/nursenest-core`  
**Next app:** `/root/nursenest-core/nursenest-core`  
**Related:** [release-reconciliation-2026-05-10.md](./release-reconciliation-2026-05-10.md) (cross-program facts), [release-candidate-cleanup-plan.md](./release-candidate-cleanup-plan.md) (merge / artifact discipline).

---

## 1. Authenticated QA / Playwright

| Area | Status | Notes |
|------|--------|--------|
| `setup-paid-auth` | **Hardened** | `auth.setup.ts` warns when `DATABASE_URL` is unset; **`waitForStableLearnerPathname`** after `/app` detects tight pathname oscillation (redirect loops). |
| Readiness probe | **Unchanged contract** | `spawn-wait-for-app-ready.ts` still shells `scripts/qa/wait-for-app-ready.mjs`; added **DATABASE_URL unset** warning before probe. |
| Release gate web server | **Aligned** | `playwright.release-gate.config.ts` now uses **`localNextDevWebServer`** (`npm run dev:next`, root `/` readiness) — same pattern as `playwright.visual-qa.config.ts`, avoiding a second `npx next dev` stack drift. |
| Assertions | **Preserved** | No weakening of paywall or learner shell expectations. |
| Targeted paid suites | **Not run in this session** | No healthy long-lived server + DB with `E2E_PAID_*` in this environment; use `PLAYWRIGHT_SKIP_WEB_SERVER=1`, `npm run wait:app:ready`, then `npm run qa:release-gate:paid` or `npm run visual-qa:critical` when ready. |

---

## 2. Deterministic auth seeds (`npm run seed:auth-qa`)

| Artifact | Status |
|----------|--------|
| Weak topics, pathway progress, flashcards (text + image), readiness row, exam planner, practice/CAT sessions | **Existing** — unchanged semantics |
| **CAT-mode bank attempts** | **Added** — idempotent per run (`deleteMany` for `selectedOptionKey` prefix `nn_auth_qa:` + mode `cat`) then up to three `ExamQuestionPracticeAnswerAttempt` rows for analytics |
| **OSCE visibility** | **Added** — global `OsceStation` upsert slug **`nn-auth-qa-osce-seed`** (published, minimal steps JSON) so empty dev DBs still list one station |
| **ECG analytics row** | **Added** — when any `EcgVideoQuestion` exists, one **`EcgVideoQuestionPracticeAnswerAttempt`** with synthetic `selectedOptionId` **`nn_auth_qa_ecg_synthetic_option`** (removed on `AUTH_QA_SEED_RESET` cleanup) |
| RN / NP / New Grad / Allied **per cohort** | **Gap (documented)** | Still **one email / one user** per env; multi-cohort coverage requires separate `qa-paid-test-account-reset.mts` runs with tier/pathway envs — no entitlement bypass added |

Script: `nursenest-core/scripts/seed-authenticated-qa-learner.mts`.

---

## 3. Visual QA / screenshots

| Item | Status |
|------|--------|
| **Pixel-diff regression** | **Extended** — `visual-qa-critical-regression.spec.ts`: CAT surface (`?cat=1`), OSCE index (`/app/osce`) using existing stable selectors (`data-nn-e2e-*`, learner main landmark). |
| **Theme matrix** | **Checklist only** | New `docs/screenshots/rc-theme-matrix-2026/README.md` + `captured/.gitkeep` — full Ocean/Blossom/Midnight × desktop/mobile capture **not executed** (timeboxed); matrix documents ECG URL gap. |
| **Canonical path** | `docs/screenshots/` at **git root** — `docs/screenshots/README.md` updated to reference `rc-theme-matrix-2026/`. |

---

## 4. Runtime reliability

- **Single Next instance:** prefer `PLAYWRIGHT_SKIP_WEB_SERVER=1` + external `npm run dev:next` + `npm run wait:app:ready` (see `docs/runtime/playwright-local-workflow.md`).
- **Release gate** now matches **visual-qa** local web server helper for localhost.

---

## 5. RC readiness (opinion)

| Gate | Verdict |
|------|---------|
| Type safety (critical paths) | **Green** — `npm run typecheck:critical` exit **0** (this session). |
| Homepage contracts | **Green** — `npm run test:homepage` exit **0** (1 skipped test unchanged). |
| Paid E2E + visual baselines | **Needs operator** — DB + credentials + snapshot updates if UI changed. |

**Approaching RC?** Closer on **deterministic seeds** and **Playwright harness consistency**; still **operator-dependent** for full authenticated matrix and committed screenshot baselines.

---

## 6. Commands (reference)

```bash
cd nursenest-core
npm run typecheck:critical    # exit 0 this session
npm run test:homepage         # exit 0 this session
npm run wait:app:ready
npm run seed:auth-qa          # after qa-paid-test-account-reset
PLAYWRIGHT_SKIP_WEB_SERVER=1 npm run qa:release-gate:paid   # when server + env ready
npm run visual-qa:critical    # may require --update-snapshots after new captures
```

---

## Appendix — git snapshot (2026-05-10)

```
/root/nursenest-core
main
 M docs/runtime/playwright-local-workflow.md
 M docs/screenshots/README.md
 M nursenest-core/docs/runtime/local-runtime-modes.md
 M nursenest-core/docs/screenshots/marketing-header/after-fix-chromium-1280x900.png
 M nursenest-core/playwright.release-gate.config.ts
 M nursenest-core/src/components/marketing/nursing-tier-hub-page.test.tsx
 M nursenest-core/tests/e2e/helpers/spawn-wait-for-app-ready.ts
 M nursenest-core/tests/e2e/public/allied-health-hubs.spec.ts
 M nursenest-core/tests/e2e/public/hub-figma-implementation-smoke.spec.ts
 M nursenest-core/tests/e2e/public/marketing-header-layout-responsive.spec.ts
 M nursenest-core/tests/e2e/public/new-grad-hubs.spec.ts
 M nursenest-core/tests/e2e/setup/auth.setup.ts
 M nursenest-core/tests/e2e/visual-qa/authenticated-learner-visual-baseline.spec.ts
 M nursenest-core/tests/e2e/visual-qa/visual-qa-critical-regression.spec.ts
?? docs/reports/release-candidate-cleanup-plan.md
?? docs/reports/release-hardening-status-2026-05-10.md
?? docs/screenshots/footer-figma-implementation/
?? docs/screenshots/rc-theme-matrix-2026/
?? nursenest-core/docs/reports/authenticated-runtime-hardening-2026-05-10.md
?? nursenest-core/docs/screenshots/hub-figma-implementation/allied-respiratory-desktop-midnight.png
?? nursenest-core/docs/screenshots/hub-figma-implementation/hub-figma-smoke-us-rn-desktop.png
?? nursenest-core/reports/allied-newgrad-figma-implementation-FINAL.md
?? nursenest-core/src/lib/marketing/is-new-grad-transition-pathway.test.ts
?? nursenest-core/tests/e2e/helpers/redirect-loop-guard.ts
?? nursenest-core/tests/e2e/navigation/footer-marketing-premium.spec.ts
721158e41 chore: marketing header screenshot and QA learner seed updates
fd4d2a34c chore: premium hub, playwright, and marketing runtime updates
b4df39e63 test(qa): deterministic auth learner seeds and paid playwright readiness
b0401ca40 docs(reports): allied health ship FINAL evidence
75f45a0be feat(marketing): polish allied health hubs and premium module matrix
6e6d32ad7 feat(marketing): refine nav header framework
a3b8b187f docs(nursing-hubs): rewrite ship FINAL for accurate git + QA matrix
194bdb5e2 docs(nursing-hubs): correct ship FINAL git section
94791dadb fix(hub): exclude new-grad pathways from ECG marketing tiles
bec9a04c6 feat(marketing): complete nursing pathway premium hub modules
aa9105ec9 docs(governance): expand Figma post-completion summary template
970eea876 docs(governance): add post-completion delivery checklist and Figma summary template
b2e51244a test(e2e): fix marketing header layout spec for locale routing
f487d15e7 fix(marketing): lg+ header grid, utility band, nav stretch
cd47cee21 fix(header): align marketing nav layout and brand with design
```

---

## Follow-up (convergence pass same day)

- `playwright.learning-routes.config.ts` now uses **`localNextDevWebServer`** + `getE2eBaseURL` (parity with release-gate).
- `scripts/qa/wait-for-app-ready.mjs` timeout output adds **triage classifications**; overlay markers include secret misconfig strings.
- `seed-authenticated-qa-learner.mts` adds **LearnerNote** + third flashcard; cleanup deletes seeded notes.
- See [release-candidate-convergence-2026-05-10.md](./release-candidate-convergence-2026-05-10.md).
