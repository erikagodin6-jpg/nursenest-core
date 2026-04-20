import { notFound, redirect } from "next/navigation";
import { adminRouteGateDecision } from "@/lib/auth/admin-path-policy";
import { getProtectedRouteSession } from "@/lib/auth/protected-route-session";
import { resolveAdminRequestPath } from "@/lib/auth/resolve-admin-request-path";
import { getStaffSession } from "@/lib/auth/staff-session";
import { safeServerLog } from "@/lib/observability/safe-server-log";

function loginRedirectWithCallback(path: string): string {
  const safe = path.startsWith("/") ? path : "/admin";
  return `/login?callbackUrl=${encodeURIComponent(safe)}`;
}

/**
 * Server-only session check. Unauthenticated `/app/*` and `/admin/*` requests are turned away in
 * `src/proxy.ts` Edge auth middleware (HTTP redirect) before RSC runs — do not use `redirect("/login")` here for missing
 * session: it interacted with Next.js 16 streaming and surfaced raw Flight payloads in the document.
 *
 * Must agree with `authorized()` in `src/lib/auth-middleware.ts`, which treats `id` **or** `email` as signed-in.
 */
export async function requireUser() {
  const session = await getProtectedRouteSession("auth.require_user");
  const u = session?.user as { id?: string; email?: string | null; sub?: string } | undefined;
  if (
    !session?.user ||
    !((typeof u?.id === "string" && u.id.trim()) ||
      (typeof u?.email === "string" && u.email.trim()) ||
      (typeof u?.sub === "string" && u.sub.trim()))
  ) {
    notFound();
  }
  return session;
}

/**
 * Admin UI: database is source of truth for staff role (JWT may lag after promotion/demotion).
 */
function adminAccessDebug(): boolean {
  return process.env.ADMIN_ACCESS_DEBUG === "1" || process.env.ADMIN_ACCESS_DEBUG === "true";
}

export async function requireAdmin() {
  /** Set by `src/proxy.ts` as `x-nn-admin-path` / `x-nn-request-pathname` for RBAC. */
  const path = await resolveAdminRequestPath().catch(() => "/admin");
  /** Unresolved path is `"/"` — do not send users to login with callback `/` (use `/admin`). */
  const callbackPath = path && path.length > 0 && path !== "/" ? path : "/admin";
  const session = await getProtectedRouteSession("auth.require_admin");
  const u = session?.user as { id?: string; email?: string | null; sub?: string } | undefined;

  if (
    !session?.user ||
    !((typeof u?.id === "string" && u.id.trim()) ||
      (typeof u?.email === "string" && u.email.trim()) ||
      (typeof u?.sub === "string" && u.sub.trim()))
  ) {
    if (adminAccessDebug()) {
      safeServerLog("admin_access", "requireAdmin_redirect_login", {
        path: callbackPath.length > 128 ? `${callbackPath.slice(0, 128)}…` : callbackPath,
      });
    }
    redirect(loginRedirectWithCallback(callbackPath));
  }

  const staff = await getStaffSession();
  const gate = adminRouteGateDecision(staff, path);
  if (adminAccessDebug()) {
    safeServerLog("admin_access", "requireAdmin_gate", {
      path: path || "(empty)",
      allow: gate.allow,
      redirectTo: gate.allow ? undefined : gate.redirectTo,
      staffTier: staff?.tier ?? undefined,
      userIdPrefix: u?.id ? u.id.slice(0, 8) : undefined,
    });
  }
  if (!gate.allow) {
    redirect(gate.redirectTo);
  }
  return session;
}
