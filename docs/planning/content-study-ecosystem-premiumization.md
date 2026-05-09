# Content + study ecosystem premiumization (Phases 6–12)

**Status:** Planning handoff — follows learner surface premiumization (`learner-premiumization-post-homepage.md`).

**Intent:** Elevate **perceived educational authority**, **clinical realism**, **linked learning**, and **adaptive intelligence** without replacing core architecture or source-of-truth systems.

---

## Global constraints (non-negotiable)

- **Preserve:** `PathwayLesson` / canonical lesson payloads, current lesson JSON shape, linked-learning graph architecture, catalogs and parity systems, entitlements, pagination/lazy loading (`rn-lesson-library-safety.mdc`).
- **Do not:** Rewrite ingestion pipelines, invent parallel lesson stores, or ship unbounded full-catalog renders on hot paths.
- **Brand / UI:** NurseNest leaf + wordmark; DM Sans; **semantic tokens only** (`semantic-status-tokens.css`); Ocean / Midnight / Blossom; no hot pink / fuchsia / magenta product chrome.
- **Tone:** Premium clinical education — calm, authoritative, intelligent (`nursenest-production-governance.mdc` learner questions).
- **Performance:** Keep builds and runtime within existing memory/budget constraints; no giant eager lesson hydration.

**Design gate:** Figma-first for lesson detail layouts, adaptive UX, and clinical visuals (desktop / tablet / mobile; realistic labs / ECG / vitals; theme previews).

---

## Phase 6 — Premium lesson content system

### Goal

Every lesson reads as **premium nursing/clinical education**, not lightweight blog copy — **within existing JSON** (presentation + editorial polish, not schema forks).

### Canonical pedagogy sections (target hierarchy)

1. Overview / why it matters  
2. Pathophysiology (deepest section)  
3. Risk factors  
4. Signs & symptoms  
5. Diagnostics  
6. Labs / imaging  
7. Treatments  
8. Medications  
9. Nursing interventions  
10. Client education  
11. Clinical pearls  
12. Exam tips  
13. Case study / scenario  
14. Linked learning  
15. Key takeaways  

*Map sections to existing pathway lesson blocks where they exist; empty sections stay absent — no filler.*

### Presentation improvements

- Visually distinct clinical sections (reuse lesson semantic bands / `LearnerSurfaceCard`-style patterns).  
- Spacing, cards, callouts; improved tables/charts using token-based semantics.  
- Warning / info / success clinical states (semantic hues, not single-brand wash).  
- Medication and lab interpretation cards; expandable media where assets exist.  
- **Mobile readability first** (typography scale, tap targets, overflow discipline).

---

## Phase 7 — Linked learning ecosystem

### Goal

Strengthen **lesson →** flashcards, CAT, practice exams, adaptive review, related systems, pharmacology, case studies — with clearer UX and honest relationships.

### UX targets

- Cleaner linked-learning cards and “Study next” rail.  
- Prerequisite / related-concept surfacing (data-driven only).  
- Weak-area remediation suggestions (from real signals, not copy-only).  
- Cross-system relationships visible without cluttering the lesson body.

### Example (illustrative)

A heart failure lesson should **surface** related study objects when the graph/catalog provides them: preload/afterload, ACE inhibitors, rhythm interpretation, pulmonary edema, renal perfusion, fluid balance, NCLEX priorities — **no synthetic links**.

---

## Phase 8 — Clinical realism + visual quality

### Domains

ECGs, vitals, lab panels, telemetry, scenarios, med labels, charting snippets, case-study visuals.

### Standards

- Medically plausible values and ranges; believable deterioration/improvement arcs.  
- ECG: rhythm spacing, labels, monitor framing; theme-aware dark clinical panels where applicable.  
- Labs: realistic CBC/CMP-style layouts; abnormal highlighting; interpretation callouts.  
- Avoid generic stock-photo aesthetics; prefer schematic/clinical illustration discipline.

*Validation:* snapshot/visual regression where feasible; content review for egregious inaccuracies.

---

## Phase 9 — Adaptive study + readiness

### Goal

Make personalization feel **clinically meaningful** — not generic productivity tips.

### UX surfaces (reuse existing adaptive APIs)

- “Focus next on…”  
- Readiness trends and category-level readiness  
- Confidence / probability displays (**honest labels**, no fabricated cohorts)  
- Adaptive queue and remediation loops  

### Guardrails

Recommendations must cite **real mastery / attempt / pathway signals**. Avoid parallel scoring products or client-only “intelligence.”

---

## Phase 10 — Trust + authority

### Signals

Editorial / medically reviewed indicators, update timestamps, evidence/guideline alignment (where product commits), reference hygiene (e.g. APA-style blocks), contributor/reviewer surfaces.

### Rules

- No fake reviewers or timestamps.  
- Align copy with legal/editorial policy; cite sources only when curated.

---

## Phase 11 — Blog + SEO premiumization

### Goal

Articles reinforce **authority** and funnel into lessons / tools / study modes without diluting clinical credibility.

### Requirements

- Strong medical formatting and hierarchy; reduce generic “AI blog” patterns.  
- Embedded lesson links and study CTAs: “Study this topic”, practice, related lessons, flashcards, CAT readiness — **bounded** and entitlement-aware.  
- Category hubs; localized SEO readiness aligned with i18n architecture (`docs/i18n-architecture.md`).

---

## Phase 12 — New grad + specialty paths

### Goal

Expand **unit/specialty** study surfaces (ICU, ER, Peds, PICU/NICU, CICU, Neuro ICU, Med-Surg, LTC, community, OR, heme-onc, dialysis, clinics) as **pathway overlays**: dashboards, readiness, shift-survival guides, prioritization scenarios, specialty plans — **without forking the ecosystem** (`ecosystem-platform-guardrails.mdc`).

### Constraints

Reuse canonical navigation and learner shells; no isolated mini-apps.

---

## QA / testing

Extend over time:

- Placeholder / i18n leakage checks on lesson and blog surfaces.  
- Linked-learning integrity (broken IDs, entitlement mismatches).  
- ECG/lab visual snapshots where automated.  
- Dark/light readability and mobile overflow audits on lesson detail.  
- Adaptive recommendation smoke (server-backed paths).  

**Always maintain:** `npm run test:homepage`, `npm run typecheck:critical`, targeted Playwright suites, content/source-of-truth audits as applicable.

---

## Execution model

1. **Content inventory:** Map existing lesson section keys to the Phase 6 pedagogical outline; identify gaps per pathway (documentation-only gap matrix first).  
2. **Design:** Figma for lesson detail template + linked-learning rail + clinical widgets.  
3. **Implement in slices:** Template/CSS/component polish → linked-learning cards → adaptive copy/surfaces → blog CTAs → specialty shells — one vertical slice per PR where possible.

---

## Related documentation

- `docs/planning/learner-premiumization-post-homepage.md` — learner UI phases  
- `docs/ecosystem-design-system-convergence.md`  
- `.cursor/rules/rn-lesson-library-safety.mdc`  
- `.cursor/rules/ecosystem-platform-guardrails.mdc`  
- `docs/i18n/fr-es-global-canada-copy-follow-up.md` — locale parity for marketing copy (blog/locale work should stay coordinated)
