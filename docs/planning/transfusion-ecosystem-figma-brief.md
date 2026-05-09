# Figma brief — premium Blood Transfusion + transfusion reaction ecosystem

**Status:** Design handoff + implementation guardrails  
**Product authority:** `docs/planning/transfusion-clinical-readiness-ecosystem.md`  
**Engineering authority:** `.cursor/rules/ecosystem-platform-guardrails.mdc`, `.cursor/rules/transfusion-clinical-readiness.mdc`  
**Visual system:** `nursenest-core/src/app/semantic-status-tokens.css`, `theme-palettes.css` / `[data-theme]`

This document defines **what to design in Figma** and **how it must connect** to the existing NurseNest learner product so transfusion content feels like **one premium adaptive clinical safety system** — not a separate app, ATI-style wall of text, static policy page, or generic CE module.

---

## 1. North star (what it must feel like)

- **Premium adaptive transfusion safety and clinical judgment training** — immersive, clinically intelligent, emotionally engaging, adaptive, theme-aware, **fully inside** the NurseNest clinical readiness platform.
- **Not:** a static nursing checklist, simple review page, generic CE module, or disconnected “blood administration tool,” enterprise EHR, or static policy document.

**Emotional + cognitive goals:** confidence at the bedside, calm under deterioration, clear prioritization, pattern recognition, escalation fluency, NGN-style reasoning — not memorization theatre.

---

## 2. Brand and layout non-negotiables

| Preserve | Do not |
|----------|--------|
| NurseNest **leaf** logo, **wordmark** | Sub-brands, “Transfusion Pro” lockups, alternate marks |
| **DM Sans** for product UI | Serif body, decorative display faces for primary reading |
| **Shared global navigation** and learner nav patterns | Duplicated nav systems, transfusion-only top bars |
| **Shared learner shells** (e.g. `nn-learner-page-hero`, hub cards, study surfaces) | Isolated frame systems that do not map to app components |
| **Semantic status tokens** (success / info / warning / danger, multi-hue charts) | Hot pink, muddy gradients, monochrome “everything is primary” |
| **EHR-adjacent clarity** only where it serves learning — not full EHR chrome | Dense enterprise table-first EHR mimics as the default |

**Content depth (visual support):** pathophysiology, reaction differentiation, deterioration, thresholds, bedside judgment, specialty readiness — **visually** through hierarchy, panels, and scenario state — not a long undifferentiated scroll.

---

## 3. Theme alignment (Aurora, Ocean, Garden, Midnight)

**Rules:** Same layout structure, typography scale, spacing rhythm, navigation, and shell structure across themes. Themes **only** express: glow hue, surface tint, chart accent emphasis, atmospheric lighting/background treatment.

| Theme | Experiential note (for Figma notes / variables) |
|-------|-----------------------------------------------|
| **Aurora** | Optimistic, premium study energy |
| **Ocean** | Premium educational calm |
| **Garden** | Supportive, lower-arousal confidence |
| **Midnight** | Immersive ICU / transfusion monitoring; **not** a different information architecture |

**Figma practice:** One base layout; swap **color variables** (bound to theme roles), not copy-paste four different page trees.

---

## 4. Required mockup sets (frames to produce)

Each set should be designed **as if** it lives on the same product as Labs, ECG, med calc, OSCE, and dashboard — shared header, same card language, same button styles, same “continue studying / adaptive” patterns.

### 4.1 Transfusion lesson hub (pathway-integrated)

**Personas / placement (examples, not separate products):** RN, PN/RPN, NP, New Grad specialty hubs; categories such as med-surg, critical care, oncology, hematology, emergency, telemetry, perioperative, pediatrics.

**Hub must show:** adaptive recommendations, continue studying, transfusion **pathways** (grouped learning tracks), reaction **drills**, NGN / clinical judgment entry points, **links to** Labs and ECG/telemetry (as peer study modules, not a new app icon row).

**Feeling:** “Premium transfusion **safety learning** environment” — narrative hero, clear next step, scannable modules, **no** inventory wall of undifferentiated cards.

### 4.2 Transfusion lesson detail (immersive lesson page)

**Topics to illustrate across one or more lesson-detail frames:** blood product types; compatibility; administration; bedside verification; monitoring; reaction recognition; emergency interventions; delayed reactions; documentation; escalation.

**Visual direction:** Layered interpretation panels (e.g. “what you see / what it means / what to do next”), bedside workflow hierarchy, **semantic severity** for reaction risk states, optional **telemetry/vitals strip** or correlation callouts (aligned with ECG redesign language), premium reasoning surfaces (NGN cues without turning into a test dump).

**Not:** shallow memorization layout (single column of bullets only).

### 4.3 Transfusion reaction scenarios (adaptive simulation concepts)

**Reaction types to cover (concept frames):** hemolytic, febrile, allergic, TRALI, TACO, sepsis/contamination, delayed reactions.

**Each scenario concept should show:** evolving vitals; telemetry trend affordance; labs column or strip; communication / escalation moments; prioritization (ordered actions or consequence hints); medication intervention affordances; **branching outcome** hints (without building a second game UI).

