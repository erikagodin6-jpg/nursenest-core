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

    await page.addInitScript(() => {
      (window as unknown as { __nnCumulativeLayoutShift: number }).__nnCumulativeLayoutShift = 0;
      try {
        const observer = new PerformanceObserver((list) => {
          for (const raw of list.getEntries()) {
            const entry = raw as PerformanceEntry & { value?: number; hadRecentInput?: boolean };
            if (!entry.hadRecentInput && typeof entry.value === "number") {
              (window as unknown as { __nnCumulativeLayoutShift: number }).__nnCumulativeLayoutShift += entry.value;
            }
          }
        });
        observer.observe({ type: "layout-shift", buffered: true });
      } catch {
        /* Layout Instability API may be unavailable in some browsers. */
      }
    });

    await page.goto("/", { waitUntil: "load", timeout: 120_000 });
    await expect(page.locator('[data-testid="hero-section"], #home-conversion-hero-heading').first()).toBeVisible({
      timeout: 60_000,
    });

    await page.waitForTimeout(5000);

    const clsScore = await page.evaluate(() =>
      Number((window as unknown as { __nnCumulativeLayoutShift?: number }).__nnCumulativeLayoutShift ?? 0),
    );

    expect(
      clsScore,
      `cumulative layout-shift (no user input) should stay low after 5s; got ${clsScore}`,
    ).toBeLessThan(0.1);

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
