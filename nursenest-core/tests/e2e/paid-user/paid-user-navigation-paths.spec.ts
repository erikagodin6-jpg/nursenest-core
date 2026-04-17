/**
 * Paid-user navigation contract across marketing + learner shell surfaces.
 *
 * Protects:
 * - authenticated navigation reliability
 * - marketing → app shell transition stability
 * - paid lesson access (no paywall / no truncated lesson body)
 * - SEO safety on marketing content surfaces (no restricted internal hrefs in public content)
 *
 * Run:
 * `npx playwright test --project=chromium-paid tests/e2e/paid-user/paid-user-navigation-paths.spec.ts`
 */
import { expect, test, type Page } from "@playwright/test";
import { attachPageObservers } from "../helpers/attach-observers";
import { learnerShellStudyNavigation } from "../helpers/learner-shell-locators";
import { loginWithCredentials } from "../helpers/learner-login";
import { defaultMarketingLessonPath, LESSON_ACCESS_ASIDE } from "../helpers/marketing-lesson-paywall";
import { expectMarketingPublicShell, requireOrigin } from "../helpers/navigation-e2e";
import { LESSON_HUB_CARD_LINKS, paidFlashcardsHubUrl, paidLessonsHubUrl, paidQuestionsHubUrl } from "../helpers/paid-content-discovery";
import { PAID_E2E_DEFAULT_PATHWAY_ID, learnerAppMainLandmark } from "../helpers/paid-learner-shell";
import { seriousConsoleLines } from "../helpers/paid-user-suite";
import { expectNoSubscriptionPaywall } from "../helpers/paid-surface-assertions";
import { getQaPaidCredentials } from "../helpers/smoke-credentials";

const CONTENT_READY_TIMEOUT_MS = 5_000;
const HEADER_STABILITY_WAIT_MS = 1_200;

type ContentSnapshot = {
  selector: string;
  textLength: number;
};

function clearObserverBuffers(input: { consoleErrors: string[]; failedRequests: string[] }) {
  input.consoleErrors.length = 0;
  input.failedRequests.length = 0;
}

async function assertNoUnexpectedConsoleOrNetwork(
  page: Page,
  label: string,
  input: { consoleErrors: string[]; failedRequests: string[] },
): Promise<void> {
  const serious = seriousConsoleLines(input.consoleErrors);
  expect(serious, `${label}: console errors on ${page.url()}\n${serious.join("\n")}`).toEqual([]);
  expect(
    input.failedRequests,
    `${label}: failed requests on ${page.url()}\n${input.failedRequests.join("\n")}`,
  ).toEqual([]);
}

async function assertNoGenericFailureUi(page: Page, label: string): Promise<void> {
  await expect(page.getByText(/Application error/i), `${label}: application error surface`).toHaveCount(0);
  await expect(page.getByRole("heading", { name: /^Just a moment$/i }), `${label}: loading fallback heading`).toHaveCount(0);
  await expect(page.getByRole("heading", { name: /^Page not found$/i }), `${label}: 404 heading`).toHaveCount(0);
  await expect(page.locator('[data-testid$="fallback"]'), `${label}: fallback test ids`).toHaveCount(0);
}

async function waitForMeaningfulContent(page: Page, label: string): Promise<ContentSnapshot> {
  await page.waitForFunction(
    () => {
      const root =
        document.querySelector("#nn-learner-main") ??
        document.querySelector("article") ??
        document.querySelector("main");
      if (!(root instanceof HTMLElement)) return false;
      const style = window.getComputedStyle(root);
      if (style.display === "none" || style.visibility === "hidden") return false;
      return (root.innerText ?? "").trim().length > 50;
    },
    undefined,
    { timeout: CONTENT_READY_TIMEOUT_MS },
  );

  const snapshot = await page.evaluate(() => {
    const candidates = ["#nn-learner-main", "article", "main"];
    for (const selector of candidates) {
      const root = document.querySelector(selector);
      if (!(root instanceof HTMLElement)) continue;
      const textLength = (root.innerText ?? "").trim().length;
      if (textLength > 0) return { selector, textLength };
    }
    return { selector: "(none)", textLength: 0 };
  });

  expect(
    snapshot.textLength,
    `${label}: expected meaningful content within ${CONTENT_READY_TIMEOUT_MS}ms on ${page.url()}`,
  ).toBeGreaterThan(50);
  return snapshot;
}

async function assertExpectedPath(
  page: Page,
  label: string,
  predicate: (url: URL) => boolean,
  expectedDescription: string,
): Promise<void> {
  const url = new URL(page.url());
  expect(predicate(url), `${label}: unexpected redirect, expected ${expectedDescription}, got ${url.pathname}${url.search}`).toBe(true);
  expect(url.pathname, `${label}: should not redirect to login`).not.toMatch(/^\/login(?:\/|$)/i);
}

