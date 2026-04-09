import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin/ensure-admin";
import { loadAdminUserSupportDetail } from "@/lib/admin/load-admin-user-support-detail";

type RouteContext = { params: Promise<{ userId: string }> };

/**
 * Read-only support snapshot for a single user (admin).
 */
export async function GET(_req: Request, ctx: RouteContext) {
  const gate = await requireAdmin();
  if (!gate.ok) return gate.response;

  const { userId } = await ctx.params;
  const detail = await loadAdminUserSupportDetail(userId);
  if (!detail.found) {
    return NextResponse.json({ ok: false, error: "User not found" }, { status: 404 });
  }
  return NextResponse.json({ ok: true, detail });
}
