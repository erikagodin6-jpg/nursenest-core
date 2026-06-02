import { expect, type Page } from "@playwright/test";
import { measureHorizontalOverflow } from "./mobile-usability-audit";

/**
 * Asserts the document root does not scroll horizontally beyond a small slop
 * (subpixel / scrollbar quirks). Reuses {@link measureHorizontalOverflow}.
 */
export async function assertDocumentNoHorizontalOverflow(
  page: Page,
  slopPx = 2,
): Promise<void> {
  const o = await measureHorizontalOverflow(page);
  expect(
    o.document.excess,
    `document horizontal overflow ${o.document.scrollWidth}px vs ${o.document.clientWidth}px`,
  ).toBeLessThanOrEqual(slopPx);
}

/**
 * Asserts a single DOM node (first match) does not scroll horizontally beyond slop.
 * Call after the element is visible/stable.
 */
export async function assertElementNoHorizontalOverflow(
  page: Page,
  selector: string,
  slopPx = 2,
): Promise<void> {
  const excess = await page.evaluate((sel) => {
    const el = document.querySelector(sel);
    if (!el) return null;
    const h = el as HTMLElement;
    return h.scrollWidth - h.clientWidth;
  }, selector);
  if (excess === null) {
    throw new Error(`assertElementNoHorizontalOverflow: no element for ${selector}`);
  }
  expect(excess, `horizontal overflow on ${selector}`).toBeLessThanOrEqual(slopPx);
}
