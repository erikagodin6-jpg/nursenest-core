import "server-only";

/**
 * Dev-only timing for marketing pathway lesson detail — avoids production log noise.
 * Logs `[lesson-detail] phase=… ms=…` to stdout when `NODE_ENV === "development"`.
 */
export async function withLessonDetailTiming<T>(phase: string, fn: () => Promise<T>): Promise<T> {
  if (process.env.NODE_ENV !== "development") {
    return fn();
  }
  const t0 = performance.now();
  try {
    return await fn();
  } finally {
    const ms = Math.round((performance.now() - t0) * 10) / 10;
    // eslint-disable-next-line no-console -- intentional dev-only diagnostics
    console.info(`[lesson-detail] phase=${phase} ms=${ms}`);
  }
}

export function logLessonDetailSyncPhase(phase: string, startedAt: number): void {
  if (process.env.NODE_ENV !== "development") return;
  const ms = Math.round((performance.now() - startedAt) * 10) / 10;
  // eslint-disable-next-line no-console -- intentional dev-only diagnostics
  console.info(`[lesson-detail] phase=${phase} ms=${ms}`);
}