**Feeling:** “Immersive transfusion **deterioration** simulation” — time pressure suggested through layout and state, not gimmicky timers unless product standard exists elsewhere.

### 4.4 ECG + lab + transfusion integration

**Integrated workstation-style frames:** Hgb/Hct trends and transfusion threshold narrative; shock progression; hemodynamic instability; electrolyte shifts; telemetry/ECG change language; sepsis indicators — **visually aligned** with Lab Values redesign and ECG / telemetry workstation aesthetic (same grid rhythm, same chart token usage).

### 4.5 OSCE + communication flows

**Flows:** informed consent; patient education; reaction escalation; provider notification; rapid response activation; difficult family communication; documentation handoff.

**Feeling:** “Premium adaptive **bedside communication** training” — dialogue beats, branching prompts, escalation ladder — **inside** `ScenarioStudyShell`-style composition (modal/page variants), not a slide deck.

### 4.6 Dashboard + report card

**Mastery dimensions (concept):** transfusion safety mastery; reaction recognition; escalation readiness; communication; NGN clinical judgment; specialty readiness.

**Integrate visually:** adaptive remediation queue; weak-area chips; continue studying; **cross-links** to Labs / telemetry weakness (same visual language as existing adaptive sections).

**Feeling:** “Adaptive clinical intelligence” — motivating, clear hierarchy, multi-hue progress — **not** gray analytics-only tables.

### 4.7 New Grad + specialty pathways

**Specialties (concept tiles or pathway headers):** ICU, ER, oncology, surgery, trauma, telemetry, pediatrics.

**Feeling:** “Real transition-to-practice transfusion readiness” — specialty context in hero copy and imagery **tone**, same shell everywhere.

### 4.8 Mobile experience (critical)

**Requirements:** readable telemetry and labs (minimum tap targets, no illegible micro-text); touch-friendly simulation controls; clean escalation / communication flows; premium spacing; adaptive prompts visible without clutter; immersive but **uncluttered**.

**Deliver:** key frames from sections 4.1–4.6 at **mobile width** (designer picks canonical breakpoints consistent with app).

### 4.9 Theme-aware variants

For **at least** hub + one scenario + one dashboard frame: show **four themes** via variables (not four unrelated comps).

---

## 5. Deliverables checklist (for design sign-off)

1. Transfusion lesson hub mockups (multi-persona / specialty placement concepts).  
2. Transfusion lesson detail mockups (layered clinical reasoning).  
3. Reaction simulation mockups (multi-reaction set).  
4. ECG / lab / transfusion integration mockups.  
5. OSCE communication mockups.  
6. Dashboard / report-card mockups.  
7. Mobile layouts (subset covering highest-risk flows).  
8. Theme-aware variants (variable-driven).  
9. **Export-ready** screenshots / PDF / asset exports for PR and eng review.  
10. **Ecosystem placement** note (where each frame maps: hub vs lesson vs scenario vs dashboard — one page in Figma).  
11. **Implementation guidance** alignment (section 7 below).

---

## 6. Export and handoff specs

- **Naming:** `NN / Transfusion / [Surface] / [State]` — e.g. `NN / Transfusion / Hub / RN-Oncology`.  
- **Screenshots:** PNG or PDF at 2× for marketing/PR; include light-on-dark for Midnight where relevant.  
- **Components:** Prefer Figma components that mirror **semantic roles** (danger/warning/success/info, chart series 1–5) so engineering can map to CSS variables.  
- **Redlines:** Spacing and type ramp should match existing learner pages where possible — flag intentional deviations.

---

## 7. Implementation guidance for Cursor (post-Figma)

When implementing from approved frames:

- Integrate into **existing learner shells** and routes — preserve URL structure, entitlements, and adaptive ecosystem logic unless a task explicitly changes them.  
- Preserve **theme system** (`[data-theme]`); implement as **theme expression**, not forked layouts per theme.  
- Reuse **shared primitives** (hero, cards, progress fills, badges) and **semantic tokens** — do not hardcode hex/rgb for product UI.  
- Extend **report-card / adaptive** architecture — do **not** ship a parallel transfusion-only dashboard or duplicate nav.  
- Do **not** create isolated transfusion apps, duplicate nav systems, or bypass centralized mastery routing.

**Code alignment references:** `labs-hub-page.tsx`, `lab-lesson-page.tsx`, med calc hub/lesson headers, pathway hub views, dashboard adaptive sections — extend patterns; avoid one-off full-page redesigns unless scoped.

---

## 8. Related documentation

- `docs/planning/transfusion-clinical-readiness-ecosystem.md`  
- `docs/ecosystem-design-system-convergence.md`  
- `docs/planning/subscription-clinical-readiness-ecosystem.md`  
- `.cursor/rules/semantic-color-guardrails.mdc`

---

*Figma program brief for transfusion ecosystem — May 2026. Update when Figma file links or component library names are finalized.*
