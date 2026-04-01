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
      data = raw ? (JSON.parse(raw) as { events?: QuestionPerformanceEventV1[] }) : { events: [] };
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
    const raw = window.localStorage.getItem(storageKey(userId));
    if (!raw) return [];
    const data = JSON.parse(raw) as { events?: QuestionPerformanceEventV1[] };
    if (!Array.isArray(data.events)) return [];
    return data.events.slice(-max);
  } catch {
    return [];
  }
}
