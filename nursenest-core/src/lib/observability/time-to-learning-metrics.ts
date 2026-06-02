/**
 * Time-to-Learning Metrics
 *
 * Measures how quickly learners go from landing on the dashboard to
 * their first meaningful learning interaction per activity.
 *
 * Tracked journeys:
 *   Dashboard → First Question answered
 *   Dashboard → First Flashcard reviewed
 *   Dashboard → First Lesson opened
 *   Dashboard → First CAT question answered
 *   Dashboard → First LOFT/OSCE interaction
 *   Dashboard → First ECG card viewed
 *   Dashboard → First Pharmacology activity
 *
 * Targets (p50 < target):
 *   Questions  < 3 000ms
 *   Flashcards < 3 000ms
 *   Lessons    < 3 000ms
 *   CAT        < 5 000ms
 *   LOFT       < 5 000ms
 *   ECG        < 5 000ms
 *   Pharmacology < 3 000ms
 *
 * Measurement approach:
 *   - Server-side: record session start on /app load, record first
 *     activity interaction timestamp from respective API routes
 *   - Client-side: Playwright tests capture wall-clock from navigation
 *     start to first meaningful interaction event
 *
 * Usage:
 *   // When learner visits dashboard:
 *   recordSessionStart(userId, sessionId);
 *
 *   // When learner submits first question:
 *   recordFirstActivity(userId, sessionId, "questions");
 */

import { safeServerLog } from "@/lib/observability/safe-server-log";

// ─── Types ────────────────────────────────────────────────────────────────────

export type LearningJourney =
  | "questions"
  | "flashcards"
  | "lessons"
  | "cat"
  | "loft"
  | "ecg"
  | "pharmacology"
  | "clinical-skills";

export type TimeToLearningBudget = {
  journey: LearningJourney;
  p50TargetMs: number;
  p95TargetMs: number;
  description: string;
};

export const TIME_TO_LEARNING_BUDGETS: readonly TimeToLearningBudget[] = [
  { journey: "questions",      p50TargetMs: 3_000, p95TargetMs: 8_000,  description: "Dashboard → first question answered" },
  { journey: "flashcards",     p50TargetMs: 3_000, p95TargetMs: 8_000,  description: "Dashboard → first flashcard reviewed" },
  { journey: "lessons",        p50TargetMs: 3_000, p95TargetMs: 8_000,  description: "Dashboard → first lesson opened" },
  { journey: "cat",            p50TargetMs: 5_000, p95TargetMs: 12_000, description: "Dashboard → first CAT question answered" },
  { journey: "loft",           p50TargetMs: 5_000, p95TargetMs: 12_000, description: "Dashboard → first LOFT interaction" },
  { journey: "ecg",            p50TargetMs: 5_000, p95TargetMs: 15_000, description: "Dashboard → first ECG card viewed" },
  { journey: "pharmacology",   p50TargetMs: 3_000, p95TargetMs: 8_000,  description: "Dashboard → first pharmacology activity" },
  { journey: "clinical-skills", p50TargetMs: 3_000, p95TargetMs: 8_000, description: "Dashboard → first clinical skill viewed" },
];

// ─── In-process session tracking ─────────────────────────────────────────────

const MAX_SAMPLES = 500;
const sessionStarts = new Map<string, number>(); // sessionId → start timestamp

type JourneySample = { durationMs: number; userId: string; tier?: string };
const journeySamples = new Map<LearningJourney, JourneySample[]>();

function getJourneySamples(journey: LearningJourney): JourneySample[] {
  let arr = journeySamples.get(journey);
  if (!arr) {
    arr = [];
    journeySamples.set(journey, arr);
  }
  return arr;
}

// ─── Recording ────────────────────────────────────────────────────────────────

/**
 * Record when a learner's session starts (landing on /app dashboard).
 */
export function recordSessionStart(userId: string, sessionId: string): void {
  sessionStarts.set(sessionId, Date.now());
}

/**
 * Record when a learner makes their first interaction with an activity
 * during the current session. Computes time-to-learning from session start.
 */
export function recordFirstActivity(
  userId: string,
  sessionId: string,
  journey: LearningJourney,
  tier?: string,
): void {
  const startMs = sessionStarts.get(sessionId);
  if (!startMs) return; // No session start recorded — cannot compute TTL

  const durationMs = Date.now() - startMs;
  const budget = TIME_TO_LEARNING_BUDGETS.find((b) => b.journey === journey);
  const target = budget?.p50TargetMs ?? 5_000;
  const isSlow = durationMs > target;

  const samples = getJourneySamples(journey);
  samples.push({ durationMs, userId: userId.slice(0, 8), tier });
  if (samples.length > MAX_SAMPLES) samples.shift();

  safeServerLog("learner", "time_to_learning", {
    journey,
    durationMs,
    targetMs: target,
    slow: isSlow,
    tier,
  });

  if (isSlow) {
    safeServerLog("learner", "time_to_learning_slow", {
      journey,
      durationMs,
      targetMs: target,
      overageMs: durationMs - target,
      tier,
    });
  }
}

// ─── Statistics ───────────────────────────────────────────────────────────────

function pct(sorted: number[], p: number): number {
  if (sorted.length === 0) return 0;
  const idx = Math.ceil((p / 100) * sorted.length) - 1;
  return sorted[Math.max(0, idx)];
}

export type JourneyStat = {
  journey: LearningJourney;
  description: string;
  p50TargetMs: number;
  p95TargetMs: number;
  sampleCount: number;
  p50Ms: number | null;
  p95Ms: number | null;
  avgMs: number | null;
  p50Status: "pass" | "warn" | "fail";
  p95Status: "pass" | "warn" | "fail";
};

export function getTimeToLearningStats(): JourneyStat[] {
  return TIME_TO_LEARNING_BUDGETS.map((budget) => {
    const samples = getJourneySamples(budget.journey);
    if (samples.length === 0) {
      return {
        journey: budget.journey,
        description: budget.description,
        p50TargetMs: budget.p50TargetMs,
        p95TargetMs: budget.p95TargetMs,
        sampleCount: 0,
        p50Ms: null,
        p95Ms: null,
        avgMs: null,
        p50Status: "pass",
        p95Status: "pass",
      };
    }

    const sorted = samples.map((s) => s.durationMs).sort((a, b) => a - b);
    const p50 = pct(sorted, 50);
    const p95 = pct(sorted, 95);
    const avg = sorted.reduce((s, v) => s + v, 0) / sorted.length;

    return {
      journey: budget.journey,
      description: budget.description,
      p50TargetMs: budget.p50TargetMs,
      p95TargetMs: budget.p95TargetMs,
      sampleCount: samples.length,
      p50Ms: Math.round(p50),
      p95Ms: Math.round(p95),
      avgMs: Math.round(avg),
      p50Status: p50 <= budget.p50TargetMs ? "pass" : p50 <= budget.p50TargetMs * 1.5 ? "warn" : "fail",
      p95Status: p95 <= budget.p95TargetMs ? "pass" : p95 <= budget.p95TargetMs * 1.5 ? "warn" : "fail",
    };
  });
}

export function resetTimeToLearningMetrics(): void {
  sessionStarts.clear();
  journeySamples.clear();
}
