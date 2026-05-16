# Lesson Taxonomy Authority

This document defines the canonical lesson-title and duplicate-suppression policy for NurseNest lesson hubs.

## Purpose

Lesson hubs must be easy to scan, medically coherent, and stable across generated imports. A learner should see a clean clinical topic list, not multiple variants of the same concept.

Use simple canonical medical topic titles:

- `COPD`
- `Asthma`
- `Heart Failure`
- `Stroke`
- `Diabetes`
- `Hypertension`
- `Sepsis`
- `Atrial Fibrillation`
- `Supraventricular Tachycardia (SVT)`

Do not use fragmented teaching-objective titles as separate hub lessons:

- `COPD Management`
- `COPD Nursing Care`
- `Nursing Interventions for COPD`
- `Heart Failure Discharge Teaching`
- `A Fib Review`
- `SVT Basics`

Those concepts belong inside the canonical lesson sections, not in the hub title.

## Source of truth

The runtime canonicalization layer is:

```txt
src/lib/lessons/canonical-lesson-title-normalization.ts
```

The generated-index integration is:

```txt
scripts/build-normalized-lesson-indexes.runner.mts
```

The catalog-level cleanup utility is:

```txt
scripts/normalize-lesson-titles-and-deduplicate.mjs
```

The CI guard is embedded in:

```txt
src/lib/lessons/pathway-lesson-catalog-redundancy.test.ts
```

## Canonical title rule

A lesson hub title should answer: “What clinical topic is this?”

It should not answer:

- how the lesson teaches it
- which exam it supports
- whether it includes management
- whether it includes assessment
- whether it includes patient teaching
- whether it includes nursing interventions

The lesson body should contain those subsections.

## Normalized wording

| Variant | Canonical |
|---|---|
| COPD Management | COPD |
| COPD Nursing Care | COPD |
| Chronic Obstructive Pulmonary Disease Fundamentals | COPD |
| CHF Overview | Heart Failure |
| Heart Failure Discharge Teaching | Heart Failure |
| CVA Nursing Care | Stroke |
| Nursing Assessment of Stroke | Stroke |
| A Fib Review | Atrial Fibrillation |
| Atrial Fib NCLEX Review | Atrial Fibrillation |
| SVT Basics | Supraventricular Tachycardia (SVT) |
| Diabetes Mellitus Pharmacology | Diabetes |
| Hypertension Patient Teaching | Hypertension |

## Duplicate policy

Within a pathway, there should be one visible hub lesson per canonical topic.

If multiple same-topic variants exist, the generated index keeps the strongest canonical lesson and suppresses weaker duplicates.

Strength is determined conservatively by:

1. section count
2. body/content length
3. stable slug ordering as final tie-breaker

Suppressed duplicates remain redirect-safe through `canonicalDuplicateRedirects` in generated indexes.

## Cross-tier policy

Cross-tier variants are allowed because clinical depth and scope differ by learner tier.

For example, `COPD` can exist in:

- RPN / REx-PN
- RN
- NP / CNPLE
- Allied Health

But each pathway should show only one visible `COPD` lesson in its hub.

Tier-specific differences should live in:

- scoped overlays
- lesson sections
- pathway-specific learning objectives
- role/scope-specific subsections

They should not create hub duplicates like:

- `COPD for RPNs`
- `COPD Management`
- `COPD Nursing Care`

## Legitimate split lessons

Some lessons should remain separate because they are clinically distinct.

Allowed splits include:

- acute vs chronic presentations, such as `COPD Exacerbation`
- adult vs pediatric/neonatal/obstetric contexts, such as `Pediatric Asthma`
- procedural or OSCE lessons
- delegation, prioritization, and scope-of-practice lessons
- ECG interpretation lessons
- NP prescribing or differential diagnosis lessons

Do not collapse these into the parent condition unless the content is actually duplicative.

## Content-generation instruction

When generating or importing lessons, use this rule:

> One clinical condition/topic equals one canonical visible lesson title per pathway. Teaching objectives belong inside the lesson, not in separate hub titles.

Preferred lesson structure:

- overview
- pathophysiology
- assessment
- diagnostics
- pharmacology
- nursing management/interventions
- patient teaching
- complications
- escalation/red flags
- exam traps
- role-specific notes

## Validation commands

Run these before publishing lesson taxonomy changes:

```bash
npm run build:lesson-indexes
npm run test:lesson-catalog
npm run verify:lesson-indexes
npm run content:source-of-truth:verify
```

For catalog-level remediation, preview first:

```bash
node scripts/normalize-lesson-titles-and-deduplicate.mjs --dry-run
```

Only apply after reviewing the output:

```bash
node scripts/normalize-lesson-titles-and-deduplicate.mjs --write
```

## Publish acceptance criteria

A taxonomy change is publish-ready only when:

- RPN/REx-PN hub shows simple canonical topic names
- RN hub shows simple canonical topic names
- NP/CNPLE hub shows simple canonical topic names
- Allied hubs show simple canonical topic names
- no same-pathway `management/care/review/basics` duplicates are visible
- legitimate split lessons remain visible
- `canonicalDuplicateSuppressedCount` is present in generated index output
- CI lesson-catalog tests pass
- generated indexes verify cleanly
