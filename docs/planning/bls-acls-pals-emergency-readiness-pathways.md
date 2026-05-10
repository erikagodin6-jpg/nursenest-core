# BLS / ACLS / PALS — future clinical certification readiness pathways

**Status:** Product + placement directive (future implementation)  
**Authority:** `.cursor/rules/ecosystem-platform-guardrails.mdc`, `docs/planning/clinical-readiness-ecosystem-implementation-directive.md`

Plan and position **future** BLS, ACLS, PALS, and related certification/readiness pathways as **premium integrated clinical readiness ecosystems** inside NurseNest — **not** isolated certification courses, static CE modules, disconnected LMS products, or generic “watch + quiz” systems.

**North-star feel:** “Immersive adaptive emergency-response readiness.” **Not:** generic certification prep.

---

## Critical product positioning

BLS / ACLS / PALS pathways should support:

- Exam readiness; clinical readiness; emergency recognition; telemetry interpretation; medication safety; rapid response; communication and escalation; specialty readiness; transition-to-practice confidence.

**Subscription framing:** These are **integrated subscription capabilities** — extend `docs/planning/subscription-clinical-readiness-ecosystem.md`. Tier names, bundling, and entitlements must follow **truthpack `product.json`** when present — never invent SKUs or tier names.

---

## Implementation placement

### 1. Homepage (`/`)

Add premium marketing emphasis for **emergency-response readiness** (within existing homepage bands — same rule: **no** separate certification landing silos unless product adds them explicitly):

| Theme | Placement hints | Messaging examples | Visual direction |
|-------|-----------------|-------------------|----------------|
| Emergency response / code readiness | Clinical readiness; simulation; specialty/New Grad bands | Adaptive ACLS telemetry training; emergency-response simulations; code scenario mastery | Telemetry overlays; code workflows; branching previews; ICU/ER atmosphere |
| Pediatric emergency readiness | Near simulation / specialty narrative | Pediatric readiness pathways; pediatric emergency readiness | PALS-aligned previews — **product naming via i18n / legal review** |
| Rapid-response judgment | Telemetry/ECG + simulation sections | Rapid-response clinical judgment | Workstation aesthetic; deterioration cues |

Integrates with existing directive sections for ECG, Labs, OSCE, New Grad — **one** visual language.

---

### 2. Lesson hubs

Integrate **contextually** into RN, NP, and New Grad specialty hubs; Allied **only** where clinically relevant — **do not** create isolated “certification hubs” with duplicate navigation.

| Hub | Surface examples |
|-----|-------------------|
| **RN** | BLS readiness; ACLS foundations; deterioration recognition; telemetry hooks; code prioritization |
| **NP** | Advanced ACLS reasoning; advanced rhythm interpretation; advanced emergency management |
| **New Grad** | **Critical:** ICU, ER, telemetry, critical care, pediatrics, surgery, rapid response — “real emergency-response preparation” |
| **Allied** | Selective — only where scope matches pathway |

---

### 3. ECG + telemetry

ACLS and emergency pathways **must** reuse the **ECG ecosystem** (`docs/ecg-module-integration.md`):

- Rhythm recognition; deterioration; code scenarios; algorithms **as teaching arcs**, not a second ECG app.

**Illustrative algorithm threads (content-owned):** VT/VF management; pulseless rhythms; brady/tachy pathways; cardioversion; pacing; prioritization during arrest.

---

### 4. Labs + dosage + medications

Correlate emergency teaching with:

- Electrolyte emergencies; ABGs; potassium-related arrhythmias; emergency medications; infusion/titration safety; pediatric dosing; ACLS medication timing — via **`/app/labs`**, **`/app/med-calculations`**, and linked scenarios **without** forking product architecture.

---

### 5. OSCE + communication

Support: rapid response communication; code leadership; escalation; provider and family communication; delegation — **`ScenarioStudyShell`** patterns; **no** parallel OSCE product.

---

### 6. Branching case studies

**Primary integration surface** for immersion:

- Cardiac arrest; rapid deterioration; pediatric emergencies; shock progression; sepsis escalation; telemetry emergencies; ICU codes — evolving vitals; telemetry; labs; medication timing; branching outcomes; multiple endings; adaptive deterioration (`docs/planning/adaptive-case-study-ecosystem.md`).

---

### 7. Dashboard + report card

Extend **existing** `/app/account/report` and adaptive surfaces with mastery dimensions such as:

- Emergency response; telemetry readiness; ACLS algorithms (conceptual grouping); pediatric readiness; code prioritization; communication/escalation; deterioration recognition.

**Feel:** “Adaptive emergency-readiness intelligence.” **Do not** ship a standalone “ACLS dashboard app.”

---

## Figma requirements

Design **cohesively** with NurseNest: BLS / ACLS / PALS pathway concepts; code simulations; telemetry integration; emergency dashboards; pediatric emergency readiness; ICU/ER flows — **premium adaptive emergency-response ecosystem**, not generic certification sites or enterprise training portals.

**Themes:** Aurora / Ocean / Garden / Midnight — same layout; expression only. **Midnight:** flagship immersive emergency mode + telemetry workstation aesthetic.

---

## Content depth (minimum conceptual coverage)

**BLS:** CPR; AED; rapid deterioration; communication; team response; airway basics.

**ACLS:** Telemetry interpretation; rhythm algorithms; medications; pacing/cardioversion; code leadership; ICU/ER prioritization.

**PALS:** Pediatric deterioration; pediatric dosing; communication; telemetry/labs correlation; escalation.

**All tracks:** Lessons; pathophysiology; algorithms; prioritization; interventions; rationale; telemetry/labs integration; adaptive remediation; simulations; NGN reasoning.

---

## Implementation rules for Cursor

Before implementation:

1. Audit ECG + telemetry infrastructure and simulation architecture.  
2. Reuse learner shells and semantic tokens.  
3. Preserve auth, server-side entitlements, i18n, and **routing continuity**.

**Do not:** isolated certification apps; disconnected nav; forked ecosystem architecture; hardcoded visual systems outside tokens.

---

## Final positioning

Evolve BLS / ACLS / PALS into **“adaptive emergency-response and specialty readiness ecosystems”** inside NurseNest — supporting clinicians before graduation, during licensure prep, during transition to practice, and through specialty development — **one** premium adaptive clinical learning platform.

---

## Related documents

- `docs/planning/clinical-readiness-ecosystem-implementation-directive.md`  
- `docs/planning/subscription-clinical-readiness-ecosystem.md`  
- `docs/ecg-module-integration.md`  
- `docs/planning/adaptive-case-study-ecosystem.md`  
- `docs/ecosystem-design-system-convergence.md`

---

*BLS/ACLS/PALS pathway directive — May 2026. Update when certification partnerships, legal naming, or entitlements are defined.*
