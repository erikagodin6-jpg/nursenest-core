import { expect, type Page } from "@playwright/test";

/** Pre-exam customize sheet (theme + begin) mounts above the practice builder on many flows. */
const EXAM_CUSTOMIZE_BEGIN = '[data-testid="button-exam-customize-begin"]';

/**
 * After `[data-nn-qa-practice-hub-start-test]`, either the pre-exam customize modal appears
 * (click `button-exam-customize-begin`) or the legacy inline **Begin exam** button is used alone.
 */
export async function clickBeginExamAfterPracticeHubStart(page: Page): Promise<void> {
  const customizeBegin = page.locator(EXAM_CUSTOMIZE_BEGIN);
  try {
    await customizeBegin.waitFor({ state: "visible", timeout: 15_000 });
    await expect(customizeBegin).toBeEnabled({ timeout: 60_000 });
    await customizeBegin.click();
    return;
  } catch {
    /* no pre-exam customize sheet in this build */
  }
  const inlineBegin = page.getByRole("button", { name: /^Begin exam$/i });
  await expect(inlineBegin).toBeVisible({ timeout: 15_000 });
  await inlineBegin.click();
}

/**
 * One CAT **exam / test mode** item: select → Submit & Continue → advance (`data-nn-qa-cat-exam-advance`).
 * Primary advance CTA uses the same “Submit & Continue” label as the initial submit control.
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

  const submit = page.getByRole("button", { name: /^Submit & Continue$/i });
  await expect(submit).toBeEnabled({ timeout: 30_000 });
  await submit.click();

  const advance = page.locator("[data-nn-qa-cat-exam-advance]");
  await expect(advance).toBeEnabled({ timeout: 30_000 });
  await advance.click();
  await page.waitForLoadState("networkidle", { timeout: 30_000 }).catch(() => {});
}
