# Clinical readiness ecosystems — implementation, placement, marketing & adaptive integration

**Status:** Authoritative product + engineering directive for Cursor and collaborators  
**Authority:** `.cursor/rules/ecosystem-platform-guardrails.mdc`, `docs/planning/subscription-clinical-readiness-ecosystem.md`

This document states **where** premium clinical readiness ecosystems live in the product, **how** they are positioned for learners and subscribers, and **how** they plug into adaptive learning — so implementations stay **one integrated NurseNest platform**, not disconnected tools, mini-apps, utility pages, or isolated CE modules.

**Scope domains:** Blood transfusion + transfusion reactions; ECG + telemetry; Labs + clinical interpretation; medication dosage calculation; OSCE + simulations; adaptive branching case studies; New Grad specialty readiness; future BLS/ACLS/PALS pathways (**directive:** `docs/planning/bls-acls-pals-emergency-readiness-pathways.md`).

---

## Critical product rule

| These ecosystems are **not** | They **are** |
|------------------------------|--------------|
| Disconnected tools, mini-apps, utility-only pages, isolated CE modules | **Premium integrated clinical readiness ecosystems** inside the **NurseNest subscription** platform |

**Goals:** exam readiness; bedside readiness; transition-to-practice readiness; specialty readiness; clinical confidence; adaptive remediation.

**Platform feel:** “One premium adaptive clinical learning ecosystem.”

---

## Part 1 — Exact implementation locations

### 1. Homepage (`/`)

Implement premium marketing sections **on the main homepage and homepage marketing flow** — **not** separate landing-page “ecosystems” unless product explicitly adds them later.

**Placement hierarchy (relative order — tune with design):**

| Section | Placement on `/` | Messaging pillars | Visual direction |
|---------|------------------|-------------------|------------------|
| **A. ECG + telemetry** | Below primary hero; **above** generic feature grids | Telemetry interpretation; rhythm recognition; adaptive ECG learning; telemetry readiness | Strips, waveform overlays, immersive monitoring previews |
| **B. Labs + clinical interpretation** | Within learning ecosystem band | Clinical interpretation; pattern recognition; trend analysis; NGN reasoning | Layered lab panels; lab/telemetry correlations; adaptive interpretation previews |
| **C. Medication dosage calculation** | Clinical safety / readiness band | Realistic med math; IV calculations; pediatric dosing; medication safety | Premium med-calc interaction previews; infusion/titration workflows |
| **D. OSCE + simulations** | “Real-world readiness” / clinical simulation band | Communication; escalation; patient education; branching simulations; NGN judgment | Immersive scenarios; telemetry/lab overlays; adaptive branching previews |
| **E. Blood transfusion + reaction recognition** | Advanced clinical safety band; **near** labs/ECG/New Grad cues | Transfusion safety; deterioration recognition; bedside monitoring; rapid escalation; reaction differentiation | Bedside monitoring; vitals/telemetry changes; escalation workflows |
| **F. New Grad readiness** | Near report-card / readiness narrative | ICU, ER, telemetry, med-surg, oncology; transition-to-practice | Specialty pathway previews; adaptive readiness framing |
| **G. Emergency response / code readiness (future BLS / ACLS / PALS)** | Clinical readiness + simulation + telemetry / specialty bands | Adaptive ACLS telemetry; emergency-response simulations; pediatric readiness; rapid-response judgment | Telemetry overlays; code workflows; branching simulations; ICU/ER workstation aesthetic |

**Implementation note:** Use shared marketing components and semantic tokens; no duplicate nav or forked theme systems. **Future emergency-cert pathways:** `docs/planning/bls-acls-pals-emergency-readiness-pathways.md`.

---

### 2. Lesson hubs

Integrate **contextually** into existing pathway hubs — **do not** create mega-hubs, isolated apps, or disconnected tabs.

**Patterns to use:**

- Premium **category cards** (scoped, not walls of links).
- **Adaptive recommendation** rows (reuse dashboard/adaptive patterns where data exists).
- **Continue readiness training** sections.
- **Specialty recommendation** rails (New Grad / specialty hubs).

**RN hubs — surface:** ECG/telemetry; Labs; dosage calculation; OSCE; transfusion safety; NGN / simulation entry points.

**PN/RPN hubs — surface:** Bedside labs; practical dosage; transfusion monitoring; escalation communication; stable vs unpredictable client scenarios.

**NP hubs — surface:** Advanced interpretation; advanced ECG/labs; prescribing/dosing reasoning; advanced simulations.

**Allied hubs — only where clinically relevant** (examples: RT → ABGs/oxygenation/telemetry-lab integration; MLT → deeper lab interpretation; Imaging → contrast/reaction/safety workflows).

**New Grad hubs — immersive specialty ecosystems:** ICU, ER, telemetry, oncology, surgery, pediatrics, LTC, dialysis, neuro (pathway-tagged content on **same** learner routes).

**Feel:** “Real transition-to-practice ecosystem,” not a separate product URL tree.

---

### 3. Dashboard + report card

**Canonical learner report card route:** `/app/account/report` (redirect from legacy `/app/account/report-card`).

**Also integrate:** learner dashboard (`/app` learner home), adaptive recommendation surfaces, account progress where already used.

