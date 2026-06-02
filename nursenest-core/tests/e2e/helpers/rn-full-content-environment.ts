import type { APIRequestContext } from "@playwright/test";
import type { PaidCredentialSource } from "./smoke-credentials";
import type { RnDatabaseHealthSnapshot } from "./rn-full-content-database-preflight";
import type { RnDatabasePreflightResult } from "./rn-full-content-database-preflight";

/**
 * Default Playwright `baseURL` for RN full-content — **must match** `playwright.rn-full-content.config.ts`.
 * `npm run dev` uses `--hostname 127.0.0.1`; normalize `localhost` → `127.0.0.1` to avoid mixed loopback.
 */
export const RN_FULL_CONTENT_DEFAULT_BASE_URL = "http://127.0.0.1:3000";

/** Documented alongside `playwright.rn-full-content.config.ts` `webServer.timeout`. */
export const RN_FULL_CONTENT_WEBSERVER_READY_TIMEOUT_MS = 420_000;

export type ProbeFailureCategory = "ok" | "connection_refused" | "timeout" | "http_error" | "unknown";

function categorizeRequestError(message: string): Exclude<ProbeFailureCategory, "ok"> {
  if (/ECONNREFUSED|connection refused/i.test(message)) return "connection_refused";
  if (/timeout|Timeout|ETIMEDOUT/i.test(message)) return "timeout";
  return "unknown";
}

function statusCategory(status: number): ProbeFailureCategory {
  if (httpReachableStatus(status)) return "ok";
  return "http_error";
}

/**
 * Normalize loopback so probes match `next dev --hostname 127.0.0.1` and Playwright `use.baseURL`.
 */
export function normalizeRnFullContentBaseUrl(input: string): string {
  const raw = input.trim();
  if (!raw) return RN_FULL_CONTENT_DEFAULT_BASE_URL;
  try {
    const u = new URL(raw.includes("://") ? raw : `http://${raw}`);
    if (u.hostname === "localhost" || u.hostname === "[::1]") {
      u.hostname = "127.0.0.1";
    }
    return u.origin;
  } catch {
    return RN_FULL_CONTENT_DEFAULT_BASE_URL;
  }
}

/**
 * Mirrors `localDevWebServer()` in `playwright.rn-full-content.config.ts` — used for preflight JSON only.
 */
export function isRnFullContentPlaywrightWebServerExpected(resolvedBaseUrl: string): boolean {
  if (process.env.PLAYWRIGHT_SKIP_WEB_SERVER === "1") return false;
  try {
    const h = new URL(normalizeRnFullContentBaseUrl(resolvedBaseUrl)).hostname;
    return h === "127.0.0.1";
  } catch {
    return false;
  }
}

export type RnFullContentEnvironmentCheck = {
  artifactKind: "rn_full_content_environment_and_database_v1";
  baseUrl: string;
  loginUrl: string;
  skipWebServer: boolean;
  /** When true, Playwright should start `npm run dev` and wait up to `webServerReadyTimeoutMs` before tests. */
  webServerExpectedToStart: boolean;
  webServerReadyTimeoutMs: number;
  credentialSource: PaidCredentialSource | null;
  credentialsResolved: boolean;
  originReachable: boolean;
  loginReachable: boolean;
  originHttpStatus: number | null;
  loginHttpStatus: number | null;
  originFailureCategory: ProbeFailureCategory;
  loginFailureCategory: ProbeFailureCategory;
  connectionError?: string;
  suiteCanProceed: boolean;
  blockingReason?: string;
  operatorNextSteps: string[];
  loginProbeAttempts?: number;
  originTimeoutMs?: number;
  loginTimeoutMs?: number;
  /** Node `pg` probe using Playwright process `DATABASE_URL` (must match app server for accurate DB vs QA login triage). */
  databasePreflight?: RnDatabasePreflightResult;
  /** App server view: GET /api/health/ready (Prisma readiness — same secrets as the running dev server). */
  databaseHealthFromApp?: RnDatabaseHealthSnapshot | null;
};

