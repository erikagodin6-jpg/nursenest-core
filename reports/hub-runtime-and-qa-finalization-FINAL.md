# Hub runtime and QA finalization — FINAL

Date: 2026-05-09  
Scope: Playwright local workflow documentation, shared Next `webServer` alignment, screenshot directory policy, validation commands. No routing redesign, no entitlement weakening, no test removal.

## Runtime findings

- **Correct dev entry for App Router + Playwright:** `npm run dev:next` or `npm run dev:next:3000` from `nursenest-core/`. **`npm run dev`** starts `server/index.ts` (monolith) and is the wrong process for marketing `/app` hub E2E.
- **Port 3000:** `curl --max-time 3 http://127.0.0.1:3000/` in this environment **timed out** (no timely HTTP response). Treat as **no healthy Next listener** for live hub Playwright in this session.
- **Readiness:** `nursenest-core/scripts/qa/wait-for-app-ready.mjs` remains the canonical strict probe; Pre-Nursing global setup already invokes it.

## Playwright stabilization

- Added **`nursenest-core/playwright/helpers/local-next-webserver.ts`**: shared local `webServer` using **`npm run dev:next`** (never `npm run dev`), consistent secrets / `AUTH_URL` / optional `DATABASE_URL`, **`reuseExistingServer`** when not CI unless **`PLAYWRIGHT_NO_REUSE_WEB_SERVER=1`**, and **`PLAYWRIGHT_SKIP_WEB_SERVER=1`** passthrough.
- **Wired helper into:** `playwright.visual-qa.config.ts`, `playwright.hub-modules.config.ts`, `playwright.ecosystem-audit.config.ts`, `playwright.pathways-prenursing-allied.config.ts`, `playwright.nursing-hubs.config.ts`, `playwright.mobile.config.ts`.
- **`playwright.nursing-hubs.config.ts`:** default is now **reuse when healthy** (same as other hub configs) to avoid duplicate `next dev` / **EADDRINUSE**. Use **`PLAYWRIGHT_NO_REUSE_WEB_SERVER=1`** to force a fresh spawned server. Removed **`PLAYWRIGHT_REUSE_WEB_SERVER`** (previously opt-in reuse).
- **`playwright.pre-nursing-hub.config.ts`:** honors **`PLAYWRIGHT_NO_REUSE_WEB_SERVER=1`** for local reuse control (still uses **`npm run dev:next:3000`** + `/login` readiness URL + global `wait-for-app-ready`).
- **`playwright.pathways-prenursing-allied.config.ts`:** header comments fixed (removed incorrect `npm run dev` claim); run command documented as `npx playwright test -c playwright.pathways-prenursing-allied.config.ts`.

## Hub Playwright (Phase 3)

**Skipped (no healthy server):** `127.0.0.1:3000` did not complete HTTP within 3s (`curl` timeout). To reproduce hub QA locally:

```bash
cd /root/nursenest-core/nursenest-core
npm run dev:next:3000
# other terminal:
PLAYWRIGHT_BASE_URL=http://127.0.0.1:3000 npm run wait:app:ready
PLAYWRIGHT_SKIP_WEB_SERVER=1 PLAYWRIGHT_BASE_URL=http://127.0.0.1:3000 npx playwright test -c playwright.nursing-hubs.config.ts
PLAYWRIGHT_SKIP_WEB_SERVER=1 PLAYWRIGHT_BASE_URL=http://127.0.0.1:3000 npx playwright test -c playwright.pathways-prenursing-allied.config.ts
```

Targeted hub-related specs (by file): `tests/e2e/public/nursing-pathway-hubs-smoke.spec.ts`, `tests/e2e/public/new-grad-hubs.spec.ts`, `tests/e2e/public/allied-health-hubs.spec.ts`, `tests/e2e/public/allied-hub-premium-smoke.spec.ts`, `tests/e2e/marketing/pre-nursing-hub-premium-modules.spec.ts`, `tests/e2e/public/pre-nursing-hub-complete.spec.ts`, `tests/e2e/smoke/pathway-prenursing-allied-access.spec.ts`, `tests/e2e/public/pathway-hub-premium-modules-interaction.spec.ts`.

## Screenshots (Phase 4)

Created / ensured under **`docs/screenshots/`**: `nursing-hubs/`, `allied-hubs/`, `nav-audit-2026/`, `visual-regression-baseline/` (with `.gitkeep` where needed). Extended **`docs/screenshots/README.md`** with viewport, theme (Ocean / Blossom / Midnight), naming, gitignore, and evidence expectations.

**Capture status:** Not executed here (no responsive healthy dev server). Blocker: bring up `dev:next:3000` + `wait:app:ready`, then run hub specs or manual capture into the subdirs above.

