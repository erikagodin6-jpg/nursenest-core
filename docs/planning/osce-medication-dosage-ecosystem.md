# OSCE + medication dosage ecosystems — integration plan

**Status:** Planning / design handoff (no mandatory product code in this document)  
**Aligns with:** `.cursor/rules/ecosystem-platform-guardrails.mdc`, `docs/ecosystem-design-system-convergence.md`, [`lab-values-educational-depth.md`](./lab-values-educational-depth.md), `docs/planning/adaptive-case-study-ecosystem.md`

NurseNest already contains **learner-integrated** surfaces for both domains. This document maps **current code** to the premium vision, lists **gaps**, and defines **Figma deliverables** + **implementation phases** without forking nav or creating mini-apps.

---

## 1. Current state (audit summary)

### 1.1 Medication dosage calculation

| Area | Implementation |
|------|----------------|
| **Routes** | `/app/med-calculations`, `/app/med-calculations/[category]/[slug]` — same hub → lesson pattern as Labs. |
| **Content engine** | `src/lib/med-calculations/med-calculations-engine.ts` — categories: tablets, liquids, IV flow, IV pump, weight-based, pediatric, gtt/min, reconstitution, insulin, heparin. |
| **Realism** | `validate-med-math-answer-realism` used to keep numeric answers clinically plausible. |
| **Track typing** | `MedCalcTrack` = `rn` \| `pn` \| `np` today — **allied** path not in type yet (extend with product approval). |
| **Study loops** | `buildMedCalcStudyLinks` → flashcards, question bank, CAT, `/app/medication-drills`. |
| **UI** | `MedCalculationsHubPage`, `MedCalculationsLessonPage`, `nn-learner-page-hero`, semantic surfaces. |
| **Report card** | `MedCalcReportCardInset` — **browser localStorage** summary; explicitly notes future sync to server-backed analytics. |

### 1.2 OSCE / clinical skills

| Area | Implementation |
|------|----------------|
| **Routes** | `/app/osce`, `/app/osce/[stationId]` — gated by `resolveOsceScenarioRouteAccessMode` + feature flags. |
| **Nav** | `learner-primary-nav.ts` appends OSCE when `isOsceScenariosPubliclyEnabled()`. |
| **UI shell** | `ScenarioStudyShell`, `OscePrepSurfaceClient`, station cards, checklist, rationale panel — **reuse scenario primitives**. |
| **Marketing** | Pathway OSCE pages under marketing `[locale]/[slug]/[examCode]/osce/`. |
| **Content** | Legacy stations when resolved; dev samples else — subtitle documents planned timed/checklist/reflection layers. |
| **Branching** | Not yet a full graph engine; **`docs/planning/adaptive-case-study-ecosystem.md`** defines branching runtime concepts to reuse (nodes/edges, no fake branching). |

### 1.3 Dashboard / adaptive / report card

| Area | Notes |
|------|--------|
| **Adaptive** | `LearnerAdaptiveRecommendationsSection`, study-plan API, weak topics — extend topic keys / bundles for `osce_*` and `med_math_*` when analytics exist. |
| **Report card** | Account report card surfaces + `MedCalcReportCardInset`; **no OSCE-specific mastery inset yet**. |

---

## 2. Product positioning (guardrails)

- Both ecosystems are **premium adaptive readiness** inside NurseNest — **not** separate brands, spreadsheet tools, or isolated calculators.
- **Themes:** expression-only (Aurora / Ocean / Garden / Midnight); **no** layout or nav forks — see ecosystem guardrails §6.
- **Primitives:** compose from shared vocabulary (`ClinicalPanel`, `ScenarioTimeline`, `MasteryProgressBand`, `RationaleDrawer`, etc.) — map to existing components first (`docs/ecosystem-design-system-convergence.md` §3).

---

## 3. Gaps vs target vision

| Requirement | Gap |
|-------------|-----|
| OSCE branching + emotional arcs | Needs **case graph runtime** + authored content (see adaptive case-study doc); avoid MC-only “fake dialogue.” |
| OSCE mastery on report card | Add **metrics + inset** parallel to med-calc when persistence exists. |
| Med math + labs/telemetry | Cross-link from relevant lessons/scenarios (content + UI strips), not duplicate engines. |
| Allied / New Grad explicit tiers | OSCE shell already gates non-nursing pathways; med-calc **track enum** may need allied + pathway overlays. |
| Server-synced med math progress | Replace or supplement localStorage with DB-backed attempts when schema approved. |
| Homepage marketing | Add **modules** (scenario teaser, dosage challenge) without new IA — fit existing marketing hero/section patterns. |

---

## 4. Figma deliverables (frame list)

Design can mirror **Labs / dashboard** density and **semantic tokens** only.

