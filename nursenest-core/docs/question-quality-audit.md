# Question Quality Audit

Date: 2026-05-31
Status: Question, hint, rationale, and clinical pearl quality overhaul

Future content flags: `published=false`, `launchReady=false`, `adminOnly=true` until reviewed.

## Audit Scope

This audit applies to RN, RPN, NP, Pre-Nursing, Admissions, Allied Health, ECG, Labs, Medication Math, Clinical Skills, Pharmacology, and future pathways.

Evidence reviewed:

- `src/content/questions/nclex-tier1-foundational-questions.ts`
- `src/content/questions/nclex-tier2-clinical-judgment-questions.ts`
- `src/content/questions/nclex-tier3-advanced-review-questions.ts`
- `src/content/questions/cnple-practical-nursing-ngn-expansion.ts`
- `src/content/questions/allied-pharmacy-technician.ts`
- `src/content/pre-nursing/modules/*`
- Existing quality utilities under `src/lib/questions` and `src/lib/content-quality`

## Repository Findings

| Area | Finding | Severity |
| --- | --- | --- |
| RN authored question files | Tier 1, 2, and 3 files include stems, options, rationales, hints, and teaching points in structured TypeScript content | Low |
| CNPLE practical nursing NGN expansion | Large generated bank includes rationales and some scenario logic, but repeated "is correct because" phrasing appears in generated templates | Medium |
| Allied pharmacy technician | Minimal evidence of full question-bank structure in reviewed file | High |
| Pre-Nursing modules | Many rationales are educationally specific, but they are not consistently mapped to the full premium rationale framework | Medium |
| Admissions | No first-class question-bank evidence found in reviewed sources | High |
| ECG, Labs, Medication Math, Pharmacology | Quality standards exist, but full question/hint/pearl/rationale parity is not consistently evidenced by countable inventories | High |

## Severity Ranking

| Severity | Criteria | Required Action |
| --- | --- | --- |
| Critical | Placeholder text, answer-revealing hint, missing correct answer, rationale unavailable, unsafe clinical claim | Do not publish; professional review required |
| High | Recall-only item, weak distractors, missing why-incorrect analysis, missing hint or pearl, no clinical context | Review before publish |
| Medium | Rationale present but generic, shallow, repetitive, or not exam-specific | Rewrite during quality pass |
| Low | Structurally complete but could be more clinically specific | Improve opportunistically |

## Question Stem Audit Standard

Strong stems should include:

| Element | Standard |
| --- | --- |
| Clinical context | Patient role, setting, or scenario when appropriate |
| Relevant cues | Assessment data, trend, lab, medication, symptom, or role constraint |
| Decision point | First action, priority, interpretation, intervention, delegation, teaching, or evaluation |
| Scope | RN, RPN/PN, NP, allied, or student level when relevant |
| Avoidance | No trivia-only wording unless the pathway is foundational or admissions-focused |

## Answer Choice And Distractor Standard

Wrong answers must be plausible. Avoid throwaway distractors.

| Distractor Type | Good Use | Bad Use |
| --- | --- | --- |
| Timing error | A correct action done too late | Obviously unrelated action |
| Scope error | Task exceeds or misunderstands role | Humorous or absurd option |
| Priority error | Teaching before stabilization | "Do nothing" without plausible reason |
| Assessment error | Missing a cue or trend | Duplicate wording with only minor grammar changes |
| Safety error | Ignores contraindication or risk | Generic "notify provider" in every item |

## Professional Rationale Framework

Every question must include:

1. Correct Answer
2. Why It Is Correct
3. Why The Other Options Are Incorrect
4. Clinical Reasoning
5. Patient Safety Implications
6. Exam Strategy
7. Clinical Application
8. Clinical Pearl
9. Related Topics

The rationale should teach a reusable decision rule, not merely justify the letter.

## Practice Question Depth Findings

| Dimension | Current Direction | Gap |
| --- | --- | --- |
| Clinical realism | Strongest in authored RN and CNPLE files | Needs broader parity across Allied, Admissions, ECG, Labs, Med Math, Pharmacology |
| Difficulty distribution | Tiered RN files exist | Needs consistent distribution reporting across all pools |
| NGN representation | CNPLE and NCLEX NGN files exist | Needs broader item-format coverage by pathway |
| Reasoning complexity | Strong in Tier 2/3 examples | Generated templates need less repetitive language |
| Prioritization | Present in RN and PN content | Needs more professional practice and allied scenarios |
| Delegation | Present but not deep enough for parity | Needs RN/RPN scope-specific expansion |
| Clinical judgment | Present as a platform direction | Needs scoring and publish gates applied consistently |

## Review Queue Rules

Enhanced professional review is required for:

| Content Type | Review Reason |
| --- | --- |
| Critical care | High acuity, medication titration, ventilator/hemodynamic risk |
| Pediatric | Age-specific assessment, dosing, developmental considerations |
| NP | Diagnosis, prescribing, advanced practice scope |
| Pharmacology | Contraindications, monitoring, toxicity, interactions |
| Emergency | Time-sensitive deterioration, trauma, stroke, sepsis, ACS |
| Complex ECG | Rhythm diagnosis, escalation, medication safety |

## Recommendations

1. Apply `src/lib/questions/question-quality-score.ts` to import, generation, draft review, and publish workflows.
2. Block publish for scores below 70.
3. Require review for scores below 85.
4. Require enhanced professional review flags for critical care, pediatric, NP, pharmacology, emergency, and complex ECG content.
5. Rewrite repeated "is correct because" generated phrasing into stem-specific clinical reasoning.
6. Require every wrong answer to include why it is tempting and why it is unsafe, late, outside scope, or unsupported.

