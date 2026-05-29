# Mission-Critical Learning Continuity

**Owner:** Engineering + Operations  
**Target recovery:** Learner study access remains available; failover target under 15 minutes for primary deployment loss.

## Operating Principle

Learning activities are Tier 1. Non-essential systems are Tier 2.

Tier 1 must render before Tier 2 work starts whenever possible. Tier 2 failures must be logged, alerted when appropriate, and bypassed without preventing study.

## Tier 1

- Flashcards
- Practice Questions
- CAT Exams
- Lessons
- Clinical Skills
- Pharmacology
- ECG

Canonical code registry: `src/lib/resilience/learning-continuity.ts`.

## Tier 2

- Adaptive learning
- Recommendations
- Analytics
- Friend system
- Referrals
- Leaderboards
- Readiness scoring
- Gamification
- Notifications

Guard optional work with `safeStudyOptional()` from `src/lib/study-mode/study-mode-fallback.ts`. Do not use this guard for entitlements, paywalls, or authorization.

## Emergency Study Mode

Enable:

```bash
NN_DEGRADED_MODE=1
NEXT_PUBLIC_NN_DEGRADED_MODE=1
NN_CORE_ONLY_EMERGENCY=1
NEXT_PUBLIC_NN_CORE_ONLY_EMERGENCY=1
```

Learner copy:

> Some advanced services are temporarily unavailable. Your learning activities remain fully accessible.

Level 3 Emergency Study Mode copy used in-product:

> Advanced services are temporarily unavailable. Your study session remains fully accessible.

Emergency Study Mode disables or hides Tier 2 surfaces such as recommendations, readiness updates, leaderboards, friend activity, referral activity, gamification, and optional analytics. It must continue to serve questions, flashcards, CAT, lessons, clinical skills, pharmacology, and ECG.

## Zero-Downtime Delivery Levels

| Level | Trigger | Learner behavior | System behavior |
| --- | --- | --- | --- |
| Level 1 — Primary Service | Startup under 2 seconds | Normal activity startup | Live service path, Tier 2 allowed when non-blocking |
| Level 2 — Backup Delivery Service | Startup reaches 5 seconds | Show `Loading study session...` while content failover activates | Serve cached manifests, flashcard decks, question metadata, lesson manifests, and CAT pools where available |
| Level 3 — Emergency Study Mode | Primary unavailable or startup reaches 30 seconds | Show Emergency Study Mode copy | Disable Tier 2 services; continue Tier 1 delivery |

The synthetic monitor records `deliveryLevel` and `backupDeliveryRequired` metadata for each Tier 1 launch. Critical startup breaches fail deployment gates.

## Synthetic Monitoring

Run every 5 minutes:

```bash
npx tsx scripts/synthetic-learning-monitor.ts
```

Required checks:

- `flashcards_launch`
- `cat_launch`
- `practice_questions_launch`
- `lesson_launch`
- `clinical_skills_launch`
- `pharmacology_launch`
- `ecg_launch`

The monitor logs in with the QA paid account, launches each activity, rejects loading states, captures screenshots, and posts results to `/api/internal/synthetic-learning-monitor`.

Alert sinks:

- `SYNTHETIC_MONITOR_ALERT_EMAILS`
- `SYNTHETIC_MONITOR_SLACK_WEBHOOK_URL`
- `SYNTHETIC_MONITOR_DISCORD_WEBHOOK_URL`

Thresholds:

- Primary startup target: under 2 seconds.
- Backup Delivery Service threshold: 5 seconds.
- Activity startup over 10 seconds: warning.
- Activity startup over 30 seconds: critical.

## Health Checks

- `/healthz`: process liveness.
- `/readyz`: handler readiness.
- `/api/health/activity-startup`: database-backed activity startup probe.
- `/api/internal/reliability/check`: internal reliability checks.
- `/api/internal/synthetic-learning-monitor`: authenticated synthetic result ingestion.

## Secondary Deployment

Target standby:

- `backup.nursenest.ca`
- Separate application deployment.
- Same codebase and canonical content source.
- Same authentication provider.
- Database replica or promoted restore target.
- Independent health checks against `/healthz`, `/readyz`, `/api/health/activity-startup`, and synthetic Tier 1 activity launches.

Failover steps live in `docs/disaster-recovery-runbook.md` and `docs/failover-matrix.md`.

## Read Replica Strategy

Use the primary database for writes and canonical content publishing. Use a read-only replica for Tier 1 content reads when primary reads are unavailable or overloaded:

- Question delivery reads.
- Flashcard deck reads.
- Lesson manifest reads.
- CAT pool reads.
- Clinical Skills, Pharmacology, and ECG metadata reads.

Do not write progress, submissions, billing state, referrals, friend activity, or analytics to the replica. Queue or skip Tier 2 writes during Emergency Study Mode.

## Cached Emergency Delivery

Precompute and cache:

- Question metadata and first-item launch payloads.
- Flashcard deck manifests and first-card payloads.
- Lesson manifests and first visible section metadata.
- CAT pool manifests.
- Clinical Skills, Pharmacology, and ECG manifests.

Caches must be derived from the canonical content source. Do not create duplicate question banks, flashcard systems, CAT engines, or parallel content stores.

## Database Protection

Required backup policy:

- Daily backups retained for 30 days.
- Weekly backups retained for 6 months.
- Monthly backups retained for 1 year.
- Point-in-time recovery enabled where provider supports it.
- Monthly restore test into a non-production environment.

During database degradation, learners should continue from Redis/content snapshots/device cache where available. Do not clear entitlement grace caches during an incident.

## Deployment Safety Gate

Before deployment:

- TypeScript validation.
- Referral/social/resilience contract tests.
- Flashcard launch test.
- CAT launch test.
- Practice Questions launch test.
- Lesson launch test.
- Synthetic monitor smoke where QA credentials are available.

Block deployment if any Tier 1 launch fails.

Command:

```bash
npm run gate:learning-delivery
```

If `LEARNING_DELIVERY_ROLLBACK_WEBHOOK_URL` is configured, the gate posts rollback context when Tier 1 synthetic launch checks fail. Platform-specific rollback automation should wire this webhook to the last healthy deployment.

## Incident Checklist

1. Confirm scope in Admin Operations Center and `/api/health/activity-startup`.
2. Enable Emergency Study Mode if Tier 2 systems are slow or unstable.
3. Verify Tier 1 synthetic checks.
4. If primary deployment failed, route traffic to `backup.nursenest.ca`.
5. If database failed, follow database outage steps in `docs/disaster-recovery-runbook.md`.
6. Capture logs, screenshots, and failing requests for startup over 30 seconds.
7. Keep learners studying; defer Tier 2 recovery until Tier 1 is stable.
