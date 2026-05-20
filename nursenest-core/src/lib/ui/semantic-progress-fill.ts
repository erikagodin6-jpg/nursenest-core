/**
 * Maps an accuracy-style percentage (0–100) to semantic progress bar fill classes.
 * Uses success / info / warning / danger — not brand-only — so charts stay multi-hue and motivating.
 */
export function semanticFillClassForAccuracyPct(pct: number | null | undefined): string {
  if (pct == null || Number.isNaN(pct)) return "nn-progress-fill-semantic-muted";
  const p = Math.min(100, Math.max(0, pct));
  if (p >= 80) return "nn-progress-fill-semantic-success";
  if (p >= 65) return "nn-progress-fill-semantic-info";
  if (p >= 50) return "nn-progress-fill-semantic-warning";
  return "nn-progress-fill-semantic-danger";
}
