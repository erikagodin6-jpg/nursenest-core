/**
 * Aggregation-ready analytics structures for clinical flashcard telemetry.
 *
 * All functions are pure (no I/O, no PostHog calls).
 * They consume arrays of FlashcardTelemetryEventRecord — the same shape
 * that PostHog event properties carry — and return dashboard-ready rows.
 *
 * Usage: feed these functions event logs exported from PostHog (HogQL or
 * REST export), or from a local buffer in testing/admin contexts.
 */

// ── Event record shape ────────────────────────────────────────────────────────

export type FlashcardTelemetryEventRecord = {
  event: string;
  card_id?: string;
  topic?: string;
  domain?: string;
  question_type?: string;
  item_kind?: string;
  pathway_id?: string;
  /** flashcard_rated confidence value: "again" | "hard" | "good" | "easy" */
  confidence_level?: string;
  /** answer_submitted: true when the selected answer was correct */
  is_correct?: boolean;
  /** MCQ distractor letter selected when wrong */
  distractor_selected?: string;
  /** SATA: fraction of correct options selected (0–1) */
  sata_partial_accuracy?: number;
  /** ms on card front before reveal */
  reveal_dwell_ms?: number;
  /** ms from reveal/rationale open to recall rating */
  dwell_reveal_ms?: number;
  /** ms from card display to answer submission when available */
  time_to_answer_ms?: number;
  /** ms spent in rationale/teaching sections when available */
  rationale_dwell_ms?: number;
  /** SRS segment: "new" | "due" | "overdue" | "lapsing" */
  segment?: string;
  remediation_boosted?: boolean;
  ecg_flag?: boolean;
  bowtie_flag?: boolean;
  lab_flag?: boolean;
  /** Unix ms — used for longitudinal trend bucketing */
  timestamp?: number;
};

// ── Return types ──────────────────────────────────────────────────────────────

export type MisconceptionHeatmapRow = {
  topic: string;
  distractor: string;
  count: number;
};

export type WeakTopicCluster = {
  topic: string;
  againCount: number;
  hardCount: number;
  totalRated: number;
  weakRatio: number;
};

export type PrescribingSafetyMiss = {
  topic: string;
  missCount: number;
  totalAttempts: number;
  missRate: number;
};

export type LongitudinalTrendBucket = {
  weekStart: string; // ISO date "YYYY-MM-DD"
  topic: string;
  againCount: number;
  totalRated: number;
  weakRatio: number;
};

export type ConfidenceAccuracyRow = {
  cardId: string;
  /** 0 = easy, 1 = good, 2 = hard, 3 = again (inverted confidence score) */
  confidenceScore: number;
  /** 1 = correct, 0 = wrong */
  accuracyScore: number;
  /** Positive = overconfident (easy but wrong), negative = underconfident */
  gap: number;
};

// ── Helpers ───────────────────────────────────────────────────────────────────

function normalizeTopic(t: string | undefined): string {
  return (t ?? "Unknown").trim().toLowerCase();
}

function ratingToConfidenceScore(rating: string | undefined): number {
  switch (rating) {
    case "easy":  return 0;
    case "good":  return 1;
    case "hard":  return 2;
    case "again": return 3;
    default:      return -1;
  }
}

function isoWeekStart(ts: number): string {
  const d = new Date(ts);
  const day = d.getUTCDay(); // 0 = Sunday
  const diff = day === 0 ? -6 : 1 - day; // shift to Monday
  d.setUTCDate(d.getUTCDate() + diff);
  return d.toISOString().slice(0, 10);
}

// ── Aggregators ───────────────────────────────────────────────────────────────

/**
 * Misconception heatmap: for each (topic, distractor_selected) pair, count
 * how many times learners picked that wrong distractor in answer_submitted events.
 *
 * Sorted descending by count.
 */
export function buildMisconceptionHeatmap(
  events: FlashcardTelemetryEventRecord[],
): MisconceptionHeatmapRow[] {
  const key = (topic: string, distractor: string) => `${topic}||${distractor}`;
  const counts = new Map<string, { topic: string; distractor: string; count: number }>();

  for (const ev of events) {
    if (ev.event !== "answer_submitted") continue;
    if (!ev.distractor_selected || ev.is_correct) continue;
    const topic = normalizeTopic(ev.topic);
    const distractor = ev.distractor_selected.toUpperCase();
    const k = key(topic, distractor);
    const existing = counts.get(k);
    if (existing) {
      existing.count++;
    } else {
      counts.set(k, { topic, distractor, count: 1 });
    }
  }

  return [...counts.values()].sort((a, b) => b.count - a.count);
}

/**
 * Weak-topic clusters: groups flashcard_rated events by topic,
 * summing "again" + "hard" counts and total rated to produce a weakRatio.
 *
 * Sorted descending by weakRatio, then by total volume.
 */
