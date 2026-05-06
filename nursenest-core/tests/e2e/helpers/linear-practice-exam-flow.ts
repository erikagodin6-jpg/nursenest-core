import { expect, type Page } from "@playwright/test";
import { clickBeginExamAfterPracticeHubStart } from "./cat-practice-exam-flow";

/**
 * Linear practice (non-CAT) from hub → runner URL. Uses default hub "Start practice" + customize begin.
 */
export async function startLinearPracticeTestFromHub(page: Page, pathwayId: string): Promise<void> {
  await page.goto(`/app/practice-tests?pathwayId=${encodeURIComponent(pathwayId)}`, {
    waitUntil: "domcontentloaded",
  });
  await expect(page.locator("[data-nn-qa-practice-hub-start-test]")).toBeVisible({ timeout: 120_000 });
  await page.locator("[data-nn-qa-practice-hub-start-test]").click();
  await clickBeginExamAfterPracticeHubStart(page);
  await page.waitForURL(/\/app\/practice-tests\/[a-zA-Z0-9_-]+/, { timeout: 120_000 });
}

/**
 * Select first MCQ/SATA option, submit, then expect teaching rationale (split panel or inline per-item).
 */
export async function submitFirstLinearPracticeAnswerAndExpectRationale(page: Page): Promise<void> {
  const list = page.locator("ul.nn-cat-opt-list").first();
  await expect(list).toBeVisible({ timeout: 120_000 });
  const mcBtn = list.locator("button.nn-cat-opt");
  const sataLabel = list.locator("label.nn-cat-opt");
  if ((await mcBtn.count()) > 0) {
    await mcBtn.first().click();
  } else if ((await sataLabel.count()) > 0) {
    await sataLabel.first().click();
  } else {
    throw new Error("No linear practice answer options (expected MC or SATA controls).");
  }

  const submit = page.getByRole("button", { name: /^Submit answer$/i });
  await expect(submit).toBeEnabled({ timeout: 30_000 });
  await submit.click();

  const rationaleRegion = page
    .locator(".nn-practice-exam-rationale-panel, [data-nn-practice-per-item-rationale]")
    .first();
  await expect(rationaleRegion).toBeVisible({ timeout: 60_000 });
  await expect(
    rationaleRegion.locator(".nn-rationale-prose, .nn-question-rationale-card__body").first(),
  ).toBeVisible({ timeout: 30_000 });
}

/** Clicks "Next item" in linear practice footer when enabled (multi-item sessions). */
export async function clickLinearPracticeNextItemIfPresent(page: Page): Promise<boolean> {
  const next = page.getByRole("button", { name: /^Next item$/i });
  if (!(await next.isVisible().catch(() => false))) return false;
  if (!(await next.isEnabled().catch(() => false))) return false;
  await next.click();
  await page.waitForLoadState("domcontentloaded").catch(() => {});
  return true;
}
