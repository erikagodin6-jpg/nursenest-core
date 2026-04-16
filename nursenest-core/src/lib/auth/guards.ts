import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { adminRouteGateDecision } from "@/lib/auth/admin-path-policy";
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
  const session = await auth();
  const u = session?.user as { id?: string; email?: string | null } | undefined;
  if (!session?.user || (!u?.id && !u?.email)) {
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
  const session = await auth();
  const u = session?.user as { id?: string; email?: string | null } | undefined;
  /** Set by `src/proxy.ts` as `x-nn-admin-path` / `x-nn-request-pathname` for RBAC. */
  const path = await resolveAdminRequestPath();
  /** Unresolved path is `"/"` — do not send users to login with callback `/` (use `/admin`). */
  const callbackPath = path && path.length > 0 && path !== "/" ? path : "/admin";

  if (!session?.user || (!u?.id && !u?.email)) {
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
