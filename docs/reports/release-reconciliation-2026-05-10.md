# Cross-functional release reconciliation

**Date:** 2026-05-10  
**Git root:** `/root/nursenest-core`  
**Next app:** `/root/nursenest-core/nursenest-core`  
**Purpose:** Single authoritative consolidation of completed slices and operational status. Facts below are taken from existing reports and this workspace's validation runs unless marked **unknown**.

---

## A. Subscription notifications

**Canonical reports (repo root `reports/`, not `docs/reports/`):**

- [`reports/subscription-notifications-pipeline.md`](../../reports/subscription-notifications-pipeline.md)
- [`reports/subscription-notifications-production-verification.md`](../../reports/subscription-notifications-production-verification.md)

**Consolidated technical facts (from pipeline report):**

| Topic | Evidence |
|--------|-----------|
| **Trialing / $0** | Owner checkout notify previously required `active` + `amount_total > 0`; trial-first flows (`trialing`, `$0`) were skipped. Invoice path skipped `$0` first invoices; both eligibility paths were adjusted (see pipeline doc + `subscription-owner-notify*.ts`). |
| **`after()`** | Post-response owner notify work moved from bare `Promise.resolve().then(...)` to **`after()` from `next/server`** so serverless invocations are not cut off before notify jobs finish. |
| **Twilio env fallback** | **`TWILIO_SMS_FROM` or `TWILIO_FROM_NUMBER`** accepted on owner SMS and gated admin SMS paths (previously mismatched). |
| **`event.id` / idempotency** | Orphan admin SMS path was fixed so Stripe event id is not empty for idempotency / dedupe (`stripeOwnerPaidSubscriptionNotify` keyed by event id). |
| **Logging** | Pipeline notes non-blocking notify failures must not roll back entitlement DB work; failures logged in notify jobs. |
| **Unit tests** | `npm run test:unit:stripe` includes webhook policy + `subscription-owner-notify*.test.ts` + invoice eligibility tests; verification doc lists exit **0** for that suite in the documented run. |
| **Production verification limits** | Operator checklists (Stripe URL to **`POST /api/subscriptions/webhook`**, DO env names, Resend/Twilio dashboards) are **human**; verification doc states **production delivery not confirmed** from dashboards in that session. Stripe CLI **`stripe listen`** not run where `stripe` binary absent. |

**Webhook path SSOT:** Next App Router **`/api/subscriptions/webhook`** (not legacy Express **`/api/stripe/webhook`**) — called out in both subscription reports.

---

## B. Pricing / FAQ

**Primary evidence:** [`reports/2026-05-09-pricing-faq-subscription-clarity-session-2.md`](../../reports/2026-05-09-pricing-faq-subscription-clarity-session-2.md) (companion: [`reports/pricing-faq-subscription-clarity.md`](../../reports/pricing-faq-subscription-clarity.md)).

| Topic | Evidence |
|--------|-----------|
| **EN polish** | Four pricing headings updated to title-case / clearer phrasing; aligned with existing `pricing-marketing-polish.contract.test.ts` expectations. |
| **Guardrail contracts** | Stricter scan for inclusion-implying forbidden language on pricing surfaces; Advanced ECG / BLS-style tracks / pass-guarantee / official-cert framing documented as out-of-scope for standard plans. |
| **Disclaimers** | FAQ JSON-LD and FAQ components (`pricing-subscription-faq`, region/reliability/learner blocks) document hedged subscription scope per report's source map. |
| **`validate-nav` noise** | **Not** the pricing slice's primary artifact; About slice documents `node scripts/validate-nav-i18n.mjs` exit **1** for locales like `ta` (including `nav.about` gaps alongside pre-existing keys). |
| **Truthpack absence** | Session-2 report states **`.vibecheck/truthpack/` is not populated** in that workspace (`product.json`, `copy.json`, etc. missing); codebase + i18n treated as SoT. **This workspace (2026-05-10):** `.vibecheck/truthpack/` directory still **absent** at git root. |

---

## C. Nav / About

**Primary evidence:** [`docs/reports/nav-about-link-update.md`](nav-about-link-update.md), [`docs/reports/nav-figma-v4-redesign-report.md`](nav-figma-v4-redesign-report.md).

