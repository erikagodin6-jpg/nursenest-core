/**
 * Production-build smoke: `/` must stay on real marketing content (no emergency error shell).
 *
 * Run after `npm run build && npm run start` with BASE_URL (default http://localhost:3000):
 *   npx playwright test tests/e2e/public/homepage-production-smoke.spec.ts --project=chromium
 *   npx playwright test tests/e2e/public/homepage-production-smoke.spec.ts --project=webkit
 *     (requires `npx playwright install webkit` and a `webkit` project in playwright.config.ts)
 *
 * To surface `[NN_MARKETING_CLIENT_ERROR]` JSON in the browser console from a **production**
 * build, rebuild with: `NEXT_PUBLIC_NN_MARKETING_CLIENT_ERROR_DEBUG=1 npm run build`
 */
import { expect, test } from "@playwright/test";

test.describe("Homepage production smoke", () => {
  test.use({ viewport: { width: 1280, height: 800 } });

  test("5s settle: no error shell; hero visible; diagnostics clean", async ({ page }) => {
    const pageErrors: string[] = [];
    const consoleErrors: string[] = [];
    /** Any log level — catches server-only / DATABASE_URL leaks that surface as warnings. */
    const clientBundleDbLeakHints: string[] = [];
    const failedRequests: { url: string; failure: string }[] = [];
    const badChunks: { url: string; status: number }[] = [];

    const recordDbLeakHint = (text: string) => {
      if (
        /DATABASE_URL|PrismaClient|cannot be imported from a Client Component|server-only package/i.test(text)
      ) {
        clientBundleDbLeakHints.push(text);
      }
    };

    page.on("pageerror", (err) => {
      const m = err?.message ?? String(err);
      pageErrors.push(m);
      recordDbLeakHint(m);
    });
    page.on("console", (msg) => {
      const text = msg.text();
      recordDbLeakHint(text);
      if (msg.type() === "error") consoleErrors.push(text);
    });
    page.on("requestfailed", (req) => {
      failedRequests.push({ url: req.url(), failure: req.failure()?.errorText ?? "unknown" });
    });
    page.on("response", (res) => {
      const url = res.url();
      if (!url.includes("/_next/static/")) return;
      const status = res.status();
      if (status !== 200 && status !== 304) {
        badChunks.push({ url, status });
      }
    });

    await page.goto("/", { waitUntil: "load", timeout: 120_000 });

    expect(badChunks, `Bad static chunks: ${JSON.stringify(badChunks)}`).toEqual([]);

    await page.waitForTimeout(5000);

    await expect(page.getByRole("heading", { name: /^Just a moment$/i })).toHaveCount(0);
    await expect(page.getByText(/temporary hiccup/i)).toHaveCount(0);
    await expect(page.getByRole("link", { name: /Browse exam pathways/i })).toHaveCount(0);

    await expect(page.locator('[data-nn-home-safe-mode="1"]')).toHaveCount(0);

    const main = page.locator("main");
    await expect(main).toBeVisible();
    const mainH1 = main.getByRole("heading", { level: 1 }).first();
    await expect(mainH1).toBeVisible();
    await expect(mainH1).not.toHaveText(/^\s*$/);

    const mainText = await main.innerText();
    expect(mainText.toLowerCase()).not.toContain("placeholder");
    expect(mainText).not.toMatch(/\bHeadline Premium\b|\bSubheading Premium\b|\bDashboard Cta\b|\bReadiness Label\b/i);
    expect(mainText).not.toMatch(/pages\.home\.[a-z0-9_.]+/i);

    const fatalPage = pageErrors.filter(Boolean);
    expect(fatalPage, `pageerror: ${fatalPage.join(" | ")}`).toEqual([]);

    const nextImageSrcErrors = consoleErrors.filter(
      (t) => /invalid src prop|failed to parse src|empty string/i.test(t) && /next\/image|Image/i.test(t),
    );
    expect(
      nextImageSrcErrors,
      `next/image invalid src: ${nextImageSrcErrors.join(" | ")}`,
    ).toEqual([]);

    await expect(page.getByTestId("section-premium-pathway-showcase")).toBeVisible();
    await expect(page.getByTestId("section-premium-study-ecosystem")).toBeVisible();
    await expect(page.getByTestId("section-premium-readiness-preview")).toBeVisible();
    await expect(page.getByTestId("section-premium-homepage-final-cta")).toBeVisible();

    expect(
      clientBundleDbLeakHints,
      `client bundle must not log DB/server-only leaks: ${clientBundleDbLeakHints.join(" | ")}`,
    ).toEqual([]);

    const hydrationNoise = /hydration|did not match/i;
    const fatalConsole = consoleErrors.filter(
      (t) => !hydrationNoise.test(t) && t.includes("Minified React error"),
    );
    expect(fatalConsole, `console error: ${fatalConsole.join(" | ")}`).toEqual([]);

    const chunkFailed = failedRequests.filter((f) => f.url.includes("/_next/static/"));
    expect(chunkFailed, `chunk requestfailed: ${JSON.stringify(chunkFailed)}`).toEqual([]);
  });
});
