/**
 * Premium convergence visual smoke — captures representative learner + marketing hub shells
 * at desktop + mobile viewports and ocean (light) + midnight (dark) themes.
 *
 * Screenshots: docs/screenshots/premium-convergence/*.png
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
