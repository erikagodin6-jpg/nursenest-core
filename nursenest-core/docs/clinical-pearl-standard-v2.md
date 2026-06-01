# Clinical Pearl Standard V2

Date: 2026-06-01
Status: Premium clinical pearl transformation standard

Source of truth: `docs/content-quality/clinical-pearl-rubric.md`, `docs/content-quality/clinical-pearl-audit.md`, and `src/lib/questions/clinical-pearl-score.ts`.

## Purpose

Clinical pearls must provide memorable, practice-ready insight. They should help a learner recognize risk, avoid a common mistake, or transfer reasoning to a future patient.

## Reject Pearls That Are

- Generic
- Textbook definitions
- Obvious reminders
- Rationale restatements
- Repeated across many unrelated questions
- Not clinically actionable
- Missing exam relevance

## Required Pearl Qualities

| Quality | Standard |
| --- | --- |
| Bedside relevance | Helps the learner act, monitor, escalate, teach, document, or reassess |
| Exam relevance | Clarifies how exams test the concept |
| High-risk recognition | Emphasizes red flags, traps, or early deterioration cues where applicable |
| Practice-ready insight | Can be remembered and used in clinical practice |
| Specificity | Names the cue, condition, medication, lab, ECG finding, or workflow risk |

## Strong Pearl Examples

| Topic | Strong Pearl Pattern |
| --- | --- |
| Sepsis | New confusion with infection can be an early hypoperfusion cue, especially with hypotension or tachypnea |
| Hyperkalemia | Hyperkalemia becomes immediately dangerous when ECG changes appear |
| Delegation | Delegate tasks, not accountability; unstable assessments stay with the nurse |
| Opioids | Sedation often appears before respiratory depression, so reassessment is a safety intervention |

## Quality Gate

| Pearl Score | Action |
| ---: | --- |
| <70 | Rewrite required |
| 70-84 | Review required |
| 85-94 | Publish eligible |
| 95+ | Flagship quality |

