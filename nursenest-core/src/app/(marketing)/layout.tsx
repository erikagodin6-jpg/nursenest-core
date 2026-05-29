import { traceLayout } from "@/build/tracing";
import { AuthSessionProvider } from "@/components/auth/auth-session-provider";
import { ReferralAttributionTracker } from "@/components/referrals/referral-attribution-tracker";
import type { Session } from "next-auth";

import "./marketing-styles.css";

async function getMarketingInitialSession(): Promise<Session | null | undefined> {
  const hasSecret = Boolean(
    (process.env.AUTH_SECRET && process.env.AUTH_SECRET.trim().length > 0) ||
      (process.env.NEXTAUTH_SECRET && process.env.NEXTAUTH_SECRET.trim().length > 0),
  );
  if (!hasSecret) return null;

  let hasSessionCookie = false;
  try {
    const { cookies } = await import("next/headers");
    const jar = await cookies();
    const sessionCookieNames = [
      "authjs.session-token",
      "__Secure-authjs.session-token",
      "next-auth.session-token",
      "__Secure-next-auth.session-token",
    ];
    // Auth.js chunks large session cookies as `name.0`, `name.1`, etc.
    // Treat any chunk as a real session signal so the first paint stays
    // pending/auth-aware instead of incorrectly rendering guest chrome.
    const allCookieNames = jar.getAll().map((cookie) => cookie.name);
    hasSessionCookie = allCookieNames.some((name) =>
      sessionCookieNames.some((sessionName) => name === sessionName || name.startsWith(`${sessionName}.`)),
    );
  } catch {
    hasSessionCookie = true;
  }

  if (!hasSessionCookie) return null;

  try {
    const { auth } = await import("@/lib/auth");
    const session = await auth();
    if (session) return session;
    const { getAuthSessionWithJwtCookieFallback } = await import("@/lib/auth/server-session-jwt-fallback");
    return await getAuthSessionWithJwtCookieFallback();
  } catch {
    // A cookie exists but the server read failed. Keep client session status in
    // "loading" so the header does not paint logged-out chrome before hydration.
    return undefined;
  }
}

const MarketingGroupLayout = traceLayout(
  import.meta,
  async function MarketingGroupLayout({ children }: { children: React.ReactNode }) {
    const session = await getMarketingInitialSession();

    return (
      <AuthSessionProvider session={session} runtimeBoundary="public">
        <ReferralAttributionTracker />
        {children}
      </AuthSessionProvider>
    );
  },
  { name: "MarketingGroupLayout" },
);

export default MarketingGroupLayout;