| Topic | Evidence |
|--------|-----------|
| **`/about`** | App Router page `nursenest-core/src/app/(marketing)/(default)/about/page.tsx` — unchanged route, link added to marketing header. |
| **`nav.about`** | i18n key in canonical marketing bundle; `t("nav.about")` in `marketingMoreLinks`. |
| **Desktop / mobile** | Nav report describes row-4 marketing header (utility to primary to tier rail) and mobile/tablet drawer paths; About in primary/more links per About slice. |
| **`global-nav-config`** | SSOT updated for About href + label key (`docs/reports/nav-about-link-update.md` file table). |
| **`i18n:compile`** | About slice: `npm run i18n:compile` exit **0**; shards under `public/i18n/**` + generated keys. |
| **Locale parity gaps** | `validate-nav-i18n` fails for `ta` and others with `nav.about` missing alongside pre-existing gaps (About slice risks). |
| **Playwright / screenshot limits** | `tests/e2e/navigation/header-nav.spec.ts` updated; **not executed** in About slice (no dev server). `docs/screenshots/nav-audit-2026/` README only, **no PNGs** in that pass. |

---

## D. ECG publication

**Primary evidence:** [`reports/ecg-publication-FINAL.md`](../../reports/ecg-publication-FINAL.md).

| Topic | Evidence |
|--------|-----------|
| **Hidden / preview messaging** | Learner-facing yellow "hidden" strip **removed**; **`EcgModulePublicationNotice`** staff-only when access is `admin-preview`. |
| **HTTP semantics** | Denial reasons mapped to **401 / 403 / 404** with stable JSON `{ code: "ecg_access_denied", detail }` (replacing generic 404 for all cases). |
| **SEO** | `/modules/ecg` layout: **noindex** always; **follow** when enabled+published; draft/unpublished **nofollow**. Legacy `/modules/ecg-interpretation` unchanged (**noindex, nofollow**). |
| **Pathway rules** | RN/NP ECG via `pathwayAllowsEcgLinkedLearning`; RPN / New Grad / Allied / Pre-Nursing contracts omit ECG where policy requires. |
| **Client messaging** | Client parses JSON and shows reason-specific copy (sign-in, subscription, disabled, retry). |
| **Screenshot gaps** | `docs/screenshots/ecg-published/` prepared with `.gitkeep`; **no PNGs** captured in that run (no full dev + auth + published module run). |
| **Truthpack** | ECG FINAL notes truthpack **not present** in that clone — same as current workspace check. |

---

## E. Hub module relocation

**Primary evidence:** [`reports/hub-module-relocation-FINAL.md`](../../reports/hub-module-relocation-FINAL.md).

- Premium module grids **removed** from marketing **sub-routes** (`/questions`, `/cat`, `/lessons`, `/pricing` under pathway marketing URLs); **`StudyBottomNav` compact** on questions; single link back to pathway **overview** for full toolkit.
- **Learner** `/app/questions` and runners: **unchanged** (no `ExamPathwayHubPremiumModules` there).
- **ECG policy:** unchanged emission from `buildPremiumMarketingModuleCards` / existing RN/NP rules.
- **Validation (reported):** `typecheck:critical` **0**, `test:homepage` **0** (77 pass, 1 skip in hub report table).
- **Screenshots:** `docs/screenshots/hub-module-relocation/` `.gitkeep` only — **not captured** in session.

---

## F. Nursing / Allied hubs (evidence-bound)

Summaries below cite **only** named reports / tests observable in-repo.

### Nursing pathway hubs

**Evidence:** [`reports/nursing-hubs-ship-FINAL.md`](../../reports/nursing-hubs-ship-FINAL.md), [`reports/nursing-hubs-figma-brief.md`](../../reports/nursing-hubs-figma-brief.md) (also mirrored under `nursenest-core/docs/reports/` per that report).

- Premium module grid on **NursingTierHubPage** / `ExamPathwayHubBody` chain; routes RN US, RPN CA, NP US, New Grad US cited in FINAL.
- **ECG:** RN/NP tile when `pathwayAllowsEcgLinkedLearning`; excludes rex-pn / new-grad pathway id guard (commits referenced in FINAL).
- **NP:** `clinical_cases` tile + QA marker; **RPN:** no ECG marker per contracts.
- **Playwright:** `nursing-pathway-hubs-smoke`, `pathway-hub-premium-modules-interaction`; **screenshots** target `docs/screenshots/nursing-hubs-e2e/` — FINAL states agent **did not** host Next + capture PNGs.
- **Figma:** briefs exist; **TBD** URLs called out for manual paste.

