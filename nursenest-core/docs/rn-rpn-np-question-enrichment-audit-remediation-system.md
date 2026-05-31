# RN / RPN / NP Question Enrichment Audit And Remediation System

## Purpose

This system audits RN, RPN/PN, and NP questions and determines whether each question is reusable as a full educational asset.

The objective is quality, not count inflation. A question is not publication-ready until it is:

- Flashcard-ready
- Practice-exam-ready
- CAT-ready
- Adaptive-learning-ready
- Publication-ready
- Monetization-ready

## Source Of Truth

Audit engine:

`src/lib/questions/question-enrichment-governance.ts`

DB-backed report runner:

`scripts/audit-rn-rpn-np-question-enrichment.mts`

Contract test:

`src/lib/questions/question-enrichment-governance.contract.test.ts`

Reports:

`docs/reports/question-enrichment/`

## Exam Scope

### RN

- NCLEX-RN
- US NCLEX-RN variants
- Canadian NCLEX-RN variants

### RPN / PN

- REx-PN
- NCLEX-PN

### NP

- CNPLE
- FNP
- AGPCNP
- PMHNP
- PNP-PC
- WHNP
- ENP

## Required Enrichment Fields

Every audited question is checked for:

- Correct answer
- Correct rationale
- Distractor rationales
- Hint
- Clinical pearl
- Exam trap
- Memory anchor
- Flashcard output
- Metadata
- Blueprint mapping
- Difficulty rating
- Cognitive classification

## Rationale Standard

Correct-answer rationales must be `75-200` words and teach:

- Clinical reasoning
- Pathophysiology
- Nursing judgment
- Safety implications
- Priority concepts

Rationales below `75` words are flagged as incomplete.

## Distractor Standard

Every incorrect option must explain:

- Why it is incorrect
- Why learners choose it
- How to avoid the mistake

Distractor rationales below `25` words are flagged as incomplete.

## Scoring

The audit assigns `0-100` scores for:

- Clinical Accuracy
- Educational Quality
- Exam Realism
- Adaptive Value
- Publication Readiness
- Overall Quality
- Rationale Quality
- Distractor Quality
- Flashcard Reusability
- Practice Exam Readiness
- CAT Readiness

## Thresholds

| Score | Band | Action |
| ---: | --- | --- |
| 90-100 | Excellent | Publishable if all required fields and reviews pass |
| 80-89 | Needs Improvement | Remediate |
| < 80 | Major Revision Required | Do Not Publish |

The global NurseNest publication threshold remains `90/100`.

## Safe Remediation Rule

The system can generate remediation drafts for:

- Flashcard front
- Flashcard back
- Clinical pearl carry-forward
- Memory anchor carry-forward
- Exam relevance label
- Authoring task list

Generated drafts are never marked publishable.

Missing rationales, distractor explanations, hints, pearls, exam traps, memory anchors, metadata, and blueprint mappings must pass clinical and educational review before publication.

This prevents automated filler from entering production.

## Generated Reports

The runner produces:

- `rn-audit-report.md`
- `rpn-audit-report.md`
- `np-audit-report.md`
- `blueprint-coverage-report.md`
- `question-quality-report.md`
- `flashcard-readiness-report.md`
- `practice-exam-readiness-report.md`
- `cat-readiness-report.md`
- `publication-readiness-report.md`
- `monetization-readiness-report.md`
- `estimated-remediation-work-remaining.md`
- `question-enrichment-audit.json` when database access succeeds

## Running The Audit

Use a reachable read-only staging or production database:

```bash
npx tsx scripts/audit-rn-rpn-np-question-enrichment.mts
```

Optional row cap:

```bash
NN_QUESTION_ENRICHMENT_AUDIT_LIMIT=5000 npx tsx scripts/audit-rn-rpn-np-question-enrichment.mts
```

## Current Environment Note

In this workspace, the configured database URL points to `HOST:5432`, so the live inventory cannot be queried. The runner still creates the required report files with the database failure reason and can be rerun unchanged when a valid database is available.