**Mastery / readiness domains to extend (conceptual — wire to analytics when approved):** ECG; telemetry; labs; med safety; dosage calculation; transfusion safety; OSCE communication; NGN reasoning; simulations; specialty readiness.

**UX:** Weak-area remediation; continue studying; adaptive recommendations; readiness framing; confidence-oriented hierarchy — **“adaptive clinical intelligence.”**

**Rule:** Extend existing report-card and adaptive components — **no** parallel “transfusion-only” or “labs-only” scoring apps.

---

### 4. Practice + CAT

Integrate into **practice remediation**, **CAT weak-area routing**, and **adaptive loops** using existing `/app/cat`, practice-tests, and remediation flows.

**Illustrative routing (product/content owns exact mapping):**

| Weak signal | Example remediation paths |
|-------------|---------------------------|
| Telemetry / rhythm | ECG drills → telemetry simulations → ECG flashcards |
| Med safety | Dosage remediation → transfusion safety → infusion scenarios |
| Labs | Interpretation pathways → ECG/lab scenarios → sepsis/deterioration simulations |
| Communication | OSCE remediation → escalation simulations |

---

### 5. Flashcards

Flashcards (`/app/flashcards` and related flows) should reinforce **rapid adaptive clinical reinforcement**: ECG strips; lab interpretation; dosage quick drills; transfusion reactions; escalation prompts; NGN mini-scenarios — **linked** to lesson/practice ecosystems, not a disconnected deck factory.

---

## Part 2 — Marketing positioning

**Position as:** Premium **integrated subscription capabilities** — **not** separate paid utilities or bolt-on tools.

**Approved messaging themes (adapt copy via i18n; do not ship global churn without task scope):**

- Clinical readiness ecosystem  
- Adaptive ECG + telemetry training  
- Interactive lab interpretation  
- Immersive NGN simulations  
- Medication safety mastery  
- Transfusion reaction readiness  
- Adaptive OSCE communication training  
- Transition-to-practice preparation  

**Homepage narrative:** NurseNest helps learners **pass exams** and become **safer, more confident clinicians** — one ecosystem.

**Subscription tie-in:** These surfaces justify **ongoing subscription value** (readiness + remediation), aligned with `docs/planning/subscription-clinical-readiness-ecosystem.md`. Tier names and entitlements must match **truthpack `product.json`** when present — never invent tiers or features.

---

## Part 3 — Figma rules (summary)

Design **one ecosystem language**: cohesive systems, shared shells/primitives, shared navigation, shared spacing and token systems — **no** separate branding or disconnected simulation aesthetics. Full design briefs: `docs/planning/transfusion-ecosystem-figma-brief.md`, `docs/ecosystem-design-system-convergence.md`.

---

## Part 4 — Implementation rules for Cursor

**Before coding:**

1. Audit existing routes and components.  
2. Reuse learner shells (`nn-learner-page-hero`, hub cards, study surfaces).  
3. Reuse semantic tokens (`semantic-status-tokens.css`, semantic color guardrails).  
4. Preserve auth, **server-side** entitlements, and paywall behavior.  
5. Preserve localization/i18n loaders and keys.  
6. Preserve routing continuity — **no** URL churn unless explicitly tasked.  
7. **Expand** existing systems instead of rebuilding.

**Known foundations:**

| Area | Anchor |
|------|--------|
| Labs | `/app/labs`, `labs-engine`, lab lesson/hub components |
| Med dosage | `/app/med-calculations`, report-card inset patterns |
| OSCE | `/app/osce`, scenario shells |
| ECG / telemetry | Module infra per `docs/ecg-module-integration.md` |
| Lessons / hubs | Pathway hub views, `/app/lessons` |
| Practice / CAT | `/app/cat`, practice-tests |
| Dashboard / report | `/app`, `/app/account/report`, progress/analytics as applicable |

**Do not:** Create isolated apps; duplicate nav; hardcode gradients/colors outside tokens; fork architecture; bypass adaptive ecosystem logic.

---

## Part 5 — Content depth + scale targets

Every premium ecosystem should support depth: lessons; explanations; pathophysiology; prioritization; interventions; trends; deterioration; adaptive remediation; linked learning; NGN reasoning; specialty readiness.

**Planning targets (content pipeline — not a single PR requirement):**

- **~50+** meaningful learning items per major ecosystem (questions, drills, structured interactions — definitions agreed with content ops).  
- **Major adaptive cases:** target **~75+** interactions/questions per case where branching architecture supports it (`docs/planning/adaptive-case-study-ecosystem.md`).

Inventory and gaps: see expansion-plan / inventory reports if present in repo.

---

## Related documents

- `docs/planning/bls-acls-pals-emergency-readiness-pathways.md` — future BLS/ACLS/PALS placement + integration  
- `docs/planning/subscription-clinical-readiness-ecosystem.md`  
- `docs/planning/transfusion-clinical-readiness-ecosystem.md`  
- `docs/planning/transfusion-ecosystem-figma-brief.md`  
- `docs/planning/lab-values-educational-depth.md`  
- `docs/planning/osce-medication-dosage-ecosystem.md`  
- `docs/planning/adaptive-case-study-ecosystem.md`  
- `docs/ecosystem-design-system-convergence.md`

---

*Directive for integrated clinical readiness ecosystems — May 2026. Update when homepage structure, report-card analytics, or entitlements change.*
