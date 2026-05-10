# Learner layout redesign program — Figma-first handoff (2026)

This document satisfies the requested deliverables: **Figma frame specs**, **token/component mapping**, **Cursor implementation plan**, **test commands**, and **scope boundaries**. It intentionally **does not** replicate third-party inspiration screens; it translates **structure and hierarchy** into NurseNest’s existing shells, routes, and governance rules.

## Executive summary

- **Brand**: NurseNest leaf logo + wordmark only; DM Sans everywhere product UI already uses it via globals.
- **Themes**: Ocean, Blossom, Midnight, Sunset, Aurora — expression via `[data-theme]` + semantic layers (`semantic-status-tokens.css`), **no layout fork per theme**.
- **Safety**: Preserve server-backed **auth, entitlements, paywall**, learner URLs, cache semantics on `/app`, i18n loaders, SEO/sitemap/hreflang on marketing routes.
- **Practice vs CAT**: Behavioral differences stay **logic-driven** (rationale, hints, scoring UI), not theme-driven.
- **Delivery model**: **Figma approval → thin vertical slices in Cursor → Playwright evidence per slice.** A single mega-PR would violate production governance and risk regressions.

---

## 1) Figma deliverables (what to build)

Create a **library page** + **responsive frames** (desktop 1440, tablet 768, mobile 390) × **light/dark where applicable** × themes **Ocean / Blossom / Midnight** at minimum (Sunset/Aurora as variants using the same components).

### 1.1 Learner dashboard (`/app`)

**Frames**

| Frame ID (suggested) | Notes |
|---------------------|--------|
| `NN-LRN-DASH-D` | Desktop grid: hero/welcome, countdown, readiness, study plan, weak/strong, next actions, activity, streak, quick-launch strip, subscription summary, settings entry |
| `NN-LRN-DASH-T` | Tablet: two-column collapse rules; sticky quick actions |
| `NN-LRN-DASH-M` | Mobile: single column; bottom learner nav unobstructed |

**Components (reuse / extend, don’t fork)**

- Shell: `LearnerDashboardPageShell`, `LearnerStudyHome`, `LearnerHubClinicalQuickLaunch`
- Cards: existing learner dashboard bands (`nn-dash-*`), premium empty states
- **Staff vs subscription**: visually distinct banners (staff operational vs paid access) — align with existing staff session patterns

**Must-not**

- Replace canonical learner nav with a second tree
- Glass-heavy overlays that reduce contrast (Midnight readability)

### 1.2 Report card / performance

Map to existing report routes and models (`buildLearnerReportCardViewModel`, readiness loaders). Frames:

- Overall score + readiness band
- Domain rows with **semantic multi-hue** progress (not one brand bar for every row)
- Weak/strong tags, velocity/trend placeholders if data partial
- “What’s next” linking to **lessons / practice / flashcards / CAT** via existing href builders
- Export: **disabled / future** state if API not wired — label honestly

### 1.3 Practice exam UI

Inspiration → **NurseNest practice-runner surfaces** only:

- Practice badge / mode chip
- Question shell + **post-answer** rationale column/panel
- SATA, bowtie/trend, lab table, dosage workspace — **reuse existing question adapters** where present
- Calculator, notes, flag — existing controls
- Setup modal: mirror **current** practice-test configuration fields (timed, count, topics, rationale toggle, resume)

### 1.4 CAT exam UI

- Timed shell, neutral MCQ/SATA selection **without** correctness styling during exam
- Pause overlay, skeleton loading
- Results **after** completion only: outlook band, domains, ability/session stats if available
- **No rationale** in-flight

### 1.5 Flashcards

Frame the **MCQ + rationale** flow (not generic flip cards): stem, 4-up grid, check answer, rationale sections, bookmark/difficult, session chrome.

### 1.6 Lesson hubs

Category grid + tabs + search/country toggle **only where routes already support them**. Premium modules (ECG, labs, OSCE, etc.) as **cards with locked vs unlocked** states matching entitlement gates — **no public `/app` leakage** on marketing pages.

---

## 2) Token & component mapping

