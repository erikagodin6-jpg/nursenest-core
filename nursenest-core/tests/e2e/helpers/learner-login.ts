/**
 * Credentials login → learner shell. Canonical shell rules: `src/lib/navigation/learner-shell.ts` ({@link isLearnerShell}).
 *
 * **Browser serialization:** `waitForFunction` must mirror {@link isLearnerShell} inline — Playwright runs the callback in the browser context (no imports).
 */
import type { Page, Response } from "@playwright/test";
import { parseCredentialsCallbackPayload } from "./auth-credentials-login";
import { describeAuthFailureSurface } from "./auth-diagnostics";
import { isLearnerShell, PLAYWRIGHT_AUTH_NAV_TIMEOUT_MS } from "./learner-shell";
import { resolveRnFullContentBaseUrl } from "./rn-full-content-environment";

export {
  currentPathname,
  isLearnerAppShellPath,
  isLearnerNavInternalHref,
  isLearnerShell,
  LEARNER_SHELL_PATH_EXPECTATION,
  PLAYWRIGHT_AUTH_NAV_TIMEOUT_MS,
} from "./learner-shell";

function isCredentialsPostResponse(res: Response): boolean {
  if (res.request().method() !== "POST") return false;
  return res.url().includes("/api/auth/callback/credentials");
}

/**
 * Credentials login on /login → learner shell.
 *
 * Waits for a **post-onboarding** learner route. `/app/onboarding` is treated as failure for paid regression seeds.
 *
 * **Auth.js:** the browser POSTs to `/api/auth/callback/credentials` and returns JSON `{ url }`. Failures embed
 * `error=` in `url` (often `CredentialsSignin`) — we parse that to avoid a long wait on `/login`.
 */
export async function loginWithCredentials(page: Page, email: string, password: string): Promise<void> {
  /** Align with Playwright `use.baseURL` / `resolveRnFullContentBaseUrl` — avoid localhost vs 127.0.0.1 drift in errors. */
  const baseURL = resolveRnFullContentBaseUrl(process.env.BASE_URL);

  await page.goto("/login", { waitUntil: "domcontentloaded" });
  await page.locator("#login-identifier").waitFor({ state: "visible", timeout: 25_000 });
  await page.locator("#login-password").waitFor({ state: "visible", timeout: 25_000 });

  await page.locator("#login-identifier").fill(email);
  await page.locator("#login-password").fill(password);

  const submit = page
    .locator("form")
    .filter({ has: page.locator("#login-identifier") })
    .locator('button[type="submit"]')
    .first();

  const authPostPromise = page.waitForResponse((res) => isCredentialsPostResponse(res), { timeout: 45_000 });

  await submit.click();

  let authRes: Response;
  try {
    authRes = await authPostPromise;
  } catch {
    const at = page.url();
    const diag = await describeAuthFailureSurface(page).catch(() => "");
    throw new Error(
      [
        "No POST response from /api/auth/callback/credentials within 45s — submit may not have run, or Auth.js route is unreachable.",
        `baseURL=${baseURL} url=${at}`,
        "Check browser console, network tab, AUTH_URL/NEXTAUTH_URL vs BASE_URL, and that the dev server is healthy.",
        diag,
      ].join(" "),
    );
  }

  let payload: unknown;
  try {
    payload = await authRes.json();
  } catch {
    const text = await authRes.text().catch(() => "");
    throw new Error(
      `Credentials POST returned non-JSON (status=${authRes.status()}). First bytes: ${text.slice(0, 240)} baseURL=${baseURL}`,
    );
  }

  const parsed = parseCredentialsCallbackPayload(payload);
  if (!parsed.ok || parsed.errorParam) {
    const diag = await describeAuthFailureSurface(page).catch(() => "");
    throw new Error(
      [
        `Credentials sign-in rejected (Auth.js error=${parsed.errorParam ?? "unknown"}).`,
        `callbackPayloadUrl=${parsed.redirectUrl.slice(0, 500)}`,
        `httpStatus=${authRes.status()}`,
        `baseURL=${baseURL}`,
        "Typical causes: wrong password, user missing in DATABASE_URL, DB unreachable (authorize db_error), or account lockout.",
        diag,
      ].join(" "),
    );
  }

  await page.waitForFunction(
    () => {
      const path = window.location.pathname;
      if (!path) return false;

      if (
        path.includes("/login") ||
        path.includes("/signup") ||
        path.includes("/sign-up") ||
        path.includes("/app/onboarding")
      ) {
        return false;
      }

      return (
        path === "/app" ||
        path.startsWith("/app/") ||
        path.startsWith("/lessons") ||
        path.startsWith("/questions") ||
        path.startsWith("/flashcards")
      );
    },
    undefined,
    { timeout: PLAYWRIGHT_AUTH_NAV_TIMEOUT_MS },
  );

  const atUrl = page.url();
  const pathname = new URL(atUrl).pathname;
  const body = await page.locator("body").innerText().catch(() => "");

  if (/Unable to sign in|Invalid email, username, or password|Invalid credentials|incorrect password/i.test(body)) {
    const diag = await describeAuthFailureSurface(page).catch(() => "");
    throw new Error(
      `Login rejected — check email/password and BASE_URL. Not on learner shell. url=${atUrl} pathname=${pathname} ${diag}`,
    );
  }
  if (pathname.includes("/app/onboarding")) {
    throw new Error("On /app/onboarding — complete onboarding...");
  }
  if (!isLearnerShell(pathname)) {
    throw new Error(`Not on learner shell. url=${atUrl} pathname=${pathname}`);
  }
}
