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
const widths = [1366, 1440, 1536, 1728, 1920] as const;

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
        const ratingDock = document.querySelector(".nn-flashcard-rating-dock") as HTMLElement | null;
        const question = document.querySelector("[data-nn-flashcard-question-workspace]") as HTMLElement | null;
        const rationale = document.querySelector("[data-nn-flashcard-rationale-workspace]") as HTMLElement | null;
        const root = document.querySelector("[data-nn-flashcard-premium-visual-refinement]") as HTMLElement | null;
        const educationalContainers = [
          ...document.querySelectorAll("[data-nn-educational-content-container]"),
          ...document.querySelectorAll(".nn-flashcard-rationale-panel__body"),
        ] as HTMLElement[];
        const viewportHeight = window.innerHeight;
        const dockRect = ratingDock?.getBoundingClientRect();
        const questionRect = question?.getBoundingClientRect();
        const rationaleRect = rationale?.getBoundingClientRect();
        const totalStudyWidth = (questionRect?.width ?? 0) + (rationaleRect?.width ?? 0);
        return {
          topbarHeight: topbar?.getBoundingClientRect().height ?? 0,
          wrappedLabels: labels
            .filter((label) => label.scrollWidth > label.clientWidth + 1 || label.scrollHeight > label.clientHeight + 3)
            .map((label) => label.innerText),
          controlHeights: controls.map((el) => Math.round(el.getBoundingClientRect().height)),
          shortTargets: controls
            .filter((el) => el.tagName === "BUTTON" && el.getBoundingClientRect().height < 44)
            .map((el) => el.innerText || el.getAttribute("aria-label") || el.className),
          footerOverflow: footer ? footer.scrollWidth - footer.clientWidth : 0,
          documentOverflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
          gradientRendered: root ? getComputedStyle(root).backgroundImage.includes("linear-gradient") : false,
          questionRatio: totalStudyWidth > 0 ? (questionRect?.width ?? 0) / totalStudyWidth : 0,
          rationaleWidth: Math.round(rationaleRect?.width ?? 0),
          nestedEducationalScrollers: educationalContainers
            .filter((el) => {
              if (el.classList.contains("nn-flashcard-rationale-panel__body")) return false;
              const style = getComputedStyle(el);
              return ["auto", "scroll", "hidden"].includes(style.overflowY) || el.scrollHeight > el.clientHeight + 2;
            })
            .map((el) => el.getAttribute("class") || el.getAttribute("data-nn-clinical-pearl") || el.tagName),
          fixedEducationalContainers: educationalContainers
            .filter((el) => {
              const style = getComputedStyle(el);
              return style.maxHeight !== "none" || (style.height !== "auto" && el.scrollHeight > el.clientHeight + 2);
            })
            .map((el) => el.getAttribute("class") || el.getAttribute("data-nn-clinical-pearl") || el.tagName),
          bottomControlsVisible: Boolean(dockRect && dockRect.width > 0 && dockRect.height > 0 && dockRect.top < viewportHeight && dockRect.bottom > 0),
          lockedRationaleCount: document.querySelectorAll('[data-nn-rationale-state="locked"]').length,
          revealedRationaleCount: document.querySelectorAll('[data-nn-rationale-state="revealed"]').length,
        };
      });

      expect(metrics.topbarHeight, `topbar height ${metrics.topbarHeight}`).toBeLessThanOrEqual(64);
      expect(metrics.topbarHeight, `topbar height ${metrics.topbarHeight}`).toBeGreaterThanOrEqual(44);
      expect(metrics.wrappedLabels, `wrapped labels at ${width}: ${metrics.wrappedLabels.join(", ")}`).toEqual([]);
      expect(metrics.footerOverflow, `learning footer overflow at ${width}`).toBeLessThanOrEqual(2);
      expect(metrics.documentOverflow, `document horizontal overflow at ${width}`).toBeLessThanOrEqual(2);
      expect(Math.max(...metrics.controlHeights) - Math.min(...metrics.controlHeights), "control height drift").toBeLessThanOrEqual(18);
      expect(metrics.shortTargets, `short interactive targets at ${width}: ${metrics.shortTargets.join(", ")}`).toEqual([]);
      expect(metrics.gradientRendered, `theme-aware gradient missing at ${width}`).toBe(true);
      expect(metrics.questionRatio, `question ratio at ${width}`).toBeGreaterThanOrEqual(0.58);
      expect(metrics.questionRatio, `question ratio at ${width}`).toBeLessThanOrEqual(0.61);
      expect(metrics.rationaleWidth, `rationale reading width at ${width}`).toBeGreaterThanOrEqual(480);
      expect(metrics.nestedEducationalScrollers, `nested educational scrollers at ${width}`).toEqual([]);
      expect(metrics.fixedEducationalContainers, `fixed educational containers at ${width}`).toEqual([]);
      expect(metrics.bottomControlsVisible, `bottom controls visible at ${width}`).toBe(true);
      expect(metrics.lockedRationaleCount, `locked pre-answer rationale at ${width}`).toBeGreaterThanOrEqual(1);
      expect(metrics.revealedRationaleCount, `rationale should not reveal before answering at ${width}`).toBe(0);

      await testInfo.attach(`flashcards-header-${width}.json`, {
        body: JSON.stringify(metrics, null, 2),
        contentType: "application/json",
      });
    });
  }

  test("answering reveals rationale while keeping controls visible", async ({ page, baseURL }) => {
    test.setTimeout(240_000);
    await page.setViewportSize({ width: 1440, height: 900 });
    await launchFlashcardSession(page, baseURL);

    const firstOption = page.locator("[data-nn-premium-flashcard-mcq] ul button").first();
    test.skip(!(await firstOption.isVisible({ timeout: 30_000 }).catch(() => false)), "No MCQ option rendered.");
    await expect(page.locator('[data-nn-rationale-state="revealed"]')).toHaveCount(0);
    await firstOption.click();
    await page.locator(".nn-flashcard-submit-answer").click();
    await expect(page.locator('[data-nn-rationale-state="revealed"]')).toBeVisible({ timeout: 30_000 });
    await expect(page.locator(".nn-flashcard-rating-dock")).toBeVisible();

    const visibility = await page.evaluate(() => {
      const dock = document.querySelector(".nn-flashcard-rating-dock") as HTMLElement | null;
      const footer = document.querySelector(".nn-flashcard-session-main-footer") as HTMLElement | null;
      const clinicalPearl = document.querySelector("[data-nn-clinical-pearl]") as HTMLElement | null;
      const rationaleBody = document.querySelector(".nn-flashcard-rationale-panel__body") as HTMLElement | null;
      const rect = dock?.getBoundingClientRect();
      return {
        dockInViewport: Boolean(rect && rect.top < window.innerHeight && rect.bottom > 0),
        footerOverflow: footer ? footer.scrollWidth - footer.clientWidth : 0,
        clinicalPearlFullyVisible: clinicalPearl ? clinicalPearl.scrollHeight <= clinicalPearl.clientHeight + 2 : false,
        rationaleBodyScrollsInternally: rationaleBody
          ? ["auto", "scroll", "hidden"].includes(getComputedStyle(rationaleBody).overflowY) || rationaleBody.scrollHeight > rationaleBody.clientHeight + 2
          : true,
      };
    });
    expect(visibility.dockInViewport).toBe(true);
    expect(visibility.footerOverflow).toBeLessThanOrEqual(2);
    expect(visibility.clinicalPearlFullyVisible).toBe(true);
    expect(visibility.rationaleBodyScrollsInternally).toBe(true);
  });
});