### New Grad

**Evidence:** [`reports/new-grad-hub-FINAL.md`](../../reports/new-grad-hub-FINAL.md).

- Program model + `npm run report:new-grad-hub` to `reports/new-grad-hub-program.md`.
- **Playwright:** selector fix documented; **full New Grad Playwright not verified** (hub HTTP 500 without full DB/env per report).
- **Screenshots:** `nursenest-core/docs/screenshots/new-grad-e2e/` when E2E green — **unknown** completion here.

### Allied Health

**Evidence:** [`reports/allied-health-hub-FINAL.md`](../../reports/allied-health-hub-FINAL.md), allied program/figma reports under `reports/`.

- **23** occupations in `ALLIED_PROFESSIONS`; DB counts in generated report marked **TODO** (no invented numbers).
- **Gating:** labs / med calc / pharmacology / adaptive CAT marketing per `allied-hub-premium-module-policy.ts`.
- **OSCE / scenarios:** report flags deterministic script flags vs production alignment (**verify** when publishing).
- **Playwright:** `allied-health-hubs.spec.ts`; screenshots under **`nursenest-core/docs/screenshots/allied-health-e2e/`** (inner app path per FINAL).
- **Full Playwright / prod build:** **not run** in Allied FINAL session.

### Cross-cutting (contracts only, no new claims)

`npm run test:homepage` (2026-05-10 run) includes **`ExamPathwayHubPremiumModules` DOM contract** covering ECG presence/absence, OSCE href gating when flag off, Pre-Nursing omissions, New Grad labels, Allied band — **77 pass, 1 skip, 0 fail** (see Phase 6).

**Unknown without further reports:** end-to-end CAT **learner session** visibility in production, complete screenshot matrix for all hubs/themes, deterministic seed coverage for every Playwright pack.

---

## G. Runtime / Playwright

**Cross-links (paths from git root):**

| Document | Location |
|-----------|----------|
| Local runtime modes (standalone, dev, env, port conflicts, `wait:app:ready`, `PLAYWRIGHT_SKIP_WEB_SERVER`) | [`nursenest-core/docs/runtime/local-runtime-modes.md`](../../nursenest-core/docs/runtime/local-runtime-modes.md) |
| Playwright local workflow (`dev:next` vs legacy `npm run dev`, readiness, `reuseExistingServer`, EADDRINUSE) | [`docs/runtime/playwright-local-workflow.md`](../runtime/playwright-local-workflow.md) |

**Consolidated operational notes (from those docs + nav audit report):**

- **`wait-for-app-ready`:** Strict HTTP 200 on `/`, `/login`, `/app`, `/pre-nursing` by default; base URL order `APP_READY_BASE_URL` to `PLAYWRIGHT_BASE_URL` to `SCREENSHOT_BASE_URL` to `http://127.0.0.1:3000`.
- **`dev:next` / `dev:next:3000`:** Pinned 3000 fails fast on port collision (**EADDRINUSE** symptoms documented).
- **Standalone:** `output: "standalone"`; use `npm run runtime:standalone:*` helpers, not raw wrong `server.js` cwd.
- **Playwright `webServer`:** `PLAYWRIGHT_SKIP_WEB_SERVER=1` when manually starting dev server or diagnosing instability; Pre-Nursing config uses `dev:next:3000`.
- **Instability class:** Wrong stack if **`npm run dev`** (Express) used instead of **`npm run dev:next`** for App Router E2E — documented in Playwright workflow doc.
- **Visual QA configs:** Multiple `playwright.*.config.ts` files under `nursenest-core/`; **dirty tree** in this workspace shows several configs **modified** — treat as **in flight** until merged/cleaned.

---

## H. Screenshot + Figma governance

