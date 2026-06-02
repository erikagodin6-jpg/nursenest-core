import { expect, test } from "@playwright/test";

/**
 * Proof gate for CAT / adaptive practice runtime: document must not exceed the viewport.
 *
 * Run locally after signing in and copying a live session URL:
 *   E2E_CAT_PRACTICE_TEST_URL="http://localhost:3000/app/practice-tests/<id>" npx playwright test tests/e2e/cat/cat-focused-practice-session-viewport.spec.ts --project=chromium
 */
const sessionUrl = process.env.E2E_CAT_PRACTICE_TEST_URL?.trim();

test.describe("Focused practice session viewport (optional env)", () => {
  test("document scrollHeight fits in innerHeight at laptop viewport", async ({ page }) => {
    test.skip(!sessionUrl, "Set E2E_CAT_PRACTICE_TEST_URL to a running adaptive CAT session (e.g. localhost + id).");

    await page.setViewportSize({ width: 1366, height: 768 });
    await page.goto(sessionUrl!, { waitUntil: "domcontentloaded", timeout: 120_000 });

    const metrics = await page.evaluate(() => {
      const el = document.documentElement;
      const session = document.querySelector(".nn-practice-session");
      const shell = document.querySelector(".nn-cat-adaptive-exam-session");
      const rSession = session?.getBoundingClientRect();
      const rShell = shell?.getBoundingClientRect();
      return {
        scrollHeight: el.scrollHeight,
        clientHeight: el.clientHeight,
        innerHeight: window.innerHeight,
        sessionBottom: rSession != null ? rSession.bottom : null,
        shellBottom: rShell != null ? rShell.bottom : null,
      };
    });

    expect(
      metrics.scrollHeight,
      `document scrollHeight ${metrics.scrollHeight} should be <= innerHeight ${metrics.innerHeight} (clientHeight ${metrics.clientHeight}); sessionBottom=${metrics.sessionBottom} shellBottom=${metrics.shellBottom}`,
    ).toBeLessThanOrEqual(metrics.innerHeight + 1);

    await page.screenshot({
      path: "test-results/cat-focused-session-viewport-1366x768.png",
      fullPage: true,
    });
  });
});
