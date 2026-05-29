import { expect, test, type Page } from "@playwright/test";
import { resolveE2eAppBaseUrl } from "../helpers/e2e-env";
import { paidFlashcardsHubUrl } from "../helpers/paid-content-discovery";
import {
  PAID_E2E_DEFAULT_PATHWAY_ID,
  expectPaidLearnerShellReady,
  learnerAppMainLandmark,
} from "../helpers/paid-learner-shell";
import { expectNoSubscriptionPaywall } from "../helpers/paid-surface-assertions";
import { expectNotLoginUrl } from "../helpers/paid-user-suite";

const pathwayId = process.env.FLASHCARDS_HEADER_E2E_PATHWAY_ID?.trim() || PAID_E2E_DEFAULT_PATHWAY_ID;
const widths = [1280, 1440, 1728, 1920] as const;

async function launchFlashcardSession(page: Page, baseURL: string | undefined) {
  const url = new URL(paidFlashcardsHubUrl(pathwayId), resolveE2eAppBaseUrl(baseURL)).toString();
  await page.goto(url, { waitUntil: "domcontentloaded" });
  expectNotLoginUrl(page);
  await expectPaidLearnerShellReady(page, "flashcards header layout");
  await expectNoSubscriptionPaywall(page, "flashcards header layout");

  const main = learnerAppMainLandmark(page);
  await expect(main).toBeVisible({ timeout: 120_000 });
  const start = main.locator("[data-nn-e2e-start-review]");
  await expect(start).toBeVisible({ timeout: 90_000 });
  await start.click();
  await page.waitForURL(/\/app\/flashcards\/custom/, { timeout: 120_000 });
  await expect(page.locator(".nn-premium-flashcard-session-root.nn-flashcard-study-premium")).toBeVisible({ timeout: 120_000 });
}

test.describe("Flashcards study header layout", () => {
  for (const width of widths) {
    test(`header metrics do not wrap or drift at ${width}px`, async ({ page, baseURL }, testInfo) => {
      test.setTimeout(240_000);
      await page.setViewportSize({ width, height: 900 });
      await launchFlashcardSession(page, baseURL);

      const metrics = await page.evaluate(() => {
        const topbar = document.querySelector(".nn-flashcard-learning-topbar") as HTMLElement | null;
        const labels = [...document.querySelectorAll(".nn-flashcard-topbar-stat-label")] as HTMLElement[];
        const controls = [
          ...document.querySelectorAll(".nn-flashcard-learning-topbar__meta > div"),
          ...document.querySelectorAll(".nn-flashcard-learning-topbar__meta [role='group']"),
          ...document.querySelectorAll(".nn-flashcard-learning-topbar__meta button"),
        ] as HTMLElement[];
        const footer = document.querySelector(".nn-flashcard-session-main-footer") as HTMLElement | null;
        return {
          topbarHeight: topbar?.getBoundingClientRect().height ?? 0,
          wrappedLabels: labels
            .filter((label) => label.scrollWidth > label.clientWidth + 1 || label.scrollHeight > label.clientHeight + 3)
            .map((label) => label.innerText),
          controlHeights: controls.map((el) => Math.round(el.getBoundingClientRect().height)),
          footerOverflow: footer ? footer.scrollWidth - footer.clientWidth : 0,
          documentOverflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
        };
      });

      expect(metrics.topbarHeight, `topbar height ${metrics.topbarHeight}`).toBeLessThanOrEqual(50);
      expect(metrics.topbarHeight, `topbar height ${metrics.topbarHeight}`).toBeGreaterThanOrEqual(46);
      expect(metrics.wrappedLabels, `wrapped labels at ${width}: ${metrics.wrappedLabels.join(", ")}`).toEqual([]);
      expect(metrics.footerOverflow, `learning footer overflow at ${width}`).toBeLessThanOrEqual(2);
      expect(metrics.documentOverflow, `document horizontal overflow at ${width}`).toBeLessThanOrEqual(2);
      expect(Math.max(...metrics.controlHeights) - Math.min(...metrics.controlHeights), "control height drift").toBeLessThanOrEqual(18);

      await testInfo.attach(`flashcards-header-${width}.json`, {
        body: JSON.stringify(metrics, null, 2),
        contentType: "application/json",
      });
    });
  }
});

