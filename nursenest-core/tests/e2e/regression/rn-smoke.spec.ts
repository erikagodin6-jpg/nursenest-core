/**
 * Minimal RN happy-path smoke: marketing home → US RN hub → lessons → one lesson →
 * study loop visible → "Practice this topic" hits /app (auth gate for anonymous users).
 *
 * Run from nursenest-core: `npx playwright test tests/e2e/regression/rn-smoke.spec.ts`
 * Requires dev server: `BASE_URL=http://127.0.0.1:3000 npm run dev`
 */
import { test, expect } from "@playwright/test";
import {
  LESSON_FLOW_PATHWAY_QA,
  throwIfUrlNotAllowedForPathway,
} from "../../../src/lib/qa/lesson-flow-pathways";
import { MARKETING_REGION_COOKIE } from "../../../src/lib/region/marketing-region-cookie";
import { getE2eBaseURL } from "../helpers/e2e-env";

const baseURL = getE2eBaseURL();

const rnUs = LESSON_FLOW_PATHWAY_QA.find((c) => c.pathwayId === "us-rn-nclex-rn");
if (!rnUs) {
  throw new Error("lesson-flow-pathways: us-rn-nclex-rn config missing");
}

test.beforeEach(async ({ context }) => {
  await context.addInitScript(() => {
    try {
      localStorage.removeItem("nursenest-region");
    } catch {
      /* ignore */
    }
  });
});

test.describe("RN smoke (single happy path)", () => {
  test("homepage → RN pathway → primary lesson → study loop → practice CTA redirects to login", async ({
    page,
    context,
  }) => {
    await context.addCookies([
      { name: MARKETING_REGION_COOKIE, value: rnUs.marketingRegionCookie, url: baseURL },
    ]);

    await page.goto("/", { waitUntil: "domcontentloaded" });
    throwIfUrlNotAllowedForPathway(page.url(), rnUs);

    const rnCard = page.locator('a[data-nn-exam-card-id="rn"]');
    await expect(rnCard).toBeVisible();
    await rnCard.click();
    await page.waitForLoadState("domcontentloaded");
    throwIfUrlNotAllowedForPathway(page.url(), rnUs);
    expect(page.url()).toContain(rnUs.hubPath.replace(/\/$/, ""));

    await page.locator(`a[href="${rnUs.lessonsPath}"], a[href="${rnUs.lessonsPath}/"]`).first().click();
    await page.waitForLoadState("domcontentloaded");
    throwIfUrlNotAllowedForPathway(page.url(), rnUs);

    const primary = page.locator('[data-nn-qa-primary-lesson="true"]').first();
    await expect(primary).toBeVisible({ timeout: 120_000 });
    await primary.click();
    await page.waitForLoadState("domcontentloaded");
    throwIfUrlNotAllowedForPathway(page.url(), rnUs);

    await expect(page.locator(`header[data-nn-pathway-id="${rnUs.pathwayId}"]`)).toBeVisible();

    const main = page.locator("main");
    await expect(main).toBeVisible();
    await expect(main).not.toBeEmpty();

    await page.getByText("After this lesson", { exact: true }).waitFor({ state: "visible", timeout: 120_000 });
    await expect(page.locator('[data-nn-qa-study-loop="true"]')).toBeVisible();

    await page.getByTestId("pathway-lesson-cta-practice-topic").click();
    await page.waitForLoadState("domcontentloaded");

    await expect(page).toHaveURL(/\/login/);
  });
});
