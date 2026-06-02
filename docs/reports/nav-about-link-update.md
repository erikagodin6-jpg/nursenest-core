# Marketing header: About link

## Summary

Added **About** (`/about`, existing App Router page at `nursenest-core/src/app/(marketing)/(default)/about/page.tsx`) to the marketing **SiteHeader** primary link row and aligned **global-nav-config** for desktop dropdown / mobile drawer parity. Canonical i18n key **`nav.about`** ("About") lives in `tools/i18n/marketing/marketing-en.json` and merges through `npm run i18n:compile`.

This report iteration completes **nav.about i18n parity** for flat regional locale bundles that were missing the key, fixes **`validate-nav-i18n.mjs` locale discovery** (so `ta` is no longer mistaken for `pt`), and records Playwright / screenshot / validation status.

---

## Phase 1 — i18n parity (`nav.about`)

### Audit

| Source | `nav.about` |
|--------|-------------|
| `tools/i18n/marketing/marketing-en.json` | Present ("About") |
| `tools/i18n/marketing/locale/marketing-*.json` (21 overlays) | All include `nav.about` (many use intentional English "About", allowlisted in `scripts/lib/nav-i18n-audit.mjs`) |

**Gap (fixed this session):** Flat monolith JSON files under `nursenest-core/public/i18n/` for **incomplete-tier** regional codes **did not** include `nav.about` or `nav.aboutNurseNest` (same English strings as `en/nav.json`). Affected files: **`ta.json`, `te.json`, `bn.json`, `mr.json`, `gu.json`, `hu.json`**.

**Intentional EN-fallback:** Those locales are `tier: "incomplete"` in `marketing-languages.ts`. Values added match English (`"About"`, `"About NurseNest"`) so they pass the nav audit allowlist (`v === "About"` and strings containing `NurseNest`).

### `validate-nav-i18n.mjs` locale list bugfix

The previous regex paired `code: "ta"` with the **next** object’s `tier: "full"` / `"partial"` in the file. Audited locales incorrectly included **`ta`** instead of **`pt`**.

**Fix:** `scripts/validate-nav-i18n.mjs` — `navAuditLocaleCodes()` now takes the substring from each `{ code: …` to the next such brace and reads **that object’s** `tier:` only. Audited locales are now **`fr`, `es`, `tl`, `hi`, `pt`** (marketing `full` + `partial` tiers, excluding `en`).

### Commands (Phase 1)

| Command | Cwd | Exit |
|---------|-----|------|
| `npm run i18n:compile` | `nursenest-core/` | **0** |
| `node scripts/validate-nav-i18n.mjs` | repo root | **1** (see below) |

**`nav.about`-specific:** **0** failures (`missing` / `empty` / `english_carryover` / `placeholder_mismatch` / `malformed` filtered to keys starting with `nav.about`).

**Full script (unrelated):** **70** `english_carryover` issues (e.g. `footer.howItWorks`, `footer.regionalHubLinks` on `fr`, `es`, `tl`, `hi`, `pt`) — pre-existing / out of scope for this About pass.

---

## Phase 2 — Playwright

**Not run.** No HTTP server on `127.0.0.1:3000` (or `PLAYWRIGHT_BASE_URL`): `curl --connect-timeout 1 --max-time 3 http://127.0.0.1:3000/` → HTTP code `000`, **exit 28** (timeout).

Planned command when a server is up:

`cd nursenest-core && npx playwright test tests/e2e/navigation/header-nav.spec.ts --project=chromium`

---

## Phase 3 — Screenshots

**No PNGs saved.** Blocker: no local server on port 3000 (same as Phase 2).

Reserved directory: `docs/screenshots/nav-audit-2026/` with `STATUS.txt` noting the blocker.

---

## Phase 5 — Validation

| Command | Cwd | Exit |
|---------|-----|------|
| `npm run typecheck:critical` | `nursenest-core/` | **0** |
| `npm run test:homepage` | `nursenest-core/` | **0** |

---

## Files touched (this About / i18n parity iteration)

| Path | Change |
|------|--------|
| `scripts/validate-nav-i18n.mjs` | Correct per-entry `tier` parsing for audited locale codes |
| `nursenest-core/public/i18n/ta.json` | Add `nav.about`, `nav.aboutNurseNest` |
| `nursenest-core/public/i18n/te.json` | Add `nav.about`, `nav.aboutNurseNest` |
| `nursenest-core/public/i18n/bn.json` | Add `nav.about`, `nav.aboutNurseNest` |
| `nursenest-core/public/i18n/mr.json` | Add `nav.about`, `nav.aboutNurseNest` |
| `nursenest-core/public/i18n/gu.json` | Add `nav.about`, `nav.aboutNurseNest` |
| `nursenest-core/public/i18n/hu.json` | Add `nav.about`, `nav.aboutNurseNest` |
| `docs/screenshots/nav-audit-2026/STATUS.txt` | Screenshot blocker note |

*(Earlier About-nav feature work — header, `global-nav-config`, `marketing-en.json`, E2E spec, etc. — remains as in prior commits / branch work.)*

---

## Unresolved / follow-ups

1. **Playwright + PNG evidence** when `next dev` (or `PLAYWRIGHT_BASE_URL`) is available: `header-nav.spec.ts`, themes Ocean / Blossom / Midnight, mobile drawer.
2. **Full `validate-nav-i18n` green:** requires addressing 70 `english_carryover` rows on switcher locales (separate from `nav.about`).

---

## Appendix — git context (repo root `/root/nursenest-core`)

```
/root/nursenest-core
main
---
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
 M nursenest-core/src/components/exam-pathways/exam-pathway-hub-premium-modules.contract.test.tsx
 M nursenest-core/src/components/exam-pathways/exam-pathway-hub-premium-modules.tsx
 M nursenest-core/src/components/exam-pathways/exam-pathway-hub.tsx
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
?? nursenest-core/reports/pre-nursing-runtime-stabilization-FINAL.md
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
?? nursenest-core/src/components/marketing/marketing-pathway-hub-hero-band.tsx
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
?? nursenest-core/tests/e2e/marketing/
?? nursenest-core/tests/e2e/paid-user/flashcards-premium-interaction.spec.ts
?? nursenest-core/tests/e2e/paid-user/learner-dashboard-phase1-hero-readiness.spec.ts
?? nursenest-core/tests/e2e/pre-nursing-hub.global-setup.ts
?? nursenest-core/tests/e2e/qa/
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
---
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