| # | Deliverable | Suggested frames |
|---|-------------|------------------|
| 1 | OSCE hub | Desktop/tablet/mobile — station grid, category filter, “continue” strip, pathway badge. |
| 2 | OSCE scenario | Dialogue / choice rail + `ScenarioTimeline` + vitals/labs dock + `RationaleDrawer`. |
| 3 | OSCE mobile | Single-column choice stack, sticky escalation CTA, readable checklist. |
| 4 | Dosage hub | Category tiles aligned to engine slugs (§1.1); hero + mastery chips. |
| 5 | Dosage interaction | Step workspace + hints + `NGNDecisionPanel`-style safety gates + units strip. |
| 6 | Dashboard/report card | Med inset + **future** OSCE inset + adaptive row — one scroll story. |
| 7 | Homepage | Three cards: OSCE preview, dosage challenge, readiness — reuse marketing card primitives. |
| 8 | Themes ×4 | Duplicate key frames; swap only glow/surface/chart expression. |

**Export:** PNG/WebP from Figma for PR attachments; no raw hex in specs — reference CSS variables.

---

## 5. Implementation phases (engineering)

**Phase A — Visual premium pass (no schema)**  
- Elevate `MedCalculationsHubPage` / lesson chrome toward layered panels + `MasteryProgressBand` styling (tokens only).  
- OSCE: enrich `ScenarioStudyShell` station detail with correlation strips when content exists.

**Phase B — Integration wiring**  
- Dashboard quick links / adaptive bundle: add **topic hooks** for med math + OSCE when backend topics exist.  
- Report card: OSCE inset mirroring `MedCalcReportCardInset` pattern (local or server snapshot).

**Phase C — Branching OSCE**  
- Implement subgraph runtime per `adaptive-case-study-ecosystem.md`; reuse `ExamSessionShell` / NGN renderers; **no** second nav.

**Phase D — Analytics**  
- Persist attempts; feed weak-area and readiness — **requires explicit schema/product sign-off**.

---

## 6. Validation checklist

- Typecheck / lint on touched packages.  
- Mobile horizontal overflow on `/app/med-calculations`, `/app/osce`.  
- Theme readability ×4.  
- Med math: regression tests for `validate-med-math-answer-realism` + category inventory tests (extend `med-calculations-engine` tests if categories grow).  
- No hot pink / raw hex in new TSX (follow `semantic-color-guardrails`).  
- Routes: keep canonical URLs; feature flags control rollout, not duplicate paths.

---

## 7. Related files (quick reference)

- Med calc: `med-calculations-engine.ts`, `med-calculations-route-loader.ts`, `med-calculations-hub-page.tsx`, `med-calculations-lesson-page.tsx`, `med-calc-report-card-inset.tsx`  
- OSCE: `osce/page.tsx`, `osce/[stationId]/page.tsx`, `osce-prep-surface-client.tsx`, `ScenarioStudyShell`, `learner-primary-nav.ts`  
- Adaptive case / branching: `docs/planning/adaptive-case-study-ecosystem.md`  
- Ecosystem: `docs/ecosystem-design-system-convergence.md`  
- Canonical learner nav: `src/lib/navigation/learner-primary-nav.ts`  
- Report card composition: `src/app/(student)/app/(learner)/account/_lib/learner-report-card-route.tsx`, `account/progress/page.tsx`  
- Dashboard quick links: `src/components/student/learner-study-quick-links-card.tsx`  
- Study tools index: `src/components/study-tools/study-tools-activity-shell.tsx` (`medCalculations` entry → `/app/med-calculations`)

---

## 8. Ecosystem placement matrix (cohesive expansion)

Goal: OSCE + dosage feel like **the same NurseNest product** as Labs, ECG, CAT, and dashboard — shared shells, tokens, nav, spacing — not bolt-on tools.

### 8.1 Homepage (marketing)

| State | Notes |
|-------|--------|
| **Existing** | Pathway-specific OSCE orientation copy exists (e.g. UK international RN hub — `international-rn-hub-sections.tsx`); Australia hub links OSCE topic pages. |
| **Gap** | Global / country home does not yet carry a **unified** “readiness ecosystem” strip pairing **OSCE + dosage + med safety** with the same card language as the homepage redesign. |
| **Placement pattern** | Add **one** horizontal band or trio of **preview cards** (OSCE simulation, dosage challenge, communication readiness) using marketing card primitives — same radius, shadow, and semantic accents as lesson/CAT promos. **i18n keys** for all copy. |
| **Messaging anchor** | “Prepare for real clinical judgment and bedside readiness” — implement via `copy.json` / marketing shards per i18n policy. |

### 8.2 Lesson hubs (RN / PN / NP / Allied / New Grad)

| Do | Don’t |
|----|--------|
| Surface OSCE + med calc as **pathway-aware “readiness” rows** or **next-step modules** tied to the learner’s exam/specialty context. | Dump extra tiles into dense lesson grids or isolated tabs that break hub scan patterns. |
| Deep-link to `/app/osce` and `/app/med-calculations` with **pathway query** where shells already support it. | Create parallel hub URLs for the same content. |

**Insertion strategy:** Follow **category / body-system** grouping already used in scenario surfaces (`getPathwayBodySystemGroups`) — place “Clinical & communication readiness” and “Medication safety math” as **named sections**, not random order.

