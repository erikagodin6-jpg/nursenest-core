/**
 * Regression: `/` must remain interactive after hydration — no marketing main error shell,
 * no generic crash copy, no uncaught page errors or broken Next static chunks.
 *
 * Root cause fixed (2026-05-09): `site-header.tsx` used `dynamic()` without
 * `import dynamic from "next/dynamic"` → ReferenceError after hydration →
 * marketing segment error UI ("Page could not load").
 *
 * Run from `nursenest-core` with app on BASE_URL:
 *   npm run build && npm run start
 *   BASE_URL=http://localhost:3000 npx playwright test tests/e2e/public/homepage-stays-loaded-after-hydration.spec.ts --project=chromium
 *
 * Against production:
 *   BASE_URL=https://www.nursenest.ca npx playwright test tests/e2e/public/homepage-stays-loaded-after-hydration.spec.ts --project=chromium
 */
import { expect, test } from "@playwright/test";

const SELECTOR_DISMISSED_LS = "nn_selector_dismissed";

/** Third-party / benign console noise — do not fail the build on these alone. */
function isLikelyBenignConsoleError(text: string): boolean {
  const t = text.toLowerCase();
  if (t.includes("favicon")) return true;
  if (t.includes("failed to load resource") && t.includes("analytics")) return true;
  return false;
}

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

    const consoleErrors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") {
        const text = msg.text();
        if (!isLikelyBenignConsoleError(text)) consoleErrors.push(text);
      }
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
    /** Marketing segment error UI (`error.tsx`) uses “Page could not load” — not “cannot”. */
    await expect(page.locator("body")).not.toContainText(/page could not load/i);
    await expect(page.locator("body")).not.toContainText(/page cannot load/i);
    await expect(page.locator("body")).not.toContainText(/something went wrong/i);
    expect(bodyText).not.toMatch(/something went wrong loading this section/i);
    await expect(page.locator("body")).not.toContainText(/application error/i);

    await expect(page.locator("[data-nn-app-error-screen]")).toHaveCount(0);

    await expect(page.locator("[data-nn-header-logo]").first()).toBeVisible({
      timeout: 15_000,
    });

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

    const severeConsole = consoleErrors.filter(
      (c) =>
        /referenceerror|typeerror|dynamic is not defined|hydration|chunk load/i.test(c) &&
        !isLikelyBenignConsoleError(c),
    );
    expect(
      severeConsole,
      `Console errors (severe): ${severeConsole.join(" | \n")}`,
    ).toEqual([]);

    await page.screenshot({
      path: testInfo.outputPath("homepage-after-5s.png"),
      fullPage: false,
    });
  });

  /**
   * Timeline screenshots for audits (initial paint → early hydration → post-settle).
   * Does not add extra assertions beyond smoke visibility — pair with main test for pass/fail.
   */
  test("diagnostic: timeline screenshots 0ms → 7s", async ({ page }, testInfo) => {
    const pageErrors: string[] = [];
    page.on("pageerror", (err) => {
      pageErrors.push(err instanceof Error ? err.message : String(err));
    });

    await page.goto("/", { waitUntil: "load", timeout: 120_000 });
    await page.screenshot({ path: testInfo.outputPath("hydration-t-0ms.png"), fullPage: false });

    await page.waitForTimeout(500);
    await page.screenshot({ path: testInfo.outputPath("hydration-t-500ms.png"), fullPage: false });

    await page.waitForTimeout(1500);
    await page.screenshot({ path: testInfo.outputPath("hydration-t-2000ms.png"), fullPage: false });

    await page.waitForTimeout(5000);
    await page.screenshot({ path: testInfo.outputPath("hydration-t-7000ms.png"), fullPage: false });

    expect(pageErrors, pageErrors.join(" | ")).toEqual([]);
  });
});
