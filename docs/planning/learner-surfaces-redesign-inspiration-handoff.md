# Learner surfaces redesign — inspiration → NurseNest (handoff)

**Status:** Design + implementation plan. **Do not** paste competitor/app names or palettes into production UI. **Translate** the attached inspiration (saved under `.cursor/projects/root-nursenest-core/assets/`) into **NurseNest** leaf/wordmark, **semantic/theme tokens**, and **existing routes**.

**Governance:** Ocean = canonical structure. Blossom / Midnight = token-driven skin only. No hardcoded hex. No structurally different themes. Preserve auth, entitlements (server source of truth), SEO, sitemap, hreflang, i18n, and practice vs CAT behavior.

### Mandatory workflow (do not reorder or skip)

| Step | Gate |
|------|------|
| **1. Figma first** | Componentized mockups for each major surface (desktop/tablet/mobile as applicable); Ocean structure defined before Blossom/Midnight skins. |
| **2. Screenshot review second** | Stakeholders approve exported Figma screenshots (or equivalent design review) before engineering starts. |
| **3. Implementation third** | Code only after step 2 sign-off. |
| **4. Actual app screenshots fourth** | Capture production or staging builds for PR/evidence (not only Figma). |
| **5. Theme parity verification fifth** | Ocean / Blossom / Midnight checked for readability, hierarchy, and cohesion on the same routes. |

**Hard stops:** Do **not** skip mockups. Do **not** ship generic placeholder UI as “done.” Do **not** diverge from Ocean structure (layout/IA). Do **not** create disconnected mini-apps per module—reuse learner shells, canonical nav, and adaptive loops.

**Quality bar (every major surface):** Premium and clinically professional; cohesive with NurseNest leaf + wordmark; mobile-polished; supports Ocean, Blossom, and Midnight without forked layouts.

---

## 1) Figma — frames to create (before code)

Build **componentized** auto-layout frames; use **NurseNest** copy patterns from `tools/i18n/marketing` / learner keys, not inspiration brand names.

### 1.1 Learner dashboard (`/app`)

| Frame | Breakpoints | Notes |
|-------|-------------|--------|
| `Learner / Dashboard / Desktop / Ocean` | 1440 | Command-center grid: welcome/continue, exam countdown, readiness, today’s plan, weak/strong, next actions, recent activity, streak, quick-launch modules, subscription summary, settings entry, **staff banner** (distinct from subscription). |
| `Learner / Dashboard / Tablet / Ocean` | 768 | Collapse to 2 columns; quick-launch horizontal scroll. |
| `Learner / Dashboard / Mobile / Ocean` | 390 | Single column; sticky bottom nav **unchanged** (match shell). |
| Same set | | **Blossom** + **Midnight**: duplicate frames; **swap variables only** — no layout change. |

**Data realism:** Use plausible NCLEX-style domain labels, streak integers, percentages — align with fields from `PremiumDashboardSnapshot` / `LearnerStudyHome` props (see `src/app/(student)/app/(learner)/page.tsx`).

### 1.2 Report card / performance

Canonical route: **`/app/account/report`** (legacy `/app/account/report-card` redirects).

| Frame | Notes |
|-------|--------|
| `Report / Desktop / Ocean` | Overall score, readiness/pass band, domain rows with semantic bars, weak/strong pills, trend, velocity, remediation CTA row. |
| `Report / Mobile / Midnight` | Stack; ensure contrast for gauges. |
| `Export` | If API exists — enabled control; else **disabled** with tooltip “Coming soon” (future-safe). |

### 1.3 Practice exam (learning mode)

**Runner:** `practice-test-runner-client.tsx` + rationale panels (`practice-rationale-full-panel.tsx`, `practice-test-per-item-rationale.tsx`). Custom setup — modal pattern already in inspiration; map to existing hub flows.

Include: MCQ, SATA, case/vignette shell, bowtie/trend composite, lab figure + trend panel, ECG strip placeholder, dosage workspace, calculator/notes/mark, confidence, rationale sidebar + coach strip, **timed/untimed** setup, rationale toggle, resume.

### 1.4 CAT exam (licensing mode)

**Contract reference:** `tests/e2e/cat/cat-exam-mode-contract.spec.ts` — **no** `.nn-question-session-rationale`, **no** live transparency strip in exam mode.

Include: timer, question count, flag, pause modal, skeleton, **neutral** selected options (no green/red reveal), submit → advance; results **after** session (`cat-launch`, results routes under `practice-tests`).

### 1.5 Flashcards

Clarify product truth: if decks are **MCQ+rationale**, frames must show **stem + four options + check answer → rationale**, not generic flip cards — align with `flashcards/[deckRef]` implementation.

### 1.6 Lesson hubs

**Route:** `/app/lessons` (and pathway variants). Frames: search, country/pathway context, breadcrumbs, category grid with **per-card progress**, tabs where implemented, **locked** premium modules — match entitlement tiers in annotations.

