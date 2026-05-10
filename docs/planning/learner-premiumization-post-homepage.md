# Learner premiumization — post-homepage phases

**Status:** Planning handoff (homepage/public marketing stabilization assumed healthy).

**Intent:** Premium UX refinement across authenticated learner surfaces — **visual hierarchy, usability, perceived educational quality, and consistency** — **without** routing refactors, entitlement changes, or backend rewrites unless explicitly scoped.

---

## Global constraints (non-negotiable)

- **Preserve:** Existing URLs, auth flows, server-enforced entitlements, analytics wiring, SEO conventions for marketing/public routes, and backend contracts.
- **Do not regress:** Homepage / public marketing behavior, cache semantics where already correct, i18n loaders.
- **Brand:** NurseNest wordmark + leaf; DM Sans; theme-aware **semantic tokens** only (`semantic-status-tokens.css`, learner shells); **no** hot pink / fuchsia / magenta product styling.
- **Themes:** Ocean, Midnight, Blossom (and full learner theme picker where applicable) must remain coherent.
- **Aesthetic:** Bright, optimistic, pastel-clinical; premium healthcare education SaaS; calm, study-forward emotion (`nursenest-production-governance.mdc` learner questions apply).
- **Responsive:** Desktop, tablet, mobile; touch targets; overflow discipline.
- **Data / perf:** No unbounded lists on hot paths; respect pagination, lazy boundaries, and existing lesson-library safety rules (`rn-lesson-library-safety.mdc`).

**Design gate:** Prefer **Figma prototypes** (desktop + tablet + mobile; realistic charts, ECGs, analytics; Ocean / Midnight / Blossom) **before** large implementation slices — avoid generic “startup dashboard” templates.

---

## Priority order

1. Learner dashboard + report card  
2. Lessons hub + lesson detail hierarchy  
3. CAT + practice exam premium UX  
4. Flashcards UX  
5. Mobile learner navigation consistency  

---

## Phase 1 — Learner dashboard + report card (+ settings + onboarding surfaces)

### Routes / entry points (verify in repo before redesign)

| Surface | Typical route | Notes |
|--------|----------------|--------|
| Dashboard | `/app` | `src/app/(student)/app/(learner)/page.tsx`, `LearnerDashboardPageShell`, `premium-dashboard-snapshot` |
| Report card | `/app/account/report` | `LearnerReportCardRouteBody` |
| Settings | `/app/account/settings` | Existing account settings layout |
| Onboarding / planning | e.g. `/app/exam-plan`, `/app/quick-start`, `/app/start-studying` | Tie dashboard goals to optional-home UI without new parallel flows |

### Learner comprehension goals

Immediate clarity on: **readiness**, **weak vs strong systems**, **next actions**, **exam countdown**, **study consistency**, **pass probability / trajectory**, **what to study next**.

### Component targets (incremental; map to existing data first)

- Readiness score card  
- Exam date countdown  
- Study streak  
- Today’s study plan (or honest empty state)  
- Weak-area emphasis / heatmap (bounded data)  
- Strong-area summary  
- Recommended next lesson / next CAT / practice (respect entitlements)  
- Progress rings / charts (semantic multi-hue charts — not “all primary”)  
- Recent activity timeline (bounded)  
- Study hours / pacing  
- Mastery breakdown by body system  
- Quick resume CTAs  
- Adaptive insights (reuse existing adaptive APIs; no parallel scoring product)  
- Benchmark vs peers: **future-safe** optional slot only if data exists — otherwise omit or “coming” pattern without fake metrics  

### Settings (`/app/account/settings`)

- Cleaner section hierarchy  
- Exam goal / date editing (existing mutations only)  
- Theme / language / region consistency with marketing + learner shells  
- Subscription / billing entry (existing Stripe/account flows)  
- Accessibility + notification prefs where supported  

### Report card (`/app/account/report`)

Premium analytics **feel**: clinically styled cards, pass probability, category readiness, trends, pacing, percentile/benchmark visuals — **only with real or explicitly labeled sample data**; no fabricated cohort stats.

### Phase 1 engineering notes

- Prefer **composition** of existing learner primitives (`LearnerSurfaceCard`, telemetry strips, semantic badges) over new parallel design systems.  
- Server components first; small interactive islands for charts/streaks.  
- Extend Playwright learner smoke + visual audits incrementally (dashboard + report first).

---

## Phase 2 — Lessons hub + lesson detail

- Category-first navigation; cleaner cards; stronger typography and spacing; better mobile stacking.  
- Reduce noisy metadata on list cards; one lesson body per detail route.  
- Distinct visual treatment for lesson content bands (pathophysiology, diagnostics, labs, meds, pearls, exam tips, cases) using **existing semantic lesson tokens** where possible.  
- **Performance:** Keep pagination / lazy loading; no full-catalog client renders.

---

## Phase 3 — CAT + practice exams

**CAT:** Minimal chrome, exam-realistic NCLEX-style shell; all item types supported as today; polished timer, progress, question nav; keyboard + mobile-safe interactions; theme-compatible.

**Practice exams:** Shared premium shell with CAT **but** tutoring/study affordances: rationale mode, distributions, confidence, weak-area coaching, remediation links, settings, analytics — without breaking CAT “exam mode” semantics.

---

## Phase 4 — Flashcards

Question-first cards; rationale reveal; optional images; mastery/confidence; spaced-repetition **feel**; bookmarks; fast next-card flow; premium hierarchy on mobile.

---

## Phase 5 — Mobile learner nav + consistency

Audit `/app/**` for duplicated controls, overflow, sticky header/footer issues, contrast under Midnight, button hierarchy. Align mobile nav patterns with canonical learner shell — **no second nav system**.

---

## Testing / QA (before merge)

- `npm run test:homepage`  
- `npm run typecheck:critical`  
- Targeted **Playwright learner** suites (extend visual/theme/mobile/no-overflow smoke as phases land).  
- Guardrails: no placeholder/i18n leakage on learner dashboard/report smoke paths.

---

## Suggested execution model

1. **Design slice:** Figma frames for Phase 1 (dashboard + report + settings sections).  
2. **Implementation slice:** Dashboard hero + readiness strip first PR; report card second; settings third — each PR green on tests above.  
3. Repeat pattern for Phases 2–5.

---

## Related docs

- `docs/ecosystem-design-system-convergence.md` — primitives registry  
- `.cursor/rules/nursenest-production-governance.mdc` — learner emotional UX  
- `.cursor/rules/semantic-color-guardrails.mdc` — chart/status hues  
- `docs/i18n/fr-es-global-canada-copy-follow-up.md` — marketing locale parity (orthogonal; learner shards still need discipline when copy changes)
