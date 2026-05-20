/**
 * Premium convergence visual smoke — captures representative learner + marketing hub shells
 * at desktop + mobile viewports and ocean (light) + midnight (dark) themes.
 *
 * Screenshots: docs/screenshots/premium-convergence/*.png
 * (includes explicit learner-dashboard--*, learner-report-card--*, nursing-analytics--midnight)
 *
 * Run: npm run test:e2e:premium-convergence (from nursenest-core/)
 */
import * as fs from "node:fs";
import * as path from "node:path";
import { expect, test } from "@playwright/test";
import { loginWithCredentials } from "../helpers/learner-login";
import { expectNotPageNotFound, gotoExpectOk, requireOrigin, seedUsMarketingCookie } from "../helpers/navigation-e2e";
import {
  expectPaidLearnerShellReady,
  PAID_E2E_DEFAULT_PATHWAY_ID,
} from "../helpers/paid-learner-shell";
import { expectOnPaidSubscriberApp } from "../helpers/paid-surface-assertions";
import { getQaPaidCredentials } from "../helpers/smoke-credentials";
import { SEL_LEARNER_SHELL } from "../helpers/site-never-broken-contract";
import { clickBeginExamAfterPracticeHubStart } from "../helpers/cat-practice-exam-flow";

const OUT_DIR = path.join(process.cwd(), "docs", "screenshots", "premium-convergence");

const VIEWPORTS = [
  { tag: "desktop", width: 1280, height: 720 },
  { tag: "mobile", width: 390, height: 844 },
] as const;

const THEMES = ["ocean", "midnight"] as const;

async function ensureOutDir() {
  await fs.promises.mkdir(OUT_DIR, { recursive: true });
}

function slugifyRoute(route: string): string {
  return route.replace(/^\//, "").replace(/[^a-zA-Z0-9]+/g, "-").replace(/^-|-$/g, "") || "root";
}

async function applyTheme(page: import("@playwright/test").Page, theme: string) {
  await page.evaluate((t) => {
    document.documentElement.setAttribute("data-theme", t);
  }, theme);
}

test.describe("Premium convergence screenshots — guest marketing hubs", () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  for (const vp of VIEWPORTS) {
    for (const theme of THEMES) {
      test(`guest hubs ${vp.tag} ${theme}`, async ({ page, baseURL }) => {
        const origin = requireOrigin(baseURL);
        await ensureOutDir();
        await page.setViewportSize({ width: vp.width, height: vp.height });

        const routes = [
          "/us/rn/nclex-rn",
          "/allied/allied-health",
          "/pre-nursing",
        ] as const;

        for (const route of routes) {
          await seedUsMarketingCookie(page, origin);
          await gotoExpectOk(page, route);
          await expectNotPageNotFound(page);
          await applyTheme(page, theme);
          await page.waitForTimeout(400);

          const base = `guest-${slugifyRoute(route)}--${vp.tag}--${theme}`;
          await page.screenshot({
            path: path.join(OUT_DIR, `${base}.png`),
            fullPage: false,
          });
        }
      });
    }
  }
});