---

## 2) Token / component mapping (inspiration → NurseNest)

| Inspiration pattern | NurseNest implementation |
|---------------------|---------------------------|
| Primary blue CTA | `var(--role-cta)` / `var(--semantic-brand)` — not sampled hex from mocks |
| Success / warning / danger bands | `semantic-success`, `semantic-warning`, `semantic-danger`, chart fills via `semantic-chart-1..5`, `nn-progress-fill-semantic-*` |
| Dashboard cards | `LearnerSurface`, `LearnerStudySurfaceSection`, dashboard cards under `src/components/student/dashboard/` |
| Quick-launch strip | `LearnerHubClinicalQuickLaunch` + `buildPremiumDashboardLaunchTiles` |
| Adaptive band | `LearnerAdaptiveRecommendationsSection`, `FocusTodayStrip` |
| Practice rationale column | `[data-nn-qa-practice-rationale-column]`, `.nn-practice-exam-rationale-panel` |
| CAT exam shell | `[data-cat-exam-root]`, `.nn-cat-premium-convergence`, advance `[data-nn-qa-cat-exam-advance]` |
| Theme switching | `[data-theme]` + `theme-palettes.css` / `semantic-status-tokens.css` |

**Staff vs subscription:** Keep existing server-rendered staff/admin entry points; **do not** style staff banner like paywall — distinct semantic tone (e.g. `semantic-info` panel, not `role-cta`).

**Entitlements:** Paywall removal when subscription ends = **`resolveEntitlementForPage` / DB state** — UI only reflects server; no client-only hiding for paid features.

---

## 3) Cursor implementation plan (phased — after Figma approval)

| Phase | Scope | Primary files / areas |
|-------|--------|------------------------|
| **A** | Dashboard visual hierarchy + spacing | `learner-study-home.tsx`, `premium-learner-hub.tsx`, `learner-dashboard-command-center.tsx`, `exam-countdown-card.tsx`, `readiness-score-card.tsx`, `learner-daily-momentum-card.tsx` |
| **B** | Report / analytics views | `/app/account/report`, `learner-report-card-model`, insight panels |
| **C** | Practice exam polish (rationale, coach, setup modal) | `practice-test-runner-client.tsx`, `practice-exam-rationale-*`, practice hub `practice-tests` pages |
| **D** | CAT exam shell polish (no rationale leak) | CAT runner paths; maintain contract tests |
| **E** | Flashcards MCQ+rationale flow | `flashcards/` routes and deck session components |
| **F** | Lesson hub grid | `lessons/page.tsx`, lesson library cards, locks via entitlements |
| **G** | Playwright + visual QA | Extend `tests/e2e/learner-surfaces/`, `cat-exam-mode-contract`, `linear-premium-shell`, theme readability |

**Explicit non-goals for early phases:** URL changes, API response shape changes, new entitlements without product sign-off.

---

## 4) Playwright matrix (add or extend)

| Area | Spec direction |
|------|----------------|
| Dashboard renders | Smoke: authenticated shell + key sections visible (`tests/e2e/learner-surfaces/` patterns) |
| Report | `/app/account/report` loads for entitled user |
| Practice rationale | `linear-premium-shell.spec.ts`, paid learner workflows |
| CAT no rationale | `cat-exam-mode-contract.spec.ts`, `premium-convergence.visual.spec.ts` |
| Question-type shells | Add **fixture-driven** tests per type where runner exposes stable selectors |
| Flashcards | Deck session: MCQ + rationale visibility |
| Theme readability | Visual or smoke with `[data-theme]` cycle |
| Mobile sticky controls | Practice/CAT mobile projects |
| Subscription | `expectNoSubscriptionPaywall` / paid harness — entitlement end = server fixture, not UI-only |

---

## 5) Inspiration assets (reference only)

Files saved for design reference (not for copying branding):

`/.cursor/projects/root-nursenest-core/assets/*.png` (dashboard, report card, practice/CAT, flashcards, lesson library, question flavors, etc.).

---

## 6) Deliverables checklist

- [ ] Figma file link + frame IDs (desktop/tablet/mobile × Ocean/Blossom/Midnight for dashboard + report + practice + CAT + flashcards + lessons)
- [ ] This doc updated with **token mapping** sign-off from design
- [ ] PR implements approved deltas + `npm run typecheck:critical` green
- [ ] `npm run test:homepage` green (marketing contracts)
- [ ] Targeted `npm run test:e2e -- …` with paid/staging env documented
- [ ] Screenshots: Ocean/Blossom/Midnight desktop + mobile for approved surfaces

---

## 7) Files changed (this submission)

| File | Change |
|------|--------|
| `docs/planning/learner-surfaces-redesign-inspiration-handoff.md` | **Added** — planning handoff only |

No learner UI code changes in this submission — aligns with **Figma-first / approve-then-implement**.
