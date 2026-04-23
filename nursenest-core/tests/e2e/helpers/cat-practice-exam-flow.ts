import { expect, type Page } from "@playwright/test";

/**
 * One CAT **exam / test mode** item: select → Submit answer → Next (or Submit & finish on last buffer item).
 * Matches `PracticeTestRunnerClient` explicit exam UX (`catExamFeedbackMode !== "study"`).
 */
export async function answerOneCatExamItem(page: Page): Promise<void> {
  const list = page.locator("ul.nn-cat-opt-list").first();
  await expect(list).toBeVisible({ timeout: 120_000 });
  const mcBtn = list.locator("button.nn-cat-opt");
  const sataLabel = list.locator("label.nn-cat-opt");
  if ((await mcBtn.count()) > 0) {
    await mcBtn.first().click();
  } else if ((await sataLabel.count()) > 0) {
    await sataLabel.first().click();
  } else {
    throw new Error("No CAT answer options found (expected MC or SATA controls).");
  }

  const submit = page.getByRole("button", { name: /^Submit answer$/i });
  await expect(submit).toBeEnabled({ timeout: 30_000 });
  await submit.click();

  const advance = page.getByRole("button", { name: /Next question|Submit & finish/ });
  await expect(advance).toBeEnabled({ timeout: 30_000 });
  await advance.click();
  await page.waitForLoadState("networkidle", { timeout: 30_000 }).catch(() => {});
}
