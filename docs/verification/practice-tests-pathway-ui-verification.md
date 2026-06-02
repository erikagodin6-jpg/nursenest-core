# Practice Tests & pathway marketing — rendered UI verification

**Date:** 2026-05-07  
**Environment:** Local Next.js dev (`http://127.0.0.1:3000`, app root `nursenest-core/`)  
**Before/after:** **After-only verification** — no prior screenshot baseline in repo; do not treat as visual regression.

## Evidence bundle

| Route | Desktop (1280×800) | Mobile (390×844) |
| --- | --- | --- |
| `/app/practice-tests` | `docs/verification-screenshots/practice-tests-desktop.png` | `docs/verification-screenshots/practice-tests-mobile.png` |
| `/canada/new-grad` | `docs/verification-screenshots/canada-new-grad-desktop.png` | `docs/verification-screenshots/canada-new-grad-mobile.png` |
| `/allied/allied-health` | `docs/verification-screenshots/allied-global-hub-desktop.png` | `docs/verification-screenshots/allied-global-hub-mobile.png` |
| `/allied/mlt` (sample occupation) | `docs/verification-screenshots/allied-mlt-occupation-desktop.png` | `docs/verification-screenshots/allied-mlt-occupation-mobile.png` |
| `/app/dashboard` (optional) | `docs/verification-screenshots/learner-dashboard-desktop.png` | `docs/verification-screenshots/learner-dashboard-mobile.png` |

Machine-readable capture metadata: `docs/verification/screenshot-capture-log.json`.

**Capture method:** Playwright headless Chromium (`nursenest-core/scripts/browser-verify-screenshots.mjs`, `BASE_URL=http://127.0.0.1:3000 node scripts/browser-verify-screenshots.mjs`) so PNGs land in this workspace. Cursor **browser MCP** was used for live snapshots; its screenshot sink may map outside the Linux workspace, so Playwright is the source of truth for PR-attachable files.

## Summary

Marketing pathway surfaces (`/canada/new-grad`, `/allied/allied-health`, `/allied/mlt`) render **200** with multi-hue semantic panels, clear heroes, and study CTAs suitable for PR evidence. **Signed-out** requests to `/app/practice-tests` and `/app/dashboard` resolve **200** but the UI is the **learner auth gate** (“Sign in to access the learner app.”), so the redesigned **Practice Tests hub** (CAT hero, session builder, study-tools rail) was **not** visually exercised in this run—only the gate. Hierarchy notes for the hub below are from **code inspection** of `practice-tests-hub-client.tsx` plus component structure, to reduce guesswork until a subscribed session is available.

## Findings

| Severity | Location | Description | Remediation |
| --- | --- | --- | --- |
| **High (evidence gap)** | `/app/practice-tests`, `/app/dashboard` | No authenticated session → screenshots show **sign-in wall**, not hub/dashboard redesign. | Re-run captures signed in (test account / local seed), or attach Playwright smoke with storage state. |
| **Medium (local dev noise)** | Dev overlay | Next.js dev tools / “Issues” badge may appear on captures. | Use `NODE_ENV=production` preview build for “clean” marketing shots, or crop for external PRs. |
| **Low** | `/app/*` titles | Gate pages share generic marketing title; expected for unauthenticated shell. | None for product; use route URL in PR captions for clarity. |

### Hierarchy (what reads first → second)

- **`/canada/new-grad`:** Region badge → **H1** new-grad hub → supporting paragraph → **two-column study cards** (Lessons = success tint, Questions = info tint) → **Allied** panel with CTA to global allied hub. Marketing header/nav frames the page.
- **`/allied/allied-health`:** Marketing shell → **hero + inventory / occupation chooser** (global hub is “picker-first” per `AlliedHealthPathwayHub` `occupationPickerOnly`) → downstream study cards (lessons / questions / flashcards / CAT links in full occupation context).
- **`/allied/mlt`:** Occupation-scoped hub: **profession hero + study surfaces** (lessons/questions/flashcards/CAT/practice-tests login callbacks carry `alliedProfession`).
- **`/app/practice-tests` (signed-in, from code):** `LearnerStudyPageShell` → **main column:** exam-first **hero** (`nn-study-card`, Sparkles + `examFirst.heroTitle`) → **primary CAT CTA** block → secondary CTAs / builder → history. **Right rail (lg+):** `studyToolsRailNav` — CAT quick link, practice exams, question bank, lessons, flashcards, planner, account/report/readiness/review-queue, CAT insights, optional “last completed” replay.

### Simplification / demotion

- Practice hub concentrates **exam-first hero + CAT** in the primary column; **study tools** move to a **narrow rail** on large screens (`lg:grid-cols-[minmax(0,1fr)_minmax(220px,260px)]`), demoting peripheral navigation from the main scan path while keeping one-click access for momentum.
- New Grad page **does not** duplicate full RN mega-nav; it’s a **single-purpose hub** with two RN study entries + one **Allied** strip.

### Study orientation (NCLEX / exam session mental model)

The intended signed-in hub foregrounds **one high-stakes path** (CAT / exam-style start) before configuration and history, matching a “sit down for a scored session” mindset rather than a flat tool directory. Marketing allied/new-grad pages foreground **role identity and the next study action** (lessons vs questions) so visitors map quickly from career intent to a concrete drill—useful for NCLEX-style learners comparing “library depth” vs “question volume.”

### Anti-pattern checklist (honest)

| Check | Pass/Fail | Notes |
| --- | --- | --- |
| Flat “everything is one priority” grid | **Pass** (marketing + code) | Clear hero → cards progression; hub code orders CAT before dense controls. |
| Dashboard / admin density on learner marketing | **Pass** | Public hubs stay marketing-weight; no control-panel chrome on `/canada/new-grad`. |
| Monochrome / single-hue data wall | **Pass** | Semantic tokens (`semantic-success`, `semantic-info`, `semantic-chart-*`, `color-mix` borders) on New Grad cards and practice rail icons (code). |
| Clutter / redundant CTAs | **Pass with caveat** | Allied global hub is inherently list-heavy (many occupations); still grouped by category in implementation. |
| Auth wall mistaken for product UI | **Fail risk** | Unsigned `/app/*` screenshots are **gate-only**—do not over-interpret for hub polish. |

### Figma parity

Repo search for `figma.com` links: **none** tied to these frames (only a “Figma-aligned” spacing comment in `globals.css`). **Compared to stated UX goals only** (emotional learner surfaces, semantic color guardrails, exam-first hierarchy).

## Metrics

| Metric | Value |
| --- | --- |
| Routes captured | 5 |
| Viewports per route | 2 (desktop + mobile) |
| PNG files written | 10 under `docs/verification-screenshots/` |
| HTTP status (Playwright navigation) | **200** for all listed URLs in `screenshot-capture-log.json` |
| Locale prefix | **Not required** for these URLs in this environment (`/app/...`, `/canada/...`, `/allied/...`). |

## Re-run

```bash
cd nursenest-core
BASE_URL=http://127.0.0.1:3000 node scripts/browser-verify-screenshots.mjs
```

Ensure `next dev` (or preview server) is listening on `BASE_URL` first.
