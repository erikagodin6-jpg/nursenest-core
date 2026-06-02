# Release candidate convergence (2026-05-10)

**Truthpack:** `.vibecheck/truthpack/` was not present in this workspace — no product tiers or routes were taken from truthpack files.



**Git root:** `/root/nursenest-core`  
**Next app:** `/root/nursenest-core/nursenest-core`

Cross-links: [release-hardening-status-2026-05-10.md](./release-hardening-status-2026-05-10.md), [release-reconciliation-2026-05-10.md](./release-reconciliation-2026-05-10.md), [repository-convergence-cleanup-plan.md](./repository-convergence-cleanup-plan.md).

---

## Phase 1 — Deterministic authenticated QA

| Item | Status |
|------|--------|
| `scripts/seed-authenticated-qa-learner.mts` | **Extended** — third text-only flashcard; `LearnerNote` upsert for dashboard/account note surfaces; cleanup for notes on `AUTH_QA_SEED_RESET`; header documents multi-account / pathway gaps vs `qa-paid-test-account-reset.mts`. |
| Dashboard / readiness / planner / weak topics / practice / CAT / OSCE / ECG | **Reconciled** — existing rows retained; note + 3-card deck improve flashcard hub and “recent activity” style surfaces without changing entitlements. |

---

## Phase 2 — Authenticated Playwright

| Item | Status |
|------|--------|
| `playwright.learning-routes.config.ts` | **Aligned** with `localNextDevWebServer` + `getE2eBaseURL` (same family as release-gate / visual-qa): `npm run dev:next`, root `/` readiness, `PLAYWRIGHT_SKIP_WEB_SERVER` + `PLAYWRIGHT_NO_REUSE_WEB_SERVER` from shared helper. |
| `setup-paid-auth` | **Hardened** — `paid-e2e-failure-taxonomy` attached to failure JSON and thrown message (`paidE2eTaxonomy=…`) for triage (redirect, env, inventory, seed, race, dup_server, ssr_cold, assertion, auth). |
| `spawn-wait-for-app-ready.ts` | Default `APP_READY_PATHS` includes **`/app/osce`** (guest: expect auth redirect, not 5xx). |

---

## Phase 3 — Visual matrix

| Item | Status |
|------|--------|
| `docs/screenshots/rc-theme-matrix-2026/README.md` | **Expanded** checklist (themes × surfaces, header/footer, ECG capture guidance). |
| Captured PNGs | **Not batch-generated** in this session — matrix lists explicit blockers when no healthy server. |

---

## Phase 4 — Footer premium convergence

| Item | Status |
|------|--------|
| `premium-redesign-2026.css` | **Surgical** — footer panels use softer depth shadows (semantic-border-soft + footer-fg) instead of chart-tinted glows; footer-scoped `.nn-nav-cta` uses muted brand/info mix vs header neon gradient. |
| `site-footer.tsx` | **Unchanged routes/i18n** in this pass (CSS-only polish under `[data-nn-footer-layout="marketing"]`). |

---

## Phase 5 — Duplicate tree governance

| Item | Status |
|------|--------|
| `docs/reports/repository-convergence-cleanup-plan.md` | **Created** — canonical `docs/reports/` + `docs/screenshots/` vs inner trees; safe vs risky; no deletions. |

---

## Phase 6 — Runtime / SSR hardening

| Item | Status |
|------|--------|
| `scripts/qa/wait-for-app-ready.mjs` | **Extended** — overlay markers for secret-misconfig strings; timeout footer prints **classification hints** (ssr_cold_or_compile, env_missing_secret, auth_bootstrap, runtime_transport, redirect_loop) without inflating global Playwright timeouts. |

---

## Phase 7 — Validation

Run from **`nursenest-core/`** (the Next package):

```bash
npm run typecheck:critical
npm run test:homepage
```

**Targeted paid + visual QA (when server + `E2E_PAID_*` + DB exist):**

```bash
export PLAYWRIGHT_SKIP_WEB_SERVER=1
export PLAYWRIGHT_BASE_URL=http://127.0.0.1:3000
npm run wait:app:ready
npx playwright test -c playwright.release-gate.config.ts --project=release-blocking-paid
# or broader paid slice:
# npx playwright test -c playwright.learning-routes.config.ts
```

**This environment:** `npm run typecheck:critical` → **exit 0**; `npm run test:homepage` → **exit 0** (1 skipped contract). Paid Playwright suites were **not** run (no long-lived app + paid creds in this sandbox).

---

## Phase 8 — RC approaching?

Harness alignment (release-gate, learning-routes, wait script triage, seed coverage) reduces **dup-server** and **auth bootstrap** drift; full RC still needs green **`qa:release-gate`** / visual matrix captures on a real candidate URL + DB.

---

## Appendix — environment snapshot

```
pwd: /root/nursenest-core
git branch --show-current: main
```

See `git status --short` and `git log --oneline -15` from the machine that produced this report (values vary by checkout).


```
pwd: /root/nursenest-core
git branch --show-current: main
git status --short:
 M docs/reports/release-reconciliation-2026-05-10.md
 M docs/runtime/playwright-local-workflow.md
 M docs/screenshots/README.md
 M nursenest-core/docs/runtime/local-runtime-modes.md
 M nursenest-core/docs/screenshots/marketing-header/after-fix-chromium-1024x900.png
 M nursenest-core/docs/screenshots/marketing-header/after-fix-chromium-1280x900.png
 M nursenest-core/docs/screenshots/marketing-header/after-fix-chromium-390x844.png
 M nursenest-core/docs/screenshots/marketing-header/after-fix-chromium-768x1024.png
 M nursenest-core/playwright.learning-routes.config.ts
 M nursenest-core/playwright.release-gate.config.ts
 M nursenest-core/scripts/qa/wait-for-app-ready.mjs
 M nursenest-core/scripts/seed-authenticated-qa-learner.mts
 M nursenest-core/src/app/premium-redesign-2026.css
 M nursenest-core/src/components/layout/site-footer.tsx
 M nursenest-core/src/components/marketing/marketing-pathway-hub-hero-band.tsx
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
?? docs/reports/release-candidate-convergence-2026-05-10.md
?? docs/reports/release-hardening-status-2026-05-10.md
?? docs/reports/repository-convergence-cleanup-plan.md
?? docs/screenshots/footer-figma-implementation/
?? docs/screenshots/rc-theme-matrix-2026/
?? nursenest-core/docs/reports/authenticated-runtime-hardening-2026-05-10.md
?? nursenest-core/docs/screenshots/hub-figma-implementation/allied-respiratory-desktop-midnight.png
?? nursenest-core/docs/screenshots/hub-figma-implementation/hub-figma-smoke-us-rn-desktop.png
?? nursenest-core/reports/allied-newgrad-figma-implementation-FINAL.md
?? nursenest-core/reports/footer-figma-implementation-FINAL.md
?? nursenest-core/reports/hub-figma-implementation-FINAL.md
?? nursenest-core/src/lib/marketing/is-new-grad-transition-pathway.test.ts
?? nursenest-core/tests/e2e/helpers/paid-e2e-failure-taxonomy.ts
?? nursenest-core/tests/e2e/helpers/redirect-loop-guard.ts
?? nursenest-core/tests/e2e/navigation/footer-marketing-premium.spec.ts
git log --oneline -15:
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
