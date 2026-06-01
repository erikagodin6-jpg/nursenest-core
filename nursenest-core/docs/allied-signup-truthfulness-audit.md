# Allied Signup Truthfulness Audit

Generated: 2026-06-01T12:00:37.986Z

Scope: `/pricing`, `/signup`, `/allied/allied-health/pricing`, checkout handoff, and upgrade/subscription routing evidence.

## Executive Verdict

The billing system supports Allied checkout selection, but the signup funnel should not promise a complete Allied learning product for every profession. Pricing metadata still describes plans with lessons, questions, flashcards, and mock exams as a general platform promise. That is not currently safe for the audited Allied professions because flashcards are not evidenced and several professions lack attributable question depth.

## Funnel Claim Matrix

| Surface | Observed claim | Verdict | Evidence | Required action |
| --- | --- | --- | --- | --- |
| `/pricing` metadata | Plans by exam pathway with practice questions, clinical lessons, flashcards, and mock exams. | Unsupported | `src/app/(marketing)/(default)/pricing/page.tsx` fallback description includes flashcards and mock exams; Allied flashcards/practice exams are not evidenced in this audit. | Scope pricing copy to available surfaces or add an Allied-specific caveat. |
| `/allied/allied-health/pricing` | Redirects through shared pathway pricing and says lessons, questions, flashcards, and exams match this pathway. | Risk | Shared pathway pricing page redirects Allied to global Allied pricing and uses broad pathway subscription language. | Avoid saying flashcards/exams match the pathway unless that can be demonstrated for the selected Allied career. |
| `/signup` | Utility signup route; noindex metadata. | Supported | `src/app/(marketing)/(default)/signup/page.tsx` is noindex and delegates to `MarketingSignupPage`. | Keep signup utility copy generic; do not add Allied completion claims. |
| Checkout API | Requires Allied career selection and stores Allied career metadata. | Supported | `src/app/api/subscriptions/checkout/route.ts` requires `alliedCareer` for tier `ALLIED` and writes career metadata. | Checkout can sell a career line, but product copy must clarify current content coverage. |
| Upgrade/account flow | Allied access after payment. | Partially supported | Learner account routes exist, but per-profession feature completeness remains uneven. | Use `access to available Allied Health study tools` instead of `complete exam prep` until parity thresholds are met. |

## Immediate Commercial Risk

- Zero evidenced flashcards across audited Allied professions means any paid-tier promise of Allied flashcards is not truth-safe.
- Professions with no attributable question inventory in this model: PSW, Social Work, Psychotherapy.
- Practice exams and CAT/adaptive claims should be treated as unavailable unless a profession-specific launch gate proves item volume and scoring reliability.

## Required Funnel Rule

The pricing and checkout path may sell only what the learner can access immediately after signup. Until parity improves, Allied plan copy should say: "includes available Allied Health lessons and practice tools for selected careers; some professions are in staged rollout."
