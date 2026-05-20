/**
 * Regression: `/` must not collapse to marketing safe-mode or global "Just a moment" after hydration.
 *
 * Run from `nursenest-core` with app on BASE_URL (dev or production-like `npm run start`):
 *   npx playwright test tests/e2e/public/homepage-no-safe-mode-after-hydration.spec.ts --project=chromium
 */
import { expect, test } from "@playwright/test";

const SELECTOR_DISMISSED_LS = "nn_selector_dismissed";

/** Non-fatal browser quirks occasionally surface as pageerror in automation — extend only with comment. */
const PAGEERROR_ALLOWLIST: RegExp[] = [];

/** Carousel / next/image hard failures that must not reach the browser console on `/`. */
const FATAL_CONSOLE_SUBSTRINGS = [
  "Cannot read properties of undefined",
  "Image is missing required src",
  "Invalid src prop",
  "Minified React error",
] as const;

test.beforeEach(async ({ context }) => {
  await context.addInitScript((key) => {
    try {
      localStorage.setItem(key, "1");
    } catch {
      /* ignore */
    }
  }, SELECTOR_DISMISSED_LS);
});

test.describe("Homepage stays real after hydration", () => {
  test.use({ viewport: { width: 1280, height: 800 } });

  test("no safe-mode / emergency shell; hero h1 visible; no uncaught pageerror", async ({ page }) => {
    const pageErrors: string[] = [];
    page.on("pageerror", (err) => {
      pageErrors.push(err?.message ?? String(err));
    });

    const consoleErrors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() !== "error") return;
      consoleErrors.push(msg.text());
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

    expect(
      badStaticChunks,
      `Non-OK /_next/static responses: ${JSON.stringify(badStaticChunks)}`,
    ).toEqual([]);

    /** {@link MarketingHomeEmergencyFallback} uses a typographic apostrophe in “We’re”. */
    await expect(page.getByText(/updating the site right now/i)).toHaveCount(0);

    await expect(page.locator('[data-nn-home-safe-mode="1"]')).toHaveCount(0);
    await expect(page.getByRole("heading", { name: /^Just a moment$/i })).toHaveCount(0);

    const main = page.locator("main");
    await expect(main).toBeVisible({ timeout: 30_000 });

    const mainH1 = main.getByRole("heading", { level: 1 }).first();
    await expect(mainH1).toBeVisible({ timeout: 30_000 });
    await expect(mainH1).not.toHaveText(/^\s*$/);
    const heroHeadingText = (await mainH1.innerText()).trim();
    expect(heroHeadingText.length).toBeGreaterThan(0);
    /** Marketing home column should expose exactly one hero `<h1>` (no duplicated body). */
    await expect(page.locator("main h1")).toHaveCount(1);

    await page.waitForTimeout(2500);

    expect(
      badStaticChunks,
      `Non-OK /_next/static after hydration: ${JSON.stringify(badStaticChunks)}`,
    ).toEqual([]);

    await expect(page.locator('[data-nn-home-safe-mode="1"]')).toHaveCount(0);
    await expect(page.getByRole("heading", { name: /^Just a moment$/i })).toHaveCount(0);
    await expect(mainH1).toBeVisible();
    await expect(mainH1).toHaveText(heroHeadingText);
    await expect(page.locator("main h1")).toHaveCount(1);

    const fatal = pageErrors.filter((msg) => !PAGEERROR_ALLOWLIST.some((re) => re.test(msg)));
    expect(fatal, `Uncaught page errors: ${fatal.join(" | ")}`).toEqual([]);

    const fatalConsole = consoleErrors.filter((text) =>
      FATAL_CONSOLE_SUBSTRINGS.some((sub) => text.includes(sub)),
    );
    expect(
      fatalConsole,
      `Console errors (carousel/image/React): ${fatalConsole.join(" | ")}`,
    ).toEqual([]);
  });
});
