/**
 * Premium tests/hubs component-level proof.
 *
 * Asserts that each live hub and sub-page URL renders its designated premium
 * component — identified by data-premium-layout-version="2026-05-tests-hubs-v1"
 * on the component root — AND that the shell marker is still present.
 *
 * Run against production:
 *   BASE_URL=https://www.nursenest.ca npx playwright test tests/e2e/premium-tests-hubs-proof.spec.ts --project=chromium
 */
import { expect, test, type Page, type TestInfo } from "@playwright/test";
import { mkdirSync } from "node:fs";
import path from "node:path";
import { getQaPaidCredentials } from "./helpers/smoke-credentials";
import { loginWithCredentials } from "./helpers/learner-login";

const COMPONENT_VERSION = "2026-05-tests-hubs-v1";
const SHELL_VERSION = "2026-05-live-redesign-v1";
const SCREENSHOT_DIR = path.join("test-results", "premium-tests-hubs-proof");

const OLD_LAYOUT_SELECTORS = [
  "[data-legacy-layout]",
  "[data-old-layout]",
  ".legacy-layout",
  ".old-layout",
  ".legacy-marketing-shell",
];

// ---------------------------------------------------------------------------
// Public (unauthenticated) targets
// ---------------------------------------------------------------------------

const PUBLIC_COMPONENT_TARGETS = [
  { id: "rn-hub",        path: "/canada/rn/nclex-rn",                 component: "NursingTierHubPage" },
  { id: "rpn-hub",       path: "/canada/pn/rex-pn",                   component: "NursingTierHubPage" },
  { id: "np-hub",        path: "/canada/np/cnple",                     component: "AuthorityClusterPageView (no component marker — shell only)" },
  { id: "allied-hub",    path: "/allied/allied-health",                component: "AlliedHealthPathwayHub" },
  { id: "rn-lessons",    path: "/canada/rn/nclex-rn/lessons",          component: "LessonsPageShell or CategoryFirstIndex" },
  { id: "rn-questions",  path: "/canada/rn/nclex-rn/questions",        component: "ExamPathwayQuestionsHubPage" },
  { id: "rn-cat",        path: "/canada/rn/nclex-rn/cat",              component: "PathwayCatEntryPage" },
  { id: "rn-flashcards", path: "/canada/rn/nclex-rn/flashcards",       component: "PathwayFlashcardsPage" },
  { id: "rpn-lessons",   path: "/canada/pn/rex-pn/lessons",            component: "LessonsPageShell or CategoryFirstIndex" },
  { id: "rpn-questions", path: "/canada/pn/rex-pn/questions",          component: "ExamPathwayQuestionsHubPage" },
  { id: "rpn-cat",       path: "/canada/pn/rex-pn/cat",                component: "PathwayCatEntryPage" },
  { id: "rpn-flashcards",path: "/canada/pn/rex-pn/flashcards",         component: "PathwayFlashcardsPage" },
  { id: "np-lessons",    path: "/canada/np/cnple/lessons",             component: "LessonsPageShell or CategoryFirstIndex" },
  { id: "np-questions",  path: "/canada/np/cnple/questions",           component: "ExamPathwayQuestionsHubPage" },
  { id: "np-cat",        path: "/canada/np/cnple/cat",                 component: "PathwayCatEntryPage" },
  { id: "np-flashcards", path: "/canada/np/cnple/flashcards",          component: "PathwayFlashcardsPage" },
] as const;

// Sub-pages that expose the component marker
const COMPONENT_MARKER_PATHS = new Set([
  "/canada/rn/nclex-rn",
  "/canada/pn/rex-pn",
  "/allied/allied-health",
  "/canada/rn/nclex-rn/lessons",
  "/canada/rn/nclex-rn/questions",
  "/canada/rn/nclex-rn/cat",
  "/canada/rn/nclex-rn/flashcards",
  "/canada/pn/rex-pn/lessons",
  "/canada/pn/rex-pn/questions",
  "/canada/pn/rex-pn/cat",
  "/canada/pn/rex-pn/flashcards",
  "/canada/np/cnple/lessons",
  "/canada/np/cnple/questions",
  "/canada/np/cnple/cat",
  "/canada/np/cnple/flashcards",
]);

