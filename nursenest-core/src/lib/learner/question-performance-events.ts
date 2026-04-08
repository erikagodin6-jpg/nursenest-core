/**
 * Lightweight client-side question performance rollups (forward-compatible with server analytics).
 * Keys are isolated per user; failures never throw.
 */

export type QuestionPerformanceEventV1 = {
  v: 1;
  questionId: string;
  topic: string | null;
  subtopic: string | null;
  pathwayId: string | null;
  exam: string | null;
  correct: boolean;
  /** Wall-clock time on item when available (ms). */
  timeSpentMs?: number;
  at: string;
};

export type WeakPerformanceArea = {
  topic: string | null;
  subtopic: string | null;
  attempts: number;
  wrong: number;
  accuracyPct: number;
  weightedWrong: number;
};

function storageKey(userId: string) {
  return `nn_question_perf_v1_${userId}`;
}

/** Parse localStorage JSON into a guaranteed array (strict-null-safe before any `.slice()`). */
function parseStoredQuestionPerformanceEvents(raw: string): QuestionPerformanceEventV1[] {
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw) as unknown;
  } catch {
    return [];
  }
  if (parsed == null || typeof parsed !== "object") return [];
  const events = (parsed as { events?: unknown }).events;
  return Array.isArray(events) ? (events as QuestionPerformanceEventV1[]) : [];
}

export function recordQuestionPerformanceEvent(
  userId: string,
  partial: Omit<QuestionPerformanceEventV1, "v" | "at"> & { at?: string },
): void {
  try {
    if (typeof window === "undefined" || !window.localStorage) return;
    const k = storageKey(userId);
    let raw: string | null;
    try {
      raw = window.localStorage.getItem(k);
    } catch {
      return;
    }
    let data: { events: QuestionPerformanceEventV1[] };
    try {
      const events: QuestionPerformanceEventV1[] = raw ? parseStoredQuestionPerformanceEvents(raw) : [];
      data = { events };
    } catch {
      data = { events: [] };
    }
    if (!Array.isArray(data.events)) data.events = [];
    const ev: QuestionPerformanceEventV1 = {
      v: 1,
      ...partial,
      at: partial.at ?? new Date().toISOString(),
    };
    data.events.push(ev);
    data.events = data.events.slice(-220);
    window.localStorage.setItem(k, JSON.stringify(data));
  } catch {
    /* quota / private mode */
  }
}

export function readQuestionPerformanceSample(userId: string, max = 50): QuestionPerformanceEventV1[] {
  try {
    if (typeof window === "undefined" || !window.localStorage) return [];
    let raw: string | null;
    try {
      raw = window.localStorage.getItem(storageKey(userId));
    } catch {
      return [];
    }
    if (!raw) return [];
    let events: QuestionPerformanceEventV1[];
    try {
      events = parseStoredQuestionPerformanceEvents(raw);
    } catch {
      return [];
    }
    return events.slice(-max);
  } catch {
    return [];
  }
}

/** Newest-first window of stored performance events (cap avoids huge parses). */
export function readQuestionPerformanceEvents(userId: string, max = 220): QuestionPerformanceEventV1[] {
  return readQuestionPerformanceSample(userId, max);
}

/**
 * Question IDs the learner has answered incorrectly at least once (from local history).
 * Used to scope “mistakes only” practice; server still enforces entitlements.
 */
export function questionIdsWithIncorrectAttempts(
  events: QuestionPerformanceEventV1[],
  maxIds = 200,
): string[] {
  const wrong = new Set<string>();
  for (const ev of events) {
    if (ev.correct) continue;
    const id = ev.questionId?.trim();
    if (id && id.length >= 8 && id.length <= 64) wrong.add(id);
  }
  return [...wrong].slice(0, maxIds);
}

/**
 * Build weak-area ranking from local performance events (newest-biased).
 * Pure function so both client and server pathways can reuse it safely.
 */
export function deriveWeakAreasFromPerformanceEvents(
  events: QuestionPerformanceEventV1[],
  max = 5,
): WeakPerformanceArea[] {
  const now = Date.now();
  const byKey = new Map<
    string,
    {
      topic: string | null;
      subtopic: string | null;
      attempts: number;
      wrong: number;
      weightedWrong: number;
    }
  >();

  for (const ev of events) {
    const topic = ev.topic?.trim() || null;
    const subtopic = ev.subtopic?.trim() || null;
    if (!topic && !subtopic) continue;
    const key = `${topic ?? "∅"}::${subtopic ?? "∅"}`;
    const row = byKey.get(key) ?? { topic, subtopic, attempts: 0, wrong: 0, weightedWrong: 0 };
    row.attempts += 1;
    if (!ev.correct) {
      row.wrong += 1;
      const ageDays = Math.max(0, (now - new Date(ev.at).getTime()) / 86400000);
      const recencyWeight = 1 / (1 + ageDays / 7);
      row.weightedWrong += recencyWeight;
    }
    byKey.set(key, row);
  }

  return [...byKey.values()]
    .map((r) => {
      // Damp one-off misses so tiny samples do not whipsaw priority.
      const sampleStability = Math.min(1, r.attempts / 3);
      // Light Bayesian-style smoothing for ranking stability only.
      const smoothedWrongRate = (r.wrong + 1) / (r.attempts + 2);
      const priorityScore = r.weightedWrong * sampleStability * smoothedWrongRate;
      return {
      topic: r.topic,
      subtopic: r.subtopic,
      attempts: r.attempts,
      wrong: r.wrong,
      accuracyPct: r.attempts > 0 ? Math.round(((r.attempts - r.wrong) / r.attempts) * 100) : 0,
      weightedWrong: Math.round(r.weightedWrong * 100) / 100,
      priorityScore,
      };
    })
    .filter((r) => r.wrong > 0)
    .sort((a, b) => b.priorityScore - a.priorityScore || a.accuracyPct - b.accuracyPct || b.attempts - a.attempts)
    .slice(0, max);
}
