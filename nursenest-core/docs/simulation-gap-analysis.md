# Simulation Gap Analysis

Date: 2026-06-01
Status: Revenue pathway simulation gap analysis

Source of truth: `docs/high-priority-content-gaps.md`, supported by `src/lib/physiology-monitor/simulation-catalog.ts` counts emitted in `docs/content-instrumentation-report.md`.

No new simulations, public pages, routes, navigation, or learner-facing products are created by this analysis.

## Current Simulation Inventory

| Profession | Exact Simulation References | Target | Gap | Current % |
| --- | ---: | ---: | ---: | ---: |
| RN | 33 | 250 | 217 | 13.2% |
| RPN | 8 | 150 | 142 | 5.3% |
| NP | 18 | Specialty-specific target not standardized | Not scoreable | Not scoreable |
| RT | 12 | Future academy target, not current revenue pathway | Deferred | Deferred |
| New Graduate | 11 | Future/new-grad target, not current RN exam target | Deferred | Deferred |

## High-Risk Simulation Coverage

| Topic | Exact Simulation References | Current Finding |
| --- | ---: | --- |
| Sepsis | 13 | Strongest current high-risk simulation base, still below full loop parity |
| Shock | 8 | Needs RN/RPN/NP role-specific branching and escalation mapping |
| ACS | 5 | Needs telemetry, medication safety, and deterioration simulations |
| Stroke | 3 | Needs acute recognition, escalation, and post-stroke complication simulations |
| Respiratory Failure | 8 | Needs oxygenation, ventilation, ABG, and escalation simulations |
| DKA | 3 | Needs fluids, potassium, insulin safety, and trend evaluation simulations |
| Hyperkalemia | 4 | Needs ECG integration and medication/lab monitoring simulations |
| GI Bleed | 1 | Critical simulation gap |

## Complete Inventory Plan

| Priority | Topic | RN Simulation Plan | RPN Simulation Plan | NP Simulation Plan |
| ---: | --- | --- | --- | --- |
| 1 | Sepsis | Recognition, bundle priorities, reassessment, escalation | Recognition, monitoring, reporting, ordered care | Differential, diagnostics, antimicrobials, follow-up |
| 2 | Shock | Shock differentiation, perfusion, escalation, monitoring | Unstable cue recognition and urgent escalation | Cause identification, diagnostics, management plan |
| 3 | ACS | Chest pain, ECG escalation, medication safety | Recognition, monitoring, reporting, safety | Diagnostic workup, risk stratification, management |
| 4 | Stroke | Last-known-well, neuro checks, swallow safety | Recognition, glucose check, escalation | Differential, imaging pathway, secondary prevention |
| 5 | Respiratory Failure | Work of breathing, oxygenation, ABGs, escalation | Recognition, oxygen safety, reporting | Differential, diagnostics, management decisions |
| 6 | DKA | Fluid/electrolyte/insulin safety | Monitoring, escalation, hypoglycemia prevention | Diagnostics, order interpretation, transition planning |
| 7 | Hyperkalemia | ECG changes, monitoring, urgent response | Recognition, cardiac monitoring, reporting | Cause analysis, medication adjustment, follow-up |
| 8 | GI Bleed | Hemodynamic trend, transfusion readiness, escalation | Monitoring, orthostasis, reporting | Diagnostics, medication review, referral |

## Simulation Priority Scorecard

| Initiative | Current % | Target % | Gap % | Effort Basis | Expected ROI | Priority Score |
| --- | ---: | ---: | ---: | --- | --- | ---: |
| RN simulation expansion | 13.2% | 95%+ | 81.8 | 217 missing simulation references | High retention and institutional value | 96 |
| RPN simulation expansion | 5.3% | 95%+ | 89.7 | 142 missing simulation references | High practical readiness value | 96 |
| High-risk simulation mapping | Incomplete | 95%+ | Not scoreable | Missing pathway/topic readiness mapping | Highest clinical safety value | 98 |
| NP simulation baseline | Not scoreable | 90%+ | Not scoreable | Specialty targets not standardized | Medium-high premium value | 82 |

