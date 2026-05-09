/**
 * Regression: `/` must remain interactive after hydration — no marketing main error shell,
 * no generic crash copy, no uncaught page errors or broken Next static chunks.
 *
 * Run from `nursenest-core` with app on BASE_URL:
 *   npm run start # after npm run build
 *   BASE_URL=http://localhost:3000 npx playwright test tests/e2e/public/homepage-stays-loaded-after-hydration.spec.ts --project=chromium
 */
import { expect, test } from "@playwright/test";

const SELECTOR_DISMISSED_LS = "nn_selector_dismissed";

test.beforeEach(async ({ context }) => {
  await context.addInitScript((key) => {
    try {
      localStorage.setItem(key, "1");
    } catch {
      /* ignore */
    }
  }, SELECTOR_DISMISSED_LS);
});

test.describe("Homepage stays loaded after hydration", () => {
  test.use({ viewport: { width: 1280, height: 800 } });

  test("no crash UI after 5s; NurseNest + chrome visible; no pageerror", async ({
    page,
  }, testInfo) => {
    const pageErrors: string[] = [];
    page.on("pageerror", (err) => {
      pageErrors.push(err instanceof Error ? err.message : String(err));
    });

    const badStaticChunks: { url: string; status: number }[] = [];
    page.on("response", (res) => {
      const url = res.url();
      if (!url.includes("/_next/static/")) return;
      const status = res.status();
      if (status !== 200 && status !== 304) {
        badStaticChunks.push({ url, status });
      }
    });

    await page.goto("/", { waitUntil: "load", timeout: 120_000 });

    await page.waitForTimeout(5000);

    expect(
      badStaticChunks,
      `Non-OK /_next/static responses: ${JSON.stringify(badStaticChunks)}`,
    ).toEqual([]);

    const bodyText = (await page.locator("body").innerText()).trim();
    expect(bodyText).not.toMatch(/page cannot load/i);
    expect(bodyText).not.toMatch(/something went wrong/i);
    expect(bodyText).not.toMatch(/something went wrong loading this section/i);
    expect(bodyText).not.toMatch(/application error/i);

    await expect(page.getByText(/NurseNest/i).first()).toBeVisible({ timeout: 15_000 });

    const header = page.locator("header").first();
    await expect(header).toBeVisible();

    const main = page.locator("main").first();
    await expect(main).toBeVisible({ timeout: 15_000 });

    const mainH1 = main.getByRole("heading", { level: 1 }).first();
    await expect(mainH1).toBeVisible();
    await expect(mainH1).not.toHaveText(/^\s*$/);

    /** Primary marketing navigation (tier/exam chrome). Theme picker may be omitted when only one public theme exists. */
    await expect(page.getByRole("navigation").first()).toBeVisible({ timeout: 15_000 });

    expect(pageErrors, `Uncaught page errors: ${pageErrors.join(" | ")}`).toEqual([]);

    await page.screenshot({
      path: testInfo.outputPath("homepage-after-5s.png"),
      fullPage: false,
    });
  });
});
