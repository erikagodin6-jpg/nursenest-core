# Transfusion + transfusion reactions — clinical readiness ecosystem

**Status:** Product + integration directive  
**Authority:** `.cursor/rules/ecosystem-platform-guardrails.mdc`, `.cursor/rules/transfusion-clinical-readiness.mdc`

Blood transfusion learning must be a **premium adaptive transfusion safety and judgment** surface inside NurseNest — **not** a static checklist, generic CE module, or isolated mini-app.

---

## 1. Positioning

**Teach:** transfusion safety; bedside monitoring; reaction recognition; prioritization; emergency response; pathophysiology; clinical judgment; escalation; communication; documentation; NGN-style reasoning.

**Feel:** real-world transfusion readiness training — pattern recognition, deterioration, bedside judgment — **not** memorization-only or shallow reaction lists.

---

## 2. Existing codebase anchors (extend; do not fork)

- **Lesson taxonomy / i18n:** Keys exist for pathways such as `blood-transfusion`, `blood-transfusion-rpn`, transfusion reactions (febrile, hemolytic, anaphylactic, massive transfusion, transfusion-reactions-np, etc.) — integrate new depth via **pathway lessons**, not parallel products.
- **Blood transfusion simulator (marketing/tooling):** `pages.bloodTransfusionSimulator.*` — reuse compatibility/safety narrative; learner integration stays on **shared shells** and `/app` study loops.
- **Labs (`/app/labs`):** Correlate Hgb/Hct, coags, hemolysis, DIC, inflammation — extend `labs-engine` lessons or cross-links where product approves.
- **Med calculations (`/app/med-calculations`):** Infusion timing, emergency meds — extend categories/lessons only with scoped content changes.
- **ECG / telemetry:** Reaction deterioration, shock, dysrhythmia stories — link from scenarios and lesson correlation strips.
- **OSCE:** Consent, education, escalation, rapid response communication — `ScenarioStudyShell` patterns.
- **Branching cases:** Per `adaptive-case-study-ecosystem.md` — transfusion arcs in ICU/oncology/surgery/trauma/PPH/sepsis/sickle/peds when graph engine ships.
- **Dashboard / report card:** Extend mastery topics + adaptive weak-area keys when analytics exist — **no** separate transfusion-only dashboard app.

---

## 3. Placement matrix

| Surface | Integration intent |
|---------|---------------------|
| **Lesson hubs** | RN / PN / NP / New Grad — med-surg, critical care, oncology, hematology, ED, perioperative, peds, telemetry, ICU via **pathway tags** and hub sections — **no** clutter on unrelated hubs |
| **Labs** | Indications vs isolated values; trends; thresholds; symptomatic anemia; blood loss; dilution; coag/hemolysis patterns |
| **ECG / telemetry** | Vitals trajectory, shock, arrhythmia, electrolyte overlap during reaction |
| **OSCE** | Consent, teaching, reaction recognition, escalation, family/provider communication |
| **Case studies** | Evolving reactions, delayed recognition, branching outcomes |
| **Med / infusion** | Rates, compatibility checks, emergency medications, verification protocols |
| **Dashboard** | Transfusion safety mastery, reaction recognition, escalation readiness — via shared adaptive + report surfaces |

---

## 4. Content depth (must cover over the ecosystem)

Blood product types; indications; compatibility; administration workflow; pre-transfusion and bedside verification; monitoring; reaction differentiation (febrile, allergic, hemolytic, TRALI, TACO, sepsis/contamination, delayed); fluid overload; emergency interventions; documentation; escalation; patient safety.

**Emphasize:** patterns, prioritization, deterioration, nursing judgment, NGN reasoning — **not** static protocol PDFs as the primary UX.

---

## 5. Tier scaling

| Persona | Focus |
|---------|--------|
| **RN** | Full workflow, prioritization, reaction differentiation, NGN readiness |
| **PN/RPN** | Monitoring, escalation, practical safety, stable vs unpredictable client |
| **NP** | Advanced management, pathophysiology, diagnostic reasoning |
| **New Grad** | ICU/oncology/ER integration, rapid response, specialty workflows |

---

## 6. Figma + engineering cohesion

- **Full Figma program (frames, themes, mobile, export, handoff):** `docs/planning/transfusion-ecosystem-figma-brief.md`.
- Theme-aware only (expression — not layout forks); semantic tokens; shared learner shells; alignment with Labs / ECG / case-study / dashboard redesigns.
- **Validation:** Hub placement correct; report-card/adaptive hooks when data exists; no disconnected transfusion-only UI tree; simulations compose labs + telemetry + meds.

---

## 7. Related docs

- `docs/planning/transfusion-ecosystem-figma-brief.md` — design mockups + theme variants + Cursor implementation guardrails  
- `docs/planning/lab-values-educational-depth.md`  
- `docs/planning/adaptive-case-study-ecosystem.md`  
- `docs/planning/osce-medication-dosage-ecosystem.md`  
- `docs/ecg-module-integration.md`

---

*Transfusion readiness as integrated subscription value — May 2026.*
