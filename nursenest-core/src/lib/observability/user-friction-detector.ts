/**
 * User Friction Detector
 *
 * Detects signals of learner frustration and friction during platform use.
 *
 * Friction signals tracked:
 *   - Repeated rapid retries (same action within 2s)
 *   - Rapid page refreshes (F5 storm)
 *   - Navigation loops (A→B→A→B pattern)
 *   - Button spam (click rate > threshold)
 *   - Failed activity launches
 *   - Error encounters
 *   - Repeated form resubmissions
 *
 * Frustration scores:
 *   0–20   : Low      (normal usage patterns)
 *   21–45  : Moderate (some friction, monitor)
 *   46–70  : High     (clear frustration signals)
 *   71–100 : Critical (likely unable to complete task)
 *
 * Server-side recording: call these functions in route handlers and server actions.
 * Client-side signals: emitted by the learner-friction-beacon component (browser).
 *
 * Usage:
 *   import { recordFrictionEvent, getFrustrationScore } from "@/lib/observability/user-friction-detector";
 *
 *   recordFrictionEvent({ userId, sessionId, signal: "activity_launch_failed",
 *     activity: "cat", context: "CAT launch timeout" });
 */

import { safeServerLog } from "@/lib/observability/safe-server-log";

// ─── Types ────────────────────────────────────────────────────────────────────

export type FrictionSignal =
  | "repeated_retry"           // Same action retried ≥ 2× within 10s
  | "rapid_refresh"            // Page refreshed ≥ 3× within 30s
  | "navigation_loop"          // A→B→A pattern detected
  | "button_spam"              // ≥ 5 clicks on same element in 3s
  | "activity_launch_failed"   // Activity failed to initialize
  | "error_encountered"        // User saw an error state
  | "form_resubmit"            // Form submitted multiple times
  | "load_timeout"             // Activity took too long to load
  | "cat_restart_loop"         // CAT exam restarted without completing
  | "lesson_load_failure"      // Lesson content failed to render
  | "question_submit_failure"  // Question answer failed to submit
  | "flashcard_load_failure";  // Flashcard session failed to start

export type FrustrationLevel = "low" | "moderate" | "high" | "critical";

export type FrictionEvent = {
  userId: string;
  sessionId?: string;
  signal: FrictionSignal;
  activity?: string;
  route?: string;
  context?: string;
  /** Unix timestamp (ms). */
  timestamp: number;
  /** Signal weight for frustration score (1-10). */
  weight: number;
};

// ─── Signal weights ───────────────────────────────────────────────────────────

const SIGNAL_WEIGHTS: Record<FrictionSignal, number> = {
  repeated_retry:          5,
  rapid_refresh:           4,
  navigation_loop:         3,
  button_spam:             2,
  activity_launch_failed: 10,
  error_encountered:       6,
  form_resubmit:           4,
  load_timeout:            8,
  cat_restart_loop:        7,
  lesson_load_failure:     9,
  question_submit_failure: 8,
  flashcard_load_failure:  7,
};

// ─── In-process session store ─────────────────────────────────────────────────

type SessionBucket = {
  events: FrictionEvent[];
  lastSeenAt: number;
};

const WINDOW_MS = 30 * 60 * 1000; // 30-minute session window
const MAX_EVENTS_PER_SESSION = 50;
const sessionStore = new Map<string, SessionBucket>();

function getOrCreateSession(sessionKey: string): SessionBucket {
  let b = sessionStore.get(sessionKey);
  if (!b) {
    b = { events: [], lastSeenAt: Date.now() };
    sessionStore.set(sessionKey, b);
  }
  b.lastSeenAt = Date.now();
  return b;
}

/** Evict expired sessions (older than WINDOW_MS). Call periodically to prevent leak. */
export function evictExpiredFrictionSessions(): void {
  const cutoff = Date.now() - WINDOW_MS;
  for (const [key, bucket] of sessionStore) {
    if (bucket.lastSeenAt < cutoff) sessionStore.delete(key);
  }
}

// ─── Recording ────────────────────────────────────────────────────────────────

/**
 * Record a friction signal for a user session.
 * The session key is derived from userId (and optionally sessionId).
 */
export function recordFrictionEvent(opts: {
  userId: string;
  sessionId?: string;
  signal: FrictionSignal;
  activity?: string;
  route?: string;
  context?: string;
}): void {
  const sessionKey = `${opts.userId}:${opts.sessionId ?? "default"}`;
  const b = getOrCreateSession(sessionKey);
  const weight = SIGNAL_WEIGHTS[opts.signal] ?? 5;

  const event: FrictionEvent = {
    userId: opts.userId,
    sessionId: opts.sessionId,
    signal: opts.signal,
    activity: opts.activity,
    route: opts.route,
    context: opts.context?.slice(0, 200),
    timestamp: Date.now(),
    weight,
  };

  b.events.push(event);
  if (b.events.length > MAX_EVENTS_PER_SESSION) b.events.shift();

  // Emit friction_event structured log
  safeServerLog("learner", "friction_event", {
    signal: opts.signal,
    activity: opts.activity,
    weight,
    sessionFrustrationScore: computeFrustrationScore(sessionKey).score,
  });

  // Alert on high-weight signals immediately
  if (weight >= 8) {
    safeServerLog("learner", "friction_high_severity", {
      signal: opts.signal,
      activity: opts.activity,
      context: event.context,
    });
  }
}

