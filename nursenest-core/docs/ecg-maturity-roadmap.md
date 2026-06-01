# ECG Maturity Roadmap

Date: 2026-06-01
Status: ECG maturity acceleration plan

Source of truth: `docs/content-maturity-dashboard.md` and `docs/ecg-expansion-roadmap.md`.

Future products remain locked: `published=false`, `launchReady=false`, `visibleInNavigation=false`, `indexable=false`, `adminOnly=true`.

This roadmap improves the existing ECG learning system. It does not create a public ECG Academy, navigation, pricing surface, or new learner-facing product.

## Maturity Target

| Dimension | Current | Target | Gap |
| --- | ---: | ---: | ---: |
| Coverage | 45% | 90% | 45 pts |
| Depth | 50% | 90% | 40 pts |
| Reasoning | 65% | 90% | 25 pts |
| Simulation | 40% | 85% | 45 pts |
| Readiness | 55% | 90% | 35 pts |
| Quality | 68% | 90% | 22 pts |
| Overall | 54% | 90% | 36 pts |

## Current Evidence

| Metric | Current Repository-Evidenced Count | Target | Gap | Current % |
| --- | ---: | ---: | ---: | ---: |
| Curated ECG questions from prior audit | 43 | 1,000 | 957 | 4.3% |
| ECG deterioration pathways | 4 | 500 | 496 | 0.8% |
| Pediatric ECG case simulations | 6 | Not separately standardized | Not scoreable | Not scoreable |
| Telemetry workflows | Not evidenced | Required | Not scoreable | Not scoreable |

## Required Expansion Domains

| Domain | Required Maturity Work |
| --- | --- |
| Rhythm recognition | Sinus, atrial, junctional, ventricular, heart blocks, paced rhythms, mixed rhythms |
| Telemetry | Monitor setup, lead placement, artifact, alarm fatigue, multi-patient prioritization |
| Deterioration pathways | PAC to AFib, PVC burden to VT, VT to VF, Mobitz II to complete heart block, STEMI to arrest, hyperkalemia to PEA |
| Escalation | Stable vs unstable rhythms, first nursing actions, provider notification, rapid response |
| Medication effects | Beta blockers, calcium channel blockers, digoxin, adenosine, amiodarone, magnesium, potassium, QT-prolonging medications |
| Clinical reasoning | Hemodynamic impact, symptoms, labs, medications, history, risk factors |

## Roadmap To 90%

| Stage | Target | Evidence Required |
| --- | --- | --- |
| ECG question completion | 1,000+ ECG questions | Enriched questions with rationales, hints, pearls, memory anchors, blueprint mapping |
| Deterioration pathway completion | 500+ pathways | Recognition, interpretation, prioritization, intervention, escalation, outcome |
| Telemetry workflow registry | Countable workflow inventory | Workflow type, patient load, alarm priority, documentation, escalation |
| Medication-ECG integration | Medication-risk mapping | ECG effects, dangerous findings, monitoring priorities, escalation triggers |
| Simulation integration | ECG cases mapped to readiness | Rhythm recognition, deterioration response, emergency communication, documentation |

## Priority Queue

| Priority | Workstream | Why It Matters |
| ---: | --- | --- |
| 1 | ECG deterioration pathways | Largest measured gap and highest safety value |
| 2 | ECG question expansion | Required for practice, CAT eligibility, and remediation |
| 3 | Telemetry workflow inventory | Converts ECG from memorization to real clinical monitoring |
| 4 | Medication-ECG safety | Connects pharmacology, ECG, labs, and deterioration |
| 5 | Pediatric ECG cases | Supports pediatric emergency and clinical judgment expansion |

