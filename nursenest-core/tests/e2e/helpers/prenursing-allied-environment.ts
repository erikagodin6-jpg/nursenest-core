/**
 * Environment preflight for `pathway-prenursing-allied-access.spec.ts`.
 * Ensures connection refused / wrong BASE_URL never masquerades as auth or pathway failures.
 */
import type { APIRequestContext, TestInfo } from "@playwright/test";

export type CredentialPrefixResolution = {
  prefix: string;
  emailEnvSet: boolean;
};

/** High-level failure bucket for operators (distinct from pathway content bugs). */
export type EnvironmentFailurePhase =
  | "environment_preflight"
  | "auth_credentials"
  | "learner_shell"
  | "entitlement_mismatch"
  | "pathway_surface"
  | "unknown";

export type PrenursingAlliedEnvironmentCheck = {
  schemaVersion: 1;
  baseUrl: string;
  baseUrlSource: "BASE_URL" | "playwright_use_default";
  /** Raw `process.env.BASE_URL` when set (for CI debugging). */
  processEnvBaseUrl: string | null;
  loginUrl: string;
  skipWebServer: boolean;
  /** Mirrors `playwright.pathways-prenursing-allied.config.ts` localDevWebServer() — npm run dev would run for localhost when not skipping. */
  webServerWouldStart: boolean;
  originReachable: boolean;
  loginReachable: boolean;
  httpStatusRoot: number | null;
  httpStatusLogin: number | null;
  connectionError: string | null;
  suiteCanProceed: boolean;
  blockingReason: string | null;
  failurePhaseIfBlocked: EnvironmentFailurePhase;
  nextSteps: string[];
  credentialPrefixesResolved: CredentialPrefixResolution[];
};

function formatRequestError(e: unknown): string {
  if (e instanceof Error) return e.message;
  return String(e);
}

function isConnectionLikeError(msg: string): boolean {
  const m = msg.toLowerCase();
  return (
    m.includes("econnrefused") ||
    m.includes("err_connection_refused") ||
    m.includes("connection refused") ||
    m.includes("enotfound") ||
    m.includes("etimedout") ||
    m.includes("timeout") ||
    m.includes("networkerror")
  );
}

/** Same rule as `localDevWebServer()` in playwright.pathways-prenursing-allied.config.ts */
export function inferWebServerWouldStart(baseUrl: string): boolean {
  if (process.env.PLAYWRIGHT_SKIP_WEB_SERVER === "1") return false;
  try {
    const u = new URL(baseUrl);
    return u.hostname === "127.0.0.1" || u.hostname === "localhost";
  } catch {
    return false;
  }
}

function buildNextSteps(args: {
  skipWebServer: boolean;
  webServerWouldStart: boolean;
  loginReachable: boolean;
  baseUrl: string;
}): string[] {
  const out: string[] = [];
  if (!args.loginReachable) {
    out.push(
      `Cannot reach ${args.baseUrl.replace(/\/$/, "")}/login — start the Next.js app or fix BASE_URL.`,
    );
    if (args.skipWebServer) {
      out.push(
        "PLAYWRIGHT_SKIP_WEB_SERVER=1: Playwright will not start `npm run dev`. Either start the app manually on that origin/port, or unset PLAYWRIGHT_SKIP_WEB_SERVER for localhost so the config can launch the dev server.",
      );
    } else if (args.webServerWouldStart) {
      out.push(
        "Local mode: webServer should start `npm run dev` for 127.0.0.1/localhost — wait for it to listen, or run `npm run dev` yourself and set reuseExistingServer behavior.",
      );
    } else {
      out.push(
        "Remote/staging: set BASE_URL to the full origin (e.g. https://preview.example.com) and ensure it is reachable from this runner.",
      );
    }
  }
  return out;
}

/**
 * Resolves the same origin Playwright will use: `use.baseURL` from config passes through as `baseURL` in tests.
 * We also record whether `BASE_URL` was set in the environment (vs implicit default).
 */
