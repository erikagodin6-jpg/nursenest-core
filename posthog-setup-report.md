<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of your project. Two new server-side events were added to close gaps in the existing instrumentation, exception autocapture was enabled on the PostHog Node.js singleton, and environment variables were written to `.env.local`. A PostHog dashboard with 5 business-critical insights was created.

| Event | Description | File |
|-------|-------------|------|
| `flashcard_card_reviewed` | Learner rated a flashcard via SM-2 spaced repetition (custom/multi-deck session). Properties: `rating`, `interval_days`, `repetitions`. | `src/app/api/flashcards/cards/[cardId]/review/route.ts` |
| `account_deleted` | Learner permanently deleted their account. Churn signal — use in retention cohort comparisons. Properties: `subscription_cancellation_required`. | `src/app/api/account/delete/route.ts` |

**Supporting changes:**

| Change | File |
|--------|------|
| Added `enableExceptionAutocapture: true` to PostHog Node.js constructor | `src/lib/observability/posthog-server.ts` |
| Added `flashcardCardReviewed` and `accountDeleted` event name constants | `src/lib/observability/posthog-conversion-events.ts` |
| Set `NEXT_PUBLIC_POSTHOG_KEY` and `NEXT_PUBLIC_POSTHOG_HOST` | `.env.local` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics dashboard](/dashboard/1640048)
- [Signups over time](/insights/ZXBVF6pR) — Weekly new learner signups (`signup_completed`)
- [Signup → Checkout → Subscribed funnel](/insights/dV4wCSgJ) — 3-step conversion funnel with 30-day window
- [Exam & practice session completions](/insights/DqNytT1C) — `learner_exam_mock_session_completed` + `learner_practice_test_session_completed`
- [Flashcard reviews (spaced repetition)](/insights/t6psxS2b) — Weekly `flashcard_card_reviewed` — proxy for daily active study engagement
- [Account deletions (churn signal)](/insights/0RN3gHvg) — Weekly `account_deleted` — spike warrants retention investigation

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-javascript_node/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
