# Clinical Reasoning Expansion Roadmap

Date: 2026-06-01
Status: Clinical reasoning depth expansion program

Source documents:

- `docs/question-reasoning-audit.md`
- `docs/question-quality-audit.md`
- `docs/question-quality-dashboard.md`
- `docs/question-quality-contract-v2.md`
- `docs/content-maturity-dashboard.md`
- `docs/high-risk-topic-loop-audit.md`
- `src/lib/questions/question-quality-score.ts`
- `src/content/questions/nclex-tier1-foundational-questions.ts`
- `src/content/questions/nclex-tier2-clinical-judgment-questions.ts`
- `src/content/questions/nclex-tier3-advanced-review-questions.ts`
- `src/content/questions/cnple-practical-nursing-ngn-expansion.ts`

Future academies remain locked: `published=false`, `launchReady=false`, `visibleInNavigation=false`, `indexable=false`, `adminOnly=true`.

This roadmap does not create routes, learner-facing products, navigation, monetization surfaces, or public academy exposure.

## Goal

Move NurseNest question banks from knowledge testing to clinical decision-making.

Every question should classify into one primary reasoning level:

1. Knowledge recall
2. Interpretation
3. Prioritization
4. Intervention
5. Evaluation
6. Escalation

Every future question must also map to the clinical judgment cycle:

Recognize -> Interpret -> Prioritize -> Act -> Evaluate -> Reflect

## Evidence Boundary

Live pathway-wide distributions are not currently repository-evidenced. Existing DB-backed quality dashboards report that the live `exam_questions` inventory was unavailable in this environment. Therefore this roadmap does not fabricate current percentages for RN, RPN/PN, NP, ECG, Labs, Clinical Skills, or Pharmacology.

Repository-evidenced seed patterns:

| Source | Evidence |
| --- | --- |
| `nclex-tier1-foundational-questions.ts` | Includes cognitive load 1-2 and prioritization level 1-2 metadata; many items are foundational application but still closer to knowledge/interpretation |
| `nclex-tier2-clinical-judgment-questions.ts` | Includes NGN language, clinical judgment cues, cognitive load 2-3, and prioritization level 3 |
| `nclex-tier3-advanced-review-questions.ts` | Includes cognitive load 4-5 and prioritization level 4-5 |
| `cnple-practical-nursing-ngn-expansion.ts` | Includes difficulty, cognitive load 1-5, prioritization level 1-5, and prioritization logic fields |
| `docs/question-reasoning-audit.md` | Finds strong clinical judgment seed sets, but calls for batch audits against live question tables |

## Target Distribution

The long-term portfolio target is:

| Tier | Reasoning Band | Target Distribution | Included Classifications |
| --- | --- | ---: | --- |
| Tier 1 | Knowledge foundation | 30% | Knowledge recall with clinical relevance; low-risk recognition; foundational definitions only when needed |
| Tier 2 | Interpretation | 40% | Interpretation of cues, labs, ECG, assessment findings, medication effects, scope constraints, trends |
| Tier 3 | Decision-making | 30% | Prioritization, intervention, evaluation, escalation |

No mature bank should drift above 30% pure recall unless the bank is intentionally foundational, such as Pre-Nursing or Admissions. Current revenue pathways should bias toward interpretation and decision-making.

## Classification Rules

| Classification | Primary Question Behavior | Common Stem Signals | Required Teaching |
| --- | --- | --- | --- |
| Knowledge recall | Asks for a fact, definition, range, class, or term | `what is`, `which value`, `identify`, `definition` | Add clinical relevance and related content |
| Interpretation | Requires reading cues, trends, labs, ECG, findings, medication effects, or symptoms | `indicates`, `suggests`, `interpret`, `trend`, `finding` | Explain cue meaning and risk |
| Prioritization | Requires choosing first, most urgent, safest, highest-risk patient or action | `first`, `priority`, `most important`, `immediate` | Teach ABCs, safety, stability, acute vs chronic, risk |
| Intervention | Requires selecting an action, teaching, medication response, skill, or nursing measure | `take`, `administer`, `hold`, `teach`, `prepare`, `implement` | Explain why the action fits the cue |
| Evaluation | Requires judging response, reassessment, outcome, effectiveness, or follow-up | `evaluate`, `reassess`, `response`, `effective`, `outcome` | Teach what improvement or failure looks like |
| Escalation | Requires reporting, rapid response, provider notification, emergency activation, scope handoff | `notify`, `report`, `rapid response`, `escalate`, `SBAR` | Teach threshold, timing, and consequence of delay |

## NCJMM Mapping Rules