/** Root `/` — should respond once the dev server is listening. */
const REACHABILITY_ORIGIN_TIMEOUT_MS = 30_000;
/** `/login` — marketing RSC; first `next dev` compile can be slow. */
const REACHABILITY_LOGIN_TIMEOUT_MS_LOCAL = 120_000;
const REACHABILITY_LOGIN_TIMEOUT_MS_REMOTE = 45_000;

function isLocalDevOrigin(origin: string): boolean {
  try {
    const h = new URL(origin).hostname;
    return h === "127.0.0.1" || h === "localhost" || h === "[::1]";
  } catch {
    return false;
  }
}

function httpReachableStatus(status: number): boolean {
  return (status >= 200 && status < 500) || status === 304;
}

/**
 * Resolve Playwright `baseURL` (from config) or `BASE_URL` — same origin probes and `page.goto` use.
 */
export function resolveRnFullContentBaseUrl(configBaseURL: string | undefined): string {
  const raw = configBaseURL?.trim() || process.env.BASE_URL?.trim() || RN_FULL_CONTENT_DEFAULT_BASE_URL;
  return normalizeRnFullContentBaseUrl(raw);
}

export function loginUrlForBase(origin: string): string {
  try {
    return new URL("/login", origin.endsWith("/") ? origin : `${origin}/`).href;
  } catch {
    return `${origin.replace(/\/$/, "")}/login`;
  }
}

function buildOperatorNextSteps(input: {
  skipWebServer: boolean;
  originReachable: boolean;
  loginReachable: boolean;
  originCategory: ProbeFailureCategory;
  loginCategory: ProbeFailureCategory;
  credentialsResolved: boolean;
}): string[] {
  const steps: string[] = [];
  if (!input.originReachable || !input.loginReachable) {
    if (input.skipWebServer) {
      steps.push(
        "PLAYWRIGHT_SKIP_WEB_SERVER=1: no Playwright-managed dev server — ensure something listens on resolved BASE_URL (e.g. run `npm run dev -- --hostname 127.0.0.1 --port 3000` in another terminal).",
      );
      steps.push("Or unset PLAYWRIGHT_SKIP_WEB_SERVER and let Playwright start the app (waits up to webServerReadyTimeoutMs for the origin URL).");
    } else {
      steps.push(
        `Playwright should start the dev server and wait up to ${RN_FULL_CONTENT_WEBSERVER_READY_TIMEOUT_MS}ms for the origin. If probes still fail, check port conflict, Turbopack errors, or increase machine resources.`,
      );
    }
    if (input.originCategory === "connection_refused" || input.loginCategory === "connection_refused") {
      steps.push(
        "ECONNREFUSED: nothing accepted TCP on that host/port — start the app or fix BASE_URL.",
      );
    }
    if (input.originCategory === "timeout" || input.loginCategory === "timeout") {
      steps.push(
        "Timeout: server may still be compiling — retry, or increase budgets only after confirming the app eventually responds in a browser.",
      );
    }
    if (input.loginCategory === "http_error" && input.originReachable) {
      steps.push("GET / returned OK but /login returned an error status — check route / middleware for /login (see src/app/(marketing)/(default)/login/).");
    }
  }
  if (input.originReachable && input.loginReachable && !input.credentialsResolved) {
    steps.push(
      "Set QA_PAID_EMAIL + QA_PAID_PASSWORD (or E2E_PAID_* or PLAYWRIGHT_TEST_*) in the environment or .env.playwright.local.",
    );
  }
  return steps;
}

