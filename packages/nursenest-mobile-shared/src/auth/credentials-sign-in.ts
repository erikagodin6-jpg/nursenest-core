import { apiPaths } from "../api-paths.js";
import { mergeCookieJar, readSetCookieHeaders } from "./cookie-jar.js";

export type CsrfResponse = { csrfToken: string };

export function buildOriginUrl(origin: string, path: string): string {
  const base = origin.replace(/\/$/, "");
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${base}${p}`;
}

export async function fetchCsrf(origin: string, initCookie: string | null): Promise<{ csrf: CsrfResponse; cookieJar: string }> {
  const url = buildOriginUrl(origin, apiPaths.authCsrf);
  const res = await fetch(url, {
    method: "GET",
    headers: {
      Accept: "application/json",
      ...(initCookie ? { Cookie: initCookie } : {}),
    },
  });
  const setLines = readSetCookieHeaders(res.headers);
  const jar = mergeCookieJar(initCookie, setLines);
  const json = (await res.json()) as CsrfResponse;
  if (!json?.csrfToken) {
    throw new Error("csrf_missing");
  }
  return { csrf: json, cookieJar: jar };
}

export type CredentialsSignInInput = {
  origin: string;
  email: string;
  password: string;
  rememberMe: boolean;
  /** Existing jar from CSRF preflight (optional). */
  cookieJar?: string | null;
};

export type CredentialsSignInOk = {
  ok: true;
  cookieJar: string;
  status: number;
};

export type CredentialsSignInErr = {
  ok: false;
  status: number;
  bodyText: string;
};

/**
 * Performs Auth.js credentials POST — same contract as web `signIn("credentials", { redirect:false })`.
 * Caller persists `cookieJar` to SecureStore and uses it as `Cookie` on subsequent API calls.
 */
export async function postCredentialsSignIn(input: CredentialsSignInInput): Promise<CredentialsSignInOk | CredentialsSignInErr> {
  const { csrf, cookieJar: jarAfterCsrf } = await fetchCsrf(input.origin, input.cookieJar ?? null);

  const url = buildOriginUrl(input.origin, apiPaths.authCredentialsCallback);
  const body = new URLSearchParams({
    csrfToken: csrf.csrfToken,
    email: input.email,
    password: input.password,
    rememberMe: input.rememberMe ? "true" : "false",
    redirect: "false",
    json: "true",
    callbackUrl: buildOriginUrl(input.origin, "/app"),
  });

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Accept: "application/json",
      Cookie: jarAfterCsrf,
    },
    body: body.toString(),
  });

  const setLines = readSetCookieHeaders(res.headers);
  const merged = mergeCookieJar(jarAfterCsrf, setLines);

  if (!res.ok) {
    const bodyText = await res.text().catch(() => "");
    return { ok: false, status: res.status, bodyText };
  }

  return { ok: true, cookieJar: merged, status: res.status };
}
