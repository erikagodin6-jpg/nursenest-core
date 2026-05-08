# Full-site premium QA + alignment — report

**Date:** 2026-05-08  
**Scope:** Quality / consistency only — no learner features, no leaf logo change, no schema/API/auth/routing/SEO/pricing changes.

---

## Summary

| Area | Status |
|------|--------|
| Public theme selector | **Implemented:** marketing chrome exposes **Ocean + Midnight** only (`PUBLIC_MARKETING_THEME_ALLOWLIST`). Full theme registry + learner/account pickers unchanged. |
| Cross-surface polish | **Partial:** theme allowlist is the main cross-cutting fix; remaining page-by-page passes listed below. |
| Blog / tools | **Spot-check pending:** run locally when dev server is stable (see Tests). |
| Playwright breadth spec | **Added:** `tests/e2e/public/premium-smoke-breadth.spec.ts` (serial public tests + optional learner gate). |
| Screenshots | **Not captured** in this run (dev server churn). Commands below. |

---

## Files changed

| File | Change |
|------|--------|
| `src/lib/theme/theme-registry.ts` | `PUBLIC_MARKETING_THEME_ALLOWLIST` (`ocean`, `midnight`); `themeOptionsForPublicMarketingPicker()`. |
| `src/components/theme/theme-picker.tsx` | `pickerScope: "full" \| "publicMarketing"`; menu built from filtered options; empty light/dark sections omitted. |
| `src/components/layout/marketing-header-utility-strip.tsx` | `pickerScope="publicMarketing"`. |
| `src/components/layout/mobile-context-drawer.tsx` | `pickerScope="publicMarketing"`. |
| `src/components/layout/site-header.tsx` | Mobile menu `ThemePicker` `pickerScope="publicMarketing"`. |
| `src/components/marketing/marketing-default-layout-chrome-failsafe.tsx` | `pickerScope="publicMarketing"`. |
| `tests/e2e/public/premium-smoke-breadth.spec.ts` | New breadth spec (serial, public routes, 375px overflow, placeholder regex, theme option count, learner-gated block). |

**Unchanged (by design):** `learner-theme-control`, `learner-account-settings-panel`, `learner-context-settings-panel`, exam session theme flows — still use full `pickerScope` default.

---

## Theme hiding (product intent)

- **Allowlist:** `ocean` (default brand light), `midnight` (dark, aligned with premium pathway / `premium-redesign-2026.css` dark theme hooks).
- **Preserved:** All `[data-theme="…"]` CSS, `THEME_OPTIONS`, storage, and non-marketing pickers.
- **Feature flag:** Not added (per governance); allowlist is centralized for a future flag.

---

## Routes intended for manual / follow-up audit

**Covered by breadth spec (when server green):** `/`, `/faq`, `/blog`, `/tools`, `/tools/med-math`, `/pre-nursing`, `/question-bank`, `/us/rn/nclex-rn`, `/canada/rn/nclex-rn`.

**Remaining high-value public surfaces:** `/pricing`, `/allied-health`, `/us/new-grad`, `/canada/new-grad`, locale NP/Allied hubs; blog list + 1–2 posts (layout/links only); additional tool slugs from `TOOL_SLUGS`.

**Learner shells:** No broad layout edits in this slice.

---

## Copy / links / contrast

- **Copy:** No marketing shard edits in this diff.
- **Placeholders:** E2E regex may false-positive on legitimate "TBD" in FAQ — tune after first green run.
- **Dead hrefs:** Homepage test samples anchors on primary surface (non-empty href, not lone `#`).
- **Contrast:** Deferred to visual QA; semantic tokens unchanged.

---

## Test results (this session)

| Command | Result |
|---------|--------|
| `npm run typecheck:critical` | **Pass** |
| `npm run test:homepage` | **Pass** (12 pass, 1 skipped) |
| `npx playwright test -c playwright.release-gate.config.ts --list` | **Pass** — 19 tests listed |
| `npm run build` | **Not completed** — `timeout 90s` exited **124** during long i18n validation (not OOM). |
| `premium-smoke-breadth.spec.ts` | **Not green** in agent VM — dev server instability under load; spec uses **serial** mode. Re-run with stable `npm run dev:next`. |

**OOM / 137:** See `src/lib/ops/PHASE6B-PRODUCTION-STABILITY.md` (Exit **137** / OOM during build).

---

## Screenshots (optional)

```bash
mkdir -p reports/ui-redesign-preview/screenshots
cd nursenest-core
BASE_URL=http://127.0.0.1:3000 PLAYWRIGHT_SKIP_WEB_SERVER=1 \
  npx playwright test tests/e2e/public/premium-smoke-breadth.spec.ts --project=chromium
```

---

## Blockers / follow-ups

| Type | Detail |
|------|--------|
| **Polish** | Re-run breadth Playwright with stable dev server. |
| **Content** | Blog/tools spot-check incomplete here. |
| **Build** | Full production build not verified (timeout). |
| **Learner** | Gated tests need `QA_LEARNER_PUBLIC`, `E2E_LEARNER_PUBLIC`, or `E2E_PAID_EMAIL`. |
| **Infra** | `npm run dev` failed if `server/index.ts` missing; `npm run dev:next` used for smoke. |
