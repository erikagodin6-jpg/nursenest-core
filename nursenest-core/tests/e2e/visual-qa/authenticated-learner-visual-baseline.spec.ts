/**
 * Authenticated learner PNG baselines (Ocean / Blossom / Midnight + desktop + one mobile).
 *
 * Requires the same paid credentials + storage as `setup-visual-qa-auth` (see `docs/visual-qa.md`).
 * Prerequisite data: run `npm run seed:auth-qa` against the same DB as `DATABASE_URL` for weak areas,
 * flashcard deck `nn-auth-qa-e2e-deck`, and graded session aggregates.
 *
 * First capture:
 *   npx playwright test -c playwright.visual-qa.config.ts --project=visual-qa-authenticated-baseline --update-snapshots
 */
import { existsSync, mkdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { expect, test, type Page } from "@playwright/test";
import { VISUAL_QA_LEARNER_AUTH_FILE } from "../helpers/auth-state-paths";
import { PAID_E2E_DEFAULT_PATHWAY_ID, learnerAppMainLandmark } from "../helpers/paid-learner-shell";

const THEME_KEY = "nursenest-theme";
const pid = PAID_E2E_DEFAULT_PATHWAY_ID;

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "..", "..", "..");
const outDir = path.join(repoRoot, "docs", "screenshots", "authenticated-qa-matrix");

async function settleLearner(page: Page): Promise<void> {
  await expect(learnerAppMainLandmark(page)).toBeVisible({ timeout: 120_000 });
  await page.waitForLoadState("networkidle", { timeout: 90_000 }).catch(() => {});
  await page.evaluate(() => document.fonts.ready).catch(() => {});
}

async function applyTheme(page: Page, theme: string): Promise<void> {
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
}

test.beforeAll(({}, testInfo) => {
  mkdirSync(outDir, { recursive: true });
  if (!existsSync(VISUAL_QA_LEARNER_AUTH_FILE)) {
    testInfo.skip(true, `Missing ${VISUAL_QA_LEARNER_AUTH_FILE} — run npm run visual-qa:auth (requires E2E_PAID_* or QA_PAID_*).`);
  }
});

test.describe("Authenticated learner visual baseline", () => {
  test.use({ reducedMotion: "reduce" });

  for (const theme of ["ocean", "blossom", "midnight"] as const) {
    test(`dashboard /app — ${theme} — desktop`, async ({ page, baseURL }) => {
      const origin = baseURL?.replace(/\/$/, "") ?? "http://127.0.0.1:3000";
      await page.goto(`${origin}/app`, { waitUntil: "domcontentloaded", timeout: 120_000 });
      await applyTheme(page, theme);
      await settleLearner(page);

      await expect(page).toHaveScreenshot(path.join(outDir, `auth-dashboard-${theme}-desktop.png`), {
        animations: "disabled",
        maxDiffPixelRatio: 0.05,
        timeout: 90_000,
      });
    });

    test(`practice hub — ${theme} — desktop`, async ({ page, baseURL }) => {
      const origin = baseURL?.replace(/\/$/, "") ?? "http://127.0.0.1:3000";
      const url = `${origin}/app/practice-tests?pathwayId=${encodeURIComponent(pid)}`;
      await page.goto(url, { waitUntil: "domcontentloaded", timeout: 120_000 });
      await applyTheme(page, theme);
      await settleLearner(page);

      await expect(page).toHaveScreenshot(path.join(outDir, `auth-practice-hub-${theme}-desktop.png`), {
        animations: "disabled",
        maxDiffPixelRatio: 0.05,
        timeout: 90_000,
      });
    });

    test(`flashcards hub — ${theme} — desktop`, async ({ page, baseURL }) => {
      const origin = baseURL?.replace(/\/$/, "") ?? "http://127.0.0.1:3000";
      const url = `${origin}/app/flashcards?pathwayId=${encodeURIComponent(pid)}`;
      await page.goto(url, { waitUntil: "domcontentloaded", timeout: 120_000 });
      await applyTheme(page, theme);
      await settleLearner(page);

      await expect(page).toHaveScreenshot(path.join(outDir, `auth-flashcards-${theme}-desktop.png`), {
        animations: "disabled",
        maxDiffPixelRatio: 0.05,
        timeout: 90_000,
      });
    });
  }

  test("dashboard /app — ocean — mobile", async ({ page, baseURL }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    const origin = baseURL?.replace(/\/$/, "") ?? "http://127.0.0.1:3000";
    await page.goto(`${origin}/app`, { waitUntil: "domcontentloaded", timeout: 120_000 });
    await applyTheme(page, "ocean");
    await settleLearner(page);

    await expect(page).toHaveScreenshot(path.join(outDir, "auth-dashboard-ocean-mobile.png"), {
      animations: "disabled",
      maxDiffPixelRatio: 0.06,
      timeout: 90_000,
    });
  });
});
