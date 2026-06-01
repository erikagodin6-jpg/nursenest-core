# Question Scoring Framework

Date: 2026-06-01
Status: V2 question quality scoring model

Source of truth: `src/lib/questions/question-quality-score.ts`.

## Scored Dimensions

The V2 scorer evaluates:

| Dimension | Weight | What It Measures |
| --- | ---: | --- |
| Stem quality | 4% | Clinical context, relevant cues, decision point |
| Clinical accuracy | 8% | Placeholder detection, unsafe absolutes, clinical cue integrity |
| Clinical realism | 11% | Patient-specific detail, incomplete information, time pressure, and bedside plausibility |
| Workflow realism | 6% | Realistic assessment, monitoring, delegation, team, and documentation workflow |
| Escalation quality | 7% | Provider notification, charge nurse escalation, rapid response, emergency response |
| Failure-to-rescue coverage | 8% | Deterioration recognition, delayed intervention, delayed escalation |
| Educational value | 5% | Teaching completeness, application, related topics |
| Reasoning quality | 12% | Decision-rule teaching, patient safety, cue interpretation |
| Distractor quality | 5% | Wrong-answer rationale completeness |
| Distractor intelligence | 11% | Plausibility, misconception clarity, safety risk, remediation, readiness domains |
| Rationale quality | 11% | Depth, specificity, why-correct and clinical application |
| Hint quality | 4% | Reasoning guidance without answer leakage |
| Clinical pearl quality | 4% | Bedside relevance and transferability |
| Remediation value | 6% | Related lessons, flashcards, simulations, ECG, labs, pharmacology |
| Readiness integration | 6% | Clinical judgment, safety, medication, escalation, communication, documentation mapping |
| Exam relevance | 2% | Exam strategy, pathway alignment, duplicate detection |

## Score Gates

| Score | Gate | Meaning |
| ---: | --- | --- |
| <70 | Fail | Do not publish |
| 70-84 | Review required | Remediation required before publication |
| 85-94 | Publish eligible | Eligible after required review |
| 95+ with no warnings or critical issues | Flagship ready | Eligible for flagship library, demos, and premium screenshots |

## Implementation Notes

- `scoreQuestionQuality()` now returns both `status` and `gate`.
- `status` preserves existing behavior: `do_not_publish`, `needs_review`, `publish_ready`.
- `gate` adds V2 market-quality granularity: `fail`, `review_required`, `publish_eligible`, `flagship_ready`.
- Critical issues cap the effective score below publish eligibility.
- Enhanced review flags remain independent of score and still require human review for high-risk content.

## Required CI Direction

Future CI should fail when published or launch-ready question assets:

- Score below 85
- Lack required fields from the V2 contract
- Have answer-revealing hints
- Have generic rationale patterns
- Have missing distractor rationales
- Have high-risk flags without review evidence
