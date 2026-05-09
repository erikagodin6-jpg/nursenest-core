# Subscription ecosystem — premium integrated clinical learning & readiness

**Status:** Product architecture directive — aligns engineering and design with long-term subscription value  
**Audience:** Product, design, engineering  
**Authority:** `.cursor/rules/ecosystem-platform-guardrails.mdc`, `docs/ecosystem-design-system-convergence.md`

---

## 1. North star

NurseNest subscriptions deliver **one premium adaptive clinical learning and readiness ecosystem** — not a question bank with disconnected utilities.

**Purpose spans:**

- Exam preparation **and** clinical readiness, bedside confidence, telemetry interpretation, medication safety, communication mastery, clinical judgment, specialty preparation, and transition-to-practice support.

**These systems are core subscription value** — ECG, Labs, OSCE, medication dosage calculation, and adaptive simulations — implemented as **integrated** surfaces (`/app/*`), shared shells, shared navigation, shared semantic tokens, and linked study loops. They must **not** be framed or built as optional side tools, generic calculators, or isolated mini apps.

---

## 2. Existing surfaces (do not rebuild)

| Domain | Learner anchors | Notes |
|--------|-----------------|--------|
| **Labs** | `/app/labs` | `labs-engine` + study loops into lessons, practice, CAT, drills |
| **Medication dosage** | `/app/med-calculations` | Engine + realism validation; report card inset (`MedCalcReportCardInset`) |
| **OSCE / skills** | `/app/osce` | `ScenarioStudyShell`, flags; pathway-aware |
| **ECG / telemetry** | Learner + module infra | See `docs/ecg-module-integration.md`; integrate with shells, not fork nav |
| **Adaptive simulation** | Case-study architecture | `docs/planning/adaptive-case-study-ecosystem.md` |
| **Transfusion + reactions** | Pathway lessons + Labs/OSCE/ECG/med correlation | Product: `docs/planning/transfusion-clinical-readiness-ecosystem.md`. Design: `docs/planning/transfusion-ecosystem-figma-brief.md` |
| **Dashboard / report card** | `/app`, `/app/account/progress`, report route | Adaptive section, weak topics, insets — extend, don’t duplicate |

**Rule:** Converge visually and in data flow; **do not** second copies of the same journeys.

---

## 3. Ecosystem integration examples (remediation chains)

Illustrative **linked** behavior — implement via existing adaptive + topic routing + deep links, not new products:

| Weak signal | Remediation path (conceptual) |
|-------------|-------------------------------|
| Telemetry / rhythm | ECG practice → telemetry-safe scenarios → rhythm flashcards → OSCE communication under crisis |
| Med safety / dosing | Dosage hub → medication drills → infusion scenarios → pathway remediation |
| Prioritization / judgment | Branching simulations → OSCE escalation → NGN-style cases |
| Lab interpretation | Labs pathways → lab–ECG correlation content → deterioration cases |

The platform should feel **adaptive and clinically intelligent** — recommendations reuse **one** recommendation architecture (`LearnerAdaptiveRecommendationsSection`, study-plan APIs, topic keys) as data becomes available.

---

## 4. Phased implementation (aligned with convergence work)

| Phase | Focus | Guardrails |
|-------|--------|------------|
| **1** | Visual + shell + token convergence; premium redesign within existing routes | No new route trees; themes alter expression only |
| **2** | Linked learning, report card depth, adaptive remediation, weak-area routing | No parallel scoring engines; extend bundles + insets |
| **3** | Advanced branching, telemetry/lab depth, specialty simulation content | Graph engine + content QA per adaptive-case-study doc |

**Do not:** Rewrite stable auth/entitlements, fork navigation, or duplicate learner shells.

---

## 5. Report card + “adaptive clinical intelligence”

All listed systems should **eventually** feed:

- Mastery and weak-area signals  
- Continue studying / remediation  
- Specialty and judgment indicators  

**today:** partial wiring exists (e.g. med-calc local inset, adaptive section when enabled). **Future:** server-backed mastery + OSCE/dosage/ECG/lab topic keys — requires explicit analytics/schema approval.

Dashboards should use **semantic multi-hue** status and chart tokens — **not** generic gray analytics styling (`semantic-color-guardrails.mdc`).

---

## 6. Specialty + New Grad

Support ICU, ER, telemetry, peds, surgery, dialysis, oncology, LTC, neuro, med-surg, community, etc. via **pathway + content tags** on the **same** learner routes — not separate `/app` product silos. New Grad surfaces should feel immersive and confidence-building while remaining **one** ecosystem identity.

---

## 7. Related documentation

- `docs/planning/clinical-readiness-ecosystem-implementation-directive.md` — homepage, hubs, report card, CAT, flashcards, marketing language, adaptive loops  
- `docs/planning/bls-acls-pals-emergency-readiness-pathways.md` — future BLS/ACLS/PALS as integrated emergency-readiness ecosystems  
- `docs/ecosystem-design-system-convergence.md` — primitives, themes, duplicate-system audit  
- `docs/planning/osce-medication-dosage-ecosystem.md` — OSCE + dosage placement  
- `docs/planning/transfusion-clinical-readiness-ecosystem.md` — transfusion safety + reactions across hubs, labs, telemetry, OSCE, cases  
- `docs/planning/transfusion-ecosystem-figma-brief.md` — Figma mockups, themes, mobile, export + implementation handoff  
- `docs/planning/adaptive-case-study-ecosystem.md` — branching simulation architecture  
- `docs/governance/ecosystem-guardrails-rollout.md` — agent rule changelog  

---

*Subscription positioning for clinical readiness — May 2026. Update when entitlement tiers or analytics schemas explicitly include mastery domains for these systems.*