async function assertMarketingHeaderStable(page: Page, label: string): Promise<void> {
  await expectMarketingPublicShell(page);
  await page.locator("body").waitFor({ state: "visible", timeout: CONTENT_READY_TIMEOUT_MS });
  const header = page.locator('[data-nn-nav-mode="public"]').first();
  await expect(header, `${label}: marketing header visible`).toBeVisible({ timeout: CONTENT_READY_TIMEOUT_MS });
  await page.waitForTimeout(HEADER_STABILITY_WAIT_MS);
  await expect(header, `${label}: marketing header stayed visible after hydration`).toBeVisible({ timeout: 1_000 });
}

async function assertLearnerShellStable(page: Page, label: string): Promise<void> {
  const learnerShell = page.getByTestId("learner-shell");
  const learnerNav = learnerShellStudyNavigation(page);
  await expect(learnerShell, `${label}: learner shell visible`).toBeVisible({ timeout: CONTENT_READY_TIMEOUT_MS });
  await expect(learnerNav, `${label}: learner navigation visible`).toBeVisible({ timeout: CONTENT_READY_TIMEOUT_MS });
  await page.waitForTimeout(800);
  await expect(learnerShell, `${label}: learner shell stable after hydration`).toBeVisible({ timeout: 1_000 });
  await expect(learnerNav, `${label}: learner nav stable after hydration`).toBeVisible({ timeout: 1_000 });
}

async function assertNoRestrictedMarketingLinks(page: Page, label: string): Promise<void> {
  const forbidden = await page.evaluate(() => {
    const roots = Array.from(document.querySelectorAll("main, article"));
    const links: Array<{ href: string; text: string }> = [];
    for (const root of roots) {
      for (const anchor of root.querySelectorAll<HTMLAnchorElement>("a[href]")) {
        const raw = anchor.getAttribute("href")?.trim() ?? "";
        if (!raw.startsWith("/")) continue;
        if (/^\/(?:app|admin|api)(?:\/|$)/i.test(raw)) {
          links.push({
            href: raw,
            text: (anchor.textContent ?? "").replace(/\s+/g, " ").trim().slice(0, 160) || "[no text]",
          });
        }
      }
    }
    return links;
  });

  expect(
    forbidden,
    `${label}: marketing content should not link into restricted surfaces on ${page.url()}\n${JSON.stringify(forbidden, null, 2)}`,
  ).toEqual([]);
}

async function gotoAndAssertStep(
  page: Page,
  label: string,
  href: string,
  input: {
    consoleErrors: string[];
    failedRequests: string[];
    expectedPath: (url: URL) => boolean;
    expectedDescription: string;
    marketingContext?: boolean;
    learnerShell?: boolean;
  },
): Promise<ContentSnapshot> {
  clearObserverBuffers(input);
  const res = await page.goto(href, { waitUntil: "domcontentloaded", timeout: 120_000 });
  expect(res?.ok(), `${label}: expected 2xx for ${href}, got ${res?.status()}`).toBeTruthy();
  await assertExpectedPath(page, label, input.expectedPath, input.expectedDescription);
  if (input.marketingContext) {
    await assertMarketingHeaderStable(page, label);
  }
  if (input.learnerShell) {
    await assertLearnerShellStable(page, label);
  }
  const snapshot = await waitForMeaningfulContent(page, label);
  await assertNoGenericFailureUi(page, label);
  if (input.marketingContext) {
    await assertNoRestrictedMarketingLinks(page, label);
  }
  await assertNoUnexpectedConsoleOrNetwork(page, label, input);
  return snapshot;
}

test.use({ storageState: { cookies: [], origins: [] } });

