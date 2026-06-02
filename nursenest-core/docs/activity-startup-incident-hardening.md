# Activity Startup Incident Hardening

Date: 2026-05-29

## Incident

Learner activity launches were reported hanging indefinitely across Flashcards, CAT, and practice activities. Automated screenshots captured loading states, which means the issue had to be treated as a P0 study-access outage.

## Root Cause Identified

The flashcard study clients were optimized to request only the first card, but then discarded the returned card unless it looked like a four-option NCLEX-style MCQ. Normal flashcards and SATA-style cards could therefore be returned successfully by the API but filtered to an empty client queue. That produced a learner-facing failure that looked like an activity not loading.

A second startup risk existed in the instant deck route: if the first deck card did not satisfy the MCQ-only filter, the route attempted a bank-backed refill during instant launch. That made the first-card path depend on extra question-bank scope checks and pool reads.

## Fixes Applied

- Flashcard study now accepts ordinary renderable cards, not only NCLEX MCQs.
- SATA cards are preserved as plain flashcards instead of blocking the session.
- Deck instant launch no longer performs bank-backed refill work on the critical path.
- Flashcard client startup timeouts were reduced from 20s/12s style waits to 8s initial and 6s prefetch ceilings.
- Custom flashcard session server work now has hard startup deadlines: 5s for first-card payloads, 2s for count-only metadata.
- Exam start optional seeding is bounded to 1s and logs/degrades instead of blocking launch.
- Exam lookup, question-pool loading, and session creation now have hard server-side ceilings.
- CAT readiness preflight now degrades open on timeout/failure instead of blocking launch before pool creation.
- CAT create transaction wait/timeout was reduced from 15s/60s to 3s/12s.
- Added `/api/health/activity-startup` for activity startup health, database readiness, and lightweight content probes.
- Added Playwright monitor coverage for Flashcards, Practice Questions, and CAT startup.

## Emergency Guardrails

Non-essential services must not prevent studying:

- Adaptive readiness preflight timeout: log and continue.
- Optional seed/bootstrap work timeout: log and continue.
- Flashcard prefetch failure: do not block the current card.
- Progress/rating writes remain best-effort in flashcard sessions.

## Health Monitoring

Existing:

- `/healthz`
- `/readyz`
- `/api/health/ready`

Added:

- `/api/health/activity-startup`

Alert policy:

- Activity startup over 10 seconds: warning alert.
- Activity startup over 30 seconds: critical alert.
- `/api/health/activity-startup` returning non-200: critical study-access alert.

## Playwright Uptime Monitor

Added:

- `tests/e2e/monitoring/activity-startup-monitor.spec.ts`

Recommended schedule:

- Run every 15 minutes against the active production deployment.
- Run the same monitor against the hot standby deployment.

Required assertions:

- Flashcards hub visible.
- Flashcard session or valid empty-state surface visible after launch.
- Practice Questions surface visible.
- CAT launch page visible and interactive.
- No test should accept a spinner-only page as success.

## Failover Architecture

Primary environment:

- Current production app deployment.
- Primary database.
- Primary health monitor.

Secondary environment:

- Hot standby app deployment on separate infrastructure.
- Separate database replica or restored read/write standby.
- Independent health monitor running `/healthz`, `/readyz`, `/api/health/ready`, `/api/health/activity-startup`, and Playwright startup monitors.

Failover plan:

1. Alert fires for activity startup > 30s or health check failure.
2. Confirm primary database readiness and activity startup health.
3. If primary app is unhealthy and standby is healthy, shift traffic at DNS/load-balancer layer.
4. Keep learner session/auth secret parity across primary and standby.
5. Verify Flashcards, Practice Questions, and CAT startup on standby before declaring failover complete.
6. Preserve primary logs for root-cause analysis.

## Evidence To Collect In Production

For each monitored request:

- endpoint
- response time
- status
- payload size
- slowest API call
- activity-startup health response
- screenshot after launch

## Validation In This Pass

Local validation should include:

- `npx tsc --noEmit --pretty false`
- `npx playwright test tests/e2e/monitoring/activity-startup-monitor.spec.ts --project=chromium-paid`

The Playwright monitor requires paid learner credentials/storage state.
