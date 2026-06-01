# Simulation Analytics Standard

Date: 2026-06-01
Status: Simulation analytics standard

Source of truth: `docs/simulation-gap-analysis.md`.

No production analytics schema is modified by this document.

## Required Analytics Events

Every simulation should eventually track:

| Analytics Dimension | Required Signal |
| --- | --- |
| Recognition accuracy | Correctly identified priority cues |
| Interpretation accuracy | Correctly explained meaning of cues, trends, labs, ECG, symptoms, or vitals |
| Prioritization accuracy | Selected safest priority or hypothesis |
| Intervention selection | Chose appropriate action within role scope |
| Escalation timing | Escalated at the correct threshold and time |
| Outcome score | Patient outcome based on selected decisions |
| Confidence score | Learner self-rating before and after simulation |
| Remediation trigger | Automatic link to lesson, flashcards, questions, NGN case, or skill practice |

## Current Repository Evidence

The authored simulation catalog contains:

| Signal | Current Exact Evidence |
| --- | ---: |
| Patient history | 76 |
| Assessment | 76 |
| Evolving cues | 76 |
| Clinical decisions | 76 |
| Consequences | 72 |
| Deterioration pathway | 73 |
| Recovery pathway | 39 |
| Documentation prompts | 76 |
| SBAR handoff | 76 |
| Debrief via learning objectives | 76 |
| Remediation mapping | 76 |

## Readiness Rule

A simulation should not count toward premium readiness unless it emits or can be mapped to all required analytics dimensions above.

