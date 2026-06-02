/**
 * Mistake Notebook — pattern analysis.
 * Computes recurring error patterns, top mistakes, and actionable insights.
 */

import type {
  MistakeEntry,
  MistakeNotebookData,
  MistakePattern,
  MistakeReason,
  MistakeTopicSummary,
} from "./mistake-types";
import {
  MISTAKE_REASONS,
  MISTAKE_REASON_LABELS,
  MISTAKE_REASON_STUDY_TIPS,
} from "./mistake-types";

/** Derive full MistakeNotebookData from a flat list of entries. */
export function analyzeMistakePatterns(entries: MistakeEntry[]): MistakeNotebookData {
  const totalMisses = entries.length;
  const taggedCount = entries.filter((e) => e.tagged).length;
  const hasHistoricalData = totalMisses > 0;

  // ── Topic aggregation ────────────────────────────────────────────────────
  const topicMap = new Map<string, { count: number; bodySystem: string | null }>();
  for (const e of entries) {
    if (!e.topic) continue;
    const existing = topicMap.get(e.topic);
    if (existing) {
      existing.count += e.missCount;
    } else {
      topicMap.set(e.topic, { count: e.missCount, bodySystem: e.bodySystem });
    }
  }
  const topTopics: MistakeTopicSummary[] = [...topicMap.entries()]
    .map(([topic, v]) => ({ topic, missCount: v.count, bodySystem: v.bodySystem }))
    .sort((a, b) => b.missCount - a.missCount)
    .slice(0, 10);

  // ── Body system aggregation ──────────────────────────────────────────────
  const bsMap = new Map<string, number>();
  for (const e of entries) {
    if (!e.bodySystem) continue;
    bsMap.set(e.bodySystem, (bsMap.get(e.bodySystem) ?? 0) + e.missCount);
  }
  const topBodySystems = [...bsMap.entries()]
    .map(([bodySystem, count]) => ({ bodySystem, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 8);

  // ── Reason counts ────────────────────────────────────────────────────────
  const reasonCounts: Partial<Record<MistakeReason, number>> = {};
  for (const e of entries) {
    if (!e.reason) continue;
    reasonCounts[e.reason] = (reasonCounts[e.reason] ?? 0) + 1;
  }
  const mostCommonErrorType = Object.entries(reasonCounts)
    .map(([reason, count]) => ({ reason: reason as MistakeReason, count: count ?? 0 }))
    .sort((a, b) => b.count - a.count)[0] ?? null;

  const weekBuckets = new Map<string, { misses: number; tagged: number }>();
  for (const e of entries) {
    const parsed = new Date(e.lastMissedAt);
    const safeDate = Number.isNaN(parsed.getTime()) ? new Date() : parsed;
    const weekStart = new Date(safeDate);
    weekStart.setUTCHours(0, 0, 0, 0);
    weekStart.setUTCDate(weekStart.getUTCDate() - weekStart.getUTCDay());
    const label = weekStart.toISOString().slice(0, 10);
    const bucket = weekBuckets.get(label) ?? { misses: 0, tagged: 0 };
    bucket.misses += e.missCount;
    if (e.tagged) bucket.tagged += 1;
    weekBuckets.set(label, bucket);
  }
  const improvementOverTime = [...weekBuckets.entries()]
    .sort((a, b) => a[0].localeCompare(b[0]))
    .slice(-8)
    .map(([label, bucket]) => ({ label, ...bucket }));

  // ── Patterns (only for reasons with at least 1 instance) ────────────────
  const taggedEntries = entries.filter((e) => e.tagged && e.reason);
  const taggedTotal = taggedEntries.length;

  const patterns: MistakePattern[] = MISTAKE_REASONS.flatMap((reason) => {
    const count = reasonCounts[reason] ?? 0;
    if (count === 0) return [];

    // Find top topics for this reason
    const topicsForReason = new Map<string, number>();
    for (const e of taggedEntries) {
      if (e.reason !== reason || !e.topic) continue;
      topicsForReason.set(e.topic, (topicsForReason.get(e.topic) ?? 0) + 1);
    }
    const topTopicsForReason = [...topicsForReason.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([t]) => t);

    return [
      {
        reason,
        count,
        pct: taggedTotal > 0 ? Math.round((count / taggedTotal) * 100) : 0,
        topTopics: topTopicsForReason,
        studyTip: MISTAKE_REASON_STUDY_TIPS[reason],
      },
    ];
  }).sort((a, b) => b.count - a.count);

  return {
    entries,
    totalMisses,
    taggedCount,
    mostCommonErrorType,
    topTopics,
    topBodySystems,
    patterns,
    reasonCounts,
    improvementOverTime,
    hasHistoricalData,
  };
}

/**
 * Returns the top 3 patterns that are most impactful for the learner.
 * "Top mistakes holding you back" — highest count, with at least 1 tagged.
 */
export function getTopHoldingPatterns(data: MistakeNotebookData): MistakePattern[] {
  return data.patterns.slice(0, 3);
}

/**
 * Insight headline for a pattern — conversational and motivating.
 */
export function patternHeadline(reason: MistakeReason, count: number): string {
  const label = MISTAKE_REASON_LABELS[reason];
  if (count === 1) return `1 miss tagged as ${label}`;
  if (count <= 3) return `${count} misses from ${label}`;
  if (count <= 7) return `${count} ${label} mistakes — a clear pattern`;
  return `${count} ${label} misses — this is your biggest gap`;
}

/**
 * Actionable insight message for a given reason + count.
 */
export function patternInsight(reason: MistakeReason, count: number, pct: number): string {
  if (pct >= 40) {
    return `${pct}% of your tagged mistakes are ${MISTAKE_REASON_LABELS[reason]} — this is your #1 pattern to address.`;
  }
  if (pct >= 20) {
    return `About 1 in 5 of your tagged mistakes come from ${MISTAKE_REASON_LABELS[reason]}.`;
  }
  return `${count} miss${count !== 1 ? "es" : ""} from ${MISTAKE_REASON_LABELS[reason]}.`;
}
