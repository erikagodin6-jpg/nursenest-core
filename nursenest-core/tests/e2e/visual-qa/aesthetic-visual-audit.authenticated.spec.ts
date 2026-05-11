/**
 * Authenticated learner aesthetic audit — PNG inventory + light layout/contrast checks.
 * Ocean / Blossom / Midnight; desktop + mobile.
 *
 * Screenshots: docs/screenshots/aesthetic-audit-2026/authenticated/
 *
 * Prerequisite: `playwright/.auth/learner-paid.json` (run `npm run visual-qa:auth` with paid E2E creds),
 * and local DB content for lessons hub links (see `docs/visual-qa.md`).
 *
 *   cd nursenest-core && npx playwright test -c playwright.aesthetic-audit.config.ts --project=aesthetic-audit \
 *     tests/e2e/visual-qa/aesthetic-visual-audit.authenticated.spec.ts
 */
import { existsSync, mkdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { expect, test, type Page } from "@playwright/test";
import {
  AESTHETIC_THEMES,
  applyLearnerTheme,
  assertHtmlTheme,
  measureBodyContrastHint,
  type AestheticThemeId,
  VIEWPORTS,
  warnSuspiciousAllCapsCTAs,
} from "../helpers/aesthetic-audit-shared";
import { runAestheticAudit } from "../helpers/aesthetic-audit-runner";
import { stabilizePageForCapture } from "../helpers/aesthetic-stabilization";
import { VISUAL_QA_LEARNER_AUTH_FILE } from "../helpers/auth-state-paths";
import { assertNoHorizontalOverflow } from "../helpers/marketing-qa";
import { requireOrigin } from "../helpers/navigation-e2e";
import { learnerAppMainLandmark, PAID_E2E_DEFAULT_PATHWAY_ID } from "../helpers/paid-learner-shell";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(HERE, "..", "..", "..", "..");
const OUT = path.join(REPO_ROOT, "docs", "screenshots", "aesthetic-audit-2026", "authenticated");

const pid = PAID_E2E_DEFAULT_PATHWAY_ID;

if (existsSync(VISUAL_QA_LEARNER_AUTH_FILE)) {
  test.use({ storageState: VISUAL_QA_LEARNER_AUTH_FILE });
}

type StaticRoute = {
  id: string;
  path: string;
  /** Preferred landmark inside learner shell */
  readySelector: string;
};

const STATIC_ROUTES: StaticRoute[] = [
  { id: "dashboard", path: "/app", readySelector: "#nn-learner-main, [data-nn-learner-main], .nn-learner-app main" },
  {
    id: "lessons-hub",
    path: `/app/lessons?pathwayId=${encodeURIComponent(pid)}`,
    readySelector: "#nn-learner-main, [data-nn-learner-main]",
  },
  {
    id: "flashcards-hub",
    path: `/app/flashcards?pathwayId=${encodeURIComponent(pid)}`,
    readySelector: "#nn-learner-main, [data-nn-learner-main]",
  },
  {
    id: "practice-hub",
    path: `/app/practice-tests?pathwayId=${encodeURIComponent(pid)}`,
    readySelector: "#nn-learner-main, [data-nn-learner-main]",
  },
  {
    id: "cat-hub",
    path: `/app/practice-tests?cat=1&pathwayId=${encodeURIComponent(pid)}`,
    readySelector: "#nn-learner-main, [data-nn-learner-main]",
  },
  {
    id: "cat-launch",
    path: `/app/practice-tests/cat-launch?pathwayId=${encodeURIComponent(pid)}`,
    readySelector: "#nn-learner-main, [data-nn-learner-main], main",
  },
  { id: "account", path: "/app/account", readySelector: "#nn-learner-main, [data-nn-learner-main], main" },
  {
    id: "account-settings",
    path: "/app/account/settings",
    readySelector: "#nn-learner-main, [data-nn-learner-main], main",
  },
];

async function settleLearner(page: Page): Promise<void> {
  await page.waitForLoadState("domcontentloaded");
  await learnerAppMainLandmark(page).waitFor({ state: "visible", timeout: 120_000 });
  await page.waitForLoadState("networkidle", { timeout: 90_000 }).catch(() => {});
  await page.evaluate(() => document.fonts.ready).catch(() => {});
}

function screenshotPath(routeId: string, theme: AestheticThemeId, vp: "desktop" | "mobile"): string {
  return path.join(OUT, `auth-${routeId}-${theme}-${vp}.png`);
}

test.describe.configure({ mode: "serial" });

test.beforeAll(({}, testInfo) => {
  mkdirSync(OUT, { recursive: true });
  if (!existsSync(VISUAL_QA_LEARNER_AUTH_FILE)) {
    testInfo.skip(true, `Missing ${VISUAL_QA_LEARNER_AUTH_FILE} — run npm run visual-qa:auth (paid E2E credentials).`);
  }
});

test.describe("Aesthetic audit — authenticated learner surfaces", () => {
  test.use({ reducedMotion: "reduce" });

  for (const route of STATIC_ROUTES) {
    for (const theme of AESTHETIC_THEMES) {
      for (const vpName of ["desktop", "mobile"] as const) {
        test(`auth ${route.id} — ${theme} — ${vpName}`, async ({ page, baseURL }) => {
          const origin = requireOrigin(baseURL).replace(/\/$/, "");
          await page.setViewportSize(VIEWPORTS[vpName]);

          const res = await page.goto(`${origin}${route.path}`, {
            waitUntil: "domcontentloaded",
            timeout: 180_000,
          });
          expect(res?.ok(), `${route.path} HTTP ${res?.status()}`).toBeTruthy();

          if (page.url().includes("/login") || page.url().includes("/sign-in")) {
            test.skip(true, "Redirected to login — auth storage missing or expired.");
          }

          await applyLearnerTheme(page, theme);
          await assertHtmlTheme(page, theme);

          await page.locator(route.readySelector).first().waitFor({ state: "visible", timeout: 120_000 });
          await settleLearner(page);

          await assertNoHorizontalOverflow(page);

          const contrast = await measureBodyContrastHint(page);
          if (contrast.ratio != null && contrast.ratio < 2.5) {
            console.warn(
              `[aesthetic-audit] Low contrast hint ${contrast.ratio.toFixed(2)} on auth/${route.id} ${theme} (${vpName})`,
            );
          }

          await warnSuspiciousAllCapsCTAs(page, `auth/${route.id}`);

          await stabilizePageForCapture(page, {
            readyLocator: page.locator(route.readySelector).first(),
            totalTimeoutMs: 120_000,
          });

          const outPath = screenshotPath(route.id, theme, vpName);
          await page.screenshot({ path: outPath, fullPage: true });

          await runAestheticAudit({
            page,
            route: `auth-${route.id}`,
            theme,
            viewport: vpName,
            screenshotPath: outPath,
          });

          await expect.soft(contrast.ratio == null || contrast.ratio >= 1.6).toBe(true);
        });
      }
    }
  }

  for (const theme of AESTHETIC_THEMES) {
    for (const vpName of ["desktop", "mobile"] as const) {
      test(`auth lesson-detail — ${theme} — ${vpName}`, async ({ page, baseURL }) => {
        const origin = requireOrigin(baseURL).replace(/\/$/, "");
        await page.setViewportSize(VIEWPORTS[vpName]);

        const hubUrl = `${origin}/app/lessons?pathwayId=${encodeURIComponent(pid)}`;
        let res = await page.goto(hubUrl, { waitUntil: "domcontentloaded", timeout: 180_000 });
        expect(res?.ok(), hubUrl).toBeTruthy();

        if (page.url().includes("/login")) {
          test.skip(true, "Redirected to login — auth storage missing or expired.");
        }

        await applyLearnerTheme(page, theme);
        await assertHtmlTheme(page, theme);
        await settleLearner(page);

        const link = page.locator('#nn-learner-main a[href^="/app/lessons/"]').first();
        if ((await link.count()) === 0) {
          test.skip(true, "No lesson row links on hub — seed pathway lessons for QA account.");
        }

        await link.click();
        await page.waitForLoadState("domcontentloaded");
        await settleLearner(page);

        await assertNoHorizontalOverflow(page);
        const contrast = await measureBodyContrastHint(page);
        if (contrast.ratio != null && contrast.ratio < 2.5) {
          console.warn(
            `[aesthetic-audit] Low contrast hint ${contrast.ratio.toFixed(2)} on auth/lesson-detail ${theme} (${vpName})`,
          );
        }
        await warnSuspiciousAllCapsCTAs(page, "auth/lesson-detail");

        await stabilizePageForCapture(page, { totalTimeoutMs: 120_000 });

        const lessonOutPath = screenshotPath("lesson-detail", theme, vpName);
        await page.screenshot({
          path: lessonOutPath,
          fullPage: true,
        });

        await runAestheticAudit({
          page,
          route: "auth-lesson-detail",
          theme,
          viewport: vpName,
          screenshotPath: lessonOutPath,
        });

        await expect.soft(contrast.ratio == null || contrast.ratio >= 1.6).toBe(true);
      });
    }
  }
});
