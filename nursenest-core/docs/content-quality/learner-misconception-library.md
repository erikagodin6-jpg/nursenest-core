# Learner Misconception Library

Status: Governance standard

## Purpose

This library defines how NurseNest converts wrong answers into learner analytics. Each distractor should identify the misconception that made the answer attractive and route the learner to remediation.

## Misconception Capture Template

| Field | Required Evidence |
| --- | --- |
| Common learner belief | The thought process that makes the distractor seem reasonable |
| Why selected | The stem cue, habit, or exam trap that attracts the learner |
| Incorrect assumption | The clinical assumption that fails |
| Knowledge gap | The missing concept, framework, or scope boundary |
| Risk | The patient safety, workflow, communication, or legal consequence |
| Remediation | The specific lesson, readiness domain, or practice set to assign |

## Core Misconception Families

| Family | Typical Learner Belief | Remediation |
| --- | --- | --- |
| Stabilization timing | "This care task matters, so it can happen first." | ABCs, instability, first-action practice |
| Assessment sequencing | "I can intervene from one cue without reassessment." | Assessment-first and reassessment loops |
| Scope confusion | "The role can perform any clinically useful action." | RN, RPN/PN, NP, allied scope rules |
| Trend blindness | "One value is enough to decide." | Serial trends and pattern comparison |
| Medication-monitoring gap | "Giving the medication is the goal." | Hold parameters, toxicity, adverse effects, monitoring |
| Documentation-first thinking | "Charting protects me before care is complete." | Assess-act-evaluate-document sequence |
| Communication delay | "I should gather more data before notifying." | SBAR thresholds and escalation triggers |
| Cognitive bias | "The familiar diagnosis explains all findings." | Alternate-hypothesis and cue-validation practice |

## Analytics Rule

Every learner selection of a distractor should increment:

- Misconception frequency
- Topic weakness
- Readiness domain weakness
- Safety weakness when applicable
- Clinical judgment weakness when applicable
