/**
 * Asserts the **live** learner routes for flashcards hub + practice exam builder
 * (`/app/practice-tests`, not marketing `/practice-exams`).
 *
 * Run: `npx playwright test -c playwright.learning-routes.config.ts`
 */
import { expect, test } from "@playwright/test";
import { paidFlashcardsHubUrl } from "../helpers/paid-content-discovery";
import {
  PAID_E2E_DEFAULT_PATHWAY_ID,
  expectPaidLearnerShellReady,
  learnerAppMainLandmark,
} from "../helpers/paid-learner-shell";
import { expectNoSubscriptionPaywall } from "../helpers/paid-surface-assertions";
import { expectNotLoginUrl } from "../helpers/paid-user-suite";

const pathwayId =
  process.env.LEARNING_ROUTES_E2E_PATHWAY_ID?.trim() || PAID_E2E_DEFAULT_PATHWAY_ID;

test.describe("Learning routes — live flashcards + practice builder", () => {
  test("flashcards hub: heading, body-system cards, multi-select, start review", async ({ page, baseURL }) => {
    test.setTimeout(150_000);
    const url = new URL(paidFlashcardsHubUrl(pathwayId), baseURL ?? "http://127.0.0.1:3000").toString();
    await page.goto(url, { waitUntil: "domcontentloaded" });
    expectNotLoginUrl(page);
    await expectPaidLearnerShellReady(page, "learning-routes flashcards");
    await expectNoSubscriptionPaywall(page, "flashcards hub");

    const main = learnerAppMainLandmark(page);
    await expect(main).toBeVisible({ timeout: 120_000 });

    await expect(page.getByText("NN_RENDER_TRACE: flashcards live route")).toBeVisible({
      timeout: 30_000,
    });

    await expect(main.locator("[data-nn-e2e-flashcards-hub]")).toBeVisible({ timeout: 60_000 });
    await expect(main.getByRole("heading", { level: 1 })).toBeVisible();

    const firstCard = main.locator("[data-nn-e2e-body-system-card]").first();
    if ((await firstCard.count()) > 0) {
      await firstCard.click();
      await firstCard.click();
    }

    await expect(main.locator("[data-nn-e2e-start-review]")).toBeVisible({ timeout: 60_000 });
  });

  test("practice-tests hub: builder, question count, pathway select", async ({ page, baseURL }) => {
    test.setTimeout(150_000);
    const url = new URL(
      `/app/practice-tests?pathwayId=${encodeURIComponent(pathwayId)}`,
      baseURL ?? "http://127.0.0.1:3000",
    ).toString();
    await page.goto(url, { waitUntil: "domcontentloaded" });
    expectNotLoginUrl(page);
    await expectPaidLearnerShellReady(page, "learning-routes practice-tests");
    await expectNoSubscriptionPaywall(page, "practice-tests hub");

    const main = learnerAppMainLandmark(page);
    await expect(main).toBeVisible({ timeout: 120_000 });

    await expect(
      page.getByText("NN_RENDER_TRACE: practice exams live route (/app/practice-tests)"),
    ).toBeVisible({ timeout: 30_000 });

    await expect(main.locator("[data-nn-e2e-practice-exams-builder]")).toBeVisible({ timeout: 60_000 });
    await expect(main.locator("[data-nn-e2e-question-count]")).toBeVisible();
    await expect(main.locator("[data-nn-qa-practice-hub-pathway-select]")).toBeVisible();
  });

  test("/app/practice-exams alias redirects to practice-tests preserving pathwayId", async ({ page, baseURL }) => {
    test.setTimeout(90_000);
    const from = new URL(
      `/app/practice-exams?pathwayId=${encodeURIComponent(pathwayId)}`,
      baseURL ?? "http://127.0.0.1:3000",
    ).toString();
    await page.goto(from, { waitUntil: "domcontentloaded" });
    await page.waitForURL(/\/app\/practice-tests/, { timeout: 60_000 });
    const landed = new URL(page.url());
    expect(landed.pathname).toBe("/app/practice-tests");
    expect(landed.searchParams.get("pathwayId")).toBe(pathwayId);
  });
});
