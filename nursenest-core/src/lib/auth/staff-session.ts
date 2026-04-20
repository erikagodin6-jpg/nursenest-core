import "server-only";
import { cache } from "react";
import { UserRole } from "@prisma/client";
import type { Session } from "next-auth";
import { safeAwait } from "@/lib/async/safe-await";
import { AUTH_NODE_SESSION_READ_TIMEOUT_MS } from "@/lib/auth/auth-session-constants";
import { renderTrace } from "@/lib/observability/render-trace";
import { safeServerLog } from "@/lib/observability/safe-server-log";
import type { StaffTier } from "@/lib/auth/staff-roles";
import {
  getAuthSessionWithJwtCookieFallback,
  sessionHasUserIdentity,
} from "@/lib/auth/server-session-jwt-fallback";

export type StaffSession = {
  userId: string;
  role: UserRole;
  tier: StaffTier;
};

function adminAccessDebug(): boolean {
  return process.env.ADMIN_ACCESS_DEBUG === "1" || process.env.ADMIN_ACCESS_DEBUG === "true";
}

const STAFF_SESSION_ROLE_TIMEOUT_MS = 5500;

/**
 * Database is source of truth for staff role (JWT may lag after promotion).
 * Resolves `userId` from `session.user.id`, or from email when id is missing (legacy / partial JWT).
 */
async function loadStaffSession(): Promise<StaffSession | null> {
  renderTrace("staff session start", { route: "shared-root-layout" });
  let session: Session | null = null;
  try {
    const { auth } = await import("@/lib/auth");
    session = await safeAwait(
      auth() as Promise<Session | null>,
      "staff_session.auth",
      AUTH_NODE_SESSION_READ_TIMEOUT_MS,
    );
  } catch (error) {
    safeServerLog("auth", "staff_session_auth_failed", {
      detail: (error instanceof Error ? error.message : String(error)).slice(0, 200),
    });
    session = null;
  }
  if (!sessionHasUserIdentity(session)) {
    const fb = await getAuthSessionWithJwtCookieFallback();
    if (sessionHasUserIdentity(fb)) session = fb;
  }
  renderTrace("staff session after auth", {
    route: "shared-root-layout",
    hasSessionUser: Boolean(session?.user),
  });
  if (!session) {
    renderTrace("staff session fallback", { route: "shared-root-layout", reason: "auth_timeout_or_missing" });
    return null;
  }
  const su = session?.user as { id?: string; email?: string | null } | undefined;
  const userId = typeof su?.id === "string" && su.id.trim().length > 0 ? su.id.trim() : undefined;
  const emailRaw = typeof su?.email === "string" && su.email.trim().length > 0 ? su.email.trim() : null;

  /** Match `enforceAdminProxyRoute` / `loadUserRoleFromDbIdentity`: email-only sessions still resolve staff in DB. */
  if (!userId && !emailRaw) {
    renderTrace("staff session fallback", { route: "shared-root-layout", reason: "missing_identity" });
    if (adminAccessDebug()) {
      safeServerLog("admin_access", "staff_session_no_identity", {});
    }
    return null;
  }

  try {
    const { loadUserRoleFromDbIdentity } = await import("@/lib/auth/admin-role-source");
    const identity = { userId: userId ?? null, email: emailRaw };
    let row = await safeAwait(
      loadUserRoleFromDbIdentity(identity),
      "staff_session.role_lookup",
      STAFF_SESSION_ROLE_TIMEOUT_MS,
    );
    /** Cold DB / pool warm-up: first read can time out and yield `null` — one retry before caching null. */
    if (row == null && (userId || emailRaw)) {
      row = await safeAwait(
        loadUserRoleFromDbIdentity(identity),
        "staff_session.role_lookup_retry",
        STAFF_SESSION_ROLE_TIMEOUT_MS,
      );
    }
    renderTrace("staff session after role", {
      route: "shared-root-layout",
      hasRoleRow: Boolean(row),
      isAdmin: Boolean(row?.isAdmin),
    });
    if (!row?.isAdmin || !row.tier) {
      renderTrace("staff session fallback", { route: "shared-root-layout", reason: "not_staff_or_role_timeout" });
      if (adminAccessDebug()) {
        safeServerLog("admin_access", "staff_session_not_staff", {
          userIdPrefix: (userId ?? row?.userId ?? "").slice(0, 8),
          role: row?.role ?? "missing",
        });
      }
      return null;
    }
    if (adminAccessDebug()) {
      safeServerLog("admin_access", "staff_session_ok", {
        userIdPrefix: row.userId.slice(0, 8),
        role: row.role,
        tier: row.tier,
      });
    }
    return {
      userId: row.userId,
      role: row.role,
      tier: row.tier,
    };
  } catch {
    renderTrace("staff session fallback", { route: "shared-root-layout", reason: "role_lookup_error" });
    return null;
  }
}

/** One Prisma read per request when `requireAdmin` + admin pages both need staff tier. */
export const getStaffSession = cache(loadStaffSession);
