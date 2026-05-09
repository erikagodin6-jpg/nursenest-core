/**
 * Premium homepage ECG governance: regression checks + optional screenshot baselines.
 *
 * Baselines (PNG) are written only when `UPDATE_ECG_GOVERNANCE_SCREENSHOTS=1`.
 * Storage: repo-root `reports/ui-redesign-preview/homepage-ecg-governance/` (see README there).
 *
 * Prereq: dev server on BASE_URL (default http://127.0.0.1:3000), e.g.
 *   NN_SKIP_DEV_AUTH_SECRET=1 npm run dev:next
 */
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { expect, test } from "@playwright/test";

/** Governance baselines target Chromium for reproducible PNGs; full suite may include WebKit projects. */
test.beforeEach(({ browserName }) => {
  test.skip(browserName !== "chromium", "homepage ECG governance: chromium-only");
});

/** Matches `THEME_STORAGE_KEY` in theme-registry (avoid importing app path aliases in Playwright). */
const THEME_STORAGE_KEY = "nursenest-theme";

const CAPTURE = process.env.UPDATE_ECG_GOVERNANCE_SCREENSHOTS === "1";

/** Repo root `reports/…` — cwd is `nursenest-core/` package dir. */
function governanceRoot(): string {
  return path.join(process.cwd(), "..", "reports", "ui-redesign-preview", "homepage-ecg-governance");
}

async function ensureDir(filePath: string) {
  await mkdir(path.dirname(filePath), { recursive: true });
}

const THEMES_SNAPSHOT = ["ocean", "midnight", "sage-garden", "blossom"] as const;

test.describe("Homepage ECG visual governance", () => {
  test.describe.configure({ mode: "serial" });

  test("section order and safe-mode: ECG between Study Ecosystem and Readiness", async ({ page }) => {
    await page.goto("/", { waitUntil: "load", timeout: 120_000 });

    await expect(page.locator('[data-nn-home-safe-mode="1"]')).toHaveCount(0);
    await expect(page.getByText(/updating the site right now/i)).toHaveCount(0);

    const study = page.getByTestId("section-premium-study-ecosystem");
    const ecg = page.getByTestId("section-premium-home-ecg");
    const readiness = page.getByTestId("section-premium-readiness-preview");

    await expect(study).toBeVisible({ timeout: 60_000 });
    await expect(ecg).toBeVisible({ timeout: 60_000 });
    await expect(readiness).toBeVisible({ timeout: 60_000 });

    const yStudy = await study.evaluate((el) => el.getBoundingClientRect().top);
    const yEcg = await ecg.evaluate((el) => el.getBoundingClientRect().top);
    const yReady = await readiness.evaluate((el) => el.getBoundingClientRect().top);

    expect(yStudy, "study ecosystem top").toBeLessThan(yEcg);
    expect(yEcg, "ecg top").toBeLessThan(yReady);
  });

  test("logged-out ECG CTAs are public hubs only (no gated /modules/ecg)", async ({ page }) => {
    await page.goto("/", { waitUntil: "load", timeout: 120_000 });

    const lessons = page.getByTestId("premium-ecg-core-lessons");
    const questions = page.getByTestId("premium-ecg-core-questions");
    const pricing = page.getByTestId("premium-ecg-advanced-pricing");

    await expect(lessons).toBeVisible({ timeout: 60_000 });
    const h1 = (await lessons.getAttribute("href")) ?? "";
    const h2 = (await questions.getAttribute("href")) ?? "";
    const h3 = (await pricing.getAttribute("href")) ?? "";

    expect(h1, "lessons href").not.toMatch(/\/modules\/ecg/i);
    expect(h2, "questions href").not.toMatch(/\/modules\/ecg/i);
    expect(h1 + h2).toMatch(/^\//); // relative marketing paths
    expect(h3).toMatch(/pricing|subscribe|plans/i);
  });

  test("ECG telemetry strip and advanced card have non-zero layout (no collapsed visibility)", async ({ page }) => {
    await page.goto("/", { waitUntil: "load", timeout: 120_000 });
    const stripBox = page.locator(".nn-premium-home-section--ecg .nn-premium-hero-ecg").first();
    await expect(stripBox).toBeVisible({ timeout: 60_000 });
    const sb = await stripBox.boundingBox();
    expect(sb?.height ?? 0).toBeGreaterThan(40);

    const advanced = page.getByTestId("premium-ecg-advanced-teaser");
    await expect(advanced).toBeVisible();
    const ab = await advanced.boundingBox();
    expect(ab?.height ?? 0).toBeGreaterThan(120);
  });

  test("mobile stack: no horizontal overflow at 390×844", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/", { waitUntil: "load", timeout: 120_000 });
    await page.getByTestId("section-premium-home-ecg").scrollIntoViewIfNeeded();
    await page.waitForTimeout(400);

    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow).toBeLessThanOrEqual(1);
  });
});