| Artifact | Path / note |
|----------|-------------|
| **Canonical screenshot tree (repo root)** | `docs/screenshots/` — [`docs/screenshots/README.md`](../screenshots/README.md) documents `marketing-slot-captures/`, `visual-regression-baseline/`, prerequisites, **gitignore of `*.png` / `*.webp`**. |
| **Root `.gitignore`** | Patterns `docs/screenshots/**/*.png` and `docs/screenshots/**/*.webp` (confirmed in repo `.gitignore`). |
| **Duplicate / inner tree** | `nursenest-core/docs/screenshots/` holds program outputs (e.g. `marketing-header/`, `nav-audit-2026/`, `allied-health-e2e/`); governance docs allow **either** root or inner paths — creates **dual-tree** risk (Phase 5). |
| **Nav audit** | `docs/governance/nav-figma-parity-checklist.md` expects shots under **`docs/screenshots/nav-audit-2026/`**; README exists at root and under inner app; PNG capture **often missing** in cited slices. |
| **Visual regression baseline** | Documented under `docs/screenshots/visual-regression-baseline/` per root README; default policy gitignores PNGs unless team opts in. |
| **Figma parity map** | [`docs/reports/figma-parity-map.md`](figma-parity-map.md) — surface map + hooks + Playwright visual anchor specs (`guest-marketing-visual-baseline`, `visual-qa-critical-regression`, `visual-qa-route-pack`). |
| **Checklist / template** | `docs/governance/figma-premium-ui-mandatory-process.md`, `figma-post-completion-summary-template.md`, `post-completion-delivery-checklist.md` reference screenshot dirs and Figma evidence. |
| **Theme matrix gaps** | Multiple slices defer **Ocean / Blossom / Midnight** by desktop/mobile PNG matrices; hub FINALs state Playwright/screenshot runs **not executed** or incomplete. |

---

## PHASE 3 — Status matrix

| Area | Status | Notes |
|------|--------|-------|
| Subscriptions (Stripe notify pipeline) | **Mostly Stable** | Repo + unit tests green; **production dashboards unverified** in operator sense. |
| Pricing / FAQ | **Stable** | Copy + contracts per session-2 report; truthpack still absent for automated product JSON SoT. |
| Nav redesign (marketing header) | **Mostly Stable** | Landed commits + contracts; **dirty tree** and possible hub contract HTML-entity mismatch called out in nav audit (separate follow-up). |
| About | **Stable** | Link + i18n + compile per About slice; locale gaps remain in nav-i18n validator. |
| Nursing hubs | **Mostly Stable** | Shipped per FINAL; screenshots/E2E capture incomplete. |
| Allied hubs | **Partial** | Model + tests + spec expanded; full Playwright/build not run in FINAL; screenshot path on inner app tree. |
| CAT visibility (marketing tiles) | **Stable** | Contract tests pass in `test:homepage` for pathway tiles; in-app CAT session **not re-verified** here. |
| ECG publication | **Mostly Stable** | HTTP/UX + metadata fixed; **ops gates** (ENABLE + publish + seed) + screenshots still manual. |
| Runtime stabilization | **Stable** | Docs + scripts exist; user discipline on `dev:next` vs `dev` and ports. |
| Playwright stability | **Partial** | `PLAYWRIGHT_SKIP_WEB_SERVER` + readiness documented; configs changed in dirty tree; E2E often skipped in reports. |
| Screenshot governance | **Partial** | Canonical `docs/screenshots/` + ignore rules; **duplicate inner dirs**; many programs without PNG evidence. |
| Authenticated QA | **Partial** | Visual QA specs require `playwright/.auth/learner-paid.json` per figma-parity-map; not validated in this reconciliation run. |
| Deterministic seeds | **Partial** | References in figma-parity-map to `docs/qa/deterministic-learner-seed-data.md` + `seed-screenshot-demo-user.ts`; completeness **unknown**. |
| Figma governance | **In Progress** | Checklists + parity map exist; several FINALs still say **no Figma URL** or no `use_figma` session. |
| Theme matrix | **Partial** | Contracts cover public theme allowlist; full screenshot matrix per hub **incomplete**. |
| Homepage contracts | **Stable** | `test:homepage` **0** exit this run (77 pass, 1 skip). |

---

## PHASE 4 — Open blockers

