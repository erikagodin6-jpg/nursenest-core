# AI Strategy Roadmap

Date: 2026-05-31

## Executive Summary

NurseNest should use AI as an assistive intelligence layer over structured educational data, not as an unbounded tutor. The moat is not "chatbot for nursing." The moat is clinically governed, evidence-grounded coaching that explains learner weaknesses, routes remediation, and debriefs simulation decisions.

## Current AI Capabilities

| Capability | Evidence | Status |
|---|---|---|
| Admin AI question/flashcard generation | `/api/admin/ai/*` routes | Implemented |
| Study plan AI generation | `/api/ai/study-plan/generate` | Implemented, gated |
| AI key/runtime policy | `openai-env`, feature flags, runtime health | Implemented |
| AI tutor substrate | `src/lib/ai-tutor/*`, educational graph governance | Foundation |
| Deterministic coach | CAT coach, dashboard coach, premium-success study plan | Implemented |
| Safety copy/disclaimers | AI tutor safety copy and study-plan disclaimer | Implemented |

## Strategic Position

AI should serve five realistic functions:

1. Summarize structured learner evidence.
2. Explain why a learner missed something.
3. Generate draft study plans from verified learner state.
4. Debrief clinical simulation decisions.
5. Help authors and reviewers improve content quality.

AI should not:

- Make unsourced clinical claims.
- Diagnose, prescribe, or replace instructors.
- Invent readiness probabilities.
- Generate public content without review.
- Become the primary source of truth for scoring.

## Product Opportunities

| Opportunity | Use AI? | Requirements | Priority |
|---|---|---|---:|
| Study coaching text | Yes, optional | Structured evidence, deterministic fallback | High |
| Adaptive tutoring chat | Limited | Retrieval, guardrails, citation, escalation | Medium |
| Clinical reasoning feedback | Yes | Decision trace, rubric, source links | Very high |
| Personalized remediation | Mostly deterministic | Learner state, topic graph, validated routes | Very high |
| Simulation debriefing | Yes | Scenario graph, consequences, reviewer-approved rubric | Very high |
| Faculty summaries | Yes | Cohort aggregates, privacy thresholds | High |
| Content generation | Yes, admin only | Review queue, references, quality checks | Medium |
| Readiness prediction | No direct LLM | Statistical model + disclosure | High |

## Implementation Roadmap

### 0-6 Months

- Keep deterministic recommendation engine as default.
- Add "evidence used" blocks to AI-generated study plans.
- Require structured JSON output and schema validation for all learner-facing AI.
- Add source/reference requirements for clinical explanations.
- Add audit logging for AI outputs shown to learners.

### 6-18 Months

- Build AI debrief for simulations from decision trace and approved rubric.
- Add AI-generated plain-language summaries of readiness reports, with deterministic numeric scores.
- Add faculty cohort summary drafts with privacy thresholds.
- Add content reviewer assistant for rationale quality, distractor quality, and unsafe phrasing.

### 18-60 Months

- Build retrieval-grounded clinical tutor scoped to NurseNest content and references.
- Add multilingual coaching for approved international markets.
- Add personalized simulation debriefs across specialty pathways.
- Build institution-level intervention recommendation drafts.

## Guardrails

- Structured data first, language model second.
- Every AI learner recommendation must cite learner evidence: topic, attempt count, score, weak pattern, or scenario decision.
- Every clinical explanation must link to approved NurseNest content or source references.
- No AI output should alter CAT scoring, readiness scoring, entitlement, billing, or clinical safety flags.
- AI availability must degrade gracefully to deterministic coaching.

## Conclusion

AI becomes defensible only when it is grounded in NurseNest's proprietary learner graph. Generic AI plans are easy to copy. Clinically governed, data-grounded simulation debriefing and adaptive remediation are not.
