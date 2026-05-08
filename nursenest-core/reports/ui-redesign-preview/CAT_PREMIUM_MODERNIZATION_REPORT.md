# CAT premium modernization — slice report

**Date:** 2026-05-08  
**Scope:** Shell/visual only (no scoring, adaptive logic, persistence, entitlements, analytics, or question SOT changes).

## Relation to prior work

- No existing `reports/ui-redesign-preview/CAT_PREMIUM_MODERNIZATION_REPORT.md` was found; this file **starts** the report stream.
- Aligns with patterns already present in `src/app/premium-redesign-2026.css` (CAT learner block) and extends them.

## Surface audit (classification)

| Surface | Location | Classification |
|--------|----------|----------------|
| CAT setup / start | `/app/practice-tests/start`, `pathway-cat-session-start-client.tsx` | **Layout + tokens** — `lv-shell` + `nn-premium-cat-section`, hero chips, primary CTA |
| Direct launch bridge | `/app/practice-tests/cat-launch`, `cat-direct-launch-client.tsx` | **Tokens + layout** — `nn-premium-cat-direct-card` |
| Marketing CAT hub | `/:locale/:slug/:examCode/cat`, `cat/page.tsx` | **Tokens + layout** — `nn-premium-marketing-cat-card`, CTA-ready variant |
| Waitlist / no CAT pathways | `practice-tests/start/page.tsx` aside | **Tokens only** — replaced hardcoded amber with `--semantic-warning` mixes |
| In-exam adaptive chrome | `practice-test-runner-client.tsx` + `globals.css` | **Already premium** — `nn-cat-adaptive-exam-session`, progress/footer hooks |
| Study rationale (CAT study mode) | `cat-rationale-panel.tsx` | **Mostly legacy TSX** — `nn-premium-cat-rationale-head`; placeholder copy uses i18n keys |
| Results / pause / resume | Routed via practice test runner | **No logic edits this slice** — visual chrome inherits runner + existing CAT CSS |

## Changes (files)

| File | Change summary |
|------|----------------|
| `styles/learner-ds.css` | **Cascade fix:** `.lv-shell.nn-premium-cat-section` restores gradient/shadow over flat `.lv-shell` (import order issue). |
| `src/app/premium-redesign-2026.css` | `.nn-premium-cat-adaptive-footer`; `.nn-premium-cat-direct-card`; `.nn-premium-cat-hero-chips` nth-child borders; `.nn-premium-marketing-cat-card` + `--cta-ready` variant. |
| `src/components/student/pathway-cat-session-start-client.tsx` | Hero chip wrapper + per-chip borders via CSS; primary start → `nn-btn-primary`; empty state uses `lv-shell nn-premium-cat-section`. |
| `src/components/student/cat-direct-launch-client.tsx` | Loading/error cards → `nn-premium-cat-direct-card`, `rounded-2xl`. |
| `src/app/(marketing)/(default)/[locale]/[slug]/[examCode]/cat/page.tsx` | Premium marketing cards; access band uses `--cta-ready` when CAT available; removed redundant `bg-*` utilities so gradients apply. |
| `src/app/(student)/app/(learner)/practice-tests/start/page.tsx` | Waitlist aside: semantic warning tokens (no raw amber). |

## Visual references (exact paths)

### `reports/ui-redesign-preview/`

- `nursenest-core/reports/ui-redesign-preview/CAT_PREMIUM_MODERNIZATION_REPORT.md` (this file)

### `preview-screenshots/`

- `nursenest-core/preview-screenshots/README.md` (folder placeholder only — **no new CAT PNGs captured** this run; dev server not started for manual capture).

### `docs/qa-reports/`

- *(No matching files in repo at time of report.)*

### `docs/verification-screenshots/`

- *(No matching files in repo at time of report.)*

### Additional design docs (related hub)

- `nursenest-core/docs/ui-redesign-preview/PATHWAY_PREMIUM_REDESIGN_SUMMARY.md` (context only)

## Figma

- No Figma `fileKey` / `nodeId` was supplied in-repo for CAT; **screenshots/CSS remain source of truth.** Optional MCP read alignment was not performed.

## Routes touched (learner + marketing)