function mergedDatabaseOperatorSteps(
  pg: RnDatabasePreflightResult | undefined,
  app: RnDatabaseHealthSnapshot | null | undefined,
): string[] {
  const steps: string[] = [];
  if (pg?.classification === "DB_AUTH_FAILURE") {
    steps.push(
      "Node `pg` probe (Playwright process DATABASE_URL): DB_AUTH_FAILURE — Postgres rejected that URL’s DB user/password (not the QA web login password). Align DATABASE_URL with the dev server.",
    );
  }
  if (pg?.classification === "SKIPPED_NO_DATABASE_URL") {
    steps.push(
      "DATABASE_URL was not set in the Playwright worker — node-side DB probe was skipped. Set DATABASE_URL in the same environment as `npm run qa:rn-full-content` to compare worker vs app DB connectivity.",
    );
  }
  if (app?.classification === "DB_AUTH_FAILURE") {
    steps.push(
      "GET /api/health/ready: classification=DB_AUTH_FAILURE — the **running app** cannot authenticate to Postgres (invalid DATABASE_URL for the dev server). This is not a wrong QA_PAID_PASSWORD.",
    );
  }
  if (app?.classification === "DATABASE_URL_NOT_CONFIGURED") {
    steps.push("GET /api/health/ready: DATABASE_URL is not configured for the app process.");
  }
  return steps;
}

export async function probeRnFullContentReachability(
  request: APIRequestContext,
  baseUrl: string,
): Promise<
  Pick<
    RnFullContentEnvironmentCheck,
    | "originReachable"
    | "loginReachable"
    | "connectionError"
    | "loginProbeAttempts"
    | "originTimeoutMs"
    | "loginTimeoutMs"
    | "originHttpStatus"
    | "loginHttpStatus"
    | "originFailureCategory"
    | "loginFailureCategory"
  >
> {
  const origin = normalizeRnFullContentBaseUrl(baseUrl);

  const local = isLocalDevOrigin(origin);
  const originTimeoutMs = REACHABILITY_ORIGIN_TIMEOUT_MS;
  const loginTimeoutMs = local ? REACHABILITY_LOGIN_TIMEOUT_MS_LOCAL : REACHABILITY_LOGIN_TIMEOUT_MS_REMOTE;

  let originReachable = false;
  let loginReachable = false;
  let originHttpStatus: number | null = null;
  let loginHttpStatus: number | null = null;
  let originFailureCategory: ProbeFailureCategory = "unknown";
  let loginFailureCategory: ProbeFailureCategory = "unknown";

  const errors: string[] = [];
  const loginTransient: string[] = [];

  try {
    const r = await request.get(`${origin}/`, {
      timeout: originTimeoutMs,
      maxRedirects: 10,
      failOnStatusCode: false,
    });
    originHttpStatus = r.status();
    originFailureCategory = statusCategory(originHttpStatus);
    originReachable = httpReachableStatus(originHttpStatus);
    if (!originReachable) {
      errors.push(`GET ${origin}/ → HTTP ${originHttpStatus} (expected 2xx–4xx app response)`);
    }
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    originFailureCategory = categorizeRequestError(msg);
    errors.push(`GET ${origin}/ failed [${originFailureCategory}]: ${msg}`);
  }

  const loginUrl = loginUrlForBase(origin);
  let loginProbeAttempts = 0;
  const maxLoginAttempts = local ? 2 : 1;

  for (let attempt = 1; attempt <= maxLoginAttempts; attempt++) {
    loginProbeAttempts = attempt;
    try {
      const r2 = await request.get(loginUrl, {
        timeout: loginTimeoutMs,
        maxRedirects: 15,
        failOnStatusCode: false,
      });
      loginHttpStatus = r2.status();
      loginFailureCategory = statusCategory(loginHttpStatus);
      loginReachable = httpReachableStatus(loginHttpStatus);
      if (!loginReachable) {
        errors.push(`GET /login → HTTP ${loginHttpStatus} (unexpected for reachability)`);
      } else {
        loginFailureCategory = "ok";
        break;
      }
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      const isTimeout = /timeout|Timeout/i.test(msg);
      loginFailureCategory = categorizeRequestError(msg);
      if (local && attempt < maxLoginAttempts && isTimeout) {
        loginTransient.push(`GET /login attempt ${attempt} timed out [slow compile?] — ${msg}`);
        await new Promise((r) => setTimeout(r, 2000));
        continue;
      }
      errors.push(`GET /login failed [${loginFailureCategory}]: ${msg}`);
    }
    if (loginReachable) break;
  }

  if (!loginReachable && loginTransient.length > 0) {
    errors.push(...loginTransient);
  }

  if (originReachable) originFailureCategory = "ok";
  if (loginReachable) loginFailureCategory = "ok";

  const connectionError = errors.length > 0 ? errors.join(" | ") : undefined;
  return {
    originReachable,
    loginReachable,
    connectionError,
    loginProbeAttempts,
    originTimeoutMs,
    loginTimeoutMs,
    originHttpStatus,
    loginHttpStatus,
    originFailureCategory,
    loginFailureCategory,
  };
}