// ─── Frustration scoring ──────────────────────────────────────────────────────

export type FrustrationScore = {
  score: number;
  level: FrustrationLevel;
  dominantSignal: FrictionSignal | null;
  eventCount: number;
  recentSignals: FrictionSignal[];
  recommendation: string;
};

function frustrationLevel(score: number): FrustrationLevel {
  if (score <= 20) return "low";
  if (score <= 45) return "moderate";
  if (score <= 70) return "high";
  return "critical";
}

/**
 * Compute frustration score for a user session.
 * Signals decay over time (older signals weighted less).
 */
export function computeFrustrationScore(sessionKey: string): FrustrationScore {
  const b = sessionStore.get(sessionKey);
  if (!b || b.events.length === 0) {
    return {
      score: 0,
      level: "low",
      dominantSignal: null,
      eventCount: 0,
      recentSignals: [],
      recommendation: "No friction detected.",
    };
  }

  const now = Date.now();
  const FIVE_MIN = 5 * 60 * 1000;

  let totalWeight = 0;
  const signalCounts = new Map<FrictionSignal, number>();

  for (const ev of b.events) {
    const ageMs = now - ev.timestamp;
    // Decay: events >5min old count at 50%; events >15min count at 25%
    const decayFactor = ageMs > 15 * 60_000 ? 0.25 : ageMs > FIVE_MIN ? 0.5 : 1;
    totalWeight += ev.weight * decayFactor;
    signalCounts.set(ev.signal, (signalCounts.get(ev.signal) ?? 0) + 1);
  }

  // Normalize to 0-100 (max reasonable weight ≈ 100)
  const score = Math.min(100, Math.round(totalWeight * 2));

  let dominantSignal: FrictionSignal | null = null;
  let maxCount = 0;
  for (const [sig, count] of signalCounts) {
    if (count > maxCount) {
      maxCount = count;
      dominantSignal = sig;
    }
  }

  const recentSignals = b.events
    .filter((e) => now - e.timestamp < FIVE_MIN)
    .map((e) => e.signal)
    .slice(-5);

  const level = frustrationLevel(score);
  const recommendations: Record<FrustrationLevel, string> = {
    low: "Normal usage — no action needed.",
    moderate: "Some friction detected. Monitor for escalation.",
    high: "User showing frustration signals. Consider proactive support offer.",
    critical: "High frustration — likely unable to complete task. Immediate attention warranted.",
  };

  return {
    score,
    level,
    dominantSignal,
    eventCount: b.events.length,
    recentSignals,
    recommendation: recommendations[level],
  };
}

/**
 * Compute frustration score by userId (uses latest session for that user).
 */
export function computeUserFrustrationScore(userId: string): FrustrationScore {
  // Find the most recent session for this user
  let bestKey: string | null = null;
  let bestTime = 0;
  for (const [key, bucket] of sessionStore) {
    if (key.startsWith(`${userId}:`) && bucket.lastSeenAt > bestTime) {
      bestTime = bucket.lastSeenAt;
      bestKey = key;
    }
  }
  return bestKey ? computeFrustrationScore(bestKey) : {
    score: 0,
    level: "low",
    dominantSignal: null,
    eventCount: 0,
    recentSignals: [],
    recommendation: "No friction detected.",
  };
}

// ─── Platform-level friction summary ─────────────────────────────────────────

export type PlatformFrictionSummary = {
  activeSessions: number;
  highFrustrationCount: number;
  criticalFrustrationCount: number;
  topSignals: Array<{ signal: FrictionSignal; count: number }>;
  avgFrustrationScore: number;
};

export function getPlatformFrictionSummary(): PlatformFrictionSummary {
  evictExpiredFrictionSessions();

  let high = 0;
  let critical = 0;
  let totalScore = 0;
  const signalCounts = new Map<FrictionSignal, number>();

  for (const [key, bucket] of sessionStore) {
    const score = computeFrustrationScore(key);
    totalScore += score.score;
    if (score.level === "high") high++;
    if (score.level === "critical") critical++;
    for (const ev of bucket.events) {
      signalCounts.set(ev.signal, (signalCounts.get(ev.signal) ?? 0) + 1);
    }
  }

  const n = sessionStore.size;
  const topSignals = [...signalCounts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([signal, count]) => ({ signal, count }));

  return {
    activeSessions: n,
    highFrustrationCount: high,
    criticalFrustrationCount: critical,
    topSignals,
    avgFrustrationScore: n > 0 ? Math.round(totalScore / n) : 0,
  };
}

export function resetFrictionStore(): void {
  sessionStore.clear();
}
