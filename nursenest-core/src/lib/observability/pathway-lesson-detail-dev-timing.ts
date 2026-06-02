/**
 * Development-only timing marks for marketing pathway lesson detail.
 * Enable with `NODE_ENV=development` (no extra env flag).
 */
export function createPathwayLessonDetailTiming(pathname: string): {
  mark: (phase: string) => void;
} {
  if (process.env.NODE_ENV !== "development") {
    return { mark: () => {} };
  }
  let last = performance.now();
  const pathHint = pathname.length > 96 ? `${pathname.slice(0, 96)}…` : pathname;
  return {
    mark(phase: string) {
      const now = performance.now();
      const deltaMs = Math.round(now - last);
      last = now;
      if (typeof globalThis.console !== "undefined" && "info" in globalThis.console) {
        globalThis.console.info(`[nn:lesson-detail] ${phase} +${deltaMs}ms path=${pathHint}`);
      }
    },
  };
}