export function resolveConfiguredBaseUrl(baseURLFromTest: string | undefined): {
  href: string;
  baseUrlSource: "BASE_URL" | "playwright_use_default";
} {
  const fromEnv = process.env.BASE_URL?.trim();
  const effective =
    (baseURLFromTest && baseURLFromTest.trim().length > 0 ? baseURLFromTest.trim() : null) ??
    (fromEnv && fromEnv.length > 0 ? fromEnv : null) ??
    "http://127.0.0.1:3000";
  try {
    const normalized = effective.endsWith("/") ? effective.slice(0, -1) : effective;
    const href = new URL(normalized).href.replace(/\/$/, "");
    return {
      href,
      baseUrlSource: fromEnv && fromEnv.length > 0 ? "BASE_URL" : "playwright_use_default",
    };
  } catch {
    return {
      href: "http://127.0.0.1:3000",
      baseUrlSource: "playwright_use_default",
    };
  }
}

export function resolveCredentialPrefixStatus(prefixes: string[]): CredentialPrefixResolution[] {
  return prefixes.map((prefix) => ({
    prefix,
    emailEnvSet: Boolean(process.env[`${prefix}_EMAIL`]?.trim()),
  }));
}

export async function runEnvironmentPreflight(args: {
  request: APIRequestContext;
  baseURL: string | undefined;
  credentialPrefixes: string[];
}): Promise<PrenursingAlliedEnvironmentCheck> {
  const skipWebServer = process.env.PLAYWRIGHT_SKIP_WEB_SERVER === "1";
  const { href: baseUrl, baseUrlSource } = resolveConfiguredBaseUrl(args.baseURL);

  let origin = "";
  let loginUrl = "";
  try {
    const u = new URL(baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl);
    origin = u.origin;
    loginUrl = `${origin}/login`;
  } catch (e) {
    return {
      schemaVersion: 1,
      baseUrl,
      baseUrlSource: "playwright_use_default",
      processEnvBaseUrl: process.env.BASE_URL?.trim() ?? null,
      loginUrl: "(invalid)",
      skipWebServer,
      webServerWouldStart: false,
      originReachable: false,
      loginReachable: false,
      httpStatusRoot: null,
      httpStatusLogin: null,
      connectionError: formatRequestError(e),
      suiteCanProceed: false,
      blockingReason: "INVALID_BASE_URL: could not parse base URL",
      failurePhaseIfBlocked: "environment_preflight",
      nextSteps: [
        "Set BASE_URL to a valid origin (e.g. http://127.0.0.1:3000 or https://your-preview.example.com).",
      ],
      credentialPrefixesResolved: resolveCredentialPrefixStatus(args.credentialPrefixes),
    };
  }

  const webServerWouldStart = inferWebServerWouldStart(baseUrl);
  let originReachable = false;
  let loginReachable = false;
  let httpStatusRoot: number | null = null;
  let httpStatusLogin: number | null = null;
  let connectionError: string | null = null;

  try {
    const rootRes = await args.request.get(`${origin}/`, {
      timeout: 25_000,
      failOnStatusCode: false,
    });
    httpStatusRoot = rootRes.status();
    originReachable = true;
  } catch (e) {
    connectionError = formatRequestError(e);
  }

  try {
    const loginRes = await args.request.get(loginUrl, {
      timeout: 25_000,
      failOnStatusCode: false,
    });
    httpStatusLogin = loginRes.status();
    loginReachable = true;
    originReachable = true;
  } catch (e) {
    const msg = formatRequestError(e);
    if (!connectionError) connectionError = msg;
    else connectionError = `${connectionError} | ${msg}`;
  }

  let blockingReason: string | null = null;
  const failurePhaseIfBlocked: EnvironmentFailurePhase = "environment_preflight";

  if (!loginReachable) {
    const hint = connectionError ?? "unknown";
    blockingReason = `ENV_CONNECTIVITY: /login unreachable (${hint})`;
    if (skipWebServer && isConnectionLikeError(hint)) {
      blockingReason +=
        " — With PLAYWRIGHT_SKIP_WEB_SERVER=1, nothing starts the dev server; start the app or point BASE_URL at a running origin.";
    }
  } else if (httpStatusLogin !== null && httpStatusLogin >= 500) {
    blockingReason = `ENV_HTTP: /login returned ${httpStatusLogin}`;
  } else if (httpStatusLogin === 404) {
    blockingReason =
      "ENV_HTTP: GET /login returned 404 — wrong BASE_URL or app has no /login route on this origin";
  }

  const httpOkForLoginPage =
    loginReachable &&
    httpStatusLogin !== null &&
    httpStatusLogin >= 200 &&
    httpStatusLogin < 500 &&
    httpStatusLogin !== 404;

  let finalBlocking = blockingReason;
  if (!httpOkForLoginPage && !finalBlocking && loginReachable) {
    finalBlocking = `ENV_HTTP: GET /login status ${httpStatusLogin ?? "null"} is not acceptable for this suite (expect 200–499, exclude 404)`;
  }

  const suiteCanProceed = httpOkForLoginPage && finalBlocking === null;

  const nextSteps = buildNextSteps({
    skipWebServer,
    webServerWouldStart,
    loginReachable,
    baseUrl,
  });

  return {
    schemaVersion: 1,
    baseUrl,
    baseUrlSource,
    processEnvBaseUrl: process.env.BASE_URL?.trim() ?? null,
    loginUrl,
    skipWebServer,
    webServerWouldStart,
    originReachable,
    loginReachable,
    httpStatusRoot,
    httpStatusLogin,
    connectionError,
    suiteCanProceed,
    blockingReason: suiteCanProceed ? null : finalBlocking,
    failurePhaseIfBlocked,
    nextSteps,
    credentialPrefixesResolved: resolveCredentialPrefixStatus(args.credentialPrefixes),
  };
}

