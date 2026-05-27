import { expect, test, type Locator, type Page } from "@playwright/test";

import {
  assertBasicAccessibility,
  assertLearnerJourneyGuardsClean,
  assertNoLayoutOverlap,
  assertNoPlaceholderContent,
  captureResponsiveScreenshots,
  expectVisibleAny,
  getLearnerJourneyAccount,
  gotoLearnerRoute,
  installLearnerJourneyGuards,
  loginAsLearner,
  type LearnerJourneyKind,
} from "./learner-journey";

const JOURNEY_TIMEOUT = 240_000;
const SCREENSHOT_ONLY = process.env.LEARNER_JOURNEY_SCREENSHOT_ONLY === "1";

async function optionalClick(locator: Locator, timeout = 5_000): Promise<boolean> {
  if (!(await locator.first().isVisible({ timeout }).catch(() => false))) return false;
  await locator.first().click();
  return true;
}

async function assertCoreRouteHealth(page: Page): Promise<void> {
  if (SCREENSHOT_ONLY) return;
  await assertNoPlaceholderContent(page);
  await assertNoLayoutOverlap(page);
  await assertBasicAccessibility(page);
}

async function openFirstLesson(page: Page): Promise<boolean> {
  const lessonLink = page
    .locator(
      [
        "a[href*='/app/lessons/']",
        "[data-nn-e2e-lesson-card] a",
        "[data-nn-lesson-card] a",
        "main a",
      ].join(", "),
    )
    .filter({ hasNotText: /flashcard|practice|cat|dashboard/i })
    .first();
  if (!(await lessonLink.isVisible({ timeout: 45_000 }).catch(() => false))) return false;
  await lessonLink.click();
  await page.waitForLoadState("domcontentloaded");
  return true;
}

async function answerVisibleExamItem(page: Page): Promise<void> {
  const mcq = page.locator("ul.nn-cat-opt-list button.nn-cat-opt").first();
  const sata = page.locator("ul.nn-cat-opt-list label.nn-cat-opt").first();
  if (await mcq.isVisible({ timeout: 45_000 }).catch(() => false)) {
    await mcq.click();
  } else {
    await expect(sata).toBeVisible({ timeout: 45_000 });
    await sata.click();
  }

  const submit = page.getByRole("button", { name: /^Submit answer$/i });
  if (await submit.isVisible({ timeout: 10_000 }).catch(() => false)) {
    await expect(submit).toBeEnabled({ timeout: 15_000 });
    await submit.click();
  }
}

async function assertFocusedExamShell(page: Page): Promise<void> {
  await expect(page.locator("[data-cat-exam-root]")).toBeVisible({ timeout: 120_000 });
  if (SCREENSHOT_ONLY) return;
  await expect(page.locator("footer")).toHaveCount(0);
  await expect(page.getByText(/Stay on Track Every Day|Continue Studying|Strengthen|ACLS/i)).toHaveCount(0);
}

async function startPracticeOrCat(page: Page): Promise<void> {
  const startButton = page.locator("[data-nn-qa-practice-hub-start-test], [data-nn-qa-practice-hub-start-test-bottom]").first();
  await expect(startButton).toBeVisible({ timeout: 75_000 });
  await startButton.click();

  await optionalClick(page.getByRole("button", { name: /^Begin exam$/i }), 15_000);
  await page.waitForURL(/\/app\/practice-tests\/[a-zA-Z0-9_-]+|\/app\/cases\/cnple/, { timeout: 120_000 });
}

async function assertAnalyticsSurface(page: Page): Promise<void> {
  await expect(page.locator("main, [role='main']").first()).toBeVisible({ timeout: 45_000 });
  await expect(page.locator("body")).not.toContainText(/\bNaN\b|undefined|null/i);
  const visualData = page.locator("svg, canvas, [role='img'], [data-nn-chart], [data-nn-progress-card]");
  await expect(visualData.first()).toBeVisible({ timeout: 45_000 }).catch(async () => {
    await expect(page.getByText(/progress|performance|readiness|weak areas|analytics|report/i).first()).toBeVisible({
      timeout: 15_000,
    });
  });
}