// ---------------------------------------------------------------------------
// Authenticated learner targets
// ---------------------------------------------------------------------------

const AUTH_COMPONENT_TARGETS = [
  { id: "practice-tests-hub", path: "/app/practice-tests",    surface: "learner-shell" },
  { id: "flashcards-hub",     path: "/app/flashcards",        surface: "learner-shell" },
  { id: "lessons-hub",        path: "/app/lessons",           surface: "learner-shell" },
] as const;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

async function expectShellMarker(page: Page) {
  const shell = page
    .locator(`[data-premium-layout-version="${SHELL_VERSION}"]`)
    .first();
  await expect(shell, "shell marker must be present").toHaveCount(1);
}

async function expectComponentMarker(page: Page) {
  const marker = page.locator(`[data-premium-layout-version="${COMPONENT_VERSION}"]`).first();
  await expect(marker, `component marker ${COMPONENT_VERSION}`).toHaveCount(1);
}

async function expectNoOldLayout(page: Page) {
  for (const sel of OLD_LAYOUT_SELECTORS) {
    await expect(page.locator(sel), `${sel} must be absent`).toHaveCount(0);
  }
}

async function expectNoHorizontalOverflow(page: Page) {
  await page.waitForTimeout(400);
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow, "horizontal overflow px").toBeLessThanOrEqual(1);
}

async function captureScreenshots(page: Page, testInfo: TestInfo, id: string) {
  mkdirSync(SCREENSHOT_DIR, { recursive: true });
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.waitForLoadState("networkidle", { timeout: 15_000 }).catch(() => {});
  await expectNoHorizontalOverflow(page);
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, `${testInfo.project.name}-${id}-desktop.png`), fullPage: true });
  await page.setViewportSize({ width: 375, height: 812 });
  await page.reload({ waitUntil: "domcontentloaded" });
  await page.waitForLoadState("networkidle", { timeout: 15_000 }).catch(() => {});
  await expectNoHorizontalOverflow(page);
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, `${testInfo.project.name}-${id}-mobile-375.png`), fullPage: true });
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

test.describe("premium hub component markers — public routes", () => {
  for (const target of PUBLIC_COMPONENT_TARGETS) {
    test(`${target.id} renders premium component and shell`, async ({ page }, testInfo) => {
      await page.goto(target.path, { waitUntil: "domcontentloaded" });
      await page.waitForLoadState("networkidle", { timeout: 20_000 }).catch(() => {});
      await expect(page.locator("body")).toBeVisible({ timeout: 30_000 });

      // Shell marker — always expected (marketing layout)
      await expectShellMarker(page);

      // Component-level marker — only on pages where we wired it
      if (COMPONENT_MARKER_PATHS.has(target.path)) {
        await expectComponentMarker(page);
      }

      await expectNoOldLayout(page);

      // At least one visible CTA or study link in main
      const cta = page
        .locator("main a[href], main button:not([disabled])")
        .filter({ visible: true })
        .first();
      await expect(cta, "at least one actionable element in main").toBeVisible({ timeout: 30_000 });

      await captureScreenshots(page, testInfo, target.id);
    });
  }
});

test.describe("premium hub component markers — authenticated learner routes", () => {
  test("learner hub pages use premium learner shell", async ({ page }, testInfo) => {
    const creds = getQaPaidCredentials();
    test.skip(!creds, "Set QA_PAID_EMAIL + QA_PAID_PASSWORD for protected surfaces.");
    await loginWithCredentials(page, creds!.email, creds!.password);

    for (const target of AUTH_COMPONENT_TARGETS) {
      await test.step(target.id, async () => {
        await page.goto(target.path, { waitUntil: "domcontentloaded" });
        await page.waitForLoadState("networkidle", { timeout: 20_000 }).catch(() => {});
        await expect(page.locator("body")).toBeVisible({ timeout: 30_000 });

        // Learner shell marker
        const shell = page.locator(`[data-premium-layout-version="${SHELL_VERSION}"][data-premium-layout-surface="${target.surface}"]`).first();
        await expect(shell, `learner shell marker surface=${target.surface}`).toHaveCount(1);

        await expectNoOldLayout(page);
        await captureScreenshots(page, testInfo, target.id);
      });
    }
  });
});
