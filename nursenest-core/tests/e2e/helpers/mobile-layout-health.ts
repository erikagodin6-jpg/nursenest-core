import { expect, type Page } from "@playwright/test";
import { logDedupedClientDiagnostic } from "@/lib/runtime/client-diagnostic-log";
import { measureHorizontalOverflow } from "./mobile-usability-audit";

/** @see {@link MOBILE_OVERFLOW_GATE_REPORT} — canonical list for Phase 1B overflow gates. */
export { MOBILE_OVERFLOW_GATE_REPORT } from "./mobile-layout-overflow-gate-routes";

export type MobileLayoutHealthOptions = {
  /** Allow small subpixel / scrollbar differences on `documentElement` (default 2). */
  documentSlopPx?: number;
  /** When `<main>` exists, allow this much horizontal excess (default 4). */
  mainSlopPx?: number;
};

/**
 * Guards against **document-level** horizontal bleed using measured `scrollWidth` vs `viewport`
 * (not `overflow-x: hidden` on `body`, which can clip without fixing root cause). Prefer inner
 * `overflow-x-auto` for tables/code. Inner panels may scroll while `document.excess` stays ≤ slop.
 */
export async function assertMobileHorizontalLayoutHealth(
  page: Page,
  context: string,
  opts: MobileLayoutHealthOptions = {},
): Promise<void> {
  const docSlop = opts.documentSlopPx ?? 2;
  const mainSlop = opts.mainSlopPx ?? 4;
  const o = await measureHorizontalOverflow(page);
  if (o.document.excess > docSlop) {
    logDedupedClientDiagnostic("mobile_e2e", "horizontal_overflow_document", context, {
      documentExcessPx: o.document.excess,
      scrollWidth: o.document.scrollWidth,
      clientWidth: o.document.clientWidth,
    });
  }
  expect(o.document.excess, `[${context}] document overflow ${o.document.scrollWidth}px vs ${o.document.clientWidth}px`).toBeLessThanOrEqual(
    docSlop,
  );
  if (o.main && o.main.excess > mainSlop) {
    logDedupedClientDiagnostic("mobile_e2e", "horizontal_overflow_main", context, {
      mainExcessPx: o.main.excess,
    });
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
