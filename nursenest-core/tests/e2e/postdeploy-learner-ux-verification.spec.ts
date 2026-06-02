import { expect, test, type Page } from "@playwright/test";
import { mkdirSync } from "node:fs";
import path from "node:path";
import { getPaidTestCredentials } from "./helpers/paid-test-credentials";
import { loginWithCredentials } from "./helpers/learner-login";
import { expectPaidLearnerShellReady } from "./helpers/paid-learner-shell";

const SCREENSHOT_DIR = path.join("docs", "screenshots", "postdeploy-learner-ux", "2026-05-14");

type RouteCheck = {
  id: string;
  path: string;
  marker: string;
  action: (page: Page) => ReturnType<Page["locator"]>;
  afterLoad?: (page: Page) => Promise<void>;
};

const ROUTES: RouteCheck[] = [
  {
    id: "cat-start",
    path: "/app/practice-tests/start",
    marker: "[data-nn-cat-premium-convergence], .nn-cat-premium-convergence",
    action: (page) => page.locator('a[href="/app/practice-tests"]').first(),
  },
  {
    id: "cat-legacy-query",
    path: "/app/practice-tests?cat=1",
    marker: "[data-nn-cat-premium-convergence], .nn-cat-premium-convergence",
    action: (page) => page.locator('a[href="/app/practice-tests"]').first(),
    afterLoad: async (page) => {
      await expect(page).toHaveURL(/\/app\/practice-tests\/start(?:\?|$)/, { timeout: 60_000 });
    },
  },
  {
    id: "flashcards",
    path: "/app/flashcards",
    marker: "[data-nn-premium-flashcard-convergence]",
    action: (page) => page.locator("[data-nn-e2e-start-review]").first().or(page.locator('a[href*="/app/lessons"]').first()),
  },
  {
    id: "lessons",
    path: "/app/lessons",
    marker: '[data-nn-premium-platform-module="lessons"][data-nn-premium-lessons-system="app-hub"]',
    action: (page) => page.locator('a[href^="/app/lessons/"]').first().or(page.locator('input[name="q"], input[type="search"]').first()),
  },
];

function assertNoOldPickerShells(page: Page) {
  return expect
    .poll(
      async () =>
        page.evaluate(() => {
          return Array.from(document.querySelectorAll("div")).filter((el) => {
            const className = typeof el.className === "string" ? el.className : "";
            const looksLikeOldPicker =
              className.includes("mx-auto max-w-3xl space-y-6 px-4 py-8") ||
              className.includes("mx-auto max-w-3xl space-y-6 px-4 py-8");
            const hasPremiumHook = el.hasAttribute("data-nn-premium-full-platform-convergence");
            return looksLikeOldPicker && !hasPremiumHook;
          }).length;
        }),
      { timeout: 30_000 },
    )
    .toBe(0);
}

async function assertNoHorizontalOverflow(page: Page) {
  await expect
    .poll(
      async () =>
        page.evaluate(() => {
          const root = document.documentElement;
          return root.scrollWidth - root.clientWidth;
        }),
      { timeout: 30_000 },
    )
    .toBeLessThanOrEqual(2);
}

for (const viewport of [
  { id: "desktop", width: 1440, height: 1000 },
  { id: "mobile", width: 390, height: 844 },
] as const) {
  test.describe(`postdeploy learner UX ${viewport.id}`, () => {
    test.use({ viewport: { width: viewport.width, height: viewport.height } });

    test.beforeAll(() => {
      mkdirSync(SCREENSHOT_DIR, { recursive: true });
    });

    test(`premium learner routes render and are actionable (${viewport.id})`, async ({ page }, testInfo) => {
      test.setTimeout(300_000);
      const creds = getPaidTestCredentials();
      test.skip(!creds, "Set QA_PAID_EMAIL + QA_PAID_PASSWORD for post-deploy learner UX verification.");

      const consoleErrors: string[] = [];
      page.on("console", (msg) => {
        if (msg.type() === "error") consoleErrors.push(msg.text());
      });
      page.on("pageerror", (err) => {
        consoleErrors.push(err.message);
      });

      await loginWithCredentials(page, creds!.email, creds!.password, {
        navigationOrigin: process.env.BASE_URL,
      });

      for (const route of ROUTES) {
        consoleErrors.length = 0;
        await page.goto(route.path, { waitUntil: "domcontentloaded" });
        await route.afterLoad?.(page);
        await expectPaidLearnerShellReady(page, `${route.id} ${viewport.id}`);
        await expect(page.locator(route.marker).first()).toBeVisible({ timeout: 90_000 });
        await assertNoOldPickerShells(page);
        await assertNoHorizontalOverflow(page);

        const action = route.action(page);
        await expect(action).toBeVisible({ timeout: 60_000 });
        await expect(action).toBeEnabled({ timeout: 30_000 });
        await action.click({ trial: true, timeout: 30_000 });

        await page.screenshot({
          path: path.join(SCREENSHOT_DIR, `${route.id}-${viewport.id}-${testInfo.project.name}.png`),
          fullPage: true,
        });

        expect(consoleErrors, `${route.id} ${viewport.id} console/page errors`).toEqual([]);
      }
    });
  });
}
