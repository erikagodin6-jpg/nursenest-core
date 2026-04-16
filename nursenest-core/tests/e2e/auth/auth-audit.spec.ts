/**
 * Auth audit: public auth pages, validation, optional real login/logout, guest redirects.
 *
 * Outputs: test-results/auth-audit/auth-audit-report.{json,md}
 *
 * Run: `npx playwright test tests/e2e/auth/auth-audit.spec.ts --project=chromium`
 *
 * Optional credentials (any one): `E2E_FREE_EMAIL` + `E2E_FREE_PASSWORD`, or `E2E_PAID_EMAIL` + `E2E_PAID_PASSWORD`,
 * or `PLAYWRIGHT_TEST_EMAIL` + `PLAYWRIGHT_TEST_PASSWORD`.
 */
import { expect, test } from "@playwright/test";
import {
  absoluteUrl,
  attachMainFrameNavChain,
  captureAuthFailure,
  getAuthAuditCredentials,
  hasRedirectLoop,
  writeAuthAuditReport,
  type AuthAuditScenario,
} from "../helpers/auth-audit";
import { attachPageObservers, logObserverDiagnostics } from "../helpers/attach-observers";
import { getE2eBaseURL } from "../helpers/e2e-env";
import { isLearnerShell } from "../helpers/learner-shell";

const base = getE2eBaseURL();
const scenarios: AuthAuditScenario[] = [];

/** Auth card sits in `main.nn-marketing-x` (layout may include another `main` for shell). */
function authMain(p: import("@playwright/test").Page) {
  return p.locator("main.nn-marketing-x");
}

test.describe.configure({ mode: "serial" });
test.use({ trace: "off" });

test.afterAll(async () => {
  await writeAuthAuditReport(scenarios, base);
});

function pass(id: string, detail: string, redirectChain?: string[]) {
  scenarios.push({ id, pass: true, detail, redirectChain });
}

async function fail(
  id: string,
  err: unknown,
  page: import("@playwright/test").Page,
  testInfo: import("@playwright/test").TestInfo,
  nav?: ReturnType<typeof attachMainFrameNavChain>,
): Promise<never> {
  const shot = await captureAuthFailure(page, testInfo, id).catch(() => undefined);
  scenarios.push({
    id,
    pass: false,
    detail: err instanceof Error ? err.message : String(err),
    redirectChain: nav?.getChain(),
    screenshotPath: shot,
  });
  throw err instanceof Error ? err : new Error(String(err));
}

test("login page loads", async ({ page }, testInfo) => {
  const o = attachPageObservers(page);
  const nav = attachMainFrameNavChain(page);
  try {
    const r = await page.goto(absoluteUrl("/login", base), { waitUntil: "domcontentloaded", timeout: 120_000 });
    expect(r?.ok(), `HTTP ${r?.status()}`).toBeTruthy();
    await expect(authMain(page)).toBeVisible({ timeout: 30_000 });
    await expect(authMain(page).getByRole("heading", { level: 1 })).toBeVisible();
    const text = await authMain(page).innerText();
    expect(text.trim().length, "blank or near-blank main").toBeGreaterThan(50);
    const d = await logObserverDiagnostics(o, "auth-audit-login-load");
    expect(d.consoleErrors, d.consoleErrors.join("\n")).toEqual([]);
    expect(d.failedRequests, d.failedRequests.join("\n")).toEqual([]);
    pass("login-page-loads", `HTTP ${r?.status()}, main text ~${text.trim().length} chars`, nav.getChain());
  } catch (e) {
    await fail("login-page-loads", e, page, testInfo, nav);
  } finally {
    o.dispose();
  }
});

test("signup page loads", async ({ page }, testInfo) => {
  const o = attachPageObservers(page);
  const nav = attachMainFrameNavChain(page);
  try {
    const r = await page.goto(absoluteUrl("/signup", base), { waitUntil: "domcontentloaded", timeout: 120_000 });
    expect(r?.ok()).toBeTruthy();
    await expect(authMain(page)).toBeVisible({ timeout: 30_000 });
    const text = await authMain(page).innerText();
    expect(text.trim().length).toBeGreaterThan(40);
    const d = await logObserverDiagnostics(o, "auth-audit-signup-load");
    expect(d.consoleErrors).toEqual([]);
    expect(d.failedRequests).toEqual([]);
    pass("signup-page-loads", `HTTP ${r?.status()}`, nav.getChain());
  } catch (e) {
    await fail("signup-page-loads", e, page, testInfo, nav);
  } finally {
    o.dispose();
  }
});