test.describe("Premium convergence screenshots — CAT licensing exam (in session)", () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  test("desktop ocean + midnight + mobile (+ bowtie when bank serves one)", async ({ page, baseURL }) => {
    const creds = getQaPaidCredentials();
    test.skip(!creds, "Set QA_PAID_EMAIL + QA_PAID_PASSWORD (or E2E_PAID_*)");

    const origin = requireOrigin(baseURL);
    await ensureOutDir();

    await loginWithCredentials(page, creds!.email, creds!.password);
    await expectOnPaidSubscriberApp(page);

    const pid = PAID_E2E_DEFAULT_PATHWAY_ID;
    await page.goto(`${origin}/app/practice-tests?cat=1&pathwayId=${encodeURIComponent(pid)}`, {
      waitUntil: "domcontentloaded",
    });
    await expectPaidLearnerShellReady(page, "CAT hub premium convergence");
    await expect(page.locator("[data-nn-qa-practice-hub-start-test]")).toBeVisible({ timeout: 60_000 });
    await page.locator("[data-nn-qa-practice-hub-start-test]").click();
    await clickBeginExamAfterPracticeHubStart(page);
    await page.waitForURL(/\/app\/practice-tests\/[a-zA-Z0-9_-]+/, { timeout: 120_000 });

    await expect(page.locator("[data-cat-exam-root]")).toBeVisible({ timeout: 120_000 });
    await expect(page.locator(".nn-cat-premium-convergence")).toBeVisible({ timeout: 120_000 });
    await expect(page.locator(".nn-question-session-rationale")).toHaveCount(0);

    await page.setViewportSize({ width: 1280, height: 720 });
    await applyTheme(page, "ocean");
    await page.waitForTimeout(400);
    await page.screenshot({
      path: path.join(OUT_DIR, "cat-exam-licensing--desktop--ocean.png"),
      fullPage: false,
    });

    await applyTheme(page, "midnight");
    await page.waitForTimeout(400);
    await page.screenshot({
      path: path.join(OUT_DIR, "cat-exam-licensing--desktop--midnight.png"),
      fullPage: false,
    });

    await page.setViewportSize({ width: 390, height: 844 });
    await applyTheme(page, "ocean");
    await page.waitForTimeout(400);
    await page.screenshot({
      path: path.join(OUT_DIR, "cat-exam-licensing--mobile--ocean.png"),
      fullPage: false,
    });

    const bowtie = page.locator(".bowtie-ngn");
    if ((await bowtie.count()) > 0) {
      await page.setViewportSize({ width: 1280, height: 720 });
      await applyTheme(page, "ocean");
      await bowtie.first().scrollIntoViewIfNeeded().catch(() => {});
      await page.waitForTimeout(300);
      await page.screenshot({
        path: path.join(OUT_DIR, "cat-exam-licensing--ngn-bowtie--desktop--ocean.png"),
        fullPage: false,
      });
    }
  });
});

test.describe("Premium convergence screenshots — practice exam hub (customization)", () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  test("builder surface desktop ocean + midnight + mobile", async ({ page, baseURL }) => {
    const creds = getQaPaidCredentials();
    test.skip(!creds, "Set QA_PAID_EMAIL + QA_PAID_PASSWORD (or E2E_PAID_*)");

    const origin = requireOrigin(baseURL);
    await ensureOutDir();

    await loginWithCredentials(page, creds!.email, creds!.password);
    await expectOnPaidSubscriberApp(page);

    const pid = PAID_E2E_DEFAULT_PATHWAY_ID;
    await page.goto(`${origin}/app/practice-tests?pathwayId=${encodeURIComponent(pid)}`, {
      waitUntil: "domcontentloaded",
    });
    await expectPaidLearnerShellReady(page, "practice hub convergence");
    await expect(page.locator("[data-nn-practice-exam-hub-convergence]")).toBeVisible({
      timeout: 90_000,
    });

    const builder = page.locator("[data-nn-practice-exam-hub-convergence]").first();
    await builder.scrollIntoViewIfNeeded();

    await page.setViewportSize({ width: 1280, height: 900 });
    await applyTheme(page, "ocean");
    await page.waitForTimeout(400);
    await builder.screenshot({
      path: path.join(OUT_DIR, "practice-exam-hub-builder--desktop--ocean.png"),
    });

    await applyTheme(page, "midnight");
    await page.waitForTimeout(400);
    await builder.screenshot({
      path: path.join(OUT_DIR, "practice-exam-hub-builder--desktop--midnight.png"),
    });

    await page.setViewportSize({ width: 390, height: 844 });
    await applyTheme(page, "ocean");
    await page.waitForTimeout(400);
    await builder.screenshot({
      path: path.join(OUT_DIR, "practice-exam-hub-builder--mobile--ocean.png"),
    });
  });
});