test.describe("Homepage ECG screenshot baselines (optional)", () => {
  test.describe.configure({ mode: "serial" });

  for (const themeId of THEMES_SNAPSHOT) {
    test(`capture theme=${themeId} desktop + mobile`, async ({ browser }) => {
      test.skip(!CAPTURE, "set UPDATE_ECG_GOVERNANCE_SCREENSHOTS=1 to write PNG baselines");

      const context = await browser.newContext({
        viewport: { width: 1440, height: 900 },
      });
      await context.addInitScript(
        ([key, id]: [string, string]) => {
          try {
            localStorage.setItem(key, id);
          } catch {
            /* ignore */
          }
        },
        [THEME_STORAGE_KEY, themeId] as [string, string],
      );

      const page = await context.newPage();
      await page.goto("/", { waitUntil: "load", timeout: 120_000 });
      await page.waitForTimeout(600);

      const root = governanceRoot();
      const fullDesktop = path.join(root, "desktop", "full-page", `home-${themeId}-1440.png`);
      await ensureDir(fullDesktop);
      await page.screenshot({ path: fullDesktop, fullPage: true });

      const ecgSection = path.join(root, "desktop", "section-isolated", `ecg-section-${themeId}.png`);
      await ensureDir(ecgSection);
      await page.getByTestId("section-premium-home-ecg").screenshot({ path: ecgSection });

      await page.getByTestId("section-premium-home-ecg").scrollIntoViewIfNeeded({ block: "center" });
      await page.waitForTimeout(300);
      const inCtx = path.join(root, "desktop", "in-context", `ecg-centered-viewport-${themeId}.png`);
      await ensureDir(inCtx);
      await page.screenshot({ path: inCtx, fullPage: false });

      const advancedOnly = path.join(root, "desktop", "section-isolated", `advanced-teaser-${themeId}.png`);
      await ensureDir(advancedOnly);
      await page.getByTestId("premium-ecg-advanced-teaser").screenshot({ path: advancedOnly });

      await context.close();

      const ctxMobile = await browser.newContext({
        viewport: { width: 390, height: 844 },
      });
      await ctxMobile.addInitScript(
        ([key, id]: [string, string]) => {
          try {
            localStorage.setItem(key, id);
          } catch {
            /* ignore */
          }
        },
        [THEME_STORAGE_KEY, themeId] as [string, string],
      );
      const mPage = await ctxMobile.newPage();
      await mPage.goto("/", { waitUntil: "load", timeout: 120_000 });
      await mPage.waitForTimeout(500);
      await mPage.getByTestId("section-premium-home-ecg").scrollIntoViewIfNeeded();
      await mPage.waitForTimeout(400);

      const mobFull = path.join(root, "mobile", "full-page", `home-${themeId}-390.png`);
      await ensureDir(mobFull);
      await mPage.screenshot({ path: mobFull, fullPage: true });

      const mobEcg = path.join(root, "mobile", "section-isolated", `ecg-section-${themeId}.png`);
      await ensureDir(mobEcg);
      await mPage.getByTestId("section-premium-home-ecg").screenshot({ path: mobEcg });

      await ctxMobile.close();
    });
  }

  test("write inventory manifest when capturing", async () => {
    test.skip(!CAPTURE);
    const root = governanceRoot();
    const manifest = {
      generatedAt: new Date().toISOString(),
      baseURL: process.env.BASE_URL ?? "http://127.0.0.1:3000",
      themes: [...THEMES_SNAPSHOT],
      viewports: {
        desktop: "1440×900",
        mobile: "390×844",
      },
      folders: ["desktop/full-page", "desktop/section-isolated", "desktop/in-context", "mobile/full-page", "mobile/section-isolated"],
    };
    await mkdir(root, { recursive: true });
    await writeFile(path.join(root, "manifest.json"), `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
  });
});
