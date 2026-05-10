# Adaptive branching case-study ecosystem — architecture & delivery plan

This document satisfies deliverables **9–11** from the master brief: branching architecture guidance, token/style guidance, and an implementation-oriented report. It is grounded in a read-only audit of the current NurseNest codebase (January 2026).

---

## 1. Codebase audit (current state)

### 1.1 What exists today

| Area | Finding |
|------|---------|
| **Marketing case studies** | `/case-studies` uses `clinical-case-studies.json` + `CaseStudiesPageClient`: static vignettes, single MCQ, correct/incorrect takeaway — **not** branching or adaptive. |
| **Practice / CAT** | `PracticeTestRunnerClient` + `ExamSessionShell` + `ExamStudyThemeProvider`: strong **exam-style shell**, NGN-capable item rendering (e.g. `BowtieQuestionRenderer`), pathway-aware test config, entitlement at route level (`resolveEntitlementForPage`). |
| **NGN item UI** | Bowtie adapter/renderer wired into practice runner and question bank client — reuse for matrix/SATA/drag-drop style interactions inside cases. |
| **Themes** | Canonical ids in `src/lib/theme/theme-registry.ts` (`THEME_OPTIONS`); launch atmospheres include **Blossom**, **Midnight**, **Ocean**, **Forest**; **Sage Garden** exists as a named “garden” atmosphere. Session-scoped exam themes via `data-theme` on `.nn-exam-session` (`exam-study-theme-context.tsx`). |
| **Semantic UI** | `semantic-status-tokens.css`, `semantic-progress-fill.ts` — use for vitals bands, outcome states, readiness (no ad-hoc hex in product UI per project rules). |
| **Entitlements** | Server-side `resolveEntitlementForPage` + paywall surfaces; `isEntitled` props on heavy learners — **preserve** for any premium case feature. |
| **Pathway / occupation** | Dashboard and layout load `learnerPath`, `alliedProfessionKey` from user — hooks for occupation-aware filtering and copy. |

### 1.2 Gaps vs target vision

- No **graph-based case engine** (branching state machine + content versioning) in app code.
- No **persistence model** for simulation runs, multiple endings, or cumulative decision traces (would require an explicit schema/feature design — out of scope unless approved).
- Marketing “case studies” **must not** be confused with the premium adaptive product; new routes should live under learner app with clear naming (e.g. `/app/simulations` or `/app/case-simulations`) once specified.

---

## 2. Branching case engine — architecture

### 2.1 Core concepts

1. **Case definition (content)** — Versioned JSON (or DB rows) describing:
   - **Metadata**: pathway ids, occupation tags, tier complexity, blueprint/domain tags, minimum interaction count policy.
   - **Stages** (≥5): map to intro → assessment → interpretation → intervention → monitoring → resolution (your six phases can map onto five **major** stages with substeps).
   - **Nodes**: each node = one **screen** with patient narrative delta, vitals/labs/telemetry snapshot ids, and **edges** (choices / NGN item refs).
   - **Edges**: labeled transitions; each edge references **condition** (optional): prior decision tags, score thresholds, randomness (avoid for licensure prep — prefer deterministic + seeded remediation).
   - **Terminal nodes**: improvement, stabilization, delayed harm, escalation, ICU, rapid response, discharge, education failure, etc.

2. **Runtime state** — For each learner session:
   - `caseId`, `version`, `currentNodeId`
   - `decisionLog[]`: `{ nodeId, edgeId, timestamp, itemResponses }`
   - `derivedTags[]`: e.g. `delayed_recognition`, `appropriate_escalation` (for analytics)
   - **No fake branching**: graph must allow **multiple sinks**; convergence only where clinically justified (document in content QA).

3. **Interaction budget** — “≥75 interactions” is a **content contract** per pathway instance:
   - Count **decision points + required NGN item submits + mandatory review steps**; substeps within a stage count if they require learner action.
   - Engine should expose `interactionIndex` / `totalEstimated` for progress UI.

### 2.2 Adaptive behavior (non-cheesy)

- **Remediation subgraph**: wrong-but-safe paths attach **short teaching loops** (extra nodes) before rejoining a **stability checkpoint** — rejoin must not erase consequences (carry forward tags).
- **Difficulty**: tier + occupation select **initial vitals spread**, **medication list density**, and **NP-only management nodes** (content flags, not separate apps).

### 2.3 Integration strategy (avoid isolated silos)

| Layer | Reuse |
|-------|--------|
| **Shell** | Wrap flows in `ExamSessionShell` + `ExamStudyThemeProvider` for parity with CAT/practice **chroming**; `examMode` could be `"practice"` or a new enum value only if CSS needs it — prefer existing modes first. |
| **Items** | Delegate stimulus to existing question components (`BowtieQuestionRenderer`, SATA/matrix when present) via **adapter** that maps case node → existing normalized payload types. |
| **Telemetry / labs / ECG** | Compose existing **read-only** clinical widgets (same components as labs/ECG redesigns) fed by **case node payloads**, not duplicate UIs. |
| **Progress** | Link to pathway completion + domain tags already used in dashboard/report card — extend with `simulation_mastery` metrics in analytics layer later. |

