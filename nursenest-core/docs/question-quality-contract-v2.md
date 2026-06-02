# Question Quality Contract V2

Date: 2026-06-01
Status: Premium question quality publication contract

Source of truth: `docs/question-quality-audit.md`, `src/lib/questions/question-quality-score.ts`, `src/lib/questions/distractor-quality-score.ts`, `src/lib/questions/rationale-quality-score.ts`, and existing question enforcement dashboards.

Future academies remain locked: `published=false`, `launchReady=false`, `visibleInNavigation=false`, `indexable=false`, `adminOnly=true`.

## Goal

Every published question must teach:

- What to do
- Why to do it
- What not to do
- Why not to do it
- What happens if the cue is missed

## Universal Required Fields

No published question may omit any of the following:

| Required Element | Standard |
| --- | --- |
| Clinical context | Patient, setting, role, or clinical situation is clear |
| Relevant cues | Assessment findings, vital signs, labs, symptoms, medications, history, scope, or risk factors are present |
| Decision point | Stem asks for a clinical decision, interpretation, priority, teaching, delegation, or evaluation |
| Correct answer | Evidence-informed and role-appropriate |
| Why correct | Explains why the answer fits the patient-specific cues |
| Why incorrect | Every distractor explains why it is wrong and why it may be tempting |
| Clinical reasoning | Teaches the decision rule, not only the answer |
| Patient safety implications | Explains risk of delay, omission, wrong priority, or unsafe action |
| Exam strategy | Shows how the item tests NCLEX, REx-PN, NP, ECG, lab, med math, or pathway-specific reasoning |
| Clinical application | Connects the item to bedside workflow |
| Clinical pearl | High-yield insight that transfers beyond the item |
| Related content | Links to lessons, flashcards, cases, simulations, labs, ECG, pharmacology, or skills |

## Publication Gates

| Score | Gate | Action |
| ---: | --- | --- |
| <70 | Fail | Do not publish |
| 70-84 | Review required | Remediate before publish |
| 85-94 | Publish eligible | May publish after required review |
| 95+ | Flagship quality | Eligible for flagship library and marketing screenshots |

## Premium Quality Targets

| Quality Area | Target |
| --- | ---: |
| Question Quality | 95%+ |
| Rationale Quality | 95%+ |
| Hint Quality | 95%+ |
| Clinical Pearl Quality | 95%+ |
| Distractor Quality | 95%+ for flagship items; 85%+ for publish-eligible items |

## Hard Fail Conditions

A question is blocked from publication if it has:

- Missing correct answer
- Missing rationale
- Missing distractor rationales
- Missing hint
- Missing clinical pearl
- Placeholder content
- Answer-revealing hint
- Unsafe clinical claim
- Role-scope mismatch
- Generic or template rationale that does not teach
- No related remediation content

## Pathway Application

This contract applies to RN, RPN/PN, CNPLE, FNP, AGPCNP, PMHNP, WHNP, PNP-PC, ECG, Labs, Medication Math, Pharmacology, Clinical Skills, Allied Health, Admissions, Pre-Nursing, and future hidden products.

