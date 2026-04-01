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
      const parsed = raw ? (JSON.parse(raw) as { events?: QuestionPerformanceEventV1[] }) : { events: [] };
      data = { events: Array.isArray(parsed.events) ? parsed.events : [] };
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
      const parsed = JSON.parse(raw) as { events?: QuestionPerformanceEventV1[] };
      events = Array.isArray(parsed.events) ? parsed.events : [];
    } catch {
      return [];
    }
    return events.slice(-max);
  } catch {
    return [];
  }
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
    .map((r) => ({
      topic: r.topic,
      subtopic: r.subtopic,
      attempts: r.attempts,
      wrong: r.wrong,
      accuracyPct: r.attempts > 0 ? Math.round(((r.attempts - r.wrong) / r.attempts) * 100) : 0,
      weightedWrong: Math.round(r.weightedWrong * 100) / 100,
    }))
    .filter((r) => r.wrong > 0)
    .sort((a, b) => b.weightedWrong - a.weightedWrong || a.accuracyPct - b.accuracyPct || b.attempts - a.attempts)
    .slice(0, max);
}
