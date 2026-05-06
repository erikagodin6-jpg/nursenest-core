/**
 * Maps **existing** learner aggregates (no invented metrics) into {@link TopicWeaknessSignalInput}
 * for the adaptive recommendation engine. Missing slices → omitted keys; callers always get a plain array.
 */
import type { TopicWeaknessSignalInput } from "@/lib/adaptive-learning/adaptive-learning-types";
import type { PerformanceProfile } from "@/lib/cat/types";
import { normalizeTopicKey } from "@/lib/learner/topic-normalize";
import type { TopicPerformanceSnapshot } from "@/lib/learner/topic-performance";
import type { WeakTopicRow } from "@/lib/learner/weak-topics-from-sessions";

function clamp01(n: number): number {
  if (!Number.isFinite(n)) return 0;
  return Math.min(1, Math.max(0, n));
}

function mergeSignals(into: Map<string, TopicWeaknessSignalInput>, s: TopicWeaknessSignalInput): void {
  const k = normalizeTopicKey(s.topicKey);
  if (!k) return;
  const prev = into.get(k);
  if (!prev) {
    into.set(k, { ...s, topicKey: k });
    return;
  }
  into.set(k, {
    topicKey: k,
    missCount: Math.max(0, prev.missCount) + Math.max(0, s.missCount),
    lastAttemptMs:
      prev.lastAttemptMs == null
        ? s.lastAttemptMs
        : s.lastAttemptMs == null
          ? prev.lastAttemptMs
          : Math.max(prev.lastAttemptMs, s.lastAttemptMs),
    masteryEstimate:
      prev.masteryEstimate == null
        ? s.masteryEstimate
        : s.masteryEstimate == null
          ? prev.masteryEstimate
          : Math.min(prev.masteryEstimate, s.masteryEstimate),
  });
}

/**
 * Weak-topic rows from {@link loadUnifiedTopicPerformance} / dashboard (already bounded upstream).
 */
export function topicWeaknessSignalsFromWeakTopicRows(rows: WeakTopicRow[] | null | undefined): TopicWeaknessSignalInput[] {
  if (!rows?.length) return [];
  const m = new Map<string, TopicWeaknessSignalInput>();
  for (const r of rows) {
    const topicKey = normalizeTopicKey(r.normalizedTopic ?? r.topic);
    if (!topicKey) continue;
    const attempted = Math.max(0, r.attempted);
    const missed = Math.max(0, r.missed);
    let lastMs: number | undefined;
    if (r.lastWrongAt) {
      const t = Date.parse(r.lastWrongAt);
      if (Number.isFinite(t)) lastMs = t;
    }
    mergeSignals(m, {
      topicKey,
      missCount: missed,
      lastAttemptMs: lastMs,
      masteryEstimate: attempted > 0 ? clamp01((attempted - missed) / attempted) : undefined,
    });
  }
  return [...m.values()];
}

/**
 * Topic performance snapshot weak list (same ledger/session semantics as dashboard).
 */
export function topicWeaknessSignalsFromTopicPerformanceSnapshot(
  snap: TopicPerformanceSnapshot | null | undefined,
): TopicWeaknessSignalInput[] {
  if (!snap?.weakTopics?.length) return [];
  return topicWeaknessSignalsFromWeakTopicRows(snap.weakTopics);
}

/**
 * CAT / practice aggregate profile keyed by topic slug (when callers already materialized a profile).
 */
export function topicWeaknessSignalsFromPerformanceProfile(
  profile: PerformanceProfile | null | undefined,
): TopicWeaknessSignalInput[] {
  if (!profile?.byTopic) return [];
  const m = new Map<string, TopicWeaknessSignalInput>();
  for (const [slug, dim] of Object.entries(profile.byTopic)) {
    const topicKey = normalizeTopicKey(slug);
    if (!topicKey) continue;
    const attempted = Math.max(0, dim.attempted);
    if (attempted <= 0) continue;
    const missed = Math.max(0, attempted - Math.max(0, dim.correct));
    mergeSignals(m, {
      topicKey,
      missCount: missed,
      masteryEstimate: clamp01(dim.recentAccuracy),
    });
  }
  return [...m.values()];
}

export type LearnerPerformanceWeaknessAdapterInput = {
  topicPerformance?: TopicPerformanceSnapshot | null;
  /** Extra weak rows (e.g. study snapshot) — merged with snapshot weak topics without double-counting keys. */
  supplementalWeakTopicRows?: WeakTopicRow[] | null;
  catOrPracticeProfile?: PerformanceProfile | null;
};

/**
 * Merges every provided non-empty aggregate; identical topic keys combine miss counts and conservative mastery.
 */
export function buildTopicWeaknessSignalsFromLearnerPerformance(
  input: LearnerPerformanceWeaknessAdapterInput | null | undefined,
): TopicWeaknessSignalInput[] {
  if (!input) return [];
  const merged = new Map<string, TopicWeaknessSignalInput>();
  const parts: TopicWeaknessSignalInput[][] = [
    topicWeaknessSignalsFromTopicPerformanceSnapshot(input.topicPerformance ?? null),
    topicWeaknessSignalsFromWeakTopicRows(input.supplementalWeakTopicRows ?? null),
    topicWeaknessSignalsFromPerformanceProfile(input.catOrPracticeProfile ?? null),
  ];
  for (const group of parts) {
    for (const s of group) {
      mergeSignals(merged, s);
    }
  }
  return [...merged.values()];
}

/** Deterministic +1 miss for the active item (canonical topic key). */
export function bumpTopicWeaknessSignal(
  signals: TopicWeaknessSignalInput[],
  topicKeyRaw: string | null | undefined,
  nowMs: number,
): TopicWeaknessSignalInput[] {
  const bumpKey = normalizeTopicKey(topicKeyRaw ?? "");
  if (!bumpKey) return signals;
  const m = new Map<string, TopicWeaknessSignalInput>();
  for (const s of signals) {
    mergeSignals(m, s);
  }
  const prev = m.get(bumpKey);
  m.set(bumpKey, {
    topicKey: bumpKey,
    missCount: (prev?.missCount ?? 0) + 1,
    lastAttemptMs: nowMs,
    masteryEstimate: prev?.masteryEstimate,
  });
  return [...m.values()];
}
