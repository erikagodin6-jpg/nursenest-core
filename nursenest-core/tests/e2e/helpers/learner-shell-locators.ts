import type { Locator, Page } from "@playwright/test";

/**
 * Responsive learner study chrome (`learner-shell-primary-nav.tsx`):
 * - Desktop/tablet: `nav[aria-label="Learner primary actions"]` (`max-md:hidden` below `md`; default block at `md+`)
 * - Mobile: `nav[aria-label="Learner bottom navigation"]` (`md:hidden` at `md+`)
 *
 * Only one is visible at a time. CSS locators match **both** nodes in the DOM; `getByRole` follows the
 * accessibility tree and **omits** `display:none` landmarks, so `or()` resolves to the visible nav.
 */
export function learnerShellStudyNavigation(page: Page): Locator {
  return page
    .getByRole("navigation", { name: "Learner primary actions" })
    .or(page.getByRole("navigation", { name: "Learner bottom navigation" }));
}