export async function attachPrenursingAlliedEnvironmentCheck(
  testInfo: TestInfo,
  check: PrenursingAlliedEnvironmentCheck,
): Promise<void> {
  await testInfo.attach("prenursing-allied-environment-check.json", {
    body: Buffer.from(JSON.stringify(check, null, 2), "utf-8"),
    contentType: "application/json",
  });
}

/** Classify thrown errors so attachments stay honest about phase. */
export function classifyPrenursingAlliedErrorMessage(message: string): EnvironmentFailurePhase {
  const bracket = /\[prenursing-allied:([a-z_]+)\]/i.exec(message);
  if (bracket?.[1]) {
    const p = bracket[1].toLowerCase();
    if (p === "environment_preflight" || p === "auth_credentials" || p === "learner_shell") return p;
    if (p === "entitlement_mismatch") return "entitlement_mismatch";
    if (p === "pathway_surface") return "pathway_surface";
    if (p === "unknown") return "unknown";
  }
  const m = message;
  if (/ENV_CONNECTIVITY|ENV_HTTP|INVALID_BASE_URL|unreachable/i.test(m)) return "environment_preflight";
  if (/Login rejected|Invalid email|password|credentials/i.test(m)) return "auth_credentials";
  if (/Not on learner shell|paid learner shell|onboarding/i.test(m)) return "learner_shell";
  if (/requires session tier|requires session country|Expected tier|alliedProfessionKey|tier ALLIED/i.test(m))
    return "entitlement_mismatch";
  if (/pathway|lessons hub|flashcards|Question bank|practice|mini-cat/i.test(m)) return "pathway_surface";
  return "unknown";
}

export function assertEnvironmentAllowsSuite(check: PrenursingAlliedEnvironmentCheck): void {
  if (check.suiteCanProceed) return;
  const lines = [
    check.blockingReason ?? "Environment preflight failed",
    "",
    ...check.nextSteps,
    "",
    `Resolved baseUrl=${check.baseUrl} loginUrl=${check.loginUrl} skipWebServer=${check.skipWebServer} webServerWouldStart=${check.webServerWouldStart}`,
  ];
  throw new Error(lines.join("\n"));
}
