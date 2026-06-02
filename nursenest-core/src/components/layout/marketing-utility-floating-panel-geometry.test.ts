import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  computeMarketingUtilityFloatingPanelRect,
  MARKETING_UTILITY_PANEL_GAP_PX,
  MARKETING_UTILITY_PANEL_VIEWPORT_MARGIN,
} from "@/components/layout/marketing-utility-floating-panel-geometry";

describe("computeMarketingUtilityFloatingPanelRect", () => {
  it("opens below the anchor with a gap", () => {
    const anchor = { top: 10, right: 200, bottom: 40, left: 120 };
    const r = computeMarketingUtilityFloatingPanelRect({
      anchor,
      panelWidthPx: 208,
      viewportWidthPx: 1200,
    });
    assert.equal(r.top, anchor.bottom + MARKETING_UTILITY_PANEL_GAP_PX);
    assert.equal(r.width, 208);
  });

  it("end-aligns to the anchor and does not extend past the right viewport margin when there is room", () => {
    const anchor = { top: 0, right: 400, bottom: 36, left: 300 };
    const w = 208;
    const vw = 1200;
    const r = computeMarketingUtilityFloatingPanelRect({ anchor, panelWidthPx: w, viewportWidthPx: vw });
    const expectedLeft = anchor.right - w;
    assert.ok(expectedLeft >= MARKETING_UTILITY_PANEL_VIEWPORT_MARGIN);
    assert.equal(r.left, expectedLeft);
    assert.ok(r.left + r.width <= vw - MARKETING_UTILITY_PANEL_VIEWPORT_MARGIN);
  });

  it("clamps left when end-aligned panel would overflow the left edge", () => {
    const anchor = { top: 0, right: 80, bottom: 30, left: 10 };
    const w = 288;
    const vw = 360;
    const r = computeMarketingUtilityFloatingPanelRect({ anchor, panelWidthPx: w, viewportWidthPx: vw });
    assert.equal(r.left, MARKETING_UTILITY_PANEL_VIEWPORT_MARGIN);
    assert.ok(r.left + w <= vw - MARKETING_UTILITY_PANEL_VIEWPORT_MARGIN);
  });
});
