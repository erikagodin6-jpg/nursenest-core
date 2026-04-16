import type { Locator, Page } from "@playwright/test";

/**
 * Responsive learner study chrome (`learner-shell-primary-nav.tsx`):
 * - Desktop/tablet: `nav[aria-label="Learner primary actions"]`
 * - Mobile: `nav[aria-label="Learner bottom navigation"]`
 *
 * `getByRole` skips `display:none` landmarks. Optional fallback: `data-nn-learner-shell-study-nav` when
 * deployed (older production may not have the attribute yet).
 */
export function learnerShellStudyNavigation(page: Page): Locator {
  return page
    .getByRole("navigation", { name: "Learner primary actions" })
    .or(page.getByRole("navigation", { name: "Learner bottom navigation" }))
    .or(page.locator("[data-nn-learner-shell-study-nav]").filter({ visible: true }).first());
}
