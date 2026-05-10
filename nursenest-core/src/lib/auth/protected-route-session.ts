import type { Session } from "next-auth";

import { isDeletedAccountEmail } from "@/lib/account/delete-learner-account";
import { safeAwait } from "@/lib/async/safe-await";
import { AUTH_NODE_SESSION_READ_TIMEOUT_MS } from "@/lib/auth/auth-session-constants";
import { prisma } from "@/lib/db";
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

async function activeSessionOrNull(session: Session, surface: string): Promise<Session | null> {
  const userId = (session.user as { id?: string })?.id ?? "";
  if (!userId) return session;

  try {
    const row = await prisma.user.findUnique({
      where: { id: userId },
      select: { email: true },
    });
    if (!row || isDeletedAccountEmail(row.email)) {
      safeServerLog("auth", "protected_route_inactive_user_blocked", {
        surface,
        userIdPrefix: userId.slice(0, 8),
        severity: "warning",
      });
      return null;
    }
  } catch (error) {
    safeServerLog("auth", "protected_route_active_user_check_failed", {
      surface,
      userIdPrefix: userId.slice(0, 8),
      detail: (error instanceof Error ? error.message : String(error)).slice(0, 200),
      severity: "warning",
    });
    return null;
  }

  return session;
}

/**
 * Protected app/admin routes must fail closed without throwing a route-level 500
 * when the session store or backing database is temporarily unstable.
 */
export async function getProtectedRouteSession(
  surface: string,
  loadSession?: LoadSession,
): Promise<Session | null> {
  let primary: Session | null = null;

  const defaultReadSession: LoadSession = async () => {
    const { auth } = await getAuthModulePromise();
    return auth();
  };
  const readSession = loadSession ?? defaultReadSession;

  try {
    if (loadSession) {
      primary = ((await readSession()) ?? null) as Session | null;
    } else {
      const awaited = await safeAwait(
        readSession() as Promise<Session | null>,
        surface,
        AUTH_NODE_SESSION_READ_TIMEOUT_MS,
      );
      primary = (awaited ?? null) as Session | null;
    }
  } catch (error) {
    safeServerLog("auth", "protected_route_session_failed", {
      surface,
      detail: (error instanceof Error ? error.message : String(error)).slice(0, 200),
    });
    primary = null;
  }

  if (sessionHasUserIdentity(primary) && primary) return activeSessionOrNull(primary, surface);

  /**
   * Node `auth()` can miss the same JWT cookie that the proxy already decoded, or throw under load.
   * Always attempt {@link getAuthSessionWithJwtCookieFallback} for the default loader so `requireAdmin`
   * does not send signed-in staff to `/login` when the session cookie is still valid.
   */
  if (loadSession) return null;

  try {
    const fallback = await getAuthSessionWithJwtCookieFallback();
    return sessionHasUserIdentity(fallback) && fallback ? activeSessionOrNull(fallback, surface) : null;
  } catch (error) {
    safeServerLog("auth", "protected_route_jwt_fallback_failed", {
      surface,
      detail: (error instanceof Error ? error.message : String(error)).slice(0, 200),
    });
    return null;
  }
}
