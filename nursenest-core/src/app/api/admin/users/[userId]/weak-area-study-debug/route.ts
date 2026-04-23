import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin/ensure-admin";
import { prisma } from "@/lib/db";
import { accessScopeFromUserAccess, getUserAccess } from "@/lib/entitlements/get-user-access";
import { buildPersonalizedWeakAreaStudyPlanDebug } from "@/lib/learner/personalized-weak-area-study-plan";

type RouteContext = { params: Promise<{ userId: string }> };

/**
 * Staff-only: full weak-area study plan including raw topic scores (never expose on learner routes).
 */
export async function GET(req: NextRequest, ctx: RouteContext) {
  const gate = await requireAdmin(req);
  if (!gate.ok) return gate.response;

  const { userId } = await ctx.params;
  if (!userId?.trim()) {
    return NextResponse.json({ ok: false, error: "Missing user id" }, { status: 400 });
  }

  const user = await prisma.user.findUnique({
    where: { id: userId.trim() },
    select: { id: true, learnerPath: true },
  });
  if (!user) {
    return NextResponse.json({ ok: false, error: "User not found" }, { status: 404 });
  }

  let entitlement;
  try {
    const userAccess = await getUserAccess(user.id);
    entitlement = accessScopeFromUserAccess(userAccess);
  } catch {
    return NextResponse.json({ ok: false, error: "Unable to resolve entitlement for user." }, { status: 503 });
  }

  if (!entitlement.hasAccess) {
    return NextResponse.json({
      ok: true,
      plan: null,
      note: "No active subscriber entitlement for this user — weak-area engine skipped.",
    });
  }

  try {
    const plan = await buildPersonalizedWeakAreaStudyPlanDebug({
      userId: user.id,
      entitlement,
      learnerPath: user.learnerPath,
    });
    return NextResponse.json({ ok: true, plan });
  } catch {
    return NextResponse.json({ ok: false, error: "Unable to build debug study plan." }, { status: 503 });
  }
}
