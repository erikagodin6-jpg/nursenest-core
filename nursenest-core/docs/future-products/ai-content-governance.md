# AI Content Quality Governance

Status: Governance only. AI-assisted content remains draft until reviewed.

## Core Rule

AI may assist drafting, structuring, variation generation, and remediation. AI output is never automatically publishable.

Every lesson, flashcard, question, rationale, hint, clinical pearl, simulation, and case must pass human-governed review.

## Quality Dimensions

Score each asset 0-100 across:

| Dimension | What It Measures | Automatic Fail Examples |
|---|---|---|
| Clinical Accuracy | Correctness, safety, guideline alignment, scope accuracy. | Unsafe intervention, outdated medication guidance, wrong scope. |
| Evidence Alignment | References, clinical standards, textbook/guideline support. | Unsupported claims, invented citations, vague evidence. |
| Reasoning Quality | Teaches why, not just what. | One-line rationale, no prioritization, no pathophysiology. |
| Duplication | Originality and reuse integrity. | Near duplicate above threshold without inheritance reason. |
| Hallucination Risk | Names, laws, guidelines, statistics, dosage, exam claims. | Unverifiable claims, fabricated exam rules, invented agencies. |
| Educational Value | Learner usefulness, depth, examples, remediation. | Generic overview, filler, no application. |
| Exam Relevance | Blueprint, format, cognitive level, distractor quality. | Trivia, untested details, mismatched difficulty. |
| Professional Credibility | Tone, terminology, trust signals, role scope. | Casual or inaccurate professional language. |

## Score Bands

- 0-69: Reject
- 70-84: Major revision required
- 85-89: Publish consideration after review
- 90-94: Premium tier candidate
- 95-100: Flagship content

Anything below the relevant threshold fails readiness audits.

## Required Review Workflow

1. AI draft created with product, profession, country, exam, role, and risk metadata.
2. Automated checks run for completeness, duplication, missing rationales, missing citations, and unsafe phrases.
3. Clinical reviewer evaluates clinical accuracy and safety.
4. Educational reviewer evaluates teaching value and learner reasoning.
5. Editorial reviewer evaluates consistency, tone, and structure.
6. SEO reviewer evaluates metadata only after product has launch eligibility.
7. Asset remains `published=false` until all required reviews pass.

## Required Asset Fields

- Source type
- Source prompt or generation batch
- Original author/editor
- Clinical reviewer
- Review date
- Evidence sources
- Duplication check result
- Quality score
- Risk classification
- Publication status
- Launch eligibility status

## AI-Specific Blockers

- Fabricated citation
- Unsupported pass-rate or outcome claim
- Clinical recommendation without evidence
- Scope-of-practice mismatch
- Duplicate content without reuse mapping
- Rationale under standard
- Hint reveals answer
- Clinical pearl is generic
- Flashcard is definition-only
- Simulation has no debrief
