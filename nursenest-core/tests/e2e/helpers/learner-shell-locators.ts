import type { Locator, Page } from "@playwright/test";

/** Canonical learner routes now use the global site header. */
export function learnerShellStudyNavigation(page: Page): Locator {
  return page
    .getByRole("navigation", { name: /NurseNest|main|navigation/i })
    .or(page.locator("[data-nn-site-header]").filter({ visible: true }).first());
}
