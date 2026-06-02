# Distractor Psychology Model

Status: Governance standard

Future content remains locked: `published=false`, `launchReady=false`, `visibleInNavigation=false`, `indexable=false`, `adminOnly=true`.

## Purpose

Distractors are learner-thinking probes. Every wrong answer should represent a plausible reasoning error, not filler. A strong distractor helps NurseNest identify what the learner misunderstood, what clinical risk that misunderstanding creates, and what remediation should happen next.

## Core Taxonomy

| Taxonomy | Learner Thinking Pattern | Clinical Risk |
| --- | --- | --- |
| Priority error | Chooses a real but lower-priority action | Delays stabilization or misses the first action |
| Timing error | Does the right action too early or too late | Breaks clinical sequence |
| Assessment error | Misses assessment or reassessment cues | Acts without enough patient data |
| Safety error | Selects an action that increases preventable harm | Medication, fall, infection, aspiration, or deterioration risk |
| Interpretation error | Misreads labs, ECGs, symptoms, trends, or expected findings | Incorrect clinical judgment |
| Scope error | Chooses an action outside role, delegation, or setting limits | Unsafe or legally inappropriate care |
| Communication error | Fails to notify, clarify, educate, hand off, or use SBAR | Delayed team response |
| Documentation error | Charts before action or documents incompletely | Legal and continuity-of-care risk |
| Anchoring bias | Fixates on the first cue or known diagnosis | Misses conflicting evidence |
| Premature closure | Stops reasoning after one plausible explanation | Misses evolving complications |
| Confirmation bias | Selects data that supports an initial assumption | Ignores danger cues |
| Task fixation | Prioritizes routine tasks over patient condition | Misses instability |
| Tunnel vision | Focuses on one lab, symptom, or device reading | Misses the whole clinical pattern |
| Overconfidence | Acts independently when escalation or policy is required | Scope and safety risk |
| Under-escalation | Monitors or waits when escalation is required | Failure-to-rescue risk |
| Over-escalation | Activates urgent resources for stable or expected findings | Inefficient or inappropriate escalation |
| Failure-to-rescue | Misses deterioration or delays rescue actions | High patient harm risk |
| Pattern-recognition error | Fails to connect cue clusters | Misses diagnosis or priority |
| Medication-monitoring failure | Misses toxicity, contraindications, interactions, or hold parameters | Medication safety risk |
| Trend-interpretation failure | Treats serial deterioration as isolated data | Delayed response to worsening status |

## Required Distractor Intelligence Fields

Every distractor must capture:

- Common learner belief
- Why the learner selects it
- Incorrect clinical assumption
- Knowledge gap
- Risk introduced
- Remediation target
- Readiness domain

## Publish Gate

Block publication when:

- Distractor score is below `80`
- Misconception mapping is missing
- Safety analysis is missing
- Remediation mapping is missing
- Readiness mapping is missing

Flagship threshold: distractor score `95+`.