- `/app/practice-tests/start`
- `/app/practice-tests/cat-launch?pathwayId=…`
- `/{locale}/{slug}/{examCode}/cat` (e.g. `/us/rn/nclex-rn/cat`)

## Validation

| Check | Result |
|-------|--------|
| `npm run typecheck:critical` | **Pass** |
| `npm run test:homepage` | **Pass** (13 passed, 1 skipped) |
| Playwright `tests/e2e/cat/*` | **Blocked** — `TypeError: ... pathway-readiness-snapshot.json needs an import attribute of type "json"` (runner/env; not caused by this diff). |
| `practice-test-cat-shell-contract.test.ts` | **Pre-existing failure** — `Linear MCQ and linear SATA must both pass linearOptState` (1 subtest; unrelated to CSS in this slice). |

## Legacy / follow-up (non-blocking)

- In-exam option list, timer, and `globals.css` `.nn-cat-*` blocks remain the bulk of CAT styling; further polish could target **320–375px** footer CTAs in `practice-test-runner-board-parts.tsx` with PW viewport specs once Playwright runs cleanly.
- Capture screenshots into `preview-screenshots/` when `npm run dev:next` is available; attach to next PR.

## Blockers for “complete” PW proof

1. Playwright JSON import attribute error prevents CAT E2E execution in this environment until Node/playwright config aligns with `pathway-readiness-snapshot.json` imports.
2. No authenticated resume/smoke run (credentials not used).

---

## Pass 2 — 2026-05-08 (additive; extends slice above)

### Summary

- **Live calibration strip** (`cat-live-transparency-strip.tsx`): Replaced shadcn-adjacent utilities (`border-border`, `bg-muted`, `text-primary`) with **semantic token** surfaces and multi-hue mini-bars (`nn-premium-cat-transparency-bar--1…4`).
- **Premium CSS** (`premium-redesign-2026.css`): Added `.nn-premium-cat-transparency-strip` inset polish; bar hue rules; **scoped** multi-hue gradient on `.nn-cat-exam-chrome .nn-cat-top-bar__progress-fill` (width unchanged — purely visual).
- **Exam chrome accessibility**: `PracticeTestFlagForReviewButton` — `focus-visible` ring only (`practice-test-runner-board-parts.tsx`).
- **CAT results fallback banner**: Semantic `color-mix` background + text tokens (`cat-results-coach-section.tsx`).

### Files changed (this pass)

| File | Notes |
|------|------|
| `src/components/student/cat-live-transparency-strip.tsx` | Presentation only; optional telemetry UI |
| `src/components/student/practice-test-runner/practice-test-runner-board-parts.tsx` | Focus ring on flag control |
| `src/components/student/cat-results-coach-section.tsx` | Fallback strip tokens |
| `src/app/premium-redesign-2026.css` | Transparency + exam progress fill |

### Behavior-sensitive (still untouched)

`practice-test-runner-client.tsx`, `src/app/api/practice-tests/route.ts`, adaptive/scoring libs — **no edits**.

### Validation (this environment)

| Command | Result |
|---------|--------|
| `npm run typecheck:critical` | Pass |
| `npm run test:homepage` | Pass |
| `npx playwright test -c playwright.release-gate.config.ts --list` | Pass (19 tests; paid stub without creds) |

**CAT paid smoke not executed** — needs `E2E_PAID_EMAIL` / `E2E_PAID_PASSWORD`, DB, and Next dev server.

```bash
cd nursenest-core
npx playwright test tests/e2e/paid-user/paid-user-cat-smoke.spec.ts --config=playwright.config.ts
```

### Visual references — updated paths

| Directory | Path |
|-----------|------|
| Reports + screenshots | `/root/nursenest-core/nursenest-core/reports/ui-redesign-preview/` (includes `cat-exam-interface-dark-desktop.png` from earlier capture) |
| App preview folder | `/root/nursenest-core/nursenest-core/preview-screenshots/README.md` |
| QA reports | `/root/nursenest-core/docs/qa-reports/` (multiple journey QA markdown/json) |
| Verification screenshots | Not present as top-level `docs/verification-screenshots/` in repo |

### Confirmation

Core CAT logic (θ/SE math, item pool, timers, API payloads, analytics) unchanged — **shell + tokens only**.

