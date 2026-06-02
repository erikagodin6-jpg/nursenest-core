# Question Quality Dashboard V2

Date: 2026-06-01
Status: Premium learning-quality scoring dashboard specification

Source of truth: `src/lib/questions/question-quality-score.ts`.

No public routes, learner-facing pages, navigation, or publication surfaces are created by this dashboard specification.

## Purpose

Question Quality Score V2 measures educational effectiveness, not just formatting completeness. The engine rewards items that teach clinical judgment, realistic workflow, escalation, failure-to-rescue prevention, distractor intelligence, remediation, and readiness-domain integration.

## Executive Metrics

| Metric | Source | Target |
| --- | --- | ---: |
| Average question quality score | `scoreQuestionQuality().score` | 95 |
| Flagship-ready count | `gate = flagship_ready` | Increasing |
| Review queue | `gate = review_required` | Decreasing |
| Critical failures | Issues with `severity = critical` | 0 |
| Pathway scores | Average by pathway/profession | 95 |
| Topic scores | Average by topic/body system | 95 |

## V2 Dimensions

| Dimension | What It Rewards |
| --- | --- |
| Clinical realism | Patient context, clinical cues, incomplete information, competing priorities, time pressure |
| Workflow realism | Realistic assessment, monitoring, team communication, documentation, delegation, reassessment |
| Escalation quality | When to escalate, who to escalate to, why escalation matters |
| Failure-to-rescue coverage | Deterioration recognition, timely intervention, timely escalation |
| Distractor intelligence | Plausible wrong answers mapped to misconception, safety risk, remediation, readiness domain |
| Remediation value | Links to lessons, flashcards, simulations, ECG, labs, pharmacology, and related topics |
| Readiness integration | Clinical judgment, patient safety, medication safety, escalation, communication, documentation |

## Flagship-Ready Gate

A question is `flagship_ready` only when:

- Score is at least `95`
- No warnings, errors, or critical issues
- Distractor intelligence is at least `95`
- Rationale quality is at least `95`
- Hint quality is at least `80`
- Clinical pearl quality is at least `95`

## Review Queue Rules

Questions enter the review queue when they show:

- Weak clinical realism
- Missing workflow context
- Weak escalation teaching
- Missing failure-to-rescue coverage on high-risk topics
- Weak distractor intelligence
- Thin remediation assets
- Thin readiness-domain mapping

## Dashboard Tables

### Pathway Scores

| Pathway | Average Score | Flagship Ready | Review Queue | Critical Failures | Lowest Dimension |
| --- | ---: | ---: | ---: | ---: | --- |
| RN | Pending audit integration | Pending | Pending | Pending | Pending |
| RPN / PN | Pending audit integration | Pending | Pending | Pending | Pending |
| NP | Pending audit integration | Pending | Pending | Pending | Pending |
| ECG | Pending audit integration | Pending | Pending | Pending | Pending |
| Labs | Pending audit integration | Pending | Pending | Pending | Pending |
| Pharmacology | Pending audit integration | Pending | Pending | Pending | Pending |

### Topic Scores

| Topic | Average Score | Failure-To-Rescue Coverage | Distractor Intelligence | Remediation Value | Readiness Integration |
| --- | ---: | ---: | ---: | ---: | ---: |
| Sepsis | Pending audit integration | Pending | Pending | Pending | Pending |
| Shock | Pending audit integration | Pending | Pending | Pending | Pending |
| ACS | Pending audit integration | Pending | Pending | Pending | Pending |
| Stroke | Pending audit integration | Pending | Pending | Pending | Pending |
| Respiratory Failure | Pending audit integration | Pending | Pending | Pending | Pending |
| Hyperkalemia | Pending audit integration | Pending | Pending | Pending | Pending |

## Implementation Notes

This dashboard is a governance/reporting artifact. Live aggregation should be added only through an admin-only reporting surface or CI report, not learner-facing UI.