## Figma governance note

Material learner/marketing visual changes remain governed by **`docs/governance/figma-premium-ui-mandatory-process.md`**. This task was **docs + Playwright wiring only**; no Figma frame changes.

## CAT / ECG visibility (observed in code/tests)

- **`tests/e2e/public/homepage-ecg-visual-governance.spec.ts`:** ECG section order vs Study Ecosystem / Readiness; logged-out CTAs must not expose gated `/modules/ecg`; layout non-collapse checks.
- **`tests/e2e/learner-surfaces/learner-surfaces.smoke.spec.ts`:** CAT / linear CTAs gated together (no orphan adaptive quick link).
- **`tests/e2e/public/nursing-pathway-hubs-smoke.spec.ts`:** RN hub expects ECG module; RPN Canada hub **no** ECG marker; NP hub NP clinical + ECG; New Grad **no** ECG per test titles.
- **`tests/e2e/public/allied-hub-premium-smoke.spec.ts`:** Asserts allied hubs **must not** render ECG QA marker (`data-nn-qa-hub-ecg` absent).
- **Contract / homepage:** `npm run test:homepage` includes `ExamPathwayHubPremiumModules` DOM contracts — all **passed** in this run.

## Allied gating

- E2E **`allied-hub-premium-smoke.spec.ts`** covers occupation hubs and ECG absence on allied marketing surfaces.
- **`pathway-prenursing-allied-access.spec.ts`** remains the broad pre-nursing + allied access matrix (credentials-dependent); config now uses **`npm run dev:next`** for integrated `webServer`.

## Files changed (this task)

- `docs/runtime/playwright-local-workflow.md` (new)
- `docs/screenshots/README.md` (extended)
- `docs/screenshots/nursing-hubs/.gitkeep`, `allied-hubs/.gitkeep`, `visual-regression-baseline/.gitkeep`
- `nursenest-core/docs/runtime/local-runtime-modes.md` (cross-link + `PLAYWRIGHT_NO_REUSE_WEB_SERVER`)
- `nursenest-core/playwright/helpers/local-next-webserver.ts` (new)
- `nursenest-core/playwright.{visual-qa,hub-modules,ecosystem-audit,pathways-prenursing-allied,nursing-hubs,mobile,pre-nursing-hub}.config.ts`

## Validation (Phase 6)

| Command | Working directory | Exit |
|--------|-------------------|------|
| `npm run typecheck:critical` | `nursenest-core/` | **0** |
| `npm run test:homepage` | `nursenest-core/` | **0** (1 skipped subtest in TAP output) |
| `npx playwright test -c playwright.nursing-hubs.config.ts --list` | `nursenest-core/` | **0** |

## Hub QA reproducible?

**Yes, when** a healthy Next dev responds on the chosen origin, env secrets/DB are set per `local-runtime-modes.md`, and either Playwright starts `webServer` or you use **`PLAYWRIGHT_SKIP_WEB_SERVER=1`** after **`npm run wait:app:ready`**. **Not verified end-to-end here** due to `localhost:3000` timeout during the session probe.

---

## Appendix — git (literal)

```
pwd
git branch --show-current
git status --short
git log --oneline -10
```

