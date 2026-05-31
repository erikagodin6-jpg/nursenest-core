# Question Reasoning Audit

Date: 2026-05-31

## Purpose

This audit defines the repository-level question quality posture for the Master Clinical Reasoning & Educational Effectiveness Program. The goal is to move NurseNest questions away from recognition-only recall and toward clinical judgment, prioritization, escalation, and durable learning.

## Current Assets Reviewed

| Source | Finding | Reasoning Maturity | Action |
| --- | --- | --- | --- |
| `src/content/questions/nclex-tier2-clinical-judgment-questions.ts` | Strong clinical judgment seed set with priority, safety, NGN, trap, teaching, and escalation language. | High | Use as reference pattern for future generation and remediation. |
| `src/lib/questions/rationale-quality.ts` | Existing rationale builder checks generic rationales and generates correct/distractor rationales with priority, ABCs, stability, delegation, medication safety, infection control, and escalation cues. | Medium-High | Add Clinical Context as a required generation and content-depth field. |
| `src/lib/content-factory/question-generation-factory.ts` | Question factory covers MCQ, SATA, Bowtie, Matrix, Trend, Case Study, Prioritization, Delegation, and Clinical Judgment. | Medium-High | Now requires Clinical Context in addition to hint, why correct, why incorrect, clinical application, clinical pearl, exam strategy, and related content. |
| `src/lib/content-factory/content-depth-requirements.ts` | Requires rich question support fields and related content. | Medium-High | Now requires Clinical Context for questions. |
| `src/lib/questions/governance-escalation-engine.ts` | Flags low clinical quality, weak psychometrics, evidence risk, contradictions, stale guidelines, risk flags, and publish-ineligible items. | High | Link clinical reasoning score into escalation review in a future implementation pass. |
| `src/lib/governance/clinical-judgment-workspace-roadmap.ts` | Defines reusable clinical judgment workspaces such as multi-patient assignment, chart review, deterioration, medication administration, SBAR, skills decision trees, and shift management. | High | Align workspaces to the new Recognize -> Interpret -> Prioritize -> Act -> Evaluate -> Reflect framework. |

## Question Risk Types

| Risk Type | Detection Signal | Learner Impact | Required Fix |
| --- | --- | --- | --- |
| Recognition-only | Stem asks for simple identification without clinical context, patient risk, action, or consequence. | Learner memorizes labels without knowing what to do. | Add patient context, clinical risk, and next-action requirement. |
| Recall-only | Item asks a definition, lab range, medication class, or symptom list with no bedside decision. | Learner can answer facts but may fail clinical judgment stems. | Convert to application stem or pair with a reasoning follow-up. |
| Fact memorization | Correct answer depends on isolated trivia. | Weak transfer to exam and practice. | Replace with mechanism, safety, monitoring, or prioritization cue. |
| Weak distractor analysis | Incorrect options are dismissed as simply wrong. | Learner misses why a plausible option is not best. | Explain why each reasonable distractor is lower priority, unsafe, premature, or outside scope. |
| Missing clinical context | Rationale does not answer why the item matters clinically or where a nurse sees it. | Rationale feels like answer memorization. | Add Clinical Context to all generated and remediated rationales. |
| Missing consequence | Item does not show what happens if the cue is missed or action delayed. | Learner underestimates risk. | Add consequence language for safety-sensitive topics. |
| Missing escalation threshold | Item asks what to do but not when to notify, activate rapid response, or reassess. | Learner hesitates in unstable scenarios. | Add escalation decision point when relevant. |

## Required Rationale Shape

Every question should include:

| Section | Standard |
| --- | --- |
| Hint | Guides reasoning without revealing the answer. |
| Correct Answer | Clear answer key and learner-facing label. |
| Why Correct | Explains why this option is best for the patient context. |
| Why Incorrect | Explains why plausible distractors are not best, including priority or safety differences. |
| Clinical Context | Answers why this is tested, why it matters clinically, where a nurse encounters it, and what could happen if missed. |
| Clinical Application | Translates the concept into bedside, exam, or professional action. |
| Clinical Pearl | Short, memorable, practice-relevant insight. |
| Exam Strategy | Names the reasoning move the learner should repeat. |
| Related Lesson | Routes to concept repair. |
| Related Flashcards | Routes to retention support. |

## Upgrade Priorities

| Priority | Content Area | Reason |
| --- | --- | --- |
| P0 | Sepsis, shock, respiratory failure, ACS, stroke, DKA, hyperkalemia, GI bleeding, overdose, trauma, maternal emergencies, pediatric emergencies | High-harm topics require exceptional reasoning depth and consequence modeling. |
| P0 | Priority, delegation, escalation, unstable patient, medication safety, and lab/ECG change items | These directly test clinical judgment and practice readiness. |
| P1 | Foundational MCQs with no patient context | Convert recall questions into application stems where appropriate. |
| P1 | Rationales shorter than the minimum teaching shape | Expand with clinical context, distractor analysis, and exam strategy. |
| P2 | Low-risk definitions and terminology | Keep concise but add clinical relevance or study transfer. |

## Remediation Pattern

Before:

> Which lab value indicates hyperkalemia?

After:

> A patient with chronic kidney disease reports weakness. The telemetry strip shows widening QRS complexes and the potassium is elevated. What is the nurse's priority action?

Required teaching:

- Recognize: potassium plus ECG change.
- Interpret: cardiac conduction risk.
- Prioritize: unstable electrolyte emergency.
- Act: follow protocol, monitor, notify/escalate.
- Evaluate: reassess ECG, potassium trend, and symptoms.
- Reflect: dangerous potassium can be quiet until conduction changes appear.

## Implementation Completed In This Pass

- Added `src/lib/clinical-reasoning/clinical-reasoning-framework.ts`.
- Added clinical consequence, expert thinking, prioritization, scoring, and learning-science registries.
- Added `Clinical Context` to question generation and content-depth requirements.
- Added contract tests to prevent regression.

## Remaining Follow-Up

- Wire clinical reasoning score into question publication gates.
- Add batch audit scripts that compute recognition-only, recall-only, and clinical-context-missing rates from live question tables.
- Backfill Clinical Context for older imported items in a staged remediation queue.
- Surface clinical judgment domain scores on learner report cards and adaptive remediation.
