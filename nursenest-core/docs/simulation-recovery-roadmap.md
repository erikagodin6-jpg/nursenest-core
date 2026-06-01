# Simulation Recovery Roadmap

Date: 2026-06-01
Status: Simulation maturity acceleration plan

Source of truth: `docs/content-maturity-dashboard.md` and `docs/simulation-master-inventory.md`.

Future products remain locked: `published=false`, `launchReady=false`, `visibleInNavigation=false`, `indexable=false`, `adminOnly=true`.

## Goal

Move simulation maturity from 45% overall toward:

| Metric | Current | Target |
| --- | ---: | ---: |
| Simulation system overall | 45% | 90% |
| Simulation coverage dimension | 35% | 85% |
| Overall platform simulation coverage | 32% | 85% |

## Recovery Principle

Every major high-risk topic should eventually contain:

Lesson -> Flashcards -> Questions -> NGN Case -> Simulation -> Debrief -> Readiness Signal

No high-risk topic should be marked mature from lessons or question counts alone.

## Current Inventory And Gap

Repository evidence identifies 76 authored physiology simulation references. The catalog does not expose published, draft, or review status fields.

| Area | Current Inventory | Target Inventory | Gap Inventory | Current % | Priority |
| --- | ---: | ---: | ---: | ---: | --- |
| RN | 33 | 250 | 217 | 13.2% | P0 |
| RPN / PN | 8 | 150 | 142 | 5.3% | P0 |
| NP | 18 | Specialty-specific | Not scoreable | Not scoreable | P1 |
| ECG deterioration pathways | 4 | 500 | 496 | 0.8% | P0 |
| Labs | No standalone simulation inventory evidenced | 100 | Not scoreable | Not scoreable | P1 instrumentation blocker |
| Pharmacology | No standalone simulation inventory evidenced | 75 | Not scoreable | Not scoreable | P1 instrumentation blocker |
| New Graduate | 11 | 100 | 89 | 11.0% | P1 |

## Missing Simulation Infrastructure

| Missing Component | Why It Blocks 85% Simulation Coverage |
| --- | --- |
| Published/draft/review status | Prevents launch-readiness and clinical-review claims |
| Exam mapping | Prevents NCLEX-RN, REx-PN, NCLEX-PN, CNPLE, and NP readiness scoring |
| Topic-to-loop mapping | Prevents high-risk topic completion claims |
| Readiness domain mapping | Prevents safety, reasoning, professional, and clinical readiness reporting |
| Recovery pathway completeness | Only 39 of 76 simulation references show recovery pathway evidence |
| Dedicated lab/pharm simulation registries | Labs and pharmacology cannot be scored as standalone maturity systems |

## Build Sequence

| Sequence | Workstream | Target Outcome |
| ---: | --- | --- |
| 1 | Add simulation status and mapping instrumentation | Every simulation can be counted by profession, exam, topic, status, and readiness domain |
| 2 | Complete RN high-risk simulations | Close sepsis, shock, ACS, stroke, respiratory failure, DKA, hyperkalemia, GI bleed, trauma, maternity, pediatrics |
| 3 | Complete RPN / PN scope-specific simulations | Predictable care, escalation, reporting, medication safety, documentation, delegation |
| 4 | Add NP specialty simulation targets | CNPLE, FNP, AGPCNP, PMHNP, WHNP, PNP-PC specialty scoring |
| 5 | Build ECG deterioration pathway library | 500 deterioration pathways, starting with rhythm-to-arrest and electrolyte-to-arrest chains |
| 6 | Build lab simulation registry | Critical values, trends, medication monitoring, pattern recognition |
| 7 | Build pharmacology safety simulation registry | Near misses, toxicity, adverse reactions, reconciliation failures |
| 8 | Expand New Graduate shift survival simulations | Shift organization, escalation, documentation, conflict, emergency response |

## Profession Recovery Targets

| Profession / Pathway | First Recovery Target | Maturity Target | Notes |
| --- | ---: | ---: | --- |
| RN | 150 mapped simulations | 250+ | Prioritize high-risk and NCJMM-aligned simulations first |
| RPN / PN | 75 mapped simulations | 150+ | Must enforce scope, reporting, escalation, and predictable-care boundaries |
| CNPLE | 50 mapped simulations | 100+ | Advanced assessment and management, without duplicating RN-level items |
| FNP | 50 mapped simulations | 75+ | Diagnosis, management, prescribing, follow-up |
| AGPCNP | 40 mapped simulations | 75+ | Adult-gerontology complexity and chronic disease management |
| PMHNP | 40 mapped simulations | 75+ | Safety, risk assessment, psychopharmacology, therapeutic communication |
| WHNP | 35 mapped simulations | 75+ | Reproductive, prenatal, postpartum, screening, prescribing |
| PNP-PC | 35 mapped simulations | 75+ | Developmental, family education, pediatric assessment |

## High-Risk Simulation Queue

| Topic | Current Simulation Evidence | Recovery Priority | Minimum Next Action |
| --- | ---: | --- | --- |
| Sepsis | 10 plus septic shock 2 | P0 | Map existing sims to RN/RPN/NP exams and add missing debrief/readiness signals |
| Shock | 8 plus complex shock 1 | P0 | Differentiate septic, cardiogenic, hypovolemic, obstructive, distributive |
| ACS | 5 STEMI references | P0 | Add unstable angina/NSTEMI/STEMI triage, ECG, medications, escalation |
| Stroke | 3 | P0 | Add thrombolytic window, neuro checks, aspiration risk, escalation |
| Respiratory Failure | ARDS 5 plus pulmonary edema 2 plus PE 3 | P0 | Add oxygenation/ventilation decision points and deterioration branches |
| DKA | 3 | P0 | Add fluids, insulin, potassium monitoring, lab trend response |
| Hyperkalemia | 4 | P0 | Add ECG progression, medication response, repeat labs, arrest prevention |
| GI Bleed | 1 | P0 | Add hypotension, transfusion, labs, escalation, deterioration |
| Trauma | 1 | P0 | Add primary survey, hemorrhage, neuro, spine, deterioration |
| Maternal Emergencies | 0 evidenced | P0 | Create postpartum hemorrhage and preeclampsia/eclampsia first |
| Pediatric Emergencies | 0 physiology-monitor topic evidence | P0 | Create pediatric respiratory distress, dehydration, sepsis first |

## Readiness Signals Required

Every simulation added to the recovery program must track:

- Recognition accuracy
- Interpretation accuracy
- Prioritization accuracy
- Intervention selection
- Escalation timing
- Documentation completeness
- Communication quality
- Outcome score
- Confidence score
- Remediation trigger