export function buildEnvironmentCheckArtifact(input: {
  baseUrl: string;
  skipWebServer: boolean;
  webServerExpectedToStart: boolean;
  credentialSource: PaidCredentialSource | null;
  credentialsResolved: boolean;
  databasePreflight?: RnDatabasePreflightResult;
  databaseHealthFromApp?: RnDatabaseHealthSnapshot | null;
  probe: Pick<
    RnFullContentEnvironmentCheck,
    | "originReachable"
    | "loginReachable"
    | "connectionError"
    | "loginProbeAttempts"
    | "originTimeoutMs"
    | "loginTimeoutMs"
    | "originHttpStatus"
    | "loginHttpStatus"
    | "originFailureCategory"
    | "loginFailureCategory"
  >;
}): RnFullContentEnvironmentCheck {
  const loginUrl = loginUrlForBase(input.baseUrl);
  const envOk = input.probe.originReachable && input.probe.loginReachable;
  const suiteCanProceed = envOk && input.credentialsResolved;

  const operatorNextSteps = [
    ...buildOperatorNextSteps({
      skipWebServer: input.skipWebServer,
      originReachable: input.probe.originReachable,
      loginReachable: input.probe.loginReachable,
      originCategory: input.probe.originFailureCategory,
      loginCategory: input.probe.loginFailureCategory,
      credentialsResolved: input.credentialsResolved,
    }),
    ...mergedDatabaseOperatorSteps(input.databasePreflight, input.databaseHealthFromApp ?? null),
  ];

  let blockingReason: string | undefined;
  if (!input.probe.originReachable || !input.probe.loginReachable) {
    blockingReason =
      `[rn-full-content] ENVIRONMENT: probes failed (not auth). ` +
      `resolvedBaseUrl=${input.baseUrl} loginUrl=${loginUrl} ` +
      `webServerExpectedToStart=${input.webServerExpectedToStart} ` +
      `GET/=${input.probe.originFailureCategory}(${input.probe.originHttpStatus ?? "n/a"}) ` +
      `GET/login=${input.probe.loginFailureCategory}(${input.probe.loginHttpStatus ?? "n/a"}). ` +
      `Detail: ${input.probe.connectionError ?? "unknown"}`;
  } else if (!input.credentialsResolved) {
    blockingReason =
      "Paid credentials not configured (QA_PAID_EMAIL + QA_PAID_PASSWORD, or E2E_PAID_*, or PLAYWRIGHT_TEST_*).";
  }

  return {
    artifactKind: "rn_full_content_environment_and_database_v1",
    baseUrl: input.baseUrl,
    loginUrl,
    skipWebServer: input.skipWebServer,
    webServerExpectedToStart: input.webServerExpectedToStart,
    webServerReadyTimeoutMs: RN_FULL_CONTENT_WEBSERVER_READY_TIMEOUT_MS,
    credentialSource: input.credentialSource,
    credentialsResolved: input.credentialsResolved,
    originReachable: input.probe.originReachable,
    loginReachable: input.probe.loginReachable,
    originHttpStatus: input.probe.originHttpStatus,
    loginHttpStatus: input.probe.loginHttpStatus,
    originFailureCategory: input.probe.originFailureCategory,
    loginFailureCategory: input.probe.loginFailureCategory,
    connectionError: input.probe.connectionError,
    suiteCanProceed,
    blockingReason,
    operatorNextSteps,
    loginProbeAttempts: input.probe.loginProbeAttempts,
    originTimeoutMs: input.probe.originTimeoutMs,
    loginTimeoutMs: input.probe.loginTimeoutMs,
    databasePreflight: input.databasePreflight,
    databaseHealthFromApp: input.databaseHealthFromApp ?? null,
  };
}
