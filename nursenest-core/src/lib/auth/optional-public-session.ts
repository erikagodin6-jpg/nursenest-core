import type { Session } from "next-auth";
import { safeServerLog } from "@/lib/observability/safe-server-log";

type OptionalPublicSessionContext = {
  pathname: string;
  surface: string;
};

type LoadSession = () => Promise<Session | null | undefined>;

function hasConfiguredAuthSecret(): boolean {
  return Boolean(
    (process.env.AUTH_SECRET && process.env.AUTH_SECRET.trim().length > 0) ||
      (process.env.NEXTAUTH_SECRET && process.env.NEXTAUTH_SECRET.trim().length > 0),
  );
}

/**
 * Public marketing routes should degrade to signed-out when Auth.js is unavailable.
 * This avoids turning a non-critical personalization check into a route-level 500.
 */
export async function getOptionalPublicSession(
  ctx: OptionalPublicSessionContext,
  loadSession?: LoadSession,
): Promise<Session | null> {
  if (!hasConfiguredAuthSecret()) {
    safeServerLog("auth", "optional_public_session_skipped", {
      surface: ctx.surface,
      pathname: ctx.pathname,
      reason: "missing_secret",
    });
    return null;
  }

  try {
    const readSession =
      loadSession ??
      (async () => {
        const { auth } = await import("@/lib/auth");
        return auth();
      });
    return (await readSession()) ?? null;
  } catch (error) {
    safeServerLog("auth", "optional_public_session_failed", {
      surface: ctx.surface,
      pathname: ctx.pathname,
      detail: (error instanceof Error ? error.message : String(error)).slice(0, 200),
    });
    return null;
  }
}
