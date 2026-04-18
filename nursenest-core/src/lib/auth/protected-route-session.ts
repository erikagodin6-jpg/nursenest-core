import type { Session } from "next-auth";

import { safeServerLog } from "@/lib/observability/safe-server-log";

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
        const { auth } = await import("@/lib/auth");
        return auth();
      });
    return (await readSession()) ?? null;
  } catch (error) {
    safeServerLog("auth", "protected_route_session_failed", {
      surface,
      detail: (error instanceof Error ? error.message : String(error)).slice(0, 200),
    });
    return null;
  }
}