test.describe("Paid user — navigation paths contract", () => {
  test("marketing + learner core routes stay reliable, blank-free, and crawl-safe", async ({ page, baseURL }, testInfo) => {
    test.setTimeout(360_000);
    requireOrigin(baseURL);

    const creds = getQaPaidCredentials();
    test.skip(!creds, "Set E2E_PAID_EMAIL + E2E_PAID_PASSWORD (or QA_PAID_* / PLAYWRIGHT_TEST_*)");

    const observers = attachPageObservers(page, { profile: "public", captureConsoleContext: true });
    const visited: Array<{ step: string; url: string; selector: string; textLength: number }> = [];
    const recordVisit = (step: string, snapshot: ContentSnapshot) => {
      visited.push({ step, url: page.url(), selector: snapshot.selector, textLength: snapshot.textLength });
    };

    try {
      await page.setViewportSize({ width: 1440, height: 900 });
      await loginWithCredentials(page, creds!.email, creds!.password);

      recordVisit(
        "marketing-home",
        await gotoAndAssertStep(page, "marketing-home", "/", {
          ...observers,
          expectedPath: (url) => url.pathname === "/",
          expectedDescription: "/",
          marketingContext: true,
        }),
      );

      recordVisit(
        "pricing",
        await gotoAndAssertStep(page, "pricing", "/pricing", {
          ...observers,
          expectedPath: (url) => url.pathname === "/pricing",
          expectedDescription: "/pricing",
          marketingContext: true,
        }),
      );

      const marketingLessonPath = defaultMarketingLessonPath();
      const marketingLesson = await gotoAndAssertStep(page, "marketing-lesson", marketingLessonPath, {
        ...observers,
        expectedPath: (url) => url.pathname === marketingLessonPath,
        expectedDescription: marketingLessonPath,
        marketingContext: true,
      });
      await expect(page.locator(LESSON_ACCESS_ASIDE), "paid marketing lesson must not show paywall aside").toHaveCount(0);
      await expect(page.getByText(/^Free preview$/i), "paid marketing lesson must not show preview label").toHaveCount(0);
      expect(marketingLesson.textLength, "paid marketing lesson should show full lesson content").toBeGreaterThan(1_000);
      recordVisit("marketing-lesson", marketingLesson);

      const appHome = await gotoAndAssertStep(page, "app-home", "/app", {
        ...observers,
        expectedPath: (url) => url.pathname === "/app",
        expectedDescription: "/app",
        learnerShell: true,
      });
      await expect(page.locator('[data-nn-nav-mode="public"]'), "marketing nav should not reappear after entering /app").toHaveCount(0);
      recordVisit("app-home", appHome);

      const lessonsHub = await gotoAndAssertStep(page, "app-lessons", paidLessonsHubUrl(), {
        ...observers,
        expectedPath: (url) => url.pathname === "/app/lessons",
        expectedDescription: "/app/lessons",
        learnerShell: true,
      });
      recordVisit("app-lessons", lessonsHub);

      clearObserverBuffers(observers);
      const firstLessonLink = page.locator(LESSON_HUB_CARD_LINKS).first();
      await expect(firstLessonLink, "app-lessons: first lesson link visible").toBeVisible({ timeout: CONTENT_READY_TIMEOUT_MS });
      await firstLessonLink.click();
      await page.waitForLoadState("domcontentloaded");
      await assertExpectedPath(
        page,
        "app-lesson-detail",
        (url) => /^\/app\/lessons\/[^/?#]+$/i.test(url.pathname),
        "/app/lessons/:id",
      );
      await assertLearnerShellStable(page, "app-lesson-detail");
      const lessonDetail = await waitForMeaningfulContent(page, "app-lesson-detail");
      await expectNoSubscriptionPaywall(page, "app-lesson-detail");
      await expect(page.locator(LESSON_ACCESS_ASIDE), "paid app lesson must not show lesson access aside").toHaveCount(0);
      expect(lessonDetail.textLength, "paid app lesson should render a full lesson body").toBeGreaterThan(1_000);
      await assertNoGenericFailureUi(page, "app-lesson-detail");
      await assertNoUnexpectedConsoleOrNetwork(page, "app-lesson-detail", observers);
      recordVisit("app-lesson-detail", lessonDetail);

      const flashcards = await gotoAndAssertStep(page, "app-flashcards", paidFlashcardsHubUrl(), {
        ...observers,
        expectedPath: (url) => url.pathname === "/app/flashcards",
        expectedDescription: "/app/flashcards",
        learnerShell: true,
      });
      recordVisit("app-flashcards", flashcards);

      const questions = await gotoAndAssertStep(page, "app-questions", paidQuestionsHubUrl(), {
        ...observers,
        expectedPath: (url) => url.pathname === "/app/questions",
        expectedDescription: "/app/questions",
        learnerShell: true,
      });
      recordVisit("app-questions", questions);

      const practiceTests = await gotoAndAssertStep(
        page,
        "app-practice-tests-cat",
        `/app/practice-tests?cat=1&pathwayId=${encodeURIComponent(PAID_E2E_DEFAULT_PATHWAY_ID)}`,
        {
          ...observers,
          expectedPath: (url) => url.pathname === "/app/practice-tests" && url.searchParams.get("cat") === "1",
          expectedDescription: "/app/practice-tests?cat=1",
          learnerShell: true,
        },
      );
      recordVisit("app-practice-tests-cat", practiceTests);

      const account = await gotoAndAssertStep(page, "app-account", "/app/account", {
        ...observers,
        expectedPath: (url) => url.pathname === "/app/account" || url.pathname === "/app/account/overview",
        expectedDescription: "/app/account or /app/account/overview",
        learnerShell: true,
      });
      recordVisit("app-account", account);

      await expect(learnerAppMainLandmark(page), "final learner main should remain visible").toBeVisible({
        timeout: CONTENT_READY_TIMEOUT_MS,
      });

      await testInfo.attach("paid-user-navigation-paths.json", {
        body: Buffer.from(
          JSON.stringify(
            {
              visited,
              finalUrl: page.url(),
            },
            null,
            2,
          ),
        ),
        contentType: "application/json",
      });
    } finally {
      observers.dispose();
    }
  });
});