export function buildWeakTopicClusters(
  events: FlashcardTelemetryEventRecord[],
): WeakTopicCluster[] {
  const map = new Map<string, WeakTopicCluster>();

  for (const ev of events) {
    if (ev.event !== "flashcard_rated") continue;
    const topic = normalizeTopic(ev.topic);
    let row = map.get(topic);
    if (!row) {
      row = { topic, againCount: 0, hardCount: 0, totalRated: 0, weakRatio: 0 };
      map.set(topic, row);
    }
    row.totalRated++;
    if (ev.confidence_level === "again") row.againCount++;
    if (ev.confidence_level === "hard") row.hardCount++;
  }

  for (const row of map.values()) {
    row.weakRatio =
      row.totalRated > 0
        ? Math.round(((row.againCount + row.hardCount) / row.totalRated) * 1000) / 1000
        : 0;
  }

  return [...map.values()].sort(
    (a, b) => b.weakRatio - a.weakRatio || b.totalRated - a.totalRated,
  );
}

/**
 * Prescribing safety misses: filters answer_submitted events where
 * the topic contains "pharmacology", "medication", "drug", or "prescrib"
 * (case-insensitive), then tallies miss rate per topic.
 *
 * Sorted descending by missRate.
 */
export function buildPrescribingSafetyMisses(
  events: FlashcardTelemetryEventRecord[],
): PrescribingSafetyMiss[] {
  const PRESCRIBING_RE = /pharmacolog|medication|drug|prescrib|dosage|dose/i;
  const map = new Map<string, { missCount: number; totalAttempts: number }>();

  for (const ev of events) {
    if (ev.event !== "answer_submitted") continue;
    const raw = ev.topic ?? "";
    if (!PRESCRIBING_RE.test(raw)) continue;
    const topic = normalizeTopic(ev.topic);
    let row = map.get(topic);
    if (!row) {
      row = { missCount: 0, totalAttempts: 0 };
      map.set(topic, row);
    }
    row.totalAttempts++;
    if (!ev.is_correct) row.missCount++;
  }

  return [...map.entries()]
    .map(([topic, { missCount, totalAttempts }]) => ({
      topic,
      missCount,
      totalAttempts,
      missRate:
        totalAttempts > 0
          ? Math.round((missCount / totalAttempts) * 1000) / 1000
          : 0,
    }))
    .sort((a, b) => b.missRate - a.missRate || b.totalAttempts - a.totalAttempts);
}

/**
 * Longitudinal weakness trend: buckets flashcard_rated events into ISO weeks,
 * per topic, computing againCount / totalRated per bucket.
 *
 * Events without timestamps are skipped.
 * Sorted by weekStart asc, then topic asc.
 */
export function buildLongitudinalWeaknessTrend(
  events: FlashcardTelemetryEventRecord[],
): LongitudinalTrendBucket[] {
  const key = (week: string, topic: string) => `${week}||${topic}`;
  const map = new Map<string, LongitudinalTrendBucket>();

  for (const ev of events) {
    if (ev.event !== "flashcard_rated" || !ev.timestamp) continue;
    const week = isoWeekStart(ev.timestamp);
    const topic = normalizeTopic(ev.topic);
    const k = key(week, topic);
    let row = map.get(k);
    if (!row) {
      row = { weekStart: week, topic, againCount: 0, totalRated: 0, weakRatio: 0 };
      map.set(k, row);
    }
    row.totalRated++;
    if (ev.confidence_level === "again") row.againCount++;
  }

  for (const row of map.values()) {
    row.weakRatio =
      row.totalRated > 0
        ? Math.round((row.againCount / row.totalRated) * 1000) / 1000
        : 0;
  }

  return [...map.values()].sort(
    (a, b) => a.weekStart.localeCompare(b.weekStart) || a.topic.localeCompare(b.topic),
  );
}

/**
 * Confidence vs accuracy mismatch: joins answer_submitted (accuracy) with
 * flashcard_rated (confidence) on card_id.
 *
 * gap > 0  → overconfident (rated easy/good but answered wrong)
 * gap < 0  → underconfident (rated again/hard but answered correctly)
 *
 * Only cards that appear in both event types are included.
 * Sorted descending by |gap|.
 */
export function buildConfidenceAccuracyMismatch(
  events: FlashcardTelemetryEventRecord[],
): ConfidenceAccuracyRow[] {
  const accuracyMap = new Map<string, number>(); // card_id → 1|0
  const confidenceMap = new Map<string, number>(); // card_id → 0–3

  for (const ev of events) {
    if (!ev.card_id) continue;
    if (ev.event === "answer_submitted" && ev.is_correct !== undefined) {
      accuracyMap.set(ev.card_id, ev.is_correct ? 1 : 0);
    }
    if (ev.event === "flashcard_rated" && ev.confidence_level) {
      const score = ratingToConfidenceScore(ev.confidence_level);
      if (score >= 0) confidenceMap.set(ev.card_id, score);
    }
  }

  const rows: ConfidenceAccuracyRow[] = [];
  for (const [cardId, accuracyScore] of accuracyMap) {
    const confidenceScore = confidenceMap.get(cardId);
    if (confidenceScore === undefined) continue;
    // gap: high confidence + wrong = large positive mismatch
    const gap = confidenceScore - (1 - accuracyScore) * 3;
    rows.push({ cardId, confidenceScore, accuracyScore, gap });
  }

  return rows.sort((a, b) => Math.abs(b.gap) - Math.abs(a.gap));
}
