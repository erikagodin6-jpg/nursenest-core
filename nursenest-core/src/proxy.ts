/**
 * Next.js 16+: `proxy` replaces `middleware` (same matcher + auth behavior).
 * @see https://nextjs.org/docs/messages/middleware-to-proxy
 *
 * Guests on `/app/lessons` are redirected to the public `/exam-lessons` hub; signed-in learners keep
 * the subscriber lesson list (auth runs after this check).
 */
import "@/lib/auth-trust-env";
import { NextResponse } from "next/server";
import type { NextFetchEvent, NextMiddleware, NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { middlewareAuth } from "@/lib/auth-middleware";

/** NextAuth `auth` middleware typing does not always align with App Router `NextRequest` + `NextFetchEvent`. */
const runAuthMiddleware = middlewareAuth as unknown as NextMiddleware;

export async function proxy(request: NextRequest, event: NextFetchEvent) {
  if (request.nextUrl.pathname === "/app/lessons") {
    const secret = process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET;
    const token = secret ? await getToken({ req: request, secret }) : null;
    if (!token) {
      return NextResponse.redirect(new URL("/exam-lessons", request.url));
    }
  }
  return runAuthMiddleware(request, event);
}

/** Include bare `/app` and `/admin` — `/app/:path*` alone can miss the dashboard root on some matchers. */
export const config = {
  matcher: ["/app", "/app/:path*", "/admin", "/admin/:path*"],
};
