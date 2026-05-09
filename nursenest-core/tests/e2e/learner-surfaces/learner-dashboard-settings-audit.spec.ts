/**
 * Learner dashboard / account / settings hygiene — canonical redirects, key surfaces,
 * and guards against obvious untranslated marketing keys in main content.
 *
 * Guest requests to learner aliases hit the auth gate first (`/login?callbackUrl=…` with the **requested**
 * alias path preserved — not canonical `/app` routes until after sign-in). Paid QA credentials are required
 * for authenticated sections (skipped when unset).
 *
 * Screenshots: set `LEARNER_UI_AUDIT_SCREENSHOTS=1` to write under `reports/learner-dashboard-settings-ui-audit-2026-05-08/screenshots/`.
 *
 * Run: `cd nursenest-core && npm run test:e2e:learner-surfaces-smoke` (this file matches that config).
 */
import { expect, test, devices, type Page } from "@playwright/test";
import { loginWithCredentials } from "../helpers/learner-login";
import { getQaPaidCredentials } from "../helpers/smoke-credentials";
import { expectPaidLearnerShellReady, learnerAppMainLandmark } from "../helpers/paid-learner-shell";
import { requireOrigin } from "../helpers/navigation-e2e";
import { mkdirSync, existsSync } from "node:fs";
import { join } from "node:path";

const RAW_KEY_LIKE = /\blearner\.[a-z][a-z0-9]*(?:\.[a-z][a-z0-9]*){2,}\b/i;

function isLoginPathname(pathname: string): boolean {
  return pathname === "/login" || pathname.endsWith("/login");
}

/**
 * Normalize `callbackUrl` from the login query string: value may be path-only (`/app/dashboard`)
 * or an absolute same-origin URL (`http://127.0.0.1:3000/app/dashboard`). Compare pathname (+ search),
 * not host, so localhost vs 127.0.0.1 does not fail the assertion.
 */
function resolvedCallbackAppPath(callbackParam: string | null): string {
  expect(callbackParam, "login redirect must include callbackUrl").toBeTruthy();
  const raw = decodeURIComponent(callbackParam!);
  try {
    const inner = new URL(raw);
    return `${inner.pathname}${inner.search}`;
  } catch {
    return raw.startsWith("/") ? raw : `/${raw}`;
  }
}

async function expectGuestAliasHitsAuthGate(page: Page, aliasPath: string) {
  await page.goto(aliasPath, { waitUntil: "commit" });
  await page.waitForURL(
    (url) => {
      const u = new URL(url);
      return isLoginPathname(u.pathname);
    },
    { timeout: 30_000 },
  );
  const u = new URL(page.url());
  expect(isLoginPathname(u.pathname), `expected /login after requesting ${aliasPath}, got ${u.pathname}`).toBe(true);
  const cbPath = resolvedCallbackAppPath(u.searchParams.get("callbackUrl"));
  expect(cbPath, `callbackUrl should preserve requested alias path ${aliasPath}`).toBe(aliasPath);
  const body = await page.locator("body").innerText();
  expect(body, "login/auth surface should not expose raw i18n keys").not.toMatch(RAW_KEY_LIKE);
  const slug = aliasPath.replace(/^\//, "").replace(/\//g, "_");
  await maybeScreenshot(page, `guest-login-${slug}.png`);
}

const QA_PAID_SKIP_REASON =
  "Requires QA paid learner credentials: set QA_PAID_EMAIL + QA_PAID_PASSWORD (or E2E_PAID_* / PLAYWRIGHT_TEST_*) to verify signed-in surfaces and canonical alias redirects.";

const IPHONE_12 = devices["iPhone 12"];

function screenshotRoot() {
  return join(process.cwd(), "reports", "learner-dashboard-settings-ui-audit-2026-05-08", "screenshots");
}

async function maybeScreenshot(page: Page, name: string) {
  if (process.env.LEARNER_UI_AUDIT_SCREENSHOTS !== "1") return;
  const dir = screenshotRoot();
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
  await page.screenshot({ path: join(dir, name), fullPage: true });
}

async function expectMainHasNoRawKeys(page: Page) {
  const main = learnerAppMainLandmark(page);
  await expect(main).toBeVisible({ timeout: 60_000 });
  const text = await main.innerText();
  expect(text, "main landmark should not expose raw i18n key strings").not.toMatch(RAW_KEY_LIKE);
}

test.describe("Learner dashboard/settings — auth gate + callbackUrl (guest)", () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  test("/app/dashboard: guest hits login first; callbackUrl preserves alias", async ({ page }) => {
    await expectGuestAliasHitsAuthGate(page, "/app/dashboard");
  });

  test("/app/settings: guest hits login first; callbackUrl preserves alias", async ({ page }) => {
    await expectGuestAliasHitsAuthGate(page, "/app/settings");
  });

  test("/app/report-card: guest hits login first; callbackUrl preserves alias", async ({ page }) => {
    await expectGuestAliasHitsAuthGate(page, "/app/report-card");
  });
});

