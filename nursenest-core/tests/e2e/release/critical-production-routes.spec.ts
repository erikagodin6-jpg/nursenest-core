import { expect, test, type Page } from "@playwright/test";
import { attachPageObservers } from "../helpers/attach-observers";
import { attachSmokeProductionFailure } from "../helpers/smoke-production-diagnostics";
import { getQaPaidCredentials, hasAdminE2eCredentials, getAdminE2eCredentials } from "../helpers/smoke-credentials";
import { loginWithCredentials } from "../helpers/learner-login";
import { expectNoSubscriptionPaywall } from "../helpers/paid-surface-assertions";
import { defaultMarketingLessonPath, LESSON_ACCESS_ASIDE } from "../helpers/marketing-lesson-paywall";
import { expectPaidLearnerShellReady, learnerAppMainLandmark } from "../helpers/paid-learner-shell";
import { learnerShellStudyNavigation } from "../helpers/learner-shell-locators";
import { MARKETING_PUBLIC_SELECTOR } from "../helpers/navigation-e2e";

const FATAL_ROUTE_TEXT =
  /application error|internal server error|this page could not be found|page not found|something went wrong|bootstrap: request handlers not ready|unhandled runtime error/i;

function attachServerErrorObserver(page: Page, origin: string) {
  const serverErrors: string[] = [];
  const onResponse = (response: import("@playwright/test").Response) => {
    if (response.status() < 500) return;
    if (!response.url().startsWith(origin)) return;
    serverErrors.push(`${response.status()} ${response.request().method()} ${response.url()}`);
  };
  page.on("response", onResponse);
  return {
    serverErrors,
    dispose: () => page.off("response", onResponse),
  };
}

async function expectNoFatalCrashSurface(page: Page, label: string) {
  const body = await page.locator("body").innerText().catch(() => "");
  expect(body, `${label} rendered fatal route copy`).not.toMatch(FATAL_ROUTE_TEXT);
}

async function expectMainHasContent(page: Page, label: string, minChars: number) {
  const main = page.locator("main").first();
  await expect(main, `${label} main should be visible`).toBeVisible({ timeout: 60_000 });
  const text = (await main.innerText().catch(() => "")).trim();
  expect(text.length, `${label} main content should not be blank`).toBeGreaterThan(minChars);
}

async function verifyPublicRoute(
  page: Page,
  origin: string,
  path: string,
  opts?: { minMainChars?: number; extra?: (page: Page) => Promise<void> },
) {
  const observers = attachPageObservers(page, { profile: "public", captureConsoleContext: true });
  const responseObserver = attachServerErrorObserver(page, origin);
  try {
    const response = await page.goto(path, { waitUntil: "domcontentloaded", timeout: 90_000 });
    expect(response?.status(), `${path} should not return 5xx`).toBeLessThan(500);
    await expect(page.locator(MARKETING_PUBLIC_SELECTOR).first(), `${path} should render public shell`).toBeVisible({
      timeout: 60_000,
    });
    await expectMainHasContent(page, path, opts?.minMainChars ?? 40);
    await expectNoFatalCrashSurface(page, path);
    await page.waitForLoadState("networkidle", { timeout: 20_000 }).catch(() => {});
    await expect(page.locator("main").first(), `${path} main should persist after hydration`).toBeVisible({ timeout: 15_000 });
    if (opts?.extra) await opts.extra(page);
    expect(responseObserver.serverErrors, `${path} should not emit 5xx subrequests`).toEqual([]);
    expect(observers.consoleErrors, `${path} console errors`).toEqual([]);
    expect(observers.failedRequests, `${path} failed requests`).toEqual([]);
  } catch (error) {
    await attachSmokeProductionFailure(test.info(), page, observers, `critical-route-${path.replaceAll(/[^a-z0-9]+/gi, "-")}`);
    throw error;
  } finally {
    responseObserver.dispose();
    observers.dispose();
  }
}

async function verifyPaidLearnerRoute(
  page: Page,
  origin: string,
  path: string,
  opts?: { minMainChars?: number; expectedPathname?: RegExp; extra?: (page: Page) => Promise<void> },
) {
  const creds = getQaPaidCredentials();
  test.skip(!creds, "Set QA_PAID_EMAIL + QA_PAID_PASSWORD (or E2E_PAID_* / PLAYWRIGHT_TEST_*)");
  const observers = attachPageObservers(page, { profile: "app", captureConsoleContext: true, probeAuthApi: true });
  const responseObserver = attachServerErrorObserver(page, origin);

  try {
    await loginWithCredentials(page, creds!.email, creds!.password);
    await page.goto(path, { waitUntil: "domcontentloaded", timeout: 90_000 });
    await expectPaidLearnerShellReady(page, path, { timeoutMs: 90_000 });
    await expectNoSubscriptionPaywall(page, path);
    if (opts?.expectedPathname) {
      await expect(page).toHaveURL(opts.expectedPathname, { timeout: 30_000 });
    }
    const main = learnerAppMainLandmark(page);
    await expect(main, `${path} learner main should be visible`).toBeVisible({ timeout: 60_000 });
    const text = (await main.innerText().catch(() => "")).trim();
    expect(text.length, `${path} learner main should not be blank`).toBeGreaterThan(opts?.minMainChars ?? 80);
    await expectNoFatalCrashSurface(page, path);
    await page.waitForLoadState("networkidle", { timeout: 25_000 }).catch(() => {});
    await expect(learnerShellStudyNavigation(page), `${path} learner nav should persist after hydration`).toBeVisible({
      timeout: 20_000,
    });
    if (opts?.extra) await opts.extra(page);
    expect(responseObserver.serverErrors, `${path} should not emit 5xx subrequests`).toEqual([]);
    expect(observers.consoleErrors, `${path} console errors`).toEqual([]);
    expect(observers.failedRequests, `${path} failed requests`).toEqual([]);
  } catch (error) {
    await attachSmokeProductionFailure(test.info(), page, observers, `critical-route-${path.replaceAll(/[^a-z0-9]+/gi, "-")}`);
    throw error;
  } finally {
    responseObserver.dispose();
    observers.dispose();
  }
}

