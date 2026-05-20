import { expect, test } from "@playwright/test";
import { attachPageObservers } from "../helpers/attach-observers";
import { loginWithCredentials } from "../helpers/learner-login";
import {
  attachSmokeCapture,
  attachSmokeFailureScreenshot,
  buildCaptureFromObservers,
} from "../helpers/smoke-evidence";
import { isLearnerShell } from "../helpers/learner-shell";

/**
 * Unique inbox domain (catch-all) — public signup rejects reserved demo domains.
 * Without this, the spec is skipped so deploy smoke stays honest (no fake greens against Turnstile).
 */
function signupEmailDomain(): string | undefined {
  return process.env.QA_SIGNUP_EMAIL_DOMAIN?.trim() || undefined;
}

test.use({ storageState: { cookies: [], origins: [] } });

test.describe("Smoke — signup auto-login", () => {
  test("creates account and reaches learner shell", async ({ page }, testInfo) => {
    const domain = signupEmailDomain();
    test.skip(
      !domain,
      "Set QA_SIGNUP_EMAIL_DOMAIN to an allowed catch-all domain for unique signup emails (or skip this spec).",
    );

    const observers = attachPageObservers(page, { profile: "app", probeAuthApi: true });
    const runId = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
    const email = `smoke.${runId}@${domain}`;
    const username = `smoke${runId.replace(/\W/g, "").slice(0, 24)}`;
    const password = `Smoke1!Aa${runId.slice(-4)}`;

    try {
      await page.goto("/signup", { waitUntil: "domcontentloaded" });
      await expect(page.locator("main, [role='main']").first()).toBeVisible({ timeout: 30_000 });

      await page.locator('input[name="firstName"]').fill("Smoke");
      await page.locator('input[name="lastName"]').fill("Test");
      await page.locator('input[name="username"]').fill(username);
      await page.locator('input[name="email"]').fill(email);
      await page.locator('input[name="password"]').fill(password);

      const submit = page.getByRole("button", { name: /create account/i });
      await expect(submit).toBeEnabled({ timeout: 90_000 });

      await submit.click();

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

      const alert = page.locator('[role="alert"]');
      if ((await alert.count()) > 0) {
        const t = (await alert.first().innerText().catch(() => "")).trim();
        expect(t, "no captcha/duplicate alert after signup").not.toMatch(
          /captcha|duplicate email|duplicate username|too many requests/i,
        );
      }

      await attachSmokeCapture(testInfo, "auth-signup", buildCaptureFromObservers(page, observers));
      expect(observers.consoleErrors, observers.consoleErrors.join(" | ")).toEqual([]);
    } catch (e) {
      await attachSmokeFailureScreenshot(page, testInfo, "auth-signup-failure.png");
      throw e;
    } finally {
      observers.dispose();
    }
  });
});