test("forgot password page loads", async ({ page }, testInfo) => {
  const o = attachPageObservers(page);
  const nav = attachMainFrameNavChain(page);
  try {
    const r = await page.goto(absoluteUrl("/forgot-password", base), { waitUntil: "domcontentloaded", timeout: 120_000 });
    expect(r?.ok()).toBeTruthy();
    await expect(authMain(page)).toBeVisible({ timeout: 30_000 });
    await expect(authMain(page).getByRole("heading", { level: 1 })).toBeVisible();
    const d = await logObserverDiagnostics(o, "auth-audit-forgot-load");
    expect(d.consoleErrors).toEqual([]);
    expect(d.failedRequests).toEqual([]);
    pass("forgot-password-page-loads", `HTTP ${r?.status()}`, nav.getChain());
  } catch (e) {
    await fail("forgot-password-page-loads", e, page, testInfo, nav);
  } finally {
    o.dispose();
  }
});

test("login form validation (empty required fields)", async ({ page }, testInfo) => {
  const nav = attachMainFrameNavChain(page);
  try {
    await page.goto(absoluteUrl("/login", base), { waitUntil: "domcontentloaded", timeout: 120_000 });
    await page.locator("#login-identifier").fill("");
    await page.locator("#login-password").fill("");
    await page.getByRole("button", { name: /^Sign In$/i }).click();
    const invalid = await page.locator("#login-identifier:invalid, #login-password:invalid").count();
    expect(invalid).toBeGreaterThan(0);
    pass("login-form-required-validation", "HTML5 :invalid on empty required inputs", nav.getChain());
  } catch (e) {
    await fail("login-form-required-validation", e, page, testInfo, nav);
  }
});

test("invalid credentials show error (no success redirect)", async ({ page }, testInfo) => {
  const o = attachPageObservers(page, { profile: "public" });
  const nav = attachMainFrameNavChain(page);
  try {
    await page.goto(absoluteUrl("/login", base), { waitUntil: "domcontentloaded", timeout: 120_000 });
    await page.locator("#login-identifier").fill("auth-audit-invalid@nursenest.test");
    await page.locator("#login-password").fill("definitely-wrong-password-e2e");
    await page.getByRole("button", { name: /^Sign In$/i }).click();
    await expect(authMain(page)).toContainText(
      /invalid|incorrect|unable|sign in|credentials/i,
      { timeout: 25_000 },
    );
    expect(
      isLearnerShell(new URL(page.url()).pathname),
      "invalid login must not reach learner shell",
    ).toBe(false);
    const d = await logObserverDiagnostics(o, "auth-audit-invalid-login");
    expect(d.consoleErrors).toEqual([]);
    expect(d.failedRequests).toEqual([]);
    pass(
      "invalid-login-error-message",
      "Stayed off /app; error copy visible in main",
      nav.getChain(),
    );
  } catch (e) {
    await fail("invalid-login-error-message", e, page, testInfo, nav);
  } finally {
    o.dispose();
  }
});

test("guest /app redirects to login with callback (no loop)", async ({ browser }, testInfo) => {
  const ctx = await browser.newContext();
  const page = await ctx.newPage();
  const nav = attachMainFrameNavChain(page);
  try {
    await page.goto(absoluteUrl("/app", base), { waitUntil: "domcontentloaded", timeout: 90_000 });
    const finalUrl = page.url();
    const chain = nav.getChain();
    expect(hasRedirectLoop(chain), `loop? chain: ${chain.join(" | ")}`).toBe(false);
    expect(finalUrl, "expected login interstitial").toMatch(/\/login/i);
    expect(finalUrl, "expected callback preservation").toMatch(/callbackUrl=/i);
    pass("guest-app-redirects-to-login", `final: ${finalUrl}`, chain);
  } catch (e) {
    const shot = await captureAuthFailure(page, testInfo, "guest-app");
    scenarios.push({
      id: "guest-app-redirects-to-login",
      pass: false,
      detail: e instanceof Error ? e.message : String(e),
      redirectChain: nav.getChain(),
      screenshotPath: shot,
    });
    throw e;
  } finally {
    await ctx.close();
  }
});

async function clickSignInAndWaitForUrl(
  page: import("@playwright/test").Page,
  predicate: (url: URL) => boolean,
  expectationLabel: string,
) {
  await page.getByRole("button", { name: /^Sign In$/i }).click();
  await expect
    .poll(
      async () => {
        const u = new URL(page.url());
        if (predicate(u)) return "ok";
        /** `login-form.tsx` — failed credential sign-in */
        const inlineErr = await authMain(page).locator("p.text-red-600").first().innerText().catch(() => "");
        if (inlineErr.trim()) {
          throw new Error(`Login rejected (${expectationLabel}): ${inlineErr.trim()}`);
        }
        return "wait";
      },
      { timeout: 90_000 },
    )
    .toBe("ok");
}

