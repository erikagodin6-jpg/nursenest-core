import { expect, type Page } from "@playwright/test";
import { measureHorizontalOverflow } from "./mobile-usability-audit";

export type MobileLayoutHealthOptions = {
  /** Allow small subpixel / scrollbar differences on `documentElement` (default 2). */
  documentSlopPx?: number;
  /** When `<main>` exists, allow this much horizontal excess (default 4). */
  mainSlopPx?: number;
};

/**
 * Guards against horizontal scroll and clipped full-width layouts on narrow viewports.
 * Prefer this over raw `overflow-x: hidden` in components — catches wide children.
 */
export async function assertMobileHorizontalLayoutHealth(
  page: Page,
  context: string,
  opts: MobileLayoutHealthOptions = {},
): Promise<void> {
  const docSlop = opts.documentSlopPx ?? 2;
  const mainSlop = opts.mainSlopPx ?? 4;
  const o = await measureHorizontalOverflow(page);
  expect(o.document.excess, `[${context}] document overflow ${o.document.scrollWidth}px vs ${o.document.clientWidth}px`).toBeLessThanOrEqual(
    docSlop,
  );
  if (o.main && o.main.excess > mainSlop) {
    expect(o.main.excess, `[${context}] <main> overflow excess ${o.main.excess}px`).toBeLessThanOrEqual(mainSlop);
  }
}

/** Primary touch targets should meet ~44px minimum where roles are used (WCAG 2.5.5 / iOS HIG). */
export async function assertOpenMenuButtonMinSize(page: Page, minPx = 44): Promise<void> {
  const btn = page.getByRole("button", { name: /Open menu/i }).first();
  if (!(await btn.isVisible().catch(() => false))) return;
  const box = await btn.boundingBox();
  if (!box) return;
  const side = Math.min(box.width, box.height);
  expect(side, "Open menu min touch side").toBeGreaterThanOrEqual(minPx);
}
