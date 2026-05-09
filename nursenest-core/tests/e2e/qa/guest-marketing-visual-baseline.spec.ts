/**
 * Guest-only visual baselines for marketing shell (no paid auth).
 *
 * First-time baseline:
 *   npx playwright test -c playwright.visual-qa.config.ts --project=visual-qa-guest-baseline --update-snapshots
 *
 * PNGs: git-root `docs/screenshots/visual-regression-baseline/` via `snapshotPathTemplate` on project
 * `visual-qa-guest-baseline` in `playwright.visual-qa.config.ts`. Root `.gitignore` ignores `*.png` there.
 */
import { mkdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { expect, test, type Page } from "@playwright/test";

const THEME_KEY = "nursenest-theme";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "..", "..", "..");
const baselineDir = path.join(repoRoot, "docs", "screenshots", "visual-regression-baseline");

/** Matches `snapshotPathTemplate` `{arg}` — keep basename-only (no dirs). */
function guestBaselineName(theme: string, viewport: "desktop" | "mobile"): string {
  if (viewport === "mobile") return "guest-home-ocean-mobile.png";
  return `guest-home-${theme}-desktop.png`;
}

async function settleMarketingHome(page: Page): Promise<void> {
  await page.waitForLoadState("domcontentloaded");
  await page.waitForLoadState("networkidle", { timeout: 60_000 }).catch(() => {});
  await page.evaluate(() => document.fonts.ready).catch(() => {});
  await page
    .evaluate(() =>
      Promise.all(
        [...document.images]
          .filter((img) => !img.complete)
          .map(
            (img) =>
              new Promise<void>((resolve) => {
                img.addEventListener("load", () => resolve(), { once: true });
                img.addEventListener("error", () => resolve(), { once: true });
              }),
          ),
      ),
    )
    .catch(() => {});
}

test.beforeAll(() => {
  mkdirSync(baselineDir, { recursive: true });
});

test.describe("Guest marketing visual baseline", () => {
  test.use({ reducedMotion: "reduce" });

  for (const theme of ["ocean", "blossom", "midnight"] as const) {
    test(`homepage — ${theme} — desktop`, async ({ page, baseURL }) => {
      const origin = baseURL?.replace(/\/$/, "") ?? "http://127.0.0.1:3000";
      await page.goto(`${origin}/`, { waitUntil: "domcontentloaded", timeout: 120_000 });
      await page.evaluate(
        ({ key, id }) => {
          try {
            localStorage.setItem(key, id);
          } catch {
            /* ignore */
          }
        },
        { key: THEME_KEY, id: theme },
      );
      await page.reload({ waitUntil: "domcontentloaded" });
      await settleMarketingHome(page);

      await expect(page).toHaveScreenshot(guestBaselineName(theme, "desktop"), {
        animations: "disabled",
        maxDiffPixelRatio: 0.04,
        timeout: 60_000,
      });
    });
  }

  test("homepage — ocean — mobile", async ({ page, baseURL }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    const origin = baseURL?.replace(/\/$/, "") ?? "http://127.0.0.1:3000";
    await page.goto(`${origin}/`, { waitUntil: "domcontentloaded", timeout: 120_000 });
    await page.evaluate(
      ({ key, id }) => {
        try {
          localStorage.setItem(key, id);
        } catch {
          /* ignore */
        }
      },
      { key: THEME_KEY, id: "ocean" },
    );
    await page.reload({ waitUntil: "domcontentloaded" });
    await settleMarketingHome(page);

    await expect(page).toHaveScreenshot(guestBaselineName("ocean", "mobile"), {
      animations: "disabled",
      maxDiffPixelRatio: 0.05,
      timeout: 60_000,
    });
  });
});
