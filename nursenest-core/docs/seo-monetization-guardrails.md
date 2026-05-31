# SEO Monetization Guardrails

## Objective

Grow organic traffic without cannibalizing premium subscriptions. Public content should acquire and educate. Premium
content should train, assess, adapt, and personalize.

## Free Public Content

Public authority pages may include:

- Disease pages
- Medication pages
- Lab interpretation pages
- Career guides
- Certification guides
- Placement guides
- Interview guides
- Clinical skill overviews
- Basic care plan examples
- Educational articles

## Protected Premium Content

The following must remain protected behind authentication, entitlement, and subscription-aware flows:

- Question banks
- CAT exams
- NGN questions
- Bowtie questions
- Matrix questions
- Case studies
- Simulations
- ECG modules
- Telemetry modules
- Advanced labs
- Advanced pharmacology
- Study plans
- Readiness analytics
- Adaptive learning
- Personalized recommendations
- Clinical reasoning pathways
- Care plan builder
- Concept map builder
- Assignment hub
- Clinical placement tracking
- Advanced clinical skills

## Funnel Standard

Every public authority page should show preview cards for:

- Related lessons
- Related flashcards
- Related questions
- Related simulations
- Related CAT exams
- Related study plans
- Related care plans
- Related clinical skills

Preview cards may show counts, screenshots, learning objectives, and sample content. They must not expose full protected
activity payloads, full question banks, rationales, adaptive recommendations, analytics, simulations, builders, or advanced
clinical modules.

## Product Principle

Public content answers: "What is this?"

Premium content answers: "Can I actually do this?"

The free experience should educate. The premium experience should train.

## Implementation

The executable guardrails live in `src/lib/authority/healthcare-authority-content-engine.ts` as:

- `SEO_MONETIZATION_GUARDRAILS`
- `buildAuthorityPremiumFunnel()`

The public healthcare authority detail route renders locked premium preview cards that route through pricing or
subscription-aware upgrade surfaces rather than exposing premium activity routes directly.