test.describe("Premium convergence — learner dashboard + report card (hooks)", () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  test("dashboard desktop + mobile, report card, midnight analytics band", async ({ page, baseURL }) => {
    const creds = getQaPaidCredentials();
    test.skip(!creds, "Set QA_PAID_EMAIL + QA_PAID_PASSWORD (or E2E_PAID_*)");

    const origin = requireOrigin(baseURL);
    await ensureOutDir();

    await loginWithCredentials(page, creds!.email, creds!.password);
    await expectOnPaidSubscriberApp(page);

    await page.goto(`${origin}/app`, { waitUntil: "domcontentloaded" });
    await expectPaidLearnerShellReady(page, "dashboard convergence");
    await expect(page.locator("[data-nn-learner-dashboard-convergence]")).toBeVisible({ timeout: 90_000 });
    await expect(page.locator(SEL_LEARNER_SHELL)).toBeVisible({ timeout: 90_000 });

    await page.setViewportSize({ width: 1280, height: 900 });
    await applyTheme(page, "ocean");
    await page.waitForTimeout(500);
    await page.screenshot({
      path: path.join(OUT_DIR, "learner-dashboard--desktop--ocean.png"),
      fullPage: true,
    });

    await page.setViewportSize({ width: 390, height: 844 });
    await applyTheme(page, "ocean");
    await page.waitForTimeout(400);
    await page.screenshot({
      path: path.join(OUT_DIR, "learner-dashboard--mobile--ocean.png"),
      fullPage: true,
    });

    await page.goto(`${origin}/app/account/report`, { waitUntil: "domcontentloaded" });
    await expectPaidLearnerShellReady(page, "report card convergence");
    await expect(page.locator("[data-nn-learner-report-card-convergence]")).toBeVisible({ timeout: 90_000 });
    await page.setViewportSize({ width: 1280, height: 900 });
    await applyTheme(page, "ocean");
    await page.waitForTimeout(500);
    await page.screenshot({
      path: path.join(OUT_DIR, "learner-report-card--desktop--ocean.png"),
      fullPage: true,
    });

    await page.goto(`${origin}/app`, { waitUntil: "domcontentloaded" });
    await expectPaidLearnerShellReady(page, "dashboard midnight analytics");
    const analytics = page.locator("#study-nursing-analytics");
    await expect(analytics).toBeVisible({ timeout: 90_000 });
    await analytics.scrollIntoViewIfNeeded();
    await applyTheme(page, "midnight");
    await page.waitForTimeout(500);
    await analytics.screenshot({
      path: path.join(OUT_DIR, "learner-dashboard-nursing-analytics--midnight.png"),
    });
  });
});

test.describe("Premium convergence screenshots — paid learner shells", () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  for (const vp of VIEWPORTS) {
    for (const theme of THEMES) {
      test(`paid surfaces ${vp.tag} ${theme}`, async ({ page, baseURL }) => {
        const creds = getQaPaidCredentials();
        test.skip(!creds, "Set QA_PAID_EMAIL + QA_PAID_PASSWORD (or E2E_PAID_*)");

        const origin = requireOrigin(baseURL);
        await ensureOutDir();
        await page.setViewportSize({ width: vp.width, height: vp.height });

        await loginWithCredentials(page, creds!.email, creds!.password);
        await expectOnPaidSubscriberApp(page);

        const pid = PAID_E2E_DEFAULT_PATHWAY_ID;
        const routes = [
          "/app",
          "/app/account/report",
          "/app/account/settings",
          `/app/lessons?pathwayId=${encodeURIComponent(pid)}`,
          `/app/flashcards?pathwayId=${encodeURIComponent(pid)}`,
          `/app/practice-tests?pathwayId=${encodeURIComponent(pid)}`,
          `/app/practice-tests?cat=1&pathwayId=${encodeURIComponent(pid)}`,
        ] as const;

        for (const route of routes) {
          await page.goto(`${origin}${route}`, { waitUntil: "domcontentloaded" });
          await expectPaidLearnerShellReady(page, `premium-convergence ${route}`);
          await expect(page.locator(SEL_LEARNER_SHELL)).toBeVisible({ timeout: 90_000 });
          await applyTheme(page, theme);
          await page.waitForTimeout(400);

          const base = `paid-${slugifyRoute(route)}--${vp.tag}--${theme}`;
          await page.screenshot({
            path: path.join(OUT_DIR, `${base}.png`),
            fullPage: false,
          });
        }
      });
    }
  }
});
