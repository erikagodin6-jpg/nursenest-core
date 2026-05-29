/**
 * NurseNest Event Taxonomy — Platform Intelligence Layer
 *
 * Single source of truth for all structured events emitted by the platform.
 * Every event name, category, and severity used in:
 *   - structured logs (safeServerLog)
 *   - PostHog analytics
 *   - Sentry signals
 *   - Log drain alerts
 *   - Operations center dashboard
 *
 * Categories:
 *   learner      — learner activity, completion, friction, learning outcomes
 *   performance  — TTFB, load time, cache, DB, pool
 *   billing      — checkout, subscription, chargeback, reconciliation
 *   auth         — login, signup, token, session
 *   content      — lesson, question, flashcard, clinical content
 *   seo          — blog, sitemap, authority clusters, hub health
 *   admin        — admin actions, overrides, reconciliation
 *   system       — deploy, boot, env validation, cron
 *   audit        — immutable compliance records
 *
 * Naming convention: {category}_{noun}_{verb}
 * Examples: learner_activity_started, billing_subscription_cancelled
 */

// ─── Learner events ───────────────────────────────────────────────────────────

export const LEARNER_EVENTS = {
  // Activity lifecycle
  ACTIVITY_STARTED:        "learner_activity_started",
  ACTIVITY_COMPLETED:      "learner_activity_completed",
  ACTIVITY_ABANDONED:      "learner_activity_abandoned",
  ACTIVITY_ERRORED:        "learner_activity_errored",
  // Friction
  FRICTION_EVENT:          "learner_friction_event",
  FRICTION_HIGH_SEVERITY:  "learner_friction_high_severity",
  FRUSTRATION_ESCALATED:   "learner_frustration_escalated",
  // Learning
  WEAKNESS_DETECTED:       "learner_weakness_detected",
  REMEDIATION_RECOMMENDED: "learner_remediation_recommended",
  REMEDIATION_OPENED:      "learner_remediation_opened",
  REMEDIATION_COMPLETED:   "learner_remediation_completed",
  LEARNING_OUTCOME:        "learner_learning_outcome",
  // Time to learning
  TIME_TO_LEARNING:        "learner_time_to_learning",
  TIME_TO_LEARNING_SLOW:   "learner_time_to_learning_slow",
  // Session
  SESSION_STARTED:         "learner_session_started",
  SESSION_ENDED:           "learner_session_ended",
} as const;

// ─── Performance events ───────────────────────────────────────────────────────

export const PERFORMANCE_EVENTS = {
  ACTIVITY_STARTUP_SLOW:   "perf_activity_startup_slow",
  ROUTE_SLOW:              "perf_route_slow",
  N_PLUS_ONE_DETECTED:     "perf_n_plus_one_detected",
  CACHE_HIT:               "perf_cache_hit",
  CACHE_MISS:              "perf_cache_miss",
  SNAPSHOT_CACHE_MISS:     "perf_snapshot_cache_miss",
  MANIFEST_CACHE_MISS:     "perf_manifest_cache_miss",
  POOL_UTILIZATION_ALERT:  "perf_pool_utilization_alert",
  CACHE_OBSERVABILITY:     "perf_cache_observability_summary",
} as const;

// ─── Billing events ───────────────────────────────────────────────────────────

export const BILLING_EVENTS = {
  CHECKOUT_STARTED:        "billing_checkout_started",
  CHECKOUT_FAILED:         "billing_checkout_failed",
  CHECKOUT_COMPLETED:      "billing_checkout_completed",
  SUBSCRIPTION_ACTIVATED:  "billing_subscription_activated",
  SUBSCRIPTION_CANCELLED:  "billing_subscription_cancelled",
  SUBSCRIPTION_RENEWED:    "billing_subscription_renewed",
  ENTITLEMENT_GRANTED:     "billing_entitlement_granted",
  ENTITLEMENT_REVOKED:     "billing_entitlement_revoked",
  CHARGEBACK_RISK_FLAG:    "billing_chargeback_risk_flagged",
  RECONCILIATION_MISMATCH: "billing_reconciliation_mismatch",
} as const;