| Clinical Judgment Stage | Question Requirement |
| --- | --- |
| Recognize | Stem contains relevant and irrelevant cues; learner identifies what matters |
| Interpret | Learner explains what cue pattern means clinically |
| Prioritize | Learner selects urgent risk, hypothesis, or patient |
| Act | Learner chooses safe intervention, communication, delegation, medication action, or teaching |
| Evaluate | Learner judges response, trend, reassessment, or next monitoring step |
| Reflect | Rationale teaches how to transfer the lesson to the next patient or exam item |

## Current Distribution Audit

| Bank | Current Distribution | Target Distribution | Gap Analysis | Priority |
| --- | --- | --- | --- | --- |
| RN | Not live-audited | 30% knowledge / 40% interpretation / 30% decision-making | Static tier files show a tiered reasoning architecture, but live pool distribution is not proven | P0 |
| RPN / PN | Not live-audited | 30 / 40 / 30 with scope-safe escalation emphasis | PN items must emphasize recognition, monitoring, reporting, medication safety, documentation, and predictable-care scope | P0 |
| CNPLE | Not live-audited | 20 / 40 / 40 for NP-level depth | CNPLE must shift toward diagnostic reasoning, management, prescribing implications, and follow-up evaluation | P1 |
| FNP | Not live-audited | 20 / 40 / 40 | Needs ambulatory diagnostic reasoning, treatment selection, prescribing safety, follow-up, referral thresholds | P1 |
| AGPCNP | Not live-audited | 20 / 40 / 40 | Needs older-adult complexity, chronic disease management, medication-risk interpretation, escalation/referral |
| PMHNP | Not live-audited | 20 / 40 / 40 | Needs psychiatric assessment interpretation, safety prioritization, psychopharmacology, crisis escalation |
| WHNP | Not live-audited | 20 / 40 / 40 | Needs reproductive, prenatal/postpartum, screening, medication, and referral reasoning |
| PNP-PC | Not live-audited | 20 / 40 / 40 | Needs developmental interpretation, pediatric red flags, family teaching, escalation/referral |
| ECG | Not live-audited | 20 / 45 / 35 | Must move from rhythm naming to rhythm impact, deterioration, medication effects, and escalation |
| Labs | Not live-audited | 20 / 50 / 30 | Must move from normal ranges to trend interpretation, clinical meaning, and next action |
| Clinical Skills | Not live-audited | 25 / 35 / 40 | Must move from procedure steps to indications, safety, documentation, escalation, and evaluation |
| Pharmacology | Not live-audited | 20 / 40 / 40 | Must move from drug facts to monitoring, adverse effects, interactions, toxicity, teaching, and hold/escalation decisions |

## Gap Themes

| Gap | Impact | Required Fix |
| --- | --- | --- |
| Live distribution not measured | Cannot prove reasoning maturity by pathway | Add batch audit that classifies every question by reasoning level and NCJMM stage |
| Recall-only stems | Learners memorize facts without transfer | Add patient context, cues, risk, and decision point |
| Interpretation without action | Learners can name the finding but not decide what to do | Add intervention, escalation, or evaluation requirement |
| Prioritization without consequence | Learners choose first action but do not understand why delay matters | Add patient safety implication and consequence |
| Weak evaluation questions | Learners do not practice reassessment or outcome judging | Add response-to-intervention and trend-follow-up items |
| Weak escalation thresholds | Learners hesitate on rapid response/provider notification | Add escalation timing, SBAR, and failure-to-rescue rationales |

## Bank-Specific Expansion Plans

### RN

Target: 30% knowledge, 40% interpretation, 30% prioritization/intervention/evaluation/escalation.

Priority conversions:

- Convert stable fact items into patient-context interpretation items.
- Expand high-risk decision items for sepsis, shock, ACS, stroke, respiratory failure, DKA, hyperkalemia, GI bleed, trauma, maternal emergencies, and pediatric emergencies.
- Require every priority item to name the clinical framework used: ABCs, safety, acute vs chronic, unstable vs stable, Maslow, delegation scope, or time sensitivity.

### RPN / PN

Target: 30% knowledge, 40% interpretation, 30% scope-safe decision-making.

Priority conversions:

- Convert recall items into recognition, monitoring, reporting, documentation, and escalation items.
- Avoid RN/NP-only decisions such as independent diagnosis, advanced titration, or prescribing.
- Add more "what should the RPN/LPN report first" and "what finding requires escalation" items.

### CNPLE And NP Specialties

Target: 20% knowledge, 40% interpretation, 40% advanced decision-making.

Priority conversions:

- Convert RN-level recognition questions into diagnostic reasoning questions.
- Add differential diagnosis, guideline-based management, prescribing safety, monitoring, referral, and follow-up evaluation.
- For PMHNP, emphasize risk assessment, therapeutic plan selection, psychopharmacology monitoring, crisis escalation, and longitudinal evaluation.
- For WHNP/PNP-PC, require age, pregnancy, development, screening, and family context.

