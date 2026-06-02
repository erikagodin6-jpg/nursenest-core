/**
 * Activity Startup Metrics
 *
 * Per-activity timing registry tracking how long each learner activity
 * hub takes to reach interactive state.
 *
 * Tracks:
 *   - Startup time (ms) from navigation to first meaningful content
 *   - Query count per activity launch
 *   - Cache disposition (snapshot hit / manifest hit / DB fallback)
 *   - Payload size
 *   - Historical trend (last N samples)
 *
 * Activities tracked:
 *   Questions, Flashcards, Lessons, Clinical Skills, Pharmacology,
 *   ECG, CAT, LOFT/OSCE, Analytics, Readiness, Dashboard
 *
 * Usage (server-side, in page.tsx or route.ts):
 *   import { recordActivityStartup } from "@/lib/performance/activity-startup-metrics";
 *   recordActivityStartup({ activity: "flashcards", startupMs: 320, queryCount: 3, cacheHit: true });
 *
 * Usage (Playwright, after navigation):
 *   const ms = await measureActivityStartup(page, "flashcards");
 */

import { safeServerLog } from "@/lib/observability/safe-server-log";
import { ROUTE_PERFORMANCE_REGISTRY } from "@/lib/performance/route-registry";

// ─── Activity definitions ─────────────────────────────────────────────────────

export type ActivityKey =
  | "dashboard"
  | "questions"
  | "flashcards"
  | "lessons"
  | "clinical-skills"
  | "pharmacology"
  | "ecg"
  | "cat"
  | "loft"
  | "analytics"
  | "readiness"
  | "study-plan"
  | "smart-review";

export type ActivityDef = {
  key: ActivityKey;
  label: string;
  route: string;
  /** Expected startup budget (ms) — from ROUTE_PERFORMANCE_REGISTRY or explicit. */
  startupBudgetMs: number;
  /** Max query count budget. */
  maxQueryCount: number;
  /** Signal description for monitoring dashboards. */
  description: string;
};

export const ACTIVITY_DEFINITIONS: readonly ActivityDef[] = [
  {
    key: "dashboard",
    label: "Learner Dashboard",
    route: "/app",
    startupBudgetMs: 2000,
    maxQueryCount: 15,
    description: "Hub bootstrap — initial learner context, pathway data, streak.",
  },
  {
    key: "questions",
    label: "Questions",
    route: "/app/questions",
    startupBudgetMs: 2000,
    maxQueryCount: 15,
    description: "Question bank hub — topic filters, session history, progress.",
  },
  {
    key: "flashcards",
    label: "Flashcards",
    route: "/app/flashcards",
    startupBudgetMs: 2000,
    maxQueryCount: 12,
    description: "Flashcard hub — deck list, streak, recently studied.",
  },
  {
    key: "lessons",
    label: "Lessons",
    route: "/app/lessons",
    startupBudgetMs: 2000,
    maxQueryCount: 15,
    description: "Lesson library — catalog load, topic progress, lesson status.",
  },
  {
    key: "clinical-skills",
    label: "Clinical Skills",
    route: "/app/clinical-skills",
    startupBudgetMs: 2000,
    maxQueryCount: 15,
    description: "Clinical Skills hub — checkpoint list, completion state.",
  },
  {
    key: "pharmacology",
    label: "Pharmacology",
    route: "/app/pharmacology",
    startupBudgetMs: 2000,
    maxQueryCount: 15,
    description: "Pharmacology hub — drug category index, mastery status.",
  },
  {
    key: "ecg",
    label: "ECG Workstation",
    route: "/modules/ecg/basic/lessons",
    startupBudgetMs: 2000,
    maxQueryCount: 18,
    description: "ECG module — rhythm catalog, video quiz state, case history.",
  },
  {
    key: "cat",
    label: "CAT Exam",
    route: "/app/practice-tests/cat-launch",
    startupBudgetMs: 3000,
    maxQueryCount: 20,
    description: "CAT launch — adaptive state init, pathway entitlement check.",
  },
  {
    key: "loft",
    label: "LOFT / OSCE",
    route: "/app/osce",
    startupBudgetMs: 3000,
    maxQueryCount: 22,
    description: "OSCE simulation hub — station catalog, attempt history.",
  },
  {
    key: "analytics",
    label: "Analytics",
    route: "/app/analytics",
    startupBudgetMs: 2500,
    maxQueryCount: 20,
    description: "Analytics dashboard — confidence, accuracy, CAT trajectory.",
  },
  {
    key: "readiness",
    label: "Readiness",
    route: "/app/account/readiness",
    startupBudgetMs: 2500,
    maxQueryCount: 20,
    description: "Readiness dashboard — score, trend, weak areas.",
  },
  {
    key: "study-plan",
    label: "Study Plan",
    route: "/app/study-plan",
    startupBudgetMs: 2000,
    maxQueryCount: 15,
    description: "Adaptive study plan — day cards, next action.",
  },
  {
    key: "smart-review",
    label: "Smart Review",
    route: "/app/review",
    startupBudgetMs: 2000,
    maxQueryCount: 15,
    description: "Smart review — confidence-grouped question sets.",
  },
];

/** Activity lookup by key. */
export function getActivityDef(key: ActivityKey): ActivityDef | undefined {
  return ACTIVITY_DEFINITIONS.find((a) => a.key === key);
}

// ─── Startup record type ──────────────────────────────────────────────────────

