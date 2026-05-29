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

Emergency Study Mode disables or hides Tier 2 surfaces such as recommendations, readiness updates, leaderboards, friend activity, referral activity, gamification, and optional analytics. It must continue to serve questions, flashcards, CAT, lessons, clinical skills, pharmacology, and ECG.

## Synthetic Monitoring

Run every 15 minutes:

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

## Incident Checklist

1. Confirm scope in Admin Operations Center and `/api/health/activity-startup`.
2. Enable Emergency Study Mode if Tier 2 systems are slow or unstable.
3. Verify Tier 1 synthetic checks.
4. If primary deployment failed, route traffic to `backup.nursenest.ca`.
5. If database failed, follow database outage steps in `docs/disaster-recovery-runbook.md`.
6. Capture logs, screenshots, and failing requests for startup over 30 seconds.
7. Keep learners studying; defer Tier 2 recovery until Tier 1 is stable.

