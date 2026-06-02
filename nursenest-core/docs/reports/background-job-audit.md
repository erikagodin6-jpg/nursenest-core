# Background Job Audit

Generated: 2026-06-02

## Scope

Reviewed source evidence for blog generation, notifications, emails, Stripe processing, content generation, and schedulers.

## Findings

| System | Current risk | Blocking operation | Queue requirement |
| --- | --- | --- | --- |
| Stripe webhook | Medium | Subscription/user/entitlement writes plus notification paths. | Idempotent webhook worker and deferred notifications. |
| Email notifications | Medium | Provider latency/errors can slow user-facing flows if synchronous. | Queue with retry and dead-letter logging. |
| SMS notifications | Medium | Twilio provider latency and rate limits. | Queue, rate limit, provider failure counters. |
| Blog generation/campaigns | High | Per-item create/update/failure writes during campaign chunks. | Dedicated worker concurrency cap and DB-health throttle. |
| Content generation | High | Large writes and quality checks can contend with learner traffic. | Separate worker or scheduled windows. |
| Blog scheduler | Medium | Large schedule table operations. | Batch reads/writes; avoid per-row loops. |
| Retention/campaigns | Medium | Candidate scan plus per-user lookups. | Aggregate prefetch and throttled send queue. |

## Requirements Before 500+ Users

1. Provider notifications must not block checkout/webhook success.
2. Content and blog generation must pause when DB pool utilization or p95 request latency is high.
3. Job runners need concurrency limits independent from web request concurrency.
4. Every job type needs success/failure/retry/dead-letter metrics.

