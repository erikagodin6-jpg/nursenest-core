import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin/ensure-admin";
import { computeLearnerHealthScore } from "@/lib/admin/learner-health-score.server";

type Ctx = { params: Promise<{ userId: string }> };

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest, ctx: Ctx) {
  const gate = await requireAdmin(req);
  if (!gate.ok) return gate.response;

  const { userId } = await ctx.params;
  const score = await computeLearnerHealthScore(userId);
  if (!score) {
    return NextResponse.json({ ok: false, error: "Health score unavailable" }, { status: 404 });
  }
  return NextResponse.json({ ok: true, score }, {
    headers: { "cache-control": "private, max-age=120" },
  });
}