### 8.3 Dashboard + report card

| Surface | Current wiring | Expansion |
|---------|----------------|------------|
| **Report card route** | `LearnerReportCardRouteBody` renders `MedCalcReportCardInset`, `StudyToolsReportCardInset`, `LearnerStudyQuickLinksCard`, `LearnerReportCardPremium`, weak-topic cross-links. | Add **`OsceReportCardInset`** (or shared **ScenarioReadinessInset**) **when** progress signals exist — mirror med-calc inset pattern (token-bordered aside, CTA to `/app/osce`). |
| **Progress page** | Also mounts `MedCalcReportCardInset`. | Same OSCE inset when data exists. |
| **Adaptive** | `LearnerAdaptiveRecommendationsSection` + study-plan API. | Extend **topic keys** / bundle builders for `med_math_*` and `osce_*` weak domains — **no** duplicate recommendation engine. |

**Dashboard feel:** Use **multi-hue** mastery and weakness bands (`semantic-chart-*`, `MasteryProgressBand` vocabulary) — avoid generic analytics gray.

### 8.4 Practice + CAT ecosystem

- **Remediation:** Weak dosage → pathway-scoped links to `/app/med-calculations` + `/app/medication-drills` (already in `STUDY_TOOL_ROUTES`). Weak communication / judgment → OSCE or clinical scenarios when flags enable.
- **CAT:** Reuse existing study-loop CAT resolution (`resolveStudyLoopCatHref`, `TrackedStudyLoopCatLink`) — do not fork CAT entry URLs.

### 8.5 Case-study / branching simulations

- Embed dosage checks and communication nodes inside the **same case graph** described in `adaptive-case-study-ecosystem.md` — shared **ScenarioTimeline** / vitals panels — not a second simulation chrome.

### 8.6 Flashcards + rapid reinforcement

- Med calc flashcards already generated per lesson — link from hub + weak-area CTAs.
- OSCE: short **communication drills** as scenario-derived decks or linked checklist reviews — reuse flashcard **shell** styling, not a new flip-card app.

### 8.7 New Grad / specialty pathways

- Express specialty (ICU, ER, peds, etc.) via **pathwayId + content tags** on scenarios and dosage scenarios — **same routes**, overlays in content/engine — not separate `/app` trees.

### 8.8 Mobile

- Touch targets ≥ 44px on scenario choices and dosage keypad paths; single-column **ScenarioTimeline**; readable numeric inputs — extend existing mobile learner specs (`tests/e2e/mobile/…`) when new sections ship.

### 8.9 Theme alignment

- **Midnight:** immersive OSCE / high-stakes dosage practice; **Ocean:** default teaching; **Garden:** lower-stress rehearsal; **Aurora:** optimistic marketing + learner harmony — **expression only**, per `.cursor/rules/ecosystem-platform-guardrails.mdc`.

### 8.10 Shared primitives (enforcement)

Reuse anchors from `docs/ecosystem-design-system-convergence.md` §3 — **ClinicalPanel**, **ScenarioTimeline**, **AdaptiveRecommendationRail**, **RationaleDrawer**, **MasteryProgressBand**, **QuestionShell** — implement as **composition** over `ScenarioStudyShell`, `LearnerSurfaceCard`, `nn-learner-page-hero`, dashboard sections.

---

## 9. Figma + export checklist (deliverables 1–11)

| # | Deliverable | Figma / asset notes |
|---|-------------|---------------------|
| 1 | Homepage marketing mockups | Trio of cards + readiness band; 4 theme variants; align with global marketing intro spacing. |
| 2 | Lesson-hub integration | Per-pathway wireframes showing **one** readiness section placement (not grid clutter). |
| 3 | Dashboard/report card | Hero + quick links + **dual inset** (med + OSCE) + adaptive row — same card language as Labs redesign. |
| 4 | OSCE simulation | Scenario shell + timeline + choice rail — Midnight + Ocean frames. |
| 5 | Dosage calculation | Hub + step workspace + safety callout — token-only specs. |
| 6 | Mobile layouts | 390px width frames; sticky CTAs. |
| 7 | Theme-aware variants | Duplicate §1–6 across Aurora/Ocean/Garden/Midnight (expression swap only). |
| 8 | Shared primitive guidance | Component names match convergence doc §3. |
| 9 | Export-ready assets | PNG/WebP for PRs; no hex in handoff — CSS variable names. |
| 10 | Ecosystem placement documentation | **This file** + `ecosystem-design-system-convergence.md`. |
| 11 | Implementation reports | Per-PR verification docs under `docs/qa-reports/` or PR bodies — mobile + theme + report-card smoke. |

---

## 10. Design cohesion mantra

One **learner shell**, one **nav grammar**, one **token system**, one **adaptive story** — OSCE and dosage are **modalities** of the same clinical readiness platform, not separate products.

---

*Grounded in repo audit May 2026. Update when OSCE graph engine, OSCE report inset, or homepage readiness band ships.*
