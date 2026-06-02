# Hint Quality Framework

Date: 2026-06-01
Status: Premium hint quality standard

Source of truth: `docs/hint-quality-rubric.md`, `docs/question-quality-audit.md`, and `src/lib/questions/question-quality-score.ts`.

## Purpose

Hints should teach reasoning without giving away the answer.

## Reject Hints That

- Reveal the answer
- Reference option letters
- Use answer terminology directly
- Eliminate distractors directly
- Are a single word
- Say only "think about priorities" without naming a cue type
- Repeat the stem without guidance

## Approved Hint Types

| Hint Type | Standard |
| --- | --- |
| Clinical reasoning prompt | Directs learner to connect cues to risk |
| Cue-identification prompt | Asks learner to identify which finding is abnormal or changing |
| Prioritization prompt | Directs learner to immediate threat, ABCs, safety, or instability |
| Scope prompt | Asks what the learner's role permits or requires |
| Trend prompt | Directs learner to compare current and previous findings |
| Safety prompt | Directs learner to harm prevention without naming the answer |

## Examples

Poor:

`Choose oxygen.`

Poor:

`Look at option B.`

Premium:

`Identify which cue represents the greatest immediate threat to airway, breathing, circulation, or perfusion.`

Premium:

`Before choosing an intervention, decide whether the patient is stable or showing signs of deterioration.`

## Quality Gate

| Hint Score | Action |
| ---: | --- |
| <70 | Rewrite required |
| 70-84 | Editorial review |
| 85-94 | Publish eligible |
| 95+ | Flagship quality |

