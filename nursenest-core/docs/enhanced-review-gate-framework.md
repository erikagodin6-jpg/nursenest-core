# Enhanced Review Gate Framework

Date: 2026-06-01
Status: High-risk question review gate

Source of truth: `docs/question-quality-audit.md` and `src/lib/questions/question-quality-score.ts`.

Future academies remain locked: `published=false`, `launchReady=false`, `visibleInNavigation=false`, `indexable=false`, `adminOnly=true`.

## Enhanced Review Required For

| Content Area | Required Reviewer Type |
| --- | --- |
| Critical Care | ICU nurse educator or critical care clinician |
| Emergency | Emergency nurse educator or emergency clinician |
| Pediatrics | Pediatric nurse educator or pediatric clinician |
| NP | NP educator or specialty-aligned advanced practice clinician |
| Pharmacology | Pharmacology educator, medication safety reviewer, or prescriber for prescribing content |
| Complex ECG | Telemetry, emergency, critical care, or cardiology-aligned reviewer |

## Automated Review Flags

The scorer flags high-risk items when topic, pathway, profession, question type, or stem indicate:

- `critical_care`
- `pediatric`
- `np`
- `pharmacology`
- `emergency`
- `complex_ecg`

## Quality Thresholds

| Gate | Minimum |
| --- | ---: |
| Overall score for publication | 85+ |
| Overall score for flagship | 95+ |
| Rationale quality | 95+ target |
| Hint quality | 95+ target |
| Clinical pearl quality | 95+ target |
| Distractor quality | 95+ target for flagship |

## Escalation Process

| Finding | Action |
| --- | --- |
| Unsafe clinical claim | Block publication and send to clinical reviewer |
| Role-scope mismatch | Block publication and send to role-specific reviewer |
| Medication/prescribing uncertainty | Block publication and require pharmacology/prescriber review |
| Pediatric dosing or age-specific issue | Block publication and require pediatric review |
| ECG deterioration or rhythm ambiguity | Block publication and require ECG reviewer |
| Generic rationale or weak distractor | Editorial rewrite before clinical sign-off |

## Publish Approval Process

1. Automated score generated.
2. Required fields verified.
3. Enhanced review flags assigned.
4. Editorial review resolves structure, wording, hint, pearl, and distractor issues.
5. Clinical reviewer approves high-risk accuracy and scope.
6. Related content links are verified.
7. Status may move to publish eligible only if all blockers are closed.