| UI role | Prefer these tokens / classes | Avoid |
|--------|-------------------------------|--------|
| Page background | `--semantic-surface`, `--semantic-panel-*` | Raw `#fff` / `#111` only |
| Borders | `color-mix(in srgb, var(--semantic-*) …, var(--semantic-border-soft))` | Ad hoc `#e5e7eb` |
| Primary actions | `--role-cta`, `.bg-role-cta`, `--role-cta-foreground` | Random gradient CTAs |
| Status / data viz | `--semantic-success`, `--semantic-warning`, `--semantic-chart-1`…`5` | Single-hue everything |
| Dashboard bands | `.nn-dash-band`, `.nn-dash-section`, existing learner tokens | New parallel grid system |
| Progress fills | `.nn-progress-fill-semantic-*`, `semanticFillClassForAccuracyPct` | One color for all bars |

**Reference files**

- `nursenest-core/src/app/semantic-status-tokens.css`
- `nursenest-core/src/app/globals.css`, theme palettes (`theme-palettes.css` pattern)
- Learner quick launch: `src/components/student/learner-hub-clinical-quick-launch.tsx`
- Marketing hub modules: `src/components/exam-pathways/exam-pathway-hub-premium-modules.tsx`

---

## 3) Route & surface map (implementation anchors)

| Surface | Primary route(s) | Key components |
|---------|------------------|----------------|
| Dashboard | `/app` | `src/app/(student)/app/(learner)/page.tsx`, `learner-study-home.tsx` |
| Report card | `/app/account/report` (verify truthpack/ui-pages in repo) | Report card VM builders under `src/lib/learner/` |
| Practice exam | Practice test routes under `/app` | `practice-test-runner-client.tsx`, boards |
| CAT | CAT entry routes + runner | `catStartHrefFromPremiumSnapshot`, CAT specs |
| Flashcards | `/app/flashcards` family | Flashcard hub clients |
| Lessons hub | Pathway lesson hubs | Lesson hub shells, clinical modules strip |

*(Exact paths must match shipped routes — reconcile against internal route registry before edits.)*

---

## 4) Cursor implementation plan (phased)

### Phase A — Design lock

- Figma: desktop + mobile + 3 themes for **dashboard** and **one exam shell** (practice OR CAT) as pilot.
- Playwright baseline screenshots (`visual-qa` or dedicated learner pack) **before** CSS churn.

### Phase B — Dashboard slice

- Adjust composition only inside existing `LearnerStudyHome` bands; extend tokens, not new routes.
- Subscription/settings: reuse existing account/settings flows; **no client-only paywall**.

### Phase C — Report card slice

- Visual polish + accessibility; preserve API shapes.

### Phase D — Practice vs CAT semantics

- **No** mixing rationale into CAT runner; reinforce with tests.
- Practice: enrich rationale sidebar / coach strip **only** where components exist.

### Phase E — Flashcards & lesson hubs

- Align card grids to Figma spacing; keep pagination/list safety rules.

### Phase F — Playwright expansion

Add or extend specs under:

- `tests/e2e/` via `playwright.learner-surfaces-smoke.config.ts`, `playwright.config.ts`
- Targeted: `test:e2e:cat-entrypoints`, `test:e2e:learner-surfaces-smoke`

---

## 5) Tests executed (this session)

| Command | Result |
|---------|--------|
| `npm run typecheck:critical` | **PASS** |
| `npm run test:homepage` | **FAIL** — pre-existing failure in `src/lib/theme/site-header-marketing-chrome.contract.test.ts` (`SiteHeader sticky chrome wrapper`). Not introduced by this documentation change. |

### Recommended next commands (when implementing)

```bash
npm run typecheck:critical
npm run test:homepage
npx playwright test -c playwright.learner-surfaces-smoke.config.ts
npx playwright test -c playwright.config.ts tests/e2e/path/to/learner.spec.ts
```

Full `npm run test:e2e` requires Playwright env and may be long-running — use targeted projects first.

---

## 6) Screenshots deliverable (Ocean / Blossom / Midnight)

After implementation slices:

1. Capture via existing visual QA harness or manual Playwright projects.
2. Store evidence paths in PR / `reports/*-FINAL.md` per governance.
3. Attach desktop + mobile per theme for **dashboard** at minimum.

---

## 7) What is **not** done in this commit

- No broad UI rewrite of practice/CAT/flashcards/dashboard (awaits **approved Figma**).
- No schema/API contract changes.
- No new public `/app` exposure for premium modules.

---

## 8) Files changed (this handoff)

| File | Purpose |
|------|---------|
| `docs/planning/learner-layout-redesign-program-2026.md` | Program spec, mapping, plan, test notes |

Implementation PRs should list their own file diffs per slice.
