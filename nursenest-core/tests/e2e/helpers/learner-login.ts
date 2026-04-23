/**
 * Credentials login → learner shell. Canonical shell rules: `src/lib/navigation/learner-shell.ts` ({@link isLearnerShell}).
 *
 * **Browser serialization:** `waitForFunction` must mirror {@link isLearnerShell} inline — Playwright runs the callback in the browser context (no imports).
 */
import type { Page, Response } from "@playwright/test";
import { parseCredentialsCallbackPayload } from "./auth-credentials-login";
import { describeAuthFailureSurface } from "./auth-diagnostics";
import { PLAYWRIGHT_AUTH_NAV_TIMEOUT_MS } from "./learner-shell";
import { waitForAuthenticatedLearnerShell } from "./paid-learner-shell";
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

export type LoginWithCredentialsOptions = {
  /**
   * When true (default), navigate to `/app` after a successful marketing login so specs that exercise the
   * learner shell keep a single entry point. Set false to assert marketing-shell continuity (no `/app` hop).
   */
  enterLearnerApp?: boolean;
  /**
   * Full path + query for the credentials form (default `/login`). Use to preserve `callbackUrl` (e.g. resume homepage).
   */
  loginUrl?: string;
  /**
   * When set (e.g. Playwright `baseURL` origin), navigate with `new URL(loginUrl, navigationOrigin)` so the
   * browser host matches the dev server `AUTH_URL` / `NEXTAUTH_URL` (avoids localhost vs 127.0.0.1 CSRF/cookie drift).
   */
  navigationOrigin?: string;
};

/**
 * Credentials login on `/login`.
 *
 * Production sends users back to the **marketing** resume target (not `/app`); this helper optionally opens
 * `/app` afterward so paid E2E can reuse one flow.
 *
 * **Auth.js:** the browser POSTs to `/api/auth/callback/credentials` and returns JSON `{ url }`. Failures embed
 * `error=` in `url` (often `CredentialsSignin`) — we parse that to avoid a long wait on `/login`.
 */
export async function loginWithCredentials(
  page: Page,
  email: string,
  password: string,
  opts?: LoginWithCredentialsOptions,
): Promise<void> {
  const enterLearnerApp = opts?.enterLearnerApp !== false;
  const loginUrl = opts?.loginUrl ?? "/login";
  /** Align with Playwright `use.baseURL` / `resolveRnFullContentBaseUrl` — avoid localhost vs 127.0.0.1 drift in errors. */
  const baseURL = resolveRnFullContentBaseUrl(process.env.BASE_URL);
  const navOrigin = opts?.navigationOrigin?.trim();
  const loginHref =
    navOrigin && loginUrl.startsWith("/")
      ? new URL(loginUrl, navOrigin.endsWith("/") ? navOrigin : `${navOrigin}/`).href
      : loginUrl;

  try {
    await page.goto(loginHref, { waitUntil: "domcontentloaded" });
    await page.locator("#login-identifier").first().waitFor({ state: "visible", timeout: 25_000 });
    await page.locator("#login-password").first().waitFor({ state: "visible", timeout: 25_000 });
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

  await page.locator("#login-identifier").first().fill(email);
  await page.locator("#login-password").first().fill(password);

  const submit = page
    .locator("form")
    .filter({ has: page.locator("#login-identifier") })
    .first()
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
        if (path.includes("/login") || path.includes("/signup") || path.includes("/sign-up")) return false;
        if (path.includes("/app/onboarding")) return false;
        return true;
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
        `Timed out waiting for post-login navigation (${PLAYWRIGHT_AUTH_NAV_TIMEOUT_MS}ms).`,
        `url=${atUrl} pathname=${pathname}`,
        phase0.operatorHint,
        diag,
      ].join(" "),
      phase0,
    );
  }

  let atUrl = page.url();
  let pathname = new URL(atUrl).pathname;
  let body = await page.locator("body").innerText().catch(() => "");

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

  if (enterLearnerApp) {
    const appHref =
      navOrigin && navOrigin.length > 0
        ? new URL("/app", navOrigin.endsWith("/") ? navOrigin : `${navOrigin}/`).href
        : "/app";
    await page.goto(appHref, { waitUntil: "domcontentloaded" });
    await waitForAuthenticatedLearnerShell(page);
    atUrl = page.url();
    pathname = new URL(atUrl).pathname;
    body = await page.locator("body").innerText().catch(() => "");
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
        `Login rejected after learner navigation. url=${atUrl} pathname=${pathname} ${diag}`,
        phase0,
      );
    }
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
}
