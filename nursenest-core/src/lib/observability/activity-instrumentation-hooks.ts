/**
 * Activity Instrumentation Hooks
 *
 * Thin adapter layer that wires the observability modules into route handlers
 * without requiring deep modification of existing code.
 *
 * Pattern: call `withActivityObservability()` inside any route handler to
 * automatically emit: started, completed/abandoned, audit, friction signals.
 *
 * The hooks are designed to be non-blocking and non-fatal — any error in
 * observability recording must never affect the learner's response.
 *
 * Usage in a route handler:
 *   import { emitActivityCompleted, emitActivityStarted } from "@/lib/observability/activity-instrumentation-hooks";
 *
 *   // When activity begins:
 *   void emitActivityStarted({ userId, activity: "clinical-skills", tier });
 *
 *   // When activity completes:
 *   void emitActivityCompleted({ userId, activity: "clinical-skills", tier, durationMs: 240_000 });
 */

import "server-only";
import {
  recordActivityStarted,
  recordActivityCompleted,
  recordActivityAbandoned,
  recordActivityError,
  recordActivityResumed,
  type LearnerActivityType,
} from "@/lib/observability/learner-completion-observability";
import {
  recordAuditEvent,
  type AuditEventType,
} from "@/lib/observability/user-activity-audit-trail";
import {
  recordFrictionEvent,
  type FrictionSignal,
} from "@/lib/observability/user-friction-detector";
import { safeServerLog } from "@/lib/observability/safe-server-log";

// ─── Activity → audit event mapping ──────────────────────────────────────────

const ACTIVITY_TO_AUDIT: Partial<Record<LearnerActivityType, AuditEventType>> = {
  questions:        "questions_session_completed",
  flashcards:       "flashcards_session_completed",
  lessons:          "lesson_completed",
  cat:              "cat_exam_completed",
  loft:             "simulation_case_completed",
  "clinical-skills":"clinical_skill_viewed",
  ecg:              "ecg_session_completed",
  pharmacology:     "pharmacology_session_completed",
  "study-plan":     "study_plan_day_completed",
  "smart-review":   "smart_review_session_completed",
};

// ─── Emit helpers (all void — never block or throw) ───────────────────────────

export type ActivityEventBase = {
  userId: string;
  activity: LearnerActivityType;
  tier: string;
  pathwayId?: string;
  sessionId?: string;
  regionHint?: string;
};

/**
 * Fire-and-forget: emit activity_started.
 * Call at the beginning of a learner activity session.
 */
export function emitActivityStarted(opts: ActivityEventBase): void {
  try {
    recordActivityStarted({
      userId: opts.userId,
      activity: opts.activity,
      tier: opts.tier,
      pathwayId: opts.pathwayId,
      sessionId: opts.sessionId,
      startTimestamp: new Date().toISOString(),
    });
  } catch {
    /* observability must never break the route */
  }
}

/**
 * Fire-and-forget: emit activity_completed + audit record.
 * Call when a learner completes an activity.
 */
export function emitActivityCompleted(
  opts: ActivityEventBase & {
    durationMs: number;
    itemsCompleted?: number;
    score?: number;
  },
): void {
  try {
    recordActivityCompleted({
      userId: opts.userId,
      activity: opts.activity,
      tier: opts.tier,
      sessionId: opts.sessionId,
      durationMs: opts.durationMs,
      itemsCompleted: opts.itemsCompleted,
      score: opts.score,
    });
  } catch {
    /* non-fatal */
  }

  // Also write to audit trail
  const auditType = ACTIVITY_TO_AUDIT[opts.activity];
  if (auditType) {
    try {
      recordAuditEvent({
        userId: opts.userId,
        eventType: auditType,
        timestamp: new Date().toISOString(),
        tier: opts.tier,
        quantity: opts.itemsCompleted ?? 1,
        regionHint: opts.regionHint,
      });
    } catch {
      /* non-fatal */
    }
  }
}

/**
 * Fire-and-forget: emit activity_abandoned.
 * Call when a learner navigates away before completing.
 */
