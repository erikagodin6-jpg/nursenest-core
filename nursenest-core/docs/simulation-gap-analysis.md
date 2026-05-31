# Simulation Gap Analysis

Date: 2026-05-31
Status: Content parity execution planning

Future content flags: `published=false`, `launchReady=false`, `adminOnly=true` until reviewed.

## Audit Finding

Simulation infrastructure exists, but repository evidence does not yet prove broad simulation inventory by pathway, profession, specialty, or body system. The platform completion audit scores simulations at 64% and identifies breadth, patient outcomes, debriefs, profession-specific simulation depth, and analytics as incomplete.

## Coverage Matrix

| Simulation Area | Current Evidence | Gap | Priority |
| --- | --- | --- | --- |
| Medical-Surgical | Scenario infrastructure exists; not counted as full inventory | Need complete RN/RPN scenario bank | Very high |
| Critical Care | ECG/labs/critical content exists; simulations not mature | Need shock, ventilator, hemodynamic, cardiac emergency simulations | High |
| Emergency | Some emergency topics exist in content/blogs | Need triage, trauma, stroke, ACS, sepsis, pediatric emergency simulations | High |
| Mental Health | Mental health topics exist | Need suicide risk, agitation, therapeutic communication, safety simulations | Medium-high |
| Maternity | Maternity topic inventory exists | Need preeclampsia, postpartum hemorrhage, fetal concerns, newborn transition simulations | High |
| Pediatrics | Pediatrics topic inventory exists | Need respiratory distress, dehydration, sepsis, medication safety simulations | High |
| Community | Community topics limited | Need home care, public health, chronic disease, safety escalation simulations | Medium |
| NP | CNPLE and NP content exist; specialty sims not evidenced | Need FNP/AGPCNP/PMHNP/WHNP/PNP-PC cases and management simulations | High |
| Allied Health | 22 generated scaffolds exist; simulations not complete | Need RT, Paramedic, MLT, PT, OT simulations | High |
| New Graduate | Roadmap exists; specialty rows previously detected as 0 | Need shift-management, escalation, delegation, documentation, medication safety simulations | High |

## Minimum Simulation Targets

| Pathway | Minimum Target | First-Wave Target | Notes |
| --- | ---: | ---: | --- |
| RN | 250 | 100 | Start with high-risk deterioration and NGN-style scenarios |
| RPN / PN | 150 | 60 | Emphasize predictable vs unstable, reporting, medication safety |
| NP CNPLE | 100 | 40 | Advanced assessment, diagnosis, prescribing, follow-up |
| US NP certifications | 75 each | 25 each | Specialty-specific cases |
| Allied priority professions | 75 each | 25 each | RT, Paramedic, MLT, PT, OT first |
| New Graduate | 100 | 50 | Shift organization, escalation, documentation, code readiness |
| ECG | 100 deterioration pathways | 30 | Telemetry and rhythm deterioration |
| Labs | 100 | 30 | Critical values, trends, medication monitoring |
| Pharmacology | 75 | 25 | Medication safety and adverse reaction scenarios |

## Scenario Inventory To Build First

| Rank | Scenario | Applies To | Reason |
| ---: | --- | --- | --- |
| 1 | Sepsis Deterioration | RN, RPN/PN, NP, New Grad | High clinical risk and high exam value |
| 2 | Respiratory Failure | RN, RPN/PN, RT, NP, New Grad | Cross-profession and high safety value |
| 3 | ACS To VT/VF | RN, ECG, Critical Care, Emergency | Integrates ECG, meds, escalation, simulation |
| 4 | Hyperkalemia With ECG Changes | RN, RPN/PN, ECG, Labs, NP | Strong cross-module learning graph topic |
| 5 | DKA With Fluid And Electrolyte Shifts | RN, NP, Labs, Pharmacology | High reasoning and lab interpretation value |
| 6 | Stroke Alert | RN, RPN/PN, NP, Emergency, Paramedic | Strong prioritization and time-sensitive care |
| 7 | GI Bleed With Shock | RN, RPN/PN, Labs, Critical Care | Integrates labs, transfusion, escalation |
| 8 | Postpartum Hemorrhage | RN, RPN/PN, Maternity, New Grad | High-risk maternal emergency |
| 9 | Pediatric Respiratory Distress | RN, Pediatrics, Emergency, RT | High anxiety, high safety, high exam value |
| 10 | Medication Error Near Miss | RN, RPN/PN, New Grad, Pharmacology | Retention, safety, and chargeback-safe value story |

## Simulation Template

Each simulation should include:

1. Patient context
2. Initial cues
3. Learner role and scope
4. Decision point 1: recognition
5. Decision point 2: interpretation
6. Decision point 3: prioritization
7. Decision point 4: intervention
8. Decision point 5: escalation or evaluation
9. Patient outcome based on decisions
10. Debrief with why correct, why incorrect, clinical pearl, and next remediation
11. Related lessons, flashcards, questions, labs, ECG, pharmacology, or clinical skills
12. Readiness domain score updates

## Analytics Required

| Signal | Purpose |
| --- | --- |
| Recognition accuracy | Measures cue detection |
| Prioritization accuracy | Measures urgency and safety judgment |
| Escalation timing | Measures failure-to-rescue risk |
| Intervention selection | Measures action safety |
| Outcome score | Measures consequence-based learning |
| Confidence rating | Detects overconfidence and underconfidence |
| Remediation trigger | Connects failed decisions to content loops |

