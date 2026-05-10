import { expect, test } from "@playwright/test";
import { mkdirSync } from "node:fs";
import { loginWithCredentials } from "./helpers/learner-login";
import { expectPaidLearnerShellReady, PAID_E2E_DEFAULT_PATHWAY_ID } from "./helpers/paid-learner-shell";
import { getQaPaidCredentials } from "./helpers/smoke-credentials";

const SCREENSHOT_DIR = "docs/screenshots/live-layout-verification";

test.describe("Live layout markers", () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  test.beforeAll(() => {
    mkdirSync(SCREENSHOT_DIR, { recursive: true });
  });

  test("public marketing surfaces render premium markers and valid static assets", async ({ page }, testInfo) => {
    test.setTimeout(300_000);
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await expect(page.locator(".nn-home-marketing-rich-hero")).toBeVisible({ timeout: 90_000 });
    await expect(page.locator(".nn-premium-hero-grid")).toBeVisible();
    await expect(page.locator(".nn-premium-hero-panel")).toBeVisible();
    await page.screenshot({ path: `${SCREENSHOT_DIR}/homepage-${testInfo.project.name}.png`, fullPage: false });

    const assetUrls = await page.evaluate(() =>
      Array.from(document.querySelectorAll<HTMLScriptElement | HTMLLinkElement>('script[src*="/_next/static/"],link[href*="/_next/static/"]'))
        .map((el) => ("src" in el ? el.src : el.href))
        .filter(Boolean),
    );
    const jsAsset = assetUrls.find((url) => url.includes(".js"));
    const cssAsset = assetUrls.find((url) => url.includes(".css"));
    const sampledAssets = [cssAsset, jsAsset].filter((url): url is string => Boolean(url));
    expect(sampledAssets.length).toBeGreaterThan(0);
    for (const url of sampledAssets) {
      const res = await page.request.get(url, { headers: { range: "bytes=0-511" } });
      expect([200, 206], `${url} status`).toContain(res.status());
      const contentType = res.headers()["content-type"] ?? "";
      if (url.includes(".css")) {
        expect(contentType, `${url} content-type`).toContain("text/css");
      }
      if (url.includes(".js")) {
        expect(contentType, `${url} content-type`).toContain("javascript");
      }
      const bodyStart = (await res.text()).slice(0, 200).toLowerCase();
      expect(bodyStart, `${url} must not return homepage HTML`).not.toContain("<html");
    }

    await page.goto("/canada/rn/nclex-rn/questions", { waitUntil: "domcontentloaded" });
    await expect(page.getByTestId("marketing-practice-questions-hub")).toBeVisible({ timeout: 90_000 });
    await expect(page.getByTestId("start-selected-systems-practice").first()).toBeVisible();
    await page.screenshot({ path: `${SCREENSHOT_DIR}/rn-questions-${testInfo.project.name}.png`, fullPage: false });
  });

  test("authenticated learner surfaces render premium markers", async ({ page }, testInfo) => {
    const creds = getQaPaidCredentials();
    test.skip(!creds, "Set QA_PAID_EMAIL + QA_PAID_PASSWORD (or E2E_PAID_*)");

    await loginWithCredentials(page, creds!.email, creds!.password);

    await page.goto("/app", { waitUntil: "domcontentloaded" });
    await expectPaidLearnerShellReady(page, "live layout markers dashboard");
    await expect(page.locator("[data-nn-learner-dashboard-convergence]")).toBeVisible({ timeout: 90_000 });
    await page.screenshot({ path: `${SCREENSHOT_DIR}/learner-dashboard-${testInfo.project.name}.png`, fullPage: true });

    await page.goto(`/app/practice-tests?pathwayId=${encodeURIComponent(PAID_E2E_DEFAULT_PATHWAY_ID)}`, {
      waitUntil: "domcontentloaded",
    });
    await expectPaidLearnerShellReady(page, "live layout markers practice");
    await expect(page.locator("[data-nn-practice-exam-hub-convergence]")).toBeVisible({ timeout: 90_000 });
    await page.screenshot({ path: `${SCREENSHOT_DIR}/practice-tests-${testInfo.project.name}.png`, fullPage: true });

    await page.goto(`/app/flashcards?pathwayId=${encodeURIComponent(PAID_E2E_DEFAULT_PATHWAY_ID)}`, {
      waitUntil: "domcontentloaded",
    });
    await expectPaidLearnerShellReady(page, "live layout markers flashcards");
    await expect(page.locator("[data-nn-premium-flashcard-convergence]")).toBeVisible({ timeout: 90_000 });
    await page.screenshot({ path: `${SCREENSHOT_DIR}/flashcards-${testInfo.project.name}.png`, fullPage: true });

    await page.goto("/app/account/report", { waitUntil: "domcontentloaded" });
    await expectPaidLearnerShellReady(page, "live layout markers report-card");
    await expect(page.locator("[data-nn-learner-report-card-convergence]")).toBeVisible({ timeout: 90_000 });
    await page.screenshot({ path: `${SCREENSHOT_DIR}/report-card-${testInfo.project.name}.png`, fullPage: true });

    await page.goto(`/app/practice-tests/start?mode=cat&pathwayId=${encodeURIComponent(PAID_E2E_DEFAULT_PATHWAY_ID)}`, {
      waitUntil: "domcontentloaded",
    });
    await expect(page.locator("[data-nn-cat-premium-convergence], .nn-cat-premium-convergence").first()).toBeVisible({
      timeout: 120_000,
    });
    await page.screenshot({ path: `${SCREENSHOT_DIR}/cat-${testInfo.project.name}.png`, fullPage: true });
  });
});
