# Question Ecosystem Standardization And Editorial Consistency System

## Purpose

This system ensures learners cannot tell whether a question was created, imported, migrated, translated, generated, or manually authored in a different production era.

Every RN, PN, and NP question should feel as if it came from one expert NurseNest editorial team.

## Source Of Truth

Standardization evaluator:

`src/lib/questions/question-editorial-standardization.ts`

Report runner:

`scripts/audit-question-ecosystem-standardization.mts`

Contract test:

`src/lib/questions/question-editorial-standardization.contract.test.ts`

Reports:

`docs/reports/question-standardization/`

## Exam Scope

### RN

- NCLEX-RN US
- NCLEX-RN Canada

### PN

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

Future scope includes UK, Australia, New Zealand, international, French, and Spanish pathways.

## Rationale Framework

Every rationale should consistently include:

1. Why the correct answer is correct
   - Clinical reasoning
   - Priority framework
   - Patient safety implications

2. Clinical context
   - Pathophysiology
   - Assessment findings
   - Intervention rationale

3. Exam relevance
   - Why the concept appears on licensing exams
   - Common testing concepts and traps

## Distractor Framework

Every incorrect answer must teach:

- Why it seems attractive
- Why it is wrong
- Better thinking process for future questions

Distractors are not throwaway options. Each wrong answer should represent a plausible learner error.

## Hint Framework

Hints must guide reasoning without revealing the answer.

Allowed cue types:

- Assessment cue
- Safety cue
- Priority cue
- Clinical reasoning cue

Hints must never name the correct answer, identify option letters, or eliminate options directly.

## Clinical Pearl Framework

Every pearl must be:

- Memorable
- Clinically useful
- Applicable beyond the question

Strong pearls include safety rules, priority rules, delegation principles, pharmacology warnings, escalation triggers, or pattern-recognition cues.

Weak pearls restate the answer or offer generic advice.

## Memory Anchor Framework

Every question should include one memorable hook:

- Mnemonic
- Clinical pattern
- Recognition rule
- Priority shortcut

The memory anchor should be short enough to carry into flashcards, review mode, daily questions, and email.

## Difficulty Calibration

| Difficulty | Meaning |
| --- | --- |
| Easy | Knowledge recall |
| Moderate | Clinical application |
| Hard | Clinical judgment |
| Advanced | High-level prioritization |
| Expert | NP-level management decisions |

Expert-level calibration is reserved for NP pathways unless explicitly justified.

## Cognitive Level Framework

Supported cognitive classifications:

- Recall
- Application
- Analysis
- Prioritization
- Delegation
- Clinical Judgment
- Management
- Leadership
- Diagnostic Reasoning

Unsupported or missing classifications are flagged.

## Flashcard Generation Framework

Every question must produce:

- Flashcard front: high-yield concept
- Flashcard back: clinical answer
- Clinical pearl
- Memory anchor
- Exam relevance

No additional flashcard writing should be required after a question is standardized.

## Daily Question Framework

Every question should be reusable as:

- Daily email question
- Daily app question
- Push notification question
- Social media question

The stem must be clear, self-contained, and not dependent on hidden surrounding context.

## Adaptive Learning Framework

Every question should support:

- Weak area review
- Remediation
- Study plans
- Readiness prediction
- CAT selection
- Practice exam selection
- Performance analytics

The evaluator checks topic, subtopic, blueprint, difficulty, adaptive eligibility, and flashcard linkage.

## NGN Consistency

The same editorial rules apply to:

- Bowties
- Matrix questions
- Case studies
- Trend questions
- Delegation questions
- Documentation questions
- Prioritization questions

NGN rationales should explicitly teach cue recognition, prioritization, action selection, monitoring, documentation, or workflow reasoning.

## Editorial Style Guide

Use professional nursing language.

Avoid:

- AI clichés
- Generic wording
- Overly academic language
- Unnecessary jargon
- Promotional language
- Region-specific idioms unless region metadata is present

Maintain:

- Consistency
- Clarity
- Clinical realism
- Translation readiness

## Global Translation Readiness

Questions should avoid idioms, contractions, slang, and region-specific shorthand unless clearly mapped to a locale.

The evaluator flags wording that may not translate cleanly into French, Spanish, Hindi, Portuguese, Arabic, German, Japanese, Korean, Chinese, and future languages.

## Generated Reports

The runner produces:

1. `rn-standardization-audit.md`
2. `pn-standardization-audit.md`
3. `np-standardization-audit.md`
4. `rationale-consistency-report.md`
5. `hint-consistency-report.md`
6. `clinical-pearl-consistency-report.md`
7. `flashcard-consistency-report.md`
8. `ngn-consistency-report.md`
9. `translation-readiness-report.md`
10. `ecosystem-quality-score.md`

## Running The Audit

Use a reachable read-only staging or production database:

```bash
npx tsx scripts/audit-question-ecosystem-standardization.mts
```

Optional row cap:

```bash
NN_QUESTION_STANDARDIZATION_AUDIT_LIMIT=5000 npx tsx scripts/audit-question-ecosystem-standardization.mts
```

## Publication Rule

Standardization does not replace clinical review. Questions below `90/100` or with high/critical standardization issues must remain out of publication until remediated and reviewed.
