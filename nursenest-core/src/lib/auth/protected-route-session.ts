import type { Session } from "next-auth";

import { safeServerLog } from "@/lib/observability/safe-server-log";
import {
  getAuthSessionWithJwtCookieFallback,
  sessionHasUserIdentity,
} from "@/lib/auth/server-session-jwt-fallback";

let authModulePromise: Promise<typeof import("@/lib/auth")> | null = null;
function getAuthModulePromise(): Promise<typeof import("@/lib/auth")> {
  authModulePromise ??= import("@/lib/auth");
  return authModulePromise;
}

type LoadSession = () => Promise<Session | null | undefined>;

/**
 * Protected app/admin routes must fail closed without throwing a route-level 500
 * when the session store or backing database is temporarily unstable.
 */
export async function getProtectedRouteSession(
  surface: string,
  loadSession?: LoadSession,
): Promise<Session | null> {
  try {
    const readSession =
      loadSession ??
      (async () => {
        const { auth } = await getAuthModulePromise();
        return auth();
      });
    const primary = ((await readSession()) ?? null) as Session | null;
    if (sessionHasUserIdentity(primary)) return primary;
    /**
     * Node `auth()` can miss the same JWT cookie that Edge already decoded for `/admin` (secure
     * cookie name / forwarded-proto parity). Re-read via {@link getAuthSessionJwtFromRequest} so
     * `requireAdmin` does not send signed-in staff to `/login`.
     */
    if (loadSession) return primary;
    const fallback = await getAuthSessionWithJwtCookieFallback();
    return sessionHasUserIdentity(fallback) ? fallback : null;
  } catch (error) {
    safeServerLog("auth", "protected_route_session_failed", {
      surface,
      detail: (error instanceof Error ? error.message : String(error)).slice(0, 200),
    });
    return null;
  }
}
