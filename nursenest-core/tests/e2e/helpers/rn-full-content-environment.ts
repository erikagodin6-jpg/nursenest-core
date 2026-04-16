import type { APIRequestContext } from "@playwright/test";
import type { PaidCredentialSource } from "./smoke-credentials";

export type RnFullContentEnvironmentCheck = {
  baseUrl: string;
  loginUrl: string;
  skipWebServer: boolean;
  credentialSource: PaidCredentialSource | null;
  credentialsResolved: boolean;
  originReachable: boolean;
  loginReachable: boolean;
  connectionError?: string;
  /** False when origin/login unreachable, or credentials missing, or other pre-login block. */
  suiteCanProceed: boolean;
  blockingReason?: string;
};

const REACHABILITY_TIMEOUT_MS = 25_000;

function httpReachableStatus(status: number): boolean {
  return (status >= 200 && status < 500) || status === 304;
}

/**
 * Resolve Playwright `baseURL` (config) or `BASE_URL` env — **origin** used for reachability probes.
 */
export function resolveRnFullContentBaseUrl(configBaseURL: string | undefined): string {
  const raw = configBaseURL?.trim() || process.env.BASE_URL?.trim() || "http://127.0.0.1:3000";
  try {
    const u = new URL(raw.includes("://") ? raw : `http://${raw}`);
    return u.origin;
  } catch {
    return "http://127.0.0.1:3000";
  }
}

export function loginUrlForBase(origin: string): string {
  try {
    return new URL("/login", origin.endsWith("/") ? origin : `${origin}/`).href;
  } catch {
    return `${origin.replace(/\/$/, "")}/login`;
  }
}

/**
 * Probe origin and /login with APIRequest (no session). Distinguishes connectivity from auth failures.
 */
export async function probeRnFullContentReachability(
  request: APIRequestContext,
  baseUrl: string,
): Promise<Pick<RnFullContentEnvironmentCheck, "originReachable" | "loginReachable" | "connectionError">> {
  const origin = (() => {
    try {
      return new URL(baseUrl).origin;
    } catch {
      return baseUrl;
    }
  })();

  let originReachable = false;
  let loginReachable = false;
  const errors: string[] = [];

  try {
    const r = await request.get(`${origin}/`, {
      timeout: REACHABILITY_TIMEOUT_MS,
      maxRedirects: 10,
      failOnStatusCode: false,
    });
    originReachable = httpReachableStatus(r.status());
    if (!originReachable) {
      errors.push(`GET ${origin}/ → HTTP ${r.status()} (expected a reachable app response)`);
    }
  } catch (e) {
    errors.push(`GET ${origin}/ failed: ${e instanceof Error ? e.message : String(e)}`);
  }

  const loginUrl = loginUrlForBase(origin);
  try {
    const r2 = await request.get(loginUrl, {
      timeout: REACHABILITY_TIMEOUT_MS,
      maxRedirects: 15,
      failOnStatusCode: false,
    });
    loginReachable = httpReachableStatus(r2.status());
    if (!loginReachable) {
      errors.push(`GET /login → HTTP ${r2.status()} (login route not reachable)`);
    }
  } catch (e) {
    errors.push(`GET /login failed: ${e instanceof Error ? e.message : String(e)}`);
  }

  const connectionError = errors.length > 0 ? errors.join(" | ") : undefined;
  return { originReachable, loginReachable, connectionError };
}

export function buildEnvironmentCheckArtifact(input: {
  baseUrl: string;
  skipWebServer: boolean;
  credentialSource: PaidCredentialSource | null;
  credentialsResolved: boolean;
  probe: Pick<RnFullContentEnvironmentCheck, "originReachable" | "loginReachable" | "connectionError">;
}): RnFullContentEnvironmentCheck {
  const loginUrl = loginUrlForBase(input.baseUrl);
  const envOk = input.probe.originReachable && input.probe.loginReachable;
  const suiteCanProceed = envOk && input.credentialsResolved;

  let blockingReason: string | undefined;
  if (!input.probe.originReachable || !input.probe.loginReachable) {
    blockingReason =
      `[rn-full-content] ENVIRONMENT / CONNECTIVITY: cannot reach BASE_URL or /login. ` +
      `Fix BASE_URL, start the app, or use PLAYWRIGHT_SKIP_WEB_SERVER=1 with a reachable host. ` +
      `This is not an authentication failure. Detail: ${input.probe.connectionError ?? "unknown"}`;
  } else if (!input.credentialsResolved) {
    blockingReason =
      "Paid credentials not configured (QA_PAID_EMAIL + QA_PAID_PASSWORD, or E2E_PAID_*, or PLAYWRIGHT_TEST_*).";
  }

  return {
    baseUrl: input.baseUrl,
    loginUrl,
    skipWebServer: input.skipWebServer,
    credentialSource: input.credentialSource,
    credentialsResolved: input.credentialsResolved,
    originReachable: input.probe.originReachable,
    loginReachable: input.probe.loginReachable,
    connectionError: input.probe.connectionError,
    suiteCanProceed,
    blockingReason,
  };
}
