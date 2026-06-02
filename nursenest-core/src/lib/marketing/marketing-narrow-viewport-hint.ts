/**
 * Marketing-only narrow-viewport hint for SSR + first client paint.
 *
 * Set on every request in `src/proxy.ts` (`withPathnameHeader`) as `x-nn-marketing-narrow-viewport-hint`.
 * Marketing layouts read it and pass into {@link MarketingMobileMotionShell}; learner `/app` and
 * `/admin` never consume this for layout (header may still be present but unused).
 *
 * Heuristic: `Sec-CH-Viewport-Width` ≤768 when present, else common mobile User-Agent substrings.
 * Imprecise (desktop UA on narrow window is "false" until client `matchMedia` sync) — acceptable;
 * client effect in the shell corrects after hydration.
 */
export const MARKETING_NARROW_VIEWPORT_HINT_HEADER = "x-nn-marketing-narrow-viewport-hint" as const;

export function computeMarketingNarrowViewportHintFromRequestHeaders(headers: Headers): boolean {
  const vw = headers.get("sec-ch-viewport-width");
  if (vw) {
    const n = Number.parseInt(vw, 10);
    if (Number.isFinite(n) && n > 0 && n <= 768) return true;
  }
  const ua = headers.get("user-agent") ?? "";
  return /Mobi|Android.*Mobile|iPhone|iPod|webOS|BlackBerry|IEMobile|Opera Mini/i.test(ua);
}

export function parseMarketingNarrowViewportHintHeader(value: string | null | undefined): boolean {
  return String(value ?? "").trim() === "1";
}
