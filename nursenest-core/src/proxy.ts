/**
 * Next.js 16+: `proxy` replaces `middleware` (same matcher + auth behavior).
 * @see https://nextjs.org/docs/messages/middleware-to-proxy
 *
 * Guests on `/app/lessons` are redirected to the public `/lessons` hub; signed-in learners keep
 * the subscriber lesson list (auth runs after this check).
 */
import "@/lib/auth-trust-env";
import type { NextFetchEvent, NextMiddleware } from "next/server";
import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { middlewareAuth } from "@/lib/auth-middleware";

/** NextAuth `auth` middleware typing does not always align with App Router `NextRequest` + `NextFetchEvent`. */
const runAuthMiddleware = middlewareAuth as unknown as NextMiddleware;

function withPathnameHeader(request: NextRequest): NextRequest {
  const pathname = request.nextUrl.pathname;
  const isExamHub =
    pathname === "/us" ||
    pathname.startsWith("/us/") ||
    pathname === "/canada" ||
    pathname.startsWith("/canada/");
  if (!isExamHub) return request;
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-nn-pathname", pathname);
  return new NextRequest(request.url, { headers: requestHeaders });
}

export async function proxy(request: NextRequest, event: NextFetchEvent) {
  if (request.nextUrl.pathname === "/app/lessons") {
    const secret = process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET;
    const token = secret ? await getToken({ req: request, secret }) : null;
    if (!token) {
      return NextResponse.redirect(new URL("/lessons", request.url));
    }
  }
  return runAuthMiddleware(withPathnameHeader(request), event);
}

/**
 * Include bare `/app` and `/admin` — `/app/:path*` alone can miss the dashboard root on some matchers.
 * `/us/*` and `/canada/*` run proxy so `x-nn-pathname` reaches `(default)/layout` for cookie-backed i18n on exam hubs.
 */
export const config = {
  matcher: ["/app", "/app/:path*", "/admin", "/admin/:path*", "/us", "/us/:path*", "/canada", "/canada/:path*"],
};
