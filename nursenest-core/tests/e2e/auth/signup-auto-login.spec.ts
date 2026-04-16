/**
 * Signup → auto-login (credentials `signIn` after `/api/signup` 201) → learner shell.
 *
 * **Email domain:** `QA_SIGNUP_EMAIL_DOMAIN` — must be allowed for real signups (not the reserved demo domain).
 * Catch-all inboxes work; see `tests/e2e/smoke/auth-signup-auto-login.spec.ts` (smoke pack) for the same gate.
 *
 * **Turnstile:** If `NEXT_PUBLIC_TURNSTILE_SITE_KEY` is set, the submit button stays disabled until captcha resolves
 * (`getByRole(...).toBeEnabled({ timeout: 90_000 })`); without a bypass token, CI/local may need an unstoppable key or unset Turnstile in E2E.
 *
 * Run (from `nursenest-core/`): `npx playwright test tests/e2e/auth/signup-auto-login.spec.ts`
 */
import { expect, test } from "@playwright/test";
import { attachPageObservers, logObserverDiagnostics } from "../helpers/attach-observers";
import { loginWithCredentials } from "../helpers/learner-login";
import { isLearnerShell } from "../helpers/learner-shell";
import { expectOnLearnerApp } from "../helpers/paid-surface-assertions";

test.use({ storageState: { cookies: [], origins: [] } });

function signupEmailDomain(): string | undefined {
  return process.env.QA_SIGNUP_EMAIL_DOMAIN?.trim() || undefined;
}

/** Same marketing-shell noise tolerances as `qa-login.spec.ts`. */
function isIgnorableAuthMarketingConsole(text: string): boolean {
  return (
    /favicon|ResizeObserver|Failed to load resource.*404.*\.ico/i.test(text) ||
    /hydration mismatch|hydrated but some attributes of the server rendered HTML/i.test(text) ||
    /\[marketing-i18n\]/i.test(text) ||
    /\[MarketingI18nProvider\]/i.test(text) ||
    /next-image-unconfigured-qualities|images\.qualities/i.test(text) ||
    /\[nursenest-core\].*marketing_message_key_missing/i.test(text) ||
    /webpack-hmr|WebSocket connection.*_next\/webpack-hmr/i.test(text)
  );
}

test.describe("Signup — auto-login", () => {
  test("creates a new user, signs in, and redirects to the learner app", async ({ page }, testInfo) => {
    const domain = signupEmailDomain();
    test.skip(
      !domain,
      "Set QA_SIGNUP_EMAIL_DOMAIN to an allowed catch-all domain for unique signup emails (see spec header).",
    );

    const observers = attachPageObservers(page, { profile: "app", probeAuthApi: true });
    const runId = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
    const email = `e2e.${runId}@${domain}`;
    const username = `e2e${runId.replace(/\W/g, "").slice(0, 22)}`;
    const password = `E2e1!Aa${runId.slice(-4)}`;

    try {
      await page.goto("/signup", { waitUntil: "domcontentloaded" });
      await expect(page.locator("main, [role='main']").first()).toBeVisible({ timeout: 30_000 });

      await page.locator('input[name="firstName"]').fill("E2E");
      await page.locator('input[name="lastName"]').fill("Signup");
      await page.locator('input[name="username"]').fill(username);
      await page.locator('input[name="email"]').fill(email);
      await page.locator('input[name="password"]').fill(password);

      const submit = page.getByRole("button", { name: /create account/i });
      await expect(submit).toBeEnabled({ timeout: 90_000 });

      const [signupRes] = await Promise.all([
        page.waitForResponse(
          (res) => {
            if (res.request().method() !== "POST") return false;
            try {
              return new URL(res.url()).pathname.endsWith("/api/signup");
            } catch {
              return false;
            }
          },
          { timeout: 120_000 },
        ),
        submit.click(),
      ]);
      expect(signupRes.status(), "account created (POST /api/signup)").toBe(201);
      const apiJson = (await signupRes.json().catch(() => ({}))) as { ok?: boolean };
      expect(apiJson.ok, "signup API body indicates success").toBe(true);

      await page.waitForURL(
        (url) => {
          const p = url.pathname;
          return !p.includes("/signup") && !p.includes("/sign-up");
        },
        { timeout: 120_000 },
      );

      let path = "";
      try {
        path = new URL(page.url()).pathname;
      } catch {
        path = "";
      }

      if (path.includes("/login")) {
        await loginWithCredentials(page, email, password);
      }

      path = new URL(page.url()).pathname;
      expect(isLearnerShell(path), `expected learner shell after signup; got ${page.url()}`).toBe(true);
      await expectOnLearnerApp(page);

      await expect(page.locator("main")).toBeVisible({ timeout: 45_000 });

      const alert = page.locator('[role="alert"]');
      if ((await alert.count()) > 0) {
        const alertText = (await alert.first().innerText().catch(() => "")).trim();
        expect(alertText, "no signup failure alert visible after success").not.toMatch(
          /captcha|duplicate email|duplicate username|too many requests|unable to sign|invalid|error/i,
        );
      }

      const significantConsole = observers.consoleErrors.filter((t) => !isIgnorableAuthMarketingConsole(t));
      expect(
        significantConsole,
        `unexpected console errors (full list attached): ${significantConsole.join(" | ")}`,
      ).toEqual([]);
      expect(observers.failedRequests, observers.failedRequests.join(" | ")).toEqual([]);
    } finally {
      await logObserverDiagnostics(observers, testInfo.title);
      const significantConsoleErrors = observers.consoleErrors.filter((t) => !isIgnorableAuthMarketingConsole(t));
      await testInfo.attach("signup-auto-login-capture.json", {
        body: Buffer.from(
          JSON.stringify(
            {
              finalUrl: page.url(),
              consoleErrors: observers.consoleErrors,
              significantConsoleErrors,
              failedRequests: observers.failedRequests,
              authHttp: observers.authHttp ?? [],
            },
            null,
            2,
          ),
        ),
        contentType: "application/json",
      });
      observers.dispose();
    }
  });
});
