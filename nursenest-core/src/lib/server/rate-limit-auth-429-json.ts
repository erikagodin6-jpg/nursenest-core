import type { NextRequest } from "next/server";

/**
 * Public browser origin for `/login` links embedded in auth 429 JSON.
 * Behind App Platform / internal runners, `request.nextUrl.origin` can be `http://localhost:PORT`
 * even though the client hit the site via Cloudflare — use forwarded `Host` / `x-forwarded-*` first.
 */
export function publicRequestOriginForAuthUiRedirect(request: Pick<NextRequest, "headers" | "nextUrl">): string {
  const xfh = request.headers.get("x-forwarded-host")?.split(",")[0]?.trim();
  const hostHeader = request.headers.get("host")?.split(",")[0]?.trim();
  const host = xfh || hostHeader || request.nextUrl.host;
  let hostname = host;
  let port = "";
  try {
    if (host.includes("://")) {
      const u = new URL(host);
      hostname = u.hostname;
      port = u.port ? `:${u.port}` : "";
    } else {
      const u = new URL(`http://${host}`);
      hostname = u.hostname;
      port = u.port ? `:${u.port}` : "";
    }
  } catch {
    hostname = request.nextUrl.hostname;
    port = request.nextUrl.port ? `:${request.nextUrl.port}` : "";
  }

  const xfp = request.headers.get("x-forwarded-proto");
  const xfpHttps =
    xfp
      ?.split(",")
      .map((s) => s.trim().toLowerCase())
      .some((s) => s === "https") ?? false;
  let https = xfpHttps || request.nextUrl.protocol === "https:";
  const cfVisitor = request.headers.get("cf-visitor");
  if (cfVisitor) {
    try {
      const v = JSON.parse(cfVisitor) as { scheme?: string };
      if (v?.scheme?.toLowerCase() === "https") https = true;
    } catch {
      /* ignore */
    }
  }
  const proto = https ? "https:" : "http:";
  const h = `${hostname}${port}`;
  try {
    return new URL(`${proto}//${h}`).origin;
  } catch {
    return request.nextUrl.origin;
  }
}

/**
 * JSON body for proxy 429s on {@link isAuthStrictPath} routes.
 * NextAuth `signIn({ redirect: false })` requires `data.url` so `new URL(data.url)` does not throw.
 *
 * The URL must be a **real UI route** (never `/api/auth/signin` or `/api/auth/error`): if anything
 * follows `data.url` as a full-page navigation, users would see raw JSON or Auth.js stubs instead of `/login`.
 */
export function buildAuthStrictRateLimit429Json(origin: string, retryAfterSec: number): Record<string, unknown> {
  const u = new URL("/login", origin);
  u.searchParams.set("error", "AccessDenied");
  u.searchParams.set("code", "rate_limit_exceeded");
  u.searchParams.set("retryAfterSec", String(retryAfterSec));
  return {
    url: u.toString(),
    error: "Too many requests",
    code: "rate_limit_exceeded",
    retryAfterSec,
  };
}