1. **Dirty `main` (or dirty working tree on `main`):** `nav-figma-v4-redesign-report.md` and current `git status` show **large** modified sets (i18n shards, Playwright configs, screenshots, client + app `public/i18n`, etc.) — merge/release risk until isolated and reviewed.
2. **Duplicate doc trees:** Operational **`reports/`** (canonical for many `*-FINAL.md` + subscription) vs **`docs/reports/`** (curated subset + mirrors like `nav-figma-v4-redesign-report.md`, `nursing-hubs-figma-brief.md`).
3. **Duplicate screenshot trees:** **`docs/screenshots/`** (repo root) vs **`nursenest-core/docs/screenshots/`** (inner Next app).
4. **Env fragility:** Full hub E2E and `/app` readiness require **AUTH_***, **DATABASE_URL**, Stripe secrets for some flows — documented in runtime docs.
5. **Auth / runtime instability:** Mis-selected dev server (`npm run dev` vs `npm run dev:next`) causes flaky E2E; port collisions cause readiness failures.
6. **Incomplete seeds / screenshot matrices:** ECG + New Grad reports explicitly call out missing seeds/PNG evidence.
7. **Intermittent homepage contracts:** Not failing this run; nav audit mentions **hub premium module** HTML entity / copy mismatch risk as **separate** from header work — watch for regressions.
8. **Playwright lifecycle issues:** Duplicate `webServer` vs manual server (`EADDRINUSE`); reliance on `PLAYWRIGHT_SKIP_WEB_SERVER` when dev compile unstable.

---

## PHASE 5 — Canonical vs non-canonical paths

- **`docs/reports/` (git root)**  
  - **Canonical for:** cross-cutting governance-style reports created for this monorepo layout (`figma-parity-map.md`, `nav-about-link-update.md`, **this file**).  
  - **Non-canonical / duplicate:** `nursenest-core/docs/reports/` contains **overlapping** reports (e.g. `nursing-hubs-figma-brief.md`, `nav-figma-v4-redesign-report.md`) — treat as **historical / inner-app convenience copies** unless a program explicitly chooses one tree.

- **`reports/` (git root)**  
  - **Canonical for:** most `*-FINAL.md` program closures, subscription notifications, pricing sessions, hub FINALs, inventories — **high volume** engineering reports live here.

- **`docs/screenshots/` (git root)**  
  - **Canonical policy** per `docs/screenshots/README.md` + root `.gitignore` for PNG/WebP.

- **`nursenest-core/docs/screenshots/`**  
  - **Program outputs** often land here (Playwright defaults per FINALs); **not deprecated** but creates **dual canonical** tension — align per `docs/governance/figma-post-completion-summary-template.md` guidance (repo root or inner path per program convention).

---

## PHASE 6 — Validation (executed 2026-05-10)

**Working directory:** `/root/nursenest-core/nursenest-core`

| Command | Exit code | Result |
|---------|-----------|--------|
| `npm run typecheck:critical` | **0** | `tsc --noEmit -p tsconfig.typecheck-critical.json` completed successfully. |
| `npm run test:homepage` | **0** | Node test runner: **77 pass, 1 skip, 0 fail** (skipped: optional homepage HTML ordering test). |

**On failure (not seen here):** Re-run with `node --import tsx --test ...` listing from `package.json` `test:homepage` script to identify failing contract file; typical classes: i18n placeholder leaks, homepage copy key drift, hub DOM contract mismatch, theme token regression.

---

## PHASE 7 — Command capture (literal)

The following block was produced by running the listed commands from **`/root/nursenest-core`** after this file was written.

```text
$ pwd
/root/nursenest-core
$ git branch --show-current
main
$ git status --short
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
?? reports/new-grad-hub-FINAL.md
?? reports/new-grad-hub-program.md
?? reports/subscription-notifications-pipeline.md
?? reports/subscription-notifications-production-verification.md
?? tests/
$ git log --oneline -15
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
62a4f4669 feat(learner): premium flashcard study presentation
c7387fb88 feat(learner): premium CAT and practice exam presentation
e1a2d91c2 feat(learner): Phase 1 cockpit premiumization for dashboard + report card
b8abea625 fix(marketing): show premium pathway hub modules on public hubs
$ ls -la docs/reports/release-reconciliation-2026-05-10.md
-rw-r--r-- 1 root root 28392 May  9 21:04 docs/reports/release-reconciliation-2026-05-10.md
```
