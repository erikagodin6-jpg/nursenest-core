# Distractor Quality Framework

Date: 2026-06-01
Status: Premium distractor design standard

Source of truth: `src/lib/questions/distractor-quality-score.ts` and `docs/question-quality-audit.md`.

## Required Distractor Taxonomy

Every incorrect answer must map to at least one misconception type:

| Distractor Type | Learner Error Tested |
| --- | --- |
| Priority error | Chooses a lower-priority action before the immediate concern |
| Timing error | Chooses an action that is correct but too early or too late |
| Assessment error | Misses or misreads a cue, trend, or finding |
| Scope error | Assigns action to the wrong role or exceeds scope |
| Safety error | Ignores a contraindication, deterioration cue, or risk |
| Interpretation error | Misinterprets lab, ECG, assessment, diagnostic, or trend data |
| Communication error | Communicates too late, to the wrong person, or without needed information |
| Documentation error | Documents before acting, omits required documentation, or charts unsafely |

## Required Distractor Explanation

Every distractor requires:

| Field | Standard |
| --- | --- |
| Why it is tempting | Explains why a learner might reasonably choose it |
| Why it is incorrect | Explains the clinical flaw |
| Potential consequence | Explains what could happen if selected in practice |

## Quality Rules

Reject distractors that are:

- Obviously absurd
- Repeated wording with minor changes
- Non-clinical filler
- "All of the above" or "none of the above" unless there is a specific exam-valid reason
- Correct but not differentiated by timing, priority, scope, or safety
- Missing a rationale
- Missing the consequence of the wrong choice

## Scoring Standard

| Score | Gate |
| ---: | --- |
| <70 | Fail |
| 70-84 | Review |
| 85-94 | Publish eligible |
| 95+ | Flagship |

Flagship questions must have distractors that are clinically plausible enough that a prepared but rushed learner could choose them.

