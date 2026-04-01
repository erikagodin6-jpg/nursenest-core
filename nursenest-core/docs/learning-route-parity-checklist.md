# Learning Route Parity Checklist

Production learner shell is the Next.js app under `nursenest-core/`.  
Legacy monolith behavior should be ported surgically, not duplicated.

## Canonical learner routes

- ` /app/lessons` (content + pathway lesson access)
- ` /app/questions` (question bank + weak-area modes)
- ` /app/practice-tests` (linear + CAT practice)
- ` /app/exams` (mock exam sessions)
- ` /app/flashcards`
- ` /app/study-plan`
- ` /app` (dashboard / adaptive surfaces)

## Stabilization rules

- Keep one learner-facing behavior per capability.
- Prefer shared resolvers/loaders over route-specific ad hoc logic.
- Treat local browser rollups as cache/hints, never analytics authority.
- Use server topic ledger (`UserTopicStat`) for weak-area recommendations.
- Do not introduce new duplicate learner routes for the same feature.

## Known parity focus points

- Lesson progression must resolve both `content_items` and pathway lessons.
- Dashboard "continue lesson" and profile activity must use the same lesson resolver.
- Question quality remediation should flow through admin diagnostics + queue.
- Allied CA visibility should distinguish classification issues vs real inventory gaps.
- NP coverage actions should be triage-first (real deficits only).