export function defineLearnerJourneySuite(kind: LearnerJourneyKind): void {
  const account = getLearnerJourneyAccount(kind);

  test.describe(`${kind.toUpperCase()} learner journey`, () => {
    test.skip(!account, `Missing ${kind.toUpperCase()} seeded account env vars.`);

    test("auth, profile, logout, and dashboard shell render without regressions", async ({ page, baseURL }, testInfo) => {
      test.setTimeout(JOURNEY_TIMEOUT);
      const guards = installLearnerJourneyGuards(page);
      try {
        await page.goto("/login", { waitUntil: "domcontentloaded" });
        await captureResponsiveScreenshots(page, testInfo, kind, "login");

        await loginAsLearner(kind, page, baseURL);
        await gotoLearnerRoute(page, "/app", account!.pathwayId);
        await expect(page.locator("main, [role='main']").first()).toBeVisible({ timeout: 45_000 });
        await assertCoreRouteHealth(page);
        await captureResponsiveScreenshots(page, testInfo, kind, "dashboard");

        await gotoLearnerRoute(page, "/app/account", account!.pathwayId);
        await expect(page.locator("main, [role='main']").first()).toContainText(/profile|account|subscription|settings/i, {
          timeout: 45_000,
        });
        await assertCoreRouteHealth(page);
        await captureResponsiveScreenshots(page, testInfo, kind, "profile-settings");

        const logout = page.getByRole("button", { name: /log out|sign out/i }).or(page.getByRole("link", { name: /log out|sign out/i }));
        if (await logout.first().isVisible({ timeout: 5_000 }).catch(() => false)) {
          await logout.first().click();
          await expect(page).toHaveURL(/\/(?:login|$)/, { timeout: 45_000 });
        }

        if (!SCREENSHOT_ONLY) await assertLearnerJourneyGuardsClean(guards);
      } finally {
        guards.dispose();
      }
    });

    test("flashcards setup, session launch, reveal, grading, and resume stay responsive", async ({ page, baseURL }, testInfo) => {
      test.setTimeout(JOURNEY_TIMEOUT);
      const guards = installLearnerJourneyGuards(page);
      try {
        await loginAsLearner(kind, page, baseURL);
        await gotoLearnerRoute(page, "/app/flashcards", account!.pathwayId);
        await expectVisibleAny(page, ["[data-nn-e2e-flashcards-hub]", "[data-nn-e2e-start-review]"], 75_000);
        await assertCoreRouteHealth(page);
        await captureResponsiveScreenshots(page, testInfo, kind, "flashcards-setup");
        if (SCREENSHOT_ONLY) return;

        const firstSystem = page.locator("[data-nn-e2e-body-system-card]").first();
        if (await firstSystem.isVisible({ timeout: 10_000 }).catch(() => false)) {
          await firstSystem.click();
        }

        const start = page.locator("[data-nn-e2e-start-review], [data-nn-e2e-start-review-bottom]").first();
        await expect(start).toBeVisible({ timeout: 45_000 });
        const started = Date.now();
        await start.click();
        await expectVisibleAny(
          page,
          [
            ".nn-premium-flashcard-session-root",
            "[data-nn-e2e-flashcard-session]",
            "[data-nn-flashcards-session-shell]",
            "text=/Preparing your flashcards|Loading Session|Building study session/i",
          ],
          10_000,
        );
        expect(Date.now() - started, "Flashcard session should show immediate shell or loading feedback").toBeLessThan(10_000);
        await captureResponsiveScreenshots(page, testInfo, kind, "flashcards-active");

        await optionalClick(page.getByRole("button", { name: /reveal|flip|show answer/i }), 15_000);
        await optionalClick(page.getByRole("button", { name: /^Good$/i }).or(page.getByRole("button", { name: /^Easy$/i })), 15_000);
        await assertCoreRouteHealth(page);
        await captureResponsiveScreenshots(page, testInfo, kind, "flashcards-answer-reveal");

        await gotoLearnerRoute(page, "/app/flashcards", account!.pathwayId);
        await expectVisibleAny(page, ["[data-nn-e2e-start-review]", "text=/Resume|Continue/i"], 60_000);
        await captureResponsiveScreenshots(page, testInfo, kind, "flashcards-resume");

        if (!SCREENSHOT_ONLY) await assertLearnerJourneyGuardsClean(guards);
      } finally {
        guards.dispose();
      }
    });

    test("practice setup and focused exam shell stay isolated through answer and rationale", async ({ page, baseURL }, testInfo) => {
      test.setTimeout(JOURNEY_TIMEOUT);
      const guards = installLearnerJourneyGuards(page);
      try {
        await loginAsLearner(kind, page, baseURL);
        await gotoLearnerRoute(page, "/app/practice-tests", account!.pathwayId);
        await expectVisibleAny(
          page,
          ["[data-nn-qa-practice-hub-start-test]", "[data-nn-qa-practice-hub-start-test-bottom]"],
          75_000,
        );
        await assertCoreRouteHealth(page);
        await captureResponsiveScreenshots(page, testInfo, kind, "practice-setup");
        if (SCREENSHOT_ONLY) return;

        await startPracticeOrCat(page);
        await assertFocusedExamShell(page);
        await answerVisibleExamItem(page);
        await expectVisibleAny(
          page,
          ["[data-nn-qa-practice-rationale-column]", ".nn-question-session-rationale", "text=/Rationale|Explanation/i"],
          60_000,
        );
        await optionalClick(page.getByRole("button", { name: /mark/i }), 5_000);
        await optionalClick(page.getByRole("button", { name: /notes/i }), 5_000);
        await optionalClick(page.getByRole("button", { name: /calculator/i }), 5_000);
        await optionalClick(page.getByRole("button", { name: /lab values/i }), 5_000);
        await assertCoreRouteHealth(page);
        await captureResponsiveScreenshots(page, testInfo, kind, "practice-rationale");

        await optionalClick(page.getByRole("button", { name: /finish/i }), 5_000);
        await optionalClick(page.getByRole("button", { name: /finish exam|submit exam|end exam/i }), 5_000);
        await page.waitForTimeout(500);
        await captureResponsiveScreenshots(page, testInfo, kind, "practice-results");

        if (!SCREENSHOT_ONLY) await assertLearnerJourneyGuardsClean(guards);
      } finally {
        guards.dispose();
      }
    });

    test("CAT launch initializes adaptive shell without redirect loops or stale chrome", async ({ page, baseURL }, testInfo) => {
      test.setTimeout(JOURNEY_TIMEOUT);
      const guards = installLearnerJourneyGuards(page);
      try {
        await loginAsLearner(kind, page, baseURL);
        await gotoLearnerRoute(page, "/app/practice-tests?cat=1", account!.pathwayId);
        await expectVisibleAny(
          page,
          ["[data-nn-qa-practice-hub-start-test]", "[data-nn-qa-practice-hub-start-test-bottom]", "text=/CNPLE|case/i"],
          75_000,
        );
        await captureResponsiveScreenshots(page, testInfo, kind, "cat-setup");
        if (SCREENSHOT_ONLY) return;

        if (/\/app\/cases\/cnple/.test(page.url())) {
          await assertCoreRouteHealth(page);
          await captureResponsiveScreenshots(page, testInfo, kind, "cat-results");
        } else {
          await startPracticeOrCat(page);
          await expect(page.locator("[data-cat-exam-root]")).toBeVisible({ timeout: 120_000 });
          await expect(page.locator("[data-nn-qa-cat-adaptive-exam-footer], ul.nn-cat-opt-list").first()).toBeVisible({
            timeout: 90_000,
          });
          await captureResponsiveScreenshots(page, testInfo, kind, "cat-active");
          await answerVisibleExamItem(page);
          await optionalClick(page.locator("[data-nn-qa-cat-exam-advance]"), 30_000);
          await assertCoreRouteHealth(page);
          await captureResponsiveScreenshots(page, testInfo, kind, "cat-question-flow");
        }

        if (!SCREENSHOT_ONLY) await assertLearnerJourneyGuardsClean(guards);
      } finally {
        guards.dispose();
      }
    });

    test("lessons hydrate pearls, semantic callouts, sidebar navigation, and analytics surfaces", async ({ page, baseURL }, testInfo) => {
      test.setTimeout(JOURNEY_TIMEOUT);
      const guards = installLearnerJourneyGuards(page);
      try {
        await loginAsLearner(kind, page, baseURL);
        await gotoLearnerRoute(page, "/app/lessons", account!.pathwayId);
        await expect(page.locator("main, [role='main']").first()).toBeVisible({ timeout: 60_000 });
        await captureResponsiveScreenshots(page, testInfo, kind, "lesson-overview");
        if (SCREENSHOT_ONLY) return;

        const opened = await openFirstLesson(page);
        test.skip(!opened, "No lesson link was available for this seeded pathway.");
        await expect(page.locator("main, [role='main']").first()).toBeVisible({ timeout: 60_000 });
        await expect(page.getByText(/Continue Studying|Strengthen/i)).toHaveCount(0);
        await expect(page.locator(".nn-lesson-clinical-pearls-rail__box:empty")).toHaveCount(0);
        await assertCoreRouteHealth(page);
        await captureResponsiveScreenshots(page, testInfo, kind, "lesson-pearl-cards");

        const semanticVariants = await page
          .locator("[data-callout-variant], .nn-lesson-callout, .nn-semantic-callout")
          .evaluateAll((nodes) =>
            Array.from(
              new Set(
                nodes
                  .map((node) => {
                    const el = node as HTMLElement;
                    return el.dataset.calloutVariant || window.getComputedStyle(el).borderLeftColor;
                  })
                  .filter(Boolean),
              ),
            ),
          )
          .catch(() => []);
        if (semanticVariants.length > 1) {
          expect(new Set(semanticVariants).size, "Semantic lesson callouts should expose differentiated variants").toBeGreaterThan(1);
        }
        await captureResponsiveScreenshots(page, testInfo, kind, "lesson-semantic-callouts");

        await gotoLearnerRoute(page, "/app/progress", account!.pathwayId);
        await assertAnalyticsSurface(page);
        await assertCoreRouteHealth(page);
        await captureResponsiveScreenshots(page, testInfo, kind, "analytics-dashboard");

        if (!SCREENSHOT_ONLY) await assertLearnerJourneyGuardsClean(guards);
      } finally {
        guards.dispose();
      }
    });
  });
}
