# Distractor Readiness Domain Integration

Status: Governance standard

## Purpose

Wrong answers should update learner readiness profiles. A distractor selection is evidence of a reasoning gap, not merely an incorrect response.

## Readiness Domains

| Domain | Distractor Signals |
| --- | --- |
| Clinical judgment readiness | Priority, assessment, interpretation, pattern-recognition, trend, and cognitive-bias errors |
| Patient safety readiness | Safety errors, failure-to-rescue, under-escalation, unsafe scope, contraindication, or preventable harm |
| Escalation readiness | Under-escalation, over-escalation, delayed notification, missed deterioration |
| Medication safety readiness | Medication-monitoring failure, toxicity, adverse effects, contraindications, hold parameters |
| Documentation readiness | Documentation-first errors, incomplete records, incident documentation gaps |
| Communication readiness | SBAR, handoff, clarification, teaching, therapeutic communication, referral, or provider notification errors |

## Analytics Rule

When a learner selects a distractor, NurseNest should update:

- The mapped readiness domain
- The misconception family
- The topic weakness
- The remediation queue
- The learner's adaptive study plan

## Safety Escalation Rule

Failure-to-rescue, under-escalation, medication-monitoring failure, and safety-error distractors should carry higher remediation urgency than low-risk recall distractors.
