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
import {
  humanReadableOperatorHint,
  mapAuthCallbackCodeToPrimary,
  type RnPhase0PrimaryClassification,
} from "./rn-full-content-phase0-classification";

export {
  currentPathname,
  isLearnerAppShellPath,
  isLearnerNavInternalHref,
  isLearnerShell,
  LEARNER_SHELL_PATH_EXPECTATION,
  PLAYWRIGHT_AUTH_NAV_TIMEOUT_MS,
} from "./learner-shell";

export type RnFullContentLoginPhase0Meta = {
  primaryClassification: RnPhase0PrimaryClassification;
  authCallbackCode: string | null;
  authErrorParam: string | null;
  operatorHint: string;
  callbackHttpStatus: number | null;
};

export class RnFullContentLoginError extends Error {
  readonly phase0: RnFullContentLoginPhase0Meta;

  constructor(message: string, phase0: RnFullContentLoginPhase0Meta) {
    super(message);
    this.name = "RnFullContentLoginError";
    this.phase0 = phase0;
  }
}

function isCredentialsPostResponse(res: Response): boolean {
  if (res.request().method() !== "POST") return false;
  return res.url().includes("/api/auth/callback/credentials");
}

function metaFromAuthCode(code: string | null, errorParam: string | null): RnFullContentLoginPhase0Meta {
  const authCallbackCode = code;
  const primaryClassification = mapAuthCallbackCodeToPrimary(code ?? "credentials");
  return {
    primaryClassification,
    authCallbackCode,
    authErrorParam: errorParam,
    operatorHint: humanReadableOperatorHint(primaryClassification),
    callbackHttpStatus: null,
  };
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

  try {
    await page.goto("/login", { waitUntil: "domcontentloaded" });
    await page.locator("#login-identifier").waitFor({ state: "visible", timeout: 25_000 });
    await page.locator("#login-password").waitFor({ state: "visible", timeout: 25_000 });
  } catch (e) {
    const diag = await describeAuthFailureSurface(page).catch(() => "");
    const phase0: RnFullContentLoginPhase0Meta = {
      primaryClassification: "LOGIN_PAGE_OR_FORM_LOAD_FAILED",
      authCallbackCode: null,
      authErrorParam: null,
      operatorHint: humanReadableOperatorHint("LOGIN_PAGE_OR_FORM_LOAD_FAILED"),
      callbackHttpStatus: null,
    };
    throw new RnFullContentLoginError(
      [
        "Login page did not load required form controls (#login-identifier / #login-password).",
        `baseURL=${baseURL}`,
        diag,
        e instanceof Error ? e.message : String(e),
      ].join(" "),
      phase0,
    );
  }

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
    const phase0: RnFullContentLoginPhase0Meta = {
      primaryClassification: "CREDENTIALS_CALLBACK_TIMEOUT_OR_MISSING",
      authCallbackCode: null,
      authErrorParam: null,
      operatorHint: humanReadableOperatorHint("CREDENTIALS_CALLBACK_TIMEOUT_OR_MISSING"),
      callbackHttpStatus: null,
    };
    throw new RnFullContentLoginError(
      [
        "No POST response from /api/auth/callback/credentials within 45s — submit may not have run, or Auth.js route is unreachable.",
        `baseURL=${baseURL} url=${at}`,
        "Check browser console, network tab, AUTH_URL/NEXTAUTH_URL vs BASE_URL, and that the dev server is healthy.",
        diag,
      ].join(" "),
      phase0,
    );
  }

  let payload: unknown;
  try {
    payload = await authRes.json();
  } catch {
    const text = await authRes.text().catch(() => "");
    const phase0: RnFullContentLoginPhase0Meta = {
      primaryClassification: "AUTH_CALLBACK_REJECTED",
      authCallbackCode: null,
      authErrorParam: null,
      operatorHint: humanReadableOperatorHint("AUTH_CALLBACK_REJECTED"),
      callbackHttpStatus: authRes.status(),
    };
    throw new RnFullContentLoginError(
      `Credentials POST returned non-JSON (status=${authRes.status()}). First bytes: ${text.slice(0, 240)} baseURL=${baseURL}`,
      phase0,
    );
  }

  const parsed = parseCredentialsCallbackPayload(payload);
  if (!parsed.ok || parsed.errorParam) {
    const diag = await describeAuthFailureSurface(page).catch(() => "");
    const baseMeta = metaFromAuthCode(parsed.credentialsCode, parsed.errorParam);
    const phase0: RnFullContentLoginPhase0Meta = {
      ...baseMeta,
      callbackHttpStatus: authRes.status(),
    };
    throw new RnFullContentLoginError(
      [
        `Credentials sign-in rejected (Auth.js error=${parsed.errorParam ?? "unknown"}).`,
        `callbackPayloadUrl=${parsed.redirectUrl.slice(0, 500)}`,
        `credentialsCode=${parsed.credentialsCode ?? "n/a"}`,
        `httpStatus=${authRes.status()}`,
        `baseURL=${baseURL}`,
        phase0.operatorHint,
        diag,
      ].join(" "),
      phase0,
    );
  }

  try {
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
  } catch {
    const atUrl = page.url();
    let pathname = "";
    try {
      pathname = new URL(atUrl).pathname;
    } catch {
      pathname = "(invalid)";
    }
    const body = await page.locator("body").innerText().catch(() => "");
    const diag = await describeAuthFailureSurface(page).catch(() => "");

    let primary: RnPhase0PrimaryClassification = "LEARNER_SHELL_TRANSITION_FAILED";
    if (body.includes("Subscription required") || (await page.getByRole("heading", { name: "Subscription required" }).count()) > 0) {
      primary = "ENTITLEMENT_OR_PAYWALL_BLOCKING_LEARNER";
    }

    const phase0: RnFullContentLoginPhase0Meta = {
      primaryClassification: primary,
      authCallbackCode: null,
      authErrorParam: null,
      operatorHint: humanReadableOperatorHint(primary),
      callbackHttpStatus: null,
    };

    throw new RnFullContentLoginError(
      [
        `Timed out waiting for learner shell navigation (${PLAYWRIGHT_AUTH_NAV_TIMEOUT_MS}ms).`,
        `url=${atUrl} pathname=${pathname}`,
        phase0.operatorHint,
        diag,
      ].join(" "),
      phase0,
    );
  }

  const atUrl = page.url();
  const pathname = new URL(atUrl).pathname;
  const body = await page.locator("body").innerText().catch(() => "");

  if (/Unable to sign in|Invalid email, username, or password|Invalid credentials|incorrect password/i.test(body)) {
    const diag = await describeAuthFailureSurface(page).catch(() => "");
    const phase0: RnFullContentLoginPhase0Meta = {
      primaryClassification: "QA_PASSWORD_REJECTED",
      authCallbackCode: null,
      authErrorParam: null,
      operatorHint: humanReadableOperatorHint("QA_PASSWORD_REJECTED"),
      callbackHttpStatus: null,
    };
    throw new RnFullContentLoginError(
      `Login rejected — visible invalid-credentials copy on page. url=${atUrl} pathname=${pathname} ${diag}`,
      phase0,
    );
  }
  if (pathname.includes("/app/onboarding")) {
    const phase0: RnFullContentLoginPhase0Meta = {
      primaryClassification: "LEARNER_SHELL_TRANSITION_FAILED",
      authCallbackCode: null,
      authErrorParam: null,
      operatorHint: "Complete onboarding for this QA account or reset to a paid seed without onboarding gate.",
      callbackHttpStatus: null,
    };
    throw new RnFullContentLoginError("On /app/onboarding — complete onboarding or reset QA account.", phase0);
  }
  if (!isLearnerShell(pathname)) {
    const phase0: RnFullContentLoginPhase0Meta = {
      primaryClassification: "LEARNER_SHELL_TRANSITION_FAILED",
      authCallbackCode: null,
      authErrorParam: null,
      operatorHint: humanReadableOperatorHint("LEARNER_SHELL_TRANSITION_FAILED"),
      callbackHttpStatus: null,
    };
    throw new RnFullContentLoginError(`Not on learner shell. url=${atUrl} pathname=${pathname}`, phase0);
  }
}
