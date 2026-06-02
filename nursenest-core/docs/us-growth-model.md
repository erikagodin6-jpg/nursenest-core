# United States NCLEX Growth Model

Generated: 2026-06-01

Purpose: model organic acquisition and ARR potential for the US NCLEX-RN ecosystem. These are planning scenarios, not forecasts guaranteed by current traffic.

## Current Commercial Readiness Inputs

| Input | Evidence |
|---|---|
| US RN pathway active | `src/lib/exam-pathways/exam-pathways-data-segment-b.ts` |
| Content readiness high | `docs/us-launch-scorecard.md` scores content readiness 98/100. |
| Pricing readiness blocker | `docs/us-launch-scorecard.md` scores pricing readiness 35/100 due to unconfirmed USD Stripe IDs. |
| Conversion readiness needs work | `docs/us-launch-scorecard.md` scores conversion readiness 58/100. |
| Commercial SEO pages exist | `src/lib/seo/nclex-commercial-landing-pages.ts` |
| Blog corpus exists but US RN surfacing is weak | `docs/blog-surfacing-limit-audit.md` |

## Model Assumptions

Pricing assumption for RN US:
- Monthly: $39.99
- 3-month: $89.99
- 6-month: $139.99
- Yearly: $199.99

Blended annual revenue per paid subscriber assumption:
- Conservative: $90
- Expected: $125
- Aggressive: $155

These blended values account for short exam-prep subscription duration, discounts, cancellations, and a mix of monthly/term plans.

## Scenario Table

| Scenario | Monthly organic sessions | Signup rate | Trial/start rate from signups | Paid conversion from trials | Monthly paid starts | Blended annual revenue/subscriber | Estimated ARR run-rate |
|---|---:|---:|---:|---:|---:|---:|---:|
| Conservative | 10,000 | 1.5% | 35% | 25% | 13 | $90 | $14,040 |
| Expected | 50,000 | 2.5% | 45% | 35% | 197 | $125 | $295,500 |
| Aggressive | 150,000 | 4.0% | 55% | 45% | 1,485 | $155 | $2,762,100 |

Formula:

`monthly sessions × signup rate × trial/start rate × paid conversion × blended annual revenue × 12`

## Interpretation

- Conservative assumes slow ranking, limited US trust proof, and unresolved conversion polish.
- Expected assumes high-intent commercial pages rank, US pricing works, and question-bank/CAT CTAs convert.
- Aggressive assumes strong rankings across question bank, CAT, flashcards, study plan, NGN, and comparison queries.

## Sensitivity

| Lever | Why it matters | Direction |
|---|---|---|
| Pricing readiness | If USD checkout fails or displays confusing currency, paid starts collapse. | Critical |
| Trial length/prominence | Trial visibility affects signup-to-trial conversion. | High |
| Blog retagging | US RN article surfacing affects informational traffic scale. | High |
| Comparison pages | Captures high-intent “alternative” and “vs” searches. | High |
| Sample question previews | Improves free-to-signup conversion. | Medium-high |
| Social proof | Improves pricing and signup confidence. | Medium |

## Fastest Path To Revenue

1. Resolve USD pricing and checkout verification.
2. Publish/optimize the 10 NCLEX-RN commercial spokes.
3. Retag and internally link US RN NCLEX blog content.
4. Build evidence-safe comparison pages.
5. Add conversion instrumentation for trial started, trial converted, cancelled, and US market source.

## Guardrails

- Do not model pass-rate claims as a conversion lever until real outcomes are collected and legally reviewed.
- Do not claim “most accurate readiness predictor.”
- Do not inflate question/lesson counts until count-source conflicts are resolved.
