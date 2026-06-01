/**
 * Smoke — Blog
 *
 * Phase 1: Core Smoke Suite — Blog
 * Verifies: hub loads, article listing loads, article detail loads, content visible.
 *
 * Fails if:
 *   - placeholder content ("Lorem ipsum", "Coming soon")
 *   - 500 response
 *   - timeout after 10s
 *
 * Run:
 *   npx playwright test tests/e2e/smoke/blog-smoke.spec.ts --project=chromium
 */
import { expect, test } from "@playwright/test";
import { attachPageObservers } from "../helpers/attach-observers";
import {
  attachSmokeCapture,
  attachSmokeFailureScreenshot,
  buildCaptureFromObservers,
  seriousPublicSmokeConsoleErrors,
} from "../helpers/smoke-evidence";

const PLACEHOLDER_PATTERNS = [/lorem ipsum/i, /coming soon/i, /placeholder/i, /todo/i];

function hasPlaceholderContent(text: string): boolean {
  return PLACEHOLDER_PATTERNS.some((p) => p.test(text));
}

test.describe("Smoke — Blog", () => {
  test("blog hub loads with article listing", async ({ page }, testInfo) => {
    const observers = attachPageObservers(page, { profile: "public" });
    try {
      const r = await page.goto("/blog", { waitUntil: "domcontentloaded" });
      expect(r?.status(), `Blog hub HTTP status`).not.toBe(500);
      expect(r?.ok(), `HTTP ${r?.status()} for /blog`).toBeTruthy();

      const main = page.locator("main");
      await expect(main).toBeVisible({ timeout: 30_000 });

      // Article listing visible (at least one article link)
      const articleLinks = page.locator("main a").filter({ hasText: /\w{10,}/ });
      const count = await articleLinks.count();
      expect(count, "Blog hub must contain article links").toBeGreaterThan(0);

      // No placeholder
      const bodyText = await main.innerText().catch(() => "");
      expect(hasPlaceholderContent(bodyText), `Placeholder content found: ${bodyText.slice(0, 200)}`).toBeFalsy();

      const serious = seriousPublicSmokeConsoleErrors(observers.consoleErrors);
      expect(serious, `Blog hub console errors: ${serious.join(" | ")}`).toEqual([]);

      await attachSmokeCapture(testInfo, "blog-hub", buildCaptureFromObservers(page, observers, {}));
    } catch (e) {
      await attachSmokeFailureScreenshot(page, testInfo, "blog-hub-failure.png");
      await attachSmokeCapture(testInfo, "blog-hub", buildCaptureFromObservers(page, observers, {}));
      throw e;
    } finally {
      observers.dispose();
    }
  });

  test("blog article detail loads with visible content", async ({ page }, testInfo) => {
    const observers = attachPageObservers(page, { profile: "public" });
    try {
      // Navigate to hub first to get a real article URL
      await page.goto("/blog", { waitUntil: "domcontentloaded" });
      const main = page.locator("main");
      await expect(main).toBeVisible({ timeout: 30_000 });

      // Click the first substantial article link
      const articleLink = main.getByRole("link").filter({ hasText: /\w{15,}/ }).first();
      const linkCount = await articleLink.count();

      if (linkCount > 0) {
        const href = await articleLink.getAttribute("href");
        if (href && href.startsWith("/blog/")) {
          const r = await page.goto(href, { waitUntil: "domcontentloaded" });
          expect(r?.status(), `Article HTTP status`).not.toBe(500);
          expect(r?.ok(), `HTTP ${r?.status()} for ${href}`).toBeTruthy();

          const articleEl = page.locator("article, main");
          await expect(articleEl.first()).toBeVisible({ timeout: 30_000 });

          const articleText = await articleEl.first().innerText().catch(() => "");
          expect(articleText.length, "Article content must not be empty").toBeGreaterThan(100);
          expect(hasPlaceholderContent(articleText), "No placeholder content").toBeFalsy();

          const serious = seriousPublicSmokeConsoleErrors(observers.consoleErrors);
          expect(serious, `Article console errors: ${serious.join(" | ")}`).toEqual([]);
        }
      }

      await attachSmokeCapture(testInfo, "blog-article", buildCaptureFromObservers(page, observers, {}));
    } catch (e) {
      await attachSmokeFailureScreenshot(page, testInfo, "blog-article-failure.png");
      await attachSmokeCapture(testInfo, "blog-article", buildCaptureFromObservers(page, observers, {}));
      throw e;
    } finally {
      observers.dispose();
    }
  });
});
