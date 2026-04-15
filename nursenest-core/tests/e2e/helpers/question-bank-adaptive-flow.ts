import type { Page, Response } from "@playwright/test";

export type QuestionPreviewBatch = {
  ids: string[];
  difficulties: (number | null)[];
  studyModeNote: string | null;
};

/**
 * Records GET `/api/questions?...&mode=preview` JSON for adaptive-flow assertions.
 */
export function attachQuestionPreviewResponseCollector(page: Page) {
  const batches: QuestionPreviewBatch[] = [];

  const onResponse = async (resp: Response) => {
    if (resp.request().method() !== "GET") return;
    if (resp.status() !== 200) return;
    let pathname = "";
    try {
      pathname = new URL(resp.url()).pathname;
    } catch {
      return;
    }
    if (pathname !== "/api/questions") return;
    let mode: string | null = null;
    try {
      mode = new URL(resp.url()).searchParams.get("mode");
    } catch {
      return;
    }
    if (mode !== "preview") return;
    try {
      const data = (await resp.json()) as {
        questions?: Array<{ id?: string; difficulty?: number | null }>;
        studyModeNote?: string | null;
      };
      const qs = data.questions ?? [];
      batches.push({
        ids: qs.map((q) => String(q.id ?? "")).filter((id) => id.length > 4),
        difficulties: qs.map((q) => (typeof q.difficulty === "number" ? q.difficulty : null)),
        studyModeNote: data.studyModeNote ?? null,
      });
    } catch {
      /* ignore */
    }
  };

  page.on("response", onResponse);

  return {
    batches,
    dispose: () => {
      page.off("response", onResponse);
    },
  };
}

/** Sliding window: true if any id repeats within the last `windowSize` steps. */
export function hasRepeatInWindow(ids: string[], windowSize: number): boolean {
  if (ids.length <= 1) return false;
  for (let i = 0; i < ids.length; i++) {
    const start = Math.max(0, i - windowSize + 1);
    const window = ids.slice(start, i + 1);
    if (new Set(window).size !== window.length) return true;
  }
  return false;
}

/** Ensures preview payloads carry sane difficulty metadata (1–5) when present. */
export function assertDifficultiesInValidRange(difficulties: (number | null)[]): void {
  for (const d of difficulties) {
    if (d == null) continue;
    if (!Number.isFinite(d) || d < 1 || d > 5) {
      throw new Error(`Unexpected difficulty (expected 1–5 or null): ${String(d)}`);
    }
  }
}