```
/root/nursenest-core
main
 M .cursor/rules/ecosystem-platform-guardrails.mdc
 M .gitignore
 M nursenest-core/docs/screenshots/marketing-header/after-fix-chromium-1024x900.png
 M nursenest-core/docs/screenshots/marketing-header/after-fix-chromium-390x844.png
 M nursenest-core/docs/screenshots/marketing-header/after-fix-chromium-768x1024.png
 M nursenest-core/docs/visual-qa.md
 M nursenest-core/package.json
 M nursenest-core/playwright.ecosystem-audit.config.ts
 M nursenest-core/playwright.hub-modules.config.ts
 M nursenest-core/playwright.learning-routes.config.ts
 M nursenest-core/playwright.mobile.config.ts
 M nursenest-core/playwright.nursing-hubs.config.ts
 M nursenest-core/playwright.pathways-prenursing-allied.config.ts
 M nursenest-core/playwright.pre-nursing-hub.config.ts
 M nursenest-core/playwright.release-gate.config.ts
 M nursenest-core/playwright.visual-qa.config.ts
 M nursenest-core/scripts/capture-marketing-screenshots.mjs
 M nursenest-core/src/app/(marketing)/(default)/[locale]/[slug]/[examCode]/cat/page.tsx
 M nursenest-core/src/app/(marketing)/(default)/[locale]/[slug]/[examCode]/lessons/[lessonSlug]/pathway-lesson-detail-page-body.tsx
 M nursenest-core/src/app/(marketing)/(default)/[locale]/[slug]/[examCode]/lessons/page.tsx
 M nursenest-core/src/app/(marketing)/(default)/[locale]/[slug]/[examCode]/page.tsx
 M nursenest-core/src/app/(marketing)/(default)/[locale]/[slug]/[examCode]/pricing/page.tsx
 M nursenest-core/src/app/(marketing)/(default)/[locale]/[slug]/[examCode]/questions/page.tsx
 M nursenest-core/src/app/(marketing)/(default)/allied-health/[slug]/page.tsx
 M nursenest-core/src/app/(marketing)/(default)/allied/[career]/page.tsx
 M nursenest-core/src/app/(marketing)/(default)/allied/allied-health/page.tsx
 M nursenest-core/src/app/(marketing)/(default)/pre-nursing/page.tsx
 M nursenest-core/src/app/(marketing)/[locale]/pre-nursing/page.tsx
 M nursenest-core/src/app/modules/ecg/layout.tsx
 M nursenest-core/src/components/ecg-module/ecg-module-client.tsx
 M nursenest-core/src/components/ecg-module/ecg-module-page.tsx
 M nursenest-core/src/components/exam-pathways/exam-pathway-hub-premium-modules.contract.test.tsx
 M nursenest-core/src/components/exam-pathways/exam-pathway-hub-premium-modules.tsx
 M nursenest-core/src/components/flashcards/flashcard-weak-study-client.tsx
 M nursenest-core/src/components/layout/site-footer.tsx
 M nursenest-core/src/components/lessons/lesson-section-card.tsx
 M nursenest-core/src/components/marketing/about-page-client.tsx
 M nursenest-core/src/components/marketing/how-it-works-page-client.tsx
 M nursenest-core/src/components/marketing/nursing-tier-hub-page.tsx
 M nursenest-core/src/components/marketing/pricing-conversion-clarity.smoke.test.ts
 M nursenest-core/src/components/pre-nursing/pre-nursing-landing-client.tsx
 M nursenest-core/src/components/seo/seo-json-ld.tsx
 M nursenest-core/src/components/student/learner-study-home.tsx
 M nursenest-core/src/config/global-nav-config.ts
 M nursenest-core/src/lib/ecg-module/ecg-module-config.test.ts
 M nursenest-core/src/lib/ecg-module/ecg-module-config.ts
 M nursenest-core/src/lib/ecg-module/ecg-module-contract.test.ts
 M nursenest-core/src/lib/ecg-module/ecg-module.server.ts
 M nursenest-core/src/lib/marketing-i18n/marketing-layout-chrome-messages.server.ts
 M nursenest-core/src/lib/marketing-i18n/minimal-marketing-layout-shell-fallback.ts
 M nursenest-core/src/lib/marketing/exam-pathway-hub-premium-modules.ts
 M nursenest-core/src/lib/marketing/marketing-hero-nav-critical-keys.ts
 M nursenest-core/src/lib/marketing/public-nav-homepage-copy-hotfix.contract.test.ts
 M nursenest-core/src/lib/marketing/screenshot-registry.ts
 M nursenest-core/src/lib/modules/hidden-module-preview.test.ts
 M nursenest-core/src/lib/notifications/admin-paid-subscription-sms.ts
 M nursenest-core/src/lib/seo/exam-pathway-hub-alternates.test.ts
 M nursenest-core/src/lib/stripe/apply-stripe-webhook-event.ts
 M nursenest-core/src/lib/stripe/stripe-webhook-policy.test.ts
 M nursenest-core/src/lib/stripe/subscription-owner-notify-eligibility.ts
 M nursenest-core/src/lib/stripe/subscription-owner-notify.test.ts
 M nursenest-core/src/lib/stripe/subscription-owner-notify.ts
 M nursenest-core/src/lib/theme/marketing-header-bands.contract.test.ts
 M nursenest-core/src/lib/theme/nav-chrome.ts
 M nursenest-core/src/lib/theme/site-header-marketing-chrome.contract.test.ts
 M nursenest-core/tests/e2e/lessons/lesson-detail-premium-smoke.spec.ts
 M nursenest-core/tests/e2e/navigation/header-nav.spec.ts
 M nursenest-core/tests/e2e/public/allied-hub-premium-smoke.spec.ts
 M nursenest-core/tests/e2e/public/marketing-header-bands.spec.ts
 M nursenest-core/tests/e2e/public/marketing-header-layout-responsive.spec.ts
 M nursenest-core/tests/e2e/public/new-grad-hubs.spec.ts
 M nursenest-core/tests/e2e/setup/auth.setup.ts
 M nursenest-core/tests/e2e/visual-qa/visual-qa-global-setup.ts
A  reports/allied-health-ship-FINAL.md
 M scripts/lib/nav-i18n-audit.mjs
 M scripts/validate-nav-i18n.mjs
?? docs/governance/nav-figma-parity-checklist.md
?? docs/qa/
?? docs/reports/
?? docs/runtime/
?? docs/screenshots/README.md
?? docs/screenshots/allied-hubs/
?? docs/screenshots/ecg-published/
?? docs/screenshots/hub-module-relocation/
?? docs/screenshots/nav-audit-2026/
?? docs/screenshots/nursing-hubs/
?? docs/screenshots/visual-regression-baseline/
?? nursenest-core/docs/hub-module-relocation-FINAL.md
?? nursenest-core/docs/reports/marketing-header-fix-2026.md
?? nursenest-core/docs/reports/pre-nursing-runtime-stabilization-FINAL.md
?? nursenest-core/docs/runtime/
?? nursenest-core/docs/screenshots/marketing-header/after-fix-chromium-1280x900.png
?? nursenest-core/playwright/
?? nursenest-core/reports/learner-dashboard-phase1-plan.md
?? nursenest-core/scripts/_tmp-capture-ui-evidence.mjs
?? nursenest-core/scripts/dev/
?? nursenest-core/scripts/helpers/
?? nursenest-core/scripts/qa/
?? nursenest-core/scripts/runtime/
?? nursenest-core/scripts/seed-authenticated-qa-learner.mts
?? nursenest-core/scripts/wait-for-app-ready.mjs
?? nursenest-core/scripts/write-allied-hub-report.mts
?? nursenest-core/scripts/write-new-grad-hub-report.mts
?? nursenest-core/src/components/ecg-module/ecg-module-publication-notice.tsx
?? nursenest-core/src/components/pre-nursing/pre-nursing-marketing-hub-actions.tsx
?? nursenest-core/src/components/pre-nursing/pre-nursing-marketing-hub-main.tsx
?? nursenest-core/src/lib/allied/allied-hub-inventory-counts.server.ts
?? nursenest-core/src/lib/allied/allied-hub-program-model.contract.test.ts
?? nursenest-core/src/lib/allied/allied-hub-program-model.ts
?? nursenest-core/src/lib/allied/allied-hub-report-markdown.ts
?? nursenest-core/src/lib/ecg-module/ecg-marketing-hub-surface.server.ts
?? nursenest-core/src/lib/marketing/pricing-subscription-scope-guardrail.contract.test.ts
?? nursenest-core/src/lib/new-grad/new-grad-hub-program-model.contract.test.ts
?? nursenest-core/src/lib/new-grad/new-grad-hub-program-model.ts
?? nursenest-core/src/lib/new-grad/new-grad-hub-report-markdown.ts
?? nursenest-core/src/lib/pre-nursing/pre-nursing-marketing-hub-surface.contract.test.ts
?? nursenest-core/src/lib/stripe/subscription-owner-notify-invoice-eligibility.test.ts
?? nursenest-core/tests/e2e/helpers/spawn-wait-for-app-ready.ts
?? nursenest-core/tests/e2e/helpers/visual-layout-assertions.ts
?? nursenest-core/tests/e2e/learning-routes.global-setup.ts
?? nursenest-core/tests/e2e/marketing/
?? nursenest-core/tests/e2e/paid-user/flashcards-premium-interaction.spec.ts
?? nursenest-core/tests/e2e/paid-user/learner-dashboard-phase1-hero-readiness.spec.ts
?? nursenest-core/tests/e2e/pre-nursing-hub.global-setup.ts
?? nursenest-core/tests/e2e/qa/
?? nursenest-core/tests/e2e/release-gate.global-setup.ts
?? nursenest-core/tests/marketing/about-how-it-works-smoke.spec.ts
?? nursenest-core/tests/reports/
?? reports/2026-05-09-pricing-faq-subscription-clarity-session-2.md
?? reports/about-how-it-works-ecosystem-page.md
?? reports/allied-health-figma-ui-plan.md
?? reports/allied-health-hub-FINAL.md
?? reports/allied-health-hub-program.md
?? reports/allied-health-implementation-FINAL.md
?? reports/ecg-publication-FINAL.md
?? reports/hub-module-relocation-FINAL.md
?? reports/hub-runtime-and-qa-finalization-FINAL.md
?? reports/new-grad-hub-FINAL.md
?? reports/new-grad-hub-program.md
?? reports/subscription-notifications-pipeline.md
?? reports/subscription-notifications-production-verification.md
?? tests/
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
```
