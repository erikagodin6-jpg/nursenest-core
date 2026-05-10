/**
 * Homepage desktop: post-hydration stability, no console errors, and static JS chunks are not HTML.
 *
 *   npx playwright test tests/e2e/public/homepage-desktop-performance-smoke.spec.ts --project=chromium
 *
 * Requires Playwright-managed dev (localhost + do **not** set `PLAYWRIGHT_SKIP_WEB_SERVER=1`), or
 * `PLAYWRIGHT_SKIP_WEB_SERVER=1` with an app already listening on `BASE_URL` / `PLAYWRIGHT_BASE_URL`.
 */
import { expect, test } from "@playwright/test";

const SELECTOR_DISMISSED_LS = "nn_selector_dismissed";

test.beforeEach(async ({ context }) => {
  await context.addInitScript((key: string) => {
    try {
      localStorage.setItem(key, "1");
    } catch {
      /* ignore */
    }
  }, SELECTOR_DISMISSED_LS);
});

test.describe("Homepage desktop performance smoke", () => {
  test.use({ viewport: { width: 1440, height: 900 } });

  test("stable after 5s, no console errors, static chunk not HTML", async ({ page }) => {
    const consoleErrors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") {
        consoleErrors.push(msg.text());
      }
    });

    await page.goto("/", { waitUntil: "load", timeout: 120_000 });
    await expect(page.locator('[data-testid="hero-section"], #home-conversion-hero-heading').first()).toBeVisible({
      timeout: 60_000,
    });

    await page.waitForTimeout(5000);

    const clsScore = await page.evaluate(() => {
      let total = 0;
      for (const raw of performance.getEntriesByType("layout-shift")) {
        const e = raw as PerformanceEntry & { value?: number; hadRecentInput?: boolean };
        if (!e.hadRecentInput && typeof e.value === "number") {
          total += e.value;
        }
      }
      return total;
    });

    expect(
      clsScore,
      `cumulative layout-shift (no user input) should stay low after 5s; got ${clsScore}`,
    ).toBeLessThan(0.2);

    expect(consoleErrors, `unexpected console errors:\n${consoleErrors.join("\n")}`).toEqual([]);

    const staticScriptHref = await page.evaluate(() => {
      const scripts = Array.from(document.querySelectorAll("script[src]")) as HTMLScriptElement[];
      const hit = scripts.find((s) => /\/_next\/static\//.test(s.src));
      return hit?.src ?? "";
    });
    expect(staticScriptHref, "expected at least one /_next/static/ script on homepage").toMatch(/\/_next\/static\//);

    const res = await page.request.get(staticScriptHref);
    expect(res.ok(), `chunk fetch failed ${res.status()}`).toBe(true);
    const ct = (res.headers()["content-type"] ?? "").toLowerCase();
    expect(ct, `expected JS content-type for ${staticScriptHref}, got ${ct}`).toMatch(/javascript|ecmascript/);
  });
});
