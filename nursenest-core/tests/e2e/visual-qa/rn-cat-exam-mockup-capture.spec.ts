/**
 * RN CAT exam mockup PNGs — real learner chrome (header/nav/logo), Ocean / Blossom / Midnight.
 *
 * Output: <repo>/reports/screenshots/rn-cat-exam-mockups-2026/
 *
 * Prerequisite:
 *   npm run visual-qa:auth
 *   npm run dev:next:3000   (or PLAYWRIGHT_SKIP_WEB_SERVER=1 with app already up)
 *
 * Run:
 *   npx playwright test -c playwright.aesthetic-audit.config.ts --project=aesthetic-audit \
 *     tests/e2e/visual-qa/rn-cat-exam-mockup-capture.spec.ts
 */
import { existsSync, mkdirSync } from "node:fs";
import path from "node:path";
import { expect, test, type Page } from "@playwright/test";
import {
  AESTHETIC_THEMES,
  applyLearnerTheme,
  assertHtmlTheme,
  type AestheticThemeId,
  VIEWPORTS,
} from "../helpers/aesthetic-audit-shared";
import { stabilizePageForCapture } from "../helpers/aesthetic-stabilization";
import { PAID_USER_AUTH_FILE, VISUAL_QA_LEARNER_AUTH_FILE } from "../helpers/auth-state-paths";

const AUTH_STORAGE = existsSync(VISUAL_QA_LEARNER_AUTH_FILE)
  ? VISUAL_QA_LEARNER_AUTH_FILE
  : PAID_USER_AUTH_FILE;
import { clickBeginExamAfterPracticeHubStart } from "../helpers/cat-practice-exam-flow";
import {
  catPositiveBowtieQuestion,
  catPositiveMcqQuestion,
  catPositiveSataQuestion,
  CAT_POSITIVE_FIXTURE_STEMS,
} from "../helpers/cat-positive-question-fixtures";
import { PAID_E2E_DEFAULT_PATHWAY_ID, learnerAppMainLandmark } from "../helpers/paid-learner-shell";

/** Playwright cwd is `nursenest-core/`; repo root is one level up. */
const REPO_ROOT = path.resolve(process.cwd(), "..");
const OUT = path.join(REPO_ROOT, "reports", "screenshots", "rn-cat-exam-mockups-2026");

const THEMES: AestheticThemeId[] = ["ocean", "blossom", "midnight"];
const pid = PAID_E2E_DEFAULT_PATHWAY_ID;

function outPath(slug: string, theme: AestheticThemeId, vp: "desktop" | "mobile"): string {
  return path.join(OUT, `${slug}--${theme}--${vp}.png`);
}

/** Apply theme without reload (exam session must stay mounted). */
async function applyThemeInPlace(page: Page, theme: AestheticThemeId): Promise<void> {
  await page.evaluate(
    ({ key, id }) => {
      try {
        localStorage.setItem(key, id);
      } catch {
        /* ignore */
      }
      document.documentElement.setAttribute("data-theme", id);
    },
    { key: "nursenest-theme", id: theme },
  );
  await page.waitForTimeout(200);
}

async function settle(page: Page, withLearnerShell: boolean): Promise<void> {
  await page.waitForLoadState("domcontentloaded");
  if (withLearnerShell) {
    await learnerAppMainLandmark(page).waitFor({ state: "visible", timeout: 120_000 });
  }
  await page.evaluate(() => document.fonts.ready).catch(() => {});
  await stabilizePageForCapture(page);
}

async function capture(
  page: Page,
  filePath: string,
  selector?: string,
): Promise<void> {
  const target = selector ? page.locator(selector).first() : page;
  await expect(target).toBeVisible({ timeout: 120_000 });
  await target.screenshot({ path: filePath, animations: "disabled", timeout: 90_000 });
}

async function installQuestionPatch(
  page: Page,
  factory: () => Record<string, unknown>,
): Promise<void> {
  await page.route("**/api/practice-tests/*/question*", async (route) => {
    const req = route.request();
    if (req.method() !== "GET") {
      await route.continue();
      return;
    }
    const res = await route.fetch();
    let body: { index?: number; question?: Record<string, unknown> };
    try {
      body = (await res.json()) as { index?: number; question?: Record<string, unknown> };
    } catch {
      await route.fulfill({ response: res });
      return;
    }
    if (body.question && typeof body.index === "number" && body.index === 0) {
      body.question = { ...factory(), ...body.question };
    }
    await route.fulfill({
      status: res.status(),
      headers: res.headers(),
      body: JSON.stringify(body),
    });
  });
}

async function startCatExam(page: Page, origin: string, theme?: AestheticThemeId): Promise<void> {
  await page.goto(
    `${origin}/app/practice-tests?cat=1&pathwayId=${encodeURIComponent(pid)}`,
    { waitUntil: "domcontentloaded", timeout: 180_000 },
  );
  if (theme) {
    await applyLearnerTheme(page, theme);
    await assertHtmlTheme(page, theme);
  }
  await settle(page, true);
  await expect(page.locator("[data-nn-qa-practice-hub-start-test]")).toBeVisible({ timeout: 60_000 });
  await page.locator("[data-nn-qa-practice-hub-start-test]").click();
  await clickBeginExamAfterPracticeHubStart(page);
  await page.waitForURL(/\/app\/practice-tests\/[a-zA-Z0-9_-]+/, { timeout: 120_000 });
  await expect(page.locator("[data-cat-exam-root]")).toBeVisible({ timeout: 120_000 });
  if (theme) await applyThemeInPlace(page, theme);
  await settle(page, false);
}