test("valid login, callback URL, logout, guest redirect (needs credentials)", async ({ page }, testInfo) => {
  const creds = getAuthAuditCredentials();
  if (!creds) {
    pass(
      "credentials-flow-skipped",
      "No E2E_FREE_* / E2E_PAID_* / PLAYWRIGHT_TEST_* — skipped valid login, logout, callback",
    );
    return;
  }

  const o = attachPageObservers(page, { profile: "app" });
  const nav = attachMainFrameNavChain(page);
  try {
    /* 1) Plain login → /app */
    await page.goto(absoluteUrl("/login", base), { waitUntil: "domcontentloaded", timeout: 120_000 });
    await page.locator("#login-identifier").fill(creds.email);
    await page.locator("#login-password").fill(creds.password);
    await clickSignInAndWaitForUrl(
      page,
      (u) => isLearnerShell(u.pathname),
      "plain login → /app",
    );
    pass("valid-login-reaches-app", page.url(), nav.getChain());

    /* 2) Learner shell has content */
    const mainText = await page.locator("main").first().innerText().catch(() => "");
    expect(mainText.trim().length).toBeGreaterThan(20);
    pass("authenticated-app-loads", `main length ${mainText.trim().length}`, nav.getChain());

    /* 2b) Authenticated surfaces expose a real Sign out control (NextAuth) */
    await expect(page.getByRole("button", { name: /^Sign out$/i }).first()).toBeVisible({ timeout: 20_000 });
    pass("sign-out-visible-when-authenticated", "At least one Sign out button visible on learner shell", nav.getChain());

    /* 2c) Desktop: account menu also exposes Sign out (not only bottom nav / compact strip) */
    await page.setViewportSize({ width: 1280, height: 800 });
    const accountMenuBtn = page.locator('button[aria-haspopup="menu"]').first();
    await accountMenuBtn.click({ timeout: 20_000 });
    await expect(page.getByRole("menuitem", { name: /^Sign out$/i })).toBeVisible({ timeout: 15_000 });
    await page.keyboard.press("Escape");
    pass("desktop-account-menu-sign-out", "User bar menu lists Sign out", nav.getChain());

    /* 3) Logout from mobile bottom nav (ensures Sign out is not menu-only on small screens) */
    await page.setViewportSize({ width: 390, height: 844 });
    const bottomNav = page.getByRole("navigation", { name: "Learner bottom navigation" });
    await expect(bottomNav.getByRole("button", { name: /^Sign out$/i })).toBeVisible({ timeout: 20_000 });
    pass("mobile-bottom-nav-sign-out-visible", "Learner bottom nav exposes Sign out", nav.getChain());
    await bottomNav.getByRole("button", { name: /^Sign out$/i }).click();
    await expect(page).toHaveURL(/\/login/i, { timeout: 45_000 });
    pass("logout-redirect-login", `After signOut: ${page.url()}`, nav.getChain());

    /* 4) Guest cannot open /app (must run before callback login re-authenticates) */
    nav.clear();
    await page.goto(absoluteUrl("/app", base), { waitUntil: "domcontentloaded", timeout: 90_000 });
    expect(hasRedirectLoop(nav.getChain())).toBe(false);
    expect(page.url()).toMatch(/\/login/i);
    pass("post-logout-guest-app-requires-login", `final: ${page.url()}`, nav.getChain());

    /* 5) Callback URL: login → /faq */
    nav.clear();
    await page.goto(absoluteUrl(`/login?callbackUrl=${encodeURIComponent("/faq")}`, base), {
      waitUntil: "domcontentloaded",
      timeout: 120_000,
    });
    await page.locator("#login-identifier").fill(creds.email);
    await page.locator("#login-password").fill(creds.password);
    await clickSignInAndWaitForUrl(
      page,
      (u) => /\/faq(\/|$|\?)/.test(`${u.pathname}${u.search}`),
      "callback login → /faq",
    );
    pass("login-with-callback-redirect", page.url(), nav.getChain());

    const d = await logObserverDiagnostics(o, "auth-audit-credentials-flow");
    expect(d.consoleErrors).toEqual([]);
    expect(d.failedRequests).toEqual([]);
  } catch (e) {
    await fail("credentials-login-callback-logout", e, page, testInfo, nav);
  } finally {
    o.dispose();
  }
});
