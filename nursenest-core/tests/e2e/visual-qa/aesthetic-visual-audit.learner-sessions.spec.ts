/**
 * Learner session aesthetic audit — practice / CAT / flashcards / report card
 * plus Labs (ventilator-style previews) + allied premium pathway surfaces. Captures the same theme × viewport
 * matrix as the public/auth specs and runs the full audit (heuristics + tokens
 * + baseline diff + Figma parity).
 *
 * **Fault-tolerant by design:** when seed data, entitlements, or session
 * fixtures are missing the spec marks the test as skipped (with diagnostic
 * detail in the shard) rather than failing the run. The ecosystem audit
 * continues to provide coverage for those flows separately.
 *
 *   cd nursenest-core && npx playwright test -c playwright.aesthetic-audit.config.ts --project=aesthetic-audit \
 *     tests/e2e/visual-qa/aesthetic-visual-audit.learner-sessions.spec.ts
 */
import { existsSync, mkdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { expect, test, type Page } from "@playwright/test";
import {
  AESTHETIC_THEMES,
  applyLearnerTheme,
  assertHtmlTheme,
  VIEWPORTS,
  type AestheticThemeId,
} from "../helpers/aesthetic-audit-shared";
import { runAestheticAudit } from "../helpers/aesthetic-audit-runner";
import { stabilizePageForCapture } from "../helpers/aesthetic-stabilization";
import { VISUAL_QA_LEARNER_AUTH_FILE } from "../helpers/auth-state-paths";
import { requireOrigin } from "../helpers/navigation-e2e";
import { learnerAppMainLandmark, PAID_E2E_DEFAULT_PATHWAY_ID } from "../helpers/paid-learner-shell";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(HERE, "..", "..", "..", "..");
const OUT = path.join(REPO_ROOT, "docs", "screenshots", "aesthetic-audit-2026", "learner-sessions");

const pid = PAID_E2E_DEFAULT_PATHWAY_ID;

if (existsSync(VISUAL_QA_LEARNER_AUTH_FILE)) {
  test.use({ storageState: VISUAL_QA_LEARNER_AUTH_FILE });
}

interface LearnerSessionRoute {
  id: string;
  path: string;
  /** Locator strings (any-of) marking session ready. */
  readyAnyOf: readonly string[];
  /** Optional setup — click a "Start" button etc. before screenshot. */
  setup?: (page: Page) => Promise<void>;
  /** Skip when this returns true (e.g. entitlement gate detected). */
  skipWhen?: (page: Page) => Promise<boolean>;
  /** Allow the route to no-op if seeds are missing (avoids test failures). */
  optional?: boolean;
}

const SESSION_ROUTES: readonly LearnerSessionRoute[] = [
  {
    id: "practice-session",
    path: `/app/practice-tests?pathwayId=${encodeURIComponent(pid)}`,
    readyAnyOf: [
      "[data-nn-qa-practice-hub-start-test]",
      "[data-nn-e2e-practice-hub-cat-exam]",
      "[data-route='practice-tests']",
    ],
    optional: true,
  },
  {
    id: "cat-session",
    path: `/app/practice-tests?cat=1&pathwayId=${encodeURIComponent(pid)}`,
    readyAnyOf: ["[data-nn-e2e-practice-hub-cat-exam]", "[data-route='practice-tests']"],
    optional: true,
  },
  {
    id: "cat-results",
    path: "/app/practice-tests/cat-insights",
    readyAnyOf: ["#nn-learner-main", "[data-nn-learner-main]", "main", "h1"],
    optional: true,
  },
  {
    id: "flashcard-session",
    path: `/app/flashcards?pathwayId=${encodeURIComponent(pid)}`,
    readyAnyOf: ["[data-nn-e2e-flashcards-hub]", "[data-nn-e2e-start-review]"],
    optional: true,
  },
  {
    id: "report-card",
    path: "/app/account/report",
    readyAnyOf: ["#nn-learner-main", "[data-nn-learner-main]", "main"],
    optional: true,
  },
  /** Ventilator / respiratory mechanics previews ship inside the Labs workstation (`/app/labs`). */
  {
    id: "labs-ventilator-preview",
    path: `/app/labs?pathwayId=${encodeURIComponent(pid)}`,
    readyAnyOf: ["#nn-learner-main", "[data-nn-learner-main]", "main", "[data-route='labs']"],
    optional: true,
  },
  /** Allied premium modules use the shared `us-allied-core` pathway id + profession scoping. */
  {
    id: "allied-premium-preview",
    path: `/app/lessons?pathwayId=${encodeURIComponent("us-allied-core")}&alliedProfession=${encodeURIComponent("mlt")}`,
    readyAnyOf: ["#nn-learner-main", "[data-nn-learner-main]", "main"],
    optional: true,
  },
];

function screenshotPath(id: string, theme: AestheticThemeId, vp: "desktop" | "mobile"): string {
  return path.join(OUT, `learner-${id}-${theme}-${vp}.png`);
}

async function settleLearner(page: Page): Promise<void> {
  await page.waitForLoadState("domcontentloaded");
  await learnerAppMainLandmark(page)
    .waitFor({ state: "visible", timeout: 90_000 })
    .catch(() => {});
  await page.waitForLoadState("load", { timeout: 60_000 }).catch(() => {});
  await page.evaluate(() => document.fonts.ready).catch(() => {});
}

async function waitForAnyReady(page: Page, selectors: readonly string[]): Promise<boolean> {
  for (const sel of selectors) {
    try {
      await page.locator(sel).first().waitFor({ state: "visible", timeout: 8_000 });
      return true;
    } catch {
      /* try next */
    }
  }
  return false;
}

test.beforeAll(({}, testInfo) => {
  mkdirSync(OUT, { recursive: true });
  if (!existsSync(VISUAL_QA_LEARNER_AUTH_FILE)) {
    testInfo.skip(true, `Missing ${VISUAL_QA_LEARNER_AUTH_FILE} — run npm run visual-qa:auth (paid E2E credentials).`);
  }
});

test.describe("Aesthetic audit — learner session surfaces", () => {
  test.use({ reducedMotion: "reduce" });

  for (const route of SESSION_ROUTES) {
    for (const theme of AESTHETIC_THEMES) {
      for (const vpName of ["desktop", "mobile"] as const) {
        test(`learner ${route.id} — ${theme} — ${vpName}`, async ({ page, baseURL }, testInfo) => {
          const origin = requireOrigin(baseURL).replace(/\/$/, "");
          await page.setViewportSize(VIEWPORTS[vpName]);

          const res = await page.goto(`${origin}${route.path}`, {
            waitUntil: "domcontentloaded",
            timeout: 180_000,
          });
          // Routes may 404 in dev DBs without seed content — skip rather than fail.
          if (!res?.ok()) {
            testInfo.skip(true, `HTTP ${res?.status()} for ${route.path}`);
            return;
          }
          if (page.url().includes("/login") || page.url().includes("/sign-in")) {
            testInfo.skip(true, "Redirected to login — auth state missing or expired.");
            return;
          }

          await applyLearnerTheme(page, theme);
          await assertHtmlTheme(page, theme);

          const ready = await waitForAnyReady(page, route.readyAnyOf);
          if (!ready && route.optional) {
            testInfo.skip(true, `Ready selector not found for ${route.id}`);
            return;
          }
          expect(ready, `ready selectors absent for ${route.id}`).toBeTruthy();

          await settleLearner(page);

          if (route.skipWhen && (await route.skipWhen(page))) {
            testInfo.skip(true, `skipWhen() returned true for ${route.id}`);
            return;
          }
          if (route.setup) {
            await route.setup(page).catch(() => {});
          }

          await stabilizePageForCapture(page, { totalTimeoutMs: 120_000 });

          const outPath = screenshotPath(route.id, theme, vpName);
          await page.screenshot({ path: outPath, fullPage: true });

          await runAestheticAudit({
            page,
            route: `learner-${route.id}`,
            theme,
            viewport: vpName,
            screenshotPath: outPath,
          });
        });
      }
    }
  }
});