// ─── Auth events ──────────────────────────────────────────────────────────────

export const AUTH_EVENTS = {
  LOGIN_SUCCESS:            "auth_login_succeeded",
  LOGIN_FAILED:             "auth_login_failed",
  SIGNUP_OK:                "auth_signup_ok",
  SIGNUP_FAILED:            "auth_signup_failed",
  SESSION_EXPIRED:          "auth_session_expired",
  PASSWORD_RESET_REQUESTED: "auth_password_reset_requested",
  TOKEN_REVOKED:            "auth_token_revoked",
} as const;

// ─── Content events ───────────────────────────────────────────────────────────

export const CONTENT_EVENTS = {
  LESSON_STARTED:          "content_lesson_started",
  LESSON_COMPLETED:        "content_lesson_completed",
  QUESTION_GRADED:         "content_question_graded",
  FLASHCARD_REVIEWED:      "content_flashcard_reviewed",
  CAT_EXAM_STARTED:        "content_cat_exam_started",
  CAT_EXAM_COMPLETED:      "content_cat_exam_completed",
  CLINICAL_SKILL_VIEWED:   "content_clinical_skill_viewed",
  ECG_SESSION_STARTED:     "content_ecg_session_started",
  SIMULATION_STARTED:      "content_simulation_started",
  SIMULATION_COMPLETED:    "content_simulation_completed",
} as const;

// ─── SEO events ───────────────────────────────────────────────────────────────

export const SEO_EVENTS = {
  HEALTH_SNAPSHOT:         "seo_health_snapshot",
  REGRESSION_ALERT:        "seo_regression_alert",
  BLOG_COUNT_DROP:         "seo_regression_alert_blog_count_drop",
  SITEMAP_MISSING:         "seo_regression_alert_sitemap_missing",
  HUB_MISSING:             "seo_regression_alert_hub_missing",
  CLUSTER_COUNT_DROP:      "seo_regression_alert_cluster_count_drop",
} as const;

// ─── Audit events ─────────────────────────────────────────────────────────────

export const AUDIT_EVENTS = {
  LOGIN:                   "audit_login",
  SESSION_START:           "audit_session_start",
  SUBSCRIPTION_ACTIVATED:  "audit_subscription_activated",
  QUESTIONS_COMPLETED:     "audit_questions_session_completed",
  FLASHCARDS_COMPLETED:    "audit_flashcards_session_completed",
  LESSON_COMPLETED:        "audit_lesson_completed",
  CAT_COMPLETED:           "audit_cat_exam_completed",
  SIMULATION_COMPLETED:    "audit_simulation_case_completed",
  CHARGEBACK_REPORT_GENERATED: "audit_chargeback_report_generated",
} as const;

// ─── Alerting event taxonomy ──────────────────────────────────────────────────

export type AlertEventType =
  | "completion_rate_drop"
  | "frustration_spike"
  | "adaptive_failure"
  | "feature_degraded"
  | "seo_regression"
  | "subscription_failure"
  | "chargeback_risk"
  | "cache_degradation"
  | "database_pressure"
  | "pool_exhaustion_risk"
  | "n_plus_one_detected"
  | "time_to_learning_slow";

export type AlertSeverity = "info" | "warn" | "critical" | "emergency";

export type PlatformAlert = {
  type: AlertEventType;
  severity: AlertSeverity;
  message: string;
  detail?: string;
  feature?: string;
  userId?: string;
  timestamp: string;
};

// ─── All events union ─────────────────────────────────────────────────────────

export const ALL_EVENTS = {
  ...LEARNER_EVENTS,
  ...PERFORMANCE_EVENTS,
  ...BILLING_EVENTS,
  ...AUTH_EVENTS,
  ...CONTENT_EVENTS,
  ...SEO_EVENTS,
  ...AUDIT_EVENTS,
} as const;

export type PlatformEventName = (typeof ALL_EVENTS)[keyof typeof ALL_EVENTS];

/** Returns true if an event name is valid in the taxonomy. */
export function isKnownEvent(name: string): name is PlatformEventName {
  return Object.values(ALL_EVENTS).includes(name as PlatformEventName);
}