### 2.4 Data loading

- **Hot path**: never ship full case library; **one case graph per request** with pagination for hub lists (`take` + cursor per global constraints).
- **Large JSON bodies**: lesson-library rules apply — case **list** cards stay lightweight; full graph loads **after** case start.

---

## 3. Tier × occupation matrix (content rules)

| Persona | Emphasis in graph weights |
|---------|---------------------------|
| **RN** | Full NCJMM loop, delegation, telemetry, pharmacology + lab interpretation nodes. |
| **PN/RPN** | Bedside execution, escalation cues, scope-appropriate actions; fewer diagnostic ordering nodes. |
| **NP** | Diagnostic reasoning, plan revision, advanced pharm / differential-heavy interpretation stages. |
| **Allied** | Profession-specific subgraphs (RT, lab, imaging, OT/PT, EMS) — **separate root templates**, shared shell only. |
| **New grad** | Unit-context overlays (ICU, ER, tele, etc.) — **scenario skins** + staffing/charting prompts; same engine. |

---

## 4. Theme & token alignment

- **Do not** introduce simulation-only branding; NurseNest logo + **DM Sans** + existing nav patterns.
- **Midnight**: use `data-theme="midnight"` on simulation shell for flagship immersive mode; validate contrast on telemetry strips (`semantic-*` tokens).
- **Marketing names**: align UI picker labels with `THEME_OPTIONS` (**Blossom**, **Midnight**, **Ocean**, **Forest**). “Garden” maps to **Sage Garden** (`sage-garden`). If marketing uses “Aurora,” map explicitly to an existing theme id in copy specs — do not invent a new palette without design sign-off.
- **Forbidden**: hot pink as dominant accent; muddy gradients; serif/editorial overrides.

---

## 5. Figma deliverables — frame list & specs

Build **six boards** (desktop 1440×900 baseline; mobile 390×844).

### Board A — Case study hubs (`/app/...`)

- Header: pathway filter, occupation filter, tier badge, search.
- Sections: Continue simulation, Recommended (adaptive), Browse by specialty, Mastery summary strip.
- Cards: title, patient acuity chip, est. time, outcome variance tag (“multiple endings”), domain tags.
- **Variants**: Ocean / Midnight / Sage Garden — same layout, swapped semantic accents.

### Board B — Case introduction

- Handoff narrative + report sheet panel + mini telemetry strip + objectives list + primary CTA “Enter unit.”

### Board C — Active case flow

- Three-column **workstation**: left timeline/story; center vitals + waveform placeholder; right MAR/labs stack.
- Bottom: branching choices + embedded **NGN panel** (bowtie/matrix placeholder).
- Show **state chip**: e.g. “Early deterioration — RR rising.”

### Board D — Branching outcomes

- End screens: stabilization, rapid response, ICU transfer, discharge teaching failure, etc. — each with **different hero tone** using semantic success/warning/danger tokens.

### Board E — Mobile

- Single column; sticky vitals bar; bottom sheet for labs/MAR; large touch targets (min 44px).

### Board F — Dashboard & homepage

- Dashboard: simulation mastery ring, weak domains, next recommended case.
- Homepage (marketing): hero + three pillars (adaptive branching, NGN judgment, telemetry/labs integration) — reuse existing marketing typography classes (`nn-marketing-h*`), no new shell.

**Export**: PNG @2x per frame + optional PDF for stakeholders.

---

## 6. Implementation roadmap (recommended phases)

| Phase | Scope |
|-------|--------|
| **P0** | Case graph schema (TypeScript types + validator), headless state machine unit tests, single **vertical slice** case (≥75 interactions storyboarded in content tool). |
| **P1** | Hub page + run page inside learner shell; entitlement gate; telemetry/labs composed from shared widgets. |
| **P2** | Occupation/pathway filters; analytics events; remediation subgraphs. |
| **P3** | Scale content pipelines (batch import, QA for branching integrity). |

---

## 7. Validation checklist (from brief)

- `pnpm` / turbo **typecheck** on touched packages.
- Responsive breakpoints for hub + run + outcomes.
- Branching tests: multiple sinks, no accidental single-ending graphs.
- Entitlement: locked state matches practice-tests patterns.
- Theme: Midnight readability on waveforms and lab rows.
- No hardcoded neon pink accents.

---

## 8. Truthpack note

`.vibecheck/truthpack/` was **not present** in this workspace clone. Before shipping routes, tiers, or marketing copy, regenerate or sync truthpack and reconcile **routes**, **product tiers**, and **copy** with those files.

---

## Document control

- **Owner**: Product + platform engineering
- **Related code**: `ExamSessionShell`, `practice-test-runner-client.tsx`, `bowtie-question-renderer.tsx`, `theme-registry.ts`, `semantic-status-tokens.css`
