# Admin observability — known gaps and follow-ups

This note complements the **Observability hub** (`/admin/observability`) shipped in the app. It records intentional boundaries and backlog items so expectations stay aligned with security and payload limits.

## What the hub covers today

| Area | Source | Limits |
| --- | --- | --- |
| Study systems (7d) | `load-admin-observability-hub.ts` | Counts only; demo users excluded on relational filters |
| Subscriptions / trials | Same loader | Aggregate counts, not Stripe objects |
| Flashcard pool health | Prisma counts | Thin decks, orphans, missing topic codes |
| Pathway readiness | US pathway sample (12) + published lesson counts | Heuristic only (≥10 lessons ⇒ “ready” slice) |
| Lab / allied | Module preview links + allied-scoped pathway lesson count | Lab remains admin-preview; not learner traffic |
| Learner roster | `GET /api/admin/observability/learners` | Paginated (24/page, max 25 pages); **support/super only** |

## Deliberate non-goals (avoid giant payloads)

- **No full lesson ↔ bank scan** on page load — use `GET /api/admin/lesson-question-link-coverage` (pathway-scoped) from ops machines.
- **No raw PostHog or warehouse sync** in this hub — keep analytics in `/admin/analytics/*`.
- **No per-user progress histograms** in the roster — open `/admin/users/[id]` for progress samples and masked billing.

## Gaps to track

1. **Verified study decks** — usage not yet rolled into the 7d study-system strip (only bank flashcard sessions + legacy deck stats elsewhere).
2. **OSCE / clinical scenarios** — session volume not merged into hub tiles (dedicated admin pages exist).
3. **Internal courses** — completion metrics live under `/admin/courses` and APIs; not duplicated here.
4. **Lab values learner traffic** — module is preview-only; when it goes live, add entitlement-aware counts and wire here.
5. **Cross-region pathway samples** — hub uses a **US registry slice** for readiness chips; add CA/UK cards when product asks for multi-country ops defaults.

## Security reminders

- Hub JSON: `GET /api/admin/observability/hub` — still **admin session + RBAC** only.
- Roster: content tier is blocked at **path policy + API**; UI hides email list for content tier.
- Do not add `force-static` or public caching to these routes.

