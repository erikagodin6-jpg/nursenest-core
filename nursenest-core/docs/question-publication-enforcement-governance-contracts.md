# Question Publication Enforcement And Governance Contracts

## Purpose

This phase converts NurseNest question quality standards from recommendations into enforceable publication contracts.

Any question failing required standards must be removed from publication eligibility until remediated and reviewed.

## Source Of Truth

Enforcement engine:

`src/lib/questions/question-publication-enforcement-contracts.ts`

Contract test:

`src/lib/questions/question-publication-enforcement-contracts.contract.test.ts`

Dashboard runner:

`scripts/audit-question-publication-enforcement.mts`

Dashboard outputs:

`docs/reports/question-enforcement/`

## Blocking Statuses

| Status | Meaning |
| --- | --- |
| `BLOCKED_FROM_PUBLICATION` | Required publication component or minimum score is missing |
| `RATIONALE_REWRITE_REQUIRED` | Rationale fails length, reasoning, safety, or teaching contract |
| `HINT_REWRITE_REQUIRED` | Hint reveals answer, option letters, or answer terminology |
| `PEARL_REWRITE_REQUIRED` | Clinical pearl is generic, repeated, non-actionable, or missing |
| `FLASHCARD_REWRITE_REQUIRED` | Flashcard output is one-word, definition-only, duplicate-prone, or lacks clinical use |
| `DUPLICATE_REVIEW_REQUIRED` | Similarity threshold exceeded |
| `TRANSLATION_REWRITE_REQUIRED` | Idiom, slang, ambiguity, or translation risk detected |
| `NOT_CAT_ELIGIBLE` | CAT requirements are missing |
| `NOT_PRACTICE_EXAM_ELIGIBLE` | Practice exam requirements are missing |
| `NOT_ADAPTIVE_READY` | Weak-area, related-topic, or remediation mapping is missing |
| `PUBLICATION_ELIGIBLE` | No blocking contract failed |

## Required Question Fields

A question is blocked from publication if any are missing:

- Correct rationale
- Distractor rationales
- Hint
- Clinical pearl
- Memory anchor
- Difficulty rating
- Cognitive level
- Blueprint mapping
- Topic mapping
- Flashcard output

## Rationale Contract

Reject rationales when they:

- Are under `75` words
- Merely restate the answer
- Do not explain reasoning
- Do not reference patient safety
- Do not teach the learner

Status:

`RATIONALE_REWRITE_REQUIRED`

## Hint Contract

Reject hints when they:

- Reveal the answer
- Reference option letters
- Eliminate distractors directly
- Contain answer terminology

Status:

`HINT_REWRITE_REQUIRED`

## Clinical Pearl Contract

Reject clinical pearls when they:

- Are generic
- Are repeated elsewhere
- Merely restate the rationale
- Are not clinically actionable

Status:

`PEARL_REWRITE_REQUIRED`

## Flashcard Contract

Reject flashcard output when it is:

- One-word answer
- Definition only
- Missing clinical application
- Duplicate-prone

Status:

`FLASHCARD_REWRITE_REQUIRED`

## Duplicate Detection Contract

Flag content when:

- Question similarity `> 85%`
- Rationale similarity `> 90%`
- Clinical pearl similarity `> 90%`
- Flashcard similarity `> 90%`

Status:

`DUPLICATE_REVIEW_REQUIRED`

## Translation Readiness Contract

Reject content when it contains:

- Idiomatic language
- Region-specific slang
- Untranslatable wording
- Translation ambiguity

Status:

`TRANSLATION_REWRITE_REQUIRED`

## CAT Eligibility Contract

Reject CAT eligibility when:

- Difficulty is missing
- Blueprint mapping is missing
- Distractors are weak
- Discrimination value is missing
- Remediation mapping is missing

Status:

`NOT_CAT_ELIGIBLE`

## Practice Exam Eligibility Contract

Reject practice exam eligibility when:

- Rationale is missing
- Hint is missing
- Clinical pearl is missing
- Flashcard output is missing

Status:

`NOT_PRACTICE_EXAM_ELIGIBLE`

## Adaptive Learning Contract

Reject adaptive readiness when:

- Weak-area mapping is missing
- Related-topic mapping is missing
- Remediation pathway is missing

Status:

`NOT_ADAPTIVE_READY`

## Required Minimum Scores

| Score | Minimum |
| --- | ---: |
| Clinical Accuracy | 95 |
| Educational Value | 90 |
| Exam Realism | 90 |
| Publication Readiness | 90 |
| Overall Ecosystem Score | 90 |

Anything below threshold is blocked until remediated.

## Continuous Audit Requirements

Run the dashboard runner on:

- Every deployment
- Every content import
- Every AI generation batch
- Every translation batch

Generated dashboards:

- RN Quality Dashboard
- PN Quality Dashboard
- NP Quality Dashboard
- International Quality Dashboard
- Translation Quality Dashboard

## Running The Audit

```bash
npx tsx scripts/audit-question-publication-enforcement.mts
```

Optional limit:

```bash
NN_QUESTION_ENFORCEMENT_AUDIT_LIMIT=5000 npx tsx scripts/audit-question-publication-enforcement.mts
```