if (existsSync(AUTH_STORAGE)) {
  test.use({ storageState: AUTH_STORAGE });
}

test.beforeAll(({}, testInfo) => {
  mkdirSync(OUT, { recursive: true });
  if (!existsSync(AUTH_STORAGE)) {
    testInfo.skip(true, `Missing auth storage — run paid auth setup (see docs/visual-qa.md)`);
  }
});

test.describe("RN CAT exam mockup PNG capture", () => {
  test.use({ reducedMotion: "reduce" });

  for (const theme of THEMES) {
    for (const vp of ["desktop", "mobile"] as const) {
      test(`CAT hub — ${theme} — ${vp}`, async ({ page, baseURL }) => {
        const origin = (baseURL ?? "http://127.0.0.1:3000").replace(/\/$/, "");
        await page.setViewportSize(VIEWPORTS[vp]);
        await page.goto(
          `${origin}/app/practice-tests?cat=1&pathwayId=${encodeURIComponent(pid)}`,
          { waitUntil: "domcontentloaded", timeout: 180_000 },
        );
        if (page.url().includes("/login")) test.skip(true, "Auth expired — re-run visual-qa:auth");
        await applyLearnerTheme(page, theme);
        await assertHtmlTheme(page, theme);
        await settle(page, true);
        await capture(page, outPath("01-cat-hub", theme, vp));
      });

      test(`CAT launch — ${theme} — ${vp}`, async ({ page, baseURL }) => {
        const origin = (baseURL ?? "http://127.0.0.1:3000").replace(/\/$/, "");
        await page.setViewportSize(VIEWPORTS[vp]);
        await page.goto(
          `${origin}/app/practice-tests/cat-launch?pathwayId=${encodeURIComponent(pid)}`,
          { waitUntil: "domcontentloaded", timeout: 180_000 },
        );
        if (page.url().includes("/login")) test.skip(true, "Auth expired");
        await applyLearnerTheme(page, theme);
        await assertHtmlTheme(page, theme);
        await settle(page, true);
        await capture(page, outPath("02-cat-launch", theme, vp));
      });
    }
  }

  for (const theme of THEMES) {
    test(`exam MCQ — ${theme} — desktop`, async ({ page, baseURL }) => {
      const origin = (baseURL ?? "http://127.0.0.1:3000").replace(/\/$/, "");
      await page.setViewportSize(VIEWPORTS.desktop);
      await installQuestionPatch(page, catPositiveMcqQuestion);
      try {
        await startCatExam(page, origin, theme);
        await expect(
          page.locator(".nn-cat-question-stem").filter({ hasText: CAT_POSITIVE_FIXTURE_STEMS.mcq }),
        ).toBeVisible({ timeout: 60_000 });
        await assertHtmlTheme(page, theme);
        await capture(page, outPath("03-exam-mcq", theme, "desktop"), "[data-cat-exam-root]");
      } finally {
        await page.unroute("**/api/practice-tests/*/question*");
      }
    });

    test(`exam SATA — ${theme} — desktop`, async ({ page, baseURL }) => {
      const origin = (baseURL ?? "http://127.0.0.1:3000").replace(/\/$/, "");
      await page.setViewportSize(VIEWPORTS.desktop);
      await installQuestionPatch(page, catPositiveSataQuestion);
      try {
        await startCatExam(page, origin, theme);
        await expect(
          page.locator(".nn-cat-question-stem").filter({ hasText: CAT_POSITIVE_FIXTURE_STEMS.sata }),
        ).toBeVisible({ timeout: 60_000 });
        await assertHtmlTheme(page, theme);
        await capture(page, outPath("04-exam-sata", theme, "desktop"), "[data-cat-exam-root]");
      } finally {
        await page.unroute("**/api/practice-tests/*/question*");
      }
    });

    test(`exam Bowtie — ${theme} — desktop`, async ({ page, baseURL }) => {
      const origin = (baseURL ?? "http://127.0.0.1:3000").replace(/\/$/, "");
      await page.setViewportSize(VIEWPORTS.desktop);
      await installQuestionPatch(page, catPositiveBowtieQuestion);
      try {
        await startCatExam(page, origin, theme);
        await expect(
          page.locator(".nn-cat-question-stem").filter({ hasText: CAT_POSITIVE_FIXTURE_STEMS.bowtie }),
        ).toBeVisible({ timeout: 60_000 });
        await assertHtmlTheme(page, theme);
        await capture(page, outPath("05-exam-bowtie", theme, "desktop"), "[data-cat-exam-root]");
      } finally {
        await page.unroute("**/api/practice-tests/*/question*");
      }
    });
  }

  for (const theme of THEMES) {
    for (const vp of ["desktop", "mobile"] as const) {
      test(`practice hub (context) — ${theme} — ${vp}`, async ({ page, baseURL }) => {
        const origin = (baseURL ?? "http://127.0.0.1:3000").replace(/\/$/, "");
        await page.setViewportSize(VIEWPORTS[vp]);
        await page.goto(
          `${origin}/app/practice-tests?pathwayId=${encodeURIComponent(pid)}`,
          { waitUntil: "domcontentloaded", timeout: 180_000 },
        );
        if (page.url().includes("/login")) test.skip(true, "Auth expired");
        await applyLearnerTheme(page, theme);
        await assertHtmlTheme(page, theme);
        await settle(page, true);
        await capture(page, outPath("00-practice-hub", theme, vp));
      });
    }
  }
});