### ECG

Target: 20% rhythm knowledge, 45% interpretation, 35% deterioration/escalation.

Priority conversions:

- Convert rhythm-label questions into "what does this rhythm mean for this patient now?"
- Add hemodynamic stability, medication effects, electrolyte links, deterioration pathways, and escalation thresholds.
- Require ECG items to map to Recognize, Interpret, Prioritize, Act, Evaluate, Reflect.

### Labs

Target: 20% range knowledge, 50% interpretation, 30% action/evaluation.

Priority conversions:

- Convert range memorization into trend interpretation.
- Add medication monitoring, critical values, symptom correlation, and escalation.
- Require lab items to explain what happens if the abnormality is missed.

### Clinical Skills

Target: 25% knowledge, 35% interpretation, 40% action/evaluation/escalation.

Priority conversions:

- Convert step-order recall into "why this step matters" and "what finding changes the plan."
- Add safety checks, contraindications, documentation, patient teaching, and complication recognition.

### Pharmacology

Target: 20% medication facts, 40% monitoring interpretation, 40% safety decisions.

Priority conversions:

- Convert mechanism/class items into monitoring and adverse-effect scenarios.
- Add hold parameters, toxicity recognition, interactions, lab/ECG links, patient teaching, and escalation.
- Separate RN/RPN administration reasoning from NP prescribing reasoning.

## Instrumentation Requirements

Every question record should expose:

| Field | Requirement |
| --- | --- |
| `reasoningClassification` | One of knowledge_recall, interpretation, prioritization, intervention, evaluation, escalation |
| `clinicalJudgmentStages` | One or more of recognize, interpret, prioritize, act, evaluate, reflect |
| `decisionPoint` | The required learner decision |
| `cueType` | Assessment, lab, ECG, medication, symptom, documentation, scope, communication, trend |
| `consequenceIfMissed` | Safety, deterioration, delay, wrong treatment, missed escalation, poor outcome |
| `roleScope` | RN, RPN/PN, NP, ECG learner, lab learner, clinical skills learner, pharmacology learner |
| `reasoningTier` | Tier 1, Tier 2, or Tier 3 |

## Audit Output Required

The live audit should produce:

| Output | Purpose |
| --- | --- |
| Current distribution by bank | Percent knowledge, interpretation, prioritization, intervention, evaluation, escalation |
| Target distribution by bank | Desired 30/40/30 or NP-adjusted distribution |
| Gap analysis | Overweight recall, underweight interpretation, underweight escalation, etc. |
| Remediation queue | Questions to rewrite, enrich, or retire |
| High-risk topic view | Reasoning distribution for safety-critical topics |
| Role-scope view | Detects PN items drifting into RN/NP decisions |

## Remediation Patterns

| Current Item Type | Transformation |
| --- | --- |
| "What is the normal potassium range?" | "A client with CKD has weakness, potassium elevation, and ECG change. What is the priority concern?" |
| "Which drug is a beta blocker?" | "A client taking a beta blocker has HR 44 and dizziness. What should the nurse assess and report?" |
| "What is heart failure?" | "A client with heart failure has crackles, edema, and increasing dyspnea. Which finding signals worsening perfusion or fluid overload?" |
| "Which rhythm is atrial fibrillation?" | "A client develops new atrial fibrillation with hypotension. What is the nurse's priority action?" |
| "What is SBAR?" | "A patient deteriorates after surgery. Which SBAR recommendation communicates urgency and needed action?" |

## Priority Roadmap

| Priority | Workstream | Exit Criteria |
| ---: | --- | --- |
| 1 | Add reasoning classification audit | Every live question has a reasoning level and NCJMM stage |
| 2 | RN and RPN/PN high-risk rewrite queue | High-risk topics reach target distribution and complete reasoning loops |
| 3 | Pharmacology and ECG conversion | Medication and rhythm questions prioritize monitoring, deterioration, and escalation |
| 4 | Labs conversion | Lab items emphasize trend interpretation and action thresholds |
| 5 | NP specialty upgrade | CNPLE/FNP first, then AGPCNP/PMHNP/WHNP/PNP-PC |
| 6 | Clinical Skills conversion | Procedure content becomes safety, documentation, complication, and evaluation reasoning |

## Governance Rule

No future question generation batch should be approved unless it declares:

- Reasoning classification
- Clinical judgment stage mapping
- Role scope
- Target distribution impact
- Related remediation content
- Patient safety consequence

Questions may be content-complete but still not mature if they do not teach clinical decision-making.

