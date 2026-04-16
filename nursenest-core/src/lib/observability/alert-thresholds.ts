/**
 * Canonical numeric thresholds for on-call alerts (Sentry Metrics, log drains, synthetic checks).
 * Pair with `docs/alerting-runbooks.md` — alert rules in Sentry / your log platform should reference these names.
 *
 * **Tuning:** adjust here first, then mirror in Sentry alert UI or Terraform.
 */
export const ALERT_THRESHOLDS = {
  /** Synthetic probe failure count within one cron invocation (each failed check increments). */
  synthetic: {
    /** Any single probe failing is CRITICAL for that surface (homepage/login/checkout path). */
    criticalFailedChecksPerRun: 1,
  },

  /** `api.route.count` with `status_bucket:5xx` — rolling window in Sentry (e.g. 5 min). */
  api: {
    /** CRITICAL: sustained user-facing outage signal. */
    fiveXxSpikeCount5m: 25,
    /** HIGH: elevated errors before full outage. */
    fiveXxElevatedCount5m: 8,
  },

  /** `auth.login.failure` — exclude benign buckets in alert filter where possible. */
  auth: {
    /** HIGH: credential / system failures spiking (not single wrong-password). */
    failureSpikeCount5m: 40,
    /** HIGH: DB-backed auth path stress. */
    dbOrSystemFailureCount5m: 5,
  },

  /** `billing.webhook.failure` or log `stripe_webhook` `handler_failed`. */
  billing: {
    /** HIGH: Stripe side effects not applied. */
    webhookFailureCount15m: 3,
  },

  /** `marketing.paywall.proof_neutral` — paywall “proof” line forced to neutral copy. */
  marketing: {
    /** HIGH: homepage stats degraded so often proof cannot show numbers. */
    proofNeutralSpikeCount15m: 30,
  },

  /** `resilience.auto_degraded.engaged` — auto Tier-2 skip due to slow DB / circuits. */
  resilience: {
    /** HIGH: stress path active repeatedly. */
    autoDegradedEngagements15m: 4,
  },

  /** `db.query.slow` with severity or duration distribution tail. */
  db: {
    /** MEDIUM: Prisma slow-query signals (paired with `db.query.duration_ms` p95). */
    slowQueryCount10m: 20,
    /** MEDIUM: tail latency ms (p95 over 15m in Sentry / APM). */
    slowQueryP95Ms: 3000,
  },

  /** `api.route.rate_limited` or structured `http_429`. */
  rateLimit: {
    /** MEDIUM: possible attack or misconfigured client. */
    elevated429Count5m: 120,
  },

  /** Browser: Sentry issues tagged `feature:unhandledrejection` or high-volume distinct fingerprints. */
  client: {
    /** MEDIUM: same release, same fingerprint. */
    repeatedRuntimeErrorsPer15m: 50,
  },

  /** `GET /api/health` JSON `memory.heapUsedMb` from synthetic or probe. */
  runtime: {
    /** MEDIUM: investigate leak or traffic pattern (per-instance, Node heap). */
    heapUsedMbHigh: 900,
  },

  /** Marketing cache: optional — tag-based revalidation misses; platform-specific. */
  cache: {
    /** MEDIUM: document in runbook; requires edge cache metrics if available. */
    criticalPathMissSpikeRelative: 2.0,
  },
} as const;

/** Default owner for engineering alerts (replace in your incident tool). */
export const ALERT_DEFAULT_OWNER_TEAM = "platform-engineering" as const;
