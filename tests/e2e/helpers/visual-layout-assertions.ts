import { expect, type Page } from "@playwright/test";

/**
 * Heuristic layout checks for Playwright visual QA (no pixel baselines).
 * Complements screenshots and manual Figma parity review.
 */

export async function assertDocumentNoHorizontalOverflow(page: Page): Promise<void> {
  const overflow = await page.evaluate(() => {
    const el = document.documentElement;
    return el.scrollWidth > el.clientWidth + 1;
  });
  expect(overflow, "document should not scroll horizontally (layout overflow)").toBe(false);
}

/** True when the element's horizontal scroll width fits its client width (tolerance 1px). */
export async function assertElementNoHorizontalOverflow(page: Page, selector: string): Promise<void> {
  const { found, overflows } = await page.evaluate((sel) => {
    const el = document.querySelector(sel);
    if (!el) return { found: false, overflows: false };
    return { found: true, overflows: el.scrollWidth > el.clientWidth + 1 };
  }, selector);
  expect(found, `element not found for overflow check: ${selector}`).toBe(true);
  expect(overflows, `${selector} should not overflow horizontally`).toBe(false);
}
