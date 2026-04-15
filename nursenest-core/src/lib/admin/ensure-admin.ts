import { NextResponse } from "next/server";
import { logAdminApiGate } from "@/lib/admin/admin-audit-log";
import type { AdminSession } from "@/lib/admin/admin-types";
import { isPathAllowedForStaffTier } from "@/lib/auth/admin-path-policy";
import { resolveAdminRequestPath } from "@/lib/auth/resolve-admin-request-path";
import { getStaffSession } from "@/lib/auth/staff-session";

export type { AdminSession } from "@/lib/admin/admin-types";

export async function getAdminSession(): Promise<AdminSession | null> {
  const s = await getStaffSession();
  if (!s) return null;
  return { userId: s.userId, role: s.role, tier: s.tier };
}

export function forbidden(): NextResponse {
  return NextResponse.json({ error: "Forbidden" }, { status: 403 });
}

/**
 * Prefer the request URL for RBAC (always correct for Route Handlers). Falls back to
 * `x-nn-admin-path` / invoke headers from `src/proxy.ts` when `req` is omitted (rare).
 */
async function resolveAdminAuthPath(req?: Request): Promise<string> {
  if (req) {
    try {
      const pathname = new URL(req.url).pathname;
      if (
        pathname.startsWith("/api/admin") ||
        pathname.startsWith("/admin") ||
        pathname.startsWith("/api/debug")
      ) {
        return pathname.replace(/\/$/, "") || pathname;
      }
    } catch {
      /* ignore */
    }
  }
  return resolveAdminRequestPath();
}

function shouldAuditSuccessfulMutation(req?: Request): boolean {
  if (!req) return false;
  const m = req.method?.toUpperCase() ?? "";
  return m === "POST" || m === "PUT" || m === "PATCH" || m === "DELETE";
}

function shouldAuditSuccessfulRead(req?: Request): boolean {
  return process.env.NN_ADMIN_AUDIT_GET === "1" && !!req && req.method?.toUpperCase() === "GET";
}

/**
 * Admin API guard: DB-backed staff roles + path-based RBAC.
 * Always pass `req` from Route Handlers so path checks match the invoked route.
 */
export async function requireAdmin(req?: Request) {
  const path = await resolveAdminAuthPath(req);
  const staff = await getStaffSession();

  if (!staff) {
    logAdminApiGate({ req, path: path || "(unknown)", admin: null, result: "denied_no_session" });
    return { ok: false as const, response: forbidden() };
  }

  const admin: AdminSession = { userId: staff.userId, role: staff.role, tier: staff.tier };

  if (!isPathAllowedForStaffTier(staff.tier, path)) {
    logAdminApiGate({ req, path: path || "(unknown)", admin, result: "denied_rbac" });
    return {
      ok: false as const,
      response: NextResponse.json({ error: "Forbidden", code: "admin_rbac" }, { status: 403 }),
    };
  }

  if (shouldAuditSuccessfulMutation(req) || shouldAuditSuccessfulRead(req)) {
    logAdminApiGate({ req, path: path || "(unknown)", admin, result: "allowed" });
  }

  return {
    ok: true as const,
    admin,
  };
}