export function emitActivityAbandoned(
  opts: ActivityEventBase & {
    durationMs: number;
    completionRatio?: number;
    reason?: "navigation" | "timeout" | "error" | "unknown";
  },
): void {
  try {
    recordActivityAbandoned({
      userId: opts.userId,
      activity: opts.activity,
      tier: opts.tier,
      sessionId: opts.sessionId,
      durationMs: opts.durationMs,
      completionRatio: opts.completionRatio,
      reason: opts.reason ?? "unknown",
    });
  } catch {
    /* non-fatal */
  }
}

/**
 * Fire-and-forget: emit activity_error.
 * Call when an activity fails with an error visible to the learner.
 */
export function emitActivityError(
  opts: ActivityEventBase & { errorMessage: string },
): void {
  try {
    recordActivityError(opts.activity, opts.tier, opts.errorMessage, {
      userId: opts.userId,
      sessionId: opts.sessionId,
      pathwayId: opts.pathwayId,
    });
  } catch {
    /* non-fatal */
  }
  // Also record as friction event
  try {
    recordFrictionEvent({
      userId: opts.userId,
      sessionId: opts.sessionId,
      signal: "activity_launch_failed",
      activity: opts.activity,
    });
  } catch {
    /* non-fatal */
  }
}

/**
 * Fire-and-forget: emit activity_resume.
 * Call when a learner returns to an active study surface.
 */
export function emitActivityResume(
  opts: ActivityEventBase & {
    durationMs?: number;
  },
): void {
  try {
    recordActivityResumed({
      userId: opts.userId,
      activity: opts.activity,
      tier: opts.tier,
      pathwayId: opts.pathwayId,
      sessionId: opts.sessionId,
      durationMs: opts.durationMs,
    });
  } catch {
    /* non-fatal */
  }
}

/**
 * Fire-and-forget: record a friction signal.
 */
export function emitFriction(
  opts: ActivityEventBase & {
    signal: FrictionSignal;
    context?: string;
  },
): void {
  try {
    recordFrictionEvent({
      userId: opts.userId,
      sessionId: opts.sessionId,
      signal: opts.signal,
      activity: opts.activity,
      context: opts.context,
    });
  } catch {
    /* non-fatal */
  }
}

/**
 * Record a login event to the audit trail. Call from the auth login success handler.
 */
export function emitLoginAudit(userId: string, tier: string, regionHint?: string): void {
  try {
    recordAuditEvent({
      userId,
      eventType: "login",
      timestamp: new Date().toISOString(),
      tier,
      regionHint,
    });
  } catch {
    /* non-fatal */
  }
}

/**
 * Record a session start to the audit trail and time-to-learning tracker.
 */
export function emitSessionStart(userId: string, sessionId: string, tier: string): void {
  try {
    recordAuditEvent({
      userId,
      eventType: "session_start",
      timestamp: new Date().toISOString(),
      tier,
    });
  } catch {
    /* non-fatal */
  }

  // Wire time-to-learning session start
  try {
    const { recordSessionStart } = require("@/lib/observability/time-to-learning-metrics") as typeof import("@/lib/observability/time-to-learning-metrics");
    recordSessionStart(userId, sessionId);
  } catch {
    /* non-fatal */
  }
}

/**
 * Convenience wrapper: wrap a route handler body with activity started/completed bookends.
 * The handler is called normally; completion is emitted when the handler returns.
 *
 * NOTE: Only emits 'completed' — call emitActivityAbandoned() separately for abandonment.
 */
export async function withActivityObservability<T>(
  opts: ActivityEventBase & { emitStarted?: boolean },
  handler: () => Promise<T>,
): Promise<T> {
  if (opts.emitStarted !== false) {
    emitActivityStarted(opts);
  }
  const t0 = Date.now();
  try {
    const result = await handler();
    emitActivityCompleted({ ...opts, durationMs: Date.now() - t0 });
    return result;
  } catch (e) {
    const msg = e instanceof Error ? e.message : "unknown error";
    emitActivityError({ ...opts, errorMessage: msg });
    throw e;
  }
}