test.describe("Learner dashboard/settings — authenticated surfaces", () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  test("paid subscriber: dashboard, account hub, settings hub, billing, report card; nav links resolve", async ({
    page,
    baseURL,
  }) => {
    const creds = getQaPaidCredentials();
    test.skip(!creds, QA_PAID_SKIP_REASON);

    requireOrigin(baseURL);
    await loginWithCredentials(page, creds!.email, creds!.password);

    await page.goto("/app", { waitUntil: "domcontentloaded" });
    await expectPaidLearnerShellReady(page, "audit /app");
    await expectMainHasNoRawKeys(page);
    await maybeScreenshot(page, "dashboard-desktop.png");

    await page.goto("/app/account", { waitUntil: "domcontentloaded" });
    await expectPaidLearnerShellReady(page, "audit /app/account");
    await expect(page.getByTestId("learner-account-center-overview")).toBeVisible({ timeout: 60_000 });
    await expect(page.locator('a[href="/app/account/billing"]').first()).toBeVisible({ timeout: 30_000 });
    await expectMainHasNoRawKeys(page);

    await page.goto("/app/account/settings", { waitUntil: "domcontentloaded" });
    await expectPaidLearnerShellReady(page, "audit settings hub");
    await expect(page.getByTestId("learner-account-settings-hub")).toBeVisible({ timeout: 60_000 });
    await expectMainHasNoRawKeys(page);
    await maybeScreenshot(page, "settings-hub-desktop.png");

    await page.goto("/app/account/billing", { waitUntil: "domcontentloaded" });
    await expectPaidLearnerShellReady(page, "audit billing");
    await expectMainHasNoRawKeys(page);
    await maybeScreenshot(page, "billing-desktop.png");

    await page.goto("/app/account/report", { waitUntil: "domcontentloaded" });
    await expectPaidLearnerShellReady(page, "audit report");
    await expect(page.getByTestId("learner-performance-workspace-nav")).toBeVisible({ timeout: 60_000 });
    await expectMainHasNoRawKeys(page);
    await maybeScreenshot(page, "report-card-desktop.png");

    await page.emulateMedia({ colorScheme: "dark" });
    await page.goto("/app/account/settings", { waitUntil: "domcontentloaded" });
    await expectMainHasNoRawKeys(page);
    await maybeScreenshot(page, "settings-hub-dark-desktop.png");
  });

  test("paid subscriber: legacy aliases redirect to canonical routes after auth", async ({ page, baseURL }) => {
    const creds = getQaPaidCredentials();
    test.skip(!creds, QA_PAID_SKIP_REASON);

    requireOrigin(baseURL);
    await loginWithCredentials(page, creds!.email, creds!.password);

    await page.goto("/app/dashboard", { waitUntil: "commit" });
    await page.waitForURL(/\/app\/?(\?|$)/, { timeout: 30_000 });

    await page.goto("/app/settings", { waitUntil: "commit" });
    await page.waitForURL(/\/app\/account\/settings/, { timeout: 30_000 });

    await page.goto("/app/report-card", { waitUntil: "commit" });
    await page.waitForURL(/\/app\/account\/report/, { timeout: 30_000 });
  });
});

test.describe("Learner dashboard/settings — mobile viewport", () => {
  /** Avoid spreading preset devices here — that sets `defaultBrowserType` and conflicts with `--project=…`. */
  test.use({
    viewport: IPHONE_12.viewport,
    deviceScaleFactor: IPHONE_12.deviceScaleFactor,
    isMobile: IPHONE_12.isMobile,
    hasTouch: IPHONE_12.hasTouch,
    userAgent: IPHONE_12.userAgent,
    storageState: { cookies: [], origins: [] },
  });

  test("paid subscriber: core routes render without horizontal overflow", async ({ page }) => {
    const creds = getQaPaidCredentials();
    test.skip(!creds, QA_PAID_SKIP_REASON);

    await loginWithCredentials(page, creds!.email, creds!.password);

    for (const path of ["/app", "/app/account/settings", "/app/account/billing", "/app/account/report"]) {
      await page.goto(path, { waitUntil: "domcontentloaded" });
      await expectPaidLearnerShellReady(page, `mobile ${path}`);
      const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
      const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
      expect(scrollWidth, `${path} should not overflow horizontally`).toBeLessThanOrEqual(clientWidth + 2);
    }
    await maybeScreenshot(page, "dashboard-mobile.png");
  });
});
