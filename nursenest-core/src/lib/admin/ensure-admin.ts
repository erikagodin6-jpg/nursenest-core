import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { isPathAllowedForStaffTier } from "@/lib/auth/admin-path-policy";
import { getStaffSession, type StaffSession } from "@/lib/auth/staff-session";

export type AdminSession = {
  userId: string;
  role: string;
  tier: StaffSession["tier"];
};

export async function getAdminSession(): Promise<AdminSession | null> {
  const s = await getStaffSession();
  if (!s) return null;
  return { userId: s.userId, role: s.role, tier: s.tier };
}

export function forbidden(): NextResponse {
  return NextResponse.json({ error: "Forbidden" }, { status: 403 });
}

/**
 * Admin API guard: DB-backed staff roles + path-based RBAC.
 * Prefer passing `req` so the route path is always correct; otherwise uses `x-nn-admin-path` from `src/proxy.ts`.
 */
export async function requireAdmin(req?: Request) {
  const staff = await getStaffSession();
  if (!staff) return { ok: false as const, response: forbidden() };

  const path = req ? new URL(req.url).pathname : ((await headers()).get("x-nn-admin-path") ?? "");

  if (path && !isPathAllowedForStaffTier(staff.tier, path)) {
    return {
      ok: false as const,
      response: NextResponse.json({ error: "Forbidden", code: "admin_rbac" }, { status: 403 }),
    };
  }

  return {
    ok: true as const,
    admin: { userId: staff.userId, role: staff.role, tier: staff.tier },
  };
}