export type ActivityStartupRecord = {
  activity: ActivityKey;
  /** Wall-clock ms from navigation start to meaningful content visible. */
  startupMs: number;
  /** Number of DB queries during startup. */
  queryCount: number;
  /** Total DB time (ms). */
  dbMs: number;
  /** Whether the snapshot/manifest cache was hit. */
  cacheHit: boolean;
  /** Payload size in KB. */
  payloadKB?: number;
  /** ISO timestamp. */
  sampledAt: string;
  /** Request context (e.g. "rn" | "pn" | "np"). Optional. */
  tier?: string;
};

// ─── In-process sample store ──────────────────────────────────────────────────

const MAX_SAMPLES_PER_ACTIVITY = 20;
const sampleStore = new Map<ActivityKey, ActivityStartupRecord[]>();

function getOrCreateSamples(key: ActivityKey): ActivityStartupRecord[] {
  let arr = sampleStore.get(key);
  if (!arr) {
    arr = [];
    sampleStore.set(key, arr);
  }
  return arr;
}

// ─── Recording ────────────────────────────────────────────────────────────────

/**
 * Record an activity startup observation. Called server-side after page render completes.
 */
export function recordActivityStartup(record: ActivityStartupRecord): void {
  const def = getActivityDef(record.activity);
  const samples = getOrCreateSamples(record.activity);
  samples.push(record);
  if (samples.length > MAX_SAMPLES_PER_ACTIVITY) samples.shift();

  const isSlow = record.startupMs > (def?.startupBudgetMs ?? 2000);
  const hasManyQueries = def ? record.queryCount > def.maxQueryCount : false;

  if (isSlow || hasManyQueries) {
    safeServerLog("perf", "activity_startup_slow", {
      activity: record.activity,
      startupMs: record.startupMs,
      queryCount: record.queryCount,
      dbMs: record.dbMs,
      cacheHit: record.cacheHit,
      budgetMs: def?.startupBudgetMs,
      overageMs: def ? record.startupMs - def.startupBudgetMs : null,
      tier: record.tier,
    });
  }
}

// ─── Statistics ───────────────────────────────────────────────────────────────

export type ActivityStartupStat = {
  activity: ActivityKey;
  label: string;
  route: string;
  budgetMs: number;
  maxQueryCount: number;
  sampleCount: number;
  p50Ms: number | null;
  p95Ms: number | null;
  avgQueryCount: number | null;
  cacheHitRate: number | null;
  budgetExceededCount: number;
  status: "pass" | "warn" | "fail" | "no-data";
};

function percentile(sorted: number[], pct: number): number {
  if (sorted.length === 0) return 0;
  const idx = Math.ceil((pct / 100) * sorted.length) - 1;
  return sorted[Math.max(0, Math.min(idx, sorted.length - 1))];
}

/**
 * Returns aggregated startup statistics for all activities.
 */
export function getActivityStartupStats(): ActivityStartupStat[] {
  return ACTIVITY_DEFINITIONS.map((def) => {
    const samples = sampleStore.get(def.key) ?? [];

    if (samples.length === 0) {
      return {
        activity: def.key,
        label: def.label,
        route: def.route,
        budgetMs: def.startupBudgetMs,
        maxQueryCount: def.maxQueryCount,
        sampleCount: 0,
        p50Ms: null,
        p95Ms: null,
        avgQueryCount: null,
        cacheHitRate: null,
        budgetExceededCount: 0,
        status: "no-data" as const,
      };
    }

    const sortedMs = [...samples.map((s) => s.startupMs)].sort((a, b) => a - b);
    const p50 = percentile(sortedMs, 50);
    const p95 = percentile(sortedMs, 95);
    const avgQ = samples.reduce((s, r) => s + r.queryCount, 0) / samples.length;
    const cacheHits = samples.filter((s) => s.cacheHit).length;
    const budgetExceeded = samples.filter((s) => s.startupMs > def.startupBudgetMs).length;

    let status: ActivityStartupStat["status"] = "pass";
    if (p95 !== null && p95 > def.startupBudgetMs * 2) status = "fail";
    else if (p95 !== null && p95 > def.startupBudgetMs) status = "warn";

    return {
      activity: def.key,
      label: def.label,
      route: def.route,
      budgetMs: def.startupBudgetMs,
      maxQueryCount: def.maxQueryCount,
      sampleCount: samples.length,
      p50Ms: Math.round(p50),
      p95Ms: Math.round(p95),
      avgQueryCount: Math.round(avgQ * 10) / 10,
      cacheHitRate: samples.length > 0 ? cacheHits / samples.length : null,
      budgetExceededCount: budgetExceeded,
      status,
    };
  });
}

/**
 * Returns a formatted ASCII table of activity startup stats for logs/reports.
 */
export function formatActivityStartupReport(stats: ActivityStartupStat[]): string {
  const header = `${"Activity".padEnd(18)} ${"Budget".padEnd(8)} ${"p50".padEnd(8)} ${"p95".padEnd(8)} ${"Queries".padEnd(9)} ${"Cache%".padEnd(8)} Status`;
  const divider = "─".repeat(header.length);

  const rows = stats.map((s) => {
    const p50 = s.p50Ms !== null ? `${s.p50Ms}ms` : "—";
    const p95 = s.p95Ms !== null ? `${s.p95Ms}ms` : "—";
    const q = s.avgQueryCount !== null ? `~${s.avgQueryCount}` : "—";
    const cache = s.cacheHitRate !== null ? `${Math.round(s.cacheHitRate * 100)}%` : "—";
    const statusIcon = { pass: "✓", warn: "⚠", fail: "✗", "no-data": "·" }[s.status];

    return `${s.label.padEnd(18)} ${`${s.budgetMs}ms`.padEnd(8)} ${p50.padEnd(8)} ${p95.padEnd(8)} ${q.padEnd(9)} ${cache.padEnd(8)} ${statusIcon}`;
  });

  return [header, divider, ...rows].join("\n");
}
