# Adaptive Learning Roadmap

Date: 2026-05-31

## Current-State Audit

| Capability | Current evidence | Status |
|---|---|---|
| CAT / adaptive exams | `PracticeTest.adaptiveState`, `ExamSession.adaptiveState`, `/api/practice-tests`, CAT results coach | Implemented, maturing |
| Readiness score | `/api/learner/readiness`, `readiness-score.ts`, `readiness_history` | Implemented, conservative |
| Weak-area detection | `UserTopicStat`, weak topics from sessions, remediation queue | Implemented |
| Remediation routing | `UserRemediationQueue`, `build-study-plan.ts`, remediation links | Implemented |
| Personalized study plans | `/api/study-plan`, long-term mastery signals, `/api/ai/study-plan/generate` | Implemented with deterministic core and optional AI generator |
| Readiness prediction | Pass-likelihood tier in `/api/learner/readiness`; CAT coach pass outlook | Implemented as guidance, not validated psychometric guarantee |
| Longitudinal trend | `readiness_history` weekly upsert | Partial |
| Cross-modal signals | Premium-success contract includes questions, lessons, flashcards, skills, pharmacology, ECG, CAT, consistency | Contract exists; full ingestion uneven |

## Strategic Diagnosis

NurseNest already has the skeleton of a strong adaptive platform. The problem is not absence of adaptive features. The problem is that the adaptive layer is not yet fully unified, validated, explainable, or visibly differentiated.

Competitors emphasize CAT, readiness assessments, adaptive planners, and pass prediction. NurseNest's opportunity is stronger: an adaptive ecosystem that understands why a learner is weak, where that weakness appears clinically, and which activity is most likely to repair it.

## Best-In-Class Target

By 2031, NurseNest adaptive learning should answer five questions for every learner:

1. What is my current readiness, and how reliable is that estimate?
2. Which weaknesses are content gaps, reasoning gaps, safety gaps, confidence gaps, or consistency gaps?
3. Which exact action should I do next?
4. Did that action repair the weakness across more than one modality?
5. Am I ready for the exam, clinical placement, new-grad shift, or specialty transition?

## Roadmap

### 0-6 Months

| Initiative | Effort | Risk | Impact |
|---|---:|---:|---:|
| Publish readiness methodology and limitations | Low | Low | High |
| Expand readiness snapshot provenance beyond weekly score | Medium | Medium | High |
| Standardize all weak-area signals into one learner-state envelope | Medium | Medium | High |
| Route CAT result weaknesses to lesson, flashcard, question, lab, ECG, med, and skill actions | Medium | Medium | High |
| Add reliability labels to all readiness/pass-likelihood UI | Low | Low | High |

### 6-18 Months

| Initiative | Effort | Risk | Impact |
|---|---:|---:|---:|
| Add cross-modal mastery model: content, reasoning, safety, consistency, confidence | High | Medium | Very high |
| Make daily plan adaptive to exam date, fatigue, decay, and recent failures | Medium | Medium | High |
| Add item-level psychometric review loop into adaptive eligibility | Medium | Medium | High |
| Build learner-facing "why this recommendation" explanation panel | Medium | Low | High |
| Add institution/cohort adaptive dashboards | Medium | Medium | High |

### 18-60 Months

| Initiative | Effort | Risk | Impact |
|---|---:|---:|---:|
| Validate readiness models against self-reported exam outcomes | High | High | Very high |
| Add pathway-specific adaptive profiles for NCLEX-RN, REx-PN, NCLEX-PN, CNPLE, allied, new grad, and international exams | High | Medium | Very high |
| Integrate branching simulation performance into readiness | High | High | Very high |
| Build calibrated peer/cohort benchmarks with privacy thresholds | Medium | Medium | High |
| Create faculty/cohort intervention engine | High | Medium | High |

## Product Principles

- Keep adaptation deterministic and auditable by default.
- Use AI for explanation and debrief only after structured evidence is computed.
- Avoid fake precision. Every readiness output needs confidence and sample-size context.
- Do not optimize only for exam pass probability; optimize for clinical judgment, safety, and durable mastery.
- Do not create parallel scoring engines for labs, ECG, skills, or simulations. Feed all signals into one learner-state model.

## Success Metrics

- Percentage of active learners with enough signal for reliable readiness.
- Weak-area repair rate after recommended actions.
- Cross-modal transfer rate: weakness improves in question bank and simulation/skill context.
- CAT repeat stability over multiple sessions.
- Study-plan completion and next-session return rate.
- Self-reported outcome capture rate with consent and methodology.

## Conclusion

The adaptive moat is a trustworthy clinical learning loop: detect, explain, route, repair, verify, and recalibrate. Competitors can copy readiness cards. They will struggle to copy a cross-modal adaptive learner model grounded in clinical reasoning and longitudinal behavior.
