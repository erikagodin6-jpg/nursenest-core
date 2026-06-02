# Rationale Style Guide V2

Date: 2026-06-01
Status: Premium rationale rewrite standard

Source of truth: `docs/question-quality-audit.md`, `docs/content-quality/rationale-contract-v2.md`, and `src/lib/questions/rationale-quality-score.ts`.

## Purpose

Rationales must teach clinical judgment. They should not merely justify the keyed answer or repeat a template.

## Rejected Patterns

Reject rationale language that relies on:

- "is correct because"
- "option X is incorrect because"
- "not the best answer"
- "less appropriate"
- "review the material"
- Repeated generic wording across unrelated items
- Copy-paste reasoning that does not reference the scenario
- Rationale text that restates the answer without teaching

## Required Rationale Structure

| Section | Requirement |
| --- | --- |
| Patient-specific cue interpretation | Explain which cues matter and why |
| Why correct | Connect answer to the most urgent or most accurate cue |
| Why incorrect | Explain each distractor with clinical consequence |
| Decision rule | Teach a reusable rule learners can transfer |
| Patient safety | Explain what could happen if the cue is missed |
| Clinical application | Show how this appears in real workflow |
| Exam application | Explain how licensing or certification exams test the concept |

## Style Requirements

| Requirement | Standard |
| --- | --- |
| Scenario-specific reasoning | Mention the actual finding, lab, medication, role, or clinical change from the stem |
| Patient-specific reasoning | Tie reasoning to the patient's current risk, not only the diagnosis |
| Decision-rule teaching | Make the learner better at the next question |
| Safety implications | Include risk of delay, omission, wrong priority, or unsafe scope |
| Clinical application | Describe what the nurse, NP, or learner should monitor, communicate, document, or evaluate |

## Minimum Depth

| Question Type | Minimum Rationale Depth |
| --- | --- |
| Basic recall | 75+ words if published; avoid recall-only when clinical context is possible |
| Clinical application | 100+ words |
| Prioritization, delegation, safety | 125+ words |
| NGN, case, bowtie, matrix, trend | 150+ words plus option-level reasoning |
| NP diagnostic or prescribing | 175+ words plus differential/management reasoning |

## Rewrite Example Pattern

Poor:

`Option A is correct because it is the priority. Option B is incorrect because it is not the best answer.`

Premium:

`The hypotension, new confusion, tachypnea, and cool mottled skin indicate impaired perfusion in a client with suspected infection. The priority is escalation and focused reassessment because delayed sepsis response increases risk for shock and organ injury. Teaching and routine documentation are appropriate after stabilization, but they do not address the immediate circulation threat.`

