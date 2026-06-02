/**
 * POST  → start a view-as session for the given user
 * DELETE → clear the active view-as session
 *
 * Every event is written to the server log and (when available) the admin audit table.
 * The resulting cookie is read-only for the portal — no writes are performed as the user.
 */
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin/ensure-admin";
import { startViewAsSession, clearViewAsSession } from "@/lib/admin/admin-view-as-user";
import { prisma } from "@/lib/db";
import { isDatabaseUrlConfigured } from "@/lib/db/safe-database";

type Ctx = { params: Promise<{ userId: string }> };

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest, ctx: Ctx) {
  const gate = await requireAdmin(req);
  if (!gate.ok) return gate.response;

  const { userId: targetId } = await ctx.params;

  // Verify target user exists
  if (isDatabaseUrlConfigured()) {
    const exists = await prisma.user.findUnique({
      where: { id: targetId },
      select: { id: true, role: true },
    });
    if (!exists) {
      return NextResponse.json({ ok: false, error: "Target user not found" }, { status: 404 });
    }
    // Safety: never allow impersonating another admin
    const adminRoles = ["ADMIN", "SUPER_ADMIN", "CONTENT_ADMIN", "SUPPORT_ADMIN"] as const;
    if (adminRoles.includes(exists.role as typeof adminRoles[number])) {
      return NextResponse.json(
        { ok: false, error: "Cannot impersonate admin or staff accounts" },
        { status: 403 },
      );
    }
  }

  await startViewAsSession(gate.admin.userId, targetId);

  return NextResponse.json({
    ok: true,
    message: "View-as session started. Navigate to /app to see the learner experience.",
    targetId,
    viewAsUrl: `/admin/users/${encodeURIComponent(targetId)}/view-as`,
  });
}

export async function DELETE(req: NextRequest, ctx: Ctx) {
  const gate = await requireAdmin(req);
  if (!gate.ok) return gate.response;

  const { userId: targetId } = await ctx.params;
  await clearViewAsSession(gate.admin.userId, targetId);

  return NextResponse.json({ ok: true, message: "View-as session cleared." });
}