test.describe("Critical production routes", () => {
  test("guest /", async ({ page, baseURL }) => {
    const origin = new URL(baseURL ?? "http://127.0.0.1:3000").origin;
    await verifyPublicRoute(page, origin, "/", { minMainChars: 80 });
  });

  test("guest /login", async ({ page, baseURL }) => {
    const origin = new URL(baseURL ?? "http://127.0.0.1:3000").origin;
    await verifyPublicRoute(page, origin, "/login", {
      minMainChars: 40,
      extra: async (p) => {
        await expect(p.locator("#login-identifier")).toBeVisible({ timeout: 20_000 });
        await expect(p.locator("#login-password")).toBeVisible({ timeout: 20_000 });
      },
    });
  });

  test("guest /signup", async ({ page, baseURL }) => {
    const origin = new URL(baseURL ?? "http://127.0.0.1:3000").origin;
    await verifyPublicRoute(page, origin, "/signup", {
      minMainChars: 40,
      extra: async (p) => {
        await expect(p.locator('form')).toBeVisible({ timeout: 20_000 });
      },
    });
  });

  test("guest public lesson preview", async ({ page, baseURL }) => {
    const origin = new URL(baseURL ?? "http://127.0.0.1:3000").origin;
    await verifyPublicRoute(page, origin, defaultMarketingLessonPath(), {
      minMainChars: 120,
      extra: async (p) => {
        await expect(p.locator(LESSON_ACCESS_ASIDE)).toBeVisible({ timeout: 30_000 });
      },
    });
  });

  test("paid /app", async ({ page, baseURL }) => {
    const origin = new URL(baseURL ?? "http://127.0.0.1:3000").origin;
    await verifyPaidLearnerRoute(page, origin, "/app", { expectedPathname: /\/app(?:\?.*)?$/, minMainChars: 80 });
  });

  test("paid /app/lessons", async ({ page, baseURL }) => {
    const origin = new URL(baseURL ?? "http://127.0.0.1:3000").origin;
    await verifyPaidLearnerRoute(page, origin, "/app/lessons", {
      expectedPathname: /\/app\/lessons(?:\?.*)?$/,
      minMainChars: 80,
    });
  });

  test("paid /app/flashcards", async ({ page, baseURL }) => {
    const origin = new URL(baseURL ?? "http://127.0.0.1:3000").origin;
    await verifyPaidLearnerRoute(page, origin, "/app/flashcards", {
      expectedPathname: /\/app\/flashcards(?:\?.*)?$/,
      minMainChars: 60,
    });
  });

  test("paid /app/practice-tests?cat=1", async ({ page, baseURL }) => {
    const origin = new URL(baseURL ?? "http://127.0.0.1:3000").origin;
    await verifyPaidLearnerRoute(page, origin, "/app/practice-tests?cat=1", {
      expectedPathname: /\/app\/practice-tests(?:\?.*)?$/,
      minMainChars: 60,
    });
  });

  test("admin /admin shell", async ({ page }) => {
    test.skip(!hasAdminE2eCredentials(), "Set E2E_ADMIN_EMAIL and E2E_ADMIN_PASSWORD");
    const creds = getAdminE2eCredentials();
    if (!creds) return;

    const origin = new URL(page.context()._options.baseURL ?? "http://127.0.0.1:3000").origin;
    const observers = attachPageObservers(page, { profile: "app", captureConsoleContext: true, probeAuthApi: true });
    const responseObserver = attachServerErrorObserver(page, origin);
    try {
      await loginWithCredentials(page, creds.email, creds.password);
      await page.goto("/admin", { waitUntil: "domcontentloaded", timeout: 90_000 });
      await expect(page).toHaveURL(/\/admin(?:\/.*)?(?:\?.*)?$/, { timeout: 30_000 });
      await expect(page.locator("main").first()).toBeVisible({ timeout: 60_000 });
      const text = (await page.locator("main").first().innerText().catch(() => "")).trim();
      expect(text.length, "/admin main content should not be blank").toBeGreaterThan(40);
      await expectNoFatalCrashSurface(page, "/admin");
      await expect(page.getByRole("heading", { name: /Admin/i }).first()).toBeVisible({ timeout: 30_000 });
      expect(responseObserver.serverErrors, "/admin should not emit 5xx subrequests").toEqual([]);
      expect(observers.consoleErrors, "/admin console errors").toEqual([]);
      expect(observers.failedRequests, "/admin failed requests").toEqual([]);
    } catch (error) {
      await attachSmokeProductionFailure(test.info(), page, observers, "critical-route-admin");
      throw error;
    } finally {
      responseObserver.dispose();
      observers.dispose();
    }
  });
});
