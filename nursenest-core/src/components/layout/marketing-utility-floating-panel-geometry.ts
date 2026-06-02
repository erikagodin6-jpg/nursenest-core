/** Viewport edge padding when clamping fixed utility dropdown panels. */
export const MARKETING_UTILITY_PANEL_VIEWPORT_MARGIN = 8;
/** Gap between trigger bottom and panel top (px). */
export const MARKETING_UTILITY_PANEL_GAP_PX = 6;

export type AnchorBox = { top: number; right: number; bottom: number; left: number };

/**
 * Fixed-position rect for a width-constrained panel: opens **below** the anchor with a small gap,
 * **end-aligned** to the anchor’s right edge, clamped so the panel stays inside the viewport.
 */
export function computeMarketingUtilityFloatingPanelRect(input: {
  anchor: AnchorBox;
  panelWidthPx: number;
  viewportWidthPx: number;
  gapPx?: number;
  viewportMargin?: number;
}): { top: number; left: number; width: number } {
  const gap = input.gapPx ?? MARKETING_UTILITY_PANEL_GAP_PX;
  const margin = input.viewportMargin ?? MARKETING_UTILITY_PANEL_VIEWPORT_MARGIN;
  const w = input.panelWidthPx;
  let left = input.anchor.right - w;
  left = Math.min(Math.max(margin, left), Math.max(margin, input.viewportWidthPx - w - margin));
  const top = input.anchor.bottom + gap;
  return { top, left, width: w };
}
